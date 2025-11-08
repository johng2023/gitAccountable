import { configureChains, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

const { chains, publicClient } = configureChains(
  [sepolia],
  [publicProvider()]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.VITE_WALLETCONNECT_PROJECT_ID || 'test_project_id',
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'GitAccountable',
      },
    }),
  ],
  publicClient,
});

export const SEPOLIA_CHAIN_ID = 11155111;
export const eETH_ADDRESS = '0x0305ea0a4b43a12e3d130448e9b4711932231e83';
export const eETH_DECIMALS = 18;
