
import { AITradingStrategy } from '@/types/trading';

// Predefined trading strategies
export const predefinedStrategies: AITradingStrategy[] = [
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
      stopLossPct: 2.5,
      period: 14,
      threshold: 70,
      stopLoss: 5,
      takeProfit: 10
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
      rsiOversold: 30,
      period: 14,
      threshold: 70,
      stopLoss: 5,
      takeProfit: 10
    },
    performance: {
      winRate: 72,
      profitFactor: 2.1,
      trades: 210,
      returns: 56.8
    }
  },
  {
    id: 'strategy-3',
    name: 'Sentiment Trader',
    description: 'Uses market sentiment analysis for trading decisions',
    type: 'sentiment',
    timeframe: '1d',
    assets: ['bitcoin', 'ethereum', 'solana', 'cardano'],
    parameters: {
      sentimentThreshold: 65,
      sentimentTimeframe: '4h',
      period: 14,
      threshold: 70,
      stopLoss: 5,
      takeProfit: 10
    },
    performance: {
      winRate: 68,
      profitFactor: 1.9,
      trades: 95,
      returns: 47.3
    }
  }
];

// Strategy templates for creating new strategies
export const strategyTemplates: Record<string, Partial<AITradingStrategy>> = {
  'trend-following': {
    name: 'Trend Following Strategy',
    description: 'Follows market trends using moving averages',
    type: 'trend-following',
    timeframe: '4h',
    parameters: {
      period: 14,
      threshold: 70,
      stopLoss: 5,
      takeProfit: 10,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9
    }
  },
  'mean-reversion': {
    name: 'Mean Reversion Strategy',
    description: 'Trades reversions to the mean using oscillators',
    type: 'mean-reversion',
    timeframe: '1h',
    parameters: {
      period: 14,
      upperBand: 70,
      lowerBand: 30,
      stopLoss: 3,
      takeProfit: 6
    }
  },
  'breakout': {
    name: 'Breakout Strategy',
    description: 'Identifies and trades breakouts from ranges',
    type: 'breakout',
    timeframe: '1h',
    parameters: {
      period: 20,
      threshold: 2.0,
      stopLoss: 5,
      takeProfit: 15
    }
  },
  'sentiment': {
    name: 'Sentiment Strategy',
    description: 'Uses market sentiment to identify trading opportunities',
    type: 'sentiment',
    timeframe: '1d',
    parameters: {
      sentimentThreshold: 65,
      sentimentTimeframe: '4h',
      period: 14,
      threshold: 70,
      stopLoss: 4,
      takeProfit: 8
    }
  }
};
