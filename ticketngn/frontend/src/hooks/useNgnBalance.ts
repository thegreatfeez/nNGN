import { useReadContract } from "wagmi";
import { NNGN_ADDRESS, NNGN_ABI } from "../lib/nngn";

export function useNgnBalance(address?: `0x${string}`): bigint | null {
  const { data } = useReadContract({
    address: NNGN_ADDRESS,
    abi: NNGN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 15_000 },
  });
  return data ?? null;
}
