import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import { useWallet } from '../../context/WalletContext';

export default function Landing() {
  const navigate = useNavigate();
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-20">
      {/* Hero Section */}
      <div className="text-center py-20 px-6">
        <h1 className="text-6xl font-bold text-white mb-6">Commit or Forfeit</h1>
        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
          Stake eETH on your daily GitHub commits. Complete 7 days and earn staking rewards.
          Miss even one day and forfeit your stake.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button variant="secondary" size="lg">
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
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-base"
          >
            Go to Dashboard
          </Button>
        )}
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-6 bg-slate-800">
        <h2 className="text-4xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { step: 'Stake', desc: 'Deposit 0.01 eETH to start' },
            { step: 'Commit', desc: 'Make at least 1 GitHub commit daily' },
            { step: 'Track', desc: 'Monitor your 7-day progress' },
            { step: 'Claim', desc: 'Earn rewards if you complete all 7 days' },
          ].map((item, i) => (
            <Card key={i} className="text-center">
              <h3 className="text-xl font-bold text-blue-400 mb-3">{item.step}</h3>
              <p className="text-slate-300">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-400">
        <p>© 2025 CommitLock | Built for Hackathon</p>
      </footer>
    </div>
  );
}
