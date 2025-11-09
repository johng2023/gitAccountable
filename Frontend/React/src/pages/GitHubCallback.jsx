import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  return (
    <div className="max-w-2xl mx-auto py-16">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
        {/* Username Confirmation State */}
        {status === 'confirm' && authorizationVerified && (
          <div>
            <div className="text-center mb-6">
              <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <h2 className="text-2xl font-bold mb-2 text-green-400">
                ✓ GitHub Authorization Successful!
              </h2>
              <p className="text-gray-400 mb-6">
                Please confirm your GitHub username to complete the connection
              </p>
            </div>

            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-400">
                💡 We need your username to verify and link it to your wallet
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  GitHub Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerifyUsername()}
                  placeholder="octocat"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  autoFocus
                />
                <p className="text-gray-500 text-sm mt-2">
                  Enter the username you just authorized
                </p>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <p className="text-sm text-red-400">❌ {error}</p>
                </div>
              )}

              <button
                onClick={handleVerifyUsername}
                disabled={!githubUsername.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                Verify & Connect
              </button>
            </div>
          </div>
        )}

        {/* Verifying State */}
        {status === 'verifying' && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Verifying Username...</h2>
            <p className="text-gray-400">
              Checking GitHub for user "{githubUsername}"
            </p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && githubUser && (
          <div className="text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-green-400">
              ✓ GitHub Connected Successfully!
            </h2>
            <div className="flex items-center justify-center space-x-3 mb-4">
              {githubUser.avatar_url && (
                <img
                  src={githubUser.avatar_url}
                  alt={githubUser.login}
                  className="w-12 h-12 rounded-full border-2 border-green-500"
                />
              )}
              <div className="text-left">
                <p className="font-semibold text-white">{githubUser.login}</p>
                <p className="text-sm text-gray-400">GitHub User ID: {githubUser.id}</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Your wallet is now linked to your GitHub account.
            </p>
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <p className="text-sm text-blue-400">
                Redirecting to create commitment...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-400">
              Authorization Failed
            </h2>
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-400">
                ❌ {error || 'An unknown error occurred'}
              </p>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
