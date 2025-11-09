const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper to get JWT token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  // Get user commitment from backend
  getCommitment: async (githubUsername, walletAddress) => {
    try {
      const response = await fetch(
        `${API_BASE}/commitments/get/${githubUsername}/${walletAddress}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        console.error('Get commitment error:', response.status);
        return null;
      }

      const data = await response.json();
      return data.success ? data.commitment : null;
    } catch (error) {
      console.error('Get commitment fetch error:', error);
      return null;
    }
  },

  // Create new commitment on backend
  createCommitment: async (walletAddress, githubUsername, stakeAmount, stakingPeriod = 7) => {
    try {
      const response = await fetch(`${API_BASE}/commitments/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          githubUsername,
          walletAddress,
          stakeAmount: stakeAmount.toString(),
          stakingPeriod: parseInt(stakingPeriod)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Create commitment error:', errorData);
        return null;
      }

      const data = await response.json();
      return data.success ? data.commitment : null;
    } catch (error) {
      console.error('Create commitment fetch error:', error);
      return null;
    }
  },

  // Claim rewards
  claimRewards: async (commitmentId) => {
    // TODO: Implement backend endpoint for claiming rewards
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
