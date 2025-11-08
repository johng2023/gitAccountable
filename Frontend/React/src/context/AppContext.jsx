import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    githubUsername: null,
    walletAddress: null,
  });

  const [commitment, setCommitment] = useState(null);

  const [uiState, setUiState] = useState({
    isLoading: false,
    error: null,
    successMessage: null,
  });

  const value = {
    user,
    setUser,
    commitment,
    setCommitment,
    uiState,
    setUiState,
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
