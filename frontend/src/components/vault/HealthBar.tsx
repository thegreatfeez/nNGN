import { type FC } from "react";

interface HealthBarProps {
  hf: number | null;
}

export const HealthBar: FC<HealthBarProps> = ({ hf }) => {
  if (hf === null) return null;

  const capped = Math.min(hf, 3);
  const pct = (capped / 3) * 100;
  const liquidationMarkerPct = (1 / 3) * 100;

  const hfColor =
    hf < 1.0
      ? "text-red-600 dark:text-red-400"
      : hf < 1.25
      ? "text-amber-600 dark:text-amber-400"
      : "text-teal-600 dark:text-teal-400";

  const fillColor =
    hf < 1.0
      ? "bg-red-500"
      : hf < 1.25
      ? "bg-amber-500"
      : "bg-teal-500";

  const displayHf = hf > 1e9 ? "∞" : hf.toFixed(2);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
          Health Factor
        </span>
        <span
          className={`text-sm font-extrabold tabular-nums ${hfColor} ${
            hf < 1 ? "animate-pulse" : ""
          }`}
        >
          {displayHf}
        </span>
      </div>

      {/* Track */}
      <div className="relative h-2 w-full">
        <div className="absolute inset-0 rounded-full bg-slate-200 dark:bg-neutral-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${fillColor} ${
              hf < 1 ? "animate-pulse" : ""
            }`}
            style={{ width: `${Math.max(pct, 2)}%` }}
          />
        </div>
        {/* Liquidation pin */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-red-400/80"
          style={{ left: `${liquidationMarkerPct}%` }}
        />
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-red-500/70 dark:text-red-400/70 font-medium">
          1.00 Liquidation
        </span>
        <span className="text-slate-400 dark:text-neutral-500">Safe ↑</span>
      </div>
    </div>
  );
};
