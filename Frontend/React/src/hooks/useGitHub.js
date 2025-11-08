import { useState } from 'react';
import { api } from '../services/api';

export function useGitHub() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateUsername = async (username) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.validateGitHub(username);
      if (result.valid) {
        setUser(result.user);
      }
      return result.valid;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearUser = () => {
    setUser(null);
    setError(null);
  };

  return {
    user,
    isLoading,
    error,
    validateUsername,
    clearUser,
  };
}
