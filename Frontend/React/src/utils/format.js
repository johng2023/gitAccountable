// Format utilities

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEETH = (amount) => {
  const num = parseFloat(amount);
  return num.toFixed(6);
};

export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString();
};

export const calculateRewards = (stakeAmount, daysComplete, apy = 3.2) => {
  const dailyRate = apy / 100 / 365;
  const rewards = parseFloat(stakeAmount) * dailyRate * daysComplete;
  return rewards.toFixed(6);
};
