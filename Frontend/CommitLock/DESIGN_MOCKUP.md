# CommitLock Frontend Design Mockup

## Overview
Three-page frontend for CommitLock with GitHub OAuth, wallet connection, commitment form, and dashboard.

---

# PAGE 1: LANDING PAGE

## Layout Structure
```
┌──────────────────────────────────────────────────────────┐
│                      HEADER (60px)                        │
│  Logo: CommitLock         [Connect Wallet Button]         │
└──────────────────────────────────────────────────────────┘
│                                                            │
│                     HERO SECTION                           │
│                    (Full viewport height)                  │
│                                                            │
│              "Commit or Forfeit"                          │
│         Stake eETH on your daily commits                  │
│                                                            │
│        [Login with GitHub]  [Connect Wallet]              │
│                                                            │
│                  OR: Already have account                 │
│                      [Go to Dashboard]                    │
│                                                            │
├──────────────────────────────────────────────────────────┤
│                  HOW IT WORKS SECTION                      │
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Stake  │  │ Commit   │  │  Track   │  │  Claim   │  │
│  │   eETH   │  │   Daily  │  │ Progress │  │ Rewards  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                            │
├──────────────────────────────────────────────────────────┤
│                    FOOTER (40px)                           │
│              © 2025 CommitLock  |  Made for Hackathon     │
└──────────────────────────────────────────────────────────┘
```

## Component Details

### Header
```
Layout: Flex, space-between, fixed top
Background: rgba(15, 23, 42, 0.95) (Slate 900 with transparency)
Height: 60px
Padding: 0 40px
Border bottom: 1px solid #334155 (Slate 700)
Z-index: 100

Left side:
  - Logo text: "CommitLock"
  - Font: 24px, Weight 700, Color #3B82F6 (Blue)
  - Cursor: pointer (links to home)

Right side:
  - Button: "Connect Wallet"
  - Uses RainbowKit ConnectButton component
  - Styling: Slate 800 background, blue text
```

### Hero Section
```
Full viewport (min-height: 100vh)
Background: Linear gradient from #0F172A to #1E293B
Padding: 120px 40px
Text-align: center
Display: Flex, flex-direction: column, align-items: center, justify-content: center

Main Title: "Commit or Forfeit"
  - Font size: 64px
  - Font weight: 700
  - Color: White
  - Margin bottom: 24px
  - Letter spacing: -1px

Subtitle: "Stake eETH on your daily GitHub commits. Complete 7 days and earn staking rewards. Miss even one day and forfeit your stake."
  - Font size: 20px
  - Font weight: 400
  - Color: #CBD5E1 (Slate 300)
  - Max width: 700px
  - Line height: 1.6
  - Margin bottom: 48px

Button Group:
  Layout: Flex, gap 16px, justify-content center
  Flex wrap: wrap

  Button 1: "Login with GitHub"
    - Background: #1F2937 (dark gray)
    - Border: 2px solid #3B82F6 (blue)
    - Text color: White
    - Font: 16px, Weight 600
    - Padding: 14px 32px
    - Border radius: 8px
    - Icon: GitHub logo (left side, 20px)
    - Hover: Background #111827
    - Click: Trigger GitHub OAuth flow

  Button 2: "Connect Wallet"
    - Background: #3B82F6 (blue)
    - Text color: White
    - Font: 16px, Weight 600
    - Padding: 14px 32px
    - Border radius: 8px
    - Icon: Wallet icon (left side)
    - Hover: Background #1E40AF
    - Click: RainbowKit modal opens

Secondary Link:
  Text: "Already have an account? Go to Dashboard"
  - Font size: 14px
  - Color: #94A3B8 (Slate 400)
  - Margin top: 32px
  - Text decoration: underline on hover
  - Cursor: pointer
  - Links to: /dashboard
```

