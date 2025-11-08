import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import { useWallet } from '../../context/WalletContext';

export default function Landing() {
  const navigate = useNavigate();
  const { isConnected } = useWallet();

  return (
    <div className="hero-section">
      {/* Hero Section */}
      <div className="hero">
        <h1>Commit or Forfeit</h1>
        <p>
          Stake eETH on your daily GitHub commits. Complete 7 days and earn staking rewards.
          Miss even one day and forfeit your stake.
        </p>

        <div className="button-group">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              // GitHub OAuth - redirect to GitHub auth endpoint
              window.location.href = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID || 'your_client_id'}&redirect_uri=${window.location.origin}/callback&scope=user`;
            }}
          >
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
          <div className="button-group">
            <Button
              variant="ghost"
              onClick={() => navigate('/create')}
              className="ghost-action"
            >
              Create New Commitment
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="ghost-action"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="grid-4">
          {[
            { step: 'Stake', desc: 'Deposit 0.01 eETH to start' },
            { step: 'Commit', desc: 'Make at least 1 GitHub commit daily' },
            { step: 'Track', desc: 'Monitor your 7-day progress' },
            { step: 'Claim', desc: 'Earn rewards if you complete all 7 days' },
          ].map((item, i) => (
            <Card key={i} className="card-center">
              <h3>{item.step}</h3>
              <p>{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 CommitLock | Built for Hackathon</p>
      </footer>
    </div>
  );
}
