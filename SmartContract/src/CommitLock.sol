// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CommitLock - GitHub Commit Accountability with Ether.Fi Staking
 * @notice Stake ETH through Ether.Fi to earn eETH rewards while committing to daily GitHub activity
 * @dev Integrates with Ether.Fi LiquidityPool for liquid staking
 */

// Ether.Fi Protocol Interfaces
interface ILiquidityPool {
    function deposit() external payable returns (uint256);
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract CommitLock {
    // ============ Structs ============

    struct Commitment {
        address user;
        string githubUsername;
        uint256 startTime;
        uint256 eethAmount;      // Amount of eETH received from staking
        bool[7] dailyChecks;     // Track success for each of 7 days
        uint8 daysCompleted;     // Count of successful days
        bool claimed;            // Whether funds have been claimed or forfeited
        bool forfeited;          // Whether commitment was forfeited due to failure
    }

    // ============ State Variables ============

    mapping(address => Commitment) public commitments;
    address public immutable owner;

    // Constants
    uint256 public constant STAKE_AMOUNT = 0.01 ether;
    uint256 public constant DURATION = 7 days;

    // Ether.Fi Contract Addresses (Ethereum Mainnet)
    // Note: Update these for Sepolia testnet deployment
    ILiquidityPool public constant LIQUIDITY_POOL = ILiquidityPool(0x308861A430be4cce5502d0A12724771Fc6DaF216);
    IERC20 public constant EETH = IERC20(0x35fa164735182dE5081f8E82e824cBfb9B6118aC);

    // ============ Events ============

    event CommitmentCreated(
        address indexed user,
        string githubUsername,
        uint256 ethStaked,
        uint256 eethReceived,
        uint256 startTime
    );

    event DayChecked(
        address indexed user,
        uint8 dayIndex,
        bool success,
        uint8 totalCompleted
    );

    event FundsClaimed(
        address indexed user,
        uint256 eethAmount
    );

    event FundsForfeited(
        address indexed user,
        uint256 eethAmount,
        address owner
    );

    // ============ Errors ============

    error InvalidStakeAmount();
    error CommitmentAlreadyActive();
    error NoActiveCommitment();
    error Unauthorized();
    error InvalidDayIndex();
    error CommitmentNotComplete();
    error AlreadyClaimed();
    error CommitmentForfeited();
    error NotForfeited();
    error TransferFailed();

    // ============ Constructor ============

    constructor() {
        owner = msg.sender;
    }

    // ============ External Functions ============

    /**
     * @notice Create a new commitment - stake ETH through Ether.Fi to receive eETH
     * @param _githubUsername GitHub username to track commits for
     * @dev Stakes 0.01 ETH through Ether.Fi LiquidityPool and receives eETH in return
     */
    function createCommitment(string memory _githubUsername) external payable {
        if (msg.value != STAKE_AMOUNT) revert InvalidStakeAmount();
        if (commitments[msg.sender].startTime != 0) revert CommitmentAlreadyActive();

        // Stake ETH through Ether.Fi to receive eETH
        uint256 eethReceived = LIQUIDITY_POOL.deposit{value: msg.value}();

        // Create commitment
        commitments[msg.sender] = Commitment({
            user: msg.sender,
            githubUsername: _githubUsername,
            startTime: block.timestamp,
            eethAmount: eethReceived,
            dailyChecks: [false, false, false, false, false, false, false],
            daysCompleted: 0,
            claimed: false,
            forfeited: false
        });

        emit CommitmentCreated(
            msg.sender,
            _githubUsername,
            msg.value,
            eethReceived,
            block.timestamp
        );
    }

    /**
     * @notice Record the result of a daily GitHub commit check
     * @param _user Address of user to check
     * @param _dayIndex Day index (0-6) to record result for
     * @param _success Whether the user made a commit that day
     * @dev Called by owner/oracle. Sets forfeited flag if any day fails.
     */
    function recordDailyCheck(
        address _user,
        uint8 _dayIndex,
        bool _success
    ) external {
        if (msg.sender != owner) revert Unauthorized();

        Commitment storage c = commitments[_user];
        if (c.startTime == 0) revert NoActiveCommitment();
        if (_dayIndex >= 7) revert InvalidDayIndex();

        c.dailyChecks[_dayIndex] = _success;

        if (_success) {
            c.daysCompleted++;
        } else {
            c.forfeited = true;
        }

        emit DayChecked(_user, _dayIndex, _success, c.daysCompleted);
    }

    /**
     * @notice Claim eETH rewards after successfully completing all 7 days
     * @dev User receives their eETH (which has accrued staking rewards during the commitment)
     */
    function claimFunds() external {
        Commitment storage c = commitments[msg.sender];

        if (c.startTime == 0) revert NoActiveCommitment();
        if (c.daysCompleted != 7) revert CommitmentNotComplete();
        if (c.claimed) revert AlreadyClaimed();
        if (c.forfeited) revert CommitmentForfeited();

        c.claimed = true;
        uint256 eethAmount = c.eethAmount;

        // Transfer eETH (with accrued staking rewards!) back to user
        bool success = EETH.transfer(msg.sender, eethAmount);
        if (!success) revert TransferFailed();

        emit FundsClaimed(msg.sender, eethAmount);
    }

    /**
     * @notice Owner collects forfeited eETH from failed commitments
     * @param _user Address of user who forfeited
     * @dev Owner receives the eETH (with any accrued rewards) from failed commitment
     */
    function collectForfeit(address _user) external {
        if (msg.sender != owner) revert Unauthorized();

        Commitment storage c = commitments[_user];

        if (c.startTime == 0) revert NoActiveCommitment();
        if (!c.forfeited) revert NotForfeited();
        if (c.claimed) revert AlreadyClaimed();

        c.claimed = true;
        uint256 eethAmount = c.eethAmount;

        // Transfer forfeited eETH to owner
        bool success = EETH.transfer(owner, eethAmount);
        if (!success) revert TransferFailed();

        emit FundsForfeited(_user, eethAmount, owner);
    }

    // ============ View Functions ============

    /**
     * @notice Get commitment details for a user
     * @param _user Address to query
     * @return commitment The commitment struct
     */
    function getCommitment(address _user)
        external
        view
        returns (Commitment memory commitment)
    {
        return commitments[_user];
    }

    /**
     * @notice Get commitment with current eETH value information
     * @param _user Address to query
     * @return commitment The commitment struct
     * @return currentEethValue Current eETH amount (appreciates over time due to staking)
     * @return contractEethBalance Total eETH held by this contract
     */
    function getCommitmentWithRewards(address _user)
        external
        view
        returns (
            Commitment memory commitment,
            uint256 currentEethValue,
            uint256 contractEethBalance
        )
    {
        commitment = commitments[_user];
        currentEethValue = commitment.eethAmount;
        contractEethBalance = EETH.balanceOf(address(this));

        return (commitment, currentEethValue, contractEethBalance);
    }

    /**
     * @notice Check if a commitment is active and not yet claimed/forfeited
     * @param _user Address to check
     * @return bool True if commitment is active
     */
    function isCommitmentActive(address _user) external view returns (bool) {
        Commitment memory c = commitments[_user];
        return c.startTime != 0 && !c.claimed;
    }

    /**
     * @notice Check if a user is eligible to claim their eETH
     * @param _user Address to check
     * @return bool True if user can claim
     */
    function canClaim(address _user) external view returns (bool) {
        Commitment memory c = commitments[_user];
        return c.daysCompleted == 7 && !c.claimed && !c.forfeited;
    }
}
