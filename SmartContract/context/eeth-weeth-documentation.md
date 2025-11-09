# eETH and weETH Technical Documentation

Source: [ether.fi Technical Documentation](https://etherfi.gitbook.io/etherfi/ether.fi-whitepaper/technical-documentation#eeth-and-weeth)

## eETH (Liquid Staking Token)

eETH is ether.fi's liquid staking token. eETH is a rebasing ERC-20 token. The eETH token represents a claim on the same amount of ETH which is held by the ether.fi liquidity pool or being staked earning rewards within the Ethereum *Proof-of-Stake* system.

### Rebasing Mechanism

The staking rewards are distributed to the eETH holders by the rebasing mechanism where its balance is updated automatically on all the addresses. The rebase mechanism is implemented via shares where the `share` represents the eETH holder's share in the total amount of ether controlled by the ether.fi protocol.

### Balance Calculation

The eETH balance of an `account` is computed as follows:

```
BalanceOf(account) = TotalPooledEth * (Shares[account] / TotalShares)
```

Where:
- `TotalPooledEth` = the total amount of ETH controlled by the protocol
- `Shares[account]` = the account's share of eETH
- `TotalShares` = the total shares of eETH

### Total Pooled ETH Components

Here, `TotalPooledEth = (D + P + R)` as reported by the [Oracle](https://etherfi.gitbook.io/etherfi/ether.fi-whitepaper/technical-documentation#oracle):
- `D` = the total ETH deposits in the liquidity pool
- `P` = the total ETH claims on principals for the T-NFTs in the liquidity pool
- `R` = the total ETH claims on rewards for the T-NFTs in the liquidity pool

## weETH (Wrapped eETH)

Users may wrap their `eETH` into `weETH` to obtain a non-rebasing ERC-20 token. Converting between `eETH` and `weETH` is done through the LiquidityPool at the current share rate.

### Key Differences

| Feature | eETH | weETH |
|---------|------|-------|
| Token Type | Rebasing ERC-20 | Non-rebasing ERC-20 |
| Balance Updates | Automatic (via rebase) | Fixed supply |
| Conversion | N/A | Via LiquidityPool at current share rate |
| Use Case | Direct staking rewards | DeFi integrations requiring fixed supply |

## Liquidity Pool

The **LiquidityPool** contract aggregates ETH deposits and manages validator creation, rewards accounting and redemptions. Its key functions are:

### Minting eETH
When users deposit ETH, the pool calculates the number of eETH shares to mint based on the current total pooled ETH and total eETH shares. The formula ensures that each share always represents an equal claim on the pool's assets.

### Wrapping and Unwrapping
Depositors can wrap eETH into weETH via the WeETH contract to obtain a non-rebasing ERC-20 token. Unwrapping weETH returns the corresponding amount of eETH.

### Membership NFTs
Users may choose to wrap their deposit into a Membership NFT instead of holding eETH directly. The NFT records the user's share balance and accrues loyalty and tier points that may boost future rewards.

### Redeeming eETH/weETH
To withdraw ETH, a user burns their eETH or weETH. The pool attempts to fulfill the redemption from its unbonded ETH. If insufficient ETH is available, it will queue full validator exits and process redemptions once the ETH is released from the beacon chain.

### Reward Accrual
When the EtherFiOracle publishes a new reward report, the pool increases the total pooled ETH without increasing the number of eETH shares. This raises the value of each share and automatically distributes rewards to all holders.

## Technical Highlights

- **User Control**: Allows users to retain control of their staked assets
- **Flexibility**: Provides flexibility between rebasing and non-rebasing token formats
- **Automatic Distribution**: Automatically distributes rewards through share price adjustments
- **Seamless Conversion**: Enables seamless wrapping and unwrapping between eETH and weETH
- **Permissionless**: All withdrawals and operations are permissionless

## Integration Notes

The documentation emphasizes the token's design to provide a flexible, user-controlled liquid staking solution within the ether.fi ecosystem. The system supports both rebasing (eETH) and non-rebasing (weETH) formats to accommodate different DeFi integration requirements.

---

*Last updated: 2025-01-08*
*Documentation extracted from ether.fi whitepaper technical documentation*
