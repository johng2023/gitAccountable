import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    githubUsername: null,
    walletAddress: null,
  });

  const [commitment, setCommitment] = useState(null);

  const [jwtToken, setJwtToken] = useState(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('jwt_token') || null;
  });

  const [uiState, setUiState] = useState({
    isLoading: false,
    error: null,
    successMessage: null,
  });

  const logout = () => {
    // Clear app state
    setUser({
      githubUsername: null,
      walletAddress: null,
    });
    setCommitment(null);
    setJwtToken(null);
    setUiState({
      isLoading: false,
      error: null,
      successMessage: null,
    });

    // Clear localStorage
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');

    // Clear all stored commitments
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('commitment_')) {
        localStorage.removeItem(key);
      }
    });
  };

  const value = {
    user,
    setUser,
    commitment,
    setCommitment,
    jwtToken,
    setJwtToken,
    uiState,
    setUiState,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
