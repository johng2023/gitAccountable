# GitAccountable Frontend

React + Vite frontend for GitAccountable - blockchain-based GitHub commit accountability with Ether.Fi staking.

## Quick Start

```bash
npm install
cp .env.example .env  # Configure environment variables
npm run dev
```

## Environment Variables (CRITICAL for Vercel)

**Required in `.env` file AND Vercel environment variables:**

```env
VITE_COMMIT_LOCK_ADDRESS=0x1953f602eFd1CBd16846A440421F4824024ae60c
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Setting Up in Vercel

1. Go to **Project Settings** → **Environment Variables**
2. Add both variables above
3. Apply to: **Production**, **Preview**, **Development**
4. **Redeploy** after adding variables

## Troubleshooting "Not Returning Data" Error

If you see this error on your deployed Vercel app:

1. **Check Vercel environment variables are set** (most common issue)
2. **Check browser console** for contract/API errors
3. **URL query parameter support**: You can pass GitHub username via `/create?github-username=yourname`
4. **Contract address warning**: If you see a red "Configuration Error" banner, env var is missing

## Tech Stack

- React 18 + Vite
- Wagmi v2 + RainbowKit (Web3)
- Tailwind CSS v4
- Framer Motion
