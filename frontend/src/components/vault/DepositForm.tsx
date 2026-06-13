import { type FC, useState } from "react";
import { useBalance, useAccount } from "wagmi";
import { useDeposit } from "../../hooks/useVault";
import { useEthNgnPrice } from "../../hooks/useEthNgnPrice";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";
import toast from "react-hot-toast";
import { weiToEth, formatNgn, parseContractError } from "../../lib/utils";

export const DepositForm: FC = () => {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { deposit, isPending } = useDeposit();
  const { data: ethNgnPrice } = useEthNgnPrice();

  const maxEth = balance ? weiToEth(balance.value) : 0;
  const parsedAmount = parseFloat(amount) || 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    try {
      await deposit(val);
      toast.success("Collateral deposited!");
      setAmount("");
    } catch (err: unknown) {
      toast.error(parseContractError(err));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="ETH Amount"
        unit="ETH"
        placeholder="0.0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onMax={() => setAmount(Math.max(0, maxEth - 0.01).toFixed(4))}
      />
      {parsedAmount > 0 && ethNgnPrice && (
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">
          ≈ {formatNgn(parsedAmount * ethNgnPrice)}
        </p>
      )}
      <p className="text-xs text-slate-500 dark:text-slate-400">Balance: {maxEth.toFixed(4)} ETH</p>
      <Button type="submit" loading={isPending} className="w-full">
        Deposit ETH
      </Button>
    </form>
  );
};
