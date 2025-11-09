import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setGitHubForWallet } from '../utils/walletGitHubStorage';

/**
 * GitHubCallback Page
 *
 * Handles the OAuth redirect from GitHub
 * For MVP: User confirms their GitHub username after OAuth authorization
 * (In production, would exchange code for token via backend)
 */
export default function GitHubCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('confirm'); // 'confirm' | 'verifying' | 'success' | 'error'
  const [error, setError] = useState(null);
  const [githubUser, setGithubUser] = useState(null);
  const [githubUsername, setGithubUsername] = useState('');

  // Validation state
  const [walletAddress, setWalletAddress] = useState(null);
  const [authorizationVerified, setAuthorizationVerified] = useState(false);

  useEffect(() => {
    // Verify OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    // Retrieve stored state and wallet
    const storedState = sessionStorage.getItem('github_oauth_state');
    const storedWallet = sessionStorage.getItem('github_oauth_wallet');

    // Validate state (CSRF protection)
    if (!state || state !== storedState) {
      setError('Invalid OAuth state. Please try connecting again.');
      setStatus('error');
      return;
    }

    if (!code) {
      setError('No authorization code received from GitHub');
      setStatus('error');
      return;
    }

    if (!storedWallet) {
      setError('No wallet address found. Please connect wallet and try again.');
      setStatus('error');
      return;
    }

    // OAuth verified - user authorized the app
    setAuthorizationVerified(true);
    setWalletAddress(storedWallet);
  }, []);

  const handleVerifyUsername = async () => {
    if (!githubUsername.trim()) {
      setError('Please enter your GitHub username');
      return;
    }

    setStatus('verifying');
    setError(null);

    try {
      // Verify username exists via GitHub's public API
      const response = await fetch(`https://api.github.com/users/${githubUsername.trim()}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`GitHub user "${githubUsername}" not found. Please check the spelling.`);
        } else if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again in a few minutes.');
        } else {
          throw new Error('Failed to verify GitHub username. Please try again.');
        }
      }

      const userData = await response.json();
      setGithubUser(userData);

      // Store wallet-GitHub mapping
      const success = setGitHubForWallet(walletAddress, {
        username: userData.login,
        id: userData.id,
        avatar_url: userData.avatar_url,
        access_token: null, // No token in simplified flow
      });

      if (!success) {
        throw new Error('Failed to store GitHub connection');
      }

      // Clean up session storage
      sessionStorage.removeItem('github_oauth_state');
      sessionStorage.removeItem('github_oauth_wallet');

      setStatus('success');

      // Redirect to create commitment page after 2 seconds
      setTimeout(() => {
        navigate('/create');
      }, 2000);
    } catch (err) {
      console.error('GitHub username verification error:', err);
      setError(err.message);
      setStatus('confirm'); // Go back to confirm state
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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
      className="min-h-screen bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          className="border border-slate-700/50 bg-slate-800/10 backdrop-blur-md rounded-lg p-8 shadow-2xl shadow-orange-500/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Username Confirmation State */}
          {status === 'confirm' && authorizationVerified && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="text-center mb-8" variants={itemVariants}>
                <motion.svg
                  className="w-16 h-16 text-orange-500 mx-auto mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, ease: 'backOut' }}
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </motion.svg>
                <h2 className="text-3xl font-bold mb-2 text-white">
                  GitHub Authorization Successful!
                </h2>
                <p className="text-slate-300 mb-6">
                  Please confirm your GitHub username to complete the connection
                </p>
              </motion.div>

              <motion.div
                className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-8"
                variants={itemVariants}
              >
                <p className="text-sm text-orange-300">
                  💡 We need your username to verify and link it to your wallet
                </p>
              </motion.div>

              <motion.div className="space-y-4" variants={containerVariants}>
                <motion.div variants={itemVariants}>
                  <label htmlFor="username" className="block text-sm font-medium mb-2 text-slate-200">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerifyUsername()}
                    placeholder="octocat"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-orange-500 transition-colors duration-200 placeholder-slate-600"
                    autoFocus
                  />
                  <p className="text-slate-500 text-sm mt-2">
                    Enter the username you just authorized
                  </p>
                </motion.div>

                {error && (
                  <motion.div
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
                    variants={itemVariants}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <p className="text-sm text-red-300">❌ {error}</p>
                  </motion.div>
                )}

                <motion.button
                  onClick={handleVerifyUsername}
                  disabled={!githubUsername.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 px-8 rounded-lg transition-all disabled:cursor-not-allowed overflow-hidden group"
                  variants={itemVariants}
                  whileHover={{ scale: !githubUsername.trim() ? 1 : 1.02 }}
                  whileTap={{ scale: !githubUsername.trim() ? 1 : 0.98 }}
                >
                  {githubUsername.trim() ? '✓ Verify & Connect' : 'Enter username'}
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Verifying State */}
          {status === 'verifying' && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="inline-block rounded-full h-16 w-16 mb-6 border-4 border-slate-700 border-t-orange-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <h2 className="text-3xl font-bold mb-3 text-white">Verifying Username...</h2>
              <p className="text-slate-400">
                Checking GitHub for user "{githubUsername}"
              </p>
            </motion.div>
          )}

          {/* Success State */}
          {status === 'success' && githubUser && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <motion.div
                className="mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'backOut' }}
              >
                <svg className="w-16 h-16 text-emerald-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <motion.h2 className="text-3xl font-bold mb-6 text-white" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                GitHub Connected Successfully!
              </motion.h2>
              <motion.div
                className="flex items-center justify-center space-x-4 mb-6 bg-slate-800/30 border border-slate-700 rounded-lg p-6"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {githubUser.avatar_url && (
                  <img
                    src={githubUser.avatar_url}
                    alt={githubUser.login}
                    className="w-14 h-14 rounded-full border-2 border-orange-500"
                  />
                )}
                <div className="text-left">
                  <p className="font-semibold text-white text-lg">{githubUser.login}</p>
                  <p className="text-sm text-slate-400">GitHub User ID: {githubUser.id}</p>
                </div>
              </motion.div>
              <motion.p className="text-slate-300 mb-6" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                Your wallet is now linked to your GitHub account.
              </motion.p>
              <motion.div
                className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-orange-300">
                  ⏳ Redirecting to create commitment...
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="mb-6"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: 'backOut' }}
              >
                <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.div>
              <motion.h2 className="text-3xl font-bold mb-6 text-white" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                Authorization Failed
              </motion.h2>
              <motion.div
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm text-red-300">
                  ❌ {error || 'An unknown error occurred'}
                </p>
              </motion.div>
              <motion.button
                onClick={() => navigate('/create')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all overflow-hidden"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
