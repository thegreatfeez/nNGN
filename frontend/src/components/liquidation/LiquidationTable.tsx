import { type FC, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import type { LiquidatableVault } from "../../types/scorer";
import type { ScoredVault } from "../../types/scorer";
import { ScoreBadge } from "../shared/ScoreBadge";
import { shortenAddress, formatNgn } from "../../lib/utils";
import { CheckCircle2 } from "lucide-react";

interface Props {
  vaults: LiquidatableVault[];
  scoredVaults?: ScoredVault[];
  onSelect: (vault: LiquidatableVault) => void;
}

function crColor(crPercent: number | typeof Infinity): string {
  if (!isFinite(crPercent)) return "text-teal-600 dark:text-teal-400";
  if (crPercent >= 200) return "text-teal-600 dark:text-teal-400";
  if (crPercent >= 150) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function hfColor(hf: number): string {
  if (hf < 1.0) return "text-red-600 dark:text-red-400";
  if (hf < 1.1) return "text-amber-600 dark:text-amber-400";
  return "text-slate-600 dark:text-slate-300";
}

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 24, delay: i * 0.04 },
  }),
};

export const LiquidationTable: FC<Props> = ({
  vaults,
  scoredVaults = [],
  onSelect,
}) => {
  const scoreMap = new Map(
    scoredVaults.map((sv) => [sv.vault.owner.toLowerCase(), sv])
  );

  const sorted = [...vaults].sort((a, b) => {
    const sa = scoreMap.get(a.owner.toLowerCase())?.score ?? 0;
    const sb = scoreMap.get(b.owner.toLowerCase())?.score ?? 0;
    return sb - sa;
  });

  if (sorted.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-12 text-center space-y-3"
      >
        <div className="mx-auto w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-500/10 flex items-center justify-center">
          <CheckCircle2 size={22} className="text-teal-600 dark:text-teal-400" />
        </div>
        <p className="text-slate-700 dark:text-slate-300 font-semibold">
          No liquidatable vaults
        </p>
        <p className="text-slate-500 dark:text-neutral-500 text-sm">
          All vaults are currently healthy. Check back when ETH price drops.
        </p>
      </motion.div>
    );
  }

  const HEADERS: ReactNode[] = [
    "Score",
    "Owner",
    <span key="debt" className="flex items-center gap-1.5">
      <img src="/nNGNlogo.png" alt="" className="w-5 h-5 rounded-full object-cover" />
      Debt (nNGN)
    </span>,
    "CR %",
    "Health Factor",
    "Est. Profit",
    "",
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-transparent">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100 dark:bg-neutral-900/80 border-b border-slate-200 dark:border-neutral-800">
            {HEADERS.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 dark:text-neutral-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/60">
          {sorted.map((v, i) => {
            const sv = scoreMap.get(v.owner.toLowerCase());
            return (
              <motion.tr
                key={v.owner}
                custom={i}
                variants={rowVariants}
                initial="hidden"
                animate="show"
                className="bg-white dark:bg-neutral-900/40 hover:bg-teal-50 dark:hover:bg-teal-500/5 transition-colors cursor-pointer group"
                onClick={() => onSelect(v)}
              >
                <td className="px-4 py-4">
                  <ScoreBadge
                    score={sv?.score ?? 0}
                    confidence={sv?.confidence ?? "low"}
                  />
                </td>
                <td className="px-4 py-4 font-mono text-slate-600 dark:text-neutral-400 text-xs">
                  {shortenAddress(v.owner)}
                </td>
                <td className="px-4 py-4 font-bold text-slate-900 dark:text-slate-100">
                  {formatNgn(v.debtNgn)}
                </td>
                <td
                  className={`px-4 py-4 font-semibold tabular-nums ${crColor(v.crPercent)}`}
                >
                  {v.crPercent === Infinity ? "∞" : `${v.crPercent.toFixed(1)}%`}
                </td>
                <td
                  className={`px-4 py-4 font-bold tabular-nums ${hfColor(v.healthFactor)}`}
                >
                  {v.healthFactor.toFixed(3)}
                </td>
                <td className="px-4 py-4 font-semibold text-teal-600 dark:text-teal-400">
                  {formatNgn(v.estimatedProfitNgn)}
                </td>
                <td className="px-4 py-4">
                  <button className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 bg-teal-100 dark:bg-teal-500/10 hover:bg-teal-200 dark:hover:bg-teal-500/20 border border-teal-300 dark:border-teal-500/30 rounded-lg px-3 py-1.5 transition-all duration-200">
                    Liquidate
                  </button>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
