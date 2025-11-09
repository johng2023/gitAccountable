# Frontend Testing Checklist for CommitLock

## Pre-Testing Setup

### ✅ Configuration Complete
- [x] Contract deployed to Sepolia: `0x1953f602eFd1CBd16846A440421F4824024ae60c`
- [x] Frontend `.env` created with contract address
- [ ] WalletConnect Project ID added to `.env`
- [ ] Dependencies installed (`npm install`)
- [ ] Sepolia ETH in test wallet (minimum 0.02 ETH for testing)

### Get Test Assets

**Sepolia ETH:**
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucet.quicknode.com/ethereum/sepolia

**Minimum needed:** 0.02 ETH (0.01 for commitment + gas fees)

## Testing Workflow

### Phase 1: Basic Setup (5-10 minutes)

#### 1.1 Start Development Server

```bash
cd Frontend/React
npm run dev
```

**Expected Output:**
```
VITE v7.1.7  ready in XXX ms
➜  Local:   http://localhost:5173/
```

**✅ Pass Criteria:**
- Server starts without errors
- No console warnings about missing environment variables
- Port 5173 accessible

---

#### 1.2 Wallet Connection

**Steps:**
1. Open http://localhost:5173/ in browser
2. Open browser DevTools (F12) → Console tab
3. Click "Connect Wallet" button
4. Select MetaMask (or your preferred wallet)
5. Approve connection
6. Switch to Sepolia network if prompted

**✅ Pass Criteria:**
- RainbowKit modal appears with wallet options
- Wallet connects successfully
- Address displayed in UI
- Network shows "Sepolia"
- No console errors

**Common Issues:**
- **"Invalid Project ID"** → Check `VITE_WALLETCONNECT_PROJECT_ID` in `.env`
- **Modal doesn't appear** → Restart dev server after `.env` changes
- **Wrong network** → Manually switch to Sepolia in MetaMask

---

#### 1.3 Contract Connection Verification

**Steps:**
1. With wallet connected, check browser console
2. Look for any contract-related errors
3. Navigate to Dashboard page

**✅ Pass Criteria:**
- No "contract not found" errors
- No ABI parsing errors
- Dashboard page loads (even if showing "No active commitment")

---

### Phase 2: Read Operations (5 minutes)

#### 2.1 View Owner Address

**Method 1: Through Frontend**
If your UI displays owner address, verify it shows:
```
0x3F0315C53Bd1ce017f870632C6C6Da35a9ec0924
```

**Method 2: Through Cast CLI**
```bash
cast call 0x1953f602eFd1CBd16846A440421F4824024ae60c "owner()" \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/yBQWnhxBhev9DOf-KfAnp
```

**Expected:** `0x0000000000000000000000003f0315c53bd1ce017f870632c6c6da35a9ec0924`

---

#### 2.2 Check Stake Amount

**Frontend should display:** "0.01 ETH" stake requirement

**Verify with cast:**
```bash
cast call 0x1953f602eFd1CBd16846A440421F4824024ae60c "STAKE_AMOUNT()" \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/yBQWnhxBhev9DOf-KfAnp
```

**Expected:** `0x000000000000000000000000000000000000000000000000002386f26fc10000`
(which is 0.01 ETH in wei: 10000000000000000)

---

#### 2.3 Check Your Commitment Status

**Steps:**
1. Navigate to Dashboard
2. Should show "No active commitment" (assuming fresh wallet)

**✅ Pass Criteria:**
- UI correctly displays "no commitment" state
- No errors in console
- "Create Commitment" button visible

---

### Phase 3: Write Operations - Create Commitment (10-15 minutes)

#### 3.1 Create Commitment Flow

**Steps:**
1. Click "Create Commitment" button (or navigate to `/create`)
2. Enter your GitHub username
3. Confirm wallet has at least 0.01 ETH
4. Click "Create Commitment" or "Stake Now"
5. MetaMask popup appears:
   - **Amount:** 0.01 ETH
   - **To:** `0x1953...e60c` (contract address)
   - **Gas Fee:** ~$0.50-$2.00 (varies)
6. Click "Confirm" in MetaMask
7. Wait for transaction confirmation

**✅ Pass Criteria:**
- Transaction submitted successfully
- Loading indicator appears
- Success message displayed after confirmation (15-30 seconds)
- No revert errors

**Transaction Details to Verify:**
- Open Etherscan: https://sepolia.etherscan.io/tx/YOUR_TX_HASH
- Should show:
  - **Status:** ✅ Success
  - **Value:** 0.01 ETH
  - **Function:** `createCommitment(string _githubUsername)`
  - **Events:** `CommitmentCreated` event emitted

---

#### 3.2 Verify Commitment Created

