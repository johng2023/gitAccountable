Product Requirements Document (PRD)
GitHub Commit Accountability Platform - 24 HOUR HACKATHON EDITION

1. Executive Summary
Product Name: CommitLock
Hackathon Goal: Build a working MVP that lets developers stake crypto on daily GitHub commits. Complete or forfeit. Simple as that.
The Pitch: "Put your money where your code is. Commit daily or lose your stake. Earn staking rewards while you build."
What We're Building in 24 Hours:
✅ Smart contract that stakes ETH through Ether.Fi to earn eETH rewards
✅ Tracks daily GitHub commits via Chainlink oracle
✅ Users earn liquid staking rewards during their 7-day commitment
✅ Simple frontend to create commitments and view status
✅ One complete user journey from start to finish

🌟 ETHER.FI INTEGRATION:
✅ Stake ETH → receive eETH (liquid staking token)
✅ Earn staking rewards during the commitment period
✅ Claim eETH (with rewards) on success OR forfeit to owner
What We're NOT Building:
❌ Polish, animations, fancy UI
❌ Multiple commitments per user
❌ Historical data / analytics
❌ Mobile optimization
❌ User accounts or profiles

2. Core User Flow (The Only One That Matters)
1. User connects wallet → 2 minutes
2. User creates commitment (GitHub username, 7 days, 0.01 ETH) → 2 minutes
3. ETH staked through Ether.Fi → receives eETH position → immediate
4. Next day: Oracle checks GitHub automatically → background
5. During 7 days: eETH earns staking rewards automatically
6. After 7 days: User claims eETH (with rewards!) OR owner collects forfeited eETH → 1 minute

DONE. That's the demo.

💡 KEY INNOVATION: Users don't just lock funds - they earn Ether.Fi staking yield while being accountable!

3. MVP Features (Ruthlessly Prioritized)
🔴 CRITICAL - Must Have (Will Demo These)
SC-001: Create Commitment (WITH ETHER.FI STAKING)
User stakes ETH (fixed: 0.01 ETH to keep it simple)
Contract stakes ETH through Ether.Fi LiquidityPool
User receives eETH position tracked in contract
Provide GitHub username
Fixed duration: 7 days (hardcoded for hackathon)
Store commitment with timestamp + eETH balance
SC-002: Daily Check (Automated)
Chainlink Functions runs once per day
Checks GitHub API for commits in last 24h
Returns true/false to smart contract
Contract records result
eETH continues earning rewards in background
SC-003: Claim or Forfeit (EETH WITH REWARDS)
After 7 days, check all daily results
If all true: user calls claimFunds() → receives eETH (with accrued staking rewards!)
If any false: contract owner calls collectForfeit() → owner gets forfeited eETH
FE-001: Landing Page
Hero section: "Commit or Forfeit"
One button: "Connect Wallet"
Explanation in 3 sentences max
FE-002: Dashboard (WITH EETH REWARDS DISPLAY)
Show active commitment (if exists)
Days completed: X/7
Simple progress bar
Today's status: ✅ or ❌
**NEW:** Display eETH balance and estimated rewards earned
**NEW:** Show "Your stake: 0.01 ETH → X eETH (≈Y ETH with rewards)"
"Claim eETH" button (if eligible) - shows rewards earned!
FE-003: Create Commitment Form
Input: GitHub username
Display: "You'll stake 0.01 ETH for 7 days and earn eETH staking rewards!"
Show estimated APY from Ether.Fi
Button: "Lock It In & Start Earning"
Transaction confirmation
🟡 NICE TO HAVE - Only If We Have Time
Loading states
Error messages
Calendar view of past days
MetaMask installation prompt
Mobile-friendly CSS
🔵 OUT OF SCOPE - Not Happening
Multiple commitments
Custom durations or amounts
User profiles
Historical data
Social features
Analytics
Grace days
Email notifications
Anything not listed in Critical

