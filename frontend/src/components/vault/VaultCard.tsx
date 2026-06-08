import { type FC, type ReactNode } from "react";
import { useAccount } from "wagmi";
import type { Vault } from "../../hooks/useVault";
import { useHealthFactor } from "../../hooks/useHealthFactor";
import { useEthNgnPrice } from "../../hooks/useEthNgnPrice";
import { HealthBar } from "./HealthBar";
import { Badge } from "../shared/Badge";
import { formatNgn, formatEth, weiToEth, nngnBaseToDisplay } from "../../lib/utils";

interface VaultCardProps {
  vault: Vault;
}

const NgnLabel = () => (
  <span className="flex items-center">
    <img src="/nNGNlogo.png" alt="" className="w-10 h-6 rounded-full" />
    nNGN Minted
  </span>
);

export const VaultCard: FC<VaultCardProps> = ({ vault }) => {
  const { address } = useAccount();
  const { hfNumber, status } = useHealthFactor(address);
  const { data: ethNgnPrice } = useEthNgnPrice();

  const collateralEth = weiToEth(vault.collateralWei);
  const collateralNgn = ethNgnPrice ? collateralEth * ethNgnPrice : null;
  const debtDisplay = nngnBaseToDisplay(vault.debtNgn);

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
          label={<NgnLabel />}
          value={formatNgn(debtDisplay)}
        />
        <StatCell
          label="Collateral Ratio"
          value={crPct === "∞" ? "∞" : `${crPct}%`}
          valueClassName={crColor}
        />
        <StatCell
          label="Min Ratio Required"
          value="150%"
          valueClassName="text-slate-400"
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
}> = ({ label, value, sub, valueClassName = "text-slate-100" }) => (
  <div className="bg-slate-800/60 px-5 py-3.5 space-y-0.5">
    <p className="text-xs text-slate-400">{label}</p>
    <p className={`text-base font-bold tabular-nums truncate ${valueClassName}`}>{value}</p>
    {sub && <p className="text-xs text-slate-500 truncate">{sub}</p>}
  </div>
);
