/**
 * Smart Contract Configuration
 *
 * Update COMMIT_LOCK_ADDRESS after deployment
 */

export const COMMIT_LOCK_ADDRESS = import.meta.env.VITE_COMMIT_LOCK_ADDRESS || '0x0000000000000000000000000000000000000000';

export const COMMIT_LOCK_ABI = [
  // Read Functions
  {
    "type": "function",
    "name": "getCommitment",
    "stateMutability": "view",
    "inputs": [{"name": "_user", "type": "address"}],
    "outputs": [{
      "name": "commitment",
      "type": "tuple",
      "components": [
        {"name": "user", "type": "address"},
        {"name": "githubUsername", "type": "string"},
        {"name": "startTime", "type": "uint256"},
        {"name": "eethAmount", "type": "uint256"},
        {"name": "dailyChecks", "type": "bool[7]"},
        {"name": "daysCompleted", "type": "uint8"},
        {"name": "claimed", "type": "bool"},
        {"name": "forfeited", "type": "bool"}
      ]
    }]
  },
  {
    "type": "function",
    "name": "getCommitmentWithRewards",
    "stateMutability": "view",
    "inputs": [{"name": "_user", "type": "address"}],
    "outputs": [
      {
        "name": "commitment",
        "type": "tuple",
        "components": [
          {"name": "user", "type": "address"},
          {"name": "githubUsername", "type": "string"},
          {"name": "startTime", "type": "uint256"},
          {"name": "eethAmount", "type": "uint256"},
          {"name": "dailyChecks", "type": "bool[7]"},
          {"name": "daysCompleted", "type": "uint8"},
          {"name": "claimed", "type": "bool"},
          {"name": "forfeited", "type": "bool"}
        ]
      },
      {"name": "currentEethValue", "type": "uint256"},
      {"name": "contractEethBalance", "type": "uint256"}
    ]
  },
  {
    "type": "function",
    "name": "isCommitmentActive",
    "stateMutability": "view",
    "inputs": [{"name": "_user", "type": "address"}],
    "outputs": [{"name": "", "type": "bool"}]
  },
  {
    "type": "function",
    "name": "canClaim",
    "stateMutability": "view",
    "inputs": [{"name": "_user", "type": "address"}],
    "outputs": [{"name": "", "type": "bool"}]
  },
  {
    "type": "function",
    "name": "STAKE_AMOUNT",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256"}]
  },
  {
    "type": "function",
    "name": "DURATION",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256"}]
  },
  {
    "type": "function",
    "name": "owner",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{"name": "", "type": "address"}]
  },
  // Write Functions
  {
    "type": "function",
    "name": "createCommitment",
    "stateMutability": "payable",
    "inputs": [{"name": "_githubUsername", "type": "string"}],
    "outputs": []
  },
  {
    "type": "function",
    "name": "claimFunds",
    "stateMutability": "nonpayable",
    "inputs": [],
    "outputs": []
  },
  {
    "type": "function",
    "name": "recordDailyCheck",
    "stateMutability": "nonpayable",
    "inputs": [
      {"name": "_user", "type": "address"},
      {"name": "_dayIndex", "type": "uint8"},
      {"name": "_success", "type": "bool"}
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "collectForfeit",
    "stateMutability": "nonpayable",
    "inputs": [{"name": "_user", "type": "address"}],
    "outputs": []
  },
  // Events
  {
    "type": "event",
    "name": "CommitmentCreated",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "githubUsername", "type": "string", "indexed": false},
      {"name": "ethStaked", "type": "uint256", "indexed": false},
      {"name": "eethReceived", "type": "uint256", "indexed": false},
      {"name": "startTime", "type": "uint256", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "DayChecked",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "dayIndex", "type": "uint8", "indexed": false},
      {"name": "success", "type": "bool", "indexed": false},
      {"name": "totalCompleted", "type": "uint8", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "FundsClaimed",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "eethAmount", "type": "uint256", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "FundsForfeited",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "eethAmount", "type": "uint256", "indexed": false},
      {"name": "owner", "type": "address", "indexed": false}
    ]
  },
  // Errors
  {
    "type": "error",
    "name": "InvalidStakeAmount",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CommitmentAlreadyActive",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NoActiveCommitment",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Unauthorized",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidDayIndex",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CommitmentNotComplete",
    "inputs": []
  },
  {
    "type": "error",
    "name": "AlreadyClaimed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CommitmentForfeited",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotForfeited",
    "inputs": []
  },
  {
    "type": "error",
    "name": "TransferFailed",
    "inputs": []
  }
];

// Ether.Fi contracts on Sepolia
export const ETHER_FI_CONTRACTS = {
  liquidityPool: '0x308861A430be4cce5502d0A12724771Fc6DaF216',
  eeth: '0x35fa164735182dE5081f8E82e824cBfb9B6118aC',
};

// Constants
export const STAKE_AMOUNT = '0.01'; // ETH
export const DURATION_DAYS = 7;
