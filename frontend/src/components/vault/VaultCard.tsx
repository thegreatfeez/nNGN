import { type FC, type ReactNode } from "react";
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
  <span className="flex items-center gap-1">
    <img src="/nNGNlogo.png" alt="" className="w-10 h-6 rounded-full" />
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
      ? "text-emerald-400"
      : parseFloat(crPct) >= 200
      ? "text-emerald-400"
      : parseFloat(crPct) >= 150
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/60">
        <h2 className="text-base font-semibold text-slate-100">Your Vault</h2>
        <Badge status={status} />
      </div>

      <div className="grid grid-cols-2 gap-px bg-slate-700/40">
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
      </div>

      <div className="px-5 py-4">
        <HealthBar hf={hfNumber} />
      </div>
    </div>
  );
};

const StatCell: FC<{
  label: ReactNode;
  value: string;
  sub?: string;
  valueClassName?: string;
  subClassName?: string;
}> = ({ label, value, sub, valueClassName = "text-slate-100", subClassName = "text-slate-500" }) => (
  <div className="bg-slate-800/60 px-5 py-3.5 space-y-0.5">
    <p className="text-xs text-slate-400">{label}</p>
    <p className={`text-base font-bold tabular-nums truncate ${valueClassName}`}>{value}</p>
    {sub && <p className={`text-xs truncate ${subClassName}`}>{sub}</p>}
  </div>
);
