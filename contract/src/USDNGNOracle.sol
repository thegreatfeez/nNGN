// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title USDNGNOracle
 * @notice Trusted price reporter for USD/NGN on Arbitrum Sepolia.
 *         Implements AggregatorV3Interface so NSEngine can swap this address
 *         for a Chainlink/Pyth feed the moment one goes live on Arbitrum mainnet — no
 *         contract changes needed, just an address update in the deploy config.
 *
 * @dev Price format: NGN per 1 USD, 8 decimal places.
 *      Example: 1 USD = 1,600 NGN → answer = 160000000000 (1600 × 1e8)
 *      The keeper script pushes a fresh rate every 30 minutes via setPrice().
 *
 * Security properties:
 *   - Deviation guard: rejects single updates that move price more than 10%
 *   - Staleness revert: latestRoundData() reverts if price is older than 2 hours
 *   - Role separation: updater, guardian (pause), and admin are independent roles
 *   - Emergency pause: guardian halts new updates; admin unpauses
 */
contract USDNGNOracle is AccessControl, Pausable {
    bytes32 public constant PRICE_UPDATER_ROLE = keccak256("PRICE_UPDATER_ROLE");
    bytes32 public constant GUARDIAN_ROLE      = keccak256("GUARDIAN_ROLE");

    uint8   public constant DECIMALS           = 8;
    uint256 public constant STALENESS_THRESHOLD = 2 hours;
    uint256 public constant MAX_DEVIATION_BPS  = 1000; // 10%

    int256  private _latestAnswer;
    uint256 private _updatedAt;
    uint80  private _roundId;

    event PriceUpdated(uint80 indexed roundId, int256 answer, uint256 updatedAt);
    event DeviationRejected(int256 proposed, int256 current, uint256 deviationBps);

    error StalePrice(uint256 updatedAt, uint256 threshold);
    error DeviationTooHigh(uint256 deviationBps, uint256 maxBps);
    error InvalidPrice();

    constructor(int256 initialPrice, address admin, address updater, address guardian) {
        if (initialPrice <= 0) revert InvalidPrice();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PRICE_UPDATER_ROLE, updater);
        _grantRole(GUARDIAN_ROLE,      guardian);

        _latestAnswer = initialPrice;
        _updatedAt    = block.timestamp;
        _roundId      = 1;

        emit PriceUpdated(1, initialPrice, block.timestamp);
    }

    /**
     * @notice Push a new USD/NGN price on-chain. Only callable by the keeper wallet.
     * @param newPrice NGN per 1 USD with 8 decimals (e.g. 1600 NGN/USD → 160000000000)
     */
    function setPrice(int256 newPrice) external onlyRole(PRICE_UPDATER_ROLE) whenNotPaused {
        if (newPrice <= 0) revert InvalidPrice();

        // Only apply the deviation guard while the price is still fresh.
        // If the oracle has gone stale (keeper was down) we allow any update to resume.
        if (block.timestamp - _updatedAt <= STALENESS_THRESHOLD) {
            uint256 deviation = _deviationBps(_latestAnswer, newPrice);
            if (deviation > MAX_DEVIATION_BPS) {
                emit DeviationRejected(newPrice, _latestAnswer, deviation);
                revert DeviationTooHigh(deviation, MAX_DEVIATION_BPS);
            }
        }

        unchecked { _roundId++; }
        _latestAnswer = newPrice;
        _updatedAt    = block.timestamp;

        emit PriceUpdated(_roundId, newPrice, block.timestamp);
    }

    function pause()   external onlyRole(GUARDIAN_ROLE)      { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE)  { _unpause(); }

    // ── AggregatorV3Interface ─────────────────────────────────────────────────

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        if (block.timestamp - _updatedAt > STALENESS_THRESHOLD) {
            revert StalePrice(_updatedAt, STALENESS_THRESHOLD);
        }
        return (_roundId, _latestAnswer, _updatedAt, _updatedAt, _roundId);
    }

    function decimals()    external pure returns (uint8)         { return DECIMALS; }
    function description() external pure returns (string memory) { return "USD / NGN"; }
    function version()     external pure returns (uint256)       { return 1; }

    // ── Helpers ───────────────────────────────────────────────────────────────

    function isStale()       external view returns (bool)    { return block.timestamp - _updatedAt > STALENESS_THRESHOLD; }
    function lastUpdatedAt() external view returns (uint256) { return _updatedAt; }

    function _deviationBps(int256 current, int256 proposed) internal pure returns (uint256) {
        if (current == 0) return 0;
        int256 delta = proposed - current;
        if (delta < 0) delta = -delta;
        return (uint256(delta) * 10_000) / uint256(current);
    }
}
