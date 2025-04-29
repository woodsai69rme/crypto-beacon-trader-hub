
/**
 * Format a number as currency
 * @param value The number to format
 * @param currency The currency code (default: USD)
 * @param locale The locale to use for formatting (default: en-US)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(value);
};

/**
 * Format a number as percentage
 * @param value The number to format (0.1 = 10%)
 * @param decimalPlaces Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number, 
  decimalPlaces: number = 2
): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });
  
  return formatter.format(value / 100);
};

/**
 * Format a number with thousand separators
 * @param value The number to format
 * @param decimalPlaces Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number, 
  decimalPlaces: number = 2
): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });
  
  return formatter.format(value);
};

/**
 * Format a market cap value to a readable format
 * @param marketCap The market cap value
 * @returns Formatted market cap string (e.g., $1.2B)
 */
export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1_000_000_000) {
    return `$${(marketCap / 1_000_000_000).toFixed(2)}B`;
  } else if (marketCap >= 1_000_000) {
    return `$${(marketCap / 1_000_000).toFixed(2)}M`;
  } else if (marketCap >= 1_000) {
    return `$${(marketCap / 1_000).toFixed(2)}K`;
  }
  
  return `$${marketCap.toFixed(2)}`;
};

/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @param locale The locale to use for formatting (default: en-US)
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string, 
  locale: string = 'en-US'
): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a date with time
 * @param dateString ISO date string
 * @param locale The locale to use for formatting (default: en-US)
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  dateString: string, 
  locale: string = 'en-US'
): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return dateString;
  }
};
