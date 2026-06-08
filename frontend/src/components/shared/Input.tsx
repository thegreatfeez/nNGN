import { type FC, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  unit?: string;
  onMax?: () => void;
  error?: string;
}

export const Input: FC<InputProps> = ({ label, unit, onMax, error, className = "", ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-slate-400">{label}</label>}
    <div className="relative flex items-center">
      <input
        type="number"
        min="0"
        step="any"
        className={`w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 pr-20 ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      />
      <div className="absolute right-2 flex items-center gap-2">
        {unit && <span className="text-xs text-slate-400">{unit}</span>}
        {onMax && (
          <button
            type="button"
            onClick={onMax}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Max
          </button>
        )}
      </div>
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);
