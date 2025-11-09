# WalletConnect Setup Guide for CommitLock

## Why Do You Need WalletConnect?

WalletConnect enables your dApp to connect with multiple wallet providers (MetaMask, Trust Wallet, Coinbase Wallet, etc.) through RainbowKit. A **Project ID** is required to use their relay service.

## Setup Steps (5 minutes)

### 1. Create WalletConnect Cloud Account

🔗 **Go to:** https://cloud.walletconnect.com/

1. Click **"Sign Up"** (top right)
2. Sign up with:
   - Email + password, OR
   - GitHub account, OR
   - Google account

### 2. Create a New Project

Once logged in:

1. Click **"Create New Project"** or **"+ New Project"** button
2. Fill in project details:
   - **Project Name:** `CommitLock` (or any name you prefer)
   - **Project Description:** `Blockchain accountability platform with GitHub commit tracking and Ether.Fi staking`
   - **Project URL (optional):** Leave blank for now (add later when deployed)
   - **Icon (optional):** Leave blank or upload CommitLock logo

3. Click **"Create"** or **"Save"**

### 3. Get Your Project ID

After creating the project:

1. You'll see your project in the dashboard
2. Click on the project name to open project details
3. Look for **"Project ID"** - it looks like:
   ```
   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```
   (32 hexadecimal characters)

4. Click the **copy icon** 📋 next to the Project ID

### 4. Add to Your `.env` File

1. Open `Frontend/React/.env` in your editor
2. Replace `your_project_id_here` with your actual Project ID:

```bash
# Before:
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here

# After (example):
VITE_WALLETCONNECT_PROJECT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

3. Save the file

### 5. Verify Configuration

Your `.env` should now look like:

```bash
# Smart Contract Address (deployed on Sepolia)
VITE_COMMIT_LOCK_ADDRESS=0x1953f602eFd1CBd16846A440421F4824024ae60c

# WalletConnect Project ID ✅ CONFIGURED
VITE_WALLETCONNECT_PROJECT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# RPC URLs (optional)
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# GitHub API (optional)
VITE_GITHUB_TOKEN=your_github_pat_here
```

## Test Your Setup

### Start the Frontend

```bash
cd Frontend/React
npm install  # If you haven't already
npm run dev
```

Expected output:
```
  VITE v7.1.7  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Open in Browser

1. Navigate to http://localhost:5173/
2. Click **"Connect Wallet"** button
3. You should see RainbowKit modal with wallet options:
   - MetaMask
   - WalletConnect
   - Coinbase Wallet
   - etc.

4. Connect with MetaMask (or your preferred wallet)
5. Switch network to **Sepolia** if prompted

### Verify Contract Connection

Once wallet is connected, the app should:
- Display your wallet address
- Show "Create Commitment" option if you don't have one
- Display your commitment status if you already created one

## Troubleshooting

### Error: "Invalid Project ID"

**Problem:** WalletConnect can't validate your Project ID

**Solutions:**
1. Double-check you copied the ENTIRE Project ID (32 characters)
2. Make sure there are no extra spaces before/after the ID
3. Verify the Project ID in WalletConnect Cloud dashboard
4. Try recreating the project and copying the new ID

### Error: "Module not found" or build errors

**Problem:** Dependencies not installed

**Solution:**
```bash
cd Frontend/React
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Wallet connection modal doesn't appear

**Problem:** RainbowKit not properly configured

**Check:**
1. `.env` file exists in `Frontend/React/`
2. Environment variable starts with `VITE_` prefix
3. Restart dev server after changing `.env`:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev  # Restart
   ```

### "Wrong network" message

**Problem:** Wallet connected to mainnet or different testnet

**Solution:**
1. Open MetaMask
2. Click network dropdown (top left)
3. Select **"Sepolia test network"**
4. Refresh the page

If Sepolia isn't in your list:
1. Go to https://chainlist.org/
2. Search "Sepolia"
3. Click "Add to MetaMask"

### Contract address shows as 0x0000...

**Problem:** Contract address not loaded from environment

**Check:**
1. `.env` file has correct contract address
2. Restart dev server
3. Check browser console for errors
4. Verify `VITE_COMMIT_LOCK_ADDRESS` in `.env`

## Optional: Add Custom RPC URL

For better performance, add a custom Sepolia RPC URL:

### Option 1: Infura (Recommended)

1. Go to https://infura.io/ and create free account
2. Create new project → Select "Web3 API"
3. Copy Sepolia endpoint:
   ```
   https://sepolia.infura.io/v3/YOUR_API_KEY
   ```
4. Add to `.env`:
   ```bash
   VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY
   ```

### Option 2: Alchemy

1. Go to https://www.alchemy.com/ and create free account
2. Create new app → Select "Ethereum" → "Sepolia"
3. Copy HTTP endpoint
4. Add to `.env`:
   ```bash
   VITE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   ```

### Option 3: Public RPC (No signup needed, but slower)

```bash
VITE_SEPOLIA_RPC_URL=https://rpc.sepolia.org
```

## Security Best Practices

✅ **Do:**
- Keep your Project ID public (it's safe to commit)
- Keep your deployed contract address public
- Use public RPC URLs (no authentication needed)

❌ **Don't:**
- Commit private keys or seed phrases (NEVER!)
- Share your Infura/Alchemy API keys publicly (keep in .env, add to .gitignore)
- Use production/mainnet credentials in testnet projects

## Next Steps

Once WalletConnect is configured:

1. ✅ Test wallet connection
2. ✅ Test creating a commitment (0.01 Sepolia ETH needed)
3. ✅ Test viewing dashboard
4. ⏳ Wait for oracle to check GitHub commits
5. ⏳ Test claiming funds after 7 successful days

## Quick Reference

**WalletConnect Cloud:** https://cloud.walletconnect.com/
**Project Dashboard:** https://cloud.walletconnect.com/app (after login)
**RainbowKit Docs:** https://rainbowkit.com/
**Wagmi Docs:** https://wagmi.sh/

---

**Configuration Complete! 🎉**

Your frontend is now ready to connect with Web3 wallets and interact with the CommitLock smart contract on Sepolia.
