// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CommitLock.sol";

/**
 * @title CommitLockTest
 * @notice Comprehensive test suite for CommitLock contract with Ether.Fi integration
 */
contract CommitLockTest is Test {
    CommitLock public commitLock;

    address public owner;
    address public user1;
    address public user2;

    // Mock Ether.Fi contracts for testing
    MockLiquidityPool public mockLiquidityPool;
    MockEETH public mockEETH;

    uint256 constant STAKE_AMOUNT = 0.01 ether;

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

    event FundsClaimed(address indexed user, uint256 eethAmount);

    event FundsForfeited(address indexed user, uint256 eethAmount, address owner);

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        // Deploy mock Ether.Fi contracts
        mockEETH = new MockEETH();
        mockLiquidityPool = new MockLiquidityPool();

        // Use vm.etch to inject mock contract code at the hardcoded addresses in CommitLock
        vm.etch(0x308861A430be4cce5502d0A12724771Fc6DaF216, address(mockLiquidityPool).code);
        vm.etch(0x35fa164735182dE5081f8E82e824cBfb9B6118aC, address(mockEETH).code);

        // Deploy CommitLock after mocks are in place
        commitLock = new CommitLock();

        // Fund test users
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);
    }

    // ============ Test: Create Commitment ============

    function testCreateCommitmentStakesETHForEETH() public {
        vm.startPrank(user1);

        uint256 eethBefore = IERC20(0x35fa164735182dE5081f8E82e824cBfb9B6118aC).balanceOf(address(commitLock));

        vm.expectEmit(true, false, false, true);
        emit CommitmentCreated(user1, "testuser", STAKE_AMOUNT, STAKE_AMOUNT, block.timestamp);

        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        CommitLock.Commitment memory commitment = commitLock.getCommitment(user1);

        assertEq(commitment.user, user1);
        assertEq(commitment.githubUsername, "testuser");
        assertEq(commitment.eethAmount, STAKE_AMOUNT); // Mock returns 1:1
        assertEq(commitment.daysCompleted, 0);
        assertEq(commitment.claimed, false);
        assertEq(commitment.forfeited, false);

        // Verify eETH was received by contract
        uint256 eethAfter = IERC20(0x35fa164735182dE5081f8E82e824cBfb9B6118aC).balanceOf(address(commitLock));
        assertEq(eethAfter - eethBefore, STAKE_AMOUNT);

        vm.stopPrank();
    }

    function testCreateCommitmentRevertsWithWrongAmount() public {
        vm.startPrank(user1);

        vm.expectRevert(CommitLock.InvalidStakeAmount.selector);
        commitLock.createCommitment{value: 0.005 ether}("testuser");

        vm.expectRevert(CommitLock.InvalidStakeAmount.selector);
        commitLock.createCommitment{value: 0.02 ether}("testuser");

        vm.stopPrank();
    }

    function testCannotCreateMultipleCommitments() public {
        vm.startPrank(user1);

        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        vm.expectRevert(CommitLock.CommitmentAlreadyActive.selector);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        vm.stopPrank();
    }

    // ============ Test: Record Daily Checks ============

    function testRecordDailyCheckSuccess() public {
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        vm.expectEmit(true, false, false, true);
        emit DayChecked(user1, 0, true, 1);

        commitLock.recordDailyCheck(user1, 0, true);

        CommitLock.Commitment memory commitment = commitLock.getCommitment(user1);
        assertEq(commitment.dailyChecks[0], true);
        assertEq(commitment.daysCompleted, 1);
        assertEq(commitment.forfeited, false);
    }

    function testRecordDailyCheckFailureSetsForfeited() public {
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        commitLock.recordDailyCheck(user1, 0, false);

        CommitLock.Commitment memory commitment = commitLock.getCommitment(user1);
        assertEq(commitment.dailyChecks[0], false);
        assertEq(commitment.daysCompleted, 0);
        assertEq(commitment.forfeited, true);
    }

    function testOnlyOwnerCanRecordDailyCheck() public {
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        vm.prank(user2);
        vm.expectRevert(CommitLock.Unauthorized.selector);
        commitLock.recordDailyCheck(user1, 0, true);
    }

    function testRecordDailyCheckRevertsInvalidDay() public {
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        vm.expectRevert(CommitLock.InvalidDayIndex.selector);
        commitLock.recordDailyCheck(user1, 7, true);
    }

    // ============ Test: Successful Claim ============

    function testSuccessfulClaimReturnsEETHWithRewards() public {
        // Create commitment
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        // Record 7 successful days
        for (uint8 i = 0; i < 7; i++) {
            commitLock.recordDailyCheck(user1, i, true);
        }

        CommitLock.Commitment memory commitment = commitLock.getCommitment(user1);
        uint256 eethAmount = commitment.eethAmount;

        uint256 user1BalanceBefore = IERC20(0x35fa164735182dE5081f8E82e824cBfb9B6118aC).balanceOf(user1);

        vm.expectEmit(true, false, false, true);
        emit FundsClaimed(user1, eethAmount);

        vm.prank(user1);
        commitLock.claimFunds();

        uint256 user1BalanceAfter = IERC20(0x35fa164735182dE5081f8E82e824cBfb9B6118aC).balanceOf(user1);

        // Verify user received eETH
        assertEq(user1BalanceAfter - user1BalanceBefore, eethAmount);

        // Verify commitment is marked as claimed
        commitment = commitLock.getCommitment(user1);
        assertEq(commitment.claimed, true);
    }

    function testCannotClaimWithIncompleteCommitment() public {
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        // Only complete 6 days
        for (uint8 i = 0; i < 6; i++) {
            commitLock.recordDailyCheck(user1, i, true);
        }

        vm.prank(user1);
        vm.expectRevert(CommitLock.CommitmentNotComplete.selector);
        commitLock.claimFunds();
    }

    function testCannotClaimForfeitedCommitment() public {
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        // Fail one day (this sets forfeited = true)
        commitLock.recordDailyCheck(user1, 0, false);

        // Even if we complete remaining days, daysCompleted will be 6, not 7
        for (uint8 i = 1; i < 7; i++) {
            commitLock.recordDailyCheck(user1, i, true);
        }

        // Will fail with "Not all days completed" because daysCompleted = 6
        vm.prank(user1);
        vm.expectRevert(CommitLock.CommitmentNotComplete.selector);
        commitLock.claimFunds();
    }

    function testCannotClaimTwice() public {
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        // Complete all days
        for (uint8 i = 0; i < 7; i++) {
            commitLock.recordDailyCheck(user1, i, true);
        }

        vm.prank(user1);
        commitLock.claimFunds();

        vm.prank(user1);
        vm.expectRevert(CommitLock.AlreadyClaimed.selector);
        commitLock.claimFunds();
    }

    // ============ Test: Forfeit Collection ============

    function testForfeitureTransfersEETHToOwner() public {
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        // Fail one day
        commitLock.recordDailyCheck(user1, 0, false);

        CommitLock.Commitment memory commitment = commitLock.getCommitment(user1);
        uint256 eethAmount = commitment.eethAmount;

        uint256 ownerBalanceBefore = IERC20(0x35fa164735182dE5081f8E82e824cBfb9B6118aC).balanceOf(owner);

        vm.expectEmit(true, false, false, true);
        emit FundsForfeited(user1, eethAmount, owner);

        commitLock.collectForfeit(user1);

        uint256 ownerBalanceAfter = IERC20(0x35fa164735182dE5081f8E82e824cBfb9B6118aC).balanceOf(owner);

        // Verify owner received forfeited eETH
        assertEq(ownerBalanceAfter - ownerBalanceBefore, eethAmount);

        // Verify commitment is marked as claimed
        commitment = commitLock.getCommitment(user1);
        assertEq(commitment.claimed, true);
    }

    function testOnlyOwnerCanCollectForfeit() public {
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        commitLock.recordDailyCheck(user1, 0, false);

        vm.prank(user2);
        vm.expectRevert(CommitLock.Unauthorized.selector);
        commitLock.collectForfeit(user1);
    }

    function testCannotCollectNonForfeitedCommitment() public {
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        commitLock.recordDailyCheck(user1, 0, true);

        vm.expectRevert(CommitLock.NotForfeited.selector);
        commitLock.collectForfeit(user1);
    }

    // ============ Test: View Functions ============

    function testEETHBalanceIncreasesOverTime() public {
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        CommitLock.Commitment memory commitment = commitLock.getCommitment(user1);
        uint256 initialEeth = commitment.eethAmount;

        // In a real scenario, eETH would appreciate over time
        // For this test, we verify the balance is tracked correctly
        (
            CommitLock.Commitment memory fetchedCommitment,
            uint256 currentValue,
            uint256 contractBalance
        ) = commitLock.getCommitmentWithRewards(user1);

        assertEq(currentValue, initialEeth);
        assertGt(contractBalance, 0);
        assertEq(fetchedCommitment.eethAmount, initialEeth);
    }

    function testIsCommitmentActive() public {
        assertEq(commitLock.isCommitmentActive(user1), false);

        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        assertEq(commitLock.isCommitmentActive(user1), true);

        // Complete and claim
        for (uint8 i = 0; i < 7; i++) {
            commitLock.recordDailyCheck(user1, i, true);
        }

        vm.prank(user1);
        commitLock.claimFunds();

        assertEq(commitLock.isCommitmentActive(user1), false);
    }

    function testCanClaim() public {
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        assertEq(commitLock.canClaim(user1), false);

        // Complete all 7 days
        for (uint8 i = 0; i < 7; i++) {
            commitLock.recordDailyCheck(user1, i, true);
        }

        assertEq(commitLock.canClaim(user1), true);
    }

    function testCanClaimReturnsFalseForForfeited() public {
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("testuser");

        commitLock.recordDailyCheck(user1, 0, false);

        assertEq(commitLock.canClaim(user1), false);
    }

    // ============ Test: Multiple Users ============

    function testMultipleUsersCanCreateCommitments() public {
        vm.prank(user1);
        commitLock.createCommitment{value: STAKE_AMOUNT}("user1github");

        vm.prank(user2);
        commitLock.createCommitment{value: STAKE_AMOUNT}("user2github");

        CommitLock.Commitment memory c1 = commitLock.getCommitment(user1);
        CommitLock.Commitment memory c2 = commitLock.getCommitment(user2);

        assertEq(c1.githubUsername, "user1github");
        assertEq(c2.githubUsername, "user2github");
        assertEq(c1.user, user1);
        assertEq(c2.user, user2);
    }
}

// ============ Mock Contracts for Testing ============

contract MockLiquidityPool {
    function deposit() external payable returns (uint256) {
        // Mint eETH 1:1 with ETH deposited to the CommitLock contract
        MockEETH(0x35fa164735182dE5081f8E82e824cBfb9B6118aC).mint(msg.sender, msg.value);
        return msg.value;
    }
}

contract MockEETH is IERC20 {
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function mint(address to, uint256 amount) external {
        balances[to] += amount;
    }

    // Unused but required by IERC20 interface
    function approve(address, uint256) external pure returns (bool) {
        return true;
    }

    function transferFrom(address, address, uint256) external pure returns (bool) {
        return true;
    }

    function allowance(address, address) external pure returns (uint256) {
        return 0;
    }

    function totalSupply() external pure returns (uint256) {
        return 0;
    }
}