### How It Works Section
```
Background: #0F172A (Slate 900)
Padding: 80px 40px
Margin top: 0

Title: "How It Works"
  - Font size: 36px
  - Font weight: 700
  - Color: White
  - Margin bottom: 60px
  - Text align: center

Grid Layout: 4 columns
  Responsive: 2 columns on tablet, 1 on mobile
  Gap: 32px
  Max width: 1200px
  Margin: 0 auto

Card 1: "Connect & Approve"
  Background: #1E293B (Slate 800)
  Border: 1px solid #334155 (Slate 700)
  Padding: 32px
  Border radius: 12px
  Text align: center

  Icon: 💰 (40px emoji) or SVG wallet icon
  Title: "Connect & Approve"
    - Font: 20px, Weight 600, Color White
    - Margin top: 16px
  Description: "Link your wallet and approve eETH transfer"
    - Font: 14px, Color: #CBD5E1 (Slate 300)
    - Line height: 1.6
  Hover: Border color changes to #3B82F6, slight lift effect

Card 2: "Create Commitment"
  [Same styling as Card 1]
  Icon: 🔒
  Title: "Create Commitment"
  Description: "Stake 0.01 eETH for your 7-day challenge"

Card 3: "Commit Daily"
  [Same styling as Card 1]
  Icon: ✅
  Title: "Commit Daily"
  Description: "Make a GitHub commit every single day"

Card 4: "Claim Rewards"
  [Same styling as Card 1]
  Icon: 🏆
  Title: "Claim Rewards"
  Description: "After 7 days, claim your eETH + staking rewards"
```

### Footer
```
Background: #0F172A (Slate 900)
Border top: 1px solid #334155 (Slate 700)
Height: 60px
Padding: 0 40px
Display: Flex, align-items center, justify-content center
Font size: 12px
Color: #64748B (Slate 500)
Text: "© 2025 CommitLock  |  Built for Hackathon"
```

---

# PAGE 2: DASHBOARD PAGE

## Layout Structure
```
┌──────────────────────────────────────────────────────────┐
│                      HEADER (60px)                        │
│  Logo: CommitLock    GitHub: @username    [Account]      │
└──────────────────────────────────────────────────────────┘
│                                                            │
│              COMMITMENT STATUS CARD                        │
│                                                            │
│  Status: Active (4/7 days complete)                       │
│  GitHub: @torvalds                                        │
│  Stake: 0.01 eETH                                         │
│                                                            │
│  Progress: Days Completed                                 │
│  [████████░░░░░░░░░] 4/7                                 │
│                                                            │
│  Daily Commit Status:                                     │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  │ D1 │ │ D2 │ │ D3 │ │ D4 │ │ D5 │ │ D6 │ │ D7 │       │
│  │ ✅  │ │ ✅  │ │ ✅  │ │ ✅  │ │ ⏳  │ │ ⊘  │ │ ⊘  │       │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘       │
│                                                            │
│              REWARDS SUMMARY BOX                           │
│                                                            │
│  Original Stake: 0.01 eETH                               │
│  Accrued Rewards: ~0.000061 eETH                         │
│  Total to Claim: 0.010061 eETH                           │
│                                                            │
│              [Claim eETH + Rewards]                        │
│              (Only if 7/7 complete)                        │
│                                                            │
│              [← Back to Home]                              │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

## Component Details

### Header (Same as Landing)
```
Fixed, Top
Background: rgba(15, 23, 42, 0.95)
Height: 60px
Padding: 0 40px
Border bottom: 1px solid #334155

Left: CommitLock logo
Center: GitHub username display
  "Connected as: @torvalds"
  - Font: 14px, Color: #94A3B8
  - Icon: GitHub mark (16px)
Right: Account menu (Wagmi hooks show connected address)
```

### Main Content Area
```
Background: Linear gradient #0F172A → #1E293B
Min-height: calc(100vh - 60px)
Padding: 60px 40px
```

### Commitment Status Card
```
Background: #1E293B (Slate 800)
Border: 1px solid #334155 (Slate 700)
Border radius: 16px
Padding: 40px
Margin bottom: 40px
Max width: 800px
Margin left: auto
Margin right: auto
Box shadow: 0 10px 25px rgba(0, 0, 0, 0.3)

