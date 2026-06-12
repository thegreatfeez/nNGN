import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { NNGN_ADDRESS, NNGN_ABI, parseNgn } from "../lib/nngn";

type Step = "idle" | "signing" | "confirming" | "verifying" | "done" | "error";

export function usePayWithNgn() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);

  const { isSuccess: confirmed } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: !!txHash && step === "confirming" },
  });

  async function pay(
    recipientAddress: `0x${string}`,
    amountNgn: string
  ): Promise<`0x${string}` | null> {
    if (!address) {
      setError("Wallet not connected");
      return null;
    }

    setError(null);
    setStep("signing");

    try {
      const hash = await writeContractAsync({
        address: NNGN_ADDRESS,
        abi: NNGN_ABI,
        functionName: "transfer",
        args: [recipientAddress, parseNgn(amountNgn)],
      });
      setTxHash(hash);
      setStep("confirming");
      return hash;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      const friendly = msg.includes("User rejected") || msg.includes("4001")
        ? "Transaction cancelled."
        : "Transaction failed. Please try again.";
      setError(friendly);
      setStep("error");
      return null;
    }
  }

  function reset() {
    setStep("idle");
    setError(null);
    setTxHash(undefined);
  }

  return { pay, txHash, step, confirmed, error, reset };
}
