/**
 * Wallet-GitHub Mapping Storage Utility
 *
 * Manages localStorage for linking Web3 wallet addresses to GitHub accounts.
 * This is a simplified MVP approach - in production, use a backend database.
 */

const STORAGE_KEY = 'commitlock_wallet_github_mappings';

/**
 * Get GitHub data for a wallet address
 * @param {string} walletAddress - Ethereum address (checksummed or lowercase)
 * @returns {object|null} GitHub data or null if not found
 */
export function getGitHubForWallet(walletAddress) {
  if (!walletAddress) return null;

  try {
    const mappings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const normalizedAddress = walletAddress.toLowerCase();
    return mappings[normalizedAddress] || null;
  } catch (error) {
    console.error('Error reading GitHub mapping:', error);
    return null;
  }
}

/**
 * Store GitHub data for a wallet address
 * @param {string} walletAddress - Ethereum address
 * @param {object} githubData - GitHub user data
 * @param {string} githubData.username - GitHub username
 * @param {number} githubData.id - GitHub user ID
 * @param {string} githubData.avatar_url - GitHub avatar URL
 * @param {string} githubData.access_token - (Optional) OAuth access token
 */
export function setGitHubForWallet(walletAddress, githubData) {
  if (!walletAddress || !githubData || !githubData.username) {
    throw new Error('Invalid wallet address or GitHub data');
  }

  try {
    const mappings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const normalizedAddress = walletAddress.toLowerCase();

    mappings[normalizedAddress] = {
      username: githubData.username,
      id: githubData.id,
      avatar_url: githubData.avatar_url,
      // Store access token only if provided (for future API calls)
      access_token: githubData.access_token || null,
      connected_at: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
    return true;
  } catch (error) {
    console.error('Error storing GitHub mapping:', error);
    return false;
  }
}

/**
 * Remove GitHub connection for a wallet
 * @param {string} walletAddress - Ethereum address
 * @returns {boolean} Success status
 */
export function removeGitHubForWallet(walletAddress) {
  if (!walletAddress) return false;

  try {
    const mappings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const normalizedAddress = walletAddress.toLowerCase();

    if (mappings[normalizedAddress]) {
      delete mappings[normalizedAddress];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error removing GitHub mapping:', error);
    return false;
  }
}

/**
 * Check if wallet has GitHub connected
 * @param {string} walletAddress - Ethereum address
 * @returns {boolean} True if connected
 */
export function isGitHubConnected(walletAddress) {
  const data = getGitHubForWallet(walletAddress);
  return data !== null && !!data.username;
}

/**
 * Get all wallet-GitHub mappings (for debugging)
 * @returns {object} All mappings
 */
export function getAllMappings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (error) {
    console.error('Error reading mappings:', error);
    return {};
  }
}

/**
 * Clear all mappings (for debugging/testing)
 */
export function clearAllMappings() {
  localStorage.removeItem(STORAGE_KEY);
}
