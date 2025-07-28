/**
 * Format a number as currency
 * @param {number|string} value - The value to format
 * @param {Object} options - Options for formatting
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, options = {}) => {
  try {
    const numValue = typeof value === 'string' 
      ? parseFloat(value.replace(/[^0-9.-]+/g, '')) 
      : Number(value) || 0;
      
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      ...options
    }).format(numValue);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '$0';
  }
};

/**
 * Format a number as a percentage
 * @param {number|string} value - The value to format (e.g., 5.5 for 5.5%)
 * @param {Object} options - Options for formatting
 * @returns {string} Formatted percentage string
 */
export const formatPercent = (value, options = {}) => {
  try {
    const numValue = typeof value === 'string' 
      ? parseFloat(value.replace(/[^0-9.-]+/g, ''))
      : Number(value) || 0;
      
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
      ...options
    }).format(numValue / 100);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return '0.00%';
  }
};

/**
 * Format a large number with K, M, B suffixes
 * @param {number|string} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatLargeNumber = (num) => {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(value)) return '0';
  
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B';
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
};

/**
 * Format a date string
 * @param {string|Date} date - The date to format
 * @param {Object} options - Options for formatting
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  try {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('en-US', defaultOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};
