# GitAccountable Complete Connection Guide

## Overview

This guide provides **step-by-step instructions** to connect all components of GitAccountable and make the application fully functional. Follow each section in order to set up the project from scratch or troubleshoot existing issues.

---

## Prerequisites Checklist

Before starting, ensure you have these installed:

- [x] **Node.js** (v16+ recommended)
  ```bash
  node --version
  npm --version
  ```

- [x] **PostgreSQL** (v12+)
  ```bash
  psql --version
  ```

- [x] **Git**
  ```bash
  git --version
  ```

- [x] **Ethereum Wallet** (MetaMask, WalletConnect, etc.)
  - For testnet (Sepolia)
  - With testnet funds for gas

---

## Part 1: Database Setup

### Step 1.1: Install PostgreSQL

**macOS:**
```bash
# Using Homebrew
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15
```

**Linux (Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL
sudo service postgresql start
```

**Windows:**
Download and install from: https://www.postgresql.org/download/windows/

### Step 1.2: Create Database User and Database

```bash
# Connect to PostgreSQL as default user
psql postgres

# Create a database user (if not already created)
CREATE USER postgres WITH PASSWORD 'Theguck20';
ALTER USER postgres WITH SUPERUSER;

# Create the database
CREATE DATABASE gitaccountable OWNER postgres;

# Verify creation
\l

# Connect to the new database
\c gitaccountable

# Verify connection
SELECT current_database();

# Exit psql
\q
```

### Step 1.3: Initialize Database Schema

Navigate to Backend folder and run setup:

```bash
cd /Users/johnguckian/GitAccountable/Backend

# Install dependencies
npm install

# Run database initialization
npm run setup
# Or manually:
# node setup-db.js

# Verify tables were created
psql -U postgres -d gitaccountable -c "\dt"
```

Expected output:
```
             List of relations
 Schema |   Name    | Type  |  Owner
--------+-----------+-------+----------
 public | commitments | table | postgres
 public | users     | table | postgres
(2 rows)
```

### Step 1.4: Verify Database Connection

```bash
# Test connection from project
node -e "
const { query } = require('./db');
query('SELECT NOW()').then(res => {
  console.log('✅ Database connected:', res.rows[0]);
  process.exit(0);
}).catch(err => {
  console.error('❌ Connection failed:', err.message);
  process.exit(1);
});
"
```

---

## Part 2: Backend Server Setup

### Step 2.1: Configure Environment Variables

```bash
cd /Users/johnguckian/GitAccountable/Backend

# Create .env file from template
cp .env.example .env

# Edit .env with your values
nano .env

# Required variables:
# GITHUB_CLIENT_ID=Ov23liE9xCr5zXlkPhkl
# GITHUB_CLIENT_SECRET=b4de86cdf536ed9d4c2fbd3ad22c852a44176a3e
# GITHUB_REDIRECT_URI=http://localhost:5173/callback
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=Theguck20
# DB_NAME=gitaccountable
# JWT_SECRET=your_secret_jwt_key_change_this_in_production_12345
# PORT=3001
# NODE_ENV=development
```

### Step 2.2: Install Backend Dependencies

```bash
cd /Users/johnguckian/GitAccountable/Backend

npm install
```

### Step 2.3: Start Backend Server

```bash
cd /Users/johnguckian/GitAccountable/Backend

# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start
```

Expected output:
```
🚀 GitAccountable Backend Starting...
📊 Environment: development
Initializing database...
✅ Users table ready
✅ Indexes created

✅ Server running on http://localhost:3001
📍 API endpoint: http://localhost:3001/api
🔐 GitHub OAuth: POST /api/auth/github
👤 User Profile: GET /api/auth/profile
💼 Update Wallet: POST /api/auth/wallet

✨ Ready to accept connections!
```

### Step 2.4: Test Backend Health

In a new terminal:

```bash
curl http://localhost:3001/api/health | jq .
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

## Part 3: GitHub OAuth Configuration

### Step 3.1: Register GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in the form:
   - **Application name:** GitAccountable Dev
   - **Homepage URL:** http://localhost:5173
   - **Authorization callback URL:** http://localhost:5173/callback
4. Copy **Client ID** and **Client Secret**
5. Update Backend `.env`:
   ```bash
   GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   ```

### Step 3.2: Verify OAuth Credentials

```bash
# Test GitHub OAuth endpoint
curl -X POST http://localhost:3001/api/auth/github \
  -H "Content-Type: application/json" \
  -d '{
    "code": "invalid_code_for_testing",
    "state": "test_state"
  }'
```

You should see error (expected - invalid code):
```json
{
  "success": false,
  "error": "Failed to exchange code for token: bad_verification_code"
}
```

This confirms the backend can reach GitHub's OAuth endpoint.

---

## Part 4: Frontend Setup

### Step 4.1: Configure Frontend Environment

```bash
cd /Users/johnguckian/GitAccountable/Frontend/React

# Create .env.local
cat > .env.local << 'EOF'
VITE_GITHUB_CLIENT_ID=Ov23liE9xCr5zXlkPhkl
VITE_GITHUB_REDIRECT_URI=http://localhost:5173/callback
VITE_API_URL=http://localhost:3001/api
EOF
```

Update Client ID to match your GitHub OAuth app.

### Step 4.2: Install Frontend Dependencies

```bash
cd /Users/johnguckian/GitAccountable/Frontend/React

npm install
```

### Step 4.3: Start Frontend Development Server

```bash
cd /Users/johnguckian/GitAccountable/Frontend/React

npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose this server
```

### Step 4.4: Verify Frontend Loads

Open browser: http://localhost:5173

You should see:
- Landing page with "Commit or Forfeit" heading
- "Step 1: Login with GitHub" button
- How it Works section

---

## Part 5: Test Complete OAuth Flow

### Step 5.1: Initiate GitHub Login

1. Open http://localhost:5173 in browser
2. Click "Step 1: Login with GitHub"
3. You'll be redirected to github.com/login/oauth/authorize
4. Authorize the application

### Step 5.2: Verify Callback

After authorization, you should be redirected to:
```
http://localhost:5173/callback?code=abc123&state=xyz789
```

You should see:
- Loading spinner
- Then redirect to /create or /dashboard

### Step 5.3: Check Browser Console

Open browser DevTools (F12) → Console and look for:
```javascript
🔐 State validation: {
  receivedState: "...",
  storedState: "...",
  match: true
}
```

### Step 5.4: Verify JWT Token Storage

In DevTools → Application → Local Storage:

Should see:
- `jwt_token`: eyJhbGciOiJIUzI1NiI...
- `github_user`: {"id":1,"githubId":...,"username":"..."}

### Step 5.5: Test Protected Endpoint

```bash
# Get token from browser localStorage
JWT_TOKEN="<paste_from_browser>"

# Test profile endpoint
curl -H "Authorization: Bearer $JWT_TOKEN" \
  http://localhost:3001/api/auth/profile | jq .
```

Expected response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "github_id": 12345678,
    "github_username": "johng2023",
    "email": "user@example.com",
    "avatar_url": "https://avatars.githubusercontent.com/u/12345678",
    "wallet_address": null,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Part 6: Wallet Connection Setup

### Step 6.1: Install Wallet Extension

1. **MetaMask:** https://metamask.io
2. **WalletConnect:** https://walletconnect.com
3. Or your preferred Ethereum wallet

### Step 6.2: Switch to Sepolia Testnet

1. Open wallet extension
2. Click network dropdown
3. Select "Sepolia Testnet"
4. If not visible, enable "Show test networks"

### Step 6.3: Get Testnet ETH

Visit faucet: https://sepolia-faucet.pk910.de/

1. Enter your wallet address
2. Complete CAPTCHA
3. Receive ~0.5 ETH for gas

### Step 6.4: Test Wallet Connection

1. Go to http://localhost:5173
2. After GitHub login, you'll see "Step 2: Connect Your Wallet"
3. Click button (uses RainbowKit)
4. Select wallet and approve connection

### Step 6.5: Verify Wallet Connection

After connection, you should see:
- Connected wallet address in UI
- "Go to Dashboard" and "Create New Commitment" buttons
- User dropdown shows wallet info

Check browser console for:
```javascript
Connected to wallet: 0x742d35Cc6634C0532925a3b844Bc54e4f95f49d1
```

---

## Part 7: Test Commitment Creation

### Step 7.1: Navigate to Create Commitment

1. After GitHub login and wallet connection
2. Click "Create New Commitment"

You should see:
- Your GitHub username (auto-populated)
- Stake amount input (default: 0.01 eETH)
- Staking period input (default: 7 days)
- "Approve eETH" and "Lock It In" buttons

### Step 7.2: Test Toast Notifications

Click "Approve eETH" button:
- Should see toast: "eETH approval confirmed!"
- Button changes to "Approved"

### Step 7.3: Test Commitment Creation

Click "Lock It In":
- Toast: "Commitment created successfully!"
- Redirects to /dashboard
- Commitment appears in dashboard

### Step 7.4: Verify Database

Check PostgreSQL:

```bash
psql -U postgres -d gitaccountable

# View commitments
SELECT * FROM commitments \g

# View users
SELECT id, github_username, wallet_address FROM users \g
```

Expected output:
```
 id | github_username |              wallet_address
----+-----------------+-------------------------------------------
  1 | johng2023       | 0x742d35Cc6634C0532925a3b844Bc54e4f95f49d1
```

---

## Part 8: Smart Contract Integration (Future)

### Step 8.1: Deploy Smart Contract

```bash
# (When smart contract is ready)
cd /path/to/smart-contracts

# Deploy to Sepolia testnet
hardhat run scripts/deploy.js --network sepolia
```

### Step 8.2: Update Contract Address

Update `/Frontend/React/src/config/contract.js`:

```javascript
export const CONTRACT_ADDRESS = "0x1953f602eFd1CBd16846A440421F4824024ae60c";
export const CONTRACT_ABI = [...]; // from contract artifacts
```

### Step 8.3: Update Wagmi Config

Update `/Frontend/React/src/services/wagmi.js`:

```javascript
import { getContract } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

export const commitLockContract = {
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
};
```

---

## Part 9: Chainlink Functions Setup (Optional)

### Step 9.1: Test Oracle Locally

```bash
cd /Users/johnguckian/GitAccountable/Backend/chainlink

# Test with defaults
node test-local.js

# Test specific user
node test-local.js johng2023

# Test specific user and day
node test-local.js johng2023 0 1705276800000
```

### Step 9.2: Deploy Oracle

```bash
# (When ready for production)
# Follow Chainlink Functions documentation:
# https://docs.chain.link/chainlink-functions/

# Upload source to Chainlink
# Fund subscription (ID: 5874)
# Add contract as consumer
```

### Step 9.3: Configure Automation

```bash
# (When ready for automated daily verification)
# Set up Chainlink Automation:
# https://docs.chain.link/chainlink-automation/
```

---

## Troubleshooting

### Issue: EADDRINUSE - Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Kill processes on port 3001
lsof -ti:3001 | xargs kill -9

# Kill processes on port 5173
lsof -ti:5173 | xargs kill -9
```

---

### Issue: Database Connection Failed

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```bash
# Ensure PostgreSQL is running
brew services start postgresql@15

# Verify credentials in .env
cat Backend/.env | grep DB_

# Test connection
psql -U postgres -d gitaccountable -c "SELECT NOW();"
```

---

### Issue: GitHub OAuth "bad_verification_code"

**Error:**
```json
{
  "error": "bad_verification_code",
  "error_description": "The code passed is incorrect or expired."
}
```

**Solutions:**
1. **Check redirect URI matches:**
   - GitHub OAuth app: http://localhost:5173/callback
   - .env GITHUB_REDIRECT_URI: http://localhost:5173/callback

2. **Verify Client ID/Secret:**
   - Go to https://github.com/settings/developers
   - Copy exact credentials
   - Update .env and restart backend

3. **Code may have expired:**
   - Authorization codes expire after 10 minutes
   - Try logging in again

---

### Issue: CSRF Attack Error - "Invalid state parameter"

**Error:**
```
Invalid state parameter - possible CSRF attack
```

**Causes:**
1. sessionStorage cleared
2. Browser privacy mode (sessionStorage limited)
3. State mismatch between pages

**Solutions:**
1. Use private/incognito window
2. Try in normal browser mode
3. Clear browser cache and retry

---

### Issue: Toast Notifications Not Showing

**Solutions:**
1. Check browser console for errors (F12)
2. Verify ToastProvider is in App.jsx
3. Verify ToastContainer is rendered
4. Check z-index CSS conflicts

---

### Issue: Wallet Not Connecting

**Error:**
```
User rejected the request
```

**Solutions:**
1. Ensure MetaMask is unlocked
2. Approve connection in wallet popup
3. Check you're on Sepolia testnet
4. Restart wallet extension

---

### Issue: Commitment Creation Fails

**Error:**
```json
{
  "success": false,
  "error": "You can only have one active commitment at a time"
}
```

**Solution:**
Complete or forfeit existing commitment first.

---

## Verification Checklist

After completing all steps, verify:

- [ ] PostgreSQL running and initialized
- [ ] Backend server running on 3001
- [ ] Frontend dev server running on 5173
- [ ] Can load http://localhost:5173
- [ ] GitHub OAuth login works
- [ ] JWT token stored in localStorage
- [ ] Can access protected endpoints
- [ ] Wallet connects successfully
- [ ] Toast notifications appear
- [ ] Can create commitment
- [ ] Commitment saved in database

---

## Quick Start Command (After First Setup)

Once everything is configured, use this to restart:

```bash
# Terminal 1: Backend
cd /Users/johnguckian/GitAccountable/Backend && npm run dev

# Terminal 2: Frontend
cd /Users/johnguckian/GitAccountable/Frontend/React && npm run dev

# Terminal 3: Optional - Watch database
psql -U postgres -d gitaccountable -c "WATCH SELECT * FROM commitments;"
```

---

## Production Deployment

When ready to deploy:

1. **Rotate GitHub OAuth credentials**
   - Create production OAuth app
   - Update GITHUB_CLIENT_ID and SECRET

2. **Generate secure JWT secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Use environment-specific configs**
   - Development: localhost
   - Production: yourdomain.com

4. **Enable HTTPS**
   - Update GITHUB_REDIRECT_URI to https://
   - Update CORS origins

5. **Database security**
   - Use strong PostgreSQL password
   - Enable database backups
   - Consider managed database service

6. **Deploy containers**
   - Docker for backend (Node.js)
   - Docker for frontend (static assets)
   - Orchestrate with Docker Compose or Kubernetes

---

## Support & Resources

- **GitHub Issues:** https://github.com/johng2023/gitAccountable/issues
- **Documentation:** /Users/johnguckian/GitAccountable/context/
- **Backend Analysis:** backend-branch-analysis.md
- **Integration Checklist:** integration-checklist.md

---

**Last Updated:** January 2024
**Status:** Ready for local development and testing
