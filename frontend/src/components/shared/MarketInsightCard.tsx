import { type FC } from "react";
import { TrendingUp, TrendingDown, Minus, Sparkles, RefreshCw, ShieldCheck, AlertTriangle, Skull } from "lucide-react";
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
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    dot: "bg-emerald-400",
  },
  neutral: {
    icon: Minus,
    label: "Neutral",
    color: "text-slate-400",
    border: "border-slate-600/40",
    bg: "bg-slate-800/60",
    dot: "bg-slate-400",
  },
  bearish: {
    icon: TrendingDown,
    label: "Bearish",
    color: "text-red-400",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    dot: "bg-red-400",
  },
};

const vaultStatusConfig = {
  safe: {
    icon: ShieldCheck,
    label: "Your vault is SAFE",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  at_risk: {
    icon: AlertTriangle,
    label: "Your vault is AT RISK",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    dot: "bg-yellow-400",
  },
  liquidatable: {
    icon: Skull,
    label: "Your vault is LIQUIDATABLE",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    dot: "bg-red-400",
  },
};

function Shimmer({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-slate-700/60 animate-pulse ${className}`} />;
}

export const MarketInsightCard: FC<Props> = ({ insight, isLoading, error }) => {
  const cfg = sentimentConfig[insight?.sentiment ?? "neutral"];
  const SentimentIcon = cfg.icon;
  const vaultCfg = insight?.vaultStatus ? vaultStatusConfig[insight.vaultStatus] : null;

  const updatedLabel = insight
    ? new Date(insight.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className={`rounded-2xl border p-5 space-y-3 ${cfg.border} ${cfg.bg}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-sm font-semibold text-slate-300">AI Market Insight</span>
        </div>
        <div className="flex items-center gap-2">
          {insight && (
            <div className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              <SentimentIcon size={11} />
              {cfg.label}
            </div>
          )}
          {updatedLabel && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <RefreshCw size={10} />
              {updatedLabel}
            </span>
          )}
        </div>
      </div>

      {/* Vault status banner */}
      {vaultCfg && insight?.vaultStatus && (
        <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${vaultCfg.bg} ${vaultCfg.border}`}>
          <vaultCfg.icon size={16} className={`${vaultCfg.color} shrink-0 mt-0.5`} />
          <div className="space-y-0.5">
            <p className={`text-sm font-bold ${vaultCfg.color}`}>{vaultCfg.label}</p>
            {insight.vaultAdvice && (
              <p className="text-xs text-slate-300">{insight.vaultAdvice}</p>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {error ? (
        <p className="text-slate-500 text-sm italic">Market insight unavailable — {error}</p>
      ) : isLoading && !insight ? (
        <div className="space-y-2">
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-5/6" />
          <Shimmer className="h-3 w-4/5" />
        </div>
      ) : insight ? (
        <div className="space-y-2.5">
          <p className="text-sm font-medium text-slate-200">{insight.summary}</p>
          <ul className="space-y-1.5">
            {insight.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${cfg.dot}`} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
