# CommitLock 🔒

> **Stake ETH. Commit Daily. Earn Rewards or Lose Everything.**

CommitLock is a blockchain-based accountability platform that combines GitHub commit tracking with Ether.Fi liquid staking. Users stake 0.01 ETH (automatically converted to eETH) and commit to making daily GitHub commits for 7 days. Complete all days to claim your eETH with accrued staking rewards—miss one day and forfeit everything.

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)](https://soliditylang.org/)
[![Foundry](https://img.shields.io/badge/Foundry-tested-green)](https://book.getfoundry.sh/)
[![Tests](https://img.shields.io/badge/tests-19%20passing-brightgreen)](SmartContract/test)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌟 Features

- **Liquid Staking Integration**: Your staked ETH earns Ether.Fi rewards as eETH while you build coding habits
- **All-or-Nothing Accountability**: Complete all 7 days or forfeit your stake—no excuses
- **Decentralized Verification**: Chainlink Functions oracle verifies GitHub commits trustlessly
- **Simple UX**: Connect wallet, stake 0.01 ETH, commit daily—that's it
- **Transparent**: All commitments and results recorded on-chain

## 📋 Table of Contents

- [How It Works](#-how-it-works)
- [Architecture](#-architecture)
- [Repository Structure](#-repository-structure)
- [Quick Start](#-quick-start)
- [Smart Contract](#-smart-contract)
- [Frontend](#-frontend)
- [Oracle](#-oracle)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Demo](#-demo)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 How It Works

### User Flow

1. **Create Commitment**
   - Connect wallet to dApp
   - Enter GitHub username
   - Stake 0.01 ETH
   - ETH is deposited to Ether.Fi LiquidityPool → receive eETH
   - 7-day commitment begins

2. **Daily Commits**
   - Make at least one GitHub commit per day for 7 consecutive days
   - Oracle checks GitHub API daily and records results on-chain
   - Dashboard shows real-time progress

3. **Claim or Forfeit**
   - **Success** (7/7 days): Claim your eETH + staking rewards earned during the commitment
   - **Failure** (any day missed): Your eETH is forfeited to the contract owner

### Value Proposition

**Traditional habit tracking**: No consequences → low commitment

**CommitLock**: Real financial stakes → maximum accountability + passive income

While you build coding habits, your ETH earns Ether.Fi staking rewards. Win-win if you follow through!

## 🏗️ Architecture

```
┌─────────────────┐
│   User Wallet   │
│  (MetaMask)     │
└────────┬────────┘
         │ 0.01 ETH
         ▼
┌─────────────────────────┐
│  CommitLock Contract    │ ◄──── Owner/Oracle
│  (Sepolia Testnet)      │       Records daily checks
│                         │
│  • Deposits ETH to      │
│    Ether.Fi Pool        │
│  • Receives eETH        │
│  • Tracks 7-day commits │
│  • Distributes rewards  │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Ether.Fi Protocol      │
│  (Liquid Staking)       │
│                         │
│  • LiquidityPool        │
│  • eETH Token           │
└─────────────────────────┘

         ▲
         │ Daily check
         │
┌─────────────────────────┐
│  Chainlink Functions    │
│  (Oracle)               │
│                         │
│  Queries GitHub API     │
│  Returns 1 or 0         │
└─────────────────────────┘
         ▲
         │
    GitHub API
```

### Key Components

1. **Smart Contract** (`CommitLock.sol`)
   - Manages commitments and eETH staking
   - Enforces all-or-nothing rules
   - Integrates with Ether.Fi protocol
   - Access control for oracle

2. **Oracle** (Chainlink Functions)
   - Queries GitHub public events API
   - Verifies commits for specific dates
   - Returns binary result (1 = success, 0 = failure)
   - Triggers `recordDailyCheck()` on contract

3. **Frontend** (React + Wagmi)
   - Wallet connection (RainbowKit)
   - Create commitment form
   - Real-time dashboard with eETH rewards display
   - Claim interface

## 📁 Repository Structure

```
gitAccountable/
├── SmartContract/              # Foundry project
│   ├── src/
│   │   └── CommitLock.sol      # Main contract (262 lines)
│   ├── test/
│   │   └── CommitLock.t.sol    # Test suite (19 tests, all passing)
│   ├── script/
│   │   └── Deploy.s.sol        # Deployment scripts
│   ├── foundry.toml            # Foundry configuration
│   ├── .env.example            # Environment template
│   └── README.md               # Contract documentation
│
├── Frontend/React/             # Vite + React frontend
│   ├── src/
│   │   ├── config/
│   │   │   ├── wagmi.js        # Web3 configuration
│   │   │   └── contracts.js    # Contract ABI & addresses
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── CreateCommitment.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── hooks/              # Custom React hooks for contract interactions
│   │   └── components/
│   ├── package.json
│   └── .env.example
│
├── Backend/chainlink/          # Oracle implementation
│   ├── checkGithubCommit.js    # Chainlink Functions source code
│   ├── test-local.js           # Local oracle testing
│   ├── config.json             # Oracle configuration
│   └── README.md
│
├── CLAUDE.md                   # AI assistant project guide
├── DEPLOYMENT_GUIDE.md         # Step-by-step deployment
├── FinalPRD.md                 # Product requirements
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ and npm
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for smart contracts)
- [Git](https://git-scm.com/)
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH ([faucet](https://sepoliafaucet.com/))

### Clone Repository

```bash
git clone https://github.com/yourusername/gitAccountable.git
cd gitAccountable
```

### Smart Contract Setup

```bash
cd SmartContract

# Install dependencies
forge install

# Run tests (should see 19 passing)
forge test

# Build contracts
forge build
```

### Frontend Setup

```bash
cd Frontend/React

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add:
# VITE_WALLETCONNECT_PROJECT_ID=your_project_id
# VITE_COMMIT_LOCK_ADDRESS=deployed_contract_address

# Start development server
npm run dev
# Open http://localhost:5173
```

### Oracle Setup (Local Testing)

```bash
cd Backend/chainlink

# Test oracle locally (no Chainlink deployment needed)
node test-local.js octocat 0 $(date +%s000)

# Should output: Result: 1 (GitHub's test account has commits)
```

## 📜 Smart Contract

### Key Details

- **Contract**: `CommitLock.sol`
- **Network**: Sepolia Testnet
- **Solidity Version**: 0.8.20
- **Test Coverage**: 19 comprehensive tests
- **Gas Optimized**: Custom errors, immutable owner

### Core Functions

```solidity
// Create new commitment (stake 0.01 ETH)
function createCommitment(string memory _githubUsername) external payable

// Record daily check result (owner/oracle only)
function recordDailyCheck(address _user, uint8 _dayIndex, bool _success) external

// Claim eETH rewards after completing 7 days
function claimFunds() external

// Owner collects forfeited eETH
function collectForfeit(address _user) external

// View commitment details with rewards
function getCommitmentWithRewards(address _user) external view
    returns (Commitment memory, uint256 currentEethValue, uint256 contractEethBalance)
```

### Ether.Fi Integration

**Sepolia Testnet Addresses:**
- LiquidityPool: `0x308861A430be4cce5502d0A12724771Fc6DaF216`
- eETH Token: `0x35fa164735182dE5081f8E82e824cBfb9B6118aC`

**Staking Flow:**
1. User calls `createCommitment{value: 0.01 ether}()`
2. Contract deposits ETH: `LIQUIDITY_POOL.deposit{value: 0.01 ether}()`
3. Contract receives eETH tokens (1:1 ratio initially)
4. eETH accrues staking rewards over 7 days
5. User claims eETH (now worth more than original 0.01 ETH!)

### Testing

```bash
cd SmartContract

# Run all tests
forge test

# Run with verbose output
forge test -vv

# Run specific test
forge test --match-test testCreateCommitmentStakesETHForEETH -vvv

# Gas report
forge test --gas-report

# Coverage
forge coverage
```

**Test Suite Highlights:**
- ✅ Create commitment with Ether.Fi staking
- ✅ Record daily checks (success/failure)
- ✅ Claim funds after 7 successful days
- ✅ Forfeit funds on first failure
- ✅ Access control (only owner can record checks)
- ✅ Multiple users concurrently
- ✅ Edge cases (wrong amounts, invalid days, double claims)

See [SmartContract/README.md](SmartContract/README.md) for full API documentation.

## 💻 Frontend

### Tech Stack

- **Framework**: React 19 + Vite
- **Web3**: Wagmi v2 + Viem
- **Wallet**: RainbowKit
- **Styling**: Tailwind CSS v4
- **State**: TanStack Query (via Wagmi)

### Key Pages

1. **Landing Page**
   - Hero section with value proposition
   - "How It Works" explainer
   - Connect wallet CTA

2. **Create Commitment**
   - GitHub username input
   - Stake amount display (0.01 ETH)
   - eETH APY estimate
   - Transaction handling

3. **Dashboard**
   - Commitment progress (X/7 days)
   - Daily check status (visual calendar)
   - eETH rewards tracker
   - Claim button (when eligible)

### Custom Hooks

```javascript
// Read commitment data
const { commitment, isLoading } = useCommitment(userAddress);

// Create new commitment
const { writeContract, isPending } = useCreateCommitment();

// Claim rewards
const { claimFunds } = useClaimFunds();
```

### Development

```bash
cd Frontend/React

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Lint
npm run lint
```

## 🔮 Oracle

### Chainlink Functions

The oracle verifies GitHub commits by querying the GitHub public events API.

**Inputs:**
- `args[0]`: GitHub username (string)
- `args[1]`: Day index 0-6 (string)
- `args[2]`: Commitment start timestamp in ms (string)

**Output:**
- `1` (uint256) if user made commit(s) on target day
- `0` (uint256) if no commits found

**How It Works:**
1. Calculate target date: `startTime + (dayIndex * 24 hours)`
2. Fetch `GET https://api.github.com/users/{username}/events`
3. Filter for `PushEvent` type on target date
4. Return 1 if any commits found, 0 otherwise

### Local Testing

```bash
cd Backend/chainlink

# Test with default values (octocat user)
node test-local.js

# Test specific user and day
node test-local.js yourGithubUsername 0 1699459200000

# Test all 7 days
for day in {0..6}; do
  node test-local.js yourGithubUsername $day 1699459200000
done
```

### Manual Oracle Mode (For Demos)

Skip Chainlink deployment and call contract directly:

```bash
# Check GitHub manually, then record result on-chain
cast send $CONTRACT_ADDRESS \
  "recordDailyCheck(address,uint8,bool)" \
  $USER_ADDRESS 0 true \
  --account metaMaskKey \
  --rpc-url $SEPOLIA_RPC_URL
```

For production deployment with automated Chainlink Functions, see [Backend/chainlink/README.md](Backend/chainlink/README.md).

## 🚢 Deployment

### Smart Contract Deployment

**Using Cast Wallet (Recommended - Secure):**

```bash
cd SmartContract

# 1. Import your private key (one-time setup)
cast wallet import metaMaskKey --interactive

# 2. Set environment variables
export SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
export ETHERSCAN_API_KEY=your_etherscan_api_key

# 3. Deploy and verify
forge script script/Deploy.s.sol:DeployCommitLock \
  --rpc-url $SEPOLIA_RPC_URL \
  --account metaMaskKey \
  --sender $(cast wallet address --account metaMaskKey) \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  -vvvv

# 4. Save the deployed contract address!
```

**Current Deployment:**
- **Contract Address**: `0xcA41198e15534df8d13Af50a2161CE810f8C77dA` (Sepolia)
- **Network**: Sepolia Testnet
- **Verified**: [View on Etherscan](https://sepolia.etherscan.io/address/0xcA41198e15534df8d13Af50a2161CE810f8C77dA)

### Frontend Deployment

**Update Contract Address:**
```bash
cd Frontend/React

# Edit .env
VITE_COMMIT_LOCK_ADDRESS=0xcA41198e15534df8d13Af50a2161CE810f8C77dA
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

**Deploy to Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod
```

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## 🧪 Testing

### Smart Contract Tests

```bash
cd SmartContract
forge test

# Expected output:
# Running 19 tests for test/CommitLock.t.sol:CommitLockTest
# [PASS] testCanClaim() (gas: 123456)
# [PASS] testClaimFunds() (gas: 234567)
# ...
# Test result: ok. 19 passed; 0 failed; 0 skipped;
```

### Frontend Manual Testing Checklist

- [ ] Wallet connects (MetaMask/WalletConnect)
- [ ] Network switches to Sepolia automatically
- [ ] Can create commitment with 0.01 ETH
- [ ] Transaction appears on Etherscan
- [ ] Dashboard loads commitment data
- [ ] Progress bar updates after oracle checks
- [ ] Can claim funds after 7 successful days
- [ ] Responsive on mobile devices

### Oracle Testing

```bash
cd Backend/chainlink

# Test oracle logic locally
node test-local.js yourGithubUsername 0 $(date +%s000)

# Should output:
# � Checking GitHub user: yourGithubUsername
# � Fetched X recent events
# � Found Y commits on target date
# Result: 1 or 0
```

### End-to-End Testing

1. Create commitment on frontend
2. Verify on Etherscan (ETH → eETH conversion)
3. Make GitHub commit
4. Run oracle check (manual or automated)
5. Verify dashboard updates
6. Complete 7 days
7. Claim rewards on frontend
8. Verify eETH received in wallet

## 🎬 Demo

### 2-Minute Demo Script

**Slide 1: Problem**
> "Developers struggle with consistent coding habits. New Year's resolutions fail. We need accountability with real consequences."

**Slide 2: Solution**
> "CommitLock: Stake 0.01 ETH through Ether.Fi liquid staking. Commit to GitHub daily for 7 days. Complete all days → claim eETH with staking rewards. Miss one day → forfeit everything."

**Slide 3: Live Demo**

1. **Show frontend landing page**
   - "This is CommitLock. Simple, clean interface."

2. **Connect wallet**
   - Click "Connect Wallet" → MetaMask pops up
   - "I'm connecting to Sepolia testnet."

3. **Create commitment**
   - Enter GitHub username
   - Click "Lock It In & Start Earning"
   - "I'm staking 0.01 ETH. It's deposited to Ether.Fi → I receive eETH."

4. **Show transaction on Etherscan**
   - Open Sepolia Etherscan
   - "You can see the ETH was sent to Ether.Fi's LiquidityPool contract."

5. **Dashboard view**
   - "Here's my commitment dashboard. 0/7 days completed."
   - "Shows my eETH balance and projected rewards."

6. **Simulate oracle check**
   - Show GitHub profile with commits
   - Run: `cast send ... recordDailyCheck ...`
   - "In production, Chainlink automates this daily check."
   - Refresh dashboard → "1/7 days completed!"

7. **Explain outcomes**
   - "After 7 days with all commits, I claim my eETH plus staking rewards."
   - "If I miss even one day, I lose everything to the contract owner."

**Slide 4: Tech Stack**
- Smart Contracts: Solidity + Foundry
- DeFi: Ether.Fi Liquid Staking (eETH)
- Oracles: Chainlink Functions
- Frontend: React + Wagmi + RainbowKit
- Deployed on Sepolia Testnet

**Slide 5: What's Next**
- Multiple concurrent commitments
- Variable durations (7, 14, 30 days)
- Team challenges and leaderboards
- Ether.Fi weETH integration for higher yields
- Mainnet deployment

### Demo Tips

- **Prepare ahead**: Have wallet funded, commitment created, GitHub commits ready
- **Use octocat**: GitHub's test account if worried about your own commit history
- **Record backup video**: In case live demo has network issues
- **Emphasize eETH**: Show how stake earns passive income while building habits
- **Mention security**: 19 tests, custom errors, immutable owner

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Smart contracts: Update tests, run `forge test`
   - Frontend: Follow existing patterns, test locally
   - Oracle: Test with `test-local.js` first
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- **Smart Contracts**: Use custom errors, write tests, follow CEI pattern
- **Frontend**: Use Wagmi hooks, Tailwind for styling, keep components simple
- **Oracle**: Validate inputs, handle errors gracefully, test with real GitHub accounts
- **Documentation**: Update README and relevant docs when adding features

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on code quality and user experience
- Security first—report vulnerabilities privately

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ether.Fi**: For providing liquid staking infrastructure
- **Chainlink**: For decentralized oracle solutions
- **Foundry**: For making Solidity development enjoyable
- **Wagmi & RainbowKit**: For simplifying Web3 frontend development
- **GitHub**: For providing the public events API

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/gitAccountable/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/gitAccountable/discussions)
- **Twitter**: [@YourHandle](https://twitter.com/yourhandle)

## 🔗 Links

- **Live Demo**: [https://commitlock.vercel.app](https://commitlock.vercel.app) *(deploy first)*
- **Contract (Sepolia)**: [0xcA41198e15534df8d13Af50a2161CE810f8C77dA](https://sepolia.etherscan.io/address/0xcA41198e15534df8d13Af50a2161CE810f8C77dA)
- **Documentation**: See individual README files in subdirectories
- **Ether.Fi Docs**: [https://etherfi.gitbook.io/](https://etherfi.gitbook.io/)
- **Chainlink Functions**: [https://docs.chain.link/chainlink-functions](https://docs.chain.link/chainlink-functions)

---

**Built with ❤️ by developers, for developers. Commit or forfeit—no excuses.**

*Ready to lock in your coding habit? Get started today!*
