// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {NairaStable} from "./NairaStable.sol";
import {OracleLib} from "./libraries/OracleLib.sol";
import {MathLib} from "./libraries/MathLib.sol";
import {NSErrors} from "./NSErrors.sol";
import {NSEvents} from "./NSEvents.sol";
import {INSEngine} from "./interfaces/INSEngine.sol";
import {
    MIN_COLLATERAL_RATIO,
    LIQUIDATION_THRESHOLD,
    LIQUIDATION_BONUS,
    LIQUIDATION_FEE,
    MINT_FEE,
    BURN_FEE,
    PRECISION
} from "./NSConstants.sol";

contract NSEngine is ReentrancyGuard, INSEngine {
    using OracleLib for address;

    mapping(address => VaultState) public vaults;

    uint256 public totalCollateralWei;
    uint256 public totalDebtNgn;

    NairaStable public immutable nNGN;
    address public immutable feeRecipient;
    address public immutable ethUsdFeed;
    address public immutable usdNgnFeed;

    constructor(address _ethUsdFeed, address _usdNgnFeed, address _feeRecipient) {
        if (_ethUsdFeed == address(0) || _usdNgnFeed == address(0)) {
            revert NSErrors.ZeroAddress();
        }
        if (_feeRecipient == address(0)) revert NSErrors.ZeroAddress();

        nNGN = new NairaStable(address(this));
        ethUsdFeed = _ethUsdFeed;
        usdNgnFeed = _usdNgnFeed;
        feeRecipient = _feeRecipient;
    }

    function depositCollateral() external payable nonReentrant {
        if (msg.value == 0) revert NSErrors.ZeroAmount();

        vaults[msg.sender].collateralWei += msg.value;
        totalCollateralWei += msg.value;

        emit NSEvents.CollateralDeposited(msg.sender, msg.value);
    }

    function withdrawCollateral(uint256 amountWei) external nonReentrant {
        if (amountWei == 0) revert NSErrors.ZeroAmount();
        if (amountWei > vaults[msg.sender].collateralWei) revert NSErrors.InsufficientCollateral();

        VaultState memory userVault = vaults[msg.sender];
        if (userVault.debtNgn > 0) {
            uint256 newCollateral = userVault.collateralWei - amountWei;
            uint256 newCollateralValueNgn = (newCollateral * getEthNgnPrice()) / PRECISION;
            uint256 newRatio = (newCollateralValueNgn * PRECISION) / userVault.debtNgn;
            if (newRatio < MIN_COLLATERAL_RATIO) {
                revert NSErrors.CollateralRatioTooLow(newRatio, MIN_COLLATERAL_RATIO);
            }
        }

        vaults[msg.sender].collateralWei -= amountWei;
        totalCollateralWei -= amountWei;

        (bool ok,) = msg.sender.call{value: amountWei}("");
        if (!ok) revert NSErrors.EthTransferFailed();

        emit NSEvents.CollateralWithdrawn(msg.sender, amountWei);
    }

    function mintNgn(uint256 amountNgn) external nonReentrant {
        if (amountNgn == 0) revert NSErrors.ZeroAmount();

        VaultState memory userVault = vaults[msg.sender];
        uint256 newDebt = userVault.debtNgn + amountNgn;

        uint256 collateralValueNgn = (userVault.collateralWei * getEthNgnPrice()) / PRECISION;
        uint256 newRatio = (collateralValueNgn * PRECISION) / newDebt;
        if (newRatio < MIN_COLLATERAL_RATIO) {
            revert NSErrors.CollateralRatioTooLow(newRatio, MIN_COLLATERAL_RATIO);
        }

        uint256 fee = (amountNgn * MINT_FEE) / PRECISION;

        vaults[msg.sender].debtNgn = newDebt;
        totalDebtNgn += amountNgn;

        nNGN.mint(msg.sender, amountNgn - fee);
        nNGN.mint(feeRecipient, fee);

        emit NSEvents.NgnMinted(msg.sender, amountNgn, fee);
    }

    function burnNgn(uint256 amountNgn) external nonReentrant {
        if (amountNgn == 0) revert NSErrors.ZeroAmount();
        if (amountNgn > vaults[msg.sender].debtNgn) {
            revert NSErrors.DebtExceedsVaultDebt(amountNgn, vaults[msg.sender].debtNgn);
        }

        uint256 fee = (amountNgn * BURN_FEE) / PRECISION;

        vaults[msg.sender].debtNgn -= amountNgn;
        totalDebtNgn -= amountNgn;

        bool transferred = nNGN.transferFrom(msg.sender, feeRecipient, fee);
        if (!transferred) revert NSErrors.EthTransferFailed();
        nNGN.burn(msg.sender, amountNgn - fee);

        emit NSEvents.NgnBurned(msg.sender, amountNgn, fee);
    }

    function liquidate(address vaultOwner, uint256 debtToCover) external nonReentrant {
        if (msg.sender == vaultOwner) revert NSErrors.CannotSelfLiquidate();
        if (vaultOwner == address(0)) revert NSErrors.ZeroAddress();
        if (debtToCover == 0) revert NSErrors.ZeroAmount();

        uint256 healthFactor = getHealthFactor(vaultOwner);
        if (healthFactor >= PRECISION) {
            revert NSErrors.VaultNotLiquidatable(vaultOwner, healthFactor);
        }

        uint256 debtAmount = MathLib.min(debtToCover, vaults[vaultOwner].debtNgn);

        uint256 ethNgnPrice = getEthNgnPrice();
        uint256 debtValueEth = (debtAmount * PRECISION) / ethNgnPrice;
        uint256 bonusEth = (debtValueEth * LIQUIDATION_BONUS) / PRECISION;
        uint256 totalSeizedEth = debtValueEth + bonusEth;
        uint256 protocolFeeEth = (totalSeizedEth * LIQUIDATION_FEE) / PRECISION;
        uint256 liquidatorEth = totalSeizedEth - protocolFeeEth;

        if (totalSeizedEth > vaults[vaultOwner].collateralWei) {
            revert NSErrors.InsufficientCollateralForLiquidation();
        }

        vaults[vaultOwner].collateralWei -= totalSeizedEth;
        vaults[vaultOwner].debtNgn -= debtAmount;
        totalCollateralWei -= totalSeizedEth;
        totalDebtNgn -= debtAmount;

        nNGN.burn(msg.sender, debtAmount);

        (bool ok1,) = msg.sender.call{value: liquidatorEth}("");
        (bool ok2,) = feeRecipient.call{value: protocolFeeEth}("");
        if (!ok1 || !ok2) revert NSErrors.EthTransferFailed();

        emit NSEvents.LiquidationExecuted(
            msg.sender, vaultOwner, debtAmount, totalSeizedEth, liquidatorEth, protocolFeeEth
        );
    }

    function getHealthFactor(address user) public view returns (uint256) {
        VaultState memory userVault = vaults[user];
        if (userVault.debtNgn == 0) return type(uint256).max;

        uint256 collateralValueNgn = (userVault.collateralWei * getEthNgnPrice()) / PRECISION;
        return (collateralValueNgn * LIQUIDATION_THRESHOLD) / userVault.debtNgn;
    }

    function getEthNgnPrice() public view returns (uint256 priceInNgn) {
        priceInNgn = OracleLib.getEthNgnPrice(ethUsdFeed, usdNgnFeed);
    }

    function getVault(address user) external view returns (VaultState memory) {
        return vaults[user];
    }

    receive() external payable {}
}
