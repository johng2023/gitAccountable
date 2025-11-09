const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Initialize database - create table if it doesn't exist
async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // Create users table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        github_id INT UNIQUE NOT NULL,
        github_username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255),
        avatar_url VARCHAR(500),
        github_oauth_token VARCHAR(500) NOT NULL,
        wallet_address VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await pool.query(createTableQuery);
    console.log('✅ Users table ready');

    // Create indexes for faster queries
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_github_id ON users(github_id);',
      'CREATE INDEX IF NOT EXISTS idx_github_username ON users(github_username);',
      'CREATE INDEX IF NOT EXISTS idx_wallet_address ON users(wallet_address);'
    ];

    for (const query of indexQueries) {
      await pool.query(query);
    }
    console.log('✅ Indexes created');

    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
}

// Query helper
async function query(text, params) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

module.exports = {
  pool,
  query,
  initializeDatabase
};
