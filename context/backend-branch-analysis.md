# GitAccountable Backend Branch Analysis

## Overview

This document provides a comprehensive analysis of the Backend branch stored in the GitHub repository at `https://github.com/johng2023/gitAccountable/tree/Backend`. It includes detailed information about the Chainlink Functions oracle implementation, API endpoints, database schema, and integration requirements.

---

## File Structure Comparison

### Remote Backend Branch (origin/Backend)

```
Backend/
├── chainlink/                          # Chainlink Functions Oracle Implementation
│   ├── checkGithubCommit.js           # Main oracle source code (109 lines)
│   │   └── Verifies GitHub commits on specific dates
│   ├── test-local.js                   # Local testing script (168 lines)
│   │   └── Tests oracle functionality without deployment
│   ├── config.json                     # Chainlink configuration
│   │   └── Network, subscription, and contract settings
│   └── README.md                       # Oracle documentation
├── CLAUDE.md                           # Comprehensive developer guide (29KB)
│   └── Detailed implementation notes
└── backend.txt                         # Empty placeholder file
```

### Local Backend Folder

```
Backend/
├── routes/
│   ├── auth.js                         # GitHub OAuth routes (280 lines)
│   │   └── OAuth code exchange, JWT generation
│   └── commitments.js                  # Commitment CRUD routes (155 lines)
│       └── Commitment creation and retrieval
├── server.js                           # Express server (79 lines)
│   └── Server initialization and middleware
├── db.js                               # PostgreSQL connection (93 lines)
│   └── Connection pool and table initialization
├── setup-db.js                         # Database setup script (111 lines)
│   └── Manual database initialization
├── github-oauth-endpoint.js            # Legacy OAuth endpoint
├── package.json                        # Node.js dependencies
├── package-lock.json
├── .env                                # Environment variables (active)
├── .env.example                        # Environment template
└── README.md                           # User documentation
```

### Key Differences Summary

| Component | Remote | Local | Status |
|-----------|--------|-------|--------|
| Chainlink Oracle (`chainlink/`) | ✅ Yes | ❌ No | **Needs Pull** |
| Express API Server | ❌ No | ✅ Yes | Local only |
| Database Schema | ❌ No | ✅ Yes | Local only |
| Routes (auth, commitments) | ❌ No | ✅ Yes | Local only |
| Developer Guide (CLAUDE.md) | ✅ Yes | ❌ No | **Needs Pull** |

---

## Backend Architecture

### 1. Express API Server

**Technology Stack:**
```javascript
Framework:           Express.js 4.18.2
Database:            PostgreSQL 8.11.3
Authentication:      JWT (jsonwebtoken 9.0.0)
Middleware:          CORS 2.8.5
HTTP Client:         Node-fetch 2.7.0
Auto-restart (dev):  Nodemon 3.0.2
```

**Server Configuration:**
```javascript
Port:                3001 (default, configurable via PORT env var)
CORS Origins:        localhost:5173, localhost:5174
Environment:         development (configurable via NODE_ENV)
API Base Path:       /api
```

**Server Startup:**
```bash
npm start              # Production start
npm run dev           # Development with auto-restart
```

### 2. Database Schema

#### Users Table

```sql
CREATE TABLE users (
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

-- Indexes for query optimization
CREATE INDEX idx_github_id ON users(github_id);
CREATE INDEX idx_github_username ON users(github_username);
CREATE INDEX idx_wallet_address ON users(wallet_address);
```

**Purpose:** Stores user profiles linked from GitHub OAuth

**Key Fields:**
- `github_id`: Unique GitHub user ID (immutable identifier)
- `github_username`: GitHub login name (used for lookups)
- `email`: User email from GitHub profile
- `avatar_url`: GitHub profile picture
- `github_oauth_token`: OAuth access token for API calls
- `wallet_address`: Connected Ethereum wallet (optional initially)

#### Commitments Table

```sql
CREATE TABLE commitments (
  id SERIAL PRIMARY KEY,
  github_username VARCHAR(255) NOT NULL,
  wallet_address VARCHAR(255) NOT NULL,
  stake_amount DECIMAL(20, 18) NOT NULL,
  staking_period INT NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  days_complete INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(github_username, wallet_address, status)
);

-- Indexes for query optimization
CREATE INDEX idx_commitments_github ON commitments(github_username);
CREATE INDEX idx_commitments_wallet ON commitments(wallet_address);
CREATE INDEX idx_commitments_status ON commitments(status);
```

