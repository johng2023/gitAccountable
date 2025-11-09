const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('./db');
const authRoutes = require('./routes/auth');
const commitmentRoutes = require('./routes/commitments');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:5174', 'http://localhost:5173'],
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/commitments', commitmentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
async function start() {
  try {
    console.log('🚀 GitAccountable Backend Starting...');
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);

    // Initialize database
    await initializeDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n✅ Server running on http://localhost:${PORT}`);
      console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
      console.log(`🔐 GitHub OAuth: POST /api/auth/github`);
      console.log(`👤 User Profile: GET /api/auth/profile`);
      console.log(`💼 Update Wallet: POST /api/auth/wallet`);
      console.log(`📌 Create Commitment: POST /api/commitments/create`);
      console.log(`📊 Get Commitment: GET /api/commitments/get/:githubUsername/:walletAddress`);
      console.log('\n✨ Ready to accept connections!\n');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
