# Ether.Fi Smart Contracts - Protocol Overview

## Introduction

The ether.fi Liquid Restaking Protocol represents the core infrastructure powering ether.fi's vision of becoming the most secure and efficient liquid staking solution in DeFi.

**Repository**: https://github.com/etherfi-protocol/smart-contracts

## Key Features

### 1. Liquid Staking
- Seamless ETH staking with immediate liquidity through eETH (Liquid Staking Token)
- Users can stake ETH while maintaining liquidity
- No lock-up periods for accessing staked value

### 2. Native Restaking
- Controlled restaking of staked ETH via AVS (Actively Validated Services) operator contracts
- Enables additional yield opportunities through restaking mechanisms
- Integration with EigenLayer and other restaking protocols

### 3. DeFi Integration
- Wide protocol compatibility across the DeFi ecosystem
- eETH can be used in various DeFi protocols while earning staking rewards
- Composability with lending, DEXs, and other DeFi primitives

### 4. Cross-Chain Capabilities
- Native support for weETH (wrapped eETH) bridging
- Multi-chain deployment for broader ecosystem access
- Interoperability across different blockchain networks

### 5. Enterprise-Grade Security
- Rigorous auditing by leading security firms
- Continuous monitoring and testing
- Formal verification through Certora
- Open-source codebase for transparency

## Staking Products

### eETH (Ethereum Liquid Staking Token)
- Primary liquid staking token for ETH
- 1:1 backing with staked ETH
- Earns native Ethereum staking rewards
- Fully composable in DeFi

### weETH (Wrapped eETH)
- Wrapped version of eETH for cross-chain usage
- Maintains peg to eETH value
- Enables bridging to other chains
- Specialized variants:
  - **weETHs**: Specific wrapper variant
  - **weETHk**: King Protocol variant

### eUSD
- Stablecoin product in the Ether.Fi ecosystem
- Backed by staked assets

### eBTC
- Bitcoin liquid staking token
- Brings BTC into the Ether.Fi ecosystem

### EIGEN Staking
- Staking for EIGEN tokens
- Integration with EigenLayer ecosystem

## Protocol Architecture

### Core Components

#### Staking Infrastructure
- Validator management system
- Stake allocation and distribution
- Reward calculation and distribution
- Withdrawal processing

#### Liquid Token System
- eETH minting and burning
- Token wrapping/unwrapping (weETH)
- Price oracle integration
- Rebase mechanism for rewards

#### Restaking Layer
- AVS operator contracts
- Restaking strategy management
- Risk management and diversification
- Additional yield optimization

#### Governance
- Decentralized protocol governance
- Parameter adjustment mechanisms
- Upgrade management
- Treasury management

### Key Smart Contract Categories

Based on the repository structure:

#### `/src/` - Core Smart Contracts
Primary contract implementations including:
- Staking pool contracts
- Liquid token contracts (eETH, weETH)
- Restaking integration contracts
- Oracle and pricing contracts
- Access control and governance contracts

#### `/test/` - Testing Suite
- Comprehensive unit tests
- Integration tests
- Fork testing capabilities
- Security property tests

#### `/deployment/` - Deployment Scripts
- Contract deployment automation
- Configuration management
- Network-specific deployments
- Upgrade scripts

#### `/certora/` - Formal Verification
- Formal verification specifications
- Security property definitions
- Certora configuration files

#### `/audits/` - Security Documentation
- Audit reports from security firms
- Vulnerability disclosures
- Security recommendations
- Remediation documentation

## How the Protocol Works

### Staking Flow
1. **Deposit**: Users deposit ETH into the staking contract
2. **Validator Assignment**: ETH is assigned to validators
3. **eETH Minting**: Users receive eETH representing their staked position
4. **Reward Accrual**: Staking rewards accumulate over time
5. **Withdrawal**: Users can burn eETH to withdraw their ETH + rewards

### Restaking Flow
1. **Opt-in**: eETH holders can opt into restaking
2. **AVS Selection**: Restaked ETH is allocated to AVS operators
3. **Additional Rewards**: Earn restaking rewards on top of staking rewards
4. **Risk Management**: Protocol manages restaking risks and slashing

