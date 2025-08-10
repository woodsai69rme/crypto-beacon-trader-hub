
import { CoinOption } from '@/types/trading';

/**
 * Converts a coin option from one type to another if needed
 */
export function normalizeCoinOption(coin: any): CoinOption {
  return {
    id: coin.id || '',
    name: coin.name || '',
    symbol: coin.symbol || '',
    price: coin.price || 0,
    priceChange: coin.priceChange || 0,
    changePercent: coin.changePercent || 0,
    change24h: coin.change24h || coin.changePercent || 0, // Add change24h
    image: coin.image || '',
    volume: coin.volume || 0,
    marketCap: coin.marketCap || 0,
    value: coin.value || coin.id || '',
    label: coin.label || `${coin.name} (${coin.symbol})`,
  };
}

/**
 * Formats number as currency
 */
export function formatCurrency(
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Formats percentage value
 */
export function formatPercentage(value: number, digits: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`;
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + 'K';
  }
  return num.toFixed(2);
}

/**
 * Get color based on percentage change
 */
export function getChangeColor(change: number): string {
  if (change > 0) return 'text-green-500';
  if (change < 0) return 'text-red-500';
  return 'text-gray-500';
}

/**
 * Parse ISO date string to locale date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
  return date.toLocaleString();
}

/**
 * Calculate profit/loss from a trade
 */
export function calculateProfitLoss(
  type: 'buy' | 'sell',
  amount: number,
  entryPrice: number,
  currentPrice: number
): number {
  if (type === 'buy') {
    return (currentPrice - entryPrice) * amount;
  } else {
    return (entryPrice - currentPrice) * amount;
  }
}
