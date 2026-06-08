import { formatUnits, parseUnits } from "viem";
import { LIQUIDATION_THRESHOLD } from "./constants";

export function weiToEth(wei: bigint): number {
  return Number(formatUnits(wei, 18));
}

export function ethToWei(eth: number): bigint {
  return parseUnits(eth.toFixed(18), 18);
}

export function nngnBaseToDisplay(base: bigint): number {
  return Number(formatUnits(base, 18));
}

export function displayToNngnBase(display: number): bigint {
  return parseUnits(display.toFixed(18), 18);
}

export function formatNgn(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatEth(wei: bigint, decimals = 4): string {
  return `${weiToEth(wei).toFixed(decimals)} ETH`;
}

export function formatHF(healthFactor: bigint): string {
  const hf = Number(healthFactor) / 1e18;
  return hf > 1e9 ? "∞" : hf.toFixed(2);
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function parseContractError(err: unknown): string {
  if (!(err instanceof Error)) return "Transaction failed. Please try again.";
  const msg = err.message;

  if (msg.includes("User rejected") || msg.includes("user rejected") || msg.includes("4001"))
    return "Transaction cancelled.";
  if (msg.includes("CollateralRatioTooLow"))
    return "Collateral ratio would fall below 200%. Reduce the amount or deposit more ETH first.";
  if (msg.includes("InsufficientCollateral"))
    return "Amount exceeds your deposited collateral.";
  if (msg.includes("DebtExceedsVaultDebt"))
    return "Amount exceeds your outstanding debt.";
  if (msg.includes("ZeroAmount"))
    return "Amount must be greater than zero.";
  if (msg.includes("VaultNotLiquidatable"))
    return "This vault is not eligible for liquidation — health factor is above 1.0.";
  if (msg.includes("CannotSelfLiquidate"))
    return "You cannot liquidate your own vault.";
  if (msg.includes("EthTransferFailed"))
    return "ETH transfer failed. Please try again.";
  if (msg.includes("StalePrice") || msg.includes("OracleStalePrice"))
    return "Price oracle is stale. The keeper needs to push a fresh price — run: cd keeper && node keeper.js";
  if (msg.includes("OracleInvalidPrice") || msg.includes("InvalidPrice"))
    return "Oracle returned an invalid price. Try again in a moment.";
  if (msg.includes("OracleRoundNotComplete") || msg.includes("OracleStaleRound"))
    return "Oracle round is not yet complete. Try again in a few seconds.";
  if (msg.includes("execution reverted"))
    return "Transaction reverted — the oracle may be stale or your amount exceeds the allowed limit.";

  return "Transaction failed. Check your inputs and try again.";
}

export function computeHealthFactor(
  collateralWei: bigint,
  debtNgn: bigint,
  ethNgnPrice: bigint
): number {
  if (debtNgn === 0n) return Infinity;
  const collateralNgn = (collateralWei * ethNgnPrice) / 10n ** 18n;
  const hfScaled = (collateralNgn * LIQUIDATION_THRESHOLD) / debtNgn;
  return Number(hfScaled) / 1e18;
}
