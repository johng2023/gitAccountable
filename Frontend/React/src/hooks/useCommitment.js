import { useState } from 'react';
import { api } from '../services/api';

export function useCommitment() {
  const [commitment, setCommitment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCommitment = async (walletAddress) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getCommitment(walletAddress);
      setCommitment(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createCommitment = async (walletAddress, githubUsername, stakeAmount, stakingPeriod = 7) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.createCommitment(walletAddress, githubUsername, stakeAmount, stakingPeriod);
      setCommitment(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const claimRewards = async (commitmentId) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.claimRewards(commitmentId);
      if (commitment) {
        setCommitment({ ...commitment, status: 'completed' });
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    commitment,
    isLoading,
    error,
    getCommitment,
    createCommitment,
    claimRewards,
  };
}
