// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {MockV3Aggregator} from "../test/mocks/MockV3Aggregator.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        address ethUsdFeed;
        address usdNgnFeed;
        address feeRecipient;
    }

    uint256 internal constant ANVIL_CHAIN_ID = 31337;

    uint8 internal constant FEED_DECIMALS = 8;
    int256 internal constant INITIAL_ETH_USD_PRICE = 2000e8;
    int256 internal constant INITIAL_USD_NGN_PRICE = 1600e8;

    NetworkConfig public activeConfig;

    constructor() {
        if (block.chainid == ANVIL_CHAIN_ID) {
            activeConfig = getAnvilConfig();
        } else {
            activeConfig = getArbitrumSepoliaConfig();
        }
    }

    function getAnvilConfig() internal returns (NetworkConfig memory anvilConfig) {
        vm.startBroadcast();
        MockV3Aggregator ethUsdFeed = new MockV3Aggregator(FEED_DECIMALS, INITIAL_ETH_USD_PRICE);
        MockV3Aggregator usdNgnFeed = new MockV3Aggregator(FEED_DECIMALS, INITIAL_USD_NGN_PRICE);
        vm.stopBroadcast();

        anvilConfig = NetworkConfig({
            ethUsdFeed: address(ethUsdFeed),
            usdNgnFeed: address(usdNgnFeed),
            feeRecipient: vm.envAddress("FEE_RECIPIENT")
        });
    }

    function getArbitrumSepoliaConfig() internal view returns (NetworkConfig memory sepoliaConfig) {
        sepoliaConfig = NetworkConfig({
            ethUsdFeed: vm.envAddress("ETH_USD_FEED"),
            usdNgnFeed: vm.envAddress("USD_NGN_FEED"),
            feeRecipient: vm.envAddress("FEE_RECIPIENT")
        });
    }

    function getActiveConfig() external view returns (NetworkConfig memory) {
        return activeConfig;
    }
}
