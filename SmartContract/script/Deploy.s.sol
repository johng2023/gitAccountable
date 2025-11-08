// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CommitLock.sol";

/**
 * @title DeployCommitLock
 * @notice Deployment script for CommitLock contract
 * @dev Deploy to Sepolia testnet with Cast wallet (secure):
 *      forge script script/Deploy.s.sol:DeployCommitLock \
 *        --rpc-url $SEPOLIA_RPC_URL \
 *        --account deployer \
 *        --sender $(cast wallet address --account deployer) \
 *        --broadcast \
 *        --verify \
 *        --etherscan-api-key $ETHERSCAN_API_KEY
 */
contract DeployCommitLock is Script {
    function run() external {
        // Using Cast wallet - no need to read PRIVATE_KEY from .env
        // The --account flag provides the signer to vm.startBroadcast()
        vm.startBroadcast();

        // Deploy CommitLock
        CommitLock commitLock = new CommitLock();

        console.log("====================================");
        console.log("CommitLock deployed to:", address(commitLock));
        console.log("Owner:", commitLock.owner());
        console.log("Stake Amount:", commitLock.STAKE_AMOUNT());
        console.log("Duration:", commitLock.DURATION());
        console.log("====================================");
        console.log("Ether.Fi Integration:");
        console.log("LiquidityPool:", address(commitLock.LIQUIDITY_POOL()));
        console.log("eETH Token:", address(commitLock.EETH()));
        console.log("====================================");
        console.log("");
        console.log("Next steps:");
        console.log("1. Verify contract on Etherscan:");
        console.log("   forge verify-contract", address(commitLock), "src/CommitLock.sol:CommitLock --chain sepolia");
        console.log("");
        console.log("2. Update frontend with contract address:");
        console.log("   NEXT_PUBLIC_COMMIT_LOCK_ADDRESS=", address(commitLock));
        console.log("");
        console.log("3. Test contract interaction:");
        console.log("   cast call", address(commitLock), "\"owner()\" --rpc-url $SEPOLIA_RPC_URL");
        console.log("====================================");

        vm.stopBroadcast();
    }
}

/**
 * @title DeployCommitLockLocal
 * @notice Local deployment for testing with Anvil
 * @dev Run with: forge script script/Deploy.s.sol:DeployCommitLockLocal --fork-url http://localhost:8545 --broadcast
 */
contract DeployCommitLockLocal is Script {
    function run() external {
        // Use default Anvil account
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

        vm.startBroadcast(deployerPrivateKey);

        CommitLock commitLock = new CommitLock();

        console.log("====================================");
        console.log("LOCAL DEPLOYMENT");
        console.log("====================================");
        console.log("CommitLock deployed to:", address(commitLock));
        console.log("Owner:", commitLock.owner());
        console.log("====================================");

        vm.stopBroadcast();
    }
}
