// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library NSErrors {
    error ZeroAmount();
    error ZeroAddress();
    error InsufficientCollateral();
    error CollateralRatioTooLow(uint256 currentRatio, uint256 requiredRatio);
    error VaultHasOutstandingDebt();

    error VaultNotLiquidatable(address vaultOwner, uint256 healthFactor);
    error CannotSelfLiquidate();
    error DebtExceedsVaultDebt(uint256 requested, uint256 available);
    error InsufficientCollateralForLiquidation();

    error OracleStalePrice(address feed, uint256 updatedAt);
    error OracleInvalidPrice(address feed, int256 price);
    error OracleRoundNotComplete(address feed);
    error OracleStaleRound(address feed, uint80 roundId, uint80 answeredInRound);

    error EthTransferFailed();
}
