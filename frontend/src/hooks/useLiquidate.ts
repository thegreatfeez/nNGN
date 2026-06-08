import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { engineContract, ngnContract } from "../lib/contracts";
import { displayToNngnBase } from "../lib/utils";

export function useLiquidate() {
  const { address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    ...ngnContract,
    functionName: "allowance",
    args: address ? [address, engineContract.address] : undefined,
    query: { enabled: !!address },
  });

  async function liquidate(vaultOwner: `0x${string}`, debtToCoverNgn: number) {
    const amount = displayToNngnBase(debtToCoverNgn);
    if ((allowance as bigint | undefined) === undefined || (allowance as bigint) < amount) {
      await writeContractAsync({
        ...ngnContract,
        functionName: "approve",
        args: [engineContract.address, amount * 2n],
      });
      await refetchAllowance();
    }
    return writeContractAsync({
      ...engineContract,
      functionName: "liquidate",
      args: [vaultOwner, amount],
    });
  }

  return { liquidate, isPending };
}
