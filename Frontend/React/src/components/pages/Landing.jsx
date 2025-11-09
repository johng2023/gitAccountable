import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Card from "../common/Card";
import { useWallet } from "../../context/WalletContext";
import { useCommitment } from "../../hooks/useCommitment";
import { useApp } from "../../context/AppContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Landing() {
  const navigate = useNavigate();
  const { isConnected, address } = useWallet();
  const { getCommitment } = useCommitment();
  const { commitment, setCommitment, user, logout } = useApp();

  // Check for existing commitment when wallet is connected
  // Only check once when wallet connects, not on every render
  useEffect(() => {
    if (isConnected && address && !commitment && user?.githubUsername) {
      let isMounted = true;
      getCommitment(user.githubUsername, address)
        .then((data) => {
          if (isMounted && data) {
            setCommitment(data);
            // Redirect to dashboard if commitment exists
            navigate("/dashboard", { replace: true });
          }
        })
        .catch(() => {
          // Silently fail - user can create new commitment
        });
      return () => {
        isMounted = false;
      };
    }
  }, [isConnected, address, user?.githubUsername, commitment, navigate, getCommitment, setCommitment]); // Only redirect if both wallet AND GitHub are connected

  return (
    <div className="hero-section">
      {/* Header with Logout */}
      {user?.githubUsername && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 0',
          marginBottom: '20px',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
            Logged in as <strong>{user.githubUsername}</strong>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              navigate('/');
            }}
            style={{ padding: '8px 12px', fontSize: '12px' }}
          >
            Logout
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <div className="hero">
        <h1>Commit or Forfeit</h1>
        <p>
          Stake eETH on your daily GitHub commits. Complete 7 days and earn
          staking rewards. Miss even one day and forfeit your stake.
        </p>

        {!user?.githubUsername ? (
          <div className="button-group">
            <Button
              size="lg"
              onClick={() => {
                // GitHub OAuth - redirect to GitHub auth endpoint
                window.location.href = `https://github.com/login/oauth/authorize?client_id=${
                  import.meta.env.VITE_GITHUB_CLIENT_ID || "your_client_id"
                }&redirect_uri=${window.location.origin}/callback&scope=user`;
              }}
            >
              Step 1: Login with GitHub
            </Button>
          </div>
        ) : !isConnected ? (
          <div className="button-group">
            <p style={{ color: "#cbd5e1", marginBottom: "20px", fontSize: "16px" }}>
              Welcome, <strong>{user.githubUsername}</strong>!
            </p>
            <ConnectButton label="Step 2: Connect Your Wallet" />
          </div>
        ) : (
          <div className="button-group">
            <p style={{ color: "#cbd5e1", marginBottom: "20px", fontSize: "16px" }}>
              Welcome, <strong>{user.githubUsername}</strong>!
            </p>
            <Button size="lg" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/create")}
            >
              Create New Commitment
            </Button>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="grid-4">
          {[
            { step: "Stake", desc: "Deposit 0.01 eETH to start" },
            { step: "Commit", desc: "Make at least 1 GitHub commit daily" },
            { step: "Track", desc: "Monitor your 7-day progress" },
            { step: "Claim", desc: "Earn rewards if you complete all 7 days" },
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
        <p>© 2025 GitAccountable</p>
      </footer>
    </div>
  );
}
