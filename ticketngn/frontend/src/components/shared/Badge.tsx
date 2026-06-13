import { type FC, type ReactNode } from "react";

type Variant = "violet" | "green" | "red" | "amber" | "slate" | "blue";

const variants: Record<Variant, string> = {
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  red:    "bg-rose-50 text-rose-600 border-rose-200",
  amber:  "bg-amber-50 text-amber-700 border-amber-200",
  slate:  "bg-gray-100 text-gray-500 border-gray-200",
  blue:   "bg-blue-50 text-blue-600 border-blue-200",
};

export const Badge: FC<{ variant?: Variant; children: ReactNode }> = ({
  variant = "slate",
  children,
}) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}
  >
    {children}
  </span>
);
