import { type FC, useState } from "react";
import { useLiquidatableVaults } from "../hooks/useLiquidatableVaults";
import { useLiquidationScorer } from "../hooks/useLiquidationScorer";
import { useEthPriceHistory } from "../hooks/useEthPriceHistory";
import { LiquidationTable } from "../components/liquidation/LiquidationTable";
import { LiquidationModal } from "../components/liquidation/LiquidationModal";
import { BestOpportunityCard } from "../components/liquidation/BestOpportunityCard";
import type { LiquidatableVault } from "../types/scorer";
import { Spinner } from "../components/shared/Spinner";
import { AlertTriangle } from "lucide-react";

export const LiquidationPage: FC = () => {
  const { data: vaults, isLoading } = useLiquidatableVaults();
  const priceHistory = useEthPriceHistory();
  const { scoredVaults, isLoading: scorerLoading } = useLiquidationScorer(
    vaults ?? [],
    priceHistory
  );
  const [selected, setSelected] = useState<LiquidatableVault | null>(null);

  const vaultCount = vaults?.length ?? 0;
  const displayVaults = vaults ?? [];
  const topVault = scoredVaults[0] ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Liquidation</h1>
          <p className="text-slate-400 text-sm mt-1">
            Liquidate under-collateralized vaults and earn the 10% bonus.
          </p>
        </div>

        {!isLoading && vaultCount > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 shrink-0">
            <AlertTriangle size={14} className="text-red-400" />
            <span className="text-sm font-semibold text-red-400">
              {vaultCount} vault{vaultCount !== 1 ? "s" : ""} at risk
            </span>
          </div>
        )}
      </div>

      {/* Best Opportunity */}
      <BestOpportunityCard
        topVault={topVault}
        isLoading={isLoading || scorerLoading}
        onLiquidate={setSelected}
      />

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <LiquidationTable
          vaults={displayVaults}
          scoredVaults={scoredVaults}
          onSelect={setSelected}
        />
      )}

      <LiquidationModal vault={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
