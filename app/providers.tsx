"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { supportedChains } from "@/config";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";

// 1. Get projectId
const projectId = "c30ea60fc81e88686fa928eaed940347";

// 2. Create wagmiConfig
const metadata = { name: "Etheract" };

const chains = supportedChains;
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
});

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
    </ThemeProvider>
  );
}
