import { type FC } from "react";
import type { HealthStatus } from "../../hooks/useHealthFactor";

interface BadgeProps {
  status: HealthStatus;
}

const config: Record<HealthStatus, { label: string; className: string }> = {
  Safe: {
    label: "Safe",
    className:
      "bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-500/30",
  },
  "At Risk": {
    label: "At Risk",
    className:
      "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30",
  },
  Liquidatable: {
    label: "Liquidatable",
    className:
      "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30 animate-pulse",
  },
};

export const Badge: FC<BadgeProps> = ({ status }) => {
  const { label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
};