**Purpose:** Tracks user commitments and staking information

**Key Fields:**
- `github_username`: GitHub username of committer
- `wallet_address`: Ethereum wallet address (for rewards/stake)
- `stake_amount`: Amount staked in weETH (with 18 decimals)
- `staking_period`: Duration in days (typically 7)
- `status`: 'active', 'completed', 'forfeited'
- `days_complete`: Number of successful commit days tracked
- `UNIQUE constraint`: Only one active commitment per user per wallet

---

## API Endpoints Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication

All protected endpoints require JWT token in Authorization header:
```http
Authorization: Bearer <jwt_token>
```

Token format: JWT with 30-day expiration containing:
- `userId`: Database user ID
- `githubId`: GitHub user ID
- `githubUsername`: GitHub username
- `email`: User email

### Authentication Endpoints (`/api/auth`)

#### POST /api/auth/github

**Purpose:** Exchange GitHub OAuth code for JWT token

**Request:**
```json
{
  "code": "abc123def456",
  "state": "random_csrf_token"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "githubId": 12345678,
    "username": "johng2023",
    "email": "user@example.com",
    "avatarUrl": "https://avatars.githubusercontent.com/u/12345678"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Failed to exchange code for token: bad_verification_code"
}
```

**Flow:**
1. Frontend sends authorization code from GitHub callback
2. Backend exchanges code for access token with GitHub API
3. Backend fetches user profile from GitHub API
4. Backend saves/updates user in PostgreSQL database
5. Backend generates JWT token (30-day expiration)
6. JWT is returned to frontend for authenticated requests

**Error Codes:**
- 400: Missing authorization code
- 401: Failed to exchange code or fetch user data
- 500: Internal server error (database, network)

---

#### GET /api/auth/profile

**Purpose:** Get authenticated user profile

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "github_id": 12345678,
    "github_username": "johng2023",
    "email": "user@example.com",
    "avatar_url": "https://avatars.githubusercontent.com/u/12345678",
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc54e4f95f49d1",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid token" or "User not found"
}
```

**Error Codes:**
- 401: Missing or invalid token
- 404: User not found in database
- 500: Internal server error

---

#### POST /api/auth/wallet

**Purpose:** Update user's connected wallet address

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc54e4f95f49d1"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "github_username": "johng2023",
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc54e4f95f49d1"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Missing wallet address" or "Invalid token"
}
```

**Error Codes:**
- 400: Missing wallet address
- 401: Missing or invalid token
- 404: User not found
- 500: Internal server error

---

### Commitment Endpoints (`/api/commitments`)

#### POST /api/commitments/create

