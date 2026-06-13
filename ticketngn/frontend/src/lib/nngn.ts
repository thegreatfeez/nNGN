import { formatUnits, parseUnits } from "viem";

export const NNGN_ADDRESS = "0xb4C0f815950E1AEC52EdAf9a80586EBFF2c42946" as const;
export const NNGN_CHAIN_ID = 421614;

export const NNGN_ABI = [
  {
    name: "balanceOf", type: "function", stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "allowance", type: "function", stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "transfer", type: "function", stateMutability: "nonpayable",
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export const formatNgn = (raw: bigint): string =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(formatUnits(raw, 18)));

export const parseNgn = (amount: string): bigint => parseUnits(amount, 18);

export const ngnBalanceDisplay = (raw: bigint): string =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(formatUnits(raw, 18)));
