// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/mocks/MockEETH.sol";
import "../src/mocks/MockLiquidityPool.sol";

/**
 * @title DeployMocks - Deployment script for Mock Ether.Fi contracts
 * @notice Deploys MockEETH and MockLiquidityPool to Sepolia testnet
 */
contract DeployMocks is Script {
    function run() external {
        // Start broadcasting transactions
        vm.startBroadcast();

        console.log("\n========================================");
        console.log("Deploying Mock Ether.Fi Contracts");
        console.log("========================================\n");

        console.log("Deployer address:", msg.sender);
        console.log("Deployer balance:", msg.sender.balance / 1e18, "ETH\n");

        // Step 1: Deploy MockEETH
        console.log("1. Deploying MockEETH...");
        MockEETH eeth = new MockEETH();
        console.log("   MockEETH deployed at:", address(eeth));

        // Step 2: Deploy MockLiquidityPool
        console.log("\n2. Deploying MockLiquidityPool...");
        MockLiquidityPool liquidityPool = new MockLiquidityPool(address(eeth));
        console.log("   MockLiquidityPool deployed at:", address(liquidityPool));

        // Step 3: Set LiquidityPool address in eETH
        console.log("\n3. Setting LiquidityPool address in eETH...");
        eeth.setLiquidityPool(address(liquidityPool));
        console.log("   LiquidityPool set successfully");

        // Stop broadcasting
        vm.stopBroadcast();

        // Print summary
        console.log("\n========================================");
        console.log("Deployment Summary");
        console.log("========================================\n");
        console.log("MockEETH:           ", address(eeth));
        console.log("MockLiquidityPool:  ", address(liquidityPool));
        console.log("\n========================================");
        console.log("Next Steps");
        console.log("========================================\n");
        console.log("1. Update CommitLock.sol with these addresses:");
        console.log("   LIQUIDITY_POOL = ILiquidityPool(", address(liquidityPool), ");");
        console.log("   EETH = IERC20(", address(eeth), ");");
        console.log("\n2. Redeploy CommitLock contract");
        console.log("\n3. Update frontend .env with new CommitLock address");
        console.log("\n========================================\n");
    }
}