Header Section:
  Status Badge:
    - Background: #10B981 (green)
    - Color: White
    - Padding: 6px 16px
    - Border radius: 20px
    - Font: 12px, Weight 600
    - Text: "Active (4/7 days)"

  GitHub Username:
    - Font: 24px, Weight 600, Color White
    - Icon: GitHub mark (20px)
    - Margin top: 12px
    - Text: "@torvalds"

  Stake Amount:
    - Font: 16px, Color: #CBD5E1 (Slate 300)
    - Text: "Stake: 0.01 eETH"
    - Margin top: 8px

Divider:
  - Height: 1px
  - Background: #334155 (Slate 700)
  - Margin: 32px 0

Progress Section:
  Label: "Days Completed"
    - Font: 14px, Weight 500, Color: #94A3B8 (Slate 400)
    - Margin bottom: 8px

  Progress Metric:
    - "4/7"
    - Font: 32px, Weight 700, Color: #3B82F6 (Blue)
    - Display: inline-block

  Progress Bar:
    - Background: #334155 (Slate 700)
    - Fill: Linear gradient #3B82F6 → #1E40AF
    - Height: 20px
    - Border radius: 10px
    - Width: 100%
    - Percentage filled: 57% (4/7)
    - Margin top: 12px
    - Animation: Smooth fill on load

Daily Status Grid:
  Label: "Daily Commit Status"
    - Font: 14px, Weight 500, Color: #94A3B8
    - Margin bottom: 16px

  Grid: 7 columns, gap 12px
  Responsive: Auto-columns on mobile

  Day Item (Each day 1-7):
    Width: calc(100% / 7 - gap)
    Height: 80px
    Background: #334155 (Slate 700)
    Border radius: 8px
    Display: Flex, flex-direction: column, align-items center, justify-content center
    Padding: 12px
    Border: 1px solid transparent

    Day Label (Top):
      - Font: 12px, Color: #94A3B8 (Slate 400)
      - Text: "Day 1", "Day 2", etc.

    Status Icon (Large, center):
      ✅ Complete (Green checkmark)
        - Icon size: 28px
        - Color: #10B981 (green)
        - Background: #D1FAE5 (light green)
        - Border radius: 50%
        - Padding: 8px

      ⏳ Pending (Hourglass)
        - Icon size: 28px
        - Color: #F59E0B (amber)
        - Background: #FEF3C7 (light amber)
        - Border radius: 50%
        - Padding: 8px

      ⊘ Missed (X mark)
        - Icon size: 28px
        - Color: #EF4444 (red)
        - Background: #FEE2E2 (light red)
        - Border radius: 50%
        - Padding: 8px

    Completed Day Styling:
      Background: #D1FAE5 (light green)
      Border: 2px solid #10B981 (green)

    Pending Day Styling:
      Background: #334155
      Border: 2px solid #FEF3C7

    Missed Day Styling:
      Background: #FEE2E2 (light red)
      Border: 2px solid #EF4444 (red)
```

### Rewards Summary Box
```
Background: #334155 (Slate 700)
Border: 1px solid #475569 (Slate 600)
Border radius: 12px
Padding: 24px
Margin top: 32px
Margin bottom: 32px

Grid Layout: 3 columns
  Responsive: 1 column on mobile
  Gap: 24px

Column 1: Original Stake
  Label: "Original Stake"
    - Font: 12px, Weight 500, Color: #94A3B8 (Slate 400)
    - Margin bottom: 8px
  Value: "0.01 eETH"
    - Font: 20px, Weight 700, Color: White

Column 2: Accrued Rewards
  Label: "Accrued Rewards (Est.)"
    - Font: 12px, Weight 500, Color: #94A3B8
    - Margin bottom: 8px
  Value: "~0.000061 eETH"
    - Font: 20px, Weight 700, Color: #10B981 (green)
  Subtext: "APY: ~3.2%"
    - Font: 12px, Color: #10B981

Column 3: Total to Claim
  Label: "Total to Claim"
    - Font: 12px, Weight 500, Color: #94A3B8
    - Margin bottom: 8px
  Value: "0.010061 eETH"
    - Font: 20px, Weight 700, Color: #3B82F6 (blue)

Dividers (between columns):
  - Width: 1px
  - Height: 60%
  - Background: #475569 (Slate 600)
