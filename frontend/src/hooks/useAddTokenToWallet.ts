import { useWalletClient } from "wagmi";

export function useAddNgnToWallet() {
  const { data: walletClient } = useWalletClient();

  async function addToken() {
    if (!walletClient) return;
    await walletClient.watchAsset({
      type: "ERC20",
      options: {
        address: import.meta.env.VITE_NNGN_ADDRESS,
        symbol: "nNGN",
        decimals: 18,
        image: `${window.location.origin}/nNGNlogo.png`,
      },
    });
  }

  return { addToken };
}
