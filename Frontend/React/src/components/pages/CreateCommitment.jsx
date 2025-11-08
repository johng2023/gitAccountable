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
    <div className="page-container">
      <div className="content-width">
        <h1>Create Commitment</h1>

        {/* Step Indicator */}
        <div className="step-indicator">
          {[1, 2, 3].map((num) => (
            <div key={num} className={step >= num ? 'step active' : 'step'}>
              <p className="step-label">Step {num}</p>
              <p className="step-desc">
                {num === 1 && 'Approve eETH'}
                {num === 2 && 'Confirm & Lock'}
                {num === 3 && 'View Dashboard'}
              </p>
            </div>
          ))}
        </div>

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
            <div className="detail-row">
              <span>Estimated APY:</span>
              <span className="detail-value">~3.2%</span>
            </div>
            <div className="detail-row detail-divider">
              <span>Estimated Earnings:</span>
              <span className="detail-value earnings">~0.000061 eETH</span>
            </div>
          </div>
        </Card>

        {/* Warning Box */}
        <Card className="warning-box mb-8">
          <p>
            Your funds will be locked for 7 days. You must make at least 1 GitHub commit per day
            to claim rewards. Missing even one day will result in losing your stake.
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="button-group">
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
