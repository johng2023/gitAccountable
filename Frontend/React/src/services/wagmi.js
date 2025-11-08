import { sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'test_project_id';

// Use RainbowKit's getDefaultConfig which automatically includes many wallets
// This will show all available wallets including Phantom, MetaMask, Coinbase, Trust, etc.
// RainbowKit automatically detects injected wallets (like Phantom when it's installed)
export const wagmiConfig = getDefaultConfig({
  appName: 'GitAccountable',
  projectId: projectId,
  chains: [sepolia],
  // getDefaultConfig automatically includes:
  // - MetaMask
  // - Coinbase Wallet
  // - WalletConnect
  // - Injected wallets (Phantom, Trust, etc. when installed)
  // - And many more
});

export const SEPOLIA_CHAIN_ID = 11155111;
export const eETH_ADDRESS = '0x0305ea0a4b43a12e3d130448e9b4711932231e83';
export const eETH_DECIMALS = 18;
