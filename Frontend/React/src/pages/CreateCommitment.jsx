import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { useCreateCommitment } from '../hooks/useCreateCommitment';
import { useIsCommitmentActive } from '../hooks/useCommitment';
import { useGitHubAuth } from '../hooks/useGitHubAuth';
import { STAKE_AMOUNT, DURATION_DAYS } from '../config/contracts';
import ConnectGitHub from '../components/ConnectGitHub';

export default function CreateCommitment() {
  const navigate = useNavigate();
  const { address } = useAccount();

  const isActive = useIsCommitmentActive(address);
  const { githubData, isConnected: isGitHubConnected } = useGitHubAuth();
  const {
    createCommitment,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useCreateCommitment();

  // Get username from GitHub connection
  const effectiveUsername = isGitHubConnected && githubData ? githubData.username : '';

  // Redirect to dashboard after confirmation
  if (isConfirmed) {
    setTimeout(() => navigate('/dashboard'), 2000);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!effectiveUsername.trim()) {
      alert('Please connect your GitHub account to continue');
      return;
    }
    createCommitment(effectiveUsername.trim());
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  // If user already has active commitment
  if (isActive) {
    return (
      <motion.div
        className="bg-slate-900 min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-2xl mx-auto px-6 py-12">
          <motion.div
            className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-8 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-orange-400">
              You Already Have an Active Commitment
            </h2>
            <p className="text-slate-300 mb-6">
              You can only have one commitment at a time. Check your dashboard to view your progress.
            </p>
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Dashboard
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-slate-900 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          className="border border-slate-700 rounded-lg p-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Start Your Accountability Journey
          </h1>

        <motion.form onSubmit={handleSubmit} className="space-y-6">
          {/* GitHub Connection Section */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              GitHub Account
            </label>
            <ConnectGitHub showDetails={true} />
          </motion.div>

          {/* Commitment Details */}
          <motion.div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 space-y-4" variants={itemVariants}>
            <div className="flex justify-between">
              <span className="text-slate-400">Stake Amount:</span>
              <span className="font-semibold text-white">{STAKE_AMOUNT} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Duration:</span>
              <span className="font-semibold text-white">{DURATION_DAYS} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Integration:</span>
              <span className="font-semibold text-white">Ether.Fi eETH</span>
            </div>
            <div className="pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-300">
                💡 <strong>Earn while you build:</strong> Your ETH will be staked through Ether.Fi to earn eETH rewards during the 7-day period!
              </p>
            </div>
          </motion.div>

          {/* Warning */}
          <motion.div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4" variants={itemVariants}>
            <p className="text-sm text-red-400">
              ⚠️ <strong>Important:</strong> You must make at least one GitHub commit every day for 7 consecutive days.
              Missing even one day will result in forfeiting your entire stake (including rewards) to the contract owner.
            </p>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isPending || isConfirming || !effectiveUsername.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors disabled:cursor-not-allowed"
            variants={itemVariants}
            whileHover={{ scale: !isPending && !isConfirming ? 1.02 : 1 }}
            whileTap={{ scale: !isPending && !isConfirming ? 0.95 : 1 }}
          >
            {isPending && 'Waiting for approval...'}
            {isConfirming && 'Confirming transaction...'}
            {!isPending && !isConfirming && 'Lock It In & Start Earning'}
          </motion.button>

          {/* GitHub connection reminder */}
          {!isGitHubConnected && (
            <motion.div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4" variants={itemVariants}>
              <p className="text-sm text-orange-400">
                💡 <strong>Tip:</strong> Connect your GitHub account above to enable commitment tracking!
              </p>
            </motion.div>
          )}
        </motion.form>

        {/* Transaction Status */}
        {hash && (
          <div className="mt-6 p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <p className="text-sm text-slate-300 mb-3">
              Transaction submitted
            </p>
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

        {/* Success Message */}
        {isConfirmed && (
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500 rounded-lg text-center">
            <p className="text-emerald-400 font-semibold mb-2">
              ✅ Commitment Created Successfully!
            </p>
            <p className="text-slate-300 text-sm">
              Redirecting to dashboard...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">
              ❌ Error: {error.message || 'Transaction failed'}
            </p>
          </div>
        )}
      </motion.div>
        </div>
    </motion.div>
  );
}
