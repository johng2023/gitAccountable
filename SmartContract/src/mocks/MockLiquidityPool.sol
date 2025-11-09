// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MockEETH.sol";

/**
 * @title MockLiquidityPool - Mock Ether.Fi LiquidityPool for Testing
 * @notice Simplified liquidity pool that accepts ETH and mints eETH 1:1
 * @dev Only for testnet use - DO NOT use in production
 */
contract MockLiquidityPool {
    // ============ State Variables ============

    MockEETH public immutable eeth;

    // ============ Events ============

    event Deposit(address indexed user, uint256 ethAmount, uint256 eethAmount);

    // ============ Constructor ============

    /**
     * @param _eeth Address of the MockEETH token
     */
    constructor(address _eeth) {
        eeth = MockEETH(_eeth);
    }

    // ============ External Functions ============

    /**
     * @notice Deposit ETH and receive eETH tokens
     * @dev Mints eETH 1:1 with deposited ETH
     * @return eethAmount Amount of eETH minted (equals msg.value)
     */
    function deposit() external payable returns (uint256 eethAmount) {
        require(msg.value > 0, "Must deposit ETH");

        eethAmount = msg.value;

        // Mint eETH to the caller
        eeth.mint(msg.sender, eethAmount);

        emit Deposit(msg.sender, msg.value, eethAmount);

        return eethAmount;
    }

    // ============ View Functions ============

    /**
     * @notice Get the contract's ETH balance
     * @return ETH balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Get the eETH token address
     * @return eETH contract address
     */
    function getEETH() external view returns (address) {
        return address(eeth);
    }

    // ============ Receive Function ============

    /**
     * @notice Fallback to accept ETH
     */
    receive() external payable {
        // Accept ETH but don't mint eETH (user must call deposit())
    }
}
