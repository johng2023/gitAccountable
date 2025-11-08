import { createContext, useContext } from 'react';
import { useAccount, useChainId } from 'wagmi';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const value = {
    address,
    isConnected,
    chain: { id: chainId || 11155111, name: 'Sepolia' },
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
