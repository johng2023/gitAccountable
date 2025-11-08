# Ether Fi Hackathon Guide

This is a guide for ASU Students seeking to compete at ASU Hackathon on the Ether Fi Track.

## What is Ether Fi?

Ether Fi is the 2nd largest Restaking protocol and a Crypto Neobank with around $8 Billion locked into its smart contracts.

Ether Fi essentially has the three following products:

- Staking
- Liquid
- Cash

## What is ReStaking?

**Ether.Fi** lets you **stake your Ethereum (ETH)** — meaning you lock up your ETH to help secure the Ethereum network and, in return, you **earn rewards**.

Normally, staking requires running your own validator, which can be technical and needs at least 32 ETH. Ether.Fi makes this easy by letting you:

1.  **Deposit any amount of ETH** (even less than 32).
2.  **Stake it through professional node operators** who run the validators for you.
3.  **Get a liquid staking token** (called **eETH**) in return.

That eETH token represents your staked ETH **plus your rewards** — and you can use it in DeFi apps (like lending, trading, or earning extra yield) while your original ETH stays staked and earning.

[Ether.Fi](http://Ether.Fi) then **restakes** this Ethereum into Eigenlayer which enables it to earn additional rewards and secure more networks and services.

Ether FI’s restaking assets are eETH (Ether FI ETH) and weETH (Wrapped Ether Fi ETH). These tokens can be used in other protocols and they follow the ERC20 standard.

## What is Liquid?

Liquid is a vault-product offered by Ether.fi. According to their site, it’s described as:

> “Automated DeFi strategies that provide Ether.fi customers a simple access point to use their tokens in the DeFi ecosystem.”

It is essentially a simple way for users to park their funds and earn yield.

Ether Fi has three core liquid vaults:

-   Liquid USD: This vault is denominated in USD (e.g users deposit USDC or USDT for Liquid USD & earn yield)
-   Liquid ETH: This vault is denominated in ETH (e.g users deposit ETH for Liquid ETH & earn yield)
-   Liquid BTC: This vault is denominated in BTC (e.g users deposit WBTC* for Liquid BTC & earn yield)

*WBTC is Wrapped Bitcoin*

## What is Cash?

-   It’s a crypto-native credit card + app that lets you spend your crypto in the real world (Apple/Google Pay, virtual/physical card, Visa acceptance). [Ether](https://www.ether.fi/cash?utm_source=chatgpt.com)
-   You can choose how it pays at checkout:
    1.  Direct Pay – spend your USDC/LiquidUSD balance directly (no borrowing);
    2.  Borrow Mode – use your crypto as collateral and borrow to pay, so you don’t have to sell your assets. [help.ether.fi+1](https://help.ether.fi/en/articles/326983-understanding-your-cash-card-borrow-mode-vs-direct-pay-mode?utm_source=chatgpt.com)
-   It’s non-custodial (you keep control of your assets) and offers 3% Cash Back on all purchases

## Good Resources

-   Overview of the Finances of Ether Fi
    -   https://defillama.com/protocol/ether.fi
-   Great In Depth Dashboard about Ether Fi Restaking
    -   https://dune.com/ether_fi/etherfi

## Hiring!

Also I want to note that Ether Fi is also hiring along with Nonce Capital ( a partner company).

If working on software and smart contracts that secures Billions of dollars and helps us move towards a more fair, decentralized economy. Apply!

https://www.ether.fi/careers

https://nonce-capital.xyz/careers

## Hackathon Tracks

The hackathon has the following prizes:

-   1st: $1000
-   2nd: $500
-   3rd: $250
-   Pool Prize: $750

The pool prize will be split among all projects that include Ether Fi in a **meaningful way**.

The following are the projects that we want to see:

### DeFi Integrations

This includes a new DeFi protocol built on top of the Ether Fi Ecosystem of products or potentially analytics into Ether Fi’s DeFi.

An example of a notable DeFi integration with Ether Fi is [Aave](https://app.aave.com/markets/), a lending protocol with over 30 Billion dollars in TVL holds around 6 B in Ether Fi WeETH tokens which are used as collateral.

What new protocols can you come up with?

### Portfolio Analytics

This includes projects that provide additional insights or AI enabled into Ether Fi. This might include the creation of new interesting visualizations of the protocol’s products.

### Educational Products Or Games

This includes projects that potentially build a new front end that makes investing easier (maybe an **aesthetic** farming game where users plant seeds by staking their ETH). Or it could be a good visualization explaining how the protocol works and what it does.

### Resources

#### Ether Fi’s Github

https://github.com/etherfi-protocol

#### Ether Fi’s Staking Smart Contracts

https://github.com/etherfi-protocol/smart-contracts

#### Ether Fis Cash Contracts

https://github.com/etherfi-protocol/cash-contracts

#### Ether Fis beHYPE

https://github.com/etherfi-protocol/beHYPE

#### Ether Fi’s Liquid Contracts

https://github.com/Veda-Labs/boring-vault

### Important Contract Addresses

| Name | Address |
| :--- | :--- |
| **Address Provider** | `0x8487c5F8550E3C3e7734Fe7DCF77DB2B72E4A848` |
| **AuctionManager** | `0x00c452affee3a17d9cecc1bcd2b8d5c7635c4cb9` |
| **MembershipNFT** | `0xb49e4420eA6e35F98060Cd133842DbeA9c27e479` |
| **MembershipManager** | `0x3d320286E014C3e1ce99Af6d6B00f0C1D63E3000` |
| **EtherFiNodesManager** | `0x8B71140ad2e5d1e7018d2a7f8a288bd3cd38916f` |
| **WeETH** | `0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee` |
| **EETH** | `0x35fA164735182de5081F8e82E824cBfB9b6118ac2` |
| **ETHFI** | `0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb` |
| **Deposit Adaptor** | `0xcfC6d9BD7411962Bfe7145451A7EF71A24b6A7A2` |
| **LiquidityPool** | `0x308861A430be4cce5502d0A12724771Fc6DaF216` |

### Ether Fi Liquid Addresses

| Vaults | Boring Vault (Main Token) | Accountant (Used to get Price of Token) |
| :--- | :--- | :--- |
| **btc liquid** | `0x5f46d540b6eD704C3c8789105F30E075AA900726` | `0xEa23aC6D7D11f6b1816B98174D334478ADAe6b0` |
| **usd liquid** | `0x08c6F91e2B681FaF5e17227F2a44C307b3C1364C` | `0xc315D6e14DDCDC7407784e2Caf815d131Bc1D3E7` |
| **eth liquid** | `0xf0bb20865277aBd641a307eCe5e04E79073416c` | `0x0d05D94a5F1E76C18fbeB7A13d17C8a314088198` |

<br>

Feel free to make your own test token on a test network to represent an Ether FI token.