import { useReadContracts, usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { parseAbiItem, type AbiEvent } from "viem";
import { ngnContract, engineContract } from "../lib/contracts";
import { MIN_COLLATERAL_RATIO } from "../lib/constants";

const DEPLOYMENT_BLOCK = 273045217n;
const CHUNK = 50_000n;

export function useProtocolStats() {
  const publicClient = usePublicClient();

  const { data: reads } = useReadContracts({
    contracts: [{ ...ngnContract, functionName: "totalSupply" }],
    query: { refetchInterval: 30_000 },
  });

  const totalSupplyRaw = reads?.[0]?.result as bigint | undefined;

  const { data: vaultCount } = useQuery({
    queryKey: ["protocolVaultCount"],
    queryFn: async () => {
      if (!publicClient) return null;
      const addressSet = new Set<string>();
      try {
        const latest = await publicClient.getBlockNumber();
        let current = DEPLOYMENT_BLOCK;
        while (current <= latest) {
          const toBlock = current + CHUNK - 1n > latest ? latest : current + CHUNK - 1n;
          try {
            const logs = await publicClient.getLogs({
              address: engineContract.address,
              event: parseAbiItem(
                "event CollateralDeposited(address indexed user, uint256 amountWei)"
              ) as AbiEvent,
              fromBlock: current,
              toBlock,
            });
            logs.forEach((l) => {
              const user = (l.args as { user?: string }).user;
              if (user) addressSet.add(user);
            });
          } catch {
            // skip failed chunk
          }
          current += CHUNK;
        }
      } catch {
        // getBlockNumber failed
      }
      return addressSet.size > 0 ? addressSet.size : null;
    },
    enabled: !!publicClient,
    refetchInterval: 60_000,
    staleTime: 60_000,
  });

  return {
    totalSupply:
      totalSupplyRaw !== undefined
        ? Number(totalSupplyRaw / 10n ** 18n)
        : null,
    minCollateralRatio: Number(MIN_COLLATERAL_RATIO / 10n ** 16n),
    vaultCount: vaultCount ?? null,
  };
}
