import { type FC, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  children: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer select-none";

  const variants: Record<Variant, string> = {
    primary:
      "btn-gradient text-white disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-violet-300 shadow-sm disabled:opacity-40",
    outline:
      "bg-white border-2 border-violet-500 text-violet-600 hover:bg-violet-50 disabled:opacity-40",
    danger:
      "bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 disabled:opacity-40",
    ghost:
      "text-gray-500 hover:text-violet-600 hover:bg-violet-50 disabled:opacity-40",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
};
