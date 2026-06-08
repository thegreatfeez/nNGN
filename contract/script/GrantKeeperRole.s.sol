// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {USDNGNOracle} from "../src/USDNGNOracle.sol";

/// @notice Grants PRICE_UPDATER_ROLE to a keeper wallet.
/// Run with the ADMIN private key (the deployer key used during DeployOracle).
///
/// Usage:
///   KEEPER_WALLET=0x208cD7... \
///   ORACLE_ADDRESS=0x2187E8... \
///   forge script script/GrantKeeperRole.s.sol --rpc-url $ARB_RPC_URL --broadcast
contract GrantKeeperRole is Script {
    function run() external {
        address oracle  = vm.envAddress("ORACLE_ADDRESS");
        address keeper  = vm.envAddress("KEEPER_WALLET");

        vm.startBroadcast();
        USDNGNOracle(oracle).grantRole(
            keccak256("PRICE_UPDATER_ROLE"),
            keeper
        );
        vm.stopBroadcast();

        console.log("Granted PRICE_UPDATER_ROLE to:", keeper);
    }
}
