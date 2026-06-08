import { type FC } from "react";
import { Link } from "react-router-dom";
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
import { ArrowRight, TrendingUp, Shield } from "lucide-react";

const ARBISCAN = "https://sepolia.arbiscan.io/address";

export const Dashboard: FC = () => {
  const { isConnected } = useAccount();
  const { data: ethNgnPrice, isLoading: priceLoading } = useEthNgnPrice();
  const { vault, isLoading: vaultLoading } = useVault();
  const { insight, isLoading: insightLoading, error: insightError } = useMarketInsight(vault);
  const { data: allVaults } = useAllVaults();

  const { data: totalSupply } = useReadContract({
    ...ngnContract,
    functionName: "totalSupply",
    query: { refetchInterval: 30_000 },
  });

  const tvlEth = allVaults?.reduce((acc, v) => acc + weiToEth(v.collateralWei), 0) ?? 0;
  const tvlNgn = ethNgnPrice ? tvlEth * ethNgnPrice : null;
  const supplyDisplay = totalSupply ? nngnBaseToDisplay(totalSupply as bigint) : null;

  const mcapTvl =
    tvlNgn && tvlNgn > 0 && supplyDisplay && supplyDisplay > 0
      ? supplyDisplay / tvlNgn
      : null;
  const mcapTvlLabel = mcapTvl
    ? `MCap/TVL ${mcapTvl.toFixed(2)} · ${mcapTvl <= 0.5 ? "Healthy" : mcapTvl <= 0.67 ? "Caution" : "At Risk"}`
    : null;
  const mcapTvlColor = mcapTvl
    ? mcapTvl <= 0.5
      ? "text-emerald-400"
      : mcapTvl <= 0.67
      ? "text-yellow-400"
      : "text-red-400"
    : "text-slate-500";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Over-collateralized NGN stablecoin on Arbitrum Sepolia
        </p>
      </div>

      {/* Protocol stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<TrendingUp size={16} className="text-emerald-400" />}
          label="ETH / NGN"
          value={priceLoading ? null : ethNgnPrice ? formatNgn(ethNgnPrice) : "—"}
          accent="emerald"
        />
        <StatCard
          icon={<Shield size={16} className="text-blue-400" />}
          label="Total TVL"
          value={tvlNgn ? formatNgn(tvlNgn) : `${tvlEth.toFixed(4)} ETH`}
          sub={mcapTvlLabel}
          subColor={mcapTvlColor}
          accent="blue"
        />
        <StatCard
          icon={<img src="/nNGNlogo.png" alt="" className="w-10 h-6 rounded-full" />}
          label="nNGN Circulating"
          value={supplyDisplay ? formatNgn(supplyDisplay) : "—"}
          accent="violet"
        />
      </div>

      {/* AI Market Insight */}
      <MarketInsightCard insight={insight} isLoading={insightLoading} error={insightError} />

      {/* User vault */}
      {isConnected ? (
        vaultLoading ? (
          <div className="flex justify-center py-10"><Spinner size="lg" /></div>
        ) : vault ? (
          <div className="space-y-3">
            <VaultCard vault={vault} />
            <Link
              to="/vault"
              className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300"
            >
              Manage vault <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 p-10 text-center space-y-3">
            <p className="text-slate-300 font-medium">No vault yet</p>
            <p className="text-slate-500 text-sm">Deposit ETH collateral to mint nNGN</p>
            <Link
              to="/vault"
              className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Open vault <ArrowRight size={14} />
            </Link>
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-10 text-center">
          <p className="text-slate-400">Connect your wallet to view your vault</p>
        </div>
      )}

      {/* NairaData portal CTA */}
      {import.meta.env.VITE_NAIRA_DATA_URL && (
        <a
          href={import.meta.env.VITE_NAIRA_DATA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 hover:bg-emerald-500/15 transition-colors"
        >
          <p className="text-emerald-400 font-semibold">Use your nNGN →</p>
          <p className="text-slate-400 text-sm mt-1">
            Pay ₦10 nNGN to access live USD/NGN market data on the NairaData Portal.
          </p>
        </a>
      )}

      {/* Contract links */}
      <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-800">
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
              className="text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors"
            >
              {label}: {addr.slice(0, 6)}…{addr.slice(-4)} ↗
            </a>
          );
        })}
      </div>
    </div>
  );
};

const accentBorder: Record<string, string> = {
  emerald: "border-l-emerald-500",
  blue: "border-l-blue-500",
  violet: "border-l-violet-500",
};

const StatCard: FC<{
  icon: React.ReactNode;
  label: string;
  value: string | null;
  accent: "emerald" | "blue" | "violet";
  sub?: string | null;
  subColor?: string;
}> = ({ icon, label, value, accent, sub, subColor = "text-slate-400" }) => (
  <div
    className={`rounded-2xl border border-slate-700 border-l-2 ${accentBorder[accent]} bg-slate-800/60 px-5 py-4`}
  >
    <div className="flex items-center gap-1.5 mb-2">
      {icon}
      <p className="text-xs font-medium text-slate-400">{label}</p>
    </div>
    {value === null ? (
      <Spinner size="sm" />
    ) : (
      <p className="text-xl font-bold text-slate-100 tabular-nums">{value}</p>
    )}
    {sub && (
      <p className={`text-xs font-medium mt-1 tabular-nums ${subColor}`}>{sub}</p>
    )}
  </div>
);
