// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {NSEngine} from "../src/NSEngine.sol";
import {MockV3Aggregator} from "../test/mocks/MockV3Aggregator.sol";
import {PRECISION} from "../src/NSConstants.sol";

/// @notice Post-deploy helpers for local anvil testing.
/// @dev Set ENGINE_ADDRESS in .env after `make deploy-anvil`.
contract Interactions is Script {
    function readPrices() external view {
        NSEngine engine = NSEngine(payable(vm.envAddress("ENGINE_ADDRESS")));

        address ethUsd = engine.ethUsdFeed();
        address usdNgn = engine.usdNgnFeed();
        uint256 ethNgn = engine.getEthNgnPrice();

        (, int256 ethUsdRaw,,,) = MockV3Aggregator(ethUsd).latestRoundData();
        (, int256 usdNgnRaw,,,) = MockV3Aggregator(usdNgn).latestRoundData();

        console.log("ENGINE_ADDRESS", vm.envAddress("ENGINE_ADDRESS"));
        console.log("ETH/USD feed", ethUsd);
        console.log("USD/NGN feed", usdNgn);
        console.log("ETH/USD (8dp raw)", ethUsdRaw);
        console.log("USD/NGN (8dp raw)", usdNgnRaw);
        console.log("ETH/NGN (1e18 scaled)", ethNgn);
        console.log("ETH/NGN human ~", ethNgn / PRECISION);
    }

  /// @notice Update mock ETH/USD and print new composed price (anvil mocks only).
    function bumpEthPrice(int256 newEthUsd8dp) external {
        NSEngine engine = NSEngine(payable(vm.envAddress("ENGINE_ADDRESS")));
        address ethUsd = engine.ethUsdFeed();

        vm.startBroadcast();
        MockV3Aggregator(ethUsd).updateAnswer(newEthUsd8dp);
        vm.stopBroadcast();

        console.log("Updated ETH/USD to (8dp)", newEthUsd8dp);
        console.log("New ETH/NGN (1e18 scaled)", engine.getEthNgnPrice());
        console.log("New ETH/NGN human ~", engine.getEthNgnPrice() / PRECISION);
    }
}
