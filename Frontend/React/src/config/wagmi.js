import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

/**
 * Wagmi Configuration for CommitLock dApp
 *
 * Configured for Sepolia testnet only
 */

// Project configuration from WalletConnect Cloud
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

export const config = getDefaultConfig({
  appName: 'CommitLock',
  projectId: projectId,
  chains: [sepolia],
  ssr: false, // Not using SSR with Vite
});

// Alternative minimal config (if RainbowKit's default has issues)
export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
});
