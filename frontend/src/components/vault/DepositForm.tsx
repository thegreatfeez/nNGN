import { type FC, useState } from "react";
import { useBalance, useAccount } from "wagmi";
import { useDeposit } from "../../hooks/useVault";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";
import toast from "react-hot-toast";
import { weiToEth, parseContractError } from "../../lib/utils";

export const DepositForm: FC = () => {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { deposit, isPending } = useDeposit();

  const maxEth = balance ? weiToEth(balance.value) : 0;

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
      <p className="text-xs text-slate-500">Balance: {maxEth.toFixed(4)} ETH</p>
      <Button type="submit" loading={isPending} className="w-full">
        Deposit ETH
      </Button>
    </form>
  );
};
