import { useState, useEffect } from "react";
import { scoreLiquidationOpportunities } from "../lib/groq";
import type { LiquidatableVault, PricePoint, ScoredVault } from "../types/scorer";
import { SCORER_POLL_INTERVAL_MS } from "../lib/constants";

export function useLiquidationScorer(
  vaults: LiquidatableVault[],
  priceHistory: PricePoint[]
): { scoredVaults: ScoredVault[]; isLoading: boolean; error: string | null } {
  const [scoredVaults, setScoredVaults] = useState<ScoredVault[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
if (vaults.length === 0) {
      setScoredVaults([]);
      return;
    }

    let cancelled = false;

    async function runScorer() {
      setIsLoading(true);
      setError(null);
      try {
        const results = await scoreLiquidationOpportunities(vaults, priceHistory);
        if (!cancelled) setScoredVaults(results);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Scorer unavailable");
          const fallback: ScoredVault[] = [...vaults]
            .sort((a, b) => a.healthFactor - b.healthFactor)
            .map((v) => ({
              vault: v,
              score: 0,
              confidence: "low" as const,
              rationale: "Scorer unavailable — sorted by risk",
            }));
          setScoredVaults(fallback);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    runScorer();
    const interval = setInterval(runScorer, SCORER_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [vaults.length, priceHistory.length]);

  return { scoredVaults, isLoading, error };
}
