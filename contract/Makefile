include .env

# ── Testnet (Arbitrum Sepolia) ────────────────────────────────────────────────

# Step 1: deploy oracle first, paste printed address into .env as USD_NGN_FEED
deploy-oracle:
	forge script script/DeployOracle.s.sol:DeployOracle \
	--rpc-url $(ARB_RPC_URL) \
	--account myAccount \
	--sender $(YOUR_ADDRESS) \
	--broadcast \
	--verify \
	--etherscan-api-key $(ETHERSCAN_API_KEY) \
	--verifier-url https://api.etherscan.io/v2/api?chainid=421614 \
	-vvvv

# Step 2: deploy core contracts (reads USD_NGN_FEED from .env)
deploy:
	forge script script/Deploy.s.sol:Deploy \
	--rpc-url $(ARB_RPC_URL) \
	--account myAccount \
	--sender $(YOUR_ADDRESS) \
	--broadcast \
	--verify \
	--etherscan-api-key $(ETHERSCAN_API_KEY) \
	--verifier-url https://api.etherscan.io/v2/api?chainid=421614 \
	-vvvv

# ── Local (Anvil) ─────────────────────────────────────────────────────────────

deploy-anvil:
	forge script script/Deploy.s.sol:Deploy \
	--rpc-url http://127.0.0.1:8545 \
	--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
	--broadcast \
	-vvvv

test-feeds:
	forge script script/Interactions.s.sol:Interactions \
	--sig "readPrices()" \
	--rpc-url http://127.0.0.1:8545

bump-eth-price:
	forge script script/Interactions.s.sol:Interactions \
	--sig "bumpEthPrice(int256)" 2100e8 \
	--rpc-url http://127.0.0.1:8545 \
	--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
	--broadcast
