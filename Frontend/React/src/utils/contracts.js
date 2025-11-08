// Smart contract addresses and ABIs

export const CONTRACTS = {
  eETH: {
    address: '0x0305ea0a4b43a12e3d130448e9b4711932231e83',
    // Minimal ERC20 ABI for approve and transferFrom
    abi: [
      {
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        type: 'function',
        stateMutability: 'nonpayable',
      },
      {
        inputs: [
          { name: 'account', type: 'address' },
          { name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        type: 'function',
        stateMutability: 'view',
      },
      {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        type: 'function',
        stateMutability: 'view',
      },
    ],
  },
  CommitLock: {
    address: process.env.VITE_COMMITLOCK_ADDRESS || '',
    abi: [
      // Will be updated after smart contract deployment
      {
        inputs: [
          { name: '_githubUsername', type: 'string' },
          { name: '_stakeAmount', type: 'uint256' },
        ],
        name: 'createCommitment',
        outputs: [],
        type: 'function',
        stateMutability: 'nonpayable',
      },
    ],
  },
};

export const CHAIN_ID = 11155111; // Sepolia
