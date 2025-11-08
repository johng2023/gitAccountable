# GitAccountable Frontend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a three-page React frontend (Landing, Create Commitment, Dashboard) with Wagmi wallet integration, GitHub OAuth, and mock API calls for a 24-hour hackathon MVP.

**Architecture:** Component-first approach using reusable UI components, Wagmi hooks for Web3 integration, React Router for page navigation, and React Context for state management. Pages are wired together through a root App component with React Router. Mock API layer allows independent frontend development while backend is built separately.

**Tech Stack:** React 19, Vite, Wagmi, RainbowKit, React Router v6, TailwindCSS 4, ethers.js, Sepolia testnet

---

## Setup Phase

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Add dependencies to package.json**

Open `package.json` and update the dependencies section. Replace the entire dependencies object with:

```json
"dependencies": {
  "@rainbow-me/rainbowkit": "^2.1.5",
  "@tanstack/react-router": "^1.50.0",
  "ethers": "^6.13.0",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "tailwindcss": "^4.1.17",
  "@tailwindcss/vite": "^4.1.17",
  "wagmi": "^2.12.10",
  "viem": "^2.21.16"
}
```

Keep all devDependencies as they are.

**Step 2: Install packages**

Run: `npm install`
Expected: All packages install without errors, takes 1-2 minutes.

**Step 3: Verify installation**

Run: `npm list wagmi rainbowkit ethers`
Expected: Shows version numbers for all three packages.

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add wagmi, rainbowkit, ethers, react-router dependencies"
```

---

### Task 2: Create Directory Structure

**Files:**
- Create directories (no files yet)

**Step 1: Create all required directories**

Run these commands in sequence:

```bash
mkdir -p src/components/common
mkdir -p src/components/web3
mkdir -p src/components/pages
mkdir -p src/components/layout
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/utils
```

**Step 2: Verify structure**

Run: `find src -type d | sort`
Expected: Shows all 8 directories listed above.

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: create component directory structure"
```

---

### Task 3: Setup Wagmi Configuration

**Files:**
- Create: `src/services/wagmi.js`

**Step 1: Write wagmi configuration**

Create `src/services/wagmi.js`:

```javascript
import { configureChains, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

const { chains, publicClient } = configureChains(
  [sepolia],
  [publicProvider()]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.VITE_WALLETCONNECT_PROJECT_ID || 'test_project_id',
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'GitAccountable',
      },
    }),
  ],
  publicClient,
});

export const SEPOLIA_CHAIN_ID = 11155111;
export const eETH_ADDRESS = '0x0305ea0a4b43a12e3d130448e9b4711932231e83';
export const eETH_DECIMALS = 18;
```

**Step 2: Verify file exists**

Run: `ls -la src/services/wagmi.js`
Expected: File exists with 30+ lines of code.

**Step 3: Commit**

```bash
git add src/services/wagmi.js
git commit -m "feat: configure wagmi for sepolia testnet"
```

---

### Task 4: Create Mock API Service

**Files:**
- Create: `src/services/api.js`

**Step 1: Write mock API functions**

Create `src/services/api.js`:

