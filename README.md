# NairaStable (nNGN)

A decentralized, over-collateralized stablecoin pegged 1:1 to the Nigerian Naira, built on Arbitrum. Every nNGN is backed by real ETH locked in a transparent smart contract — no custodians, no intermediaries.

> **Network**: Arbitrum Sepolia (testnet)
> **Full docs**: [nngn.vercel.app/docs](https://nngn.vercel.app/docs)

---

## How It Works

You deposit ETH into a **vault**. The protocol lets you mint nNGN against it — up to a safe limit. When you want your ETH back, you repay the nNGN and your collateral is returned.

The system stays solvent through **liquidations**: if your collateral ratio falls below 150%, anyone can repay your debt and claim your ETH at a 10% discount, incentivising keepers to maintain protocol health.

| Parameter | Value |
|---|---|
| Minimum collateral ratio to mint | 200% |
| Liquidation threshold | 150% |
| Liquidation bonus | 10% |
| Mint fee | 0.5% |
| Repay fee | 0.3% |

---

## Contracts (Arbitrum Sepolia)

| Contract | Address |
|---|---|
| NSEngine (CDP logic) | `0x1307b715C44d1DbC97e5A6657f34795d2D6cF854` |
| NairaStable (nNGN token) | `0xb4C0f815950E1AEC52EdAf9a80586EBFF2c42946` |
| ETH/USD Oracle (Chainlink) | `0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165` |
| USD/NGN Oracle (Keeper) | `0x2187E8dEbF84C6a6637cCBbE65D43BB38D39DAca` |

---

## Repository Structure

```
├── contract/       Solidity contracts (Foundry)
│   └── src/
│       ├── NSEngine.sol        Core CDP engine — deposit, mint, repay, liquidate
│       ├── NairaStable.sol     ERC20 nNGN token
│       ├── USDNGNOracle.sol    Custom USD/NGN price feed
│       └── libraries/          Math and oracle helpers
│
├── frontend/       React + Viem DApp
│
└── keeper/         Node.js oracle keeper
                    Fetches live USD/NGN rate and pushes it on-chain every 30 min
```

---

## Local Development

### Contracts

```bash
cd contract
forge build
forge test
```

Deploy to a local fork:

```bash
anvil --fork-url <ARBITRUM_SEPOLIA_RPC>
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Keeper

```bash
cd keeper
cp .env.example .env   # fill in ARB_RPC_URL, ORACLE_ADDRESS, KEEPER_PRIVATE_KEY, EXCHANGE_RATE_API_KEY
npm install
node keeper.js
```

For persistent uptime: `pm2 start keeper.js --name usd-ngn-keeper`

---

## Documentation

The full protocol docs cover core concepts, a step-by-step user guide, developer integration examples (wagmi/viem), a fintech/Node.js integration guide, oracle architecture, and the roadmap.

**[Read the docs →](https://nngn.vercel.app/docs)**

---

## Roadmap

- Multi-collateral support (wBTC, ARB, stETH, USDC)
- Mainnet deployment
- Governance token
- NGN-denominated DeFi integrations
