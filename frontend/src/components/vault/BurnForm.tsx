import { type FC, useState } from "react";
import { useBurnNgn } from "../../hooks/useVault";
import { useEthNgnPrice } from "../../hooks/useEthNgnPrice";
import { nngnBaseToDisplay, weiToEth, formatNgn, parseContractError } from "../../lib/utils";
import type { Vault } from "../../hooks/useVault";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";
import toast from "react-hot-toast";

const BURN_FEE_RATE = 0.003; // 0.3%
const LIQ_THRESHOLD = 1.5;

interface Props { vault: Vault }

function calcPreviewHF(collateralNgn: number, currentDebt: number, burnAmount: number): number {
  const newDebt = Math.max(0, currentDebt - burnAmount);
  if (newDebt <= 0) return Infinity;
  return (collateralNgn * LIQ_THRESHOLD) / newDebt;
}

export const BurnForm: FC<Props> = ({ vault }) => {
  const [amount, setAmount] = useState("");
  const { burnNgn, isPending } = useBurnNgn();
  const { data: ethNgnPrice } = useEthNgnPrice();

  const maxDebt      = nngnBaseToDisplay(vault.debtNgn);   // max repayable (display NGN)
  const parsedAmount = Math.max(0, parseFloat(amount) || 0);
  const feeDisplay   = parsedAmount > 0 ? parsedAmount * BURN_FEE_RATE : null;

  const collateralNgn = ethNgnPrice ? weiToEth(vault.collateralWei) * ethNgnPrice : null;
  const previewHF = collateralNgn !== null && parsedAmount > 0
    ? calcPreviewHF(collateralNgn, maxDebt, parsedAmount)
    : null;

  const hfColor =
    previewHF === null  ? "text-slate-400" :
    previewHF < 1.0     ? "text-red-400"   :
    previewHF < 1.5     ? "text-yellow-400" :
                          "text-emerald-400";

  // Clamp to max debt on change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === "") { setAmount(""); return; }
    const val = parseFloat(raw);
    if (!isNaN(val) && val > maxDebt) {
      setAmount(maxDebt.toFixed(2));
    } else {
      setAmount(raw);
    }
  }

  const isDisabled = parsedAmount <= 0 || parsedAmount > maxDebt;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isDisabled) return;
    try {
      await burnNgn(parsedAmount);
      toast.success(`Repaid ${formatNgn(parsedAmount)} nNGN!`);
      setAmount("");
    } catch (err) {
      toast.error(parseContractError(err), { duration: 6000 });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Debt info */}
      <div className="rounded-xl bg-slate-700/40 px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-slate-400">Outstanding debt</span>
        <span className="text-sm font-bold text-slate-100">{formatNgn(maxDebt)}</span>
      </div>

      <Input
        label="nNGN to Repay"
        unit="nNGN"
        placeholder="0"
        value={amount}
        onChange={handleChange}
        disabled={maxDebt <= 0}
        onMax={maxDebt > 0 ? () => setAmount(maxDebt.toFixed(2)) : undefined}
      />

      {feeDisplay !== null && feeDisplay > 0 && (
        <p className="text-xs text-slate-500">
          Burn fee (0.3%): {formatNgn(feeDisplay)} · Total nNGN needed:{" "}
          {formatNgn(parsedAmount + feeDisplay)}
        </p>
      )}

      {/* HF preview after repay */}
      {previewHF !== null && (
        <div className="rounded-xl bg-slate-700/40 px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">Health Factor after repay</span>
          <span className={`text-sm font-bold tabular-nums ${hfColor}`}>
            {previewHF > 1e9 ? "∞" : previewHF.toFixed(2)}
          </span>
        </div>
      )}

      <p className="text-xs text-yellow-400/70">
        Two transactions: Approve nNGN → then Repay.
      </p>

      <Button type="submit" loading={isPending} disabled={isDisabled} className="w-full">
        Repay nNGN
      </Button>
    </form>
  );
};
