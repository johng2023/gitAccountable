// Mock API service - Replace with real endpoints when backend is ready

export const api = {
  // Mock user data
  mockUsers: {
    '0x1234567890123456789012345678901234567890': {
      walletAddress: '0x1234567890123456789012345678901234567890',
      githubUsername: 'test_user',
      commitments: ['commitment_1'],
    },
  },

  mockCommitments: {
    commitment_1: {
      id: 'commitment_1',
      walletAddress: '0x1234567890123456789012345678901234567890',
      githubUsername: 'test_user',
      stakeAmount: '0.01',
      status: 'active',
      daysComplete: 3,
      daysArray: [
        { day: 1, status: 'complete' },
        { day: 2, status: 'complete' },
        { day: 3, status: 'complete' },
        { day: 4, status: 'pending' },
        { day: 5, status: 'pending' },
        { day: 6, status: 'pending' },
        { day: 7, status: 'pending' },
      ],
      rewards: '0.000061',
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      expiresAt: Date.now() + 4 * 24 * 60 * 60 * 1000,
    },
  },

  // Get user commitment
  getCommitment: async (walletAddress) => {
    const user = api.mockUsers[walletAddress];
    if (!user || !user.commitments.length) {
      return null;
    }
    const commitmentId = user.commitments[0];
    return api.mockCommitments[commitmentId];
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
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    api.mockCommitments[id] = commitment;
    api.mockUsers[walletAddress] = {
      walletAddress,
      githubUsername,
      commitments: [id],
    };
    return commitment;
  },

  // Claim rewards
  claimRewards: async (commitmentId) => {
    const commitment = api.mockCommitments[commitmentId];
    if (commitment) {
      commitment.status = 'completed';
      return {
        txHash: '0x' + Math.random().toString(16).slice(2),
        rewards: commitment.rewards,
        totalClaimed: (
          parseFloat(commitment.stakeAmount) + parseFloat(commitment.rewards)
        ).toString(),
      };
    }
    return null;
  },

  // Validate GitHub username
  validateGitHub: async (username) => {
    // Mock validation - just check it's not empty
    if (username && username.length >= 2 && username.length <= 39) {
      return {
        valid: true,
        user: {
          username,
          avatarUrl: `https://avatars.githubusercontent.com/u/1?v=4`,
        },
      };
    }
    return { valid: false, user: null };
  },
};
