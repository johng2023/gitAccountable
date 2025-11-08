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
  createCommitment: async (walletAddress, githubUsername, stakeAmount) => {
    const id = `commitment_${Date.now()}`;
    const commitment = {
      id,
      walletAddress,
      githubUsername,
      stakeAmount,
      status: 'active',
      daysComplete: 0,
      daysArray: Array.from({ length: 7 }, (_, i) => ({
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

  // Validate GitHub username
  validateGitHub: async (username) => {
    // Simple validation - check format
    if (username && /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username)) {
      return {
        valid: true,
        user: { username },
      };
    }
    return { valid: false, user: null };
  },
};
