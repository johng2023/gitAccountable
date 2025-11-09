import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Input from "../common/Input";
import Card from "../common/Card";
import { useGitHub } from "../../hooks/useGitHub";
import { useCommitment } from "../../hooks/useCommitment";
import { useWallet } from "../../context/WalletContext";
import { useApp } from "../../context/AppContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function CreateCommitment() {
  const navigate = useNavigate();
  const { address, isConnected } = useWallet();
  const { setUser, setCommitment, commitment, user } = useApp();
  const { validateUsername, isLoading: gitHubLoading } = useGitHub();
  const { createCommitment, isLoading: commitLoading } = useCommitment();

  // Redirect to dashboard if commitment already exists
  useEffect(() => {
    if (commitment) {
      navigate("/dashboard");
    }
  }, [commitment, navigate]);

  // Redirect to home if wallet is not connected
  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected, navigate]);

  // Auto-populate GitHub username from context
  const [username, setUsername] = useState("");
  const [eethAmount, setEethAmount] = useState("0.01");
  const [stakingPeriod, setStakingPeriod] = useState("7");
  const [validationError, setValidationError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [approvalDone, setApprovalDone] = useState(false);

  // Auto-populate username when component mounts
  useEffect(() => {
    if (user?.githubUsername) {
      setUsername(user.githubUsername);
      setIsValid(true);
    }
  }, [user?.githubUsername]);

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
        setValidationError("Invalid GitHub username");
      }
    }
  };

  const handleApprove = async () => {
    // Mock approval - in real app, this calls smart contract
    setApprovalDone(true);
  };

  const handleLockIn = async () => {
    if (!isValid) {
      setValidationError("Please validate GitHub username first");
      return;
    }

    if (!eethAmount || parseFloat(eethAmount) <= 0) {
      setValidationError("Please enter a valid eETH amount");
      return;
    }

    if (!stakingPeriod || parseInt(stakingPeriod) <= 0) {
      setValidationError("Please enter a valid staking period");
      return;
    }

    const result = await createCommitment(address, username, eethAmount, stakingPeriod);
    if (result) {
      setUser({ githubUsername: username, walletAddress: address });
      setCommitment(result);
      navigate("/dashboard");
    }
  };

  // Show connect wallet message if not connected
  if (!isConnected) {
    return (
      <div className="page-container">
        <div className="content-width text-center">
          <h1>Connect Your Wallet</h1>
          <p className="mb-6">
            Please connect your wallet to create a commitment
          </p>
          <div className="connect-wallet-wrapper">
            <ConnectButton />
          </div>
          <Button
            onClick={() => navigate("/")}
            className="mt-6"
            variant="ghost"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-width">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid #334155'
        }}>
          <button onClick={() => navigate("/")} className="link-button">
            ← Back to Home
          </button>
          {user?.githubUsername && (
            <span style={{ color: '#cbd5e1', fontSize: '13px' }}>
              Logged in as <strong>@{user.githubUsername}</strong>
            </span>
          )}
        </div>
        <h1>Create Commitment</h1>

        {/* GitHub Info Card */}
        <Card className="mb-8">
          <h2>Your GitHub Account</h2>
          <div style={{ padding: '16px', backgroundColor: '#1e293b', borderRadius: '4px' }}>
            <p style={{ color: '#cbd5e1', margin: '0 0 8px 0', fontSize: '14px' }}>
              Connected Account
            </p>
            <p style={{ color: '#ffffff', margin: '0', fontSize: '18px', fontWeight: '600' }}>
              @{user?.githubUsername || 'Not connected'}
            </p>
          </div>
        </Card>

        {/* Stake Details Card */}
        <Card className="mb-8">
          <h2>Stake Details</h2>
          <div className="form-group">
            <label htmlFor="eethAmount">eETH Amount to Stake</label>
            <Input
              id="eethAmount"
              type="number"
              placeholder="0.01"
              value={eethAmount}
              onChange={(e) => setEethAmount(e.target.value)}
              step="0.01"
              min="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="stakingPeriod">Staking Period (days)</label>
            <Input
              id="stakingPeriod"
              type="number"
              placeholder="7"
              value={stakingPeriod}
              onChange={(e) => setStakingPeriod(e.target.value)}
              step="1"
              min="1"
            />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Make at least 1 GitHub commit per day for the staking period to earn rewards.
            Missing a day will forfeit your stake.
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="button-group">
          <Button
            variant={approvalDone ? "ghost" : "secondary"}
            size="lg"
            onClick={handleApprove}
            disabled={!isValid || approvalDone}
            className="flex-1"
          >
            {approvalDone ? "Approved" : "Approve eETH"}
          </Button>
          <Button
            size="lg"
            onClick={handleLockIn}
            disabled={!approvalDone || commitLoading}
            className="flex-1"
          >
            {commitLoading ? "Locking..." : "Lock It In"}
          </Button>
        </div>
      </div>
    </div>
  );
}
