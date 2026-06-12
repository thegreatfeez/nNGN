import { createPublicClient, http, parseAbiItem } from "viem";
import { arbitrumSepolia } from "viem/chains";

const NNGN_ADDRESS = "0xb4C0f815950E1AEC52EdAf9a80586EBFF2c42946";

const client = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(
    process.env.ARB_RPC_URL ?? "https://sepolia-rollup.arbitrum.io/rpc"
  ),
});

const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

export async function verifyPayment({ txHash, expectedRecipient, expectedAmountRaw }) {
  const receipt = await client.getTransactionReceipt({ hash: txHash });
  if (!receipt || receipt.status !== "success") return false;

  const logs = await client.getLogs({
    address: NNGN_ADDRESS,
    event: TRANSFER_EVENT,
    fromBlock: receipt.blockNumber,
    toBlock: receipt.blockNumber,
  });

  const valid = logs.find(
    (log) =>
      log.transactionHash === txHash &&
      log.args.to?.toLowerCase() === expectedRecipient.toLowerCase() &&
      (log.args.value ?? 0n) >= BigInt(expectedAmountRaw)
  );

  return !!valid;
}
