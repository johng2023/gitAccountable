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
      <div className="page-container">
        <div className="content-width text-center">
          <p>No active commitment found</p>
          <Button onClick={() => navigate('/create')} className="mt-6">
            Create New Commitment
          </Button>
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
        <h1>Dashboard</h1>

        {/* Status Card */}
        <Card className="mb-8">
          <div className="card-header">
            <div>
              <p className="label">GitHub Username</p>
              <h2>@{commitment.githubUsername}</h2>
            </div>
            <Badge status={commitment.status}>
              {commitment.status.charAt(0).toUpperCase() + commitment.status.slice(1)}
            </Badge>
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
          </div>
        </Card>

        {/* Progress Section */}
        <Card className="mb-8">
          <ProgressBar current={commitment.daysComplete} total={7} />
        </Card>

        {/* 7-Day Grid */}
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

        {/* Rewards Card */}
        <Card className="mb-8">
          <h3>Rewards Summary</h3>
          <div className="details-grid">
            <div className="detail-row">
              <span>Original Stake</span>
              <span className="detail-value">{commitment.stakeAmount} eETH</span>
            </div>
            <div className="detail-row">
              <span>Accrued Rewards</span>
              <span className="detail-value earnings">{commitment.rewards} eETH</span>
            </div>
            <div className="detail-row detail-divider">
              <span className="detail-bold">Total to Claim</span>
              <span className="detail-value detail-bold">
                {(parseFloat(commitment.stakeAmount) + parseFloat(commitment.rewards)).toFixed(6)} eETH
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
