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
  const { setUser, setCommitment, commitment } = useApp();
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

  const [username, setUsername] = useState("");
  const [validationError, setValidationError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [approvalDone, setApprovalDone] = useState(false);

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

    const result = await createCommitment(address, username, "0.01");
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
        <div className="page-nav">
          <button onClick={() => navigate("/")} className="link-button">
            ← Back to Home
          </button>
        </div>
        <h1>Create Commitment</h1>

        {/* Form Card */}
        <Card className="mb-8">
          <h2>GitHub Information</h2>
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
          <h2>Stake Details</h2>
          <div className="details-grid">
            <div className="detail-row">
              <span>Stake Amount:</span>
              <span className="detail-value">0.01 eETH</span>
            </div>
            <div className="detail-row">
              <span>Duration:</span>
              <span className="detail-value">7 days</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Make at least 1 GitHub commit per day for 7 days to earn rewards.
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
