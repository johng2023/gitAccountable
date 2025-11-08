import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { useWallet } from '../../context/WalletContext';
import { useCommitment } from '../../hooks/useCommitment';
import { formatAddress } from '../../utils/format';

export default function Dashboard() {
  const navigate = useNavigate();
  const { address } = useWallet();
  const { commitment, setCommitment } = useApp();
  const { getCommitment, claimRewards, isLoading } = useCommitment();

  // Fetch commitment when address is available
  useEffect(() => {
    if (!address) {
      // No wallet connected, redirect to landing
      navigate('/');
      return;
    }

    // Only fetch if we don't already have a commitment
    if (!commitment) {
      getCommitment(address).then((data) => {
        if (data) {
          setCommitment(data);
        } else {
          // No commitment found, redirect to create form
          navigate('/create');
        }
      }).catch(() => {
        // Error fetching commitment, redirect to create form
        navigate('/create');
      });
    }
  }, [address, commitment, getCommitment, setCommitment, navigate]);

  // Show loading state while checking for commitment
  if (!address) {
    return (
      <div className="page-container">
        <div className="content-width text-center">
          <p>Please connect your wallet</p>
          <Button onClick={() => navigate('/')} className="mt-6">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!commitment) {
    // This should redirect to /create, but show a message just in case
    return (
      <div className="page-container">
        <div className="content-width text-center">
          <p>No active commitment found. Redirecting...</p>
        </div>
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
    <div className="page-container">
      <div className="content-width">
        <div className="page-nav">
          <button onClick={() => navigate('/')} className="link-button">← Back to Home</button>
        </div>
        <h1>Dashboard</h1>

        {/* Status Card */}
        <Card className="mb-8">
          <div className="card-header">
            <div>
              <p className="label">GitHub Username</p>
              <h2>@{commitment.githubUsername}</h2>
            </div>
            <div>
              <p className="label">Status</p>
              <p className="value">{commitment.status.charAt(0).toUpperCase() + commitment.status.slice(1)}</p>
            </div>
          </div>

          <div className="grid-2 pt-6 border-top">
            <div>
              <p className="label">Stake Amount</p>
              <p className="value">{commitment.stakeAmount} eETH</p>
            </div>
            <div>
              <p className="label">Wallet</p>
              <p className="value mono">{formatAddress(commitment.walletAddress)}</p>
            </div>
            <div>
              <p className="label">Progress</p>
              <p className="value">{commitment.daysComplete}/7 days complete</p>
            </div>
          </div>
        </Card>

        {/* Daily Progress */}
        <Card className="mb-8">
          <h3>Daily Progress</h3>
          <div className="grid-7">
            {commitment.daysArray.map((day) => (
              <div
                key={day.day}
                className={
                  day.status === 'complete'
                    ? 'day-box day-complete'
                    : day.status === 'pending'
                    ? 'day-box day-pending'
                    : 'day-box day-missed'
                }
              >
                Day {day.day}
              </div>
            ))}
          </div>
        </Card>

        {/* Rewards */}
        <Card className="mb-8">
          <h3>Rewards</h3>
          <div className="details-grid">
            <div className="detail-row">
              <span>Stake</span>
              <span className="detail-value">{commitment.stakeAmount} eETH</span>
            </div>
            <div className="detail-row">
              <span>Rewards</span>
              <span className="detail-value earnings">{commitment.rewards || '0'} eETH</span>
            </div>
            <div className="detail-row detail-divider">
              <span className="detail-bold">Total</span>
              <span className="detail-value detail-bold">
                {(parseFloat(commitment.stakeAmount) + parseFloat(commitment.rewards || 0)).toFixed(6)} eETH
              </span>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <div className="button-group">
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
            <div className="error-box">
              Challenge Failed - Your stake has been forfeited
            </div>
          )}
          {commitment.status === 'active' && (
            <p className="info-text">Keep up with your daily commits to complete the challenge</p>
          )}
        </div>
      </div>
    </div>
  );
}
