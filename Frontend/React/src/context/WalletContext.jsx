import { createContext, useContext } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const value = {
    address,
    isConnected,
    chain: chain || { id: 11155111, name: 'Sepolia' },
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
