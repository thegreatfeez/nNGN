import { useState, useEffect, useRef, useMemo } from "react";
import { fetchMarketInsight, type MarketInsight } from "../lib/groqMarket";
import { useEthNgnPrice } from "./useEthNgnPrice";
import { useEthPriceHistory } from "./useEthPriceHistory";
import { weiToEth, nngnBaseToDisplay } from "../lib/utils";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

interface VaultInput {
  collateralWei: bigint;
  debtNgn: bigint;
}

export function useMarketInsight(vault?: VaultInput | null) {
  const { data: ethNgn } = useEthNgnPrice();
  const priceHistory = useEthPriceHistory();
  const [insight, setInsight] = useState<MarketInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchAt = useRef(0);

  const vaultCtx = useMemo(() => {
    if (!vault || vault.debtNgn === 0n || !ethNgn) return null;
    const collateralEth = weiToEth(vault.collateralWei);
    const collateralNgn = collateralEth * ethNgn;
    const debtNgn = nngnBaseToDisplay(vault.debtNgn);
    const crPercent = debtNgn > 0 ? (collateralNgn / debtNgn) * 100 : Infinity;
    const healthFactor = crPercent / 150;
    return { collateralEth, debtNgn, crPercent, healthFactor };
  }, [vault?.collateralWei, vault?.debtNgn, ethNgn]);

  useEffect(() => {
    if (ethNgn == null) return;
    const now = Date.now();
    if (now - lastFetchAt.current < REFRESH_INTERVAL_MS) return;
    lastFetchAt.current = now;

    const trendPct =
      priceHistory.length >= 2
        ? ((priceHistory[priceHistory.length - 1].price - priceHistory[0].price) /
            priceHistory[0].price) *
          100
        : 0;

    setIsLoading(true);
    setError(null);
    fetchMarketInsight(ethNgn, trendPct, vaultCtx)
      .then(setInsight)
      .catch((err) => setError(err instanceof Error ? err.message : "Insight unavailable"))
      .finally(() => setIsLoading(false));
  }, [ethNgn, priceHistory.length, vaultCtx]);

  return { insight, isLoading, error };
}
