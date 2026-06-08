import { type FC } from "react";
import type { HealthStatus } from "../../hooks/useHealthFactor";

interface BadgeProps {
  status: HealthStatus;
}

const config: Record<HealthStatus, { label: string; className: string }> = {
  Safe: { label: "Safe", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  "At Risk": { label: "At Risk", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  Liquidatable: { label: "Liquidatable", className: "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse" },
};

export const Badge: FC<BadgeProps> = ({ status }) => {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
};
