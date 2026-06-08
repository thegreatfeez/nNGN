// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library NSEvents {
    event CollateralDeposited(address indexed user, uint256 amountWei);
    event CollateralWithdrawn(address indexed user, uint256 amountWei);
    event NgnMinted(address indexed user, uint256 amountNgn, uint256 feeNgn);
    event NgnBurned(address indexed user, uint256 amountNgn, uint256 feeNgn);
    event LiquidationExecuted(
        address indexed liquidator,
        address indexed vaultOwner,
        uint256 debtCoveredNgn,
        uint256 totalSeizedEth,
        uint256 liquidatorEth,
        uint256 protocolFeeEth
    );
}
