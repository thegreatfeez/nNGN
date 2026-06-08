// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface INSEngine {
    struct VaultState {
        uint256 collateralWei;
        uint256 debtNgn;
    }

    function depositCollateral() external payable;
    function withdrawCollateral(uint256 amountWei) external;
    function mintNgn(uint256 amountNgn) external;
    function burnNgn(uint256 amountNgn) external;
    function liquidate(address vaultOwner, uint256 debtToCover) external;
    function getHealthFactor(address user) external view returns (uint256);
    function getEthNgnPrice() external view returns (uint256);
    function getVault(address user) external view returns (VaultState memory);
}
