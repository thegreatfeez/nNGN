import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { defineChain } from "viem";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string;

export const arbitrumSepolia = defineChain({
  id: 421614,
  name: "Arbitrum Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        (import.meta.env.VITE_ARB_RPC_URL as string) ||
          "https://sepolia-rollup.arbitrum.io/rpc",
      ],
    },
  },
  blockExplorers: {
    default: { name: "Arbiscan", url: "https://sepolia.arbiscan.io" },
  },
  contracts: {
    multicall3: { address: "0xcA11bde05977b3631167028862bE2a173976CA11" },
  },
  testnet: true,
});

export const wagmiAdapter = new WagmiAdapter({
  networks: [arbitrumSepolia],
  projectId: projectId || "placeholder",
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

createAppKit({
  adapters: [wagmiAdapter],
  networks: [arbitrumSepolia],
  projectId: projectId || "placeholder",
  metadata: {
    name: "TicketNGN",
    description: "Event tickets powered by nNGN on Arbitrum",
    url: "https://ticketngn.app",
    icons: ["/ticket.svg"],
  },
  features: { analytics: false },
});
