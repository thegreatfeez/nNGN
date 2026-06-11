import { type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BrainCircuit,
  History,
  ShieldHalf,
  Zap,
  Siren,
} from "lucide-react";
import type { MarketInsight } from "../../lib/groqMarket";

interface Props {
  insight: MarketInsight | null;
  isLoading: boolean;
  error: string | null;
}

const sentimentConfig = {
  bullish: {
    icon: TrendingUp,
    label: "Bullish",
    color: "text-teal-600 dark:text-teal-400",
    border: "border-teal-300 dark:border-teal-500/25",
    bg: "bg-teal-50 dark:bg-teal-500/5",
    dot: "bg-teal-500",
  },
  neutral: {
    icon: Minus,
    label: "Neutral",
    color: "text-slate-600 dark:text-neutral-400",
    border: "border-slate-300 dark:border-neutral-700/60",
    bg: "bg-slate-100 dark:bg-neutral-900/60",
    dot: "bg-slate-500 dark:bg-neutral-500",
  },
  bearish: {
    icon: TrendingDown,
    label: "Bearish",
    color: "text-red-700 dark:text-red-400",
    border: "border-red-300 dark:border-red-500/25",
    bg: "bg-red-50 dark:bg-red-500/5",
    dot: "bg-red-500",
  },
};

const vaultStatusConfig = {
  safe: {
    icon: ShieldHalf,
    label: "Your vault is SAFE",
    color: "text-teal-700 dark:text-teal-400",
    bg: "bg-teal-100/70 dark:bg-teal-500/10",
    border: "border-teal-300 dark:border-teal-500/30",
    advisory: "text-teal-700 dark:text-teal-300/80",
  },
  at_risk: {
    icon: Zap,
    label: "Your vault is AT RISK",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-100/70 dark:bg-amber-500/10",
    border: "border-amber-300 dark:border-amber-500/30",
    advisory: "text-amber-700 dark:text-amber-300/80",
  },
  liquidatable: {
    icon: Siren,
    label: "Your vault is LIQUIDATABLE",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-100/70 dark:bg-red-500/10",
    border: "border-red-300 dark:border-red-500/30",
    advisory: "text-red-700 dark:text-red-300/80",
  },
};

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg skeleton ${className}`}
      style={{ height: "1rem" }}
    />
  );
}

export const MarketInsightCard: FC<Props> = ({ insight, isLoading, error }) => {
  const cfg = sentimentConfig[insight?.sentiment ?? "neutral"];
  const SentimentIcon = cfg.icon;
  const vaultCfg = insight?.vaultStatus
    ? vaultStatusConfig[insight.vaultStatus]
    : null;

  const updatedLabel = insight
    ? new Date(insight.updatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-2xl border-2 p-5 space-y-4 shadow-sm ${cfg.border} ${cfg.bg}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <BrainCircuit size={14} className="text-violet-600 dark:text-violet-400" />
          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
            AI Market Insight
          </span>
        </div>
        <div className="flex items-center gap-3">
          {insight && (
            <div
              className={`flex items-center gap-1.5 text-xs font-bold ${cfg.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              <SentimentIcon size={11} />
              {cfg.label}
            </div>
          )}
          {updatedLabel && (
            <span className="text-xs text-slate-500 dark:text-neutral-600 flex items-center gap-1 font-medium">
              <History size={10} />
              {updatedLabel}
            </span>
          )}
        </div>
      </div>

      {/* Vault status banner */}
      <AnimatePresence>
        {vaultCfg && insight?.vaultStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${vaultCfg.bg} ${vaultCfg.border}`}
          >
            <vaultCfg.icon
              size={16}
              className={`${vaultCfg.color} shrink-0 mt-0.5`}
            />
            <div className="space-y-0.5">
              <p className={`text-sm font-bold ${vaultCfg.color}`}>
                {vaultCfg.label}
              </p>
              {insight.vaultAdvice && (
                <p className={`text-xs ${vaultCfg.advisory}`}>
                  {insight.vaultAdvice}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {error ? (
        <p className="text-slate-600 dark:text-neutral-500 text-sm italic font-medium">
          Market insight unavailable — {error}
        </p>
      ) : isLoading && !insight ? (
        <div className="space-y-2.5">
          <Shimmer className="w-3/4" />
          <Shimmer className="w-full" />
          <Shimmer className="w-5/6" />
          <Shimmer className="w-4/5" />
        </div>
      ) : insight ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
            {insight.summary}
          </p>
          <ul className="space-y-1.5">
            {insight.bullets.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-700 dark:text-neutral-400 font-medium"
              >
                <span
                  className={`mt-2 w-1 h-1 rounded-full shrink-0 ${cfg.dot}`}
                />
                {b}
              </li>
            ))}
          </ul>
        </motion.div>
      ) : null}
    </motion.div>
  );
};
