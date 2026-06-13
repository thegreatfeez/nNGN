import { type FC, useState } from "react";
import { useWithdraw } from "../../hooks/useVault";
import { useEthNgnPrice } from "../../hooks/useEthNgnPrice";
import { weiToEth, nngnBaseToDisplay, formatEth, parseContractError } from "../../lib/utils";
import type { Vault } from "../../hooks/useVault";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";
import toast from "react-hot-toast";

const MIN_CR        = 2.0;   // 200% — contract's MIN_COLLATERAL_RATIO
const LIQ_THRESHOLD = 1.5;   // 150% — for health factor preview

interface Props { vault: Vault }

function calcMaxWithdrawEth(
  collateralEth: number,
  debtNgn: number,
  ethNgnPrice: number | null,
): number {
  if (debtNgn <= 0) return collateralEth; // no debt — can withdraw everything
  if (!ethNgnPrice) return 0;
  // At 200% CR: collateralNgn >= debtNgn * 2
  // → minCollateralNgn = debtNgn * 2
  // → minCollateralEth = debtNgn * 2 / ethNgnPrice
  const minCollateralEth = (debtNgn * MIN_CR) / ethNgnPrice;
  return Math.max(0, collateralEth - minCollateralEth);
}

function calcPreviewHF(
  collateralEth: number,
  withdrawEth: number,
  debtNgn: number,
  ethNgnPrice: number,
): number {
  if (debtNgn <= 0) return Infinity;
  const newCollateralNgn = Math.max(0, collateralEth - withdrawEth) * ethNgnPrice;
  return (newCollateralNgn * LIQ_THRESHOLD) / debtNgn;
}

export const WithdrawForm: FC<Props> = ({ vault }) => {
  const [amount, setAmount] = useState("");
  const { withdraw, isPending } = useWithdraw();
  const { data: ethNgnPrice } = useEthNgnPrice();

  const collateralEth = weiToEth(vault.collateralWei);
  const debtNgn       = nngnBaseToDisplay(vault.debtNgn);
  const maxWithdraw   = calcMaxWithdrawEth(collateralEth, debtNgn, ethNgnPrice ?? null);

  const parsedAmount  = Math.max(0, parseFloat(amount) || 0);
  const exceedsMax    = parsedAmount > maxWithdraw;

  const previewHF =
    ethNgnPrice && parsedAmount > 0 && debtNgn > 0
      ? calcPreviewHF(collateralEth, parsedAmount, debtNgn, ethNgnPrice)
      : null;

  const hfColor =
    previewHF === null  ? "text-slate-400" :
    previewHF < 1.0     ? "text-red-400"   :
    previewHF < 1.5     ? "text-yellow-400" :
                          "text-emerald-400";

  // Clamp input to max on change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === "") { setAmount(""); return; }
    const val = parseFloat(raw);
    if (!isNaN(val) && val > maxWithdraw) {
      setAmount(maxWithdraw.toFixed(6));
    } else {
      setAmount(raw);
    }
  }

  const isDisabled = parsedAmount <= 0 || exceedsMax || maxWithdraw <= 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isDisabled) return;
    try {
      await withdraw(parsedAmount);
      toast.success(`Withdrew ${parsedAmount.toFixed(4)} ETH!`);
      setAmount("");
    } catch (err) {
      toast.error(parseContractError(err), { duration: 6000 });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Available to withdraw */}
      <div className="rounded-xl bg-slate-700/40 px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-white/60">Available to withdraw</span>
        <span className="text-sm font-bold text-white">
          {ethNgnPrice === null && debtNgn > 0
            ? "—"
            : maxWithdraw <= 0
            ? "0 ETH (at max debt)"
            : formatEth(BigInt(Math.floor(maxWithdraw * 1e18)))}
        </span>
      </div>

      <Input
        label="ETH to Withdraw"
        unit="ETH"
        placeholder="0.0"
        value={amount}
        onChange={handleChange}
        disabled={maxWithdraw <= 0}
        onMax={
          maxWithdraw > 0
            ? () => setAmount((maxWithdraw * 0.999).toFixed(6))
            : undefined
        }
      />
      {parsedAmount > 0 && ethNgnPrice && (
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">
          ≈ ₦{(parsedAmount * ethNgnPrice).toLocaleString("en-NG", { maximumFractionDigits: 0 })}
        </p>
      )}

      {/* HF preview — only show when user has debt */}
      {previewHF !== null && (
        <div className="rounded-xl bg-slate-700/40 px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-white/60">Health Factor after withdraw</span>
          <span className={`text-sm font-bold tabular-nums ${hfColor}`}>
            {previewHF > 1e9 ? "∞" : previewHF.toFixed(2)}
          </span>
        </div>
      )}

      <Button type="submit" loading={isPending} disabled={isDisabled} className="w-full">
        Withdraw ETH
      </Button>
    </form>
  );
};
