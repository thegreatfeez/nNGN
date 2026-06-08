// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {OracleLibHarness} from "../helpers/OracleLibHarness.sol";
import {MockV3Aggregator} from "../mocks/MockV3Aggregator.sol";
import {NSErrors} from "../../src/NSErrors.sol";
import {ORACLE_TIMEOUT, PRECISION} from "../../src/NSConstants.sol";

contract OracleLibTest is Test {
    OracleLibHarness internal harness;
    MockV3Aggregator internal ethUsdFeed;
    MockV3Aggregator internal usdNgnFeed;

    uint8 internal constant FEED_DECIMALS = 8;

    function setUp() public {
        harness = new OracleLibHarness();
        ethUsdFeed = new MockV3Aggregator(FEED_DECIMALS, 2000e8);
        usdNgnFeed = new MockV3Aggregator(FEED_DECIMALS, 1600e8);
    }

    function test_getEthNgnPrice_composesFeeds() public view {
        uint256 ethNgn = harness.getEthNgnPrice(address(ethUsdFeed), address(usdNgnFeed));
        assertEq(ethNgn, 3_200_000e18);
    }

    function test_staleCheck_revertsOnStalePrice() public {
        vm.warp(block.timestamp + ORACLE_TIMEOUT + 1);

        vm.expectRevert(
            abi.encodeWithSelector(NSErrors.OracleStalePrice.selector, address(ethUsdFeed), uint256(1))
        );
        harness.staleCheckLatestRoundData(address(ethUsdFeed));
    }

    function test_staleCheck_revertsOnInvalidPrice() public {
        ethUsdFeed.updateAnswer(-1);

        vm.expectRevert(
            abi.encodeWithSelector(NSErrors.OracleInvalidPrice.selector, address(ethUsdFeed), int256(-1))
        );
        harness.staleCheckLatestRoundData(address(ethUsdFeed));
    }

    function test_staleCheck_normalizesTo18Decimals() public view {
        uint256 price = harness.staleCheckLatestRoundData(address(ethUsdFeed));
        assertEq(price, 2000e18);
        assertEq(price / PRECISION, 2000);
    }
}
