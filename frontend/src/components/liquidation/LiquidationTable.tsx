import { type FC, type ReactNode } from "react";
import type { LiquidatableVault } from "../../types/scorer";
import type { ScoredVault } from "../../types/scorer";
import { ScoreBadge } from "../shared/ScoreBadge";
import { shortenAddress, formatNgn } from "../../lib/utils";

interface Props {
  vaults: LiquidatableVault[];
  scoredVaults?: ScoredVault[];
  onSelect: (vault: LiquidatableVault) => void;
}

function crColor(crPercent: number | typeof Infinity): string {
  if (!isFinite(crPercent)) return "text-emerald-400";
  if (crPercent >= 200) return "text-emerald-400";
  if (crPercent >= 150) return "text-yellow-400";
  return "text-red-400";
}

function hfColor(hf: number): string {
  if (hf < 1.0) return "text-red-400";
  if (hf < 1.1) return "text-yellow-400";
  return "text-slate-300";
}

export const LiquidationTable: FC<Props> = ({ vaults, scoredVaults = [], onSelect }) => {
  const scoreMap = new Map(scoredVaults.map((sv) => [sv.vault.owner.toLowerCase(), sv]));

  const sorted = [...vaults].sort((a, b) => {
    const sa = scoreMap.get(a.owner.toLowerCase())?.score ?? 0;
    const sb = scoreMap.get(b.owner.toLowerCase())?.score ?? 0;
    return sb - sa;
  });

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-12 text-center space-y-2">
        <p className="text-slate-300 font-medium">No liquidatable vaults</p>
        <p className="text-slate-500 text-sm">All vaults are currently healthy. Check back when ETH price drops.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800/90 border-b border-slate-700">
            {(
              [
                "Score",
                "Owner",
                <span key="debt" className="flex items-center gap-1.5">
                  <img src="/nNGNlogo.png" alt="" className="w-10 h-6 rounded-full" />
                  Debt (nNGN)
                </span>,
                "CR %",
                "Health Factor",
                "Est. Profit",
                "",
              ] as ReactNode[]
            ).map((h, i) => (
              <th
                key={i}
                className="px-4 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/40">
          {sorted.map((v) => {
            const sv = scoreMap.get(v.owner.toLowerCase());
            return (
              <tr
                key={v.owner}
                className="bg-slate-800/40 hover:bg-slate-700/50 transition-colors cursor-pointer group"
                onClick={() => onSelect(v)}
              >
                <td className="px-4 py-3.5">
                  <ScoreBadge
                    score={sv?.score ?? 0}
                    confidence={sv?.confidence ?? "low"}
                  />
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-300">
                  {shortenAddress(v.owner)}
                </td>
                <td className="px-4 py-3.5 font-semibold text-slate-200">
                  {formatNgn(v.debtNgn)}
                </td>
                <td className={`px-4 py-3.5 font-semibold tabular-nums ${crColor(v.crPercent)}`}>
                  {v.crPercent === Infinity ? "∞" : `${v.crPercent.toFixed(1)}%`}
                </td>
                <td className={`px-4 py-3.5 font-bold tabular-nums ${hfColor(v.healthFactor)}`}>
                  {v.healthFactor.toFixed(3)}
                </td>
                <td className="px-4 py-3.5 font-semibold text-emerald-400">
                  {formatNgn(v.estimatedProfitNgn)}
                </td>
                <td className="px-4 py-3.5">
                  <button className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-3 py-1.5 transition-colors">
                    Liquidate
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
