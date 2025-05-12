
import { AITradingStrategy } from "@/types/trading";

export const predefinedStrategies: AITradingStrategy[] = [
  {
    id: 'strategy-101',
    name: 'Momentum ETH',
    description: 'A strategy that follows Ethereum price momentum',
    type: 'trend-following',
    timeframe: '4h',
    riskLevel: 'medium',
    parameters: {
      period: 14,
      threshold: 70,
      stopLoss: 5,
      takeProfit: 15,
      useVolume: true
    },
    assets: ['ethereum'],
    performance: {
      winRate: 68,
      returnRate: 34.2,
      sharpeRatio: 2.1,
      maxDrawdown: 12.5
    }
  },
  {
    id: 'strategy-102',
    name: 'BTC Mean Reversion',
    description: 'Capitalizes on Bitcoin price returning to the mean',
    type: 'mean-reversion',
    timeframe: '1d',
    riskLevel: 'low',
    parameters: {
      period: 21,
      threshold: 65,
      stopLoss: 3,
      takeProfit: 10,
      useVolume: false
    },
    assets: ['bitcoin'],
    performance: {
      winRate: 72,
      returnRate: 28.4,
      sharpeRatio: 1.9,
      maxDrawdown: 9.2
    }
  },
  {
    id: 'strategy-103',
    name: 'Multi-Asset Trend',
    description: 'Follows trends across multiple crypto assets',
    type: 'trend-following',
    timeframe: '1d',
    riskLevel: 'medium',
    parameters: {
      period: 10,
      threshold: 75,
      stopLoss: 7,
      takeProfit: 20,
      useVolume: true
    },
    assets: ['bitcoin', 'ethereum', 'solana'],
    performance: {
      winRate: 65,
      returnRate: 42.3,
      sharpeRatio: 2.3,
      maxDrawdown: 14.7
    }
  }
];

export const mockTradingStrategies: AITradingStrategy[] = [
  {
    id: 'strategy-1001',
    name: 'RSI BTC Strategy',
    description: 'Uses RSI indicator to trade Bitcoin',
    type: 'mean-reversion',
    timeframe: '1h',
    riskLevel: 'medium',
    parameters: {
      period: 14,
      threshold: 70,
      stopLoss: 5,
      takeProfit: 15,
      useVolume: true
    },
    assets: ['bitcoin'],
    performance: {
      winRate: 68,
      returnRate: 34.2,
      sharpeRatio: 2.1,
      maxDrawdown: 12.5
    }
  },
  {
    id: 'strategy-1002',
    name: 'Multi-Timeframe ETH',
    description: 'Combines multiple timeframes for Ethereum trading',
    type: 'multi-timeframe',
    timeframe: '4h',
    riskLevel: 'high',
    parameters: {
      period: 21,
      threshold: 65,
      stopLoss: 10,
      takeProfit: 25,
      useVolume: true
    },
    assets: ['ethereum'],
    performance: {
      winRate: 62,
      returnRate: 48.7,
      sharpeRatio: 1.8,
      maxDrawdown: 18.3
    }
  }
];

export const mockTradingAccounts = [
  {
    id: 'account-1',
    name: 'Main Trading Account',
    type: 'standard',
    provider: 'local',
    balance: 25000,
    currency: 'USD',
    lastUpdated: '2023-05-10T14:30:00Z',
    isActive: true
  },
  {
    id: 'account-2',
    name: 'AI Bot Account',
    type: 'bot',
    provider: 'local',
    balance: 15000,
    currency: 'USD',
    lastUpdated: '2023-05-15T09:45:00Z',
    isActive: true
  }
];