**Purpose:** Create a new commitment

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "githubUsername": "johng2023",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc54e4f95f49d1",
  "stakeAmount": "0.01",
  "stakingPeriod": 7
}
```

**Response (Success):**
```json
{
  "success": true,
  "commitment": {
    "id": 1,
    "github_username": "johng2023",
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc54e4f95f49d1",
    "stake_amount": "0.01",
    "staking_period": 7,
    "status": "active",
    "days_complete": 0,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error - Duplicate):**
```json
{
  "success": false,
  "error": "User already has an active commitment"
}
```

**Validation:**
- GitHub username must be validated
- Wallet address must be valid Ethereum address format
- Stake amount must be > 0
- Staking period must be > 0
- Check for existing active commitment (UNIQUE constraint)

**Error Codes:**
- 400: Missing required fields or validation failed
- 401: Missing or invalid token
- 500: Database error

---

#### GET /api/commitments/get/:githubUsername/:walletAddress

**Purpose:** Retrieve active commitment for a user

**URL Parameters:**
- `githubUsername`: GitHub username (URL encoded)
- `walletAddress`: Ethereum wallet address

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response (Found):**
```json
{
  "success": true,
  "commitment": {
    "id": 1,
    "github_username": "johng2023",
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc54e4f95f49d1",
    "stake_amount": "0.01",
    "staking_period": 7,
    "status": "active",
    "days_complete": 2,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-17T10:30:00.000Z"
  }
}
```

**Response (Not Found):**
```json
{
  "success": true,
  "commitment": null
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid token"
}
```

**Error Codes:**
- 401: Missing or invalid token
- 500: Database error

---

### Health Check Endpoint

#### GET /api/health

**Purpose:** Verify backend is running and responsive

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

**Use Case:** Load balancer health checks, frontend connectivity verification

---

## Chainlink Functions Oracle Implementation

### Overview

The Chainlink Functions oracle (`Backend/chainlink/`) enables **decentralized, on-chain verification** of GitHub commits without centralized oracles.

### File: checkGithubCommit.js

**Purpose:** Verifies if a user made at least one commit on a specific date

**Input Arguments:**
```javascript
args[0]: string  // GitHub username (e.g., "johng2023")
args[1]: number  // Day index (0-6, where 0 = commitment start date)
args[2]: number  // Commitment start timestamp (milliseconds)
```

**Process:**
```javascript
1. Calculate target date: startTime + (dayIndex * 24 hours)
2. Fetch GitHub events: GET /users/{username}/events (30 most recent)
3. Parse events for PushEvent type
4. Filter events by target date
5. Return: 1 (committed) or 0 (not committed)
```

**Output:**
```javascript
// Encoded as bytes32
0x0000000000000000000000000000000000000000000000000000000000000001  // Committed
0x0000000000000000000000000000000000000000000000000000000000000000  // Not committed
```

**Example Execution:**
```bash
# User johng2023, checking day 0 (commitment start), starting Jan 15, 2024
node test-local.js johng2023 0 1705276800000

# Expected output:
# ✅ Fetched events successfully
# ✅ Target date: 2024-01-15
# ✅ Found 3 commits on target date
# Result: 1 (SUCCESS)
```

### Configuration: config.json

```json
{
  "chainlinkFunctions": {
    "network": "sepolia",           // Ethereum Sepolia testnet
    "subscriptionId": "5874",        // Chainlink Functions subscription
    "donId": "fun-ethereum-sepolia-1", // Decentralized Oracle Network ID
    "gasLimit": 300000              // Gas limit for oracle callback
  },
  "commitLock": {
    "contractAddress": "0x1953f602eFd1CBd16846A440421F4824024ae60c",
    "network": "sepolia",
    "stakeAmount": "0.01",          // Minimum stake amount
    "duration": 7                    // Commitment duration in days
  }
}
```

### Test Script: test-local.js

**Purpose:** Test oracle functionality without on-chain deployment

**Usage:**
```bash
# Test with defaults (octocat, day 0)
node test-local.js

# Test specific user
node test-local.js johng2023

# Test specific user and day
node test-local.js johng2023 0

# Test specific user, day, and timestamp
node test-local.js johng2023 0 1705276800000
```

**Output Example:**
```
🔍 Fetching GitHub events for: johng2023
📅 Target date: Mon Jan 15 2024 00:00:00 GMT+0000
🔄 Processing 30 recent GitHub events...
✅ Fetched events successfully
✅ Found 3 commits on target date
✅ Result encoded correctly
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Result: 1 (User HAS committed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Integration Points

**Smart Contract Integration:**
1. Smart contract calls `requestCommitVerification(username, dayIndex, startTime)`
2. Chainlink Functions DON executes `checkGithubCommit.js`
3. Oracle returns 1 or 0 via callback function
4. Smart contract updates `commitments[userAddress].daysComplete`

**Automation Integration (Future):**
1. Chainlink Automation triggers daily at specified time
2. For each active commitment, request verification
3. Process oracle responses
4. Update commitment status (completed/forfeited)

---

## Environment Variables

### Backend (.env)

```bash
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=Ov23liE9xCr5zXlkPhkl
GITHUB_CLIENT_SECRET=b4de86cdf536ed9d4c2fbd3ad22c852a44176a3e
GITHUB_REDIRECT_URI=http://localhost:5173/callback

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=Theguck20
DB_NAME=gitaccountable

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Server Configuration
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)

