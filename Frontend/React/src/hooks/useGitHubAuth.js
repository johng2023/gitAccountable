import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import {
  getGitHubForWallet,
  setGitHubForWallet,
  removeGitHubForWallet,
  isGitHubConnected,
} from '../utils/walletGitHubStorage';

/**
 * Hook for GitHub username management and wallet linking
 *
 * Provides functions to connect/disconnect GitHub username and check connection status
 */
export function useGitHubAuth() {
  const { address } = useAccount();
  const [githubData, setGithubData] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Load GitHub data for current wallet
  useEffect(() => {
    if (address) {
      const data = getGitHubForWallet(address);
      setGithubData(data);
    } else {
      setGithubData(null);
    }
  }, [address]);

  /**
   * Connect GitHub username to wallet
   */
  const connectGitHub = useCallback(async (username) => {
    if (!address) {
      setError('Please connect your wallet first');
      return false;
    }

    if (!username || username.trim().length === 0) {
      setError('Please enter a GitHub username');
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Validate username exists on GitHub
      const response = await fetch(`https://api.github.com/users/${username.trim()}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('GitHub user not found. Please check the username.');
        } else {
          setError('Error validating GitHub username. Please try again.');
        }
        setIsConnecting(false);
        return false;
      }

      const userData = await response.json();

      // Store GitHub username with wallet
      const githubData = {
        username: userData.login,
        id: userData.id,
        avatar_url: userData.avatar_url,
        connected_at: new Date().toISOString(),
      };

      setGitHubForWallet(address, githubData);
      setGithubData(githubData);
      setIsConnecting(false);
      return true;
    } catch (err) {
      console.error('Error connecting GitHub:', err);
      setError('Failed to connect GitHub. Please try again.');
      setIsConnecting(false);
      return false;
    }
  }, [address]);

  /**
   * Disconnect GitHub account
   */
  const disconnectGitHub = useCallback(() => {
    if (address) {
      removeGitHubForWallet(address);
      setGithubData(null);
    }
  }, [address]);

  /**
   * Check if current wallet has GitHub connected
   */
  const isConnected = address ? isGitHubConnected(address) : false;

  return {
    // State
    githubData,
    isConnected,
    isConnecting,
    error,

    // Actions
    connectGitHub,
    disconnectGitHub,
  };
}