```javascript
// Mock API service - Replace with real endpoints when backend is ready

export const api = {
  // Mock user data
  mockUsers: {
    '0x1234567890123456789012345678901234567890': {
      walletAddress: '0x1234567890123456789012345678901234567890',
      githubUsername: 'test_user',
      commitments: ['commitment_1'],
    },
  },

  mockCommitments: {
    commitment_1: {
      id: 'commitment_1',
      walletAddress: '0x1234567890123456789012345678901234567890',
      githubUsername: 'test_user',
      stakeAmount: '0.01',
      status: 'active',
      daysComplete: 3,
      daysArray: [
        { day: 1, status: 'complete' },
        { day: 2, status: 'complete' },
        { day: 3, status: 'complete' },
        { day: 4, status: 'pending' },
        { day: 5, status: 'pending' },
        { day: 6, status: 'pending' },
        { day: 7, status: 'pending' },
      ],
      rewards: '0.000061',
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      expiresAt: Date.now() + 4 * 24 * 60 * 60 * 1000,
    },
  },

  // Get user commitment
  getCommitment: async (walletAddress) => {
    const user = api.mockUsers[walletAddress];
    if (!user || !user.commitments.length) {
      return null;
    }
    const commitmentId = user.commitments[0];
    return api.mockCommitments[commitmentId];
  },

  // Create new commitment
  createCommitment: async (walletAddress, githubUsername, stakeAmount) => {
    const id = `commitment_${Date.now()}`;
    const commitment = {
      id,
      walletAddress,
      githubUsername,
      stakeAmount,
      status: 'active',
      daysComplete: 0,
      daysArray: Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        status: 'pending',
      })),
      rewards: '0',
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    api.mockCommitments[id] = commitment;
    api.mockUsers[walletAddress] = {
      walletAddress,
      githubUsername,
      commitments: [id],
    };
    return commitment;
  },

  // Claim rewards
  claimRewards: async (commitmentId) => {
    const commitment = api.mockCommitments[commitmentId];
    if (commitment) {
      commitment.status = 'completed';
      return {
        txHash: '0x' + Math.random().toString(16).slice(2),
        rewards: commitment.rewards,
        totalClaimed: (
          parseFloat(commitment.stakeAmount) + parseFloat(commitment.rewards)
        ).toString(),
      };
    }
    return null;
  },

  // Validate GitHub username
  validateGitHub: async (username) => {
    // Mock validation - just check it's not empty
    if (username && username.length >= 2 && username.length <= 39) {
      return {
        valid: true,
        user: {
          username,
          avatarUrl: `https://avatars.githubusercontent.com/u/1?v=4`,
        },
      };
    }
    return { valid: false, user: null };
  },
};
```

**Step 2: Verify file exists**

Run: `wc -l src/services/api.js`
Expected: 100+ lines of code.

**Step 3: Commit**

```bash
git add src/services/api.js
git commit -m "feat: create mock api service with commitment data"
```

---

### Task 5: Create Utility Files

**Files:**
- Create: `src/utils/colors.js`
- Create: `src/utils/format.js`
- Create: `src/utils/contracts.js`

**Step 1: Create colors.js**

Create `src/utils/colors.js`:

```javascript
export const colors = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#0F172A',
  surface: '#1E293B',
  border: '#334155',
  text: '#F1F5F9',
  muted: '#CBD5E1',
};
```

**Step 2: Create format.js**

Create `src/utils/format.js`:

```javascript
// Format utilities

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEETH = (amount) => {
  const num = parseFloat(amount);
  return num.toFixed(6);
};

export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString();
};

