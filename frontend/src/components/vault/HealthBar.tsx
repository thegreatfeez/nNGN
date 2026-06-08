import { type FC } from "react";

interface HealthBarProps {
  hf: number | null;
}

export const HealthBar: FC<HealthBarProps> = ({ hf }) => {
  if (hf === null) return null;

  const capped = Math.min(hf, 3);
  const pct = (capped / 3) * 100;
  const liquidationMarkerPct = (1 / 3) * 100; // hf=1.0 on 0–3 scale

  const hfColor =
    hf < 1.0 ? "text-red-400" : hf < 1.25 ? "text-yellow-400" : "text-emerald-400";

  const fillColor =
    hf < 1.0 ? "bg-red-500" : hf < 1.25 ? "bg-yellow-500" : "bg-emerald-500";

  const displayHf = hf > 1e9 ? "∞" : hf.toFixed(2);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">Health Factor</span>
        <span
          className={`text-sm font-bold tabular-nums ${hfColor} ${hf < 1 ? "animate-pulse" : ""}`}
        >
          {displayHf}
        </span>
      </div>

      {/* Track + fill + liquidation marker */}
      <div className="relative h-2 w-full">
        <div className="absolute inset-0 rounded-full bg-slate-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${fillColor} ${hf < 1 ? "animate-pulse" : ""}`}
            style={{ width: `${Math.max(pct, 2)}%` }}
          />
        </div>
        {/* Pin at 1.00 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-red-400/80"
          style={{ left: `${liquidationMarkerPct}%` }}
        />
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-red-400/70">1.00 Liquidation</span>
        <span className="text-slate-500">Safe ↑</span>
      </div>
    </div>
  );
};
