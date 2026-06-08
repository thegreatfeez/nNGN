// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {NSBaseTest} from "../helpers/NSBaseTest.sol";
import {MIN_COLLATERAL_RATIO, PRECISION} from "../../src/NSConstants.sol";

contract DepositMintFlowTest is NSBaseTest {
    uint256 internal constant ONE_ETH = 1 ether;

    function test_depositMintWithdrawFlow() public {
        uint256 mintAmount = _maxMintAtMinCr(ONE_ETH);

        _depositAndMint(user, ONE_ETH, mintAmount);

        (uint256 collateral, uint256 debt) = engine.vaults(user);
        assertEq(collateral, ONE_ETH);
        assertEq(debt, mintAmount);
        assertEq(engine.totalDebtNgn(), mintAmount);

        uint256 collateralValueNgn = (ONE_ETH * engine.getEthNgnPrice()) / PRECISION;
        uint256 ratio = (collateralValueNgn * PRECISION) / debt;
        assertGe(ratio, MIN_COLLATERAL_RATIO);
    }

    function test_userCanWithdrawCollateralAfterBurningDebt() public {
        uint256 mintAmount = 500_000e18;
        _depositAndMint(user, ONE_ETH, mintAmount);

        uint256 burnAmount = mintAmount;
        uint256 burnFee = (burnAmount * 3e15) / PRECISION;

        deal(address(nNGN), user, mintAmount);

        vm.startPrank(user);
        nNGN.approve(address(engine), burnFee);
        engine.burnNgn(burnAmount);
        engine.withdrawCollateral(ONE_ETH);
        vm.stopPrank();

        (uint256 collateral, uint256 debt) = engine.vaults(user);
        assertEq(collateral, 0);
        assertEq(debt, 0);
        assertEq(user.balance, ONE_ETH);
        assertEq(nNGN.balanceOf(user), 0);
    }
}
