const { Pool } = require('pg');
require('dotenv').config();

// This script sets up the database and creates the gitaccountable database if it doesn't exist
async function setupDatabase() {
  let client;
  let dbClient;

  try {
    console.log('🔧 Setting up PostgreSQL database...\n');

    // First, connect to the default 'postgres' database to create our database
    const postgresPool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'postgres' // Connect to default postgres database
    });

    client = await postgresPool.connect();

    // Check if database exists
    const dbCheckResult = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}';`
    );

    if (dbCheckResult.rows.length === 0) {
      console.log(`📝 Creating database '${process.env.DB_NAME}'...`);
      await client.query(`CREATE DATABASE ${process.env.DB_NAME};`);
      console.log(`✅ Database '${process.env.DB_NAME}' created!\n`);
    } else {
      console.log(`✅ Database '${process.env.DB_NAME}' already exists\n`);
    }

    client.release();

    // Now connect to the new database and create tables
    const appPool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    dbClient = await appPool.connect();

    console.log(`📊 Creating tables in '${process.env.DB_NAME}'...\n`);

    // Create users table
    const createUsersTable = `
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

    await dbClient.query(createUsersTable);
    console.log('✅ Users table created');

    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_github_id ON users(github_id);',
      'CREATE INDEX IF NOT EXISTS idx_github_username ON users(github_username);',
      'CREATE INDEX IF NOT EXISTS idx_wallet_address ON users(wallet_address);'
    ];

    for (const indexQuery of indexes) {
      await dbClient.query(indexQuery);
    }
    console.log('✅ Indexes created\n');

    // Verify connection works
    const result = await dbClient.query('SELECT NOW();');
    console.log(`✅ Database connection verified: ${result.rows[0].now}\n`);

    dbClient.release();
    await postgresPool.end();
    await appPool.end();

    console.log('🎉 Database setup complete!\n');
    console.log('📌 Next steps:');
    console.log('   1. Make sure PostgreSQL is running');
    console.log('   2. Run: npm start');
    console.log('   3. Backend will be available at http://localhost:3001\n');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('\n📋 Troubleshooting:');
    console.error('   1. Check PostgreSQL is running');
    console.error('   2. Verify credentials in .env file');
    console.error('   3. Make sure you have permission to create databases\n');

    if (client) client.release();
    if (dbClient) dbClient.release();

    process.exit(1);
  }
}

// Run setup
setupDatabase();
