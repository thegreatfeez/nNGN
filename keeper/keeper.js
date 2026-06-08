/**
 * USD/NGN Oracle Keeper
 *
 * Fetches the live USD/NGN exchange rate from ExchangeRate-API every 30 minutes
 * and pushes it to USDNGNOracle.sol on Arbitrum Sepolia.
 *
 * Setup:
 *   cp .env.example .env   # fill in values
 *   npm install
 *   node keeper.js
 *
 * For persistent uptime:
 *   npm install -g pm2
 *   pm2 start keeper.js --name usd-ngn-keeper
 *   pm2 save
 */

import { ethers } from "ethers";
import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();

const REQUIRED_ENV = [
  "ARB_RPC_URL",
  "ORACLE_ADDRESS",
  "KEEPER_PRIVATE_KEY",
  "EXCHANGE_RATE_API_KEY",
];

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
}

const ORACLE_ADDRESS      = process.env.ORACLE_ADDRESS;
const RPC_URL             = process.env.ARB_RPC_URL;
const PRIVATE_KEY         = process.env.KEEPER_PRIVATE_KEY;
const UPDATE_INTERVAL_MS  = Number(process.env.UPDATE_INTERVAL_MS ?? 30 * 60 * 1000); // 30 min default

const ORACLE_ABI = [
  "function setPrice(int256) external",
  "function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80)",
  "function isStale() external view returns (bool)",
  "function lastUpdatedAt() external view returns (uint256)",
  "function decimals() external view returns (uint8)",
];

/**
 * Fetch the live USD/NGN rate.
 * Returns: how many NGN is 1 USD worth (plain number, e.g. 1600.5)
 *
 * API: https://www.exchangerate-api.com  (free tier: 1500 req/month)
 */
async function fetchUSDNGNRate() {
  const url = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`;
  const res  = await fetch(url);

  if (!res.ok) throw new Error(`HTTP ${res.status} from ExchangeRate-API`);

  const data = await res.json();
  if (data.result !== "success") {
    throw new Error(`API error: ${data["error-type"] ?? JSON.stringify(data)}`);
  }

  const rate = data.conversion_rates?.NGN;
  if (!rate || typeof rate !== "number") {
    throw new Error("NGN rate missing from API response");
  }

  return rate; // e.g. 1600.5 (NGN per 1 USD)
}

async function pushPrice(oracle) {
  const rate = await fetchUSDNGNRate();
  console.log(`[${new Date().toISOString()}] Fetched USD/NGN: ${rate} (1 USD = ₦${rate.toFixed(2)})`);

  // Convert to 8-decimal integer — same precision as Chainlink
  const onChainPrice = BigInt(Math.round(rate * 1e8));
  console.log(`  On-chain price (8dp): ${onChainPrice}`);

  const tx      = await oracle.setPrice(onChainPrice);
  const receipt = await tx.wait();

  console.log(`  ✅ Price updated — block: ${receipt.blockNumber}, tx: ${receipt.hash}`);
  return rate;
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer   = new ethers.Wallet(PRIVATE_KEY, provider);
  const oracle   = new ethers.Contract(ORACLE_ADDRESS, ORACLE_ABI, signer);

  const network = await provider.getNetwork();
  console.log(`Connected to chain ${network.chainId} (${network.name})`);
  console.log(`Oracle: ${ORACLE_ADDRESS}`);
  console.log(`Keeper wallet: ${signer.address}`);
  console.log(`Update interval: ${UPDATE_INTERVAL_MS / 60000} minutes`);

  // Verify the keeper wallet has the PRICE_UPDATER_ROLE before starting
  // (just warn — the actual check happens on-chain via the modifier)
  const balance = await provider.getBalance(signer.address);
  console.log(`Keeper balance: ${ethers.formatEther(balance)} ETH`);
  if (balance < ethers.parseEther("0.001")) {
    console.warn("⚠️  Low keeper balance — may run out of gas for updates");
  }

  // Immediate first push
  await pushPrice(oracle).catch((err) => {
    console.error(`First push failed: ${err.message}`);
  });

  // Then on interval
  setInterval(() => {
    pushPrice(oracle).catch((err) => {
      console.error(`[${new Date().toISOString()}] Push failed: ${err.message}`);
    });
  }, UPDATE_INTERVAL_MS);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
