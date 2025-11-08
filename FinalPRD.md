# Product Requirements Document (PRD)
## GitHub Commit Accountability Platform - 24 HOUR HACKATHON EDITION
### Organized by Pull Request Chunks

---

## PR #1: Project Setup & Infrastructure
**Estimated Time:** 2 hours
**Branch:** `setup/project-infrastructure`

### Tasks:
- [ ] Create GitHub repository structure
- [ ] Initialize Foundry project in `/SmartContract`
  - Run `forge init`
  - Configure `foundry.toml`
- [ ] Initialize Next.js project in `/Frontend`
  - Set up with TypeScript
  - Install TailwindCSS
  - Install Wagmi and wallet connection libraries
- [ ] Set up basic folder structure
  ```
  /SmartContract
    /src
    /test
    /script
  /Frontend
    /src
      /components
      /pages
      /hooks
  /Backend (if needed for oracle)
  ```
- [ ] Create `.gitignore` files
- [ ] Set up environment variables template (`.env.example`)
- [ ] Document setup instructions in README.md

**Success Criteria:**
- ✅ Can run `forge build` successfully
- ✅ Can run `npm run dev` in Frontend
- ✅ All team members can clone and run locally

---

## PR #2: Smart Contract - Core Structure with Ether.Fi Integration
**Estimated Time:** 3 hours
**Branch:** `contract/core-structure`
**Dependencies:** PR #1

### Tasks:
- [ ] Create `CommitLock.sol` in `/SmartContract/src`
- [ ] Implement Ether.Fi interfaces:
  ```solidity
  interface ILiquidityPool {
      function deposit() external payable returns (uint256);
  }

  interface IERC20 {
      function transfer(address to, uint256 amount) external returns (bool);
      function balanceOf(address account) external view returns (uint256);
  }
  ```
- [ ] Define `Commitment` struct with eETH tracking:
  ```solidity
  struct Commitment {
      address user;
      string githubUsername;
      uint256 startTime;
      uint256 eethAmount;      // NEW: Track eETH received
      bool[7] dailyChecks;
      uint8 daysCompleted;
      bool claimed;
      bool forfeited;
  }
  ```
- [ ] Add state variables:
  - `mapping(address => Commitment) public commitments`
  - `address public owner`
  - `uint256 public constant STAKE_AMOUNT = 0.01 ether`
  - `uint256 public constant DURATION = 7 days`
  - Ether.Fi contract addresses (Sepolia):
    - `ILiquidityPool public constant LIQUIDITY_POOL = ILiquidityPool(0x308861A430be4cce5502d0A12724771Fc6DaF216)`
    - `IERC20 public constant EETH = IERC20(0x35fA164735182de5081F8e82E824cBfB9b6118ac)`
- [ ] Add events:
  - `CommitmentCreated(address user, string username, uint256 eethAmount)`
  - `DayChecked(address user, uint8 day, bool success)`
  - `FundsClaimed(address user, uint256 eethAmount)`
  - `FundsForfeited(address user, uint256 eethAmount)`
- [ ] Implement constructor

**Files Changed:**
- `SmartContract/src/CommitLock.sol` (new)

**Success Criteria:**
- ✅ Contract compiles without errors
- ✅ All structs and interfaces defined correctly
- ✅ Ether.Fi integration interfaces are correct

---

## PR #3: Smart Contract - Core Functions
**Estimated Time:** 3 hours
**Branch:** `contract/core-functions`
**Dependencies:** PR #2

### Tasks:
- [ ] Implement `createCommitment(string memory _githubUsername)` function
  - Validate `msg.value == STAKE_AMOUNT`
  - Check no active commitment exists
  - Stake ETH through Ether.Fi: `LIQUIDITY_POOL.deposit{value: msg.value}()`
  - Store commitment with eETH amount received
  - Emit `CommitmentCreated` event

- [ ] Implement `recordDailyCheck(address _user, uint8 _dayIndex, bool _success)` function
  - Add `onlyOwner` modifier
  - Validate day index < 7
  - Update `dailyChecks` array
  - Increment `daysCompleted` if success
  - Set `forfeited = true` if failure
  - Emit `DayChecked` event

