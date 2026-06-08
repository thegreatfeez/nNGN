// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {NSEngine} from "../src/NSEngine.sol";

contract Deploy is Script {
    function run() external returns (NSEngine engine, address nNGN, HelperConfig config) {
        config = new HelperConfig();
        HelperConfig.NetworkConfig memory cfg = config.getActiveConfig();

        vm.startBroadcast();
        engine = new NSEngine(cfg.ethUsdFeed, cfg.usdNgnFeed, cfg.feeRecipient);
        vm.stopBroadcast();

        nNGN = address(engine.nNGN());

        console.log("NairaStable (nNGN) deployed at:", nNGN);
        console.log("NSEngine deployed at:", address(engine));
        console.log("ETH/USD feed:", cfg.ethUsdFeed);
        console.log("USD/NGN feed:", cfg.usdNgnFeed);
        console.log("Fee recipient:", cfg.feeRecipient);
    }
}
