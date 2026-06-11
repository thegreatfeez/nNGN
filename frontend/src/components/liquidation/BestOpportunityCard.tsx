import { type FC } from "react";
import { motion } from "framer-motion";
import type { LiquidatableVault, ScoredVault } from "../../types/scorer";
import { ScoreBadge } from "../shared/ScoreBadge";
import { shortenAddress, formatNgn } from "../../lib/utils";
import { Star, Zap, ShieldCheck } from "lucide-react";

interface Props {
  topVault: ScoredVault | null;
  isLoading: boolean;
  onLiquidate: (vault: LiquidatableVault) => void;
}

function Shimmer() {
  return <div className="h-5 w-24 rounded-lg skeleton" />;
}

export const BestOpportunityCard: FC<Props> = ({
  topVault,
  isLoading,
  onLiquidate,
}) => {
  if (!isLoading && !topVault) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-6 text-center space-y-2"
      >
        <ShieldCheck
          size={24}
          className="mx-auto text-teal-500 dark:text-teal-400 mb-1"
        />
        <p className="text-slate-700 dark:text-slate-300 font-semibold">
          No liquidatable vaults right now
        </p>
        <p className="text-slate-500 dark:text-neutral-500 text-sm">
          All vaults are healthy. Check back when ETH price drops.
        </p>
      </motion.div>
    );
  }

  const sv = topVault;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      className="rounded-2xl border border-teal-300 dark:border-teal-500/30 bg-gradient-to-br from-teal-50 to-cyan-50/60 dark:from-teal-500/5 dark:to-cyan-500/5 p-6 space-y-4 shadow-sm"
    >
      {/* Title */}
      <div className="flex items-center gap-2">
        <Star size={16} className="text-teal-600 dark:text-teal-400" />
        <span className="text-sm font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
          Best Opportunity
        </span>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-4 flex-1 min-w-0">
          {/* Owner row */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <Shimmer />
            ) : sv ? (
              <ScoreBadge score={sv.score} confidence={sv.confidence} />
            ) : null}
            <span className="font-mono text-slate-700 dark:text-neutral-300 text-sm font-bold truncate">
              {sv ? shortenAddress(sv.vault.owner) : "—"}
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatItem
              label="Debt"
              value={sv ? formatNgn(sv.vault.debtNgn) : "—"}
              valueClass="text-slate-900 dark:text-slate-100 font-extrabold"
              isLoading={isLoading}
            />
            <StatItem
              label="Est. Profit"
              value={sv ? formatNgn(sv.vault.estimatedProfitNgn) : "—"}
              valueClass="text-teal-700 dark:text-teal-400 font-extrabold"
              isLoading={isLoading}
            />
            <StatItem
              label="Health Factor"
              value={sv ? sv.vault.healthFactor.toFixed(3) : "—"}
              valueClass="text-red-700 dark:text-red-400 font-extrabold"
              isLoading={isLoading}
            />
            <StatItem
              label="Collateral Ratio"
              value={
                sv
                  ? sv.vault.crPercent === Infinity
                    ? "∞"
                    : `${sv.vault.crPercent.toFixed(1)}%`
                  : "—"
              }
              valueClass="text-red-700 dark:text-red-400 font-bold"
              isLoading={isLoading}
            />
          </div>

          {sv?.rationale && (
            <p className="text-slate-600 dark:text-neutral-500 text-xs italic font-medium">
              "{sv.rationale}"
            </p>
          )}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => sv && onLiquidate(sv.vault)}
          disabled={!sv || isLoading}
          className="flex items-center gap-2 shrink-0 rounded-xl bg-primary dark:bg-teal-500 hover:bg-primary-hover dark:hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-3 text-sm font-bold text-white dark:text-slate-900 transition-all duration-200 shadow-sm"
        >
          <Zap size={14} />
          Liquidate Now
        </motion.button>
      </div>
    </motion.div>
  );
};

const StatItem: FC<{
  label: string;
  value: string;
  valueClass: string;
  isLoading: boolean;
}> = ({ label, value, valueClass, isLoading }) => (
  <div>
    <p className="text-xs text-slate-600 dark:text-neutral-500 font-bold mb-1 uppercase tracking-tight">
      {label}
    </p>
    {isLoading ? <Shimmer /> : <p className={`text-sm ${valueClass}`}>{value}</p>}
  </div>
);
