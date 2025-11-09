import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { COMMIT_LOCK_ADDRESS, COMMIT_LOCK_ABI } from '../config/contracts';

/**
 * Hook to claim funds after successful commitment
 * @returns {object} Functions and state for claiming
 */
export function useClaimFunds() {
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
   * Claim eETH rewards
   */
  const claimFunds = () => {
    writeContract({
      address: COMMIT_LOCK_ADDRESS,
      abi: COMMIT_LOCK_ABI,
      functionName: 'claimFunds',
      gas: 150000n, // Manual gas limit: actual max is ~60k, using 150k for safety
    });
  };

  return {
    claimFunds,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: writeError || confirmError,
  };
}
