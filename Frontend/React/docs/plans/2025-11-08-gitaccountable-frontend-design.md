# GitAccountable Frontend Architecture Design

## Overview

Frontend for GitAccountable - a hackathon MVP where developers stake eETH on 7-day GitHub commit challenges. Built with Vite + React 19, Wagmi (wallet connection), React Router (page navigation), and TailwindCSS 4 (dark mode design).

**Stack:**
- Framework: React 19 + Vite
- Wallet: Wagmi hooks + RainbowKit
- Routing: React Router v6
- Styling: TailwindCSS 4
- State: Wagmi hooks + React Context
- Network: Sepolia testnet (chain ID 11155111)
- API: Mock responses (backend built by teammate)

---

## Directory Structure

```
src/
├── components/
│   ├── common/              # Reusable UI components
│   │   ├── Button.jsx       # Button variants (primary, secondary, disabled)
│   │   ├── Input.jsx        # Text input with validation feedback
│   │   ├── Card.jsx         # Container with styling
│   │   ├── Badge.jsx        # Status badges (Active/Failed/Completed)
│   │   ├── ProgressBar.jsx  # 7-day progress visualization
│   │   └── Header.jsx       # Fixed header with logo + wallet button
│   ├── web3/                # Web3-specific components
│   │   ├── WalletConnect.jsx      # RainbowKit wrapper
│   │   ├── ApprovalFlow.jsx       # eETH approval management
│   │   └── TransactionStatus.jsx  # TX pending/confirmed/failed states
│   ├── pages/               # Full page components
│   │   ├── Landing.jsx      # Hero + OAuth + wallet connect + How It Works
│   │   ├── CreateCommitment.jsx   # Form + approval + lock flow
│   │   └── Dashboard.jsx    # Commitment display + rewards + claim
│   └── layout/
│       └── MainLayout.jsx   # Wrapper with Header + Router outlet
├── context/
│   ├── WalletContext.jsx    # Wagmi wallet state (address, chain, signer)
│   └── AppContext.jsx       # App state (user, commitment, UI state)
├── hooks/
│   ├── useCommitment.js     # Create/fetch/claim commitment logic
│   ├── useGitHub.js         # GitHub OAuth + username validation
│   └── useEETH.js           # Approve/transfer eETH tokens
├── services/
│   ├── api.js               # Mock API responses
│   ├── wagmi.js             # Wagmi config for Sepolia
│   └── github.js            # GitHub OAuth handling
├── utils/
│   ├── colors.js            # Design system color palette
│   ├── format.js            # Format utilities (dates, tokens, etc)
│   └── contracts.js         # ABI + addresses (eETH, CommitLock contract)
├── App.jsx                  # Root with Router setup
├── main.jsx                 # Entry point
└── index.css                # Global styles + TailwindCSS
```

---

## Component Specifications

### **Common UI Components**

#### **Button.jsx**
```
Props:
  - children (string)
  - variant ('primary' | 'secondary' | 'ghost') [default: 'primary']
  - size ('sm' | 'md' | 'lg') [default: 'md']
  - disabled (boolean)
  - onClick (function)
  - className (string for overrides)

Variants:
  - Primary: Blue background (#3B82F6), white text, hover scale 1.02
  - Secondary: Slate 800 background, blue border, blue text
  - Ghost: Transparent, blue text, underline on hover

Sizes:
  - sm: 12px font, 8px 16px padding
  - md: 16px font, 14px 32px padding
  - lg: 18px font, 16px 40px padding

States:
  - Disabled: Opacity 0.5, cursor not-allowed
  - Loading: Show spinner, disable clicks
```

#### **Input.jsx**
```
Props:
  - type ('text' | 'email' | 'password') [default: 'text']
  - placeholder (string)
  - value (string)
  - onChange (function)
  - error (string | null)
  - success (boolean)
  - disabled (boolean)

States:
  - Default: Slate 800 background, white text, blue border on focus
  - Success: Green border, success text below
  - Error: Red border, error message below
  - Disabled: Gray background, cursor not-allowed
```

