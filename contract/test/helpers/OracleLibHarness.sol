// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {OracleLib} from "../../src/libraries/OracleLib.sol";

contract OracleLibHarness {
    function staleCheckLatestRoundData(address feedAddress) external view returns (uint256) {
        return OracleLib.staleCheckLatestRoundData(feedAddress);
    }

    function getEthNgnPrice(address ethUsdFeed, address usdNgnFeed) external view returns (uint256) {
        return OracleLib.getEthNgnPrice(ethUsdFeed, usdNgnFeed);
    }
}
