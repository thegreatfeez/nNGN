// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {NSEngine} from "../../src/NSEngine.sol";
import {NairaStable} from "../../src/NairaStable.sol";
import {MockV3Aggregator} from "../mocks/MockV3Aggregator.sol";
import {MIN_COLLATERAL_RATIO, PRECISION} from "../../src/NSConstants.sol";

abstract contract NSBaseTest is Test {
    uint8 internal constant FEED_DECIMALS = 8;
    int256 internal constant ETH_USD = 2000e8;
    int256 internal constant USD_NGN = 1600e8;

    NSEngine internal engine;
    NairaStable internal nNGN;
    MockV3Aggregator internal ethUsdFeed;
    MockV3Aggregator internal usdNgnFeed;

    address internal feeRecipient = makeAddr("feeRecipient");
    address internal user = makeAddr("user");
    address internal liquidator = makeAddr("liquidator");

    function setUp() public virtual {
        ethUsdFeed = new MockV3Aggregator(FEED_DECIMALS, ETH_USD);
        usdNgnFeed = new MockV3Aggregator(FEED_DECIMALS, USD_NGN);
        engine = new NSEngine(address(ethUsdFeed), address(usdNgnFeed), feeRecipient);
        nNGN = engine.nNGN();
    }

    function _maxMintAtMinCr(uint256 collateralWei) internal view returns (uint256) {
        uint256 collateralValueNgn = (collateralWei * engine.getEthNgnPrice()) / PRECISION;
        return (collateralValueNgn * PRECISION) / MIN_COLLATERAL_RATIO;
    }

    function _depositAndMint(address who, uint256 ethAmount, uint256 mintAmount) internal {
        vm.deal(who, ethAmount);
        vm.prank(who);
        engine.depositCollateral{value: ethAmount}();
        vm.prank(who);
        engine.mintNgn(mintAmount);
    }
}