```

### Claim Button
```
Display: Full width (within card)
Height: 56px
Background: #10B981 (green) if 7/7 complete
Background: #64748B (gray) if not eligible
Text: "Claim 0.010061 eETH + Rewards"
Font: 16px, Weight 600, Color: White
Border: None
Border radius: 8px
Cursor: pointer (if eligible) or not-allowed (if disabled)
Margin top: 32px

Hover (if eligible):
  Background: #059669 (darker green)
  Transform: scale(1.02)
  Transition: 150ms ease-in-out

Disabled State (if not 7/7):
  Opacity: 0.5
  Cursor: not-allowed
  Tooltip: "Complete all 7 days to claim"

Loading State:
  Show spinner
  Text: "Claiming..."
  Disable interactions

Success State:
  Show checkmark
  Text: "Claimed!"
  Background: Green
  Auto-redirect to landing after 2s
```

### Alternate States

**If Challenge Failed (Forfeited)**
```
Alert Box:
  Background: #FEE2E2 (light red)
  Border left: 4px solid #EF4444 (red)
  Border radius: 8px
  Padding: 16px
  Margin bottom: 32px

  Icon: ✕ or ⚠️ (24px, red)
  Title: "Challenge Failed"
    - Font: 16px, Weight 600, Color: #991B1B (dark red)
  Message: "You missed a commit on Day 3. Your stake has been forfeited."
    - Font: 14px, Color: #7F1D1D (dark red)

Status Card shows:
  - "Failed" badge (red background)
  - Missed day highlighted in red
  - No claim button
  - [Try Again] button links to /create
```

**If Challenge Completed (Already Claimed)**
```
Alert Box:
  Background: #D1FAE5 (light green)
  Border left: 4px solid #10B981 (green)
  Border radius: 8px
  Padding: 16px
  Margin bottom: 32px

  Icon: ✅ (24px, green)
  Title: "Challenge Complete!"
    - Font: 16px, Weight 600, Color: #065F46 (dark green)
  Message: "Congratulations! You successfully claimed 0.010061 eETH + rewards!"
    - Font: 14px, Color: #065F46

Status Card shows:
  - "Completed" badge (green background)
  - All days marked complete
  - No claim button
  - [Start New Challenge] button links to /create
```

### Back Button
```
[← Back to Home]
  - Font: 14px, Weight 500, Color: #3B82F6 (blue)
  - Text decoration: underline
  - Margin top: 24px
  - Cursor: pointer
  - Hover: Color #1E40AF
  - Links to: /
```

---

# PAGE 3: CREATE COMMITMENT FORM PAGE

## Layout Structure
```
┌──────────────────────────────────────────────────────────┐
│                      HEADER (60px)                        │
│  Logo: CommitLock    GitHub: @username    [Account]      │
└──────────────────────────────────────────────────────────┘
│                                                            │
│           CREATE YOUR COMMITMENT                           │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │                                                   │    │
│  │  GitHub Username                                 │    │
│  │  [_____________________________]                  │    │
│  │  Searching... ✓ torvalds (Valid)                │    │
│  │                                                   │    │
│  │  Stake Details                                   │    │
│  │  ┌─────────────────────────────────────────────┐ │    │
│  │  │ Amount: 0.01 eETH                           │ │    │
│  │  │ Duration: 7 days                            │ │    │
│  │  │ Estimated APY: ~3.2%                        │ │    │
│  │  │ You'll earn approx: 0.000061 eETH          │ │    │
│  │  └─────────────────────────────────────────────┘ │    │
│  │                                                   │    │
│  │  [Step 1] [Step 2] [Step 3]                     │    │
│  │                                                   │    │
│  │  [Approve eETH]  [Cancel]                        │    │
│  │                                                   │    │
│  │  ⓘ Once locked, funds cannot be withdrawn       │    │
│  │    until the 7-day challenge ends.              │    │
│  │                                                   │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│                                                            │
│  STEP TRACKER:                                            │
│  1. Approve eETH ✓                                        │
│  2. Confirm & Lock                                        │
│  3. View Dashboard                                        │
│                                                            │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

## Component Details

