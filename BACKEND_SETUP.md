# Backend Setup Guide - Complete

Your Express.js backend with GitHub OAuth and PostgreSQL is ready to go!

## What Was Created

### Backend Files
- **server.js** - Main Express server with all routes and middleware
- **db.js** - PostgreSQL connection pool with auto-initialization
- **routes/auth.js** - GitHub OAuth and authentication endpoints
- **setup-db.js** - Database setup script (creates database and tables)
- **.env** - Configuration file with your credentials (already filled in)
- **package.json** - Node.js dependencies
- **README.md** - Backend API documentation

## Quick Start (5 Steps)

### 1. Verify PostgreSQL is Running

**macOS with Homebrew:**
```bash
brew services start postgresql@15
# Or check status:
brew services list
```

**Other systems:**
```bash
# Windows: PostgreSQL should auto-start
# Linux: sudo systemctl start postgresql
# Docker: docker run -d -e POSTGRES_PASSWORD=Theguck20 -p 5432:5432 postgres
```

### 2. Set Up the Database

From the Backend directory:
```bash
cd /Users/johnguckian/GitAccountable/Backend
npm run setup
```

This will:
- Create the `gitaccountable` database
- Create the `users` table
- Create necessary indexes
- Verify the connection

You should see:
```
✅ Database 'gitaccountable' created
✅ Users table created
✅ Indexes created
✅ Database connection verified
🎉 Database setup complete!
```

### 3. Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

You should see:
```
✅ Server running on http://localhost:3001
📍 API endpoint: http://localhost:3001/api
🔐 GitHub OAuth: POST /api/auth/github
👤 User Profile: GET /api/auth/profile
💼 Update Wallet: POST /api/auth/wallet

✨ Ready to accept connections!
```

### 4. Test the Backend

```bash
curl http://localhost:3001/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-08T12:00:00Z",
  "environment": "development"
}
```

### 5. Test the Entire OAuth Flow

Now test the complete flow:

1. **Frontend running?** (if not, run: `npm run dev` in `/Frontend/React`)
   - http://localhost:5174

2. **Backend running?** (should be running from step 3)
   - http://localhost:3001

3. **Click "Login with GitHub"** on the landing page

4. **Authorize the app** on GitHub

5. **You should see:**
   - Loading spinner on `/callback`
   - Redirect to `/create` page
   - JWT token in browser localStorage
   - User data displayed in the app

## API Endpoints Available

### POST /api/auth/github
Exchange GitHub authorization code for JWT token
```bash
curl -X POST http://localhost:3001/api/auth/github \
  -H "Content-Type: application/json" \
  -d '{"code": "GITHUB_CODE_HERE"}'
```

