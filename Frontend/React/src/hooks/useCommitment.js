import { useReadContract } from 'wagmi';
import { COMMIT_LOCK_ADDRESS, COMMIT_LOCK_ABI } from '../config/contracts';

/**
 * Hook to fetch commitment data for a user
 * @param {string} address - User's wallet address
 * @returns {object} Commitment data and loading state
 */
export function useCommitment(address) {
  const {
    data: commitment,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: COMMIT_LOCK_ADDRESS,
    abi: COMMIT_LOCK_ABI,
    functionName: 'getCommitmentWithRewards',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  // Parse commitment data
  const parsedCommitment = commitment ? {
    user: commitment[0].user,
    githubUsername: commitment[0].githubUsername,
    startTime: commitment[0].startTime,
    eethAmount: commitment[0].eethAmount,
    dailyChecks: commitment[0].dailyChecks,
    daysCompleted: commitment[0].daysCompleted,
    claimed: commitment[0].claimed,
    forfeited: commitment[0].forfeited,
    currentEethValue: commitment[1],
    contractEethBalance: commitment[2],
  } : null;

  return {
    commitment: parsedCommitment,
    isLoading,
    isError,
    refetch,
  };
}

/**
 * Hook to check if user can claim
 * @param {string} address - User's wallet address
 * @returns {boolean} Whether user can claim
 */
export function useCanClaim(address) {
  const { data: canClaim } = useReadContract({
    address: COMMIT_LOCK_ADDRESS,
    abi: COMMIT_LOCK_ABI,
    functionName: 'canClaim',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  return canClaim || false;
}

/**
 * Hook to check if user has active commitment
 * @param {string} address - User's wallet address
 * @returns {boolean} Whether commitment is active
 */
export function useIsCommitmentActive(address) {
  const { data: isActive } = useReadContract({
    address: COMMIT_LOCK_ADDRESS,
    abi: COMMIT_LOCK_ABI,
    functionName: 'isCommitmentActive',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  return isActive || false;
}
