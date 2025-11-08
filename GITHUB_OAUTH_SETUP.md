# GitHub OAuth Setup Guide

## Step 1: Create GitHub OAuth Application

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in the form:
   - **Application name**: GitAccountable
   - **Homepage URL**: `http://localhost:5174` (for development)
   - **Authorization callback URL**: `http://localhost:5174/callback`
4. Click **"Register application"**
5. You'll see:
   - **Client ID** (copy this)
   - **Client Secret** (copy this - keep it safe!)

## Step 2: Update Environment Variables

Create or update `.env.local` in `/Frontend/React/`:

```env
VITE_GITHUB_CLIENT_ID=your_client_id_here
VITE_GITHUB_REDIRECT_URI=http://localhost:5174/callback
```

**Note:** The `VITE_GITHUB_CLIENT_ID` is safe to expose in frontend (it's public). The `VITE_GITHUB_REDIRECT_URI` defines where users are sent after authenticating.

## Step 3: Frontend Flow

### Landing Page Button
```javascript
// User clicks "Login with GitHub"
window.location.href = `https://github.com/login/oauth/authorize?client_id=${
  import.meta.env.VITE_GITHUB_CLIENT_ID
}&redirect_uri=${window.location.origin}/callback&scope=user`;
```

This redirects to GitHub, where user authorizes the app.

### Callback Page
GitHub redirects user to `/callback` with:
- **code** parameter: Authorization code (valid for 10 minutes)
- **state** parameter: Optional CSRF protection

## Step 4: Backend Implementation (Node.js)

Your backend needs to:

1. **Exchange code for access token**
   ```javascript
   POST https://github.com/login/oauth/access_token
   {
     client_id: YOUR_CLIENT_ID,
     client_secret: YOUR_CLIENT_SECRET,
     code: AUTHORIZATION_CODE
   }
   ```

2. **Get user data**
   ```javascript
   GET https://api.github.com/user
   Authorization: token ACCESS_TOKEN
   ```

3. **Store token & return to frontend**

## Environment Variables

### Frontend (.env.local in Frontend/React/)
```env
VITE_GITHUB_CLIENT_ID=abc123def456
VITE_GITHUB_REDIRECT_URI=http://localhost:5174/callback
VITE_API_URL=http://localhost:3001/api
```

### Backend (.env in root)
```env
GITHUB_CLIENT_ID=abc123def456
GITHUB_CLIENT_SECRET=your_secret_key_here
GITHUB_REDIRECT_URI=http://localhost:5174/callback
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=postgresql://user:password@localhost:5432/gitaccountable
```

## Production URLs

When deploying:

### Frontend (Vercel, Netlify, etc.)
```env
VITE_GITHUB_CLIENT_ID=prod_client_id
VITE_GITHUB_REDIRECT_URI=https://yourdomain.com/callback
VITE_API_URL=https://api.yourdomain.com
```

### GitHub OAuth App Settings
Update the Authorization callback URL to:
- `https://yourdomain.com/callback`

You'll need to create a separate GitHub OAuth app for production!

## Scopes Explained

**Current scope: `user`**
- Read public profile data
- Username, email, avatar

**Other useful scopes:**
- `repo` - Read/write repository access
- `admin:repo_hook` - Webhook management
- `read:user` - Read user profile

---

## Testing Locally

1. Start dev server: `npm run dev`
2. Go to `http://localhost:5174`
3. Click "Login with GitHub"
4. Authorize the app
5. You'll be redirected to `/callback` with `?code=xyz&state=abc`

---

## Security Notes

⚠️ **NEVER commit your GitHub Client Secret to git!**
- Use `.env.local` (already in .gitignore)
- Keep secrets in CI/CD environment variables
- Rotate secrets if accidentally exposed

## Backend Endpoint Example

```javascript
// POST /api/auth/github
app.post('/api/auth/github', async (req, res) => {
  const { code } = req.body;

  // 1. Exchange code for token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code
    })
  });

  const { access_token } = await tokenResponse.json();

  // 2. Get user data
  const userResponse = await fetch('https://api.github.com/user', {
    headers: { 'Authorization': `token ${access_token}` }
  });

  const githubUser = await userResponse.json();

  // 3. Save to database & create JWT
  const user = await db.users.upsert({
    github_username: githubUser.login,
    github_oauth_token: access_token,
    github_id: githubUser.id,
    avatar_url: githubUser.avatar_url
  });

  const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

  // 4. Redirect frontend with token
  res.json({
    success: true,
    token: jwtToken,
    user: { id: user.id, username: githubUser.login }
  });
});
```
