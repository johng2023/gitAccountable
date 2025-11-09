import { Routes, Route, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CreateCommitment from './pages/CreateCommitment';

// Components
import Navigation from './components/Navigation';

/**
 * Main App Component
 *
 * Routes:
 * - / : Landing page (public)
 * - /dashboard : View commitment status (requires wallet)
 * - /create : Create new commitment (requires wallet)
 */
export default function App() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation />

      <main>
        <Routes>
          {/* Landing Page - Public */}
          <Route path="/" element={<LandingPage />} />

          {/* Dashboard - Requires Connection */}
          <Route
            path="/dashboard"
            element={
              isConnected ? <Dashboard /> : <Navigate to="/" replace />
            }
          />

          {/* Create Commitment - Requires Connection */}
          <Route
            path="/create"
            element={
              isConnected ? <CreateCommitment /> : <Navigate to="/" replace />
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
