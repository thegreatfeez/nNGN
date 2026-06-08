// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {USDNGNOracle} from "../src/USDNGNOracle.sol";

contract DeployOracle is Script {
    function run() external {
        int256  initialPrice = int256(vm.envUint("INITIAL_NGN_RATE"));
        address admin        = vm.envAddress("YOUR_ADDRESS");

        vm.startBroadcast();
        USDNGNOracle oracle = new USDNGNOracle(initialPrice, admin, admin, admin);
        vm.stopBroadcast();

        console.log("USDNGNOracle deployed at:", address(oracle));
        console.log("Set USD_NGN_FEED=%s in .env", address(oracle));
    }
}
