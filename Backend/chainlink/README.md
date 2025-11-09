# Chainlink Functions Oracle

This directory contains the Chainlink Functions source code that checks GitHub commits for the CommitLock contract.

## Overview

The oracle queries the GitHub REST API to verify if a user made a commit on a specific day of their 7-day commitment.

## Files

- `checkGithubCommit.js` - Main Chainlink Function source code
- `test-local.js` - Local testing script (without Chainlink)
- `consumer-contract.sol` - Optional consumer contract (if needed)
- `config.json` - Chainlink Functions configuration

## How It Works

### Input Arguments

The function receives three arguments from the smart contract:

1. **GitHub Username** (string) - The user's GitHub username
2. **Day Index** (uint8, 0-6) - Which day of the commitment to check
3. **Commitment Start Time** (uint256) - Unix timestamp in milliseconds

### Processing Logic

1. Calculate the target date: `startTime + (dayIndex * 24 hours)`
2. Fetch recent events from GitHub API: `GET /users/{username}/events`
3. Filter for `PushEvent` types (commits)
4. Check if any PushEvents occurred on the target date
5. Return:
   - `1` (success) if commits found
   - `0` (failure) if no commits found

### GitHub API Response

Example PushEvent:
```json
{
  "type": "PushEvent",
  "created_at": "2024-11-08T10:30:00Z",
  "repo": {
    "name": "user/repo"
  },
  "payload": {
    "commits": [
      {
        "sha": "abc123...",
        "message": "Fix bug"
      }
    ]
  }
}
```

## Local Testing

Test the function locally without deploying to Chainlink:

```bash
cd Backend/chainlink
node test-local.js
```

This will simulate the function with test data.

## Deployment to Chainlink Functions

### Prerequisites

1. **LINK Token** on Sepolia testnet
2. **Chainlink Functions Subscription**
3. **DON (Decentralized Oracle Network)** access

### Steps

1. **Create Subscription**

Visit [Chainlink Functions UI](https://functions.chain.link/) and create a subscription on Sepolia.

2. **Fund Subscription with LINK**

```bash
# Get LINK from faucet
# https://faucets.chain.link/sepolia

# Fund your subscription (minimum 5 LINK recommended)
```

3. **Upload Source Code**

The source code in `checkGithubCommit.js` needs to be uploaded to the Chainlink DON.

Using Chainlink Functions Toolkit:

```bash
npm install @chainlink/functions-toolkit

npx hardhat functions-upload-source \
  --network sepolia \
  --source-path ./checkGithubCommit.js
```

Or use the Chainlink Functions UI to paste the code directly.

4. **Configure Consumer**

Add your CommitLock contract address as a consumer to the subscription:

```bash
npx hardhat functions-sub-add \
  --subid YOUR_SUBSCRIPTION_ID \
  --contract YOUR_COMMITLOCK_ADDRESS \
  --network sepolia
```

5. **Test Request**

Send a test request:

```bash
npx hardhat functions-request \
  --network sepolia \
  --contract YOUR_COMMITLOCK_ADDRESS \
  --subid YOUR_SUBSCRIPTION_ID \
  --args '["github_username", "0", "1699459200000"]'
```

## Integration with CommitLock Contract

### Option 1: Direct Integration (Recommended for MVP)

The CommitLock contract owner manually triggers Chainlink requests:

```solidity
// In CommitLock.sol, add Chainlink Functions client
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";

contract CommitLock is FunctionsClient {
    // ... existing code ...

    // Function to request GitHub check from Chainlink
    function requestGitHubCheck(address _user, uint8 _dayIndex) external onlyOwner {
        // Build args
        string[] memory args = new string[](3);
        args[0] = commitments[_user].githubUsername;
        args[1] = Strings.toString(_dayIndex);
        args[2] = Strings.toString(commitments[_user].startTime);

        // Send request to Chainlink DON
        _sendRequest(args, subscriptionId, gasLimit, donId);
    }

    // Callback from Chainlink
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        // Decode response (1 or 0)
        uint256 result = abi.decode(response, (uint256));
        bool success = result == 1;

        // Record the result
        recordDailyCheck(requestUser, requestDayIndex, success);
    }
}
```

### Option 2: Automation with Chainlink Automation

Set up Chainlink Automation to automatically trigger checks daily:

```solidity
contract CommitLockAutomation {
    function checkUpkeep(bytes calldata) external view returns (bool upkeepNeeded, bytes memory performData) {
        // Check if any commitments need daily checks
        // Return true if check needed
    }

    function performUpkeep(bytes calldata performData) external {
        // Trigger Chainlink Functions request for users needing checks
    }
}
```

## Rate Limits & Considerations

### GitHub API Rate Limits

- **Unauthenticated**: 60 requests/hour per IP
- **Authenticated**: 5,000 requests/hour

For production, add GitHub token to secrets:

```javascript
const githubResponse = await Functions.makeHttpRequest({
  url: githubApiUrl,
  headers: {
    "Authorization": `token ${secrets.GITHUB_TOKEN}`
  }
});
```

### Chainlink Functions Limits

- **Max execution time**: 10 seconds
- **Max response size**: 256 bytes
- **Gas limit**: Configurable (typical: 300,000)

## Hackathon Shortcuts

### Manual Oracle (Fallback)

If Chainlink setup is too complex, use manual owner calls:

```bash
# Owner checks GitHub manually and calls contract
cast send $CONTRACT_ADDRESS \
  "recordDailyCheck(address,uint8,bool)" \
  $USER_ADDRESS \
  0 \
  true \
  --private-key $PRIVATE_KEY \
  --rpc-url $SEPOLIA_RPC_URL
```

Demo script:
```
1. Show GitHub commit (screenshot)
2. Call recordDailyCheck() manually
3. Explain: "In production, Chainlink Functions would do this automatically"
```

## Debugging

### View Logs

Chainlink Functions logs are available in the Chainlink Functions UI.

### Test with Mock Data

```javascript
// test-local.js
const args = ["octocat", "0", Date.now().toString()];
// ... run function locally
```

### Common Issues

1. **User not found**: Check GitHub username spelling
2. **No events returned**: User might have no recent activity
3. **Date mismatch**: Verify timezone handling and date parsing
4. **Rate limit**: Use authenticated requests for production

## Resources

- [Chainlink Functions Documentation](https://docs.chain.link/chainlink-functions)
- [Chainlink Functions Toolkit](https://github.com/smartcontractkit/functions-toolkit)
- [GitHub API Events](https://docs.github.com/en/rest/activity/events)
- [Chainlink Functions UI](https://functions.chain.link/)

## Security Considerations

- ✅ Validates all inputs
- ✅ Handles API errors gracefully
- ✅ Uses try/catch for robust error handling
- ⚠️ GitHub API rate limits (use authenticated requests)
- ⚠️ Timezone considerations (uses UTC)
- ⚠️ Oracle centralization (single DON in MVP)

## Future Enhancements

- [ ] Support for private repositories (requires GitHub OAuth)
- [ ] Aggregate commit count (not just binary yes/no)
- [ ] Multi-platform support (GitLab, Bitbucket)
- [ ] Decentralized oracle network with multiple sources
- [ ] Grace period mechanism (e.g., commits within 25 hours)
