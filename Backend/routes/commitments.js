const express = require('express');
const jwt = require('jsonwebtoken');
const { query } = require('../db');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Missing authorization token'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.githubUsername = decoded.githubUsername;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

// Create a new commitment
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { githubUsername, walletAddress, stakeAmount, stakingPeriod } = req.body;

    if (!githubUsername || !walletAddress || !stakeAmount || !stakingPeriod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Check if user already has an active commitment
    const existingCheck = await query(
      'SELECT id FROM commitments WHERE github_username = $1 AND wallet_address = $2 AND status = $3',
      [githubUsername, walletAddress, 'active']
    );

    if (existingCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'User already has an active commitment'
      });
    }

    // Create new commitment
    const result = await query(
      `INSERT INTO commitments (
        github_username, wallet_address, stake_amount, staking_period, status, days_complete, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, github_username, wallet_address, stake_amount, staking_period, status, days_complete, created_at`,
      [githubUsername, walletAddress, stakeAmount, stakingPeriod, 'active', 0]
    );

    if (result.rows.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create commitment'
      });
    }

    const commitment = result.rows[0];

    // Generate days array
    const daysArray = Array.from({ length: parseInt(stakingPeriod) }, (_, i) => ({
      day: i + 1,
      status: 'pending'
    }));

    return res.json({
      success: true,
      commitment: {
        id: commitment.id,
        githubUsername: commitment.github_username,
        walletAddress: commitment.wallet_address,
        stakeAmount: commitment.stake_amount,
        stakingPeriod: commitment.staking_period,
        status: commitment.status,
        daysComplete: commitment.days_complete,
        daysArray,
        rewards: '0',
        createdAt: commitment.created_at.getTime()
      }
    });
  } catch (error) {
    console.error('Create commitment error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get commitment by GitHub username and wallet
router.get('/get/:githubUsername/:walletAddress', verifyToken, async (req, res) => {
  try {
    const { githubUsername, walletAddress } = req.params;

    const result = await query(
      `SELECT id, github_username, wallet_address, stake_amount, staking_period, status, days_complete, created_at
       FROM commitments WHERE github_username = $1 AND wallet_address = $2 AND status = $3`,
      [githubUsername, walletAddress, 'active']
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        commitment: null
      });
    }

    const commitment = result.rows[0];

    // Generate days array
    const daysArray = Array.from({ length: parseInt(commitment.staking_period) }, (_, i) => ({
      day: i + 1,
      status: 'pending' // TODO: Check actual GitHub commits
    }));

    return res.json({
      success: true,
      commitment: {
        id: commitment.id,
        githubUsername: commitment.github_username,
        walletAddress: commitment.wallet_address,
        stakeAmount: commitment.stake_amount,
        stakingPeriod: commitment.staking_period,
        status: commitment.status,
        daysComplete: commitment.days_complete,
        daysArray,
        rewards: '0',
        createdAt: commitment.created_at.getTime()
      }
    });
  } catch (error) {
    console.error('Get commitment error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
