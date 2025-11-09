// Simple mock API - Replace with real backend when ready
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// In-memory storage for demo
const storage = {
  commitments: {},
  users: {},
};

export const api = {
  // Get user commitment
  getCommitment: async (walletAddress) => {
    // Check localStorage first
    const stored = localStorage.getItem(`commitment_${walletAddress}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Check in-memory storage
    const user = storage.users[walletAddress];
    if (user?.commitmentId) {
      return storage.commitments[user.commitmentId];
    }
    
    return null;
  },

  // Create new commitment
  createCommitment: async (walletAddress, githubUsername, stakeAmount, stakingPeriod = 7) => {
    const id = `commitment_${Date.now()}`;
    const days = parseInt(stakingPeriod) || 7;
    const commitment = {
      id,
      walletAddress,
      githubUsername,
      stakeAmount,
      stakingPeriod: days,
      status: 'active',
      daysComplete: 0,
      daysArray: Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        status: 'pending',
      })),
      rewards: '0',
      createdAt: Date.now(),
    };

    // Save to storage
    storage.commitments[id] = commitment;
    storage.users[walletAddress] = { walletAddress, githubUsername, commitmentId: id };
    localStorage.setItem(`commitment_${walletAddress}`, JSON.stringify(commitment));

    return commitment;
  },

  // Claim rewards
  claimRewards: async (commitmentId) => {
    const commitment = storage.commitments[commitmentId] || 
      JSON.parse(localStorage.getItem(`commitment_${commitmentId}`) || '{}');
    
    if (commitment) {
      commitment.status = 'completed';
      localStorage.setItem(`commitment_${commitment.walletAddress}`, JSON.stringify(commitment));
      return {
        txHash: '0x' + Math.random().toString(16).slice(2),
        rewards: commitment.rewards,
        totalClaimed: (parseFloat(commitment.stakeAmount) + parseFloat(commitment.rewards || 0)).toString(),
      };
    }
    return null;
  },

  // Validate GitHub username by checking if user exists on GitHub
  validateGitHub: async (username) => {
    try {
      // Check if username format is valid first
      if (!username || !/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username)) {
        return { valid: false, user: null };
      }

      // Call GitHub API to verify the user actually exists
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitAccountable'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        return {
          valid: true,
          user: {
            username: userData.login,
            id: userData.id,
            avatarUrl: userData.avatar_url,
            profileUrl: userData.html_url
          }
        };
      }
      return { valid: false, user: null };
    } catch (err) {
      console.error('GitHub API validation error:', err);
      return { valid: false, user: null };
    }
  },
};
