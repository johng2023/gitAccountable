# CommitLock Smart Contract

**Stake ETH. Commit code daily. Earn eETH rewards through Ether.Fi.**

## Overview

CommitLock is a smart contract that combines GitHub commit accountability with Ether.Fi liquid staking rewards. Users stake 0.01 ETH for 7 days, which is automatically staked through Ether.Fi to earn eETH rewards. If they commit to GitHub every day for 7 days, they claim their eETH (with accrued staking rewards). If they miss even one day, the eETH is forfeited to the contract owner.

### Key Features

- **Stake ETH → Earn eETH**: Your staked ETH is automatically deposited into Ether.Fi's LiquidityPool to receive eETH
- **Earn While You Build**: eETH accumulates staking rewards during the 7-day commitment period
- **Daily GitHub Tracking**: Chainlink oracle checks your GitHub activity every day
- **Claim or Forfeit**: Complete all 7 days to claim your eETH with rewards, or lose it to the owner

### Ether.Fi Integration

This contract integrates with Ether.Fi's liquid staking protocol:
- **LiquidityPool**: `0x308861A430be4cce5502d0A12724771Fc6DaF216`
- **eETH Token**: `0x35fa164735182dE5081f8E82e824cBfb9B6118aC`

When users create a commitment, their ETH is staked through Ether.Fi's `LiquidityPool.deposit()` function, receiving eETH in return. The eETH earns staking rewards over time, so users who successfully complete their commitment receive more value than they staked.

## Project Structure

```
SmartContract/
├── src/
│   └── CommitLock.sol          # Main contract with Ether.Fi integration
├── test/
│   └── CommitLock.t.sol        # Comprehensive test suite (19 tests)
├── script/
│   └── Deploy.s.sol            # Deployment scripts for Sepolia and local
├── lib/
│   └── forge-std/              # Foundry standard library
└── foundry.toml                # Foundry configuration
```

## Getting Started

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- Sepolia testnet ETH for deployment
- RPC URL for Sepolia testnet

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd SmartContract

# Install dependencies
forge install

# Build the contract
forge build
```

### Running Tests

```bash
# Run all tests
forge test

# Run tests with verbose output
forge test -vv

# Run tests with gas reporting
forge test --gas-report

# Run specific test
forge test --match-test testCreateCommitmentStakesETHForEETH -vvv
```

**Test Coverage**: 19 comprehensive tests covering:
- ✅ Creating commitments with ETH staking
- ✅ Daily check recording (success/failure)
- ✅ Successful claiming of eETH rewards
- ✅ Forfeiture collection
- ✅ Access control
- ✅ Edge cases and error handling

## Deployment

### Deploy to Sepolia Testnet

**Using Cast Wallet (Recommended - Secure):**

1. Verify your wallet is imported (you already have "metaMaskKey"):
```bash
cast wallet list
# Should show: metaMaskKey (Local)
```

2. Set up environment variables (no PRIVATE_KEY needed!):
```bash
export SEPOLIA_RPC_URL=<your-sepolia-rpc-url>
export ETHERSCAN_API_KEY=<your-etherscan-api-key>
```

3. Deploy the contract:
```bash
# Get your deployer address
DEPLOYER_ADDRESS=$(cast wallet address --account metaMaskKey)

# Deploy with Cast wallet (you'll be prompted for password)
forge script script/Deploy.s.sol:DeployCommitLock \
    --rpc-url $SEPOLIA_RPC_URL \
    --account metaMaskKey \
    --sender $DEPLOYER_ADDRESS \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    -vvvv
```

3. The deployment script will output:
   - Contract address
   - Owner address
   - Ether.Fi integration addresses
   - Verification command

### Deploy Locally (Anvil)

```bash
# Start Anvil in one terminal
anvil

# Deploy in another terminal
forge script script/Deploy.s.sol:DeployCommitLockLocal \
    --fork-url http://localhost:8545 \
    --broadcast
