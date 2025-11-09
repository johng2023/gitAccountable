import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function LandingPage() {
  const { isConnected } = useAccount();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          CommitLock
        </h1>
        <p className="text-2xl md:text-3xl text-gray-300 mb-4">
          Commit or Forfeit
        </p>
        <p className="text-lg text-gray-400 mb-8">
          Put your money where your code is. Stake ETH, earn eETH rewards, commit daily or lose it all.
        </p>

        {/* CTA */}
        <div className="flex justify-center">
          {isConnected ? (
            <Link
              to="/create"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
            >
              Create Commitment
            </Link>
          ) : (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
                >
                  Connect Wallet to Start
                </button>
              )}
            </ConnectButton.Custom>
          )}
        </div>
      </div>

      {/* Explanation Section */}
      <div className="grid md:grid-cols-3 gap-6 py-12">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <div className="text-3xl mb-4">💰</div>
          <h3 className="text-xl font-semibold mb-2">Stake & Earn</h3>
          <p className="text-gray-400">
            Stake 0.01 ETH through Ether.Fi and automatically earn eETH staking rewards while you build.
          </p>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <div className="text-3xl mb-4">📅</div>
          <h3 className="text-xl font-semibold mb-2">Commit Daily</h3>
          <p className="text-gray-400">
            Make at least one GitHub commit every day for 7 days straight. No excuses.
          </p>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">Claim or Forfeit</h3>
          <p className="text-gray-400">
            Complete all days → claim your eETH with rewards. Miss one → forfeit everything.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-1">Connect & Stake</h4>
              <p className="text-gray-400">
                Connect your wallet and stake 0.01 ETH with your GitHub username. Your ETH is instantly staked through Ether.Fi to receive eETH.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-1">Earn While You Code</h4>
              <p className="text-gray-400">
                During your 7-day commitment, your eETH earns staking rewards automatically. The oracle checks your GitHub commits daily.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-1">Claim Your Rewards</h4>
              <p className="text-gray-400">
                After 7 successful days, claim your eETH with accrued staking rewards. If you miss even one day, the contract owner gets your forfeited eETH.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Powered By */}
      <div className="py-12 text-center border-t border-gray-700">
        <p className="text-gray-500 text-sm mb-4">Powered by</p>
        <div className="flex justify-center items-center space-x-8 text-gray-400">
          <span>Ether.Fi</span>
          <span>•</span>
          <span>Chainlink</span>
          <span>•</span>
          <span>Ethereum</span>
        </div>
      </div>
    </div>
  );
}
