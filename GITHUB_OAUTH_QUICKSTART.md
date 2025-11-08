# GitHub OAuth Quick Start Guide

## 5-Minute Setup

### Step 1: Create GitHub OAuth App (2 minutes)

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `GitAccountable`
   - **Homepage URL**: `http://localhost:5174`
   - **Authorization callback URL**: `http://localhost:5174/callback`
4. Click **"Register application"**
5. You'll see your **Client ID** and **Client Secret**

**⚠️ Important:** Keep your Client Secret safe! Never commit it to git.

---

### Step 2: Add Environment Variables (1 minute)

**In `/Frontend/React/.env.local`:**
```env
VITE_GITHUB_CLIENT_ID=abc123def456xyz
VITE_GITHUB_REDIRECT_URI=http://localhost:5174/callback
VITE_API_URL=http://localhost:3001/api
```

Copy the Client ID from GitHub (from step 1).

**In `/Backend/.env`:**
```env
GITHUB_CLIENT_ID=abc123def456xyz
GITHUB_CLIENT_SECRET=your_secret_key_here
GITHUB_REDIRECT_URI=http://localhost:5174/callback
JWT_SECRET=random_jwt_secret_key
DATABASE_URL=postgresql://user:password@localhost:5432/gitaccountable
PORT=3001
```

Copy both Client ID and Client Secret from GitHub.

---

### Step 3: Frontend is Ready (Already Done)

The frontend is already set up:
- ✅ Landing page has GitHub login button
- ✅ Callback page (`/callback`) handles OAuth redirect
- ✅ Routes configured in App.jsx

Just test it:
1. Go to `http://localhost:5174`
2. Click "Login with GitHub"
3. You'll be redirected to GitHub
4. After approving, GitHub redirects you back to `/callback`

---

### Step 4: Backend Implementation (Backend Developer)

Copy the code from `Backend/github-oauth-endpoint.js` into your backend:

```javascript
// In your Express server (app.js or server.js)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
```

This endpoint:
- Receives the `code` from frontend
- Exchanges it for a GitHub access token
- Gets user data from GitHub
- Saves user to PostgreSQL database
- Returns JWT token to frontend

---

## How It Works

```
1. User clicks "Login with GitHub" button
   ↓
2. Frontend redirects to: https://github.com/login/oauth/authorize
   (with Client ID and callback URL)
   ↓
3. User authorizes the app on GitHub
   ↓
4. GitHub redirects user back to: http://localhost:5174/callback?code=xyz&state=abc
   ↓
5. Frontend's Callback component reads the `code` parameter
   ↓
6. Frontend sends `code` to backend: POST /api/auth/github
   ↓
7. Backend exchanges `code` for GitHub access token
   ↓
8. Backend fetches user data from GitHub API
   ↓
9. Backend saves user to database
   ↓
10. Backend creates JWT token and sends it back to frontend
    ↓
11. Frontend stores JWT in localStorage
    ↓
12. Frontend updates app context with GitHub username
    ↓
13. Frontend redirects to /create or /dashboard
```

---

## Database Setup

Create this table in PostgreSQL:

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

---

## Testing

### Test Locally

1. **Start Frontend:**
   ```bash
   cd Frontend/React
   npm install
   npm run dev
   # Goes to http://localhost:5174
   ```

2. **Start Backend:**
   ```bash
   cd Backend
   npm install
   node server.js
   # Runs on http://localhost:3001
   ```

3. **Test OAuth:**
   - Go to http://localhost:5174
   - Click "Login with GitHub"
   - You'll see a loading spinner while authenticating
   - After GitHub authorization, you'll see user data

### Test with cURL

```bash
curl -X POST http://localhost:3001/api/auth/github \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AUTHORIZATION_CODE_FROM_GITHUB",
    "state": "optional_state"
  }'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "avatarUrl": "https://avatars.githubusercontent.com/u/12345?v=4",
    "email": "john@example.com"
  }
}
```

---

## Security Checklist

- [ ] Client Secret is in `.env` file (not in git)
- [ ] JWT Secret is random and strong
- [ ] GitHub token is encrypted in database (use encryption library)
- [ ] HTTPS used in production
- [ ] CSRF protection implemented (use `state` parameter)
- [ ] Token expiration set (30 days default)
- [ ] Refresh token mechanism (optional but recommended)

---

## Troubleshooting

### "No authorization code received"
- Make sure GitHub app callback URL matches your frontend URL
- Check browser console for errors

### "Backend error: 401 Unauthorized"
- Verify Client ID and Client Secret in backend .env
- Check GitHub app settings on github.com/settings/developers

### "Database error"
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env
- Run the CREATE TABLE script above

### "Token invalid"
- JWT_SECRET might be different between requests
- Make sure JWT_SECRET is the same in backend

### Frontend shows error after GitHub auth
- Check browser Network tab to see backend response
- Make sure backend is running on port 3001
- Check VITE_API_URL in frontend .env.local

---

## Production Deployment

1. **Create separate GitHub OAuth App** for production
   - Use production URLs (https://yourdomain.com)
   - Update callback URL to: https://yourdomain.com/callback

2. **Update environment variables** on your hosting:
   - Frontend: Vercel, Netlify, etc. (environment variables)
   - Backend: Heroku, Railway, AWS, etc. (environment variables)

3. **Use HTTPS everywhere**

4. **Use strong secrets:**
   - Generate new JWT_SECRET
   - Generate new GitHub Client Secret
   - Use proper database backups

5. **Enable CORS properly:**
   ```javascript
   app.use(cors({
     origin: 'https://yourdomain.com',
     credentials: true
   }));
   ```

---

## Next Steps

1. ✅ Frontend OAuth flow (already done)
2. ✅ Backend OAuth endpoint template (provided)
3. → Implement backend with your Node.js framework
4. → Connect to PostgreSQL database
5. → Test end-to-end
6. → Deploy to production

---

## Need Help?

- GitHub OAuth docs: https://docs.github.com/en/developers/apps/building-oauth-apps
- Wagmi docs: https://wagmi.sh
- Express.js docs: https://expressjs.com
- PostgreSQL docs: https://www.postgresql.org/docs
