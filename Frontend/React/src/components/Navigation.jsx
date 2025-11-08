import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Navigation() {
  const { isConnected } = useAccount();

  return (
    <nav className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              CommitLock
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isConnected && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/create"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Create Commitment
                </Link>
              </>
            )}

            {/* RainbowKit Connect Button */}
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
