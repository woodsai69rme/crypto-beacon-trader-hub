
import { AITradingStrategy } from "@/types/trading";

// Default strategy parameters used when creating a new strategy
export const DEFAULT_STRATEGY_PARAMETERS = {
  period: 14,
  threshold: 70,
  stopLoss: 5,
  takeProfit: 10,
  useVolume: true,
  indicator: 'rsi',
  allowWeekendTrading: false,
  fastPeriod: 12,
  slowPeriod: 26,
  signalPeriod: 9,
  upperBand: 70,
  lowerBand: 30,
  riskFactor: 1.5
};

// Predefined strategies for the application
export const predefinedStrategies: AITradingStrategy[] = [
  {
    id: 'strategy-1',
    name: 'RSI Mean Reversion',
    description: 'Trades oversold and overbought conditions using RSI',
    type: 'mean-reversion',
    timeframe: '1h',
    riskLevel: 'Medium',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      period: 14,
      threshold: 30,
      indicator: 'rsi',
      lowerBand: 30,
      upperBand: 70
    }
  },
  {
    id: 'strategy-2',
    name: 'MACD Trend Following',
    description: 'Follows market trends using MACD crossovers',
    type: 'trend-following',
    timeframe: '4h',
    riskLevel: 'Medium',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      indicator: 'macd'
    }
  },
  {
    id: 'strategy-3',
    name: 'Bollinger Breakout',
    description: 'Captures price breakouts from Bollinger Bands',
    type: 'breakout',
    timeframe: '15m',
    riskLevel: 'High',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      period: 20,
      indicator: 'bb',
      stopLoss: 3,
      takeProfit: 9
    }
  },
  {
    id: 'strategy-4',
    name: 'Moving Average Crossover',
    description: 'Detects trend changes using moving average crossovers',
    type: 'trend-following',
    timeframe: '1d',
    riskLevel: 'Low',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      fastPeriod: 9,
      slowPeriod: 21,
      indicator: 'ma',
      useVolume: true
    }
  },
  {
    id: 'strategy-5',
    name: 'Sentiment-Based Trading',
    description: 'Uses market sentiment analysis to find trading opportunities',
    type: 'sentiment',
    timeframe: '4h',
    riskLevel: 'Medium',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      sentimentThreshold: 65,
      sentimentTimeframe: '24h',
      useVolume: true,
      indicator: 'sentiment'
    }
  }
];