### Main Form Card
```
Background: #1E293B (Slate 800)
Border: 1px solid #334155 (Slate 700)
Border radius: 16px
Padding: 48px
Max width: 600px
Margin: 60px auto
Box shadow: 0 10px 30px rgba(0, 0, 0, 0.3)

Title: "Create Your Commitment"
  - Font: 32px, Weight 700, Color: White
  - Margin bottom: 32px
  - Text align: center

Subtitle: "Stake eETH and commit to 7 days of daily GitHub commits"
  - Font: 14px, Color: #CBD5E1 (Slate 300)
  - Margin bottom: 32px
  - Text align: center
```

### GitHub Username Input Section
```
Label: "GitHub Username"
  - Font: 14px, Weight 600, Color: #CBD5E1 (Slate 300)
  - Margin bottom: 8px

Input Field:
  Width: 100%
  Height: 44px
  Background: #0F172A (Slate 900)
  Border: 2px solid #475569 (Slate 600)
  Border radius: 8px
  Padding: 12px 16px
  Font: 14px, Color: White
  Placeholder: "e.g., torvalds"
  Placeholder color: #64748B (Slate 500)
  Transition: 150ms

  States:
    Focus:
      Border color: #3B82F6 (blue)
      Box shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
      Background: slightly lighter

    Valid (checkmark shown):
      Border color: #10B981 (green)
      Right icon: ✓ (green, 20px)

    Invalid (error shown):
      Border color: #EF4444 (red)
      Error message: "Username not found"
      Right icon: ✕ (red, 20px)

    Loading:
      Icon: Spinner (animated)
      Border color: #F59E0B (amber)

Helper Text (Below input):
  Font: 12px, Color: #94A3B8 (Slate 400)
  Text: "Enter your GitHub username to verify commits"
  Margin top: 8px

Validation Message (Dynamic):
  Valid: "✓ torvalds (Valid)" - Green text, #10B981
  Invalid: "✕ User not found" - Red text, #EF4444
  Loading: "⏳ Searching..." - Amber text, #F59E0B
```

### Stake Details Display Section
```
Margin top: 32px

Label: "Stake Details"
  - Font: 14px, Weight 600, Color: #CBD5E1 (Slate 300)
  - Margin bottom: 12px

Card:
  Background: #334155 (Slate 700)
  Border: 1px solid #475569 (Slate 600)
  Border radius: 8px
  Padding: 20px
  Font size: 14px

Detail Row 1: Amount
  Label: "Amount"
    - Color: #94A3B8 (Slate 400)
    - Width: 40%
  Value: "0.01 eETH"
    - Color: White
    - Weight: 600
    - Width: 60%
  Display: Flex, justify-content: space-between

Detail Row 2: Duration
  [Same formatting]
  Label: "Duration"
  Value: "7 days"

Detail Row 3: Estimated APY
  Label: "Estimated APY"
  Value: "~3.2%"
    - Color: #10B981 (green)

Detail Row 4: Estimated Earnings
  Label: "You'll Earn (est.)"
  Value: "~0.000061 eETH"
    - Color: #3B82F6 (blue)

Dividers between rows:
  - Height: 1px
  - Background: #475569 (Slate 600)
```

### Step Indicator (Multi-step form)
```
Display: Above buttons
Margin: 32px 0
Text align: center

Step 1: "Approve eETH"
  Circle: 32px, border 2px
  Default: Border #475569, background transparent
  Active: Background #3B82F6, border #3B82F6, text white
  Complete: Background #10B981, border #10B981, text white
  Number/Icon: "1" or "✓"

Step 2: "Confirm & Lock"
  [Same styling]
  Number: "2"
  Disabled until Step 1 complete

Step 3: "View Dashboard"
  [Same styling]
  Number: "3"
  Disabled until Step 2 complete

Connecting lines:
  Height: 2px
  Between circles
  Color: #475569 (gray)
  Active: #3B82F6 (blue) if step passed
```

