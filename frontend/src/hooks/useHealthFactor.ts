import { useReadContract } from "wagmi";
import { engineContract } from "../lib/contracts";

export type HealthStatus = "Safe" | "At Risk" | "Liquidatable";

export function useHealthFactor(address: `0x${string}` | undefined) {
  const { data, isLoading } = useReadContract({
    ...engineContract,
    functionName: "getHealthFactor",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 15_000 },
  });

  const hfBigInt = data as bigint | undefined;
  const hfNumber = hfBigInt !== undefined ? Number(hfBigInt) / 1e18 : null;

  function getStatus(): HealthStatus {
    if (hfNumber === null) return "Safe";
    if (hfNumber < 1.0) return "Liquidatable";
    if (hfNumber < 1.25) return "At Risk";
    return "Safe";
  }

  function getColor(): string {
    const status = getStatus();
    if (status === "Liquidatable") return "text-red-500";
    if (status === "At Risk") return "text-yellow-500";
    return "text-green-500";
  }

  return {
    hfBigInt: hfBigInt ?? 0n,
    hfNumber,
    status: getStatus(),
    color: getColor(),
    isLoading,
  };
}
