import { type FC, useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Bell } from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";
import { WalletWidget } from "./WalletWidget";

export const DashboardLayout: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07070f] text-slate-900 dark:text-slate-100">
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Desktop layout ── */}
      <motion.div
        animate={{ marginLeft: sidebarWidth }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="hidden lg:block min-h-screen"
      >
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 bg-white dark:bg-[#0a0a10] border-b border-slate-200 dark:border-neutral-800 shadow-sm dark:shadow-none">
          <div />
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-teal-500" />
            </button>
            <WalletWidget />
          </div>
        </header>

        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </motion.div>

      {/* ── Mobile layout ── */}
      <div className="lg:hidden min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 bg-white dark:bg-[#0a0a10] border-b border-slate-200 dark:border-neutral-800 shadow-sm dark:shadow-none">
          {/* Left: Hamburger + Brand */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-1.5 min-w-0">
              <img
                src="/nNGNlogo.png"
                alt="nNGN"
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-sm truncate">
                NairaStable
              </span>
            </div>
          </div>

          {/* Right: Bell + Wallet (compact on mobile) */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="relative p-2 rounded-xl text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-teal-500" />
            </button>
            <WalletWidget compact />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
