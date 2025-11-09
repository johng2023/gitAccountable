import { Routes, Route, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CreateCommitment from './pages/CreateCommitment';
import GitHubCallback from './pages/GitHubCallback';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
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

          {/* GitHub OAuth Callback - Public (handles OAuth redirect) */}
          <Route path="/auth/github/callback" element={<GitHubCallback />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
