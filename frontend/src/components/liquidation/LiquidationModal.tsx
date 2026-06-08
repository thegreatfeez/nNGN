import { type FC, useState } from "react";
import type { LiquidatableVault } from "../../types/scorer";
import { useLiquidate } from "../../hooks/useLiquidate";
import { Modal } from "../shared/Modal";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";
import { formatNgn, shortenAddress, parseContractError } from "../../lib/utils";
import { LIQUIDATION_BONUS } from "../../lib/constants";
import toast from "react-hot-toast";

interface Props {
  vault: LiquidatableVault | null;
  onClose: () => void;
}

export const LiquidationModal: FC<Props> = ({ vault, onClose }) => {
  const [debtInput, setDebtInput] = useState("");
  const { liquidate, isPending } = useLiquidate();

  if (!vault) return null;

  const debtToCover = parseFloat(debtInput) || vault.debtNgn;
  const ngnRequired = debtToCover;
  const ethToReceiveFraction = debtToCover / vault.debtNgn;
  const ethToReceive = vault.collateralEth * ethToReceiveFraction * (1 + Number(LIQUIDATION_BONUS) / 1e18);
  const netProfit = debtToCover * Number(LIQUIDATION_BONUS) / 1e18;

  async function handleLiquidate() {
    try {
      await liquidate(vault!.owner as `0x${string}`, debtToCover);
      toast.success("Liquidation successful!");
      onClose();
    } catch (err: unknown) {
      toast.error(parseContractError(err));
    }
  }

  return (
    <Modal open={!!vault} onClose={onClose} title="Liquidate Vault">
      <div className="space-y-4">
        <div className="rounded-xl bg-slate-800 p-4 space-y-2 text-sm">
          <Row label="Owner" value={shortenAddress(vault.owner)} />
          <Row label="Total Debt" value={formatNgn(vault.debtNgn)} />
          <Row label="Health Factor" value={vault.healthFactor.toFixed(4)} valueClass="text-red-400" />
        </div>

        <Input
          label="Debt to Cover (nNGN)"
          unit="nNGN"
          placeholder={vault.debtNgn.toFixed(2)}
          value={debtInput}
          onChange={(e) => setDebtInput(e.target.value)}
          onMax={() => setDebtInput(vault.debtNgn.toFixed(2))}
        />

        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 space-y-2 text-sm">
          <Row label="nNGN Required" value={formatNgn(ngnRequired)} />
          <Row label="ETH to Receive" value={`${ethToReceive.toFixed(6)} ETH`} valueClass="text-emerald-400" />
          <Row label="Est. Net Profit (NGN)" value={formatNgn(netProfit)} valueClass="text-emerald-400 font-bold" />
        </div>

        <p className="text-xs text-yellow-400/70">
          Two transactions: Approve nNGN → Execute liquidation.
        </p>

        <Button onClick={handleLiquidate} loading={isPending} className="w-full">
          {isPending ? "Processing…" : "Liquidate"}
        </Button>
      </div>
    </Modal>
  );
};

const Row: FC<{ label: string; value: string; valueClass?: string }> = ({ label, value, valueClass = "text-slate-200" }) => (
  <div className="flex justify-between">
    <span className="text-slate-400">{label}</span>
    <span className={valueClass}>{value}</span>
  </div>
);
