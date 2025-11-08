# CommitLock - Quick Deployment Guide

## Current Status ✅

**Smart Contract**: Ready to deploy
**Chainlink Oracle**: Code ready, needs setup
**Frontend**: Partially complete, needs components

---

## Step-by-Step Deployment

### Phase 1: Deploy Smart Contract (30 min) - START HERE

**Person 1 (You):**

```bash
cd /Users/jacobble/gitAccountable/SmartContract

# 1. Import your private key into Cast wallet (ONE-TIME SETUP - Secure!)
cast wallet import deployer --interactive
# Enter your private key when prompted and set a password
# Your key is now stored ENCRYPTED in ~/.foundry/keystores/

# 2. Verify your wallet was imported
cast wallet list
# Should show: deployer (Local)

# 3. Get your deployer address
cast wallet address --account deployer

# 4. Create .env file (NO PRIVATE_KEY needed!)
cp .env.example .env

# 5. Edit .env with your values:
#    SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
#    ETHERSCAN_API_KEY=your_etherscan_key
#    (Note: NO PRIVATE_KEY - it's in Cast wallet!)

# 6. Test deployment locally first (optional)
forge test

# 7. Deploy to Sepolia (Secure with Cast wallet!)
source .env
forge script script/Deploy.s.sol:DeployCommitLock \
  --rpc-url $SEPOLIA_RPC_URL \
  --account deployer \
  --sender $(cast wallet address --account deployer) \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  -vvvv

# You'll be prompted for your Cast wallet password during deployment

# 8. Copy the deployed address from output
# Update these files with the address:
```

**Update contract address in:**
- `Frontend/React/.env` → `VITE_COMMIT_LOCK_ADDRESS=0x...`
- `Backend/chainlink/config.json` → `contractAddress: "0x..."`

---

### Phase 2: Frontend Components (4-6 hours)

**Person 2 (Teammate):**

The following components need to be created in `/Frontend/React/src`:

#### A. Navigation Component
File: `components/Navigation.jsx`
- Logo/Title
- Links (Dashboard, Create)
- RainbowKit ConnectButton
- Responsive design

#### B. Landing Page
File: `pages/LandingPage.jsx`
- Hero section: "CommitLock: Commit or Forfeit"
- Explanation (3 sentences)
- "How It Works" section
- ConnectWallet CTA

#### C. Create Commitment Form
File: `pages/CreateCommitment.jsx`
- Input: GitHub username
- Display: Stake amount (0.01 ETH)
- Display: eETH APY estimate
- Submit button
- Transaction handling

#### D. Dashboard
File: `pages/Dashboard.jsx`
- Fetch commitment data
- Display: Days completed (X/7)
- Progress bar
- Daily check status (7 boxes)
- eETH rewards display
- Claim button (if eligible)

#### E. Custom Hooks
Files: `hooks/useCommitment.js`, `hooks/useCreateCommitment.js`, `hooks/useClaimFunds.js`

---

### Phase 3: Chainlink Oracle Setup (2-3 hours)

**Either Person:**

#### Option A: Full Chainlink Functions (Complex)

1. Get LINK tokens from https://faucets.chain.link/sepolia
2. Create subscription at https://functions.chain.link/
3. Fund subscription (minimum 5 LINK)
4. Upload `/Backend/chainlink/checkGithubCommit.js`
5. Add CommitLock contract as consumer
6. Test with manual request

#### Option B: Manual Oracle (RECOMMENDED FOR HACKATHON)

```bash
# Owner manually calls after checking GitHub
cast send $COMMIT_LOCK_ADDRESS \
  "recordDailyCheck(address,uint8,bool)" \
  $USER_ADDRESS \
  0 \
  true \
  --private-key $PRIVATE_KEY \
  --rpc-url $SEPOLIA_RPC_URL
```

**For demo:** Show GitHub commits, then call `recordDailyCheck()` manually. Explain: "In production, Chainlink Functions automates this."

---

### Phase 4: Test & Deploy Frontend (2 hours)

```bash
cd /Users/jacobble/gitAccountable/Frontend/React

# 1. Create .env
cp .env.example .env

# 2. Get WalletConnect Project ID
# Visit: https://cloud.walletconnect.com/
# Add: VITE_WALLETCONNECT_PROJECT_ID=...
# Add: VITE_COMMIT_LOCK_ADDRESS=0x... (from deployment)

# 3. Test locally
npm run dev
# Open http://localhost:5173

# 4. Test complete flow:
#    - Connect wallet
#    - Create commitment
#    - Check dashboard
#    - (Manually record daily check as owner)
#    - Claim funds

# 5. Deploy to Vercel
npm run build
# Upload to Vercel or run: vercel --prod
```

---

## Testing Checklist