#### **Card.jsx**
```
Props:
  - children (React nodes)
  - className (string)

Styling:
  - Background: Slate 800
  - Border: 1px solid Slate 700
  - Padding: 24px
  - Border radius: 12px
```

#### **Badge.jsx**
```
Props:
  - status ('active' | 'completed' | 'failed' | 'pending')
  - children (string)

Colors:
  - Active: Green background (#10B981), white text
  - Completed: Green background, white text
  - Failed: Red background (#EF4444), white text
  - Pending: Amber background (#F59E0B), dark text
```

#### **ProgressBar.jsx**
```
Props:
  - current (number) - days complete
  - total (number) - total days [default: 7]
  - animated (boolean) [default: true]

Display:
  - Green fill for complete days
  - Amber for current/pending day
  - Red for failed days
  - Shows "X/7 days complete" text overlay
```

#### **Header.jsx**
```
Display:
  - Fixed top, 60px height
  - Logo: "CommitLock" text (blue, 24px)
  - Right: RainbowKit ConnectButton
  - Background: Slate 900 with transparency
  - Border bottom: 1px solid Slate 700

Responsive:
  - Mobile: Logo smaller (18px), button stacks if needed
  - Desktop: Full layout
```

### **Web3 Components**

#### **WalletConnect.jsx**
```
Wrapper around RainbowKit's ConnectButton
Props:
  - onConnect (function) - called when wallet connects
  - onDisconnect (function) - called when wallet disconnects

Displays:
  - If not connected: "Connect Wallet" button
  - If connected: Address + network + disconnect option
  - If wrong network: Show error "Switch to Sepolia"
```

#### **ApprovalFlow.jsx**
```
Props:
  - tokenAddress (string) - eETH contract address
  - spenderAddress (string) - CommitLock contract address
  - amount (string) - 0.01 eETH
  - onApprovalComplete (function)

Flow:
  1. Show "Approve eETH" button (amber, secondary)
  2. On click: Call approve() via Wagmi
  3. Show "Approving..." state with spinner
  4. On success: Call onApprovalComplete()
  5. Button becomes disabled/hidden
  6. Show "Approved" text
  7. Next button enables

States:
  - Idle: Button ready to click
  - Loading: Spinner, disabled
  - Success: Text "Approved"
  - Error: Red error message
```

#### **TransactionStatus.jsx**
```
Props:
  - txHash (string)
  - status ('pending' | 'confirmed' | 'failed')
  - action (string) - "Approving eETH" / "Locking stake" etc

Display:
  - Pending: Spinner + "Waiting for confirmation..."
  - Confirmed: "Transaction confirmed" + link to Etherscan
  - Failed: "Transaction failed" + retry button
```

### **Page Components**

#### **Landing.jsx**
```
Structure:
  1. Header (fixed, via MainLayout)
  2. Hero Section
     - Title: "Commit or Forfeit"
     - Subtitle: "Stake eETH on your daily GitHub commits..."
     - Buttons: "Login with GitHub" + "Connect Wallet"
  3. How It Works Section
     - 4-card grid (Stake → Commit → Track → Claim)
     - Text descriptions in each card
  4. Footer
     - Copyright text

Data Flow:
  - "Login with GitHub" → GitHub OAuth flow (github.js)
  - "Connect Wallet" → WalletConnect component
  - After both connected: Redirect to /create
```

#### **CreateCommitment.jsx**
```
Route: /create
Required: GitHub username + wallet connected

Structure:
  1. Header (via MainLayout)
  2. Form Card
     - GitHub username input
     - Real-time validation (success/error state)
     - Stake details (read-only card showing 0.01 eETH, 7 days, APY ~3.2%)
  3. Step Indicator (3 steps)
     - Step 1: Approve eETH (currently here)
     - Step 2: Confirm & Lock (grayed out until step 1 done)
     - Step 3: View Dashboard (grayed out)
  4. Buttons
     - "Approve eETH" (secondary, calls ApprovalFlow)
     - "Lock It In" (primary, disabled until approval complete)
  5. Warning box
     - "Funds will be locked for 7 days..."

Flow:
  1. User enters GitHub username
  2. Validate against GitHub API (via useGitHub hook)
  3. Show success state if valid
  4. User clicks "Approve eETH" → ApprovalFlow handles it
  5. User clicks "Lock It In" → createCommitment() via useCommitment hook
  6. On success: Redirect to /dashboard
```

