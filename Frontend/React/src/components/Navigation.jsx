import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';

export default function Navigation() {
  const { isConnected } = useAccount();

  return (
    <motion.nav
      className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-md shadow-lg shadow-orange-500/5"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">
                GitAccountable
              </span>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {isConnected && (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <Link
                    to="/dashboard"
                    className="text-slate-300 hover:text-orange-500 transition-colors font-medium relative"
                  >
                    Dashboard
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <Link
                    to="/create"
                    className="text-slate-300 hover:text-orange-500 transition-colors font-medium relative"
                  >
                    Create
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              </>
            )}

            {/* RainbowKit Connect Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ConnectButton />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
