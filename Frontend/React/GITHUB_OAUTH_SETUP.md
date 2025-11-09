# GitHub OAuth Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"** button
3. Fill in the form:
   - **Application name:** `CommitLock` (or any name you prefer)
   - **Homepage URL:** `http://localhost:5173`
   - **Application description:** (optional) `Blockchain accountability with GitHub commit tracking`
   - **Authorization callback URL:** `http://localhost:5173/auth/github/callback`
4. Click **"Register application"**

### Step 2: Get Client ID

1. After registration, you'll see your OAuth app details page
2. Copy the **Client ID** (looks like: `Iv1.abc123def456`)
3. **DO NOT generate a Client Secret** - we're using a client-side flow

### Step 3: Add to .env

1. Open `Frontend/React/.env`
2. Add the following line:
   ```bash
   VITE_GITHUB_CLIENT_ID=Iv1.YOUR_CLIENT_ID_HERE
   ```
3. Replace `YOUR_CLIENT_ID_HERE` with your actual Client ID
4. Save the file

### Step 4: Restart Dev Server

```bash
# Stop the current dev server (Ctrl+C)
# Restart it to load the new environment variable
npm run dev
```

## Example .env File

Your `.env` should now look like this:

```bash
# Smart Contract Address
VITE_COMMIT_LOCK_ADDRESS=0x1953f602eFd1CBd16846A440421F4824024ae60c

# WalletConnect Project ID
VITE_WALLETCONNECT_PROJECT_ID=134dc301524620be473beb86be21de34

# RPC URLs
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/yBQWnhxBhev9DOf-KfAnp

# GitHub OAuth Client ID (NEW!)
VITE_GITHUB_CLIENT_ID=Iv1.abc123def456

# GitHub API Token (optional)
VITE_GITHUB_TOKEN=your_github_pat_here
```

## Testing OAuth

After setup, you should be able to:

1. Open http://localhost:5173
2. Connect your wallet
3. Click "Connect GitHub" button
4. GitHub authorization popup appears
5. Authorize the app
6. Redirected back to your app with GitHub connected

## Troubleshooting

### "Invalid Client ID" Error
- Double-check you copied the entire Client ID from GitHub
- Ensure there are no spaces before/after the ID in .env
- Restart the dev server after changing .env

### OAuth Popup Blocked
- Allow popups for localhost:5173 in your browser
- Try using window redirect instead of popup (fallback implemented)

### Callback URL Mismatch
- Ensure callback URL in GitHub app is exactly: `http://localhost:5173/auth/github/callback`
- No trailing slash
- Must match exactly (http vs https, localhost vs 127.0.0.1)

## Production Deployment

When deploying to production (e.g., Vercel):

1. Update OAuth app settings on GitHub:
   - Homepage URL: `https://your-domain.com`
   - Callback URL: `https://your-domain.com/auth/github/callback`
2. Add `VITE_GITHUB_CLIENT_ID` to your hosting platform's environment variables
3. Redeploy

## Security Note

The Client ID is safe to expose publicly (it's visible in browser). We're using GitHub's Device Flow which doesn't require a Client Secret for public applications.
