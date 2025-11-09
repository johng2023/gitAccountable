// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockEETH - Mock eETH Token for Testing
 * @notice Simplified ERC20 token that simulates Ether.Fi's eETH on Sepolia
 * @dev Only for testnet use - DO NOT use in production
 */
contract MockEETH {
    // ============ State Variables ============

    string public constant name = "Mock Ether.Fi Staked ETH";
    string public constant symbol = "eETH";
    uint8 public constant decimals = 18;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    // Address of the MockLiquidityPool that can mint tokens
    address public liquidityPool;

    // ============ Events ============

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event LiquidityPoolSet(address indexed liquidityPool);

    // ============ Errors ============

    error Unauthorized();
    error InsufficientBalance();
    error InsufficientAllowance();

    // ============ Constructor ============

    constructor() {
        // LiquidityPool will be set after deployment
    }

    // ============ Admin Functions ============

    /**
     * @notice Set the liquidity pool address (one-time setup)
     * @param _liquidityPool Address of the MockLiquidityPool
     */
    function setLiquidityPool(address _liquidityPool) external {
        if (liquidityPool != address(0)) revert Unauthorized();
        liquidityPool = _liquidityPool;
        emit LiquidityPoolSet(_liquidityPool);
    }

    // ============ Minting Functions ============

    /**
     * @notice Mint eETH tokens (only callable by LiquidityPool)
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external {
        if (msg.sender != liquidityPool) revert Unauthorized();

        _totalSupply += amount;
        _balances[to] += amount;

        emit Transfer(address(0), to, amount);
    }

    // ============ ERC20 Functions ============

    /**
     * @notice Get token balance of an account
     * @param account Address to query
     * @return Balance of the account
     */
    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    /**
     * @notice Get total supply of eETH
     * @return Total supply
     */
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    /**
     * @notice Transfer tokens to another address
     * @param to Recipient address
     * @param amount Amount to transfer
     * @return success True if transfer succeeded
     */
    function transfer(address to, uint256 amount) external returns (bool) {
        if (_balances[msg.sender] < amount) revert InsufficientBalance();

        _balances[msg.sender] -= amount;
        _balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }

    /**
     * @notice Get allowance for spender
     * @param owner Token owner
     * @param spender Spender address
     * @return Allowance amount
     */
    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @notice Approve spender to spend tokens
     * @param spender Spender address
     * @param amount Amount to approve
     * @return success True if approval succeeded
     */
    function approve(address spender, uint256 amount) external returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /**
     * @notice Transfer tokens from one address to another
     * @param from Sender address
     * @param to Recipient address
     * @param amount Amount to transfer
     * @return success True if transfer succeeded
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        if (_balances[from] < amount) revert InsufficientBalance();
        if (_allowances[from][msg.sender] < amount) revert InsufficientAllowance();

        _allowances[from][msg.sender] -= amount;
        _balances[from] -= amount;
        _balances[to] += amount;

        emit Transfer(from, to, amount);
        return true;
    }
}