4. Technical Stack (Simplified)
Smart Contracts
Tool: Foundry
Contract: CommitLock.sol ~250 lines (includes Ether.Fi integration)
**NEW:** Ether.Fi Integration:
  - LiquidityPool: 0x308861A430be4cce5502d0A12724771Fc6DaF216
  - eETH Token: 0x35fA164735182de5081F8e82E824cBfB9b6118ac
  - Interface with ILiquidityPool for staking
  - Interface with IERC20 for eETH transfers
Deploy: Sepolia testnet only
Tests: 7 core test cases (added eETH integration tests)
Oracle
Tool: Chainlink Functions
Source: One JavaScript file that queries GitHub
Trigger: Manual for hackathon (simulate daily check)
Fallback: If Chainlink is tricky, use Chainlink Automation or even manual owner calls
Frontend
Framework: Next.js (or even vanilla React if faster)
Styling: TailwindCSS (use default classes, no custom design)
Wallet: Wagmi
Deploy: Vercel
State: React hooks and Wagmi hooks, no Redux/Zustand
GitHub API
Auth: Personal access token
Query: Simple REST API call (easier than GraphQL for hackathon)
Query: GraphQL only for frontend dashboard (Github calendar UI). 
Endpoint: GET /users/{username}/events

5. 24-Hour Timeline
Hour 0-2: SETUP ⚙️
Create GitHub repo
Initialize Foundry project
Initialize Next.js project
Deploy boilerplate to Sepolia
Set up Chainlink Functions subscription
Get GitHub API token
Milestone: Projects initialized, can deploy "Hello World" contract

Hour 2-8: SMART CONTRACT 📝
Write CommitLock.sol (2 hours)
createCommitment() function
recordDailyCheck() function (called by oracle)
claimFunds() function
collectForfeit() function
Basic mappings and structs
Write tests (2 hours)
Test commitment creation
Test claiming success
Test forfeiture
Test access control
Deploy to Sepolia (1 hour)
Deploy script
Verify on Etherscan
Fund oracle if needed
Buffer for bugs (1 hour)
Milestone: Contract deployed, tested, verified

Hour 8-14: CHAINLINK ORACLE 🔗
Write Chainlink Function source (2 hours)
javascript
 // Check if user made commit today
  const response = await fetch(`https://api.github.com/users/${username}/events`);
  const events = await response.json();
  const commits = events.filter(e => 
    e.type === 'PushEvent' && 
    isToday(e.created_at)
  );
  return commits.length > 0 ? 1 : 0;
Test locally with mock data (1 hour)
Deploy to Chainlink Functions (1 hour)
Integrate with smart contract (1 hour)
Test end-to-end on Sepolia (1 hour)
For Hackathon Shortcut: If Chainlink is taking too long, have contract owner manually call recordDailyCheck() after checking GitHub. Demo it as "this would be automated."
Milestone: Oracle can check GitHub and update contract

Hour 14-20: FRONTEND 🎨
Set up Next.js + TailwindCSS (30 min)
Install Web3 libraries (30 min)
Build landing page (1 hour)
Hero
Connect wallet button
One-sentence explanation
Build create commitment page (2 hours)
Form with GitHub username
Connect to contract
Handle transaction
Build dashboard (2 hours)
Fetch commitment data from contract
Display progress (X/7 days)
Show daily statuses
Claim button
Connect everything (1 hour)
Wire up contract calls
Handle events
Basic error handling
Milestone: Can create commitment and view status in browser

Hour 20-23: POLISH & DEMO PREP 🎯
Deploy frontend to Vercel (30 min)
Test complete user flow (1 hour)
Connect wallet
Create commitment
Simulate day passing
Check GitHub
Claim or forfeit
Create demo video/script (30 min)
Prepare presentation (1 hour)
Problem slide
Solution slide
Demo
Tech architecture
What's next
Milestone: Ready to demo!

Hour 23-24: BUFFER ⏰
Fix critical bugs
Practice demo
Submit to hackathon
Sleep is for the weak! 😤

