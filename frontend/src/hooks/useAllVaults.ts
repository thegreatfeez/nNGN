import { useQuery } from "@tanstack/react-query";
import { usePublicClient, useAccount } from "wagmi";
import { parseAbiItem, type Abi, type AbiEvent } from "viem";
import { engineContract } from "../lib/contracts";

export interface VaultSummary {
  owner: `0x${string}`;
  collateralWei: bigint;
  debtNgn: bigint;
  healthFactor: bigint;
}

const DEPLOYMENT_BLOCK = 273045217n;

async function fetchLogsChunked(
  publicClient: NonNullable<ReturnType<typeof usePublicClient>>,
  fromBlock: bigint,
  eventAbi: ReturnType<typeof parseAbiItem>
) {
  const CHUNK = 50_000n;
  let current = fromBlock;
  const allLogs: Array<{ args: Record<string, unknown> }> = [];

  try {
    const latest = await publicClient.getBlockNumber();
    while (current <= latest) {
      const toBlock = current + CHUNK - 1n > latest ? latest : current + CHUNK - 1n;
      try {
        const logs = await publicClient.getLogs({
          address: engineContract.address,
          event: eventAbi as AbiEvent,
          fromBlock: current,
          toBlock,
        });
        allLogs.push(...(logs as typeof allLogs));
      } catch {
        // chunk failed — skip it, try next
      }
      current += CHUNK;
    }
  } catch {
    // getBlockNumber failed — return whatever we got
  }

  return allLogs;
}

export function useAllVaults() {
  const publicClient = usePublicClient();
  const { address: connectedAddress } = useAccount();

  return useQuery({
    queryKey: ["allVaults", connectedAddress],
    queryFn: async (): Promise<VaultSummary[]> => {
      if (!publicClient) return [];

      // Collect unique owner addresses from two event sources
      const addressSet = new Set<`0x${string}`>();

      // Always include the connected user — works even if getLogs fails
      if (connectedAddress) addressSet.add(connectedAddress);

      // Try to find more vault owners via events (chunked to respect RPC limits)
      try {
        const depositLogs = await fetchLogsChunked(
          publicClient,
          DEPLOYMENT_BLOCK,
          parseAbiItem("event CollateralDeposited(address indexed user, uint256 amountWei)")
        );
        depositLogs.forEach((l) => {
          const user = (l.args as { user?: `0x${string}` }).user;
          if (user) addressSet.add(user);
        });
      } catch {
        // event scan failed — connected user is still in the set
      }

      const owners = [...addressSet];
      if (owners.length === 0) return [];

      const engineAbi = engineContract.abi as Abi;
      const results = await publicClient.multicall({
        contracts: owners.flatMap((owner) => [
          { address: engineContract.address, abi: engineAbi, functionName: "getVault", args: [owner] },
          { address: engineContract.address, abi: engineAbi, functionName: "getHealthFactor", args: [owner] },
        ]),
      });

      const summaries: VaultSummary[] = [];
      for (let i = 0; i < owners.length; i++) {
        const vaultResult = results[i * 2];
        const hfResult = results[i * 2 + 1];
        if (vaultResult.status === "success" && hfResult.status === "success") {
          const v = vaultResult.result as { collateralWei: bigint; debtNgn: bigint };
          // Skip empty vaults
          if (v.collateralWei === 0n && v.debtNgn === 0n) continue;
          summaries.push({
            owner: owners[i],
            collateralWei: v.collateralWei,
            debtNgn: v.debtNgn,
            healthFactor: hfResult.result as bigint,
          });
        }
      }

      return summaries.sort((a, b) => {
        if (a.healthFactor < b.healthFactor) return -1;
        if (a.healthFactor > b.healthFactor) return 1;
        return 0;
      });
    },
    enabled: !!publicClient,
    refetchInterval: 30_000,
  });
}
