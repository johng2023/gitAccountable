# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CommitLock is a blockchain-based accountability platform that combines GitHub commit tracking with Ether.Fi liquid staking. Users stake 0.01 ETH (which is automatically converted to eETH through Ether.Fi) and commit to making daily GitHub commits for 7 days. Successful completion allows users to claim their eETH with accrued staking rewards; failure results in forfeiture to the contract owner.

**Key Integration**: This project integrates with Ether.Fi's liquid staking protocol on Sepolia testnet, where staked ETH is deposited into their LiquidityPool contract and receives eETH tokens in return.

## Repository Structure

- **SmartContract/** - Foundry-based Solidity contracts
  - `src/CommitLock.sol` - Main contract (262 lines, 19 passing tests)
  - `test/CommitLock.t.sol` - Comprehensive test suite with mock Ether.Fi contracts
  - `script/Deploy.s.sol` - Deployment scripts for Sepolia and local testing

- **Frontend/React/** - Vite + React frontend with Web3 integration
  - `src/config/wagmi.js` - Wagmi v2 configuration for Sepolia
  - `src/config/contracts.js` - Contract ABI and addresses
  - `src/pages/` - Main application pages (Landing, Dashboard, CreateCommitment)
  - `src/hooks/` - Custom React hooks for contract interactions

- **Backend/chainlink/** - Chainlink Functions oracle for GitHub verification
  - `checkGithubCommit.js` - Oracle source code that queries GitHub API
  - `test-local.js` - Local testing without Chainlink deployment

## Development Commands

### Smart Contract (Foundry)

```bash
cd SmartContract

# Build contracts
forge build

# Run all tests (19 tests should pass)
forge test

# Run tests with verbose output
forge test -vv

# Run specific test
forge test --match-test testCreateCommitmentStakesETHForEETH -vvv

# Gas report
forge test --gas-report

# Deploy to Sepolia (using Cast wallet - recommended)
export SEPOLIA_RPC_URL=<your-rpc-url>
export ETHERSCAN_API_KEY=<your-api-key>
DEPLOYER_ADDRESS=$(cast wallet address --account metaMaskKey)

forge script script/Deploy.s.sol:DeployCommitLock \
  --rpc-url $SEPOLIA_RPC_URL \
  --account metaMaskKey \
  --sender $DEPLOYER_ADDRESS \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  -vvvv

# Deploy locally (Anvil)
anvil  # in one terminal
forge script script/Deploy.s.sol:DeployCommitLockLocal \
  --fork-url http://localhost:8545 \
  --broadcast
```

**Important**: The project uses Cast wallet for secure key management. The private key "metaMaskKey" is already imported. Never use raw private keys in .env files.

### Frontend (React + Vite)

```bash
cd Frontend/React

# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Lint
npm run lint
```

**Required Environment Variables** (Frontend/.env):
- `VITE_WALLETCONNECT_PROJECT_ID` - Get from https://cloud.walletconnect.com/
- `VITE_COMMIT_LOCK_ADDRESS` - Contract address after deployment

### Oracle Testing

```bash
cd Backend/chainlink

# Test oracle locally (no Chainlink deployment needed)
node test-local.js
```

## Architecture & Key Concepts

### Smart Contract Architecture

The CommitLock contract follows a straightforward state machine pattern:

1. **Creation Phase**: User calls `createCommitment(githubUsername)` with 0.01 ETH
   - Contract deposits ETH to Ether.Fi's LiquidityPool via `LIQUIDITY_POOL.deposit()`
   - Receives eETH tokens in return (tracked in `commitment.eethAmount`)
   - Creates Commitment struct with 7-day bool array for daily tracking

2. **Tracking Phase**: Owner/oracle calls `recordDailyCheck(user, dayIndex, success)`
   - Updates `dailyChecks[dayIndex]` array
   - Increments `daysCompleted` on success
   - Sets `forfeited = true` on first failure (no recovery)

3. **Resolution Phase**: Either:
   - User calls `claimFunds()` if all 7 days completed (transfers eETH back)
   - Owner calls `collectForfeit(user)` if commitment forfeited (transfers eETH to owner)

**Critical Details**:
- Ether.Fi Sepolia addresses are hardcoded in contract:
  - LiquidityPool: `0x308861A430be4cce5502d0A12724771Fc6DaF216`
  - eETH: `0x35fa164735182dE5081f8E82e824cBfb9B6118aC`
- One commitment per user (enforced by `CommitmentAlreadyActive` error)
- Owner is immutable (set in constructor)
- Uses custom errors for gas efficiency

### Frontend Web3 Integration

**Web3 Stack**: Wagmi v2 + RainbowKit + Viem
- Configuration lives in `src/config/wagmi.js` - Sepolia only
- Contract ABI imported in `src/config/contracts.js`
- RainbowKit providers wrap entire app in `src/main.jsx`

**Custom Hooks Pattern**:
- `useCommitment.js` - Reads commitment data using `useReadContract`
- `useCreateCommitment.js` - Writes commitment using `useWriteContract` + `useWaitForTransactionReceipt`
- `useClaimFunds.js` - Claims rewards with transaction handling

**Important**: All contract interactions use Wagmi's hooks, not direct viem calls. This ensures proper caching, error handling, and transaction state management.

### Oracle System

The Chainlink Functions oracle checks GitHub's public events API:
- Queries `GET https://api.github.com/users/{username}/events`
- Filters for `PushEvent` type on the target date
- Returns `1` (success) or `0` (failure) as uint256

**For hackathon/MVP**: Manual oracle mode is acceptable:
```bash
cast send $CONTRACT_ADDRESS "recordDailyCheck(address,uint8,bool)" \
  $USER_ADDRESS 0 true \
  --private-key $PRIVATE_KEY \
  --rpc-url $SEPOLIA_RPC_URL
```

## Workflow & Deployment Notes

### Typical Development Flow

1. Make contract changes → Run `forge test` to verify
2. Update frontend hooks if ABI changed
3. Test locally with Anvil + frontend dev server
4. Deploy contract to Sepolia
5. Update `VITE_COMMIT_LOCK_ADDRESS` in Frontend/.env
6. Test on Sepolia testnet
7. Deploy frontend to Vercel

### Testing Strategy

**Smart Contracts**: 19 comprehensive tests cover:
- Happy path (create → record 7 days → claim)
- Failure paths (forfeiture, double claims, unauthorized access)
- Ether.Fi integration (mock contracts simulate eETH staking)
- Edge cases (wrong amounts, invalid day indices)

**Frontend**: Manual testing checklist in DEPLOYMENT_GUIDE.md
- Wallet connection (MetaMask, WalletConnect)
- Network switching to Sepolia
- Create commitment flow
- Dashboard updates after oracle calls
- Claim/forfeit flows

### Known Constraints & Limitations

- **Single commitment per user**: No support for multiple concurrent commitments
- **Fixed stake amount**: 0.01 ETH hardcoded (not configurable)
- **Owner-controlled oracle**: Centralized in MVP (Chainlink automation is optional)
- **Sepolia only**: Not multi-chain
- **No grace period**: First missed day = immediate forfeiture
- **GitHub API rate limits**: 60 requests/hour unauthenticated (use token for production)

## Important Files & Context

### Must-Read Documentation
- `DEPLOYMENT_GUIDE.md` - Step-by-step deployment instructions with Cast wallet guide
- `PROJECT_STATUS.md` - Current completion status and next steps
- `FinalPRD.md` - Full product requirements organized by PR chunks
- `SmartContract/README.md` - Complete contract API documentation

### Configuration Files
- `SmartContract/.env.example` - Template for RPC URL and Etherscan API key
- `Frontend/React/.env.example` - Template for WalletConnect and contract address
- `Backend/chainlink/config.json` - Oracle configuration

### Test Data Locations
- Mock Ether.Fi contracts: `SmartContract/test/CommitLock.t.sol` (inline mocks)
- Frontend test accounts: Use standard Sepolia faucet addresses

## Common Patterns

### When Adding New Contract Functions

1. Add function to `src/CommitLock.sol`
2. Add custom error if needed (gas optimization)
3. Write tests in `test/CommitLock.t.sol` covering success and revert cases
4. Run `forge test` to verify
5. Update `src/config/contracts.js` if ABI changes
6. Create corresponding React hook in `src/hooks/` if frontend needs it

### When Adding Frontend Features

1. Create component in `src/components/` or page in `src/pages/`
2. Import contract config from `src/config/contracts.js`
3. Use existing hooks or create new ones in `src/hooks/`
4. Follow existing patterns (Wagmi hooks, loading states, error handling)
5. Use Tailwind CSS for styling (v4 with Vite plugin)
6. Add route in `src/App.jsx` if new page

### Contract Interaction Pattern

```javascript
// Reading data
const { data, isLoading, error } = useReadContract({
  address: COMMIT_LOCK_ADDRESS,
  abi: CommitLockABI,
  functionName: 'getCommitment',
  args: [userAddress],
});

// Writing data
const { writeContract, data: hash } = useWriteContract();
const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

writeContract({
  address: COMMIT_LOCK_ADDRESS,
  abi: CommitLockABI,
  functionName: 'createCommitment',
  args: [githubUsername],
  value: parseEther('0.01'),
});
```

## Project Status & Priorities

**Current State** (~70% complete):
- ✅ Smart contract fully implemented and tested
- ✅ Frontend core pages and hooks complete
- ✅ Oracle code written (local testing works)
- ⏳ Pending Sepolia deployment
- ⏳ Pending WalletConnect Project ID setup
- ⏳ Pending end-to-end integration testing

**Next Immediate Steps**:
1. Deploy contract to Sepolia (30 min)
2. Update frontend .env with contract address and WalletConnect ID
3. Test complete user flow on Sepolia
4. Deploy frontend to Vercel
5. Prepare demo materials

## External Dependencies & Resources

- **Foundry**: https://book.getfoundry.sh/
- **Wagmi v2**: https://wagmi.sh/ (note: v2 has breaking changes from v1)
- **RainbowKit**: https://rainbowkit.com/
- **Ether.Fi Docs**: https://etherfi.gitbook.io/etherfi/
- **Ether.Fi Contracts**: Context files in `SmartContract/context/`
- **Chainlink Functions**: https://docs.chain.link/chainlink-functions
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **LINK Faucet**: https://faucets.chain.link/sepolia

## Security Considerations

- Contract uses custom errors (not require strings) for gas efficiency
- Owner address is immutable (set once in constructor)
- Access control via manual checks (`if (msg.sender != owner) revert Unauthorized()`)
- No reentrancy protection needed (CEI pattern followed, external calls at end)
- Ether.Fi integration uses direct interface calls (no upgradeable proxies)
- Frontend uses Vite environment variables (never expose private keys client-side)

## Demo & Presentation Notes

**2-Minute Demo Flow**:
1. Show landing page + connect wallet
2. Create commitment with GitHub username (0.01 ETH)
3. Show transaction on Etherscan (ETH → eETH via Ether.Fi)
4. Display dashboard with progress tracking
5. Demonstrate oracle check (manual call acceptable)
6. Show claim flow (or explain forfeit scenario)
7. Highlight eETH rewards earned during commitment period

**Key Talking Points**:
- "Your ETH earns staking rewards through Ether.Fi while you build accountability"
- "Miss one day = lose everything (skin in the game)"
- "Only 262 lines of Solidity, 19 comprehensive tests"
- "In production, Chainlink automation would handle daily checks"