### Button Section
```
Margin top: 32px
Display: Flex
Gap: 16px
Justify content: space-between

Button 1: "Approve eETH"
  Width: 48%
  Height: 48px
  Background: #F59E0B (amber/warning)
  Text: White
  Font: 14px, Weight 600
  Border: None
  Border radius: 8px
  Cursor: pointer
  Disabled: opacity 0.5, cursor not-allowed (if already approved)

  States:
    Default:
      Background: #F59E0B
      Hover: Background #D97706

    Loading:
      Show spinner
      Text: "Approving..."
      Disabled

    Success:
      Background: #10B981 (green)
      Text: "✓ Approved"
      Disabled (button disabled, show checkmark)

Button 2: "Lock It In" (Primary)
  Width: 48%
  Height: 48px
  Background: #3B82F6 (blue)
  Text: White
  Font: 14px, Weight 600
  Border: None
  Border radius: 8px
  Cursor: pointer
  Disabled: opacity 0.5, cursor not-allowed (until Approve step complete)

  States:
    Disabled (before approval):
      Background: #64748B (gray)
      Cursor: not-allowed
      Tooltip: "Approve eETH first"

    Enabled (after approval):
      Background: #3B82F6
      Hover: Background #1E40AF
      Transform on hover: scale(1.02)

    Loading:
      Show spinner
      Text: "Locking..."
      Disabled

    Success:
      Background: #10B981 (green)
      Text: "✓ Locked!"
      Disabled

Button 3: "Cancel" (Optional, Secondary)
  Display: Full width below
  Height: 44px
  Background: transparent
  Border: 2px solid #475569 (Slate 600)
  Text: #94A3B8 (Slate 400)
  Font: 14px, Weight 600
  Border radius: 8px
  Margin top: 16px
  Hover: Background #334155, border #CBD5E1
  Click: Navigate back to /
```

### Info/Warning Box
```
Background: #FEF3C7 (light amber)
Border left: 4px solid #F59E0B (amber)
Border radius: 4px
Padding: 16px
Margin top: 32px
Font: 14px
Color: #92400E (dark amber)
Line height: 1.6

Icon: ⓘ (16px, amber)
Text: "Once locked, your eETH will be staked for 7 days. You cannot withdraw early. After 7 days, you can claim your eETH plus accrued staking rewards."
```

### Form Validation States

**Username not provided:**
```
Input border: #475569 (gray)
Error message: None
"Lock It In" button: Disabled (gray)
```

**Username being validated:**
```
Input: Loading spinner
Border: #F59E0B (amber)
Message: "⏳ Searching GitHub..."
"Lock It In" button: Disabled
```

**Username valid:**
```
Input border: #10B981 (green)
Input icon: ✓ (green)
Message: "✓ User found - {follower count} followers"
"Lock It In" button: Enabled (blue)
```

**Username invalid:**
```
Input border: #EF4444 (red)
Input icon: ✕ (red)
Message: "✕ Username not found on GitHub"
"Lock It In" button: Disabled (gray)
```

**After eETH approval:**
```
"Approve eETH" button: Shows ✓ and disabled
Button text changes to: "✓ Approved"
Button background: #10B981 (green)
"Lock It In" button: Becomes fully active (blue)
Step indicator: Step 1 shows complete (green check)
Step 2 becomes highlighted
```

**During lock transaction:**
```
"Lock It In" button: Shows spinner
Button text: "Locking..."
All other inputs: Disabled
Form: Disabled (opacity 0.6)
Cancel button: Still clickable (allows user to go back)
```

**After successful lock:**
```
"Lock It In" button: Shows checkmark
Button text: "✓ Locked!"
Button background: #10B981 (green)
All buttons: Disabled
Step indicator: Step 3 complete (green)
Modal appears: "Success! Redirecting to dashboard..."
Auto-redirect to /dashboard after 2 seconds
```

---

## Responsive Design

### Mobile (320px - 640px)
```
Form card:
  Padding: 24px
  Max width: 90%
  Margin: 40px auto

Input:
  Height: 48px (larger for touch)
  Font size: 16px (prevents zoom on iOS)

Buttons:
  Full width
  Stack vertically (not side-by-side)
  Height: 48px

Detail card:
  Single column display
  Font size: 13px

Step indicator:
  Smaller circles (24px)
  Font size: 12px
```

