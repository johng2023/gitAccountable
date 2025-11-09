import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { isConnected } = useAccount();

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
    <div className="bg-slate-900 min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="max-w-5xl mx-auto px-6 py-24 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight"
          variants={itemVariants}
        >
          GitAccountable
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-slate-300 mb-4 font-light"
          variants={itemVariants}
        >
          Stay accountable. Build consistently. Earn rewards.
        </motion.p>
        <motion.p
          className="text-base text-slate-400 mb-12 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Stake ETH, commit daily for 7 days, and earn staking rewards. Miss one day, lose it all.
        </motion.p>

        {/* CTA */}
        <motion.div className="flex justify-center" variants={itemVariants}>
          {isConnected ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/create"
                className="relative bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg text-base transition-all shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-30 blur-lg transition-opacity -z-10" />
                Create Commitment
              </Link>
            </motion.div>
          ) : (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <motion.button
                  onClick={openConnectModal}
                  className="relative bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg text-base transition-all shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-30 blur-lg transition-opacity -z-10" />
                  Connect Wallet
                </motion.button>
              )}
            </ConnectButton.Custom>
          )}
        </motion.div>
      </motion.div>

      {/* Explanation Section */}
      <motion.div
        className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { title: 'Stake & Earn', desc: 'Deposit 0.01 ETH and earn eETH staking rewards for 7 days.' },
          { title: 'Commit Daily', desc: 'Make at least one GitHub commit every day for 7 days straight.' },
          { title: 'Claim Rewards', desc: 'Complete all days to claim your eETH. Miss one, lose everything.' },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="border border-slate-700/50 bg-slate-800/10 backdrop-blur-md rounded-lg p-6 hover:border-orange-500/30 transition-all duration-300 shadow-lg shadow-orange-500/5 hover:shadow-orange-500/20"
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: '0 0 30px rgba(249, 115, 22, 0.2)' }}
          >
            <div className="text-4xl font-bold text-orange-500 mb-3">0{idx + 1}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-slate-400 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* How It Works */}
      <motion.div
        className="max-w-5xl mx-auto px-6 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-white"
          variants={itemVariants}
        >
          How It Works
        </motion.h2>
        <motion.div className="space-y-8">
          {[
            { num: 1, title: 'Connect & Stake', desc: 'Link your wallet and GitHub, then stake 0.01 ETH. Your ETH is instantly converted to eETH through Ether.Fi.' },
            { num: 2, title: 'Build for 7 Days', desc: 'Make at least one commit every day. Your eETH earns staking rewards automatically during this period.' },
            { num: 3, title: 'Claim or Lose', desc: 'Complete all 7 days to claim your eETH with rewards. Miss even one day and forfeit your stake.' },
          ].map((step, idx) => (
            <motion.div
              key={idx}
              className="flex items-start gap-6"
              variants={itemVariants}
            >
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-orange-500/30 rounded-lg blur-lg animate-pulse" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-lg border-2 border-orange-500 bg-slate-800 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow">
                  <span className="font-bold text-orange-500">{step.num}</span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-2">{step.title}</h4>
                <p className="text-slate-400">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Footer */}
      <div className="border-t border-slate-700 py-8 text-center">
        <p className="text-slate-500 text-sm">Built for developers who want accountability</p>
      </div>
    </div>
  );
}