#### **Dashboard.jsx**
```
Route: /dashboard
Required: User has active commitment

Structure:
  1. Header (via MainLayout)
  2. Commitment Status Card
     - GitHub username: @<username>
     - Stake amount: 0.01 eETH
     - Status badge (Active/Completed/Failed)
  3. Progress Section
     - "X/7 days complete" text
     - ProgressBar component
  4. 7-Day Grid
     - 7 boxes, one per day
     - Each shows status text: complete | pending | missed
     - Color: green | amber | red
  5. Rewards Summary Card
     - Original stake: 0.01 eETH
     - Accrued rewards: ~0.000061 eETH (calculated)
     - Total to claim: 0.010061 eETH
  6. Action Buttons
     - If status === 'completed': "Claim eETH + Rewards" (primary, blue)
     - If status === 'active': "Check in" button or just display
     - If status === 'failed': Show "Challenge Failed" message

Data:
  - Fetches commitment from API via useCommitment
  - Polls for daily updates (or listens to contract events)
  - On "Claim" click: Send claim transaction via Wagmi
```

---

## Context & Hooks

### **WalletContext**
```javascript
{
  address: string,           // 0x...
  isConnected: boolean,
  chain: { id: 11155111, name: 'Sepolia' },
  signer: ethers.Signer,
  provider: ethers.Provider
}
```

### **AppContext**
```javascript
{
  user: {
    githubUsername: string,
    walletAddress: string,
  },
  commitment: {
    id: string,
    stakeAmount: string,     // "0.01"
    daysComplete: number,    // 0-7
    status: 'active' | 'completed' | 'failed',
    rewards: string,         // "0.000061"
    createdAt: timestamp,
    expiresAt: timestamp
  },
  uiState: {
    isLoading: boolean,
    error: string | null,
    successMessage: string | null
  }
}
```

### **useCommitment Hook**
```javascript
const {
  commitment,        // Current commitment object
  isLoading,
  error,
  createCommitment(githubUsername), // Returns commitment
  claimRewards(),    // Claim rewards
  refreshCommitment() // Fetch latest from API
} = useCommitment();
```

### **useGitHub Hook**
```javascript
const {
  user,              // { username, avatarUrl, ... }
  isAuthenticated,
  validateUsername(username), // Returns boolean
  login(),           // Trigger OAuth
  logout()
} = useGitHub();
```

### **useEETH Hook**
```javascript
const {
  balance,           // User's eETH balance
  allowance,         // Approved amount for CommitLock contract
  approve(amount),   // Approve eETH spending
  transfer(to, amount) // Transfer eETH (for internal use)
} = useEETH();
```

---

## Services & Utilities

### **api.js (Mock Responses)**
```javascript
// Mock API responses - replace with real backend endpoints later

export const createCommitmentAPI = async (payload) => {
  // POST /api/commitment/create
  // Response: { id, stakeAmount, status, daysComplete, ... }
}

export const getCommitmentAPI = async (walletAddress) => {
  // GET /api/commitment/:address
  // Response: { ...commitment }
}

export const claimRewardsAPI = async (commitmentId) => {
  // POST /api/commitment/:id/claim
  // Response: { txHash, rewards, ... }
}

export const validateGitHubAPI = async (username) => {
  // GET /api/github/validate/:username
  // Response: { valid: boolean, user: {...} }
}
```

### **wagmi.js (Config)**
```javascript
// Wagmi configuration for Sepolia testnet
// Includes:
// - Chain config (Sepolia: chainId 11155111)
// - RPC endpoint
// - Connectors (MetaMask, WalletConnect, Coinbase)
// - eETH token address: 0x0305ea0a4b43a12e3d130448e9b4711932231e83
// - CommitLock contract address (will be deployed)
```

