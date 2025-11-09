import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';

export default function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setJwtToken } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const exchangeCodeForToken = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code) {
          setError('No authorization code received from GitHub');
          setLoading(false);
          return;
        }

        // Call backend to exchange code for token
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/github`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, state })
          }
        );

        if (!response.ok) {
          throw new Error(`Backend error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          // Store JWT token in localStorage
          localStorage.setItem('jwt_token', data.token);
          localStorage.setItem('github_user', JSON.stringify(data.user));

          // Update app context
          setUser({
            githubUsername: data.user.username,
            walletAddress: null // Will be set when wallet connects
          });
          setJwtToken(data.token);

          // Redirect to create commitment or dashboard
          navigate('/create', { replace: true });
        } else {
          setError(data.error || 'Failed to authenticate with GitHub');
        }
      } catch (err) {
        console.error('GitHub OAuth error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    exchangeCodeForToken();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="page-container">
      <div className="content-width text-center">
        {loading ? (
          <>
            <h1>Authenticating with GitHub...</h1>
            <p style={{ marginTop: '20px', color: '#cbd5e1' }}>
              Please wait while we verify your GitHub account.
            </p>
            <div style={{
              marginTop: '40px',
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #334155',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </>
        ) : error ? (
          <>
            <h1>Authentication Failed</h1>
            <p style={{ marginTop: '20px', color: '#ef4444' }}>
              {error}
            </p>
            <div style={{ marginTop: '40px' }}>
              <Button onClick={() => navigate('/')}>
                ← Back to Home
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
                style={{ marginLeft: '16px' }}
              >
                Try Again
              </Button>
            </div>
          </>
        ) : null}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
