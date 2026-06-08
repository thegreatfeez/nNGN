import { useEffect, useState } from "react";
import { useEthNgnPrice } from "./useEthNgnPrice";
import type { PricePoint } from "../types/scorer";
import { SCORER_PRICE_HISTORY_POINTS } from "../lib/constants";

export function useEthPriceHistory(): PricePoint[] {
  const { data: currentPrice } = useEthNgnPrice();
  const [history, setHistory] = useState<PricePoint[]>([]);

  useEffect(() => {
    if (currentPrice == null) return;
    setHistory((prev) =>
      [
        ...prev,
        { price: currentPrice, timestamp: Math.floor(Date.now() / 1000) },
      ].slice(-SCORER_PRICE_HISTORY_POINTS)
    );
  }, [currentPrice]);

  return history;
}
