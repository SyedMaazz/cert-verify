'use client';
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { http } from 'wagmi';
import { polygon, hardhat, polygonAmoy } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'CertVerify',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || '12345',
  chains: [polygonAmoy, hardhat, polygon],
  transports: {
   [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc-amoy.polygon.technology'),
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [polygon.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

