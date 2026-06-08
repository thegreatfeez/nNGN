import { type FC, useState } from "react";
import { useMintNgn } from "../../hooks/useVault";
import { useEthNgnPrice } from "../../hooks/useEthNgnPrice";
import { weiToEth, nngnBaseToDisplay, formatNgn, parseContractError } from "../../lib/utils";
import type { Vault } from "../../hooks/useVault";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";
import toast from "react-hot-toast";

// All preview math stays in float — no BigInt / toFixed in render path.
const MINT_FEE_RATE = 0.005;
const MIN_CR        = 2.0;   // 200% — contract's MIN_COLLATERAL_RATIO
const LIQ_THRESHOLD = 1.5;   // 150% — for health factor display

interface Props { vault: Vault }

function calcMaxMintable(collateralNgn: number, currentDebt: number): number {
  const maxTotalDebt = collateralNgn / MIN_CR;
  const headroom = maxTotalDebt - currentDebt;
  if (headroom <= 0) return 0;
  return headroom / (1 + MINT_FEE_RATE);
}

function calcPreviewHF(collateralNgn: number, currentDebt: number, mintAmount: number): number {
  const totalDebt = currentDebt + mintAmount * (1 + MINT_FEE_RATE);
  if (totalDebt <= 0) return Infinity;
  return (collateralNgn * LIQ_THRESHOLD) / totalDebt;
}

export const MintForm: FC<Props> = ({ vault }) => {
  const [amount, setAmount] = useState("");
  const { mintNgn, isPending } = useMintNgn();
  const { data: ethNgnPrice } = useEthNgnPrice();

  const collateralNgn  = ethNgnPrice ? weiToEth(vault.collateralWei) * ethNgnPrice : null;
  const currentDebt    = nngnBaseToDisplay(vault.debtNgn);
  const maxMintable    = collateralNgn !== null ? calcMaxMintable(collateralNgn, currentDebt) : null;

  const parsedAmount   = Math.max(0, parseFloat(amount) || 0);
  const feeDisplay     = parsedAmount > 0 ? parsedAmount * MINT_FEE_RATE : null;
  const previewHF      = collateralNgn !== null && parsedAmount > 0
    ? calcPreviewHF(collateralNgn, currentDebt, parsedAmount)
    : null;

  const hfColor =
    previewHF === null  ? "text-slate-400" :
    previewHF < 1.0     ? "text-red-400"   :
    previewHF < 1.5     ? "text-yellow-400" :
                          "text-emerald-400";

  // Clamp input to max on change — never allow typing beyond the limit
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (maxMintable === null || raw === "") { setAmount(raw); return; }
    const val = parseFloat(raw);
    if (!isNaN(val) && val > maxMintable) {
      setAmount((maxMintable * 0.999).toFixed(2));
    } else {
      setAmount(raw);
    }
  }

  const isDisabled = !ethNgnPrice || parsedAmount <= 0 || (maxMintable !== null && maxMintable <= 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isDisabled || parsedAmount <= 0) return;
    try {
      await mintNgn(parsedAmount);
      toast.success(`Minted ${formatNgn(parsedAmount)} nNGN!`);
      setAmount("");
    } catch (err) {
      toast.error(parseContractError(err), { duration: 6000 });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Oracle unavailable warning */}
      {!ethNgnPrice && (
        <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 px-4 py-3">
          <p className="text-xs text-yellow-400 font-medium">Price oracle unavailable</p>
          <p className="text-xs text-yellow-400/70 mt-0.5">
            The NGN price oracle is not running. Run <code className="bg-slate-700 px-1 rounded">cd keeper &amp;&amp; node keeper.js</code> to enable minting.
          </p>
        </div>
      )}

      {/* Available to mint */}
      <div className="rounded-xl bg-slate-700/40 px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-slate-400">Available to mint</span>
        <span className="text-sm font-bold text-emerald-400">
          {maxMintable === null   ? "—" :
           maxMintable <= 0      ? "₦0.00 (vault full)" :
                                   formatNgn(maxMintable)}
        </span>
      </div>

      <Input
        label="nNGN to Mint"
        unit="nNGN"
        placeholder="0"
        value={amount}
        onChange={handleChange}
        disabled={!ethNgnPrice || (maxMintable !== null && maxMintable <= 0)}
        onMax={
          maxMintable && maxMintable > 0
            ? () => setAmount((maxMintable * 0.999).toFixed(2))
            : undefined
        }
      />

      {feeDisplay !== null && feeDisplay > 0 && (
        <p className="text-xs text-slate-500">
          Mint fee (0.5%): {formatNgn(feeDisplay)}
        </p>
      )}

      {previewHF !== null && (
        <div className="rounded-xl bg-slate-700/40 px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">Health Factor after mint</span>
          <span className={`text-sm font-bold tabular-nums ${hfColor}`}>
            {previewHF > 1e9 ? "∞" : previewHF.toFixed(2)}
          </span>
        </div>
      )}

      <Button type="submit" loading={isPending} disabled={isDisabled} className="w-full">
        Mint nNGN
      </Button>
    </form>
  );
};