```bash
# GitHub OAuth
VITE_GITHUB_CLIENT_ID=Ov23liE9xCr5zXlkPhkl
VITE_GITHUB_REDIRECT_URI=http://localhost:5173/callback

# Backend API
VITE_API_URL=http://localhost:3001/api

# WalletConnect (optional, for Wallet Modal)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

---

## Security Considerations

### Critical Issues ⚠️

1. **Exposed Credentials**
   - GitHub Client ID and Secret are visible in .env
   - **Action:** Rotate OAuth app immediately
   - **Process:**
     1. Go to https://github.com/settings/developers
     2. Delete existing OAuth app
     3. Create new OAuth app
     4. Update GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET

2. **JWT Secret in Code**
   - Default JWT_SECRET is placeholder
   - **Action:** Generate secure random secret for production
   - **Example:**
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

3. **Database Password in .env**
   - PostgreSQL password visible in version control
   - **Action:** Use environment-specific .env files
   - **Production:** Use secret management (AWS Secrets Manager, HashiCorp Vault)

4. **GitHub Token Storage**
   - OAuth tokens stored plaintext in database
   - **Improvement:** Encrypt tokens at rest
   - **Use:** Database-level encryption or application-level encryption

### API Security

1. **CSRF Protection**
   - State parameter implemented in OAuth flow
   - Validated in Callback component

2. **Token Security**
   - JWT tokens expire after 30 days
   - Stored in localStorage (consider httpOnly cookies)
   - Bearer token format in Authorization header

3. **Rate Limiting**
   - GitHub API: 60 requests/hour (unauthenticated)
   - **Improvement:** Add GitHub personal access token (5,000/hour)
   - **Backend:** Implement rate limiting middleware

4. **Input Validation**
   - GitHub username validated before API calls
   - Wallet address format checking needed
   - SQL injection protection: parameterized queries in use

---

## Dependencies

### Backend (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.2",          // Web framework
    "cors": "^2.8.5",              // Cross-origin requests
    "dotenv": "^16.3.1",           // Environment variables
    "pg": "^8.11.3",               // PostgreSQL client
    "jsonwebtoken": "^9.0.0",      // JWT authentication
    "node-fetch": "^2.7.0"         // HTTP requests
  },
  "devDependencies": {
    "nodemon": "^3.0.2"            // Development auto-restart
  }
}
```

### Frontend (package.json)

```json
{
  "dependencies": {
    "@rainbow-me/rainbowkit": "^2.1.5",  // Wallet UI
    "@tailwindcss/vite": "^4.1.17",      // CSS framework
    "ethers": "^6.13.0",                  // Ethereum library (legacy)
    "react": "^19.1.1",                   // UI library
    "react-router-dom": "^7.9.5",         // Routing
    "viem": "^2.21.16",                   // Ethereum library (modern)
    "wagmi": "^2.12.10"                   // React Ethereum hooks
  }
}
```

---

## Integration Checklist

### ✅ Fully Connected
- [x] Frontend ↔ Backend API (HTTP/REST)
- [x] Backend ↔ PostgreSQL (database persistence)
- [x] Frontend ↔ GitHub OAuth (authentication)
- [x] Frontend ↔ RainbowKit (wallet connection)

### ⚠️ Partially Connected
- [ ] Frontend ↔ Smart Contract (needs contract ABI)
- [ ] Smart Contract ↔ Chainlink (needs subscription)

### ❌ Not Yet Connected
- [ ] Chainlink Oracle ↔ Smart Contract (needs deployment)
- [ ] Automated daily verification (needs Chainlink Automation)
- [ ] Event listeners/indexing (future feature)

---

## Pulling Backend Branch Changes

To integrate the Chainlink oracle code from the remote Backend branch:

```bash
# From project root
cd /Users/johnguckian/GitAccountable

# Add remote if not already added
git remote add origin https://github.com/johng2023/gitAccountable.git

# Fetch Backend branch
git fetch origin Backend

# View what's in Backend branch
git checkout origin/Backend -- Backend/chainlink/

# Commit the new files
git add Backend/chainlink/
git commit -m "merge: add Chainlink Functions oracle implementation from Backend branch"
```

---

## References

- GitHub Docs: https://docs.github.com/en/rest/activity/events
- Chainlink Functions: https://docs.chain.link/chainlink-functions/
- Express.js: https://expressjs.com/
- PostgreSQL: https://www.postgresql.org/docs/
- Wagmi: https://wagmi.sh/
- RainbowKit: https://www.rainbowkit.com/

---

**Last Updated:** January 2024
**Status:** Complete Backend branch analysis
