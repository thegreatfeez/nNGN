import { type FC, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import type { Vault } from "../../hooks/useVault";
import { useHealthFactor } from "../../hooks/useHealthFactor";
import { useEthNgnPrice } from "../../hooks/useEthNgnPrice";
import { ngnContract } from "../../lib/contracts";
import { HealthBar } from "./HealthBar";
import { Badge } from "../shared/Badge";
import { formatNgn, formatEth, weiToEth, nngnBaseToDisplay } from "../../lib/utils";

interface VaultCardProps {
  vault: Vault;
}

const NgnLabel = ({ label }: { label: string }) => (
  <span className="flex items-center gap-1.5">
    <img src="/nNGNlogo.png" alt="" className="w-5 h-5 rounded-full object-cover" />
    {label}
  </span>
);

export const VaultCard: FC<VaultCardProps> = ({ vault }) => {
  const { address } = useAccount();
  const { hfNumber, status } = useHealthFactor(address);
  const { data: ethNgnPrice } = useEthNgnPrice();

  const { data: walletBalanceRaw } = useReadContract({
    ...ngnContract,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 15_000 },
  });

  const collateralEth = weiToEth(vault.collateralWei);
  const collateralNgn = ethNgnPrice ? collateralEth * ethNgnPrice : null;
  const debtDisplay = nngnBaseToDisplay(vault.debtNgn);
  const walletBalance = walletBalanceRaw !== undefined ? nngnBaseToDisplay(walletBalanceRaw as bigint) : null;

  const crRaw =
    vault.debtNgn > 0n && collateralNgn
      ? collateralNgn / debtDisplay
      : null;
  const crPct = crRaw !== null ? (crRaw * 100).toFixed(1) : "∞";

  const crColor =
    crPct === "∞"
      ? "text-teal-600 dark:text-teal-400"
      : parseFloat(crPct) >= 200
      ? "text-teal-600 dark:text-teal-400"
      : parseFloat(crPct) >= 150
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 overflow-hidden shadow-sm"
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Vault Overview
        </h2>
        <Badge status={status} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-px bg-slate-100 dark:bg-neutral-800/50">
        <StatCell
          label="Collateral"
          value={formatEth(vault.collateralWei)}
          sub={collateralNgn ? formatNgn(collateralNgn) : undefined}
        />
        <StatCell
          label={<NgnLabel label="nNGN Minted (Debt)" />}
          value={formatNgn(debtDisplay)}
        />
        <StatCell
          label={<NgnLabel label="nNGN in Wallet" />}
          value={walletBalance !== null ? formatNgn(walletBalance) : "—"}
          sub={
            walletBalance !== null && walletBalance < debtDisplay
              ? `${formatNgn(debtDisplay - walletBalance)} sent out`
              : undefined
          }
          subClassName="text-amber-400"
        />
        <StatCell
          label="Collateral Ratio"
          value={crPct === "∞" ? "∞" : `${crPct}%`}
          valueClassName={crColor}
        />
        <StatCell
          label="Min Ratio Required"
          value="150%"
          valueClassName="text-slate-400 dark:text-neutral-500"
        />
      </div>

      {/* Health bar */}
      <div className="px-5 py-4 bg-white dark:bg-neutral-900/60">
        <HealthBar hf={hfNumber} />
      </div>
    </motion.div>
  );
};

const StatCell: FC<{
  label: ReactNode;
  value: string;
  sub?: string;
  valueClassName?: string;
  subClassName?: string;
}> = ({ label, value, sub, valueClassName = "text-slate-950 dark:text-white", subClassName = "text-slate-500 dark:text-neutral-600" }) => (
  <div className="bg-white dark:bg-neutral-900/60 px-5 py-3.5 space-y-0.5">
    <p className="text-xs text-slate-600 dark:text-neutral-500 font-bold">{label}</p>
    <p className={`text-base font-extrabold tabular-nums truncate ${valueClassName}`}>{value}</p>
    {sub && <p className={`text-xs font-medium truncate ${subClassName}`}>{sub}</p>}
  </div>
);
