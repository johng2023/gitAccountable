# GitAccountable Backend

Express.js backend for GitHub OAuth authentication and eETH staking integration.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL Database

Make sure PostgreSQL is running on your system. Then run:

```bash
npm run setup
```

This will:
- Create the `gitaccountable` database
- Create the `users` table
- Create necessary indexes
- Verify the connection

### 3. Start the Backend

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The backend will start on `http://localhost:3001`

## Environment Variables

Create a `.env` file with the following (already created):

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:5174/callback

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=gitaccountable

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Server
PORT=3001
NODE_ENV=development
```

## API Endpoints

### GitHub OAuth

**POST** `/api/auth/github`

Exchange GitHub authorization code for JWT token.

**Request:**
```json
{
  "code": "github_authorization_code",
  "state": "optional_state_value"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "githubId": 12345,
    "username": "octocat",
    "email": "octocat@github.com",
    "avatarUrl": "https://avatars.githubusercontent.com/u/1?v=4"
  }
}
```

### Get User Profile

**GET** `/api/auth/profile`

Get authenticated user's profile. Requires JWT token in Authorization header.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "github_id": 12345,
    "github_username": "octocat",
    "email": "octocat@github.com",
    "avatar_url": "https://avatars.githubusercontent.com/u/1?v=4",
    "wallet_address": "0x...",
    "created_at": "2025-11-08T12:00:00Z"
  }
}
```

### Update Wallet Address

**POST** `/api/auth/wallet`

Update the user's connected wallet address.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "walletAddress": "0x1234567890123456789012345678901234567890"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "github_username": "octocat",
    "wallet_address": "0x1234567890123456789012345678901234567890"
  }
}
```

### Health Check

**GET** `/api/health`

Check if the backend is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-08T12:00:00Z",
  "environment": "development"
}
```

## Database Schema

### Users Table

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

CREATE INDEX idx_github_id ON users(github_id);
CREATE INDEX idx_github_username ON users(github_username);
CREATE INDEX idx_wallet_address ON users(wallet_address);
```

## Testing

### Test GitHub OAuth Endpoint

```bash
curl -X POST http://localhost:3001/api/auth/github \
  -H "Content-Type: application/json" \
  -d '{"code": "REAL_GITHUB_CODE", "state": "optional_state"}'
```

### Test Health Check

```bash
curl http://localhost:3001/api/health
```

## Troubleshooting

### PostgreSQL Connection Error

If you see "ECONNREFUSED":
1. Make sure PostgreSQL is running
2. Check the credentials in `.env` file
3. Verify the database and user exist

```bash
# On macOS with Homebrew:
brew services start postgresql@15

# Or check if it's running:
brew services list
```

### Database Setup Failed

If `npm run setup` fails:
1. Make sure PostgreSQL is running
2. Verify `DB_USER` and `DB_PASSWORD` in `.env`
3. Make sure the user has permission to create databases

### Port Already in Use

If port 3001 is already in use:
```bash
# Change the port in .env
PORT=3002
```

### JWT Token Errors

Make sure:
- `JWT_SECRET` is set in `.env`
- Token hasn't expired (30 day expiration)
- Token is being sent correctly in Authorization header

## Development

### File Structure

```
Backend/
├── server.js              # Main Express server
├── db.js                  # Database connection and initialization
├── setup-db.js            # Database setup script
├── routes/
│   └── auth.js            # OAuth and auth routes
├── .env                   # Environment variables (local)
├── .env.example           # Environment template
├── package.json
└── README.md
```

### Adding New Routes

1. Create a new file in `routes/` directory
2. Import it in `server.js`
3. Add the route with `app.use('/api/path', routeHandler)`

### Database Queries

Use the `query` function from `db.js`:

```javascript
const { query } = require('../db');

const result = await query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);
```

## Production Deployment

### Before Deploying

1. [ ] Change `JWT_SECRET` to a random, strong value
2. [ ] Change `GITHUB_CLIENT_SECRET` to production value
3. [ ] Update GitHub OAuth callback URL to production domain
4. [ ] Set `NODE_ENV=production`
5. [ ] Set proper CORS origins in `server.js`
6. [ ] Use HTTPS everywhere
7. [ ] Back up your PostgreSQL database
8. [ ] Review `.env.example` and ensure all vars are set

### Environment Setup

```env
NODE_ENV=production
PORT=3001
GITHUB_CLIENT_ID=your_prod_client_id
GITHUB_CLIENT_SECRET=your_prod_client_secret
GITHUB_REDIRECT_URI=https://yourdomain.com/callback
DB_HOST=your_database_host
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_strong_password
DB_NAME=gitaccountable
JWT_SECRET=your_very_long_random_secret_key_min_32_chars
```

### Hosting Options

- **Heroku**: `git push heroku main`
- **Railway**: Push to Railway via CLI
- **AWS EC2**: Deploy Node app with PM2
- **DigitalOcean App Platform**: Connect Git repo
- **Vercel**: Deploy with Vercel Serverless Functions
- **Azure**: Deploy with App Service

## Support

For issues or questions, check the main GitAccountable documentation in the root directory.
