import { type FC, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../../lib/appkit";

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
);