```

## Contract API

### Core Functions

#### `createCommitment(string memory _githubUsername) external payable`
Creates a new 7-day commitment by staking 0.01 ETH through Ether.Fi.

**Parameters:**
- `_githubUsername`: Your GitHub username to track commits for

**Requirements:**
- Must send exactly 0.01 ETH
- Cannot have an active commitment

**Events:**
- `CommitmentCreated(address user, string username, uint256 ethStaked, uint256 eethReceived, uint256 startTime)`

#### `recordDailyCheck(address _user, uint8 _dayIndex, bool _success) external`
Records the result of a daily GitHub commit check (owner/oracle only).

**Parameters:**
- `_user`: Address of the user to check
- `_dayIndex`: Day index (0-6)
- `_success`: Whether the user made a commit that day

**Events:**
- `DayChecked(address user, uint8 dayIndex, bool success, uint8 totalCompleted)`

#### `claimFunds() external`
Claims eETH rewards after successfully completing all 7 days.

**Requirements:**
- Must have completed all 7 days
- Cannot have claimed already
- Cannot have forfeited

**Events:**
- `FundsClaimed(address user, uint256 eethAmount)`

#### `collectForfeit(address _user) external`
Owner collects forfeited eETH from failed commitments.

**Parameters:**
- `_user`: Address of user who forfeited

**Events:**
- `FundsForfeited(address user, uint256 eethAmount, address owner)`

### View Functions

#### `getCommitment(address _user) external view returns (Commitment memory)`
Returns the commitment details for a user.

#### `getCommitmentWithRewards(address _user) external view returns (Commitment memory, uint256 currentEethValue, uint256 contractEethBalance)`
Returns commitment with current eETH value information.

#### `isCommitmentActive(address _user) external view returns (bool)`
Checks if a user has an active commitment.

#### `canClaim(address _user) external view returns (bool)`
Checks if a user is eligible to claim their eETH.

## Contract Architecture

### Commitment Struct

```solidity
struct Commitment {
    address user;
    string githubUsername;
    uint256 startTime;
    uint256 eethAmount;      // eETH received from staking
    bool[7] dailyChecks;     // Success for each of 7 days
    uint8 daysCompleted;     // Count of successful days
    bool claimed;            // Whether claimed or forfeited
    bool forfeited;          // Whether forfeited due to failure
}
```

### Flow Diagram

```
User Creates Commitment (0.01 ETH)
         ↓
ETH → Ether.Fi LiquidityPool
         ↓
Contract receives eETH
         ↓
7 Days of GitHub Tracking
         ↓
    ┌───────────┴───────────┐
    ↓                       ↓
All Days ✅              Any Day ❌
    ↓                       ↓
User claims eETH        Owner collects
  (with rewards!)        forfeited eETH
```

## Security Considerations

- **Immutable Owner**: Owner is set at deployment and cannot be changed
- **Access Control**: Only owner can record daily checks and collect forfeits
- **Single Commitment**: Users can only have one active commitment at a time
- **Custom Errors**: Gas-efficient error handling
- **Event Logging**: All state changes emit events for transparency

## Gas Optimization

- Uses custom errors instead of require strings
- Immutable variables where possible
- Efficient struct packing
- Direct external calls to Ether.Fi contracts

## Future Enhancements

- [ ] Support multiple concurrent commitments per user
- [ ] Customizable duration and stake amounts
- [ ] Integration with Chainlink Automation for automated daily checks
- [ ] Support for weETH (wrapped eETH)
- [ ] Grace day functionality
- [ ] Leaderboards tracking total rewards earned

## License

MIT

## Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [Ether.Fi Documentation](https://etherfi.gitbook.io/etherfi/)
- [Ether.Fi Smart Contracts](https://github.com/etherfi-protocol/smart-contracts)
- [Chainlink Functions](https://docs.chain.link/chainlink-functions)

## Support

For issues or questions:
1. Check the tests in `test/CommitLock.t.sol` for usage examples
2. Review the inline documentation in `src/CommitLock.sol`
3. Open an issue in the GitHub repository