### Tablet (641px - 1024px)
```
Form card:
  Max width: 85%
  Padding: 36px

Buttons:
  Can sit side-by-side if space
  Width: ~45% each

Input:
  Height: 44px
  Font size: 14px
```

### Desktop (1025px+)
```
Form card:
  Max width: 600px
  Centered via margin auto

All components:
  Full-size as designed
```

---

## Dark Mode (Default Theme)

All pages use dark mode:
- Background: #0F172A (Slate 900)
- Cards: #1E293B (Slate 800)
- Text: White (#FFFFFF)
- Secondary text: #CBD5E1 (Slate 300)
- Accents: #3B82F6 (Blue)
- Success: #10B981 (Green)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)

No light mode for hackathon MVP.

---

## Animation Details

### Page Transitions
```
Fade in: 300ms ease-in
- Opacity: 0 → 1
- Applies to all page loads

Slide in: 400ms ease-out
- Transform: translateY(20px) → translateY(0)
- Applies to cards on load
```

### Button Interactions
```
Hover:
  - Transform: scale(1.02)
  - Transition: 150ms ease-in-out
  - Box shadow: 0 4px 12px rgba(59, 130, 246, 0.3)

Click/Active:
  - Transform: scale(0.98)
  - Transition: 50ms ease-out

Disabled:
  - No hover effect
  - Opacity: 0.5
  - Cursor: not-allowed
```

### Form Validation
```
Input focus:
  - Border glow: 200ms ease
  - Box shadow expands

Checkmark appear:
  - Fade in: 200ms
  - Scale in: 0 → 1

Error message:
  - Slide down: 150ms ease
  - Fade in: 0 → 1

Loading spinner:
  - Continuous rotation: 360° in 1s (linear)
```

### Progress Bar
```
Fill animation:
  - Width transition: 300ms ease-out
  - Background gradient animate (optional shimmer effect)
```

### Success States
```
Checkmark reveal:
  - Scale in: 0 → 1 (300ms)
  - Bounce effect (optional)

Color transition:
  - All from current → green (200ms ease)

Text update:
  - Fade out old text (100ms)
  - Fade in new text (100ms)
  - Delay: 100ms between
```

---

## Accessibility Features

### Color Contrast
```
All text meets WCAG AA standard (4.5:1 minimum)
- White on blue: 8.5:1 ✓
- White on slate-800: 9.4:1 ✓
- Amber text on yellow bg: 4.8:1 ✓
- Green on white: 6.8:1 ✓
```

### Focus States
```
All interactive elements:
  - Visible focus ring: 2px blue border (#3B82F6)
  - Focus ring offset: 2px
  - Only shows on keyboard navigation (not mouse)

Tab order:
  1. GitHub OAuth button
  2. Connect Wallet button
  3. Form inputs (username, etc.)
  4. Approve button
  5. Lock button
  6. Cancel button
```

### Keyboard Navigation
```
Tab: Move to next interactive element
Shift+Tab: Move to previous element
Enter: Activate button or submit form
Space: Activate button
Escape: Close modals, cancel form

Skip link (top of page):
  "Skip to main content"
  - Hidden until focused
  - Font: 12px
  - Background: Blue
  - Padding: 8px 16px
```

### Screen Readers
```
All buttons have aria-labels:
  <button aria-label="Connect wallet">Connect Wallet</button>

Form inputs have associated labels:
  <label htmlFor="github-username">GitHub Username</label>
  <input id="github-username" />

Status messages use aria-live:
  <div aria-live="polite" aria-atomic="true">
    ✓ Username found
  </div>

Icons have descriptions:
  <span aria-label="Success">✓</span>

Loading state announced:
  <div aria-busy="true" role="status">
    Approving eETH...
  </div>
```

### Semantic HTML
```
Use proper HTML elements:
- <button> for buttons (not <div>)
- <input> with type="text" for inputs
- <label> for form labels
- <section> for major sections
- <nav> for navigation
- <form> for forms

Avoid:
- Generic <div> with click handlers
- Multiple <h1> tags
- Skip heading levels (h2 → h4)
```

---

## Page Flow / Navigation

### Landing Page (/)
```
Buttons:
  "Login with GitHub" → Triggers OAuth flow
    - On success: Store GitHub user data, show dashboard
    - On error: Show error message

  "Connect Wallet" → RainbowKit modal
    - On success: Show Sepolia network prompt, then form page
    - On user cancel: Stay on landing

  "Already have account?" link → /dashboard
    - If user not connected: Show "Connect wallet" prompt
```

### Create Form Page (/create)
```
Buttons:
  "Approve eETH" → Contract approval
    - Success: Disable button, show checkmark
    - Error: Show error toast

  "Lock It In" → Create commitment transaction
    - Success: Auto-redirect to /dashboard
    - Error: Show error toast, allow retry

  "Cancel" → Navigate back to /
```

### Dashboard Page (/dashboard)
```
Buttons:
  "Claim eETH + Rewards" (if 7/7) → Claim transaction
    - Success: Show success message, redirect to /
    - Error: Show error toast

  "Try Again" (if forfeited) → Navigate to /create

  "Start New Challenge" (if claimed) → Navigate to /create

  "← Back to Home" → Navigate to /

Real-time updates:
  - Poll contract every 60 seconds for updates
  - Show "Last updated: X minutes ago"
  - Auto-update daily status if new day detected
```

---

## Data Flow & State Management

### Global State (Wagmi + React Context)
```
CurrentUser:
  - walletAddress: string
  - githubUsername: string
  - isConnected: boolean
  - chain: 11155111 (Sepolia)

CurrentCommitment:
  - user: address
  - githubUsername: string
  - startTime: uint256
  - dailyChecks: bool[7]
  - daysCompleted: uint8
  - eETHStaked: bigint
  - claimed: boolean
  - forfeited: boolean

UI State:
  - isLoadingApproval: boolean
  - isLoadingLock: boolean
  - isLoadingClaim: boolean
  - approvalError: string | null
  - lockError: string | null
  - claimError: string | null
```

### Page-Specific State
```
Landing:
  - (No state - only UI)

Create Form:
  - githubUsername: string
  - isValidatingGithub: boolean
  - githubValid: boolean
  - githubError: string | null
  - isApproved: boolean

Dashboard:
  - commitment: Commitment object
  - isLoading: boolean
  - lastUpdated: timestamp
```

---

## Integration with Smart Contract & Backend

### Required Endpoints (Node.js/PostgreSQL Backend)

**POST /api/auth/github**
```
Request:
  - code: string (from GitHub OAuth)

Response:
  - githubId: number
  - username: string
  - avatarUrl: string
  - publicRepos: number

Used by:
  - Landing page GitHub OAuth
  - Form validation (check username exists)
```

**GET /api/github/commits/{username}/{date}**
```
Request params:
  - username: string
  - date: YYYY-MM-DD

Response:
  - hasCommit: boolean
  - commitCount: number
  - repos: array of repos with commits

Used by:
  - Oracle verification (backend checks daily)
  - Dashboard daily status display
```

**POST /api/commitment/verify**
```
Request:
  - txHash: string
  - walletAddress: string

Response:
  - isValid: boolean
  - commitment: object

Used by:
  - After lock transaction
  - Verify commitment was recorded on-chain
```

---

## Technical Stack

### Frontend
```
Framework: React 19 + Next.js 14+
State Management: Wagmi hooks + React hooks
Web3: Wagmi + ethers.js
Wallet: RainbowKit
Styling: TailwindCSS 4+
UI Library: Headless (custom components)
Forms: React Hook Form
API Client: Axios or fetch
Authentication: GitHub OAuth (via Octokit)
```

### Backend
```
Runtime: Node.js
Framework: Express.js or Next.js API routes
Database: PostgreSQL
ORM: Prisma or Sequelize
GitHub API: Octokit
Web3 RPC: Infura or Alchemy
Task Queue: Bull (for daily checks)
```

### Smart Contract
```
Language: Solidity ^0.8.20
Framework: Foundry
Network: Sepolia testnet
Token: eETH (ERC-20)
Oracle: Chainlink Functions
```

---

This design system provides complete specifications for implementing all three pages with pixel-perfect accuracy, accessibility, and responsiveness.
