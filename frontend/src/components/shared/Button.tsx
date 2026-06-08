import { type FC, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary:
    "bg-emerald-500 hover:bg-emerald-400 text-white disabled:bg-emerald-800 disabled:text-emerald-600",
  secondary:
    "bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:bg-slate-800 disabled:text-slate-600",
  danger:
    "bg-red-600 hover:bg-red-500 text-white disabled:bg-red-900 disabled:text-red-700",
};

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors duration-150 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
  >
    {loading && <Spinner size="sm" />}
    {children}
  </button>
);
