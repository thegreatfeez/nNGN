export const MIN_COLLATERAL_RATIO = 200n * 10n ** 16n;
export const LIQUIDATION_THRESHOLD = 150n * 10n ** 16n;
export const LIQUIDATION_BONUS = 10n * 10n ** 16n;
export const LIQUIDATION_FEE = 2n * 10n ** 16n;
export const MINT_FEE = 5n * 10n ** 15n;
export const BURN_FEE = 3n * 10n ** 15n;
export const PRECISION = 10n ** 18n;

export const ETH_DECIMALS = 18;
export const NNGN_DECIMALS = 18;

export const SCORER_POLL_INTERVAL_MS = 15_000;
export const SCORER_PRICE_HISTORY_POINTS = 5;

export const ENGINE_ADDRESS = import.meta.env.VITE_ENGINE_ADDRESS as `0x${string}`;
export const NNGN_ADDRESS = import.meta.env.VITE_NNGN_ADDRESS as `0x${string}`;
export const ARB_CHAIN_ID = Number(import.meta.env.VITE_ARB_CHAIN_ID ?? 421614);
