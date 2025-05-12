
import { CoinOption, AITradingStrategy } from '@/types/trading';

// Mock cryptocurrency data
export const mockCoinData: CoinOption[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', value: 'bitcoin', label: 'BTC - Bitcoin', price: 62453.21, priceChange: 1245.32, changePercent: 2.03 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', value: 'ethereum', label: 'ETH - Ethereum', price: 3287.54, priceChange: 65.43, changePercent: 2.03 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', value: 'solana', label: 'SOL - Solana', price: 142.74, priceChange: 4.35, changePercent: 3.14 },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', value: 'ripple', label: 'XRP - Ripple', price: 0.52, priceChange: 0.015, changePercent: 2.97 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', value: 'cardano', label: 'ADA - Cardano', price: 0.45, priceChange: -0.02, changePercent: -4.25 },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', value: 'dogecoin', label: 'DOGE - Dogecoin', price: 0.14, priceChange: 0.005, changePercent: 3.70 },
  { id: 'binancecoin', symbol: 'BNB', name: 'Binance Coin', value: 'binancecoin', label: 'BNB - Binance Coin', price: 595.32, priceChange: 12.54, changePercent: 2.15 },
];

// Mock AI Trading Strategies
export const mockAIStrategies: AITradingStrategy[] = [
  {
    id: 'strategy-1',
    name: 'BTC Momentum',
    description: 'Takes advantage of BTC price momentum with RSI confirmation',
    type: 'trend-following',
    timeframe: '4h',
    riskLevel: 'medium',
    parameters: {
      period: 14,
      threshold: 70,
    },
    assets: ['bitcoin'],
    performance: {
      winRate: 68,
      returnRate: 34.2,
      sharpeRatio: 2.1,
      maxDrawdown: 12.5,
    },
    risk: 6.5,
    return: 34.2,
  },
  {
    id: 'strategy-2',
    name: 'ETH/BTC Pair',
    description: 'Trading between ETH and BTC price movements',
    type: 'mean-reversion',
    timeframe: '1d',
    riskLevel: 'low',
    parameters: {
      period: 21,
      threshold: 65,
    },
    assets: ['ethereum', 'bitcoin'],
    performance: {
      winRate: 72,
      returnRate: 28.4,
      sharpeRatio: 1.9,
      maxDrawdown: 9.2,
    },
    risk: 4.2,
    return: 28.4,
  },
  {
    id: 'strategy-3',
    name: 'SOL Breakout',
    description: 'Detects SOL breakouts with volume confirmation',
    type: 'breakout',
    timeframe: '1h',
    riskLevel: 'high',
    parameters: {
      period: 7,
      threshold: 80,
    },
    assets: ['solana'],
    performance: {
      winRate: 58,
      returnRate: 47.5,
      sharpeRatio: 1.6,
      maxDrawdown: 22.4,
    },
    risk: 8.7,
    return: 47.5,
  },
  {
    id: 'strategy-4',
    name: 'BTC/ETH/SOL Diversified',
    description: 'Balanced allocation across top 3 cryptos with periodic rebalancing',
    type: 'multi-timeframe',
    timeframe: '1w',
    riskLevel: 'low',
    parameters: {
      period: 30,
      threshold: 60,
    },
    assets: ['bitcoin', 'ethereum', 'solana'],
    performance: {
      winRate: 75,
      returnRate: 23.8,
      sharpeRatio: 2.4,
      maxDrawdown: 7.8,
    },
    risk: 3.8,
    return: 23.8,
  },
  {
    id: 'strategy-5',
    name: 'XRP Swing',
    description: 'Captures XRP price swings using MACD and RSI',
    type: 'sentiment',
    timeframe: '12h',
    riskLevel: 'medium',
    parameters: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
    },
    assets: ['ripple'],
    performance: {
      winRate: 62,
      returnRate: 31.5,
      sharpeRatio: 1.8,
      maxDrawdown: 15.2,
    },
    risk: 6.2,
    return: 31.5,
  },
];
