import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { useCommitment, useCanClaim } from '../hooks/useCommitment';
import { useClaimFunds } from '../hooks/useClaimFunds';

export default function Dashboard() {
  const { address } = useAccount();
  const { commitment, isLoading, refetch } = useCommitment(address);
  const canClaim = useCanClaim(address);
  const {
    claimFunds,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useClaimFunds();

  // Refetch after claim
  if (isConfirmed) {
    setTimeout(() => refetch(), 2000);
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-400 mt-4">Loading commitment data...</p>
      </div>
    );
  }

  // No active commitment
  if (!commitment || commitment.startTime === 0n) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">No Active Commitment</h2>
          <p className="text-gray-400 mb-8">
            You don't have an active commitment yet. Create one to start earning eETH rewards!
          </p>
          <Link
            to="/create"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
          >
            Create Commitment
          </Link>
        </div>
      </div>
    );
  }

  // Calculate progress
  const daysCompleted = Number(commitment.daysCompleted);
  const progress = (daysCompleted / 7) * 100;
  const startDate = new Date(Number(commitment.startTime) * 1000);
  const eethAmount = formatEther(commitment.eethAmount);

  // Estimate rewards (simplified - in reality would need price feed)
  const estimatedRewards = Number(eethAmount) * 0.04 * (7 / 365); // ~4% APY

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Your Commitment</h1>
        <p className="text-blue-100">
          GitHub: <span className="font-semibold">{commitment.githubUsername}</span>
        </p>
        <p className="text-blue-100 text-sm">
          Started: {startDate.toLocaleDateString()}
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Progress</h2>
          <span className="text-3xl font-bold text-blue-400">
            {daysCompleted}/7
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm mt-2">{progress.toFixed(0)}% Complete</p>
        </div>

        {/* Daily Checks */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Daily Status</h3>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, i) => {
              const isChecked = commitment.dailyChecks[i];
              const isCurrentDay = i === daysCompleted && !commitment.forfeited && !commitment.claimed;

              return (
                <div
                  key={i}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-semibold
                    ${isChecked ? 'bg-green-600 text-white' : ''}
                    ${!isChecked && i < daysCompleted ? 'bg-red-600 text-white' : ''}
                    ${isCurrentDay ? 'bg-yellow-600 text-white animate-pulse' : ''}
                    ${!isChecked && i >= daysCompleted && !isCurrentDay ? 'bg-gray-700 text-gray-400' : ''}
                  `}
                >
                  <span className="text-xs">Day {i + 1}</span>
                  {isChecked && <span className="text-lg">✓</span>}
                  {!isChecked && i < daysCompleted && <span className="text-lg">✗</span>}
                  {isCurrentDay && <span className="text-xs mt-1">Today</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* eETH Rewards Card */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">eETH Staking Rewards</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Original Stake</p>
            <p className="text-2xl font-bold">0.01 ETH</p>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">eETH Received</p>
            <p className="text-2xl font-bold text-blue-400">
              {parseFloat(eethAmount).toFixed(6)} eETH
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Estimated Rewards (7 days)</p>
            <p className="text-2xl font-bold text-green-400">
              +{estimatedRewards.toFixed(6)} ETH
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Est. Total Value</p>
            <p className="text-2xl font-bold text-purple-400">
              ~{(Number(eethAmount) + estimatedRewards).toFixed(6)} ETH
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
          <p className="text-sm text-blue-400">
            💡 Your eETH is earning staking rewards from Ether.Fi while you work on your commitment!
          </p>
        </div>
      </div>

      {/* Status & Actions */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        {commitment.claimed && (
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-center">
            <p className="text-green-400 font-semibold text-lg">
              ✅ Commitment Completed & Claimed!
            </p>
            <p className="text-gray-400 text-sm mt-2">
              You successfully completed all 7 days and claimed your eETH rewards.
            </p>
          </div>
        )}

        {commitment.forfeited && !commitment.claimed && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-center">
            <p className="text-red-400 font-semibold text-lg">
              ❌ Commitment Forfeited
            </p>
            <p className="text-gray-400 text-sm mt-2">
              You missed at least one day. Your eETH has been forfeited to the contract owner.
            </p>
          </div>
        )}

        {!commitment.claimed && !commitment.forfeited && (
          <div>
            {canClaim ? (
              <div className="text-center">
                <p className="text-green-400 font-semibold text-lg mb-4">
                  🎉 Congratulations! You can now claim your eETH rewards!
                </p>
                <button
                  onClick={claimFunds}
                  disabled={isPending || isConfirming}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isPending && 'Waiting for approval...'}
                  {isConfirming && 'Claiming...'}
                  {!isPending && !isConfirming && `Claim ${parseFloat(eethAmount).toFixed(4)} eETH`}
                </button>
              </div>
            ) : (
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 text-center">
                <p className="text-blue-400 font-semibold">
                  Keep going! {7 - daysCompleted} day{7 - daysCompleted !== 1 ? 's' : ''} remaining.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Make sure to commit to GitHub every day to claim your eETH rewards!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Transaction Status */}
        {hash && (
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <p className="text-sm text-blue-400 mb-2">Transaction submitted!</p>
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

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-red-400 text-sm">
              ❌ Error: {error.message || 'Transaction failed'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