### Cross-Chain Flow
1. **Wrapping**: eETH is wrapped to weETH
2. **Bridging**: weETH is bridged to target chain
3. **Usage**: weETH can be used in target chain DeFi
4. **Unwrapping**: Bridge back and unwrap to eETH on mainnet

## Development Setup

### Prerequisites
```bash
# Install Foundry (Ethereum development framework)
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Repository Setup
```bash
# Clone the repository
git clone https://github.com/etherfi-protocol/smart-contracts.git
cd smart-contracts

# Initialize submodules
git submodule update --init --recursive

# Install dependencies and build
forge install
forge build
```

### Running Tests
```bash
# Run all tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Run specific test file
forge test --match-path test/SpecificTest.t.sol

# Fork testing (requires RPC URL)
forge test --fork-url <your_rpc_url>

# Verbose output
forge test -vvv
```

### Formal Verification
```bash
# Run Certora formal verification
certoraRun certora/conf/<contract-name>.conf
```

## Security Approach

### Multi-Layered Security
1. **Regular Audits**: Continuous third-party security audits
2. **Formal Verification**: Mathematical proofs of contract correctness
3. **Bug Bounties**: Community-driven vulnerability discovery
4. **Monitoring**: Real-time protocol monitoring
5. **Incident Response**: Prepared emergency response procedures

### Best Practices
- Upgradeable proxy patterns for contract updates
- Time-locked governance actions
- Multi-signature controls for critical operations
- Circuit breakers for emergency situations
- Comprehensive testing coverage

## Additional Features

### Solo Staker Program
- Support for individual stakers
- Lower barriers to entry
- Decentralization of validator set

### Loyalty Points Program
- Rewards for long-term users
- Gamification of participation
- Community engagement incentives

### Membership Rewards
- Tiered benefits for users
- Enhanced yield opportunities
- Governance participation benefits

### King Protocol (formerly LRT²)
- Advanced liquid restaking token system
- Layered restaking strategies
- Optimized yield aggregation

## Documentation Resources

- **Official Documentation**: https://etherfi.gitbook.io/etherfi/
- **GitHub Repository**: https://github.com/etherfi-protocol/smart-contracts
- **Audit Reports**: Available in `/audits/` directory
- **Technical Specifications**: Available in `/docs/` directory

## Licensing

The project is open-source and released under the **MIT License**, allowing for:
- Free use and modification
- Commercial use
- Distribution
- Private use

## Technical Stack

- **Smart Contract Language**: Solidity
- **Development Framework**: Foundry
- **Testing Framework**: Forge (part of Foundry)
- **Formal Verification**: Certora
- **Deployment**: Hardhat/Forge scripts
- **Network**: Ethereum Mainnet + Layer 2s

## Integration Points

### For Developers
- Integrate eETH into your DeFi protocol
- Build on top of the restaking infrastructure
- Utilize cross-chain bridging capabilities
- Contribute to the open-source codebase

### For Users
- Stake ETH through the dApp
- Use eETH in various DeFi protocols
- Participate in restaking for additional yield
- Engage with governance

## Key Advantages

1. **Capital Efficiency**: Maintain liquidity while earning staking rewards
2. **Composability**: Use staked ETH throughout DeFi
3. **Additional Yield**: Restaking opportunities for enhanced returns
4. **Security**: Enterprise-grade security practices
5. **Decentralization**: Distributed validator network
6. **Transparency**: Open-source and audited code

## Risks and Considerations

- Smart contract risk (mitigated through audits and formal verification)
- Restaking risks (slashing conditions from AVS)
- Market risks (eETH peg stability)
- Regulatory risks (evolving crypto regulations)
- Technical risks (bridge security, oracle dependencies)

---

*This documentation is based on the Ether.Fi smart contracts repository and public information. Always verify current details from official sources.*

**Last Updated**: 2025-11-08
**Built by**: Ether.Fi Team ❤️