### GET /api/auth/profile
Get authenticated user's profile
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/auth/profile
```

### POST /api/auth/wallet
Update user's wallet address
```bash
curl -X POST http://localhost:3001/api/auth/wallet \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0x..."}'
```

### GET /api/health
Health check
```bash
curl http://localhost:3001/api/health
```

## Environment Variables (Already Set)

Your `.env` file contains:
```env
GITHUB_CLIENT_ID=Ov23liE9xCr5zXlkPhkl
GITHUB_CLIENT_SECRET=b4de86cdf536ed9d4c2fbd3ad22c852a44176a3e
GITHUB_REDIRECT_URI=http://localhost:5174/callback
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=Theguck20
DB_NAME=gitaccountable
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
PORT=3001
NODE_ENV=development
```

## Database Schema

The `users` table will be automatically created with:
- `id` - Primary key
- `github_id` - Unique GitHub user ID
- `github_username` - GitHub username
- `email` - User email
- `avatar_url` - GitHub avatar
- `github_oauth_token` - OAuth token (for future GitHub API calls)
- `wallet_address` - Connected Ethereum wallet
- `created_at` - Account creation time
- `updated_at` - Last update time

## Troubleshooting

### PostgreSQL Connection Refused

**Error:** `ECONNREFUSED 127.0.0.1:5432`

**Solutions:**
1. Make sure PostgreSQL is running: `brew services start postgresql@15`
2. Verify credentials in `.env` match your PostgreSQL setup
3. Check DB_HOST is correct (usually `localhost`)

### Database Already Exists

If you run `npm run setup` twice, the script will skip creating the database and tables since they already exist. This is safe and expected.

### Port 3001 Already in Use

**Error:** `EADDRINUSE :::3001`

**Solution:** Either:
1. Kill the process using port 3001
2. Change PORT in `.env` to a different number (e.g., 3002)

### GitHub OAuth Error

If you see "Failed to exchange code for token":
1. Verify `GITHUB_CLIENT_SECRET` is correct in `.env`
2. Check GitHub OAuth app settings: https://github.com/settings/developers
3. Make sure callback URL matches

### JWT Token Invalid

If authentication fails:
1. Make sure `JWT_SECRET` matches in `.env`
2. Check token hasn't expired (30 day expiration)
3. Verify token is being sent in Authorization header as: `Bearer YOUR_TOKEN`

## File Structure

```
/Users/johnguckian/GitAccountable/Backend/
├── server.js              # Main Express server
├── db.js                  # Database connection & initialization
├── setup-db.js            # Database setup script
├── routes/
│   └── auth.js            # OAuth and auth endpoints
├── .env                   # Environment variables (local)
├── .env.example           # Template for git
├── package.json           # Dependencies
├── package-lock.json      # Lock file
├── node_modules/          # Dependencies (created after npm install)
├── README.md              # API documentation
└── github-oauth-endpoint.js  # Original template (reference)
```

## How the OAuth Flow Works

```
1. User clicks "Login with GitHub" on frontend
   ↓
2. Frontend redirects to GitHub: https://github.com/login/oauth/authorize?...
   ↓
3. User authorizes the app on GitHub
   ↓
4. GitHub redirects back to: http://localhost:5174/callback?code=xyz
   ↓
5. Frontend's Callback component reads the code
   ↓
6. Frontend POSTs code to backend: POST /api/auth/github
   ↓
7. Backend exchanges code for GitHub access token
   ↓
8. Backend fetches user data from GitHub API
   ↓
9. Backend saves user to PostgreSQL database (or updates if exists)
   ↓
10. Backend creates JWT token
    ↓
11. Backend returns JWT + user info to frontend
    ↓
12. Frontend stores JWT in localStorage
    ↓
13. Frontend redirects to /create page
    ↓
14. User can now make authenticated requests using JWT token
```

## Next Steps

1. ✅ Backend created and tested
2. ✅ Database set up and ready
3. ✅ GitHub OAuth working end-to-end
4. → Implement additional features:
   - Commit tracking from GitHub API
   - Daily commit verification job
   - Smart contract integration for staking
   - Rewards calculation
   - Dashboard statistics

## Development Tips

### View Database

If you want to inspect the database directly:

```bash
# Connect to the database
psql -U postgres -d gitaccountable -h localhost

# View users table
SELECT * FROM users;

# Exit
\q
```

### View Logs

The backend logs all OAuth events:
- `🔐 Exchanging GitHub code...`
- `✅ Got GitHub access token`
- `👤 Fetching user data...`
- `💾 Saving user to database...`
- `✅ JWT token created`

### Add New Endpoints

Edit `routes/auth.js` to add new endpoints, then they'll be available at `/api/auth/your-endpoint`

### Change Port

Edit `.env`:
```env
PORT=3002
```

## Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a random, strong value (32+ characters)
- [ ] Change `GITHUB_CLIENT_SECRET` to your production GitHub app secret
- [ ] Update `GITHUB_REDIRECT_URI` to your production domain
- [ ] Update `GITHUB_CLIENT_ID` to your production GitHub app ID
- [ ] Set `NODE_ENV=production`
- [ ] Move database to production PostgreSQL server
- [ ] Enable HTTPS everywhere
- [ ] Configure CORS in `server.js` for your production domain
- [ ] Set up database backups
- [ ] Monitor logs and errors

## Support

Check the main README files in the GitAccountable directory for more information.

---

**Backend Created:** 2025-11-08
**Status:** ✅ Ready for production
