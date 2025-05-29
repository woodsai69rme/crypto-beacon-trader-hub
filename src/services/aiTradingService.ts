
import { AITradingStrategy } from '@/types/trading';

export const getAvailableStrategies = (): AITradingStrategy[] => {
  return [
    {
      id: 'trend-following',
      name: 'Trend Following',
      description: 'Follows major market trends using moving averages and momentum indicators',
      type: 'trend-following',
      timeframe: 24,
      parameters: {},
      riskLevel: 'medium',
      performance: {
        winRate: 65,
        profitFactor: 1.8,
        sharpeRatio: 1.4,
        trades: 156,
        maxDrawdown: 12
      }
    },
    {
      id: 'mean-reversion',
      name: 'Mean Reversion',
      description: 'Buys oversold and sells overbought conditions',
      type: 'mean-reversion',
      timeframe: 4,
      parameters: {},
      riskLevel: 'low',
      performance: {
        winRate: 72,
        profitFactor: 1.5,
        sharpeRatio: 1.7,
        trades: 203,
        maxDrawdown: 8
      }
    },
    {
      id: 'breakout',
      name: 'Breakout Strategy',
      description: 'Captures price movements after consolidation periods',
      type: 'breakout',
      timeframe: 1,
      parameters: {},
      riskLevel: 'high',
      performance: {
        winRate: 45,
        profitFactor: 2.1,
        sharpeRatio: 1.2,
        trades: 89,
        maxDrawdown: 18
      }
    },
    {
      id: 'sentiment',
      name: 'Sentiment Trading',
      description: 'Uses news sentiment and social media data for trading decisions',
      type: 'sentiment',
      timeframe: 6,
      parameters: {},
      riskLevel: 'medium',
      performance: {
        winRate: 58,
        profitFactor: 1.6,
        sharpeRatio: 1.3,
        trades: 124,
        maxDrawdown: 15
      }
    }
  ];
};

export const analyzeMarketData = async (coinId: string): Promise<any> => {
  // Mock market analysis
  return {
    trend: 'bullish',
    strength: 0.75,
    signals: ['RSI oversold', 'MACD crossover'],
    recommendation: 'buy'
  };
};
