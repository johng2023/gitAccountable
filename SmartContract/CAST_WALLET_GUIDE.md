# Cast Wallet Quick Reference Guide

## What is Cast Wallet?

Cast Wallet is Foundry's secure key management system that stores your private keys **encrypted** on disk instead of in plain text `.env` files. This is much more secure!

## ✅ You Already Have a Wallet!

According to your `cast wallet list` output, you already have a wallet named **"deployer"** imported. Great!

## Common Commands

### View Your Wallets
```bash
cast wallet list
```
**Output:**
```
deployer (Local)
```

### Get Wallet Address
```bash
cast wallet address --account deployer
```
This shows the Ethereum address for your deployer wallet.

### Import a New Wallet (if needed)
```bash
cast wallet import my-wallet --interactive
# You'll be prompted to:
# 1. Enter your private key
# 2. Set a password to encrypt it
```

### Remove a Wallet
```bash
cast wallet remove deployer
# Careful! This deletes the encrypted keystore file
```

## Using Cast Wallet for Deployment

### Old Way (Insecure ❌)
```bash
# .env file
PRIVATE_KEY=0x1234567890abcdef...  # Plain text - BAD!

# Deploy
forge script script/Deploy.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast
```

### New Way (Secure ✅)
```bash
# .env file - NO PRIVATE_KEY!
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
ETHERSCAN_API_KEY=your_key_here

# Deploy with Cast wallet
forge script script/Deploy.s.sol:DeployCommitLock \
  --rpc-url $SEPOLIA_RPC_URL \
  --account deployer \
  --sender $(cast wallet address --account deployer) \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

**You'll be prompted for your password during deployment!**

## Where Are Keys Stored?

Your encrypted keystore files are at:
```
~/.foundry/keystores/deployer
```

This file is **encrypted** with your password. Even if someone gets this file, they can't use it without your password!

## For Other Contract Interactions

### Sending Transactions
```bash
# Old way with private key in .env
cast send $CONTRACT_ADDRESS "functionName()" --private-key $PRIVATE_KEY

# New way with Cast wallet (you'll be prompted for password)
cast send $CONTRACT_ADDRESS "functionName()" \
  --account deployer \
  --rpc-url $SEPOLIA_RPC_URL
```

### Example: Record Daily Check
```bash
cast send $CONTRACT_ADDRESS \
  "recordDailyCheck(address,uint8,bool)" \
  $USER_ADDRESS 0 true \
  --account deployer \
  --rpc-url $SEPOLIA_RPC_URL
```

## Security Best Practices

✅ **Do:**
- Use Cast wallet for all deployments and transactions
- Use a strong password for your keystore
- Back up your keystore files (they're encrypted!)
- Keep your password secure

❌ **Don't:**
- Put private keys in `.env` files
- Commit `.env` files to git
- Share your Cast wallet password
- Use weak passwords

## Troubleshooting

### "Account not found"
```bash
cast wallet list
# Make sure "deployer" is in the list
```

### "Wrong password"
- You entered the wrong password for the encrypted keystore
- Try again or recreate with `cast wallet import`

### "Sender address mismatch"
Make sure the `--sender` address matches your deployer wallet:
```bash
cast wallet address --account deployer
```

## Quick Deployment Checklist

- [x] Wallet imported: `cast wallet list` shows "deployer"
- [ ] Know wallet address: `cast wallet address --account deployer`
- [ ] `.env` created with RPC_URL and ETHERSCAN_API_KEY (NO PRIVATE_KEY!)
- [ ] Ready to deploy with `--account deployer` flag
- [ ] Remember your wallet password!

---

**Your setup is already secure with Cast wallet!** 🔒

Just make sure to use `--account deployer` and `--sender $(cast wallet address --account deployer)` in all your deployment commands.
