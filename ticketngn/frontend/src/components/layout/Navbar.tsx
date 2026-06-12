import { Link, NavLink } from "react-router-dom";
import { Ticket } from "lucide-react";
import { useAccount } from "wagmi";
import { useNgnBalance } from "../../hooks/useNgnBalance";
import { ngnBalanceDisplay } from "../../lib/nngn";

export function Navbar() {
  const { address, isConnected } = useAccount();
  const balance = useNgnBalance(address);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm shadow-violet-500/5">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl btn-gradient flex items-center justify-center">
            <Ticket size={15} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight">
            Ticket<span className="gradient-text">NGN</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          {[
            { to: "/", label: "Events", end: true },
            { to: "/my-tickets", label: "My Tickets", end: false },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-violet-50 text-violet-700"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isConnected && balance !== null && (
            <div className="hidden sm:flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
              {ngnBalanceDisplay(balance)} nNGN
            </div>
          )}
          <appkit-button size="sm" />
        </div>
      </div>
    </header>
  );
}
