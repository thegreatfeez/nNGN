import { type FC } from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };

export const Spinner: FC<SpinnerProps> = ({ size = "md", className = "" }) => (
  <div
    className={`${sizes[size]} ${className} animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400`}
  />
);