export const calculateRewards = (stakeAmount, daysComplete, apy = 3.2) => {
  const dailyRate = apy / 100 / 365;
  const rewards = parseFloat(stakeAmount) * dailyRate * daysComplete;
  return rewards.toFixed(6);
};
```

**Step 3: Create contracts.js**

Create `src/utils/contracts.js`:

```javascript
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
```

**Step 4: Verify all files exist**

Run: `ls -la src/utils/`
Expected: Shows colors.js, format.js, contracts.js

**Step 5: Commit**

```bash
git add src/utils/
git commit -m "feat: add utility files for colors, formatting, contracts"
```

---

## Component Phase

### Task 6: Create Button Component

**Files:**
- Create: `src/components/common/Button.jsx`

**Step 1: Write Button component**

Create `src/components/common/Button.jsx`:

```javascript
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}) {
  const baseClasses = 'font-semibold rounded transition-all duration-200 cursor-pointer';

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50',
    secondary: 'bg-slate-800 text-blue-400 border border-blue-500 hover:bg-slate-700',
    ghost: 'text-blue-400 hover:underline',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  const finalClass = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClass}
    >
      {children}
    </button>
  );
}
```

**Step 2: Verify component renders**

Run: `npm run dev`
Expected: Dev server starts on localhost:5173

**Step 3: Commit**

```bash
git add src/components/common/Button.jsx
git commit -m "feat: create reusable Button component with variants"
```

---

### Task 7: Create Input Component

**Files:**
- Create: `src/components/common/Input.jsx`

**Step 1: Write Input component**

Create `src/components/common/Input.jsx`:

```javascript
export default function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = null,
  success = false,
  disabled = false,
  className = '',
}) {
  const baseClasses = 'w-full px-4 py-3 rounded border transition-colors duration-200';

  let borderColor = 'border-slate-700 focus:border-blue-500';
  if (error) {
    borderColor = 'border-red-500 focus:border-red-600';
  } else if (success) {
    borderColor = 'border-green-500 focus:border-green-600';
  }

  const finalClass = `${baseClasses} ${borderColor} bg-slate-800 text-white placeholder-slate-500 ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  } ${className}`;

  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={finalClass}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-2">Valid</p>}
    </div>
  );
}
```

**Step 2: Verify file exists**

Run: `ls -la src/components/common/Input.jsx`
Expected: File exists with 45+ lines.

**Step 3: Commit**

```bash
git add src/components/common/Input.jsx
git commit -m "feat: create reusable Input component with validation states"
```

---

### Task 8: Create Card Component

**Files:**
- Create: `src/components/common/Card.jsx`

**Step 1: Write Card component**

Create `src/components/common/Card.jsx`:

```javascript
export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}
```

**Step 2: Verify file exists**

Run: `wc -l src/components/common/Card.jsx`
Expected: 8 lines.

**Step 3: Commit**

```bash
git add src/components/common/Card.jsx
git commit -m "feat: create reusable Card component"
```

---

### Task 9: Create Badge Component

**Files:**
- Create: `src/components/common/Badge.jsx`

**Step 1: Write Badge component**

Create `src/components/common/Badge.jsx`:

```javascript
export default function Badge({ status, children }) {
  const statusClasses = {
    active: 'bg-green-600 text-white',
    completed: 'bg-green-600 text-white',
    failed: 'bg-red-600 text-white',
    pending: 'bg-amber-500 text-slate-900',
  };

  return (
    <span className={`px-3 py-1 rounded text-sm font-semibold ${statusClasses[status]}`}>
      {children}
    </span>
  );
}
```

**Step 2: Verify file exists**

Run: `wc -l src/components/common/Badge.jsx`
Expected: 10 lines.

**Step 3: Commit**

```bash
git add src/components/common/Badge.jsx
git commit -m "feat: create reusable Badge component for status display"
```

---

### Task 10: Create ProgressBar Component

**Files:**
- Create: `src/components/common/ProgressBar.jsx`

**Step 1: Write ProgressBar component**

Create `src/components/common/ProgressBar.jsx`:

```javascript
export default function ProgressBar({ current = 0, total = 7, animated = true }) {
  const percentage = (current / total) * 100;
  const animationClass = animated ? 'transition-all duration-500' : '';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-white font-semibold">{current}/{total} days complete</span>
        <span className="text-slate-300 text-sm">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
        <div
          className={`bg-green-500 h-full ${animationClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

**Step 2: Verify file exists**

Run: `wc -l src/components/common/ProgressBar.jsx`
Expected: 18 lines.

**Step 3: Commit**

```bash
git add src/components/common/ProgressBar.jsx
git commit -m "feat: create reusable ProgressBar component for 7-day tracking"
```

---

### Task 11: Create Header Component

**Files:**
- Create: `src/components/common/Header.jsx`

**Step 1: Write Header component**

Create `src/components/common/Header.jsx`:

```javascript
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-700 flex justify-between items-center px-10 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-500">
        CommitLock
      </Link>
      <div>
        {/* Wallet button will be added in MainLayout */}
        <p className="text-slate-400 text-sm">Wallet Connect Button Here</p>
      </div>
    </header>
  );
}
```

**Step 2: Verify file exists**

Run: `ls -la src/components/common/Header.jsx`
Expected: File exists.

**Step 3: Commit**

```bash
git add src/components/common/Header.jsx
git commit -m "feat: create Header component with logo and layout"
```

---

### Task 12: Create MainLayout Component

**Files:**
- Create: `src/components/layout/MainLayout.jsx`

**Step 1: Write MainLayout component**

Create `src/components/layout/MainLayout.jsx`:

```javascript
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
```

**Step 2: Verify file exists**

Run: `ls -la src/components/layout/MainLayout.jsx`
Expected: File exists with 12 lines.

**Step 3: Commit**

```bash
git add src/components/layout/MainLayout.jsx
git commit -m "feat: create MainLayout with Header and router outlet"
```

---

### Task 13: Create WalletContext

**Files:**
- Create: `src/context/WalletContext.jsx`

**Step 1: Write WalletContext**

Create `src/context/WalletContext.jsx`:

```javascript
import { createContext, useContext } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const value = {
    address,
    isConnected,
    chain: chain || { id: 11155111, name: 'Sepolia' },
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
```

**Step 2: Verify file exists**

Run: `wc -l src/context/WalletContext.jsx`
Expected: 25 lines.

**Step 3: Commit**

```bash
git add src/context/WalletContext.jsx
git commit -m "feat: create WalletContext for managing wallet state"
```

---

### Task 14: Create AppContext

**Files:**
- Create: `src/context/AppContext.jsx`

**Step 1: Write AppContext**

Create `src/context/AppContext.jsx`:

```javascript
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    githubUsername: null,
    walletAddress: null,
  });

  const [commitment, setCommitment] = useState(null);

  const [uiState, setUiState] = useState({
    isLoading: false,
    error: null,
    successMessage: null,
  });

  const value = {
    user,
    setUser,
    commitment,
    setCommitment,
    uiState,
    setUiState,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

**Step 2: Verify file exists**

Run: `wc -l src/context/AppContext.jsx`
Expected: 35 lines.

**Step 3: Commit**

```bash
git add src/context/AppContext.jsx
git commit -m "feat: create AppContext for managing app state"
```

---

### Task 15: Create useCommitment Hook

**Files:**
- Create: `src/hooks/useCommitment.js`

**Step 1: Write useCommitment hook**

Create `src/hooks/useCommitment.js`:

```javascript
import { useState } from 'react';
import { api } from '../services/api';

export function useCommitment() {
  const [commitment, setCommitment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCommitment = async (walletAddress) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getCommitment(walletAddress);
      setCommitment(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createCommitment = async (walletAddress, githubUsername, stakeAmount) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.createCommitment(walletAddress, githubUsername, stakeAmount);
      setCommitment(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const claimRewards = async (commitmentId) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.claimRewards(commitmentId);
      if (commitment) {
        setCommitment({ ...commitment, status: 'completed' });
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    commitment,
    isLoading,
    error,
    getCommitment,
    createCommitment,
    claimRewards,
  };
}
```

**Step 2: Verify file exists**

Run: `wc -l src/hooks/useCommitment.js`
Expected: 50+ lines.

**Step 3: Commit**

```bash
git add src/hooks/useCommitment.js
git commit -m "feat: create useCommitment hook for commitment operations"
```

---

### Task 16: Create useGitHub Hook

**Files:**
- Create: `src/hooks/useGitHub.js`

**Step 1: Write useGitHub hook**

Create `src/hooks/useGitHub.js`:

```javascript
import { useState } from 'react';
import { api } from '../services/api';

export function useGitHub() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateUsername = async (username) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.validateGitHub(username);
      if (result.valid) {
        setUser(result.user);
      }
      return result.valid;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearUser = () => {
    setUser(null);
    setError(null);
  };

  return {
    user,
    isLoading,
    error,
    validateUsername,
    clearUser,
  };
}
```

**Step 2: Verify file exists**

Run: `wc -l src/hooks/useGitHub.js`
Expected: 35 lines.

**Step 3: Commit**

```bash
git add src/hooks/useGitHub.js
git commit -m "feat: create useGitHub hook for github validation"
```

---

## Page Phase

### Task 17: Create Landing Page

**Files:**
- Create: `src/components/pages/Landing.jsx`

**Step 1: Write Landing component**

Create `src/components/pages/Landing.jsx`:

```javascript
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import { useWallet } from '../../context/WalletContext';

export default function Landing() {
  const navigate = useNavigate();
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-20">
      {/* Hero Section */}
      <div className="text-center py-20 px-6">
        <h1 className="text-6xl font-bold text-white mb-6">Commit or Forfeit</h1>
        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
          Stake eETH on your daily GitHub commits. Complete 7 days and earn staking rewards.
          Miss even one day and forfeit your stake.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button variant="secondary" size="lg">
            Login with GitHub
          </Button>
          <Button
            size="lg"
            onClick={() => navigate(isConnected ? '/create' : '/')}
          >
            Connect Wallet
          </Button>
        </div>

        {isConnected && (
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-base"
          >
            Go to Dashboard
          </Button>
        )}
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-6 bg-slate-800">
        <h2 className="text-4xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { step: 'Stake', desc: 'Deposit 0.01 eETH to start' },
            { step: 'Commit', desc: 'Make at least 1 GitHub commit daily' },
            { step: 'Track', desc: 'Monitor your 7-day progress' },
            { step: 'Claim', desc: 'Earn rewards if you complete all 7 days' },
          ].map((item, i) => (
            <Card key={i} className="text-center">
              <h3 className="text-xl font-bold text-blue-400 mb-3">{item.step}</h3>
              <p className="text-slate-300">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-400">
        <p>© 2025 CommitLock | Built for Hackathon</p>
      </footer>
    </div>
  );
}
```

**Step 2: Verify component renders**

Run: `npm run dev` (if not already running)
Navigate to `http://localhost:5173`
Expected: See hero section with "Commit or Forfeit" title and buttons.

**Step 3: Commit**

```bash
git add src/components/pages/Landing.jsx
git commit -m "feat: create Landing page with hero and how it works"
```

---

### Task 18: Create CreateCommitment Page

**Files:**
- Create: `src/components/pages/CreateCommitment.jsx`

**Step 1: Write CreateCommitment component**

Create `src/components/pages/CreateCommitment.jsx`:

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import { useGitHub } from '../../hooks/useGitHub';
import { useCommitment } from '../../hooks/useCommitment';
import { useWallet } from '../../context/WalletContext';
import { useApp } from '../../context/AppContext';

export default function CreateCommitment() {
  const navigate = useNavigate();
  const { address } = useWallet();
  const { setUser, setCommitment } = useApp();
  const { validateUsername, isLoading: gitHubLoading } = useGitHub();
  const { createCommitment, isLoading: commitLoading } = useCommitment();

  const [username, setUsername] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [approvalDone, setApprovalDone] = useState(false);
  const [step, setStep] = useState(1);

  const handleUsernameChange = async (e) => {
    const value = e.target.value;
    setUsername(value);
    setValidationError(null);
    setIsValid(false);

    if (value.length >= 2) {
      const valid = await validateUsername(value);
      if (valid) {
        setIsValid(true);
      } else {
        setValidationError('Invalid GitHub username');
      }
    }
  };

  const handleApprove = async () => {
    // Mock approval - in real app, this calls smart contract
    setStep(2);
    setApprovalDone(true);
  };

  const handleLockIn = async () => {
    if (!isValid) {
      setValidationError('Please validate GitHub username first');
      return;
    }

    const result = await createCommitment(address, username, '0.01');
    if (result) {
      setUser({ githubUsername: username, walletAddress: address });
      setCommitment(result);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-12">Create Commitment</h1>

        {/* Step Indicator */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`flex-1 text-center pb-4 border-b-2 ${
                step >= num ? 'border-blue-500' : 'border-slate-700'
              }`}
            >
              <p className={`font-semibold ${step >= num ? 'text-blue-400' : 'text-slate-500'}`}>
                Step {num}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {num === 1 && 'Approve eETH'}
                {num === 2 && 'Confirm & Lock'}
                {num === 3 && 'View Dashboard'}
              </p>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6">GitHub Information</h2>
          <Input
            placeholder="GitHub username"
            value={username}
            onChange={handleUsernameChange}
            error={validationError}
            success={isValid}
            disabled={gitHubLoading}
          />
        </Card>

        {/* Stake Details Card */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Stake Details</h2>
          <div className="space-y-3 text-slate-300">
            <div className="flex justify-between">
              <span>Stake Amount:</span>
              <span className="font-semibold text-white">0.01 eETH</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-semibold text-white">7 days</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated APY:</span>
              <span className="font-semibold text-white">~3.2%</span>
            </div>
            <div className="border-t border-slate-700 pt-3 flex justify-between">
              <span>Estimated Earnings:</span>
              <span className="font-semibold text-green-400">~0.000061 eETH</span>
            </div>
          </div>
        </Card>

        {/* Warning Box */}
        <Card className="mb-8 bg-amber-900 border-amber-700">
          <p className="text-amber-200 text-sm">
            Your funds will be locked for 7 days. You must make at least 1 GitHub commit per day
            to claim rewards. Missing even one day will result in losing your stake.
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant={approvalDone ? 'ghost' : 'secondary'}
            size="lg"
            onClick={handleApprove}
            disabled={!isValid || approvalDone}
            className="flex-1"
          >
            {approvalDone ? 'Approved' : 'Approve eETH'}
          </Button>
          <Button
            size="lg"
            onClick={handleLockIn}
            disabled={!approvalDone || commitLoading}
            className="flex-1"
          >
            {commitLoading ? 'Locking...' : 'Lock It In'}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify component renders**

Run dev server and navigate to `/create`
Expected: See form with username input, stake details, and approval flow.

**Step 3: Commit**

```bash
git add src/components/pages/CreateCommitment.jsx
git commit -m "feat: create CreateCommitment page with approval flow"
```

---

### Task 19: Create Dashboard Page

**Files:**
- Create: `src/components/pages/Dashboard.jsx`

**Step 1: Write Dashboard component**

Create `src/components/pages/Dashboard.jsx`:

```javascript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { useApp } from '../../context/AppContext';
import { useWallet } from '../../context/WalletContext';
import { useCommitment } from '../../hooks/useCommitment';
import { formatAddress } from '../../utils/format';

export default function Dashboard() {
  const navigate = useNavigate();
  const { address } = useWallet();
  const { commitment, setCommitment } = useApp();
  const { getCommitment, claimRewards, isLoading } = useCommitment();

  useEffect(() => {
    if (address && !commitment) {
      getCommitment(address).then(setCommitment);
    }
  }, [address, commitment, getCommitment, setCommitment]);

  if (!commitment) {
    return (
      <div className="min-h-screen bg-slate-900 pt-24 text-center">
        <p className="text-white text-xl">No active commitment found</p>
        <Button onClick={() => navigate('/create')} className="mt-6">
          Create New Commitment
        </Button>
      </div>
    );
  }

  const handleClaim = async () => {
    const result = await claimRewards(commitment.id);
    if (result) {
      setCommitment({ ...commitment, status: 'completed' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-12">Dashboard</h1>

        {/* Status Card */}
        <Card className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-slate-400 text-sm mb-2">GitHub Username</p>
              <h2 className="text-2xl font-bold text-white">@{commitment.githubUsername}</h2>
            </div>
            <Badge status={commitment.status}>
              {commitment.status.charAt(0).toUpperCase() + commitment.status.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-700">
            <div>
              <p className="text-slate-400 text-sm mb-1">Stake Amount</p>
              <p className="text-xl font-bold text-white">{commitment.stakeAmount} eETH</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Wallet</p>
              <p className="text-sm font-mono text-blue-400">{formatAddress(commitment.walletAddress)}</p>
            </div>
          </div>
        </Card>

        {/* Progress Section */}
        <Card className="mb-8">
          <ProgressBar current={commitment.daysComplete} total={7} />
        </Card>

        {/* 7-Day Grid */}
        <Card className="mb-8">
          <h3 className="text-lg font-bold text-white mb-6">Daily Progress</h3>
          <div className="grid grid-cols-7 gap-3">
            {commitment.daysArray.map((day) => (
              <div
                key={day.day}
                className={`p-4 rounded-lg text-center font-semibold ${
                  day.status === 'complete'
                    ? 'bg-green-600 text-white'
                    : day.status === 'pending'
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-red-600 text-white'
                }`}
              >
                Day {day.day}
              </div>
            ))}
          </div>
        </Card>

        {/* Rewards Card */}
        <Card className="mb-8">
          <h3 className="text-lg font-bold text-white mb-6">Rewards Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-slate-300">
              <span>Original Stake</span>
              <span className="font-semibold text-white">{commitment.stakeAmount} eETH</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Accrued Rewards</span>
              <span className="font-semibold text-green-400">{commitment.rewards} eETH</span>
            </div>
            <div className="border-t border-slate-700 pt-4 flex justify-between text-white">
              <span className="font-bold">Total to Claim</span>
              <span className="font-bold text-lg">
                {(parseFloat(commitment.stakeAmount) + parseFloat(commitment.rewards)).toFixed(6)} eETH
              </span>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <div className="flex gap-4">
          {commitment.status === 'completed' && (
            <Button
              size="lg"
              onClick={handleClaim}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Claiming...' : 'Claim eETH + Rewards'}
            </Button>
          )}
          {commitment.status === 'failed' && (
            <div className="w-full p-4 bg-red-900 text-red-200 rounded-lg text-center">
              Challenge Failed - Your stake has been forfeited
            </div>
          )}
          {commitment.status === 'active' && (
            <p className="text-slate-400 italic">Keep up with your daily commits to complete the challenge</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify component renders**

Run dev server and navigate to `/dashboard`
Expected: See commitment details, 7-day grid, and rewards summary.

**Step 3: Commit**

```bash
git add src/components/pages/Dashboard.jsx
git commit -m "feat: create Dashboard page with commitment tracking and rewards"
```

---

## Integration Phase

### Task 20: Setup React Router and App.jsx

**Files:**
- Modify: `src/App.jsx`

**Step 1: Replace App.jsx with Router setup**

Replace contents of `src/App.jsx`:

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { wagmiConfig } from './services/wagmi';
import { WalletProvider } from './context/WalletContext';
import { AppProvider } from './context/AppContext';

import MainLayout from './components/layout/MainLayout';
import Landing from './components/pages/Landing';
import CreateCommitment from './components/pages/CreateCommitment';
import Dashboard from './components/pages/Dashboard';

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider>
        <WalletProvider>
          <AppProvider>
            <Router>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/create" element={<CreateCommitment />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
              </Routes>
            </Router>
          </AppProvider>
        </WalletProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
```

**Step 2: Verify App.jsx is updated**

Run: `cat src/App.jsx | head -20`
Expected: Shows WagmiConfig and RainbowKitProvider setup.

**Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: setup react router and app structure with providers"
```

---

### Task 21: Update main.jsx for TailwindCSS

**Files:**
- Modify: `src/main.jsx`

**Step 1: Update main.jsx**

Replace contents of `src/main.jsx`:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Step 2: Verify file is correct**

Run: `cat src/main.jsx`
Expected: Shows React import and App component setup.

**Step 3: Commit**

```bash
git add src/main.jsx
git commit -m "chore: update main.jsx entry point"
```

---

### Task 22: Setup TailwindCSS in index.css

**Files:**
- Modify: `src/index.css`

**Step 1: Replace index.css with TailwindCSS directives**

Replace contents of `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Source Sans Pro',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
  outline: none;
}

input:focus {
  outline: none;
}
```

**Step 2: Verify file is updated**

Run: `head -5 src/index.css`
Expected: Shows @tailwind directives.

**Step 3: Commit**

```bash
git add src/index.css
git commit -m "chore: setup tailwindcss base styles"
```

---

### Task 23: Test Build and Dev Server

**Files:**
- None (testing only)

**Step 1: Run dev server**

Run: `npm run dev`
Expected: Server starts, listening on http://localhost:5173

**Step 2: Check console for errors**

Expected: No errors in console, app should load without crashes.

**Step 3: Navigate through pages**

- Visit http://localhost:5173
- See Landing page with "Commit or Forfeit" hero
- Click "Connect Wallet" (no actual connection, just layout test)
- Check all components render without console errors

**Step 4: Build for production**

Run: `npm run build`
Expected: Build completes without errors, creates `dist` folder.

**Step 5: Commit final state**

```bash
git add -A
git commit -m "feat: complete frontend implementation with all pages and components"
```

---

## Verification Checklist

- [ ] All 6 reusable components exist (Button, Input, Card, Badge, ProgressBar, Header)
- [ ] MainLayout component with router outlet
- [ ] 3 context providers (WalletContext, AppContext)
- [ ] 3 custom hooks (useCommitment, useGitHub, useEETH placeholder)
- [ ] 3 pages (Landing, CreateCommitment, Dashboard)
- [ ] React Router configured with 3 routes
- [ ] TailwindCSS dark mode working
- [ ] Dev server runs without errors
- [ ] Build completes successfully
- [ ] All commits are atomic and meaningful

---

## Next Steps

1. Connect real GitHub OAuth (backend integration)
2. Connect to real smart contract (after deployment)
3. Replace mock API with real backend endpoints
4. Add Wagmi hooks for actual wallet transactions
5. Test on Sepolia testnet with real eETH
6. Deploy to Vercel