- [ ] Implement `claimFunds()` function
  - Validate `daysCompleted == 7`
  - Validate `!claimed && !forfeited`
  - Transfer eETH (with rewards) to user
  - Mark as claimed
  - Emit `FundsClaimed` event

- [ ] Implement `collectForfeit(address _user)` function
  - Add `onlyOwner` modifier
  - Validate commitment is forfeited
  - Transfer eETH to owner
  - Mark as claimed
  - Emit `FundsForfeited` event

- [ ] Implement `getCommitmentWithRewards(address _user)` view function
  - Return commitment details and current eETH value

**Files Changed:**
- `SmartContract/src/CommitLock.sol` (modified)

**Success Criteria:**
- ✅ All functions compile
- ✅ Functions have proper access control
- ✅ Ether.Fi integration works correctly

---

## PR #4: Smart Contract - Tests
**Estimated Time:** 2-3 hours
**Branch:** `contract/tests`
**Dependencies:** PR #3

### Tasks:
- [ ] Create `CommitLock.t.sol` in `/SmartContract/test`
- [ ] Set up test environment with mock Ether.Fi contracts
- [ ] Write test cases:
  1. `testCreateCommitment()` - Happy path
  2. `testCreateCommitmentWrongAmount()` - Should revert
  3. `testCreateCommitmentAlreadyActive()` - Should revert
  4. `testRecordDailyCheckSuccess()` - Record successful day
  5. `testRecordDailyCheckFailure()` - Record failed day, set forfeited
  6. `testClaimFundsSuccess()` - User claims after 7 successful days
  7. `testClaimFundsFailureNotComplete()` - Should revert
  8. `testClaimFundsFailureForfeited()` - Should revert
  9. `testCollectForfeit()` - Owner collects forfeited eETH
  10. `testCollectForfeitNotForfeited()` - Should revert
  11. `testEethIntegration()` - Verify eETH staking and rewards
  12. `testUnauthorizedAccess()` - Non-owner cannot call restricted functions

**Files Changed:**
- `SmartContract/test/CommitLock.t.sol` (new)
- `SmartContract/test/mocks/MockLiquidityPool.sol` (new)
- `SmartContract/test/mocks/MockEETH.sol` (new)

**Success Criteria:**
- ✅ All tests pass: `forge test`
- ✅ Test coverage > 80%
- ✅ eETH integration is tested

---

## PR #5: Smart Contract - Deployment Scripts
**Estimated Time:** 1-2 hours
**Branch:** `contract/deployment`
**Dependencies:** PR #4

### Tasks:
- [ ] Create deployment script `Deploy.s.sol` in `/SmartContract/script`
- [ ] Configure deployment for Sepolia testnet
- [ ] Add verification script for Etherscan
- [ ] Create `.env.example` with required variables:
  - `SEPOLIA_RPC_URL`
  - `PRIVATE_KEY`
  - `ETHERSCAN_API_KEY`
- [ ] Document deployment process in README
- [ ] Deploy to Sepolia testnet
- [ ] Verify contract on Etherscan

**Files Changed:**
- `SmartContract/script/Deploy.s.sol` (new)
- `SmartContract/.env.example` (new)
- `SmartContract/README.md` (modified)

**Success Criteria:**
- ✅ Contract deployed to Sepolia
- ✅ Contract verified on Etherscan
- ✅ Deployment address documented

---

## PR #6: Chainlink Oracle - Source Code
**Estimated Time:** 2-3 hours
**Branch:** `oracle/chainlink-function`
**Dependencies:** PR #1

