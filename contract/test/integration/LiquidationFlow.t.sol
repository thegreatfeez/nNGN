// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {NSBaseTest} from "../helpers/NSBaseTest.sol";
import {PRECISION} from "../../src/NSConstants.sol";

contract LiquidationFlowTest is NSBaseTest {
    uint256 internal constant ONE_ETH = 1 ether;

    function test_liquidationSucceeds_whenCrFallsBelowThreshold() public {
        uint256 mintAmount = _maxMintAtMinCr(ONE_ETH);
        _depositAndMint(user, ONE_ETH, mintAmount);

        ethUsdFeed.updateAnswer(500e8);

        assertLt(engine.getHealthFactor(user), PRECISION);

        uint256 debtToCover = 400_000e18;
        deal(address(nNGN), liquidator, debtToCover);
        vm.startPrank(liquidator);
        nNGN.approve(address(engine), debtToCover);

        uint256 liquidatorEthBefore = liquidator.balance;
        uint256 feeRecipientEthBefore = feeRecipient.balance;

        engine.liquidate(user, debtToCover);
        vm.stopPrank();

        (uint256 collateral, uint256 debt) = engine.vaults(user);
        assertEq(debt, mintAmount - debtToCover);
        assertLt(collateral, ONE_ETH);
        assertGt(liquidator.balance, liquidatorEthBefore);
        assertGt(feeRecipient.balance, feeRecipientEthBefore);
    }

    function test_liquidate_revertsWhenPriceStillHealthy() public {
        _depositAndMint(user, ONE_ETH, 500_000e18);

        deal(address(nNGN), liquidator, 500_000e18);
        vm.startPrank(liquidator);
        nNGN.approve(address(engine), 500_000e18);
        vm.expectRevert();
        engine.liquidate(user, 500_000e18);
        vm.stopPrank();
    }
}
