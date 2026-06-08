// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {NSBaseTest} from "../helpers/NSBaseTest.sol";
import {NSErrors} from "../../src/NSErrors.sol";
import {MIN_COLLATERAL_RATIO, MINT_FEE, BURN_FEE, PRECISION} from "../../src/NSConstants.sol";

contract NSEngineTest is NSBaseTest {
    uint256 internal constant ONE_ETH = 1 ether;

    function test_depositCollateral_updatesVault() public {
        vm.deal(user, ONE_ETH);
        vm.prank(user);
        engine.depositCollateral{value: ONE_ETH}();

        (uint256 collateral, uint256 debt) = engine.vaults(user);
        assertEq(collateral, ONE_ETH);
        assertEq(debt, 0);
        assertEq(engine.totalCollateralWei(), ONE_ETH);
    }

    function test_depositCollateral_revertsOnZeroAmount() public {
        vm.prank(user);
        vm.expectRevert(NSErrors.ZeroAmount.selector);
        engine.depositCollateral{value: 0}();
    }

    function test_mintNgn_revertsWhenCollateralRatioTooLow() public {
        vm.deal(user, ONE_ETH);
        vm.prank(user);
        engine.depositCollateral{value: ONE_ETH}();

        uint256 maxMint = _maxMintAtMinCr(ONE_ETH);
        vm.prank(user);
        vm.expectRevert(
            abi.encodeWithSelector(
                NSErrors.CollateralRatioTooLow.selector, uint256(1_999_999_999_999_999_999), MIN_COLLATERAL_RATIO
            )
        );
        engine.mintNgn(maxMint + 1);
    }

    function test_mintNgn_chargesFee() public {
        uint256 mintAmount = 1_000_000e18;
        _depositAndMint(user, ONE_ETH, mintAmount);

        uint256 fee = (mintAmount * MINT_FEE) / PRECISION;
        assertEq(nNGN.balanceOf(user), mintAmount - fee);
        assertEq(nNGN.balanceOf(feeRecipient), fee);
    }

    function test_burnNgn_reducesDebt() public {
        uint256 mintAmount = 500_000e18;
        _depositAndMint(user, ONE_ETH, mintAmount);

        uint256 burnAmount = 100_000e18;
        uint256 fee = (burnAmount * BURN_FEE) / PRECISION;
        uint256 feeRecipientBefore = nNGN.balanceOf(feeRecipient);

        vm.startPrank(user);
        nNGN.approve(address(engine), fee);
        engine.burnNgn(burnAmount);
        vm.stopPrank();

        (, uint256 debt) = engine.vaults(user);
        assertEq(debt, mintAmount - burnAmount);
        assertEq(nNGN.balanceOf(feeRecipient), feeRecipientBefore + fee);
    }

    function test_withdrawCollateral_revertsWhenRatioTooLow() public {
        uint256 mintAmount = _maxMintAtMinCr(ONE_ETH);
        _depositAndMint(user, ONE_ETH, mintAmount);

        vm.prank(user);
        vm.expectRevert(
            abi.encodeWithSelector(
                NSErrors.CollateralRatioTooLow.selector, uint256(1_800_000_000_000_000_000), MIN_COLLATERAL_RATIO
            )
        );
        engine.withdrawCollateral(0.1 ether);
    }

    function test_getHealthFactor_returnsMaxWhenNoDebt() public view {
        assertEq(engine.getHealthFactor(user), type(uint256).max);
    }

    function test_liquidate_revertsWhenHealthy() public {
        _depositAndMint(user, ONE_ETH, 500_000e18);

        vm.prank(liquidator);
        vm.expectRevert(
            abi.encodeWithSelector(
                NSErrors.VaultNotLiquidatable.selector, user, uint256(9_600_000_000_000_000_000)
            )
        );
        engine.liquidate(user, 1);
    }

    function test_liquidate_revertsOnSelfLiquidation() public {
        vm.prank(user);
        vm.expectRevert(NSErrors.CannotSelfLiquidate.selector);
        engine.liquidate(user, 1);
    }
}
