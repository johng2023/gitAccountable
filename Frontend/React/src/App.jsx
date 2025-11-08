import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { wagmiConfig } from './services/wagmi';
import { WalletProvider } from './context/WalletContext';
import { AppProvider } from './context/AppContext';

import MainLayout from './components/layout/MainLayout';
import Landing from './components/pages/Landing';
import CreateCommitment from './components/pages/CreateCommitment';
import Dashboard from './components/pages/Dashboard';
import Callback from './components/pages/Callback';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <WalletProvider>
            <AppProvider>
              <Router>
                <Routes>
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/callback" element={<Callback />} />
                    <Route path="/create" element={<CreateCommitment />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                  </Route>
                </Routes>
              </Router>
            </AppProvider>
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