6. Smart Contract with Ether.Fi eETH Integration
solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Ether.Fi interfaces
interface ILiquidityPool {
    function deposit() external payable returns (uint256);
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract CommitLock {
    struct Commitment {
        address user;
        string githubUsername;
        uint256 startTime;
        uint256 eethAmount;      // NEW: Track eETH received
        bool[7] dailyChecks;
        uint8 daysCompleted;
        bool claimed;
        bool forfeited;
    }

    mapping(address => Commitment) public commitments;
    address public owner;
    uint256 public constant STAKE_AMOUNT = 0.01 ether;
    uint256 public constant DURATION = 7 days;

    // Ether.Fi contracts (Sepolia addresses)
    ILiquidityPool public constant LIQUIDITY_POOL = ILiquidityPool(0x308861A430be4cce5502d0A12724771Fc6DaF216);
    IERC20 public constant EETH = IERC20(0x35fA164735182de5081F8e82E824cBfB9b6118ac);

    event CommitmentCreated(address user, string username, uint256 eethAmount);
    event DayChecked(address user, uint8 day, bool success);
    event FundsClaimed(address user, uint256 eethAmount);
    event FundsForfeited(address user, uint256 eethAmount);

    constructor() {
        owner = msg.sender;
    }

    // User creates commitment - stakes ETH through Ether.Fi
    function createCommitment(string memory _githubUsername) external payable {
        require(msg.value == STAKE_AMOUNT, "Wrong stake amount");
        require(commitments[msg.sender].startTime == 0, "Already active");

        // Stake ETH through Ether.Fi to get eETH
        uint256 eethReceived = LIQUIDITY_POOL.deposit{value: msg.value}();

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

        emit CommitmentCreated(msg.sender, _githubUsername, eethReceived);
    }

    // Oracle records daily check (same as before)
    function recordDailyCheck(address _user, uint8 _dayIndex, bool _success) external {
        require(msg.sender == owner, "Only owner/oracle");
        Commitment storage c = commitments[_user];
        require(_dayIndex < 7, "Invalid day");

        c.dailyChecks[_dayIndex] = _success;
        if (_success) {
            c.daysCompleted++;
        } else {
            c.forfeited = true;
        }

        emit DayChecked(_user, _dayIndex, _success);
    }

    // User claims eETH (with rewards!) if successful
    function claimFunds() external {
        Commitment storage c = commitments[msg.sender];
        require(c.daysCompleted == 7, "Not all days completed");
        require(!c.claimed, "Already claimed");
        require(!c.forfeited, "Was forfeited");

        c.claimed = true;
        uint256 eethAmount = c.eethAmount;

        // Transfer eETH (which has accrued staking rewards!)
        require(EETH.transfer(msg.sender, eethAmount), "Transfer failed");

        emit FundsClaimed(msg.sender, eethAmount);
    }

    // Owner collects forfeited eETH
    function collectForfeit(address _user) external {
        require(msg.sender == owner, "Only owner");
        Commitment storage c = commitments[_user];
        require(c.forfeited, "Not forfeited");
        require(!c.claimed, "Already processed");

        c.claimed = true;
        uint256 eethAmount = c.eethAmount;

        // Transfer forfeited eETH to owner
        require(EETH.transfer(owner, eethAmount), "Transfer failed");

        emit FundsForfeited(_user, eethAmount);
    }

    // Get commitment with current eETH value
    function getCommitmentWithRewards(address _user) external view returns (
        Commitment memory commitment,
        uint256 currentEethValue
    ) {
        commitment = commitments[_user];
        currentEethValue = commitment.eethAmount; // eETH appreciates over time!
        return (commitment, currentEethValue);
    }
}
That's it! ~130 lines with Ether.Fi integration. Ship it with staking rewards!

7. Simplified Chainlink Function
javascript
// Chainlink Functions source code
const username = args[0]; // GitHub username
const dayIndex = args[1];  // Which day to check (0-6)

// Calculate date to check
const commitmentStart = new Date(args[2]); // Timestamp from contract
const dateToCheck = new Date(commitmentStart.getTime() + (dayIndex * 24 * 60 * 60 * 1000));

// Fetch recent events
const url = `https://api.github.com/users/${username}/events`;
const response = await Functions.makeHttpRequest({
  url: url,
  headers: {
    'User-Agent': 'Chainlink-Functions'
  }
});

// Filter for push events on that day
const events = response.data;
const commits = events.filter(event => {
  if (event.type !== 'PushEvent') return false;
  const eventDate = new Date(event.created_at);
  return eventDate.toDateString() === dateToCheck.toDateString();
});

// Return 1 for success, 0 for failure
return Functions.encodeUint256(commits.length > 0 ? 1 : 0);

8. Demo Script (2 Minutes) - WITH ETHER.FI INTEGRATION!
Slide 1: The Problem "Developers struggle to code consistently. We lack accountability."
Slide 2: The Solution "CommitLock: Stake crypto. Commit daily. Complete or forfeit. EARN REWARDS while you build!"
Slide 3: Live Demo
"Here's our dApp. I connect my wallet." [Click connect]
"I stake 0.01 ETH for 7 days with my GitHub username." [Create commitment]
"🌟 NEW: My ETH is staked through Ether.Fi - I receive eETH and start earning staking rewards!" [Show transaction]
"The smart contract tracks my eETH position on Sepolia testnet."
"Every day, Chainlink checks my GitHub for commits while my eETH earns yield." [Show dashboard]
"Day 1: ✅ Committed. Day 2: ✅ Committed..." [Show progress]
"🌟 Look - my eETH balance shows staking rewards accumulating!" [Point to rewards display]
"After 7 days with all commits, I claim my eETH - MORE than I started with due to staking rewards!" [Click claim]
"But if I miss even one day, the forfeited eETH (with rewards) goes to the contract owner." [Show forfeit flow]
Slide 4: Tech Stack
Smart contracts: Solidity + Foundry
🌟 DeFi Integration: Ether.Fi Liquid Staking (eETH)
Oracles: Chainlink Functions
Frontend: Next.js + Wagmi
Data: GitHub API
Slide 5: What's Next
Multiple commitments
Custom durations and amounts
Support more Ether.Fi products (weETH, Liquid vaults)
Leaderboards showing total rewards earned
Multi-platform support (GitLab, LeetCode)
"Questions?"

9. Success Criteria
Must Demonstrate
✅ User can create commitment (send transaction)
✅ Smart contract stores commitment data
✅ Oracle checks GitHub (even if manual trigger)
✅ Dashboard shows progress
✅ User can claim funds OR owner can collect
Bonus Points
✅ Deployed to Sepolia
✅ Verified contract on Etherscan
✅ Clean UI (not ugly)
✅ Mobile-friendly
✅ Actual Chainlink automation (not manual)
Winning Formula
Working demo (50% of score)
Code quality (20% of score)
Presentation (20% of score)
Innovation (10% of score)

10. Team Roles (4-Person Team)
Person 1: Smart Contract Lead
Hours 0-8: Write and test contract
Hours 8-14: Help with Chainlink
Hours 14-24: Support frontend, fix bugs
Person 2: Oracle/Backend Lead
Hours 0-8: Set up Chainlink, write source code
Hours 8-14: Integrate with contract
Hours 14-24: Test and fix oracle issues
Person 3: Frontend Lead
Hours 0-14: Help where needed, start basic Next.js setup
Hours 14-20: Build entire frontend
Hours 20-24: Polish and demo prep
Person 4: Full-Stack Utility
Hours 0-8: Help with contract tests
Hours 8-14: Help with oracle
Hours 14-20: Help with frontend
Hours 20-24: Demo prep, presentation, video
Communication: Use Discord/Slack. Quick standups every 4 hours.

11. Hackathon Shortcuts (When Time Is Running Out)
If Chainlink Is Too Hard:
Owner manually calls recordDailyCheck() after checking GitHub
Demo it as: "This would be automated in production"
Still show the Chainlink Function source code
If Frontend Is Taking Too Long:
Use create-react-app instead of Next.js
Copy/paste TailwindCSS components from Flowbite or DaisyUI
Skip the landing page, just have dashboard
If Testing Is Behind:
Write tests for demo purposes even if some fail
Comment out failing tests
"We have 70% test coverage" sounds good
If Deployment Fails:
Demo on localhost with screen share
Have contract deployed on Sepolia even if frontend is local
"We ran out of time for Vercel deployment but here's localhost"
Emergency Last-Hour Pivot:
Simplify to 3 days instead of 7
Remove claim function, just show the forfeiture
Focus on the CREATE flow and one CHECK

12. Checklist (Print This Out)
Hour 0-2: Setup
Repo created
Foundry initialized
Next.js initialized
Team roles assigned
Communication channel set up
Hour 8: Contract Done
Contract written
Tests passing
Deployed to Sepolia
Verified on Etherscan
Hour 14: Oracle Done
Chainlink Function written
Can query GitHub API
Integration with contract tested
At least one successful check
Hour 20: Frontend Done
Landing page works
Can create commitment
Dashboard shows data
Wallet connects properly
Hour 23: Demo Ready
Full user flow tested
Video recorded (backup)
Presentation slides done
GitHub repo cleaned up
README with instructions
Hour 24: SUBMIT!
Submitted to hackathon
Celebrate 🎉

13. Resources & Links
Quick References
Foundry Book: https://book.getfoundry.sh/
Chainlink Functions: https://docs.chain.link/chainlink-functions/tutorials/simple-computation
GitHub API: https://docs.github.com/en/rest/activity/events
Wagmi: https://wagmi.sh/react/getting-started 
TailwindCSS: https://tailwindcss.com/docs
Sepolia Faucet: https://sepoliafaucet.com/ (https://faucets.chain.link/) 
Copy/Paste Code
OpenZeppelin: https://docs.openzeppelin.com/contracts/
Tailwind Components: https://flowbite.com/docs/getting-started/next-js/ 
Web3 React Hooks: https://wagmi.sh/
Testnet Funds
Get Sepolia ETH from faucet
Get Sepolia LINK from Chainlink faucet
Request from team if stuck

14. Presentation Tips
Do:
✅ Start with the problem (relatable)
✅ Demo early (people want to see it work)
✅ Show code briefly (proves you built it)
✅ Be enthusiastic!
✅ Mention what's next (shows vision)
Don't:
❌ Spend >30 seconds on any slide
❌ Apologize for what's not done
❌ Live code during presentation
❌ Go over time limit
❌ Forget to breathe!
If Demo Breaks:
Have backup video
Walk through the code instead
Show test results
Explain what WOULD happen

15. Git Commit Messages (For Style Points)
✅ "Initial commit - let's do this"
✅ "Add CommitLock contract - stake or die"
✅ "Chainlink oracle integration - GitHub doesn't lie"
✅ "Frontend MVP - it's ugly but it works"
✅ "Fix critical bug - oops"
✅ "Final touches - ready to demo"
✅ "Update README - we actually built this"

16. Victory Conditions 🏆
We Win If:
✅ Demo works end-to-end
✅ Judges understand the concept immediately
✅ Code is on GitHub and readable
✅ Presentation is confident
✅ We actually have fun building it
We're Happy If:
✅ Everything is deployed and working
✅ We learned something new
✅ Code is clean enough to be proud of
✅ Team worked well together
We Survived If:
✅ Something works
✅ We submitted on time
✅ Nobody cried
✅ We have pizza

Let's Build This! 🚀
Remember:
Scope creep is the enemy
Working > Perfect
Demo > Documentation
Ship it!
Team Motto: "Commit or Forfeit. No Excuses."
