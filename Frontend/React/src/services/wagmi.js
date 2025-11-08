import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { metaMask, walletConnect, coinbaseWallet, injected } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'test_project_id',
    }),
    coinbaseWallet({
      appName: 'GitAccountable',
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
});

export const SEPOLIA_CHAIN_ID = 11155111;
export const eETH_ADDRESS = '0x0305ea0a4b43a12e3d130448e9b4711932231e83';
export const eETH_DECIMALS = 18;
