/**
 * Chainlink Functions Source Code
 *
 * Purpose: Check if a GitHub user made a commit on a specific day
 *
 * Args:
 *   - args[0]: GitHub username (string)
 *   - args[1]: Day index (0-6) representing which day of the 7-day commitment
 *   - args[2]: Commitment start timestamp (Unix timestamp in milliseconds)
 *
 * Returns:
 *   - 1 (uint256) if user made a commit on that day
 *   - 0 (uint256) if user did NOT make a commit on that day
 *
 * How it works:
 *   1. Calculate the target date to check based on start time + day index
 *   2. Fetch recent GitHub events for the user
 *   3. Filter for PushEvents (commits) on the target date
 *   4. Return 1 if any commits found, 0 otherwise
 */

// ============ Main Function ============

const username = args[0];
const dayIndex = parseInt(args[1]);
const commitmentStartMs = parseInt(args[2]);

// Validate inputs
if (!username || username.length === 0) {
  throw Error("GitHub username is required");
}
if (dayIndex < 0 || dayIndex > 6) {
  throw Error("Day index must be between 0 and 6");
}
if (!commitmentStartMs || commitmentStartMs <= 0) {
  throw Error("Invalid commitment start timestamp");
}

// Calculate the target date to check
// Each day is 24 hours from the commitment start
const commitmentStart = new Date(commitmentStartMs);
const targetDate = new Date(commitmentStart.getTime() + (dayIndex * 24 * 60 * 60 * 1000));

console.log(`Checking GitHub user: ${username}`);
console.log(`Day index: ${dayIndex}`);
console.log(`Target date: ${targetDate.toISOString()}`);

// ============ Fetch GitHub Events ============

const githubApiUrl = `https://api.github.com/users/${username}/events`;

// Make HTTP request to GitHub API
const githubResponse = await Functions.makeHttpRequest({
  url: githubApiUrl,
  headers: {
    "User-Agent": "Chainlink-Functions-CommitLock",
    // Note: GitHub API allows unauthenticated requests with rate limits
    // For production, consider adding authentication:
    // "Authorization": `token ${secrets.GITHUB_TOKEN}`
  }
});

// Check if request was successful
if (githubResponse.error) {
  console.error("GitHub API error:", githubResponse.error);
  throw Error(`Failed to fetch GitHub events: ${githubResponse.message}`);
}

const events = githubResponse.data;

// Validate response
if (!Array.isArray(events)) {
  throw Error("Invalid response from GitHub API");
}

console.log(`Fetched ${events.length} recent events`);

// ============ Filter for Commits on Target Date ============

// Filter events for PushEvents (commits) that occurred on the target date
const commitsOnTargetDate = events.filter(event => {
  // Only consider PushEvents
  if (event.type !== "PushEvent") {
    return false;
  }

  // Parse the event creation time
  const eventDate = new Date(event.created_at);

  // Compare dates (ignore time, just compare year-month-day)
  const eventDateString = eventDate.toDateString();
  const targetDateString = targetDate.toDateString();

  return eventDateString === targetDateString;
});

console.log(`Found ${commitsOnTargetDate.length} commits on ${targetDate.toDateString()}`);

// ============ Return Result ============

// Return 1 if user made at least one commit, 0 otherwise
const hasCommitted = commitsOnTargetDate.length > 0;
const result = hasCommitted ? 1 : 0;

console.log(`Result: ${result} (${hasCommitted ? "SUCCESS" : "FAILURE"})`);

// Encode as uint256 for Solidity
return Functions.encodeUint256(result);
