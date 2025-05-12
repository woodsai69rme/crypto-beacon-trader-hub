
import { AITradingStrategy, CoinOption, TradingAccount, LocalModel } from '@/types/trading';

// Mock cryptocurrency data
export const mockCoinData: CoinOption[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 58432.21,
    priceChange: 1243.45,
    changePercent: 2.18,
    marketCap: 1127394658234,
    volume: 38726485938,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    value: 'bitcoin',
    label: 'Bitcoin (BTC)'
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2872.44,
    priceChange: -45.32,
    changePercent: -1.56,
    marketCap: 345294856729,
    volume: 19384756293,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    value: 'ethereum',
    label: 'Ethereum (ETH)'
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 142.58,
    priceChange: 7.64,
    changePercent: 5.67,
    marketCap: 61857294857,
    volume: 5283947583,
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    value: 'solana',
    label: 'Solana (SOL)'
  }
];

// Mock AI trading strategies
export const mockAIStrategies: AITradingStrategy[] = [
  {
    id: 'strategy-1',
    name: 'BTC Momentum',
    description: 'Algorithmic strategy leveraging Bitcoin market momentum',
    type: 'trend-following',
    timeframe: '4h',
    riskLevel: 'medium',
    parameters: {
      period: 14,
      threshold: 65,
      stopLoss: 3,
      takeProfit: 9
    },
    assets: ['bitcoin'],
    performance: {
      winRate: 68,
      returnRate: 34.5,
      sharpeRatio: 1.87,
      maxDrawdown: 12.3
    }
  },
  {
    id: 'strategy-2',
    name: 'ETH Mean Reversion',
    description: 'Statistical arbitrage on Ethereum price deviations',
    type: 'mean-reversion',
    timeframe: '1d',
    riskLevel: 'low',
    parameters: {
      period: 20,
      threshold: 2.5,
      stopLoss: 2,
      takeProfit: 5
    },
    assets: ['ethereum'],
    performance: {
      winRate: 72,
      returnRate: 28.4,
      sharpeRatio: 2.1,
      maxDrawdown: 8.5
    }
  },
  {
    id: 'strategy-3',
    name: 'Multi-Asset Breakout',
    description: 'Identifies and trades breakout patterns across assets',
    type: 'breakout',
    timeframe: '12h',
    riskLevel: 'high',
    parameters: {
      period: 10,
      threshold: 3.2,
      stopLoss: 5,
      takeProfit: 15
    },
    assets: ['bitcoin', 'ethereum', 'solana'],
    performance: {
      winRate: 61,
      returnRate: 52.8,
      sharpeRatio: 1.65,
      maxDrawdown: 18.4
    }
  }
];

// Mock local AI models
export const mockLocalModels: LocalModel[] = [
  {
    id: 'model-1',
    name: 'BTC Price Predictor',
    type: 'prediction',
    description: 'Forecasts Bitcoin price movements using LSTM neural networks',
    version: '1.2.0',
    connected: true,
    parameters: {
      lookback: 30,
      epochs: 100,
      layers: 3
    },
    status: 'idle',
    performance: {
      accuracy: 68.5,
      mse: 0.023,
      latency: 120
    },
    lastUsed: '2023-05-10T14:30:00Z'
  },
  {
    id: 'model-2',
    name: 'Market Sentiment Analyzer',
    type: 'sentiment',
    description: 'Analyzes social media sentiment for crypto assets',
    version: '2.0.1',
    connected: false,
    parameters: {
      sources: ['twitter', 'reddit', 'news'],
      frequency: 60,
      threshold: 0.65
    },
    status: 'idle',
    lastUsed: '2023-05-12T09:15:00Z'
  }
];

// Mock trading accounts data
export const mockTradingAccounts: TradingAccount[] = [
  {
    id: 'account-1',
    name: 'Main Trading Account',
    type: 'standard',
    provider: 'local',
    balance: 25000,
    initialBalance: 25000,
    currency: 'USD',
    lastUpdated: '2023-05-10T14:30:00Z',
    isActive: true,
    positions: [],
    trades: [],
    createdAt: '2023-05-01T10:00:00Z',
    performance: {
      daily: 0,
      weekly: 0,
      monthly: 0,
      allTime: 0
    }
  },
  {
    id: 'account-2',
    name: 'AI Bot Account',
    type: 'bot',
    provider: 'local',
    balance: 15000,
    initialBalance: 15000,
    currency: 'USD',
    lastUpdated: '2023-05-15T09:45:00Z',
    isActive: true,
    positions: [],
    trades: [],
    createdAt: '2023-05-05T14:00:00Z',
    performance: {
      daily: 0,
      weekly: 0,
      monthly: 0,
      allTime: 0
    }
  }
];
