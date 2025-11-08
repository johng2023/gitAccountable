import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { wagmiConfig } from './services/wagmi';
import { WalletProvider } from './context/WalletContext';
import { AppProvider } from './context/AppContext';

import MainLayout from './components/layout/MainLayout';
import Landing from './components/pages/Landing';
import CreateCommitment from './components/pages/CreateCommitment';
import Dashboard from './components/pages/Dashboard';

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider>
        <WalletProvider>
          <AppProvider>
            <Router>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/create" element={<CreateCommitment />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
              </Routes>
            </Router>
          </AppProvider>
        </WalletProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
