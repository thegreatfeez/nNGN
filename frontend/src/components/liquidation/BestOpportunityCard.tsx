import { type FC } from "react";
import type { LiquidatableVault, ScoredVault } from "../../types/scorer";
import { ScoreBadge } from "../shared/ScoreBadge";
import { shortenAddress, formatNgn } from "../../lib/utils";
import { Trophy, Zap } from "lucide-react";

interface Props {
  topVault: ScoredVault | null;
  isLoading: boolean;
  onLiquidate: (vault: LiquidatableVault) => void;
}

function Shimmer() {
  return <div className="h-5 w-24 rounded bg-slate-700/60 animate-pulse" />;
}

export const BestOpportunityCard: FC<Props> = ({ topVault, isLoading, onLiquidate }) => {
  if (!isLoading && !topVault) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 text-center space-y-1">
        <p className="text-slate-300 font-medium">No liquidatable vaults right now</p>
        <p className="text-slate-500 text-sm">All vaults are healthy. Check back when ETH price drops.</p>
      </div>
    );
  }

  const sv = topVault;

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Trophy size={16} className="text-emerald-400" />
        <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
          Best Opportunity
        </span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {isLoading ? (
              <Shimmer />
            ) : sv ? (
              <ScoreBadge score={sv.score} confidence={sv.confidence} />
            ) : null}
            <span className="font-mono text-slate-400 text-sm truncate">
              {sv ? shortenAddress(sv.vault.owner) : "—"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
            <div>
              <p className="text-slate-500 text-xs">Debt</p>
              {isLoading ? <Shimmer /> : (
                <p className="font-semibold text-slate-200">
                  {sv ? formatNgn(sv.vault.debtNgn) : "—"}
                </p>
              )}
            </div>
            <div>
              <p className="text-slate-500 text-xs">Est. Profit</p>
              {isLoading ? <Shimmer /> : (
                <p className="font-semibold text-emerald-400">
                  {sv ? formatNgn(sv.vault.estimatedProfitNgn) : "—"}
                </p>
              )}
            </div>
            <div>
              <p className="text-slate-500 text-xs">Health Factor</p>
              {isLoading ? <Shimmer /> : (
                <p className="font-bold text-red-400">
                  {sv ? sv.vault.healthFactor.toFixed(3) : "—"}
                </p>
              )}
            </div>
            <div>
              <p className="text-slate-500 text-xs">Collateral Ratio</p>
              {isLoading ? <Shimmer /> : (
                <p className="font-semibold text-red-400">
                  {sv
                    ? sv.vault.crPercent === Infinity
                      ? "∞"
                      : `${sv.vault.crPercent.toFixed(1)}%`
                    : "—"}
                </p>
              )}
            </div>
          </div>

          {sv?.rationale && (
            <p className="text-slate-400 text-xs italic">"{sv.rationale}"</p>
          )}
        </div>

        <button
          onClick={() => sv && onLiquidate(sv.vault)}
          disabled={!sv || isLoading}
          className="flex items-center gap-2 shrink-0 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-3 text-sm font-bold text-slate-900 transition-colors"
        >
          <Zap size={14} />
          Liquidate Now
        </button>
      </div>
    </div>
  );
};
