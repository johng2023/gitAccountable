import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useCreateCommitment } from '../hooks/useCreateCommitment';
import { useIsCommitmentActive } from '../hooks/useCommitment';
import { STAKE_AMOUNT, DURATION_DAYS } from '../config/contracts';

export default function CreateCommitment() {
  const [githubUsername, setGithubUsername] = useState('');
  const navigate = useNavigate();
  const { address } = useAccount();

  const isActive = useIsCommitmentActive(address);
  const {
    createCommitment,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useCreateCommitment();

  // Redirect to dashboard after confirmation
  if (isConfirmed) {
    setTimeout(() => navigate('/dashboard'), 2000);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!githubUsername.trim()) {
      alert('Please enter your GitHub username');
      return;
    }
    createCommitment(githubUsername.trim());
  };

  // If user already has active commitment
  if (isActive) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">
            You Already Have an Active Commitment
          </h2>
          <p className="text-gray-300 mb-6">
            You can only have one commitment at a time. Check your dashboard to view your progress.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Create Commitment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* GitHub Username Input */}
          <div>
            <label htmlFor="github" className="block text-sm font-medium mb-2">
              GitHub Username
            </label>
            <input
              type="text"
              id="github"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="octocat"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              disabled={isPending || isConfirming}
            />
            <p className="text-gray-500 text-sm mt-2">
              We'll track commits from this GitHub account
            </p>
          </div>

          {/* Commitment Details */}
          <div className="bg-gray-900/50 rounded-lg p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Stake Amount:</span>
              <span className="font-semibold">{STAKE_AMOUNT} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duration:</span>
              <span className="font-semibold">{DURATION_DAYS} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Integration:</span>
              <span className="font-semibold">Ether.Fi eETH</span>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                💡 <strong>Earn while you build:</strong> Your ETH will be staked through Ether.Fi to earn eETH rewards during the 7-day period!
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-sm text-red-400">
              ⚠️ <strong>Important:</strong> You must make at least one GitHub commit every day for 7 consecutive days.
              Missing even one day will result in forfeiting your entire stake (including rewards) to the contract owner.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending || isConfirming || !githubUsername.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isPending && 'Waiting for approval...'}
            {isConfirming && 'Confirming transaction...'}
            {!isPending && !isConfirming && 'Lock It In & Start Earning'}
          </button>
        </form>

        {/* Transaction Status */}
        {hash && (
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <p className="text-sm text-blue-400 mb-2">
              Transaction submitted!
            </p>
            <a
              href={`https://sepolia.etherscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm underline break-all"
            >
              View on Etherscan →
            </a>
          </div>
        )}

        {/* Success Message */}
        {isConfirmed && (
          <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg text-center">
            <p className="text-green-400 font-semibold mb-2">
              ✅ Commitment Created Successfully!
            </p>
            <p className="text-gray-400 text-sm">
              Redirecting to dashboard...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-red-400 text-sm">
              ❌ Error: {error.message || 'Transaction failed'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