### Tasks:
- [ ] Create Chainlink Function source code in `/Backend/chainlink`
- [ ] Implement JavaScript function to check GitHub commits:
  ```javascript
  // Args: [username, dayIndex, commitmentStartTimestamp]
  const username = args[0];
  const dayIndex = args[1];
  const commitmentStart = new Date(args[2]);
  const dateToCheck = new Date(commitmentStart.getTime() + (dayIndex * 24 * 60 * 60 * 1000));

  // Fetch GitHub events
  const url = `https://api.github.com/users/${username}/events`;
  const response = await Functions.makeHttpRequest({
    url: url,
    headers: { 'User-Agent': 'Chainlink-Functions' }
  });

  // Filter for PushEvents on the target date
  const events = response.data;
  const commits = events.filter(event => {
    if (event.type !== 'PushEvent') return false;
    const eventDate = new Date(event.created_at);
    return eventDate.toDateString() === dateToCheck.toDateString();
  });

  // Return 1 for success, 0 for failure
  return Functions.encodeUint256(commits.length > 0 ? 1 : 0);
  ```
- [ ] Create test script with mock data
- [ ] Document function parameters and return values

**Files Changed:**
- `Backend/chainlink/checkGithubCommit.js` (new)
- `Backend/chainlink/test.js` (new)
- `Backend/chainlink/README.md` (new)

**Success Criteria:**
- ✅ Function correctly parses GitHub API response
- ✅ Function correctly identifies commits on target date
- ✅ Function returns proper encoded response

---

## PR #7: Chainlink Oracle - Integration
**Estimated Time:** 2-3 hours
**Branch:** `oracle/integration`
**Dependencies:** PR #5, PR #6

### Tasks:
- [ ] Set up Chainlink Functions subscription on Sepolia
- [ ] Deploy Chainlink Function source code
- [ ] Create consumer contract (if needed) or integrate with CommitLock
- [ ] Test oracle calling `recordDailyCheck()` on smart contract
- [ ] Set up automation trigger (Chainlink Automation or manual for demo)
- [ ] Document oracle setup process
- [ ] Create backup plan: Manual owner calls if Chainlink is difficult

**Files Changed:**
- `Backend/chainlink/deploy.js` (new)
- `Backend/chainlink/config.json` (new)
- `SmartContract/src/CommitLock.sol` (potentially modified)

**Success Criteria:**
- ✅ Oracle can successfully call smart contract
- ✅ Oracle correctly reports GitHub commit status
- ✅ End-to-end test passes (create commitment → oracle check → record result)

---

## PR #8: Frontend - Setup & Wallet Connection
**Estimated Time:** 2 hours
**Branch:** `frontend/wallet-setup`
**Dependencies:** PR #1

### Tasks:
- [ ] Configure Wagmi with Sepolia network
- [ ] Set up RainbowKit or ConnectKit for wallet connection
- [ ] Create `WalletProvider` component
- [ ] Create `ConnectWallet` button component
- [ ] Add network switching logic (force Sepolia)
- [ ] Create custom hooks:
  - `useWallet()` - Wrap Wagmi hooks
  - `useContract()` - Access CommitLock contract
- [ ] Style with TailwindCSS

**Files Changed:**
- `Frontend/src/components/WalletProvider.tsx` (new)
- `Frontend/src/components/ConnectWallet.tsx` (new)
- `Frontend/src/hooks/useWallet.ts` (new)
- `Frontend/src/hooks/useContract.ts` (new)
- `Frontend/src/config/wagmi.ts` (new)

**Success Criteria:**
- ✅ Wallet connects successfully
- ✅ Shows connected address
- ✅ Switches to Sepolia if on wrong network

---

## PR #9: Frontend - Landing Page
**Estimated Time:** 1-2 hours
**Branch:** `frontend/landing-page`
**Dependencies:** PR #8

### Tasks:
- [ ] Create landing page component
- [ ] Add hero section with:
  - Title: "CommitLock: Commit or Forfeit"
  - Subtitle: "Put your money where your code is. Stake ETH, earn eETH rewards, commit daily or lose it all."
  - ConnectWallet button (prominent)
- [ ] Add explanation section (3 sentences max):
  1. "Stake 0.01 ETH through Ether.Fi and earn staking rewards"
  2. "Commit to GitHub daily for 7 days"
  3. "Complete all days → claim eETH with rewards. Miss one → forfeit everything."
- [ ] Add "How It Works" section with 4 steps
- [ ] Style with TailwindCSS (modern, clean, dark theme)
- [ ] Add Ether.Fi branding/mention

**Files Changed:**
- `Frontend/src/pages/index.tsx` (new)
- `Frontend/src/components/Hero.tsx` (new)
- `Frontend/src/components/HowItWorks.tsx` (new)

**Success Criteria:**
- ✅ Page loads and looks clean
- ✅ Connect wallet button works
- ✅ Responsive on mobile

---

## PR #10: Frontend - Create Commitment Form
**Estimated Time:** 2-3 hours
**Branch:** `frontend/create-commitment`
**Dependencies:** PR #8, PR #5

### Tasks:
- [ ] Create `CreateCommitment` component
- [ ] Add form with:
  - Input: GitHub username (validation)
  - Display: "Stake 0.01 ETH for 7 days"
  - Display: "Earn eETH staking rewards (~X% APY)" - fetch from Ether.Fi if possible
  - Button: "Lock It In & Start Earning"
- [ ] Implement contract interaction:
  - Call `createCommitment()` function
  - Handle transaction states (pending, success, error)
  - Show transaction hash
  - Wait for confirmation
- [ ] Add error handling and loading states
- [ ] Redirect to dashboard after success
- [ ] Style with TailwindCSS

**Files Changed:**
- `Frontend/src/components/CreateCommitment.tsx` (new)
- `Frontend/src/hooks/useCreateCommitment.ts` (new)
- `Frontend/src/pages/create.tsx` (new)

**Success Criteria:**
- ✅ Form validates GitHub username
- ✅ Successfully creates commitment on-chain
- ✅ Shows loading during transaction
- ✅ Handles errors gracefully

---

## PR #11: Frontend - Dashboard with eETH Rewards Display
**Estimated Time:** 3-4 hours
**Branch:** `frontend/dashboard`
**Dependencies:** PR #8, PR #5

### Tasks:
- [ ] Create `Dashboard` component
- [ ] Fetch commitment data from smart contract:
  - Use `getCommitmentWithRewards()` function
  - Poll for updates or use events
- [ ] Display commitment status:
  - GitHub username
  - Days completed: X/7
  - Progress bar (visual)
  - Today's status: ✅ or ❌
  - Daily check history (7 boxes)
- [ ] **NEW:** Display eETH information:
  - Original stake: 0.01 ETH
  - eETH received: X eETH
  - Current value: ≈Y ETH (with rewards)
  - Rewards earned: Z ETH
  - APY earned
- [ ] Add "Claim eETH" button (if eligible):
  - Show only if `daysCompleted == 7`
  - Call `claimFunds()` function
  - Handle transaction
- [ ] Add "No Active Commitment" state with link to create
- [ ] Style with TailwindCSS (card-based layout)

**Files Changed:**
- `Frontend/src/components/Dashboard.tsx` (new)
- `Frontend/src/components/CommitmentCard.tsx` (new)
- `Frontend/src/components/ProgressBar.tsx` (new)
- `Frontend/src/components/DailyChecks.tsx` (new)
- `Frontend/src/components/EethRewards.tsx` (new)
- `Frontend/src/hooks/useCommitment.ts` (new)
- `Frontend/src/hooks/useClaimFunds.ts` (new)
- `Frontend/src/pages/dashboard.tsx` (new)

**Success Criteria:**
- ✅ Correctly displays commitment data from contract
- ✅ Shows eETH rewards information
- ✅ Progress bar updates correctly
- ✅ Claim button works when eligible
- ✅ Updates after successful claim

---

## PR #12: Frontend - Navigation & Routing
**Estimated Time:** 1 hour
**Branch:** `frontend/navigation`
**Dependencies:** PR #9, PR #10, PR #11

### Tasks:
- [ ] Create navigation component
- [ ] Set up routing:
  - `/` - Landing page
  - `/create` - Create commitment
  - `/dashboard` - View commitment status
- [ ] Add navigation menu with:
  - Logo/Title
  - Links (Dashboard, Create)
  - Connect Wallet button (right side)
  - Connected address display
- [ ] Add route guards (redirect if not connected)
- [ ] Style navigation with TailwindCSS

**Files Changed:**
- `Frontend/src/components/Navigation.tsx` (new)
- `Frontend/src/components/Layout.tsx` (new)
- `Frontend/src/App.tsx` (modified)

**Success Criteria:**
- ✅ Navigation works between all pages
- ✅ Shows connected wallet in nav
- ✅ Responsive navigation on mobile

---

## PR #13: Frontend - Error Handling & Loading States
**Estimated Time:** 1-2 hours
**Branch:** `frontend/error-handling`
**Dependencies:** PR #10, PR #11

### Tasks:
- [ ] Create error boundary component
- [ ] Create loading spinner component
- [ ] Create toast/notification system for transactions
- [ ] Add error states to all contract interactions:
  - Wrong network
  - Insufficient balance
  - Transaction rejected
  - Contract errors
- [ ] Add loading states:
  - Transaction pending
  - Data fetching
  - Page loading
- [ ] Add MetaMask installation prompt if not detected
- [ ] Style notifications with TailwindCSS

**Files Changed:**
- `Frontend/src/components/ErrorBoundary.tsx` (new)
- `Frontend/src/components/LoadingSpinner.tsx` (new)
- `Frontend/src/components/Toast.tsx` (new)
- `Frontend/src/hooks/useToast.ts` (new)
- Multiple component files (modified to add error/loading states)

**Success Criteria:**
- ✅ Errors display user-friendly messages
- ✅ Loading states show during async operations
- ✅ Prompts to install MetaMask if missing

---

## PR #14: Frontend - GitHub Calendar Visualization (NICE TO HAVE)
**Estimated Time:** 2-3 hours
**Branch:** `frontend/github-calendar`
**Dependencies:** PR #11

### Tasks:
- [ ] Integrate GitHub GraphQL API for commit calendar
- [ ] Create calendar component showing commit history
- [ ] Fetch user's actual GitHub commits for the commitment period
- [ ] Visualize commits vs. required commits
- [ ] Show comparison between GitHub data and oracle records
- [ ] Style calendar similar to GitHub contribution graph

**Files Changed:**
- `Frontend/src/components/GitHubCalendar.tsx` (new)
- `Frontend/src/services/githubAPI.ts` (new)
- `Frontend/src/pages/dashboard.tsx` (modified)

**Success Criteria:**
- ✅ Displays GitHub commit calendar
- ✅ Highlights commitment period
- ✅ Shows which days had commits

---

## PR #15: Frontend - Deployment & Polish
**Estimated Time:** 2 hours
**Branch:** `frontend/deployment`
**Dependencies:** PR #13

### Tasks:
- [ ] Configure environment variables for production
- [ ] Add contract addresses to config
- [ ] Optimize build (remove console.logs, etc.)
- [ ] Add SEO meta tags
- [ ] Add favicon
- [ ] Test production build locally
- [ ] Deploy to Vercel
- [ ] Configure custom domain (if available)
- [ ] Test deployed app on Sepolia

**Files Changed:**
- `Frontend/.env.production` (new)
- `Frontend/next.config.js` (modified)
- `Frontend/public/favicon.ico` (new)
- `Frontend/public/og-image.png` (new)

**Success Criteria:**
- ✅ App deployed to Vercel
- ✅ All features work on deployed version
- ✅ No console errors

---

## PR #16: Documentation & Demo Preparation
**Estimated Time:** 2-3 hours
**Branch:** `docs/demo-prep`
**Dependencies:** All previous PRs

### Tasks:
- [ ] Write comprehensive README.md:
  - Project description
  - Architecture overview
  - Setup instructions
  - Deployment instructions
  - API documentation
- [ ] Create DEMO.md with:
  - Demo script (2-minute version)
  - Screenshots/GIFs of key flows
  - Troubleshooting guide
- [ ] Create presentation slides (5 slides):
  1. Problem
  2. Solution (with Ether.Fi integration highlight)
  3. Live Demo
  4. Tech Stack
  5. What's Next
- [ ] Record demo video (backup if live demo fails)
- [ ] Test complete user flow end-to-end
- [ ] Prepare talking points about Ether.Fi integration

**Files Changed:**
- `README.md` (comprehensive update)
- `DEMO.md` (new)
- `docs/ARCHITECTURE.md` (new)
- `docs/PRESENTATION.pdf` (new)

**Success Criteria:**
- ✅ README is clear and complete
- ✅ Demo video recorded
- ✅ Presentation slides ready
- ✅ Can run through full demo in 2 minutes

---

## PR #17: Testing & Bug Fixes (Final Sprint)
**Estimated Time:** 2-4 hours
**Branch:** `fix/final-bugs`
**Dependencies:** All previous PRs

### Tasks:
- [ ] Run end-to-end testing:
  1. Connect wallet ✓
  2. Create commitment ✓
  3. Verify on-chain data ✓
  4. Simulate oracle check ✓
  5. View dashboard updates ✓
  6. Claim or forfeit ✓
- [ ] Test edge cases:
  - Multiple users
  - Wrong network
  - Insufficient balance
  - Failed transactions
- [ ] Fix any bugs discovered
- [ ] Code cleanup and formatting
- [ ] Remove debug code
- [ ] Final security review

**Success Criteria:**
- ✅ Complete user flow works without errors
- ✅ All edge cases handled
- ✅ Code is clean and documented

---

## Hackathon Emergency Shortcuts

### If Running Out of Time:

**Cut Scope (in this order):**
1. ❌ GitHub Calendar visualization (PR #14)
2. ❌ Polish & animations
3. ❌ Multiple page routing - combine into single dashboard page
4. ❌ Advanced error handling - use simple alerts
5. ⚠️ Chainlink automation - use manual owner calls with demo explanation

**Quick Wins if Behind:**
- Copy TailwindCSS components from Flowbite/DaisyUI
- Use create-react-app instead of Next.js
- Skip Vercel deployment, demo on localhost
- Simplify to 3 days instead of 7
- Focus on CREATE flow + one CHECK + CLAIM/FORFEIT

---

## Team Roles & PR Assignments

### Person 1: Smart Contract Lead
- PR #2: Core Structure
- PR #3: Core Functions
- PR #4: Tests
- PR #5: Deployment

### Person 2: Oracle/Backend Lead
- PR #6: Chainlink Function
- PR #7: Oracle Integration
- Support PR #4 (testing)

### Person 3: Frontend Lead
- PR #8: Wallet Setup
- PR #9: Landing Page
- PR #10: Create Commitment
- PR #11: Dashboard
- PR #13: Error Handling

### Person 4: Full-Stack Utility
- PR #1: Project Setup
- PR #12: Navigation
- PR #14: GitHub Calendar (if time)
- PR #15: Deployment
- PR #16: Documentation
- Support all other PRs as needed

---

## Success Metrics

### Must Have (MVP):
- ✅ User can create commitment (0.01 ETH staked through Ether.Fi)
- ✅ Smart contract stores commitment and eETH balance
- ✅ Oracle checks GitHub (manual trigger acceptable)
- ✅ Dashboard shows progress and eETH rewards
- ✅ User can claim eETH with rewards OR owner collects forfeit

### Bonus Points:
- ✅ Deployed to Sepolia testnet
- ✅ Verified contract on Etherscan
- ✅ Clean, responsive UI
- ✅ Actual Chainlink automation (not manual)
- ✅ GitHub calendar integration

### Demo Must Show:
1. Connect wallet → Create commitment
2. Contract stakes ETH → receives eETH
3. Oracle checks GitHub → updates status
4. Dashboard displays eETH rewards earned
5. Claim eETH with rewards OR show forfeit flow

---

## Quick Reference Links

- **Foundry Docs:** https://book.getfoundry.sh/
- **Chainlink Functions:** https://docs.chain.link/chainlink-functions
- **GitHub API:** https://docs.github.com/en/rest/activity/events
- **Ether.Fi Docs:** https://etherfi.gitbook.io/
- **Wagmi Docs:** https://wagmi.sh/
- **TailwindCSS:** https://tailwindcss.com/docs
- **Sepolia Faucet:** https://sepoliafaucet.com/
- **Chainlink Faucet:** https://faucets.chain.link/

---

## Git Workflow

1. Create branch from main: `git checkout -b <pr-branch-name>`
2. Make changes and commit frequently
3. Push to remote: `git push -u origin <pr-branch-name>`
4. Create PR to main branch
5. Get review from at least 1 team member
6. Merge to main after approval
7. Delete branch after merge

---

## Final Checklist

**Hour 8:** ✅ Smart Contract complete (PR #2-5)
**Hour 14:** ✅ Oracle working (PR #6-7)
**Hour 20:** ✅ Frontend complete (PR #8-13)
**Hour 23:** ✅ Demo ready (PR #16)
**Hour 24:** ✅ SHIP IT! 🚀

---

**Team Motto:** "Commit or Forfeit. No Excuses."

**Remember:** Working > Perfect. Demo > Documentation. Ship it!