### **contracts.js**
```javascript
export const eETH_ADDRESS = '0x0305ea0a4b43a12e3d130448e9b4711932231e83';
export const eETH_ABI = [/* ERC20 ABI */];

export const COMMITLOCK_ADDRESS = '0x...'; // Will be set after deployment
export const COMMITLOCK_ABI = [/* CommitLock ABI */];
```

---

## Data Flow

```
USER JOURNEY:

1. Landing Page
   User lands on / (Landing.jsx)
   ↓
   Sees hero + "Commit or Forfeit" messaging
   ↓
   Clicks "Login with GitHub"
   → github.js handles OAuth redirect
   → Backend stores GitHub user
   → Browser redirected back with auth token
   ↓
   Clicks "Connect Wallet"
   → WalletConnect.jsx (RainbowKit)
   → Wagmi detects Sepolia, stores in WalletContext
   ↓
   Both connected → Redirect to /create

2. Create Commitment Page
   User on /create (CreateCommitment.jsx)
   ↓
   Enters GitHub username
   → useGitHub.validateUsername() checks if valid
   → Shows success state
   ↓
   Clicks "Approve eETH"
   → ApprovalFlow.jsx calls wagmi's useContractWrite
   → Calls approve() on eETH contract
   → Shows "Approving..." state
   → On success, shows "Approved"
   ↓
   Clicks "Lock It In"
   → useCommitment.createCommitment()
   → Calls createCommitment() on smart contract via Wagmi
   → Mock API stores commitment
   → On success → Redirect to /dashboard

3. Dashboard Page
   User on /dashboard (Dashboard.jsx)
   ↓
   useCommitment.getCommitment() fetches from mock API
   ↓
   Displays:
   - Commitment status card
   - 7-day progress grid
   - Rewards summary
   - "Claim Rewards" button (if 7/7 complete)
   ↓
   Clicks "Claim Rewards"
   → Calls claim() on smart contract
   → Rewards transferred to wallet
   → Shows success message
   ↓
   User can view again or disconnect wallet
```

---

## Design System

### **Colors (TailwindCSS)**
```
Primary: #3B82F6 (Blue)
Success: #10B981 (Green)
Warning: #F59E0B (Amber)
Error: #EF4444 (Red)
Background: #0F172A (Slate 900)
Surface: #1E293B (Slate 800)
Border: #334155 (Slate 700)
Text: #F1F5F9 (Slate 100)
Muted: #CBD5E1 (Slate 300)
```

### **Typography**
```
Headings: Inter, weight 700
Body: Inter, weight 400
Sizes: H1 (48px), H2 (36px), H3 (24px), Body (16px), Small (14px)
Line height: 1.6
Letter spacing: -1px for headings
```

### **Spacing**
```
Base unit: 4px
Padding: 8px, 12px, 16px, 24px, 32px, 40px
Margins: Same as padding
Border radius: 8px (standard), 12px (large)
```

### **Responsive Breakpoints**
```
Mobile: 320-640px
Tablet: 641-1024px
Desktop: 1025px+
```

---

## Deployment Notes

- **Frontend:** Vercel (auto-deploy from GitHub)
- **Testnet:** Sepolia (chain ID 11155111)
- **Environment Variables:**
  - `VITE_GITHUB_CLIENT_ID` (OAuth app ID)
  - `VITE_GITHUB_REDIRECT_URI` (callback URL)
  - `VITE_RPC_URL_SEPOLIA` (or use Wagmi default)
  - `VITE_COMMITLOCK_ADDRESS` (smart contract address - filled after deploy)

---

## Next Steps

1. Install dependencies (wagmi, react-router, rainbowkit, ethers)
2. Create directory structure
3. Build reusable UI components
4. Wire up Wagmi + RainbowKit
5. Create pages and routes
6. Implement mock API
7. Test full user flow on Sepolia testnet
