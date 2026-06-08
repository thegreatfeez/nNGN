// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

uint256 constant MIN_COLLATERAL_RATIO = 200e16;
uint256 constant LIQUIDATION_THRESHOLD = 150e16;

uint256 constant LIQUIDATION_BONUS = 10e16;
uint256 constant LIQUIDATION_FEE = 2e16;
uint256 constant MINT_FEE = 5e15;
uint256 constant BURN_FEE = 3e15;

uint256 constant PRECISION = 1e18;
uint256 constant FEED_PRECISION = 1e8;

uint256 constant ORACLE_TIMEOUT = 3 hours;