**Frontend Verification:**
1. Navigate to Dashboard
2. Should now show:
   - GitHub username
   - Start date/time
   - Days completed: 0/7
   - Daily check grid (all unchecked)
   - eETH amount received (~0.01 eETH)

**Cast CLI Verification:**
```bash
cast call 0x1953f602eFd1CBd16846A440421F4824024ae60c \
  "getCommitment(address)" YOUR_WALLET_ADDRESS \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/yBQWnhxBhev9DOf-KfAnp
```

**Should return tuple with:**
- Your address
- GitHub username
- Start time (timestamp)
- eETH amount (~10000000000000000 wei)
- 7 false bools (dailyChecks)
- 0 (daysCompleted)
- false (claimed)
- false (forfeited)

---

#### 3.3 Test Double Commitment Prevention

**Steps:**
1. Try creating another commitment with same wallet
2. Click "Create Commitment" again

**✅ Pass Criteria:**
- Transaction should REVERT
- Error message: "CommitmentAlreadyActive" or similar
- MetaMask shows simulation failed
- No ETH lost (transaction not submitted)

---

### Phase 4: Oracle Integration Testing (Owner Only)

**⚠️ Note:** Only the contract owner can record daily checks.

#### 4.1 Record Successful Day (Owner Wallet)

**Steps:**
1. Switch to owner wallet: `0x3F0315C53Bd1ce017f870632C6C6Da35a9ec0924`
2. Use cast to record day 0 success:

```bash
cast send 0x1953f602eFd1CBd16846A440421F4824024ae60c \
  "recordDailyCheck(address,uint8,bool)" \
  YOUR_TEST_WALLET_ADDRESS 0 true \
  --account metaMaskKey \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/yBQWnhxBhev9DOf-KfAnp
```

3. Refresh Dashboard in test wallet
4. Should show day 0 checked ✅

**✅ Pass Criteria:**
- Transaction succeeds
- `DayChecked` event emitted
- Dashboard updates to show day 0 complete
- Days completed: 1/7

---

#### 4.2 Record Failed Day (Owner Wallet)

**Steps:**
1. Record day 1 as failure:

```bash
cast send 0x1953f602eFd1CBd16846A440421F4824024ae60c \
  "recordDailyCheck(address,uint8,bool)" \
  YOUR_TEST_WALLET_ADDRESS 1 false \
  --account metaMaskKey \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/yBQWnhxBhev9DOf-KfAnp
```

2. Refresh Dashboard

**✅ Pass Criteria:**
- Transaction succeeds
- Dashboard shows commitment as "Forfeited"
- Day 1 marked as failed ❌
- Cannot claim funds anymore
- UI shows "Commitment Failed" message

---

#### 4.3 Test Unauthorized Oracle Call (Non-Owner)

**Steps:**
1. Switch to test wallet (not owner)
2. Try to record a daily check:

```bash
cast send 0x1953f602eFd1CBd16846A440421F4824024ae60c \
  "recordDailyCheck(address,uint8,bool)" \
  YOUR_TEST_WALLET_ADDRESS 2 true \
  --account yourTestWallet \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/yBQWnhxBhev9DOf-KfAnp
```

**✅ Pass Criteria:**
- Transaction REVERTS
- Error: "Unauthorized"
- No state change

---

### Phase 5: Claim Flow Testing (Requires 7 Successful Days)

**⚠️ Prerequisites:**
- Create a fresh commitment (not forfeited)
- Owner records 7 successful days (day 0-6, all `true`)

#### 5.1 Claim Funds Successfully

**Steps:**
1. After 7 successful days recorded, navigate to Dashboard
2. "Claim Rewards" button should be enabled
3. Click "Claim Rewards"
4. Confirm MetaMask transaction
5. Wait for confirmation

**✅ Pass Criteria:**
- Transaction succeeds
- `FundsClaimed` event emitted
- eETH transferred to your wallet
- Dashboard shows "Claimed" status
- eETH balance increased (check with MetaMask or Etherscan)

**Verify eETH Received:**
- Check eETH balance on Etherscan:
  https://sepolia.etherscan.io/token/0x35fa164735182de5081f8e82e824cbfb9b6118ac?a=YOUR_WALLET
- Should show ~0.01 eETH (plus any staking rewards accrued)

---

#### 5.2 Test Double Claim Prevention

**Steps:**
1. After successfully claiming, try to claim again
2. Click "Claim Rewards" button

**✅ Pass Criteria:**
- Button should be disabled, OR
- Transaction reverts with "AlreadyClaimed" error
- No funds lost

---

### Phase 6: Forfeit Collection Testing (Owner Only)

**Prerequisites:**
- Create commitment with test wallet
- Record at least one failed day

#### 6.1 Owner Collects Forfeited eETH

**Steps:**
1. Switch to owner wallet
2. Call collectForfeit:

