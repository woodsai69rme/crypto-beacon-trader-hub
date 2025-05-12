
import { AITradingStrategy, CoinOption, PriceAlertFormData } from '@/types/trading';

// Mock coin data
export const mockCoinData: CoinOption[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 51234.78,
    priceChange: 1245.67,
    changePercent: 2.43,
    value: 'bitcoin',
    label: 'Bitcoin (BTC)',
    marketCap: 958762000000,
    volume: 28765000000,
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2487.32,
    priceChange: 87.45,
    changePercent: 3.64,
    value: 'ethereum',
    label: 'Ethereum (ETH)',
    marketCap: 297845000000,
    volume: 14532000000,
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 143.89,
    priceChange: 8.76,
    changePercent: 6.48,
    value: 'solana',
    label: 'Solana (SOL)',
    marketCap: 61287000000,
    volume: 2876500000,
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png'
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.43,
    priceChange: 0.012,
    changePercent: 2.87,
    value: 'cardano',
    label: 'Cardano (ADA)',
    marketCap: 15245000000,
    volume: 432500000,
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png'
  },
  {
    id: 'ripple',
    name: 'XRP',
    symbol: 'XRP',
    price: 0.53,
    priceChange: 0.023,
    changePercent: 4.54,
    value: 'ripple',
    label: 'XRP (XRP)',
    marketCap: 28975000000,
    volume: 1234500000,
    image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png'
  }
];

// Mock AI trading strategies
export const mockAIStrategies: AITradingStrategy[] = [
  {
    id: 'strategy-1',
    name: 'BTC Trend Follower',
    description: 'Follows Bitcoin trends using moving average crossovers',
    type: 'trend-following',
    timeframe: '4h',
    assets: ['bitcoin', 'ethereum'],
    parameters: {
      shortMaPeriod: 9,
      longMaPeriod: 21,
      takeProfitPct: 3.5,
      stopLossPct: 2.5
    },
    performance: {
      winRate: 65,
      profitFactor: 1.8,
      trades: 125,
      returns: 42.5
    }
  },
  {
    id: 'strategy-2',
    name: 'ETH Mean Reversion',
    description: 'Trades Ethereum mean reversion using Bollinger Bands',
    type: 'mean-reversion',
    timeframe: '1h',
    assets: ['ethereum', 'solana'],
    parameters: {
      bbPeriod: 20,
      bbDeviation: 2,
      rsiPeriod: 14,
      rsiOverbought: 70,
      rsiOversold: 30
    },
    performance: {
      winRate: 72,
      profitFactor: 2.1,
      trades: 210,
      returns: 56.8
    }
  }
];

// Default price alert form data
export const defaultPriceAlertFormData: PriceAlertFormData = {
  coinId: 'bitcoin',
  coinName: 'Bitcoin',
  coinSymbol: 'BTC',
  targetPrice: 55000,
  currentPrice: 51234.78,
  isAbove: true,
  active: true,
  recurring: false,
  notifyVia: ['app']
};
