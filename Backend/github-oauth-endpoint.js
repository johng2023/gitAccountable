/**
 * GitHub OAuth Endpoint
 *
 * This is the backend endpoint that handles GitHub OAuth token exchange
 * Place this in your Express.js backend (routes/auth.js or similar)
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch'); // or use built-in fetch in Node 18+
const router = express.Router();

/**
 * POST /api/auth/github
 * Exchanges GitHub authorization code for access token
 *
 * Request body:
 * {
 *   code: "authorization_code_from_github",
 *   state: "optional_state_parameter"
 * }
 *
 * Response:
 * {
 *   success: true,
 *   token: "jwt_token",
 *   user: { id, username, avatarUrl, email }
 * }
 */
router.post('/github', async (req, res) => {
  try {
    const { code, state } = req.body;

    // Validate input
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Authorization code is required'
      });
    }

    // Step 1: Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        state: state
      })
    });

    const tokenData = await tokenResponse.json();

    // Check for errors
    if (tokenData.error) {
      console.error('GitHub token exchange error:', tokenData.error);
      return res.status(401).json({
        success: false,
        error: 'Failed to exchange authorization code: ' + tokenData.error
      });
    }

    const accessToken = tokenData.access_token;

    // Step 2: Fetch user data from GitHub API
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    const githubUser = await userResponse.json();

    if (userResponse.status !== 200) {
      console.error('GitHub user fetch error:', githubUser);
      return res.status(401).json({
        success: false,
        error: 'Failed to fetch GitHub user data'
      });
    }

    // Step 3: Save/update user in database
    const user = await saveGitHubUser({
      githubId: githubUser.id,
      username: githubUser.login,
      avatarUrl: githubUser.avatar_url,
      email: githubUser.email,
      accessToken: accessToken // Store encrypted in production!
    });

    // Step 4: Create JWT token for frontend
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        githubUsername: user.username,
        githubId: user.github_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Step 5: Return token and user data
    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatar_url,
        email: user.email
      }
    });

  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * Helper function to save/update GitHub user in database
 * Replace this with your actual database logic
 */
async function saveGitHubUser(githubData) {
  // Example using a hypothetical database
  // In production, use your actual database (PostgreSQL, MongoDB, etc.)

  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE github_id = $1',
      [githubData.githubId]
    );

    let user;

    if (existingUser.rows.length > 0) {
      // Update existing user
      const result = await pool.query(
        `UPDATE users
         SET github_username = $1,
             avatar_url = $2,
             email = $3,
             github_oauth_token = $4,
             updated_at = NOW()
         WHERE github_id = $5
         RETURNING *`,
        [
          githubData.username,
          githubData.avatarUrl,
          githubData.email,
          githubData.accessToken,
          githubData.githubId
        ]
      );
      user = result.rows[0];
    } else {
      // Create new user
      const result = await pool.query(
        `INSERT INTO users (
           github_id,
           github_username,
           avatar_url,
           email,
           github_oauth_token,
           created_at
         )
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [
          githubData.githubId,
          githubData.username,
          githubData.avatarUrl,
          githubData.email,
          githubData.accessToken
        ]
      );
      user = result.rows[0];
    }

    return user;

  } finally {
    await pool.end();
  }
}

/**
 * GET /api/auth/user
 * Get current authenticated user (requires JWT token in Authorization header)
 */
router.get('/user', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    // TODO: Implement based on your database

    res.json({
      success: true,
      user: decoded
    });

  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (frontend-only, just remove token from localStorage)
 */
router.post('/logout', (req, res) => {
  // In a real app, you might invalidate the token or revoke the GitHub token
  res.json({ success: true });
});

module.exports = router;

/**
 * SETUP INSTRUCTIONS
 *
 * 1. In your main Express app (app.js or server.js):
 *    const authRoutes = require('./routes/auth');
 *    app.use('/api/auth', authRoutes);
 *
 * 2. Environment variables needed (.env):
 *    GITHUB_CLIENT_ID=your_client_id
 *    GITHUB_CLIENT_SECRET=your_client_secret
 *    GITHUB_REDIRECT_URI=http://localhost:5174/callback
 *    JWT_SECRET=your_jwt_secret_key
 *    DATABASE_URL=postgresql://user:password@localhost:5432/gitaccountable
 *
 * 3. Database table:
 *    CREATE TABLE users (
 *      id SERIAL PRIMARY KEY,
 *      github_id INT UNIQUE NOT NULL,
 *      github_username VARCHAR(255) UNIQUE NOT NULL,
 *      email VARCHAR(255),
 *      avatar_url VARCHAR(500),
 *      github_oauth_token VARCHAR(500),
 *      wallet_address VARCHAR(255),
 *      created_at TIMESTAMP DEFAULT NOW(),
 *      updated_at TIMESTAMP DEFAULT NOW()
 *    );
 *
 * 4. Test with curl:
 *    curl -X POST http://localhost:3001/api/auth/github \
 *      -H "Content-Type: application/json" \
 *      -d '{"code":"your_auth_code_here"}'
 */
