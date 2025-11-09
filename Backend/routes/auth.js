const express = require('express');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const { query } = require('../db');

const router = express.Router();

// GitHub OAuth callback handler
router.post('/github', async (req, res) => {
  try {
    const { code, state } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Missing authorization code'
      });
    }

    console.log('🔐 Exchanging GitHub code for access token...');

    // Step 1: Exchange authorization code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'GitAccountable'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        state: state
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('❌ GitHub token exchange failed:', tokenData);
      return res.status(401).json({
        success: false,
        error: 'Failed to exchange code for token: ' + (tokenData.error || 'Unknown error')
      });
    }

    const accessToken = tokenData.access_token;
    console.log('✅ Got GitHub access token');

    // Step 2: Fetch user data from GitHub API
    console.log('👤 Fetching user data from GitHub...');
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitAccountable'
      }
    });

    if (!userResponse.ok) {
      console.error('❌ GitHub API error:', userResponse.status);
      return res.status(401).json({
        success: false,
        error: 'Failed to fetch user data from GitHub'
      });
    }

    const githubUser = await userResponse.json();
    console.log(`✅ Got GitHub user: ${githubUser.login}`);

    // Step 3: Save or update user in database
    console.log('💾 Saving user to database...');
    const upsertQuery = `
      INSERT INTO users (
        github_id,
        github_username,
        email,
        avatar_url,
        github_oauth_token,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (github_id)
      DO UPDATE SET
        email = $3,
        avatar_url = $4,
        github_oauth_token = $5,
        updated_at = NOW()
      RETURNING id, github_id, github_username, email, avatar_url;
    `;

    const result = await query(upsertQuery, [
      githubUser.id,
      githubUser.login,
      githubUser.email,
      githubUser.avatar_url,
      accessToken
    ]);

    const user = result.rows[0];
    console.log(`✅ User saved to database (ID: ${user.id})`);

    // Step 4: Create JWT token
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        githubId: user.github_id,
        githubUsername: user.github_username,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('✅ JWT token created');

    // Step 5: Return token and user info to frontend
    return res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        githubId: user.github_id,
        username: user.github_username,
        email: user.email,
        avatarUrl: user.avatar_url
      }
    });

  } catch (error) {
    console.error('❌ GitHub OAuth error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
});

// Get user profile (protected route example)
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Missing authorization token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await query(
      'SELECT id, github_id, github_username, email, avatar_url, wallet_address, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    console.error('Profile fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update wallet address
router.post('/wallet', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { walletAddress } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Missing authorization token'
      });
    }

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing wallet address'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await query(
      'UPDATE users SET wallet_address = $1, updated_at = NOW() WHERE id = $2 RETURNING id, github_username, wallet_address',
      [walletAddress, decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    console.error('Wallet update error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
