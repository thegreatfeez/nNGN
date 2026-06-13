import { type FC } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  ShieldCheck,
  Gavel,
  ExternalLink,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
  Sun,
  Moon,
  PlusCircle,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAddNgnToWallet } from "../../hooks/useAddTokenToWallet";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: Radar, end: true },
  { to: "/vault", label: "Vault", icon: ShieldCheck, end: false },
  { to: "/liquidate", label: "Liquidate", icon: Gavel, end: false },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const DashboardSidebar: FC<Props> = ({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}) => {
  const { isDark, toggle } = useTheme();
  const { addToken } = useAddNgnToWallet();

  /* ── reusable sidebar body ── */
  const SidebarContent = ({ forMobile = false }: { forMobile?: boolean }) => (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Brand */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-slate-200 dark:border-neutral-800 shrink-0 ${
          !forMobile && collapsed ? "justify-center" : ""
        }`}
      >
        <Link
          to="/"
          onClick={forMobile ? onMobileClose : undefined}
          className="flex items-center gap-2.5 min-w-0"
        >
          <img
            src="/nNGNlogo.png"
            alt="nNGN"
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />
          <AnimatePresence>
            {(forMobile || !collapsed) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base overflow-hidden whitespace-nowrap"
              >
                NairaStable
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <AnimatePresence>
          {(forMobile || !collapsed) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-500 px-3 pb-2"
            >
              Protocol
            </motion.p>
          )}
        </AnimatePresence>

        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={forMobile ? onMobileClose : undefined}
            className={({ isActive }) =>
              [
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group overflow-hidden",
                !forMobile && collapsed ? "justify-center" : "",
                isActive
                  ? "text-teal-700 dark:text-teal-400"
                  : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-100",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId={forMobile ? "mob-sidebar-pill" : "sidebar-active-pill"}
                    className="absolute inset-0 rounded-xl bg-teal-100 dark:bg-teal-400/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon
                  size={18}
                  className={`shrink-0 relative z-10 transition-colors ${
                    isActive
                      ? "text-teal-700 dark:text-teal-400"
                      : "text-slate-500 dark:text-neutral-500 group-hover:text-slate-800 dark:group-hover:text-neutral-200"
                  }`}
                />
                <AnimatePresence>
                  {(forMobile || !collapsed) && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10 overflow-hidden whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed desktop */}
                {!forMobile && collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Resources section */}
        <AnimatePresence>
          {(forMobile || !collapsed) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-500 px-3 pt-4 pb-2"
            >
              Resources
            </motion.p>
          )}
        </AnimatePresence>
        <a
          href="/docs/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-900 dark:hover:text-neutral-100 transition-all duration-200 group ${
            !forMobile && collapsed ? "justify-center" : ""
          }`}
        >
          <BookOpen
            size={18}
            className="shrink-0 text-slate-500 dark:text-neutral-500 group-hover:text-slate-800 dark:group-hover:text-neutral-200 transition-colors"
          />
          <AnimatePresence>
            {(forMobile || !collapsed) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Documentation
              </motion.span>
            )}
          </AnimatePresence>
          {!forMobile && collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
              Documentation
            </div>
          )}
        </a>

        {/* NairaData external link */}
        {import.meta.env.VITE_NAIRA_DATA_URL && (
          <>
            <AnimatePresence>
              {(forMobile || !collapsed) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-500 px-3 pt-4 pb-2"
                >
                  Ecosystem
                </motion.p>
              )}
            </AnimatePresence>
            <a
              href={import.meta.env.VITE_NAIRA_DATA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-900 dark:hover:text-neutral-100 transition-all duration-200 group ${
                !forMobile && collapsed ? "justify-center" : ""
              }`}
            >
              <ExternalLink
                size={18}
                className="shrink-0 text-slate-500 dark:text-neutral-500 group-hover:text-slate-800 dark:group-hover:text-neutral-200 transition-colors"
              />
              <AnimatePresence>
                {(forMobile || !collapsed) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    NairaData Portal
                  </motion.span>
                )}
              </AnimatePresence>
              {!forMobile && collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                  NairaData Portal
                </div>
              )}
            </a>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-neutral-800 p-3 space-y-0.5 shrink-0">
        <button
          onClick={addToken}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-900 dark:hover:text-neutral-100 transition-all duration-200 group ${
            !forMobile && collapsed ? "justify-center" : ""
          }`}
          title="Add nNGN to wallet"
        >
          <PlusCircle
            size={18}
            className="shrink-0 text-slate-500 dark:text-neutral-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
          />
          <AnimatePresence>
            {(forMobile || !collapsed) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Add nNGN
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={toggle}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-900 dark:hover:text-neutral-100 transition-all duration-200 ${
            !forMobile && collapsed ? "justify-center" : ""
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun size={18} className="shrink-0 text-amber-400" />
          ) : (
            <Moon size={18} className="shrink-0 text-slate-500" />
          )}
          <AnimatePresence>
            {(forMobile || !collapsed) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap text-slate-700 dark:text-neutral-300"
              >
                {isDark ? "Light Mode" : "Dark Mode"}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar wrapper (relative so toggle button can escape overflow) ── */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen z-40">
        <motion.aside
          animate={{ width: collapsed ? 72 : 240 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="h-full bg-white dark:bg-[#0a0a10] border-r border-slate-200 dark:border-neutral-800 overflow-hidden"
        >
          <SidebarContent />
        </motion.aside>

        {/* Collapse toggle — sits OUTSIDE overflow:hidden, anchored to right edge */}
        <motion.button
          animate={{ left: collapsed ? 72 : 240 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          onClick={onToggle}
          className="absolute top-24 -translate-x-1/2 w-7 h-7 bg-white dark:bg-[#0a0a10] border-2 border-teal-500/20 dark:border-teal-500/30 hover:border-teal-500 rounded-full flex items-center justify-center shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] dark:shadow-none text-teal-600 dark:text-teal-400 hover:scale-110 active:scale-95 transition-all z-[60] cursor-pointer"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </motion.button>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-[#0a0a10] border-r border-slate-200 dark:border-neutral-800 z-[60] flex flex-col lg:hidden shadow-2xl"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors z-10"
              >
                <X size={16} />
              </button>
              <SidebarContent forMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
