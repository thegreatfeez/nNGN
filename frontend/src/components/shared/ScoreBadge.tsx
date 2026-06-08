import { type FC } from "react";

interface ScoreBadgeProps {
  score: number;
  confidence: "low" | "medium" | "high";
}

const dotColor = { low: "bg-red-400", medium: "bg-yellow-400", high: "bg-green-400" };

export const ScoreBadge: FC<ScoreBadgeProps> = ({ score, confidence }) => {
  const isEmpty = score === 0 && confidence === "low";
  const bgClass =
    score >= 70 ? "bg-green-600" : score >= 40 ? "bg-yellow-600" : "bg-red-600";

  return (
    <div
      title={`Confidence: ${confidence}`}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${bgClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor[confidence]}`} />
      {isEmpty ? "—" : score}
    </div>
  );
};
