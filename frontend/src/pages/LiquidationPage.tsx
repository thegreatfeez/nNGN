import { type FC, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useLiquidatableVaults } from "../hooks/useLiquidatableVaults";
import { useLiquidationScorer } from "../hooks/useLiquidationScorer";
import { useEthPriceHistory } from "../hooks/useEthPriceHistory";
import { LiquidationTable } from "../components/liquidation/LiquidationTable";
import { LiquidationModal } from "../components/liquidation/LiquidationModal";
import { BestOpportunityCard } from "../components/liquidation/BestOpportunityCard";
import type { LiquidatableVault } from "../types/scorer";
import { Spinner } from "../components/shared/Spinner";
import { Activity, Zap, Siren } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 22 },
  },
};

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

  const riskLevel =
    vaultCount === 0
      ? "safe"
      : vaultCount <= 2
      ? "warning"
      : "danger";

  const riskConfig = {
    safe: {
      label: "All vaults healthy",
      icon: <Activity size={14} className="text-teal-600 dark:text-teal-400" />,
      cls: "bg-teal-50 dark:bg-teal-500/10 border-teal-300 dark:border-teal-500/25 text-teal-700 dark:text-teal-400",
    },
    warning: {
      label: `${vaultCount} vault${vaultCount !== 1 ? "s" : ""} at risk`,
      icon: <Zap size={14} className="text-amber-600 dark:text-amber-400" />,
      cls: "bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/25 text-amber-700 dark:text-amber-400",
    },
    danger: {
      label: `${vaultCount} vaults at risk`,
      icon: <Siren size={14} className="text-red-600 dark:text-red-400" />,
      cls: "bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/25 text-red-700 dark:text-red-400",
    },
  }[riskLevel];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Page header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Liquidation
          </h1>
          <p className="text-slate-600 dark:text-neutral-400 text-sm mt-1 font-medium">
            Liquidate under-collateralised vaults and earn a 10% bonus.
          </p>
        </div>

        {!isLoading && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 220, damping: 22 }}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 shrink-0 font-semibold text-sm ${riskConfig.cls}`}
          >
            {riskConfig.icon}
            <span>{riskConfig.label}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Best opportunity */}
      <motion.div variants={itemVariants}>
        <BestOpportunityCard
          topVault={topVault}
          isLoading={isLoading || scorerLoading}
          onLiquidate={setSelected}
        />
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
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
      </motion.div>

      <LiquidationModal vault={selected} onClose={() => setSelected(null)} />
    </motion.div>
  );
};
