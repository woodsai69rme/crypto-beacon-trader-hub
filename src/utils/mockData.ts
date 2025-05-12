
import { CoinOption, AITradingStrategy, TradingAccount, Position, Trade } from '@/types/trading';

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

// Mock trading accounts
export const mockTradingAccounts: TradingAccount[] = [
  {
    id: 'account-1',
    name: 'Main Trading Portfolio',
    balance: 25000,
    initialBalance: 20000,
    currency: 'USD',
    createdAt: '2023-01-05T10:30:00Z',
    positions: [
      {
        id: 'pos-1',
        coinId: 'bitcoin',
        coinName: 'Bitcoin',
        coinSymbol: 'BTC',
        amount: 0.35,
        entryPrice: 42000,
        currentPrice: 62453.21,
        value: 21858.62,
        profitLoss: 7158.62,
        profitLossPercentage: 48.7,
        openedAt: '2023-02-10T14:20:00Z'
      },
      {
        id: 'pos-2',
        coinId: 'ethereum',
        coinName: 'Ethereum',
        coinSymbol: 'ETH',
        amount: 3.2,
        entryPrice: 2800,
        currentPrice: 3287.54,
        value: 10520.13,
        profitLoss: 1560.13,
        profitLossPercentage: 17.4,
        openedAt: '2023-03-05T09:15:00Z'
      }
    ],
    trades: [
      {
        id: 'trade-1',
        timestamp: '2023-02-10T14:20:00Z',
        date: '2023-02-10',
        type: 'buy',
        price: 42000,
        amount: 0.35,
        total: 14700,
        profit: 0,
        profitPercentage: 0,
        coin: 'bitcoin',
        coinId: 'bitcoin',
        coinName: 'Bitcoin',
        coinSymbol: 'BTC',
        currency: 'USD',
        totalValue: 14700
      },
      {
        id: 'trade-2',
        timestamp: '2023-03-05T09:15:00Z',
        date: '2023-03-05',
        type: 'buy',
        price: 2800,
        amount: 3.2,
        total: 8960,
        profit: 0,
        profitPercentage: 0,
        coin: 'ethereum',
        coinId: 'ethereum',
        coinName: 'Ethereum',
        coinSymbol: 'ETH',
        currency: 'USD',
        totalValue: 8960
      }
    ],
    performance: {
      daily: 1.2,
      weekly: 3.8,
      monthly: 15.4,
      allTime: 25.0
    }
  },
  {
    id: 'account-2',
    name: 'AI Bot Portfolio',
    balance: 15000,
    initialBalance: 10000,
    currency: 'USD',
    createdAt: '2023-04-12T08:45:00Z',
    positions: [
      {
        id: 'pos-3',
        coinId: 'solana',
        coinName: 'Solana',
        coinSymbol: 'SOL',
        amount: 50,
        entryPrice: 90,
        currentPrice: 142.74,
        value: 7137,
        profitLoss: 2637,
        profitLossPercentage: 58.6,
        openedAt: '2023-05-20T11:30:00Z'
      }
    ],
    trades: [
      {
        id: 'trade-3',
        timestamp: '2023-05-20T11:30:00Z',
        date: '2023-05-20',
        type: 'buy',
        price: 90,
        amount: 50,
        total: 4500,
        profit: 0,
        profitPercentage: 0,
        coin: 'solana',
        coinId: 'solana',
        coinName: 'Solana',
        coinSymbol: 'SOL',
        currency: 'USD',
        totalValue: 4500
      }
    ],
    performance: {
      daily: 0.8,
      weekly: 5.2,
      monthly: 22.6,
      allTime: 50.0
    }
  }
];
