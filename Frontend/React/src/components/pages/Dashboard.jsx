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
