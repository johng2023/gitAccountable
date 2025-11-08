import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { COMMIT_LOCK_ADDRESS, COMMIT_LOCK_ABI, STAKE_AMOUNT } from '../config/contracts';

/**
 * Hook to create a commitment
 * @returns {object} Functions and state for creating commitment
 */
export function useCreateCommitment() {
  const {
    data: hash,
    isPending,
    writeContract,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Create a commitment
   * @param {string} githubUsername - GitHub username
   */
  const createCommitment = (githubUsername) => {
    writeContract({
      address: COMMIT_LOCK_ADDRESS,
      abi: COMMIT_LOCK_ABI,
      functionName: 'createCommitment',
      args: [githubUsername],
      value: parseEther(STAKE_AMOUNT),
    });
  };

  return {
    createCommitment,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: writeError || confirmError,
  };
}
