import { type FC } from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import { useEthNgnPrice } from "../hooks/useEthNgnPrice";
import { useVault } from "../hooks/useVault";
import { useAllVaults } from "../hooks/useAllVaults";
import { useMarketInsight } from "../hooks/useMarketInsight";
import { VaultCard } from "../components/vault/VaultCard";
import { MarketInsightCard } from "../components/shared/MarketInsightCard";
import { ngnContract } from "../lib/contracts";
import { formatNgn, weiToEth, nngnBaseToDisplay } from "../lib/utils";
import { Spinner } from "../components/shared/Spinner";
import {
  ArrowUpRight,
  ArrowRight,
  AlertCircle,
  BarChart3,
  Landmark,
  Coins,
  BrainCircuit,
  HeartPulse,
  Box,
} from "lucide-react";

const ARBISCAN = "https://sepolia.arbiscan.io/address";

/* ─── animation variants ──────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 200, damping: 22 } 
  },
};

/* ─── Dashboard ───────────────────────────────────────── */
export const Dashboard: FC = () => {
  const { isConnected, address } = useAccount();
  const { data: ethNgnPrice, isLoading: priceLoading } = useEthNgnPrice();
  const { vault, isLoading: vaultLoading } = useVault();
  const { insight, isLoading: insightLoading, error: insightError } =
    useMarketInsight(vault);
  const { data: allVaults } = useAllVaults();

  const { data: walletBalanceRaw } = useReadContract({
    ...ngnContract,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 15_000 },
  });
  const walletBalance =
    walletBalanceRaw !== undefined
      ? nngnBaseToDisplay(walletBalanceRaw as bigint)
      : null;

  const { data: totalSupply } = useReadContract({
    ...ngnContract,
    functionName: "totalSupply",
    query: { refetchInterval: 30_000 },
  });

  const tvlEth =
    allVaults?.reduce((acc, v) => acc + weiToEth(v.collateralWei), 0) ?? 0;
  const tvlNgn = ethNgnPrice ? tvlEth * ethNgnPrice : null;
  const supplyDisplay = totalSupply
    ? nngnBaseToDisplay(totalSupply as bigint)
    : null;

  const mcapTvl =
    tvlNgn && tvlNgn > 0 && supplyDisplay && supplyDisplay > 0
      ? supplyDisplay / tvlNgn
      : null;
  const mcapTvlLabel = mcapTvl
    ? `MCap/TVL ${mcapTvl.toFixed(2)} · ${
        mcapTvl <= 0.5 ? "Healthy" : mcapTvl <= 0.67 ? "Caution" : "At Risk"
      }`
    : null;
  const mcapTvlColor = mcapTvl
    ? mcapTvl <= 0.5
      ? "text-teal-600 dark:text-teal-400"
      : mcapTvl <= 0.67
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400"
    : "text-slate-400";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Page header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-neutral-400 text-sm mt-1 font-medium">
          Over-collateralized NGN stablecoin · Arbitrum Sepolia
        </p>
      </motion.div>

      {/* Protocol stat cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <StatCard
          icon={<BarChart3 size={17} className="text-teal-600 dark:text-teal-400" />}
          label="ETH / NGN"
          value={priceLoading ? null : ethNgnPrice ? formatNgn(ethNgnPrice) : "—"}
          accent="teal"
        />
        <StatCard
          icon={<Landmark size={17} className="text-cyan-600 dark:text-cyan-400" />}
          label="Total TVL"
          value={tvlNgn ? formatNgn(tvlNgn) : `${tvlEth.toFixed(4)} ETH`}
          sub={mcapTvlLabel}
          subColor={mcapTvlColor}
          accent="cyan"
        />
        <StatCard
          icon={<Coins size={17} className="text-violet-600 dark:text-violet-400" />}
          label="nNGN Circulating"
          value={supplyDisplay ? formatNgn(supplyDisplay) : "—"}
          accent="violet"
        />
      </motion.div>

      {/* AI Market Insight */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MarketInsightCard
          insight={insight}
          isLoading={insightLoading}
          error={insightError}
        />

        <motion.div
           whileHover={{ y: -2 }}
           className="rounded-2xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-6 flex flex-col justify-between group shadow-sm transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 transition-colors">
               <HeartPulse size={24} />
            </div>
            <ArrowUpRight size={18} className="text-slate-300 dark:text-neutral-700 group-hover:text-teal-500 transition-colors" />
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
               Protocol Analytics
            </h3>
            <p className="text-slate-600 dark:text-neutral-500 text-sm mt-1 font-medium">
               Deep dive into vault health distributions and market stability metrics.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* User vault */}
      <motion.div variants={itemVariants}>
        {isConnected ? (
          vaultLoading ? (
            <div className="flex justify-center py-14">
              <Spinner size="lg" />
            </div>
          ) : vault ? (
            <div className="space-y-3">
              <VaultCard vault={vault} />
              <Link
                to="/vault"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              >
                Manage vault <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {walletBalance !== null && walletBalance > 0 && (
                <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80">
                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Wallet Balance
                    </h2>
                  </div>
                  <div className="px-5 py-4 flex items-center gap-3">
                    <img src="/nNGNlogo.png" alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xl font-extrabold tabular-nums text-slate-900 dark:text-white">
                        {formatNgn(walletBalance)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-neutral-500 font-medium mt-0.5">
                        nNGN in this wallet
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-neutral-700 bg-slate-100/60 dark:bg-neutral-900/40 p-12 text-center space-y-3"
              >
                <div className="mx-auto w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-500/10 flex items-center justify-center mb-2">
                  <Box size={22} className="text-teal-600 dark:text-teal-400" />
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg">
                  No vault yet
                </p>
                <p className="text-slate-500 dark:text-neutral-500 text-sm font-medium">
                  Deposit ETH collateral to mint nNGN
                </p>
                <Link
                  to="/vault"
                  className="inline-flex items-center gap-1.5 mt-2 px-5 py-2.5 bg-primary dark:bg-teal-500 hover:bg-primary-hover dark:hover:bg-teal-400 text-white text-sm font-bold rounded-xl transition-all duration-200"
                >
                  Open vault <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          )
        ) : (
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-10 text-center space-y-3"
          >
            <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center mb-2">
              <AlertCircle size={22} className="text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-slate-600 dark:text-neutral-400 font-medium">
              Connect your wallet to view your vault
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* NairaData CTA */}
      {import.meta.env.VITE_NAIRA_DATA_URL && (
        <motion.div variants={itemVariants}>
          <a
            href={import.meta.env.VITE_NAIRA_DATA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl border border-teal-500/30 dark:border-teal-400/20 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-500/5 dark:to-cyan-500/5 p-5 hover:from-teal-100 hover:to-cyan-100 dark:hover:from-teal-500/10 dark:hover:to-cyan-500/10 transition-all duration-300"
          >
            <p className="text-primary dark:text-teal-400 font-semibold flex items-center gap-1.5">
              Use your nNGN
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </p>
            <p className="text-slate-600 dark:text-neutral-500 text-sm mt-1 font-medium">
              Pay ₦10 nNGN to access live USD/NGN market data on the NairaData
              Portal.
            </p>
          </a>
        </motion.div>
      )}

      {/* Contract links */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap gap-4 pt-2 border-t border-slate-200 dark:border-neutral-800"
      >
        {[
          { label: "NSEngine", env: "VITE_ENGINE_ADDRESS" },
          { label: "nNGN Token", env: "VITE_NNGN_ADDRESS" },
        ].map(({ label, env }) => {
          const addr = import.meta.env[env] as string | undefined;
          if (!addr) return null;
          return (
            <a
              key={env}
              href={`${ARBISCAN}/${addr}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 dark:text-neutral-600 hover:text-teal-600 dark:hover:text-teal-400 font-bold font-mono transition-colors"
            >
              {label}: {addr.slice(0, 6)}…{addr.slice(-4)} ↗
            </a>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

/* ─── StatCard ────────────────────────────────────────── */
const accentStyles: Record<
  string,
  { border: string; bg: string; glow: string }
> = {
  teal: {
    border: "border-l-teal-500",
    bg: "bg-teal-500/5",
    glow: "hover:shadow-teal-500/10",
  },
  cyan: {
    border: "border-l-cyan-500",
    bg: "bg-cyan-500/5",
    glow: "hover:shadow-cyan-500/10",
  },
  violet: {
    border: "border-l-violet-500",
    bg: "bg-violet-500/5",
    glow: "hover:shadow-violet-500/10",
  },
};

const StatCard: FC<{
  icon: React.ReactNode;
  label: string;
  value: string | null;
  accent: "teal" | "cyan" | "violet";
  sub?: string | null;
  subColor?: string;
}> = ({ icon, label, value, accent, sub, subColor = "text-slate-500" }) => {
  const s = accentStyles[accent];
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`rounded-2xl border border-slate-300 dark:border-neutral-800 border-l-4 ${s.border} bg-white dark:bg-neutral-900/60 px-5 py-5 shadow-sm hover:shadow-lg ${s.glow} transition-all duration-300`}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <p className="text-xs font-bold text-slate-600 dark:text-neutral-400 uppercase tracking-wider">
          {label}
        </p>
      </div>
      {value === null ? (
        <Spinner size="sm" />
      ) : (
        <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
          {value}
        </p>
      )}
      {sub && (
        <p className={`text-xs font-medium mt-1.5 tabular-nums ${subColor}`}>
          {sub}
        </p>
      )}
    </motion.div>
  );
};
