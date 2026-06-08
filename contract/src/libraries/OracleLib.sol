// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "../interfaces/AggregatorV3Interface.sol";
import {ORACLE_TIMEOUT, FEED_PRECISION, PRECISION} from "../NSConstants.sol";
import {NSErrors} from "../NSErrors.sol";

library OracleLib {
    function staleCheckLatestRoundData(address feedAddress) internal view returns (uint256 price) {
        AggregatorV3Interface feed = AggregatorV3Interface(feedAddress);
        (uint80 roundId, int256 answer,, uint256 updatedAt, uint80 answeredInRound) =
            feed.latestRoundData();

        if (updatedAt == 0) {
            revert NSErrors.OracleRoundNotComplete(feedAddress);
        }
        if (answeredInRound < roundId) {
            revert NSErrors.OracleStaleRound(feedAddress, roundId, answeredInRound);
        }
        if (block.timestamp - updatedAt > ORACLE_TIMEOUT) {
            revert NSErrors.OracleStalePrice(feedAddress, updatedAt);
        }
        if (answer <= 0) {
            revert NSErrors.OracleInvalidPrice(feedAddress, answer);
        }

        price = uint256(answer) * (PRECISION / FEED_PRECISION);
    }

    function getEthNgnPrice(address ethUsdFeed, address usdNgnFeed)
        internal
        view
        returns (uint256 ethNgnPrice)
    {
        uint256 ethUsdPrice = staleCheckLatestRoundData(ethUsdFeed);
        uint256 usdNgnPrice = staleCheckLatestRoundData(usdNgnFeed);
        ethNgnPrice = (ethUsdPrice * usdNgnPrice) / PRECISION;
    }
}
