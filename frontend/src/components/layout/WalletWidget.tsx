import { type FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { useAppKit, useDisconnect } from "@reown/appkit/react";
import {
  ArrowDownWideNarrow,
  Power,
  Repeat,
  Copy,
  CircleCheckBig,
} from "lucide-react";

/** Shortens a hex address e.g. 0xaBcD…EfGh */
function shortenAddr(addr: string, chars = 4): string {
  return `${addr.slice(0, chars + 2)}…${addr.slice(-chars)}`;
}

interface Props {
  /** Extra short format for very tight spaces (mobile topbar) */
  compact?: boolean;
}

export const WalletWidget: FC<Props> = ({ compact = false }) => {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Not connected — show connect button
  if (!isConnected || !address) {
    return (
      <button
        onClick={() => open()}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary dark:bg-teal-500 hover:bg-primary-hover dark:hover:bg-teal-400 text-white text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md"
      >
        Connect Wallet
      </button>
    );
  }

  const displayAddr = compact
    ? shortenAddr(address, 3)
    : shortenAddr(address, 4);

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-700 text-slate-800 dark:text-neutral-200 text-xs font-bold transition-all duration-200 shadow-sm group"
      >
        {/* Status dot */}
        <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 ring-2 ring-teal-500/20" />
        <span className="font-mono">{displayAddr}</span>
        <ArrowDownWideNarrow
          size={13}
          className={`text-slate-500 dark:text-neutral-500 transition-transform duration-200 ${
            menuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Click-outside overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl z-50 overflow-hidden"
            >
              {/* Address header */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-neutral-800">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-500 mb-1">
                  Connected
                </p>
                <p className="text-xs font-mono text-slate-800 dark:text-neutral-200 break-all font-bold">
                  {address}
                </p>
              </div>

              {/* Actions */}
              <div className="p-1.5 space-y-0.5">
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {copied ? (
                    <CircleCheckBig size={15} className="text-teal-500 shrink-0" />
                  ) : (
                    <Copy size={15} className="text-slate-400 dark:text-neutral-500 shrink-0" />
                  )}
                  {copied ? "Copied!" : "Copy address"}
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    open({ view: "Connect" });
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Repeat
                    size={15}
                    className="text-slate-400 dark:text-neutral-500 shrink-0"
                  />
                  Switch wallet
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    disconnect();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <Power
                    size={15}
                    className="shrink-0"
                  />
                  Disconnect
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
