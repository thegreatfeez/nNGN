import { type FC } from "react";
import { NavLink } from "react-router-dom";
import { useAddNgnToWallet } from "../../hooks/useAddTokenToWallet";

export const Navbar: FC = () => {
  const { addToken } = useAddNgnToWallet();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"}`;

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center text-emerald-400 font-bold text-lg tracking-tight">
            <img src="/nNGNlogo.png" alt="nNGN" className="w-15 h-15 rounded-full object-cover" />
            NairaStable
          </NavLink>
          <NavLink to="/dashboard" className={linkClass} end>Dashboard</NavLink>
          <NavLink to="/vault" className={linkClass}>Vault</NavLink>
          <NavLink to="/liquidate" className={linkClass}>Liquidate</NavLink>
          <a
            href="/docs/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Docs
          </a>
          {import.meta.env.VITE_NAIRA_DATA_URL && (
            <a
              href={import.meta.env.VITE_NAIRA_DATA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-emerald-400 hover:text-emerald-300 border border-emerald-400/30 rounded-lg px-3 py-1"
            >
              NairaData Portal →
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addToken}
            className="text-xs text-emerald-400 hover:text-emerald-300 hidden sm:block"
          >
            + Add nNGN
          </button>
          {/* AppKit connect button */}
          <appkit-button />
        </div>
      </div>
    </nav>
  );
};