```bash
cast send 0x1953f602eFd1CBd16846A440421F4824024ae60c \
  "collectForfeit(address)" \
  FORFEITED_WALLET_ADDRESS \
  --account metaMaskKey \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/yBQWnhxBhev9DOf-KfAnp
```

**✅ Pass Criteria:**
- Transaction succeeds
- `FundsForfeited` event emitted
- eETH transferred to owner wallet
- User's commitment marked as claimed

---

### Phase 7: Edge Cases & Error Handling

#### 7.1 Wrong Stake Amount

**Test in UI:**
1. Modify transaction value to 0.005 ETH (if possible)
2. Should fail with "InvalidStakeAmount"

**Test with cast:**
```bash
cast send 0x1953f602eFd1CBd16846A440421F4824024ae60c \
  "createCommitment(string)" "testuser" \
  --value 0.005ether \
  --account yourWallet \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/yBQWnhxBhev9DOf-KfAnp
```

**Expected:** Revert with "InvalidStakeAmount"

---

#### 7.2 Invalid Day Index

**Test:**
```bash
cast send 0x1953f602eFd1CBd16846A440421F4824024ae60c \
  "recordDailyCheck(address,uint8,bool)" \
  YOUR_WALLET 8 true \
  --account metaMaskKey \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/yBQWnhxBhev9DOf-KfAnp
```

**Expected:** Revert with "InvalidDayIndex" (index must be 0-6)

---

#### 7.3 Claim Before Completion

**Test:**
1. Create commitment
2. Record only 3 successful days
3. Try to claim funds

**Expected:** Revert with "CommitmentNotComplete"

---

### Phase 8: UI/UX Testing

#### 8.1 Responsive Design

**Test on:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**Check:**
- Layout doesn't break
- Buttons are clickable
- Text is readable
- Wallet connection works

---

#### 8.2 Loading States

**Verify:**
- [ ] Loading spinner appears during transaction
- [ ] Button disabled while pending
- [ ] Success message after confirmation
- [ ] Error message if transaction fails

---

#### 8.3 Error Messages

**Check user-friendly errors for:**
- [ ] No wallet connected
- [ ] Wrong network
- [ ] Insufficient balance
- [ ] Transaction rejected
- [ ] Contract errors (AlreadyActive, etc.)

---

## Test Summary Checklist

### Core Functionality
- [ ] Wallet connection works
- [ ] Contract data loads correctly
- [ ] Create commitment succeeds
- [ ] Oracle checks update UI
- [ ] Claim funds works after 7 days
- [ ] Forfeit collection works

### Error Handling
- [ ] Double commitment prevented
- [ ] Wrong amount rejected
- [ ] Unauthorized calls blocked
- [ ] Claim before completion prevented
- [ ] Double claim prevented

### UI/UX
- [ ] Responsive on all devices
- [ ] Loading states clear
- [ ] Error messages helpful
- [ ] Success confirmations visible

### Security
- [ ] Only owner can record checks
- [ ] Only owner can collect forfeits
- [ ] Users can only claim their own funds
- [ ] No unauthorized state changes

---

## Quick Test Script (Fresh Wallet)

**Full flow test in 10 minutes:**

```bash
# 1. Start frontend
cd Frontend/React && npm run dev

# 2. Connect wallet to http://localhost:5173

# 3. Create commitment via UI (0.01 ETH)

# 4. Verify on-chain (replace YOUR_WALLET)
cast call 0x1953f602eFd1CBd16846A440421F4824024ae60c \
  "isCommitmentActive(address)" YOUR_WALLET \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/yBQWnhxBhev9DOf-KfAnp

# Expected: true

# 5. Record day 0 success (owner only)
cast send 0x1953f602eFd1CBd16846A440421F4824024ae60c \
  "recordDailyCheck(address,uint8,bool)" YOUR_WALLET 0 true \
  --account metaMaskKey \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/yBQWnhxBhev9DOf-KfAnp

# 6. Refresh Dashboard → Should show 1/7 days complete
```

---

## Troubleshooting

### "Transaction Reverted"
1. Check you're on Sepolia network
2. Verify contract address in `.env`
3. Check browser console for specific error
4. View transaction on Etherscan for revert reason

### "Contract Not Found"
1. Restart dev server
2. Clear browser cache
3. Verify `VITE_COMMIT_LOCK_ADDRESS` in `.env`
4. Check contract exists: https://sepolia.etherscan.io/address/0x1953f602efd1cbd16846a440421f4824024ae60c

### Dashboard Not Updating
1. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Check wallet is still connected
3. Wait 30 seconds for block confirmation
4. Check Wagmi cache settings

### MetaMask Issues
1. Reset account in MetaMask (Settings → Advanced → Reset Account)
2. Clear activity tab data
3. Update MetaMask to latest version
4. Try different browser

---

**Testing Complete! 🎉**

If all checkboxes pass, your frontend is ready for production deployment!
