import { type FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

const NAV_LINKS = ["About"] as const;

export const LandingNav: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggle: setIsDarkToggle } = useTheme();

  // scroll watcher
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 22, delay: 0.1 }}
        className={[
          "fixed md:w-[70%] top-4 left-4 right-4 md:top-5 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50",
          "flex items-center justify-between gap-6 md:gap-8 px-5 py-3 md:rounded-full rounded-2xl whitespace-nowrap",
          "border transition-all duration-300",
          scrolled
            ? "bg-white/80 dark:bg-[#0a0a0a]/90 border-slate-200 dark:border-neutral-800 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
            : "bg-white/40 dark:bg-black/30 border-slate-200/50 dark:border-neutral-800/40 shadow-sm backdrop-blur-md",
        ].join(" ")}
      >
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/nNGNlogo.png" alt="NairaStable" className="w-15 h-15 object-contain flex-shrink-0" />
          <span className="font-extrabold tracking-tight text-slate-900 dark:text-neutral-50 text-lg">NairaStable</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-bold text-slate-500 dark:text-neutral-400 hover:text-primary dark:hover:text-accent transition-colors duration-200"
            >
              {item}
            </a>
          ))}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-slate-500 dark:text-neutral-400 hover:text-primary dark:hover:text-accent transition-colors duration-200"
          >
            Docs
          </a>
        </div>

        <div className="hidden md:block h-4 w-px bg-slate-300 dark:bg-neutral-800 shrink-0" />

        {/* CTA, Theme & Mobile Toggle */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button
            onClick={setIsDarkToggle}
            className="hidden md:flex p-2 rounded-full border border-slate-200 dark:border-neutral-800 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link
            to="/dashboard"
            className="px-4 py-2 md:px-5 md:py-2 bg-primary hover:bg-primary-hover text-white dark:bg-accent dark:hover:bg-secondary text-xs md:text-sm font-bold rounded-full transition-all duration-200"
          >
            Launch App
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-50 transition-colors ml-1"
          >
            <Menu size={22} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-white dark:bg-[#050505] border-l border-slate-200 dark:border-neutral-800 z-[70] shadow-2xl flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-neutral-900">
                <span className="font-extrabold tracking-tight text-slate-900 dark:text-neutral-50 text-lg">NairaStable</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-50 transition-colors bg-slate-100 dark:bg-neutral-900 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-2 p-6">
                {NAV_LINKS.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-left p-4 text-base font-black text-slate-600 hover:text-primary dark:text-neutral-400 dark:hover:text-accent hover:bg-slate-50 dark:hover:bg-neutral-900/50 rounded-2xl transition-all"
                  >
                    {item}
                  </a>
                ))}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left p-4 text-base font-black text-slate-600 hover:text-primary dark:text-neutral-400 dark:hover:text-accent hover:bg-slate-50 dark:hover:bg-neutral-900/50 rounded-2xl transition-all"
                >
                  Docs
                </a>
              </div>

              <div className="mt-auto p-6 border-t border-slate-100 dark:border-neutral-900">
                <button
                  onClick={setIsDarkToggle}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-neutral-800 text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-50 hover:bg-slate-50 dark:hover:bg-neutral-900/50 transition-all font-bold"
                >
                  <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
