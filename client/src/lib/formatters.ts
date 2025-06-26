// Text and number formatting utilities
export const formatSeatChange = (difference: number): string => {
  if (difference > 0) return `+${difference}`;
  if (difference < 0) return `${difference}`;
  return '0';
};

export const getSeatChangeColor = (difference: number): string => {
  if (difference > 0) return 'text-green-600';
  if (difference < 0) return 'text-red-600';
  return 'text-gray-500';
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDuration = (days: number): string => {
  if (days === 1) return '1 day';
  return `${days} days`;
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};