import { useReadContracts } from "wagmi";

const aggregatorAbi = [
  {
    name: "latestRoundData",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "roundId", type: "uint80" },
      { name: "answer", type: "int256" },
      { name: "startedAt", type: "uint256" },
      { name: "updatedAt", type: "uint256" },
      { name: "answeredInRound", type: "uint80" },
    ],
  },
] as const;

const ETH_USD_FEED = import.meta.env.VITE_ETH_USD_FEED as `0x${string}`;
const USD_NGN_FEED = import.meta.env.VITE_USD_NGN_FEED as `0x${string}`;

export function useEthNgnPrice() {
  const { data, isLoading, isError } = useReadContracts({
    contracts: [
      { address: ETH_USD_FEED, abi: aggregatorAbi, functionName: "latestRoundData" },
      { address: USD_NGN_FEED, abi: aggregatorAbi, functionName: "latestRoundData" },
    ],
    query: { refetchInterval: 30_000 },
  });

  if (!data || isError) return { data: null, isLoading, isError };

  const ethUsdResult = data[0].result;
  const usdNgnResult = data[1].result;

  if (!ethUsdResult || !usdNgnResult) return { data: null, isLoading, isError };

  const ethUsd = Number(ethUsdResult[1]) / 1e8;
  const usdNgn = Number(usdNgnResult[1]) / 1e8;
  const ethNgn = ethUsd * usdNgn;

  return { data: ethNgn, ethUsd, usdNgn, isLoading, isError };
}
