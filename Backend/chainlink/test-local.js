/**
 * Local Testing Script for Chainlink Function
 *
 * This simulates the Chainlink Functions environment locally
 * so you can test the GitHub API integration without deploying.
 *
 * Usage: node test-local.js [username] [dayIndex] [startTimestamp]
 */

const https = require('https');

// ============ Mock Chainlink Functions Environment ============

const Functions = {
  makeHttpRequest: async ({ url, headers }) => {
    return new Promise((resolve, reject) => {
      https.get(url, { headers }, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({ data: jsonData });
          } catch (error) {
            reject({ error: true, message: 'Failed to parse JSON' });
          }
        });
      }).on('error', (error) => {
        reject({ error: true, message: error.message });
      });
    });
  },

  encodeUint256: (value) => {
    return Buffer.from(value.toString().padStart(64, '0'), 'hex');
  }
};

// ============ Parse Command Line Args ============

const args = process.argv.slice(2);

// Default test values
const username = args[0] || "octocat"; // GitHub's test account
const dayIndex = args[1] || "0";
const commitmentStartMs = args[2] || Date.now().toString();

console.log("====================================");
console.log("Testing Chainlink Function Locally");
console.log("====================================");
console.log(`Username: ${username}`);
console.log(`Day Index: ${dayIndex}`);
console.log(`Start Time: ${new Date(parseInt(commitmentStartMs)).toISOString()}`);
console.log("====================================\n");

// ============ Run the Function ============

(async () => {
  try {
    // This is the actual Chainlink Function code
    const checkCommit = async (args) => {
      const username = args[0];
      const dayIndex = parseInt(args[1]);
      const commitmentStartMs = parseInt(args[2]);

      if (!username || username.length === 0) {
        throw Error("GitHub username is required");
      }
      if (dayIndex < 0 || dayIndex > 6) {
        throw Error("Day index must be between 0 and 6");
      }
      if (!commitmentStartMs || commitmentStartMs <= 0) {
        throw Error("Invalid commitment start timestamp");
      }

      const commitmentStart = new Date(commitmentStartMs);
      const targetDate = new Date(commitmentStart.getTime() + (dayIndex * 24 * 60 * 60 * 1000));

      console.log(`→ Checking GitHub user: ${username}`);
      console.log(`→ Day index: ${dayIndex}`);
      console.log(`→ Target date: ${targetDate.toISOString()}`);
      console.log(`→ Target date (readable): ${targetDate.toDateString()}\n`);

      const githubApiUrl = `https://api.github.com/users/${username}/events`;

      console.log(`→ Fetching from GitHub API...`);
      const githubResponse = await Functions.makeHttpRequest({
        url: githubApiUrl,
        headers: {
          "User-Agent": "Chainlink-Functions-CommitLock-Test"
        }
      });

      if (githubResponse.error) {
        console.error("✗ GitHub API error:", githubResponse.error);
        throw Error(`Failed to fetch GitHub events: ${githubResponse.message}`);
      }

      const events = githubResponse.data;

      if (!Array.isArray(events)) {
        throw Error("Invalid response from GitHub API");
      }

      console.log(`✓ Fetched ${events.length} recent events\n`);

      // Show all PushEvents found
      const allPushEvents = events.filter(e => e.type === "PushEvent");
      console.log(`→ Found ${allPushEvents.length} total PushEvents:`);
      allPushEvents.slice(0, 5).forEach(event => {
        const eventDate = new Date(event.created_at);
        console.log(`  - ${eventDate.toISOString()} (${eventDate.toDateString()}) - ${event.repo.name}`);
      });
      if (allPushEvents.length > 5) {
        console.log(`  ... and ${allPushEvents.length - 5} more`);
      }
      console.log();

      const commitsOnTargetDate = events.filter(event => {
        if (event.type !== "PushEvent") {
          return false;
        }

        const eventDate = new Date(event.created_at);
        const eventDateString = eventDate.toDateString();
        const targetDateString = targetDate.toDateString();

        return eventDateString === targetDateString;
      });

      console.log(`→ Commits on ${targetDate.toDateString()}: ${commitsOnTargetDate.length}`);

      if (commitsOnTargetDate.length > 0) {
        console.log(`\n✓ Commits found on target date:`);
        commitsOnTargetDate.forEach(event => {
          const eventDate = new Date(event.created_at);
          const commitCount = event.payload?.commits?.length || 0;
          console.log(`  - ${eventDate.toISOString()} - ${event.repo.name} (${commitCount} commits)`);
        });
      } else {
        console.log(`\n✗ No commits found on target date`);
      }

      const hasCommitted = commitsOnTargetDate.length > 0;
      const result = hasCommitted ? 1 : 0;

      console.log(`\n====================================`);
      console.log(`Result: ${result}`);
      console.log(`Status: ${hasCommitted ? "✓ SUCCESS - User committed" : "✗ FAILURE - No commits"}`);
      console.log(`====================================\n`);

      return Functions.encodeUint256(result);
    };

    // Run the function
    await checkCommit([username, dayIndex, commitmentStartMs]);

  } catch (error) {
    console.error("\n✗ ERROR:", error.message);
    console.error(error);
    process.exit(1);
  }
})();
