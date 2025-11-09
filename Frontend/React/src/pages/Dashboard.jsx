import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
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

  // Animated counter for days completed
  const [displayDays, setDisplayDays] = useState(0);

  // Animate counter from 0 to daysCompleted
  useEffect(() => {
    if (!commitment || commitment.startTime === 0n) {
      setDisplayDays(0);
      return;
    }

    const daysCompleted = Number(commitment.daysCompleted);
    let currentCount = 0;
    const targetCount = daysCompleted;
    const increment = Math.ceil(targetCount / 20); // 20 frames of animation
    const interval = 50; // milliseconds between increments

    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= targetCount) {
        setDisplayDays(targetCount);
        clearInterval(timer);
      } else {
        setDisplayDays(currentCount);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [commitment?.daysCompleted]);

  // Refetch after claim
  if (isConfirmed) {
    setTimeout(() => refetch(), 2000);
  }

  if (isLoading) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center">
            {/* Outer rotating ring */}
            <motion.div
              className="absolute rounded-full border-2 border-transparent border-t-orange-500 border-r-orange-500/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ width: '60px', height: '60px' }}
            />
            {/* Inner pulsing circle */}
            <motion.div
              className="absolute rounded-full border border-orange-500/20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: '60px', height: '60px' }}
            />
            {/* Center dot */}
            <motion.div
              className="w-3 h-3 rounded-full bg-orange-500"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <motion.p
            className="text-slate-400 font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading commitment data...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // No active commitment
  if (!commitment || commitment.startTime === 0n) {
    return (
      <motion.div
        className="bg-slate-900 min-h-screen flex items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-2xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="border border-slate-700/50 bg-slate-800/10 backdrop-blur-md rounded-lg p-12 text-center shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-shadow">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-3xl font-bold mb-4 text-white">No Active Commitment</h2>
            </motion.div>
            <motion.p
              className="text-slate-400 mb-8 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              You don't have an active commitment yet. Create one to start earning eETH rewards!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                to="/create"
                className="relative inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-30 blur-lg transition-opacity -z-10" />
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  Create Commitment
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Calculate progress
  const daysCompleted = Number(commitment.daysCompleted);
  const progress = (daysCompleted / 7) * 100;
  const startDate = new Date(Number(commitment.startTime) * 1000);
  const eethAmount = formatEther(commitment.eethAmount);

  // Estimate rewards (simplified - in reality would need price feed)
  const estimatedRewards = Number(eethAmount) * 0.04 * (7 / 365); // ~4% APY

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="bg-slate-900 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <motion.div
          className="border-b border-slate-700 pb-8"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold text-white mb-4">Your Commitment</h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">GitHub Account</p>
              <p className="text-xl font-semibold text-white">{commitment.githubUsername}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Started</p>
              <p className="text-white font-medium">{startDate.toLocaleDateString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          className="border border-slate-700/50 bg-slate-800/10 backdrop-blur-md rounded-lg p-8 shadow-2xl shadow-orange-500/10 hover:border-orange-500/30 transition-colors"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <div className="mb-8">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Progress</h2>
              <motion.span
                className="text-4xl font-bold text-orange-500"
                key={displayDays}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {displayDays}/7
              </motion.span>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden border border-slate-700/50 backdrop-blur-sm">
                <motion.div
                  className="h-3 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shadow-lg shadow-orange-500/50"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
              <p className="text-slate-400 text-sm mt-3">{progress.toFixed(0)}% Complete</p>
            </div>
          </div>

          {/* Daily Checks */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">7-Day Streak</h3>
            <div className="grid grid-cols-7 gap-3">
              {Array.from({ length: 7 }, (_, i) => {
                const isChecked = commitment.dailyChecks[i];
                const isCurrentDay = i === daysCompleted && !commitment.forfeited && !commitment.claimed;
                const estimatedDayReward = 0.00000571; // ~eETH per day for 0.01 ETH

                return (
                  <motion.div
                    key={i}
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center font-semibold border backdrop-blur-sm cursor-pointer relative group
                      ${isChecked ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 hover:border-emerald-400' : ''}
                      ${!isChecked && i < daysCompleted ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 hover:border-red-400' : ''}
                      ${isCurrentDay ? 'bg-orange-500/20 border-orange-500 text-orange-400 hover:bg-orange-500/30 hover:shadow-lg hover:shadow-orange-500/50' : ''}
                      ${!isChecked && i >= daysCompleted && !isCurrentDay ? 'bg-slate-800/30 border-slate-700/50 text-slate-500 hover:bg-slate-700/40 hover:border-slate-600' : ''}
                      transition-all duration-300
                    `}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                    whileHover={{ scale: 1.12, y: -4 }}
                  >
                    <span className="text-xs font-medium">Day {i + 1}</span>
                    {isChecked && <motion.span className="text-lg mt-1" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }}>✓</motion.span>}
                    {!isChecked && i < daysCompleted && <motion.span className="text-lg mt-1" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.4 }}>✕</motion.span>}

                    {/* Hover Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {isChecked ? `+${(estimatedDayReward * 0.04).toFixed(5)} eETH` : 'Pending'}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* eETH Rewards Card */}
        <motion.div
          className="border border-slate-700/50 bg-slate-800/10 backdrop-blur-md rounded-lg p-8 shadow-2xl shadow-orange-500/10 hover:border-orange-500/30 transition-colors"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Staking Rewards</h2>

          <motion.div
            className="grid md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: 'Staked', value: '0.01 ETH', color: 'text-white' },
              { label: 'eETH Received', value: `${parseFloat(eethAmount).toFixed(6)} eETH`, color: 'text-orange-400' },
              { label: 'Est. Rewards', value: `+${estimatedRewards.toFixed(6)} ETH`, color: 'text-emerald-400' },
              { label: 'Total Value', value: `~${(Number(eethAmount) + estimatedRewards).toFixed(6)} ETH`, color: 'text-slate-300' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="border border-slate-700/50 bg-slate-800/20 backdrop-blur-sm rounded-lg p-4 hover:bg-slate-800/40 hover:border-orange-500/50 transition-all duration-300 group"
                variants={itemVariants}
                whileHover={{ y: -2, boxShadow: '0 0 20px rgba(249, 115, 22, 0.15)' }}
              >
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">{item.label}</p>
                <motion.p
                  className={`text-2xl font-bold ${item.color} font-mono`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 + 0.3, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.value}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Status & Actions */}
        <motion.div
          className="border border-slate-700/50 bg-slate-800/10 backdrop-blur-md rounded-lg p-8 shadow-2xl shadow-orange-500/10 hover:border-orange-500/30 transition-colors"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          {commitment.claimed && (
            <div className="bg-emerald-500/10 border border-emerald-500 rounded-lg p-6 text-center">
              <p className="text-emerald-400 font-semibold text-lg mb-2">
                ✓ Completed & Claimed
              </p>
              <p className="text-slate-300 text-sm">
                You completed all 7 days and claimed your eETH rewards.
              </p>
            </div>
          )}

          {commitment.forfeited && !commitment.claimed && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
              <p className="text-red-400 font-semibold text-lg mb-2">
                Commitment Forfeited
              </p>
              <p className="text-slate-300 text-sm">
                Your eETH has been forfeited to the contract owner.
              </p>
            </div>
          )}

          {!commitment.claimed && !commitment.forfeited && (
            <div>
              {canClaim ? (
                <div className="text-center">
                  <p className="text-white font-semibold text-lg mb-6">
                    Ready to claim your rewards?
                  </p>
                  <motion.button
                    onClick={claimFunds}
                    disabled={isPending || isConfirming}
                    className="relative bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 px-8 rounded-lg transition-all disabled:cursor-not-allowed overflow-hidden group"
                    whileHover={{ scale: !isPending && !isConfirming ? 1.05 : 1 }}
                    whileTap={{ scale: !isPending && !isConfirming ? 0.95 : 1 }}
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-30 blur-lg transition-opacity -z-10" />

                    {/* Shadow */}
                    <div className="absolute inset-0 shadow-lg shadow-orange-500/50 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity -z-10" />

                    {isPending && (
                      <>
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          ⏳ Waiting for approval...
                        </motion.span>
                      </>
                    )}
                    {isConfirming && (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="inline-block mr-2"
                        >
                          ⚙️
                        </motion.span>
                        Claiming...
                      </>
                    )}
                    {!isPending && !isConfirming && `Claim ${parseFloat(eethAmount).toFixed(4)} eETH`}
                  </motion.button>
                </div>
              ) : (
                <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-6 text-center">
                  <p className="text-orange-400 font-semibold mb-2">
                    {7 - daysCompleted} day{7 - daysCompleted !== 1 ? 's' : ''} remaining
                  </p>
                  <p className="text-slate-300 text-sm">
                    Keep committing daily to claim your rewards
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Transaction Status */}
          {hash && (
            <div className="mt-6 p-4 bg-slate-800 border border-slate-700 rounded-lg">
              <p className="text-sm text-slate-300 mb-3">Transaction submitted</p>
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 text-sm underline break-all"
              >
                View on Etherscan →
              </a>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">
                Error: {error.message || 'Transaction failed'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