### Smart Contract Tests
- [x] All 19 tests passing (`forge test`)
- [ ] Deployed to Sepolia
- [ ] Verified on Etherscan
- [ ] Can call functions via Etherscan

### Frontend Tests
- [ ] Wallet connects (MetaMask/WalletConnect)
- [ ] Network switches to Sepolia
- [ ] Can create commitment (0.01 ETH)
- [ ] Dashboard shows commitment data
- [ ] Can claim after 7 successful days
- [ ] Responsive on mobile

### Oracle Tests
- [ ] Can fetch GitHub commits locally (`node test-local.js`)
- [ ] Manual recordDailyCheck works
- [ ] (Optional) Chainlink Function returns correct result

---

## Emergency Shortcuts (If Running Out of Time)

### Cut These Features First:
1. ❌ GitHub calendar visualization
2. ❌ Advanced error handling (use simple alerts)
3. ❌ Chainlink automation (use manual owner calls)
4. ❌ Multiple page routing (combine into single page)

### Minimum Viable Demo:
1. ✅ Smart contract deployed & verified
2. ✅ Can create commitment (frontend or Etherscan)
3. ✅ Owner can record daily check
4. ✅ Can view commitment status
5. ✅ Can claim or forfeit

---

## Demo Script (2 Minutes)

**Slide 1:** Problem - "Developers struggle with consistent coding habits"

**Slide 2:** Solution - "CommitLock: Stake ETH through Ether.Fi, commit daily, earn or forfeit"

**Slide 3:** Live Demo
1. "Here's our dApp" (show frontend)
2. "I connect my wallet" (ConnectButton)
3. "I stake 0.01 ETH with my GitHub username" (CreateCommitment)
4. "My ETH is staked through Ether.Fi → I receive eETH and earn staking rewards"
5. "Every day, the oracle checks my GitHub" (show Dashboard)
6. "After 7 days with all commits, I claim my eETH with rewards!" (Claim button)
7. "If I miss a day, I forfeit everything to the owner"

**Slide 4:** Tech Stack
- Smart Contracts: Solidity + Foundry
- DeFi: Ether.Fi Liquid Staking (eETH)
- Oracles: Chainlink Functions
- Frontend: React + Wagmi + RainbowKit

**Slide 5:** What's Next
- Multiple commitments
- Ether.Fi weETH integration
- Automated Chainlink oracle
- Leaderboards

---

## File Locations

```
/SmartContract/
  src/CommitLock.sol ................. Main contract ✅
  test/CommitLock.t.sol .............. Tests (19 passing) ✅
  script/Deploy.s.sol ................ Deployment script ✅
  .env.example ....................... Environment template ✅

/Backend/chainlink/
  checkGithubCommit.js ............... Oracle source code ✅
  test-local.js ...................... Local testing ✅
  config.json ........................ Configuration ✅
  README.md .......................... Setup guide ✅

/Frontend/React/
  src/config/
    wagmi.js ......................... Wagmi setup ✅
    contracts.js ..................... Contract ABI & address ✅
  src/App.jsx ........................ Main app with routing ✅
  src/main.jsx ....................... Providers setup ✅
  src/components/
    Navigation.jsx ................... TODO: Create
  src/pages/
    LandingPage.jsx .................. TODO: Create
    Dashboard.jsx .................... TODO: Create
    CreateCommitment.jsx ............. TODO: Create
  src/hooks/
    useCommitment.js ................. TODO: Create
    useCreateCommitment.js ........... TODO: Create
    useClaimFunds.js ................. TODO: Create
  .env.example ....................... Environment template ✅
```

---

## Resources

- **Foundry Docs**: https://book.getfoundry.sh/
- **Wagmi Docs**: https://wagmi.sh/
- **RainbowKit**: https://rainbowkit.com/
- **Ether.Fi**: https://etherfi.gitbook.io/
- **Chainlink Functions**: https://docs.chain.link/chainlink-functions
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **LINK Faucet**: https://faucets.chain.link/sepolia

---

## Support & Debugging

### Common Issues:

**1. "Deployment fails" →** Check you have Sepolia ETH, RPC URL is correct

**2. "Wallet won't connect" →** Need WalletConnect Project ID in `.env`

**3. "Transaction reverts" →** Check you're sending exactly 0.01 ETH

**4. "GitHub API rate limit" →** Use authenticated requests (add GitHub PAT)

**5. "Tests fail" →** Run `forge install` to ensure dependencies are installed

---

**Next Steps:**
1. Deploy smart contract ← START HERE
2. Update contract addresses in frontend
3. Build frontend components (teammate)
4. Test end-to-end flow
5. Deploy frontend to Vercel
6. Prepare demo & presentation

**Estimated Time Remaining:** 10-14 hours with 2 people

Good luck! 🚀
