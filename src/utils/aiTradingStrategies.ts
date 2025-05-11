
import { AITradingStrategy } from '@/types/trading';

// Predefined AI trading strategies with parameters
export const predefinedStrategies: AITradingStrategy[] = [
  {
    id: 'strategy-rsi-mean-reversion',
    name: 'RSI Mean Reversion',
    description: 'Buys when RSI is oversold and sells when RSI is overbought',
    type: 'mean-reversion',
    timeframe: '1h',
    riskLevel: 'Medium',
    parameters: {
      period: 14,
      overbought: 70,
      oversold: 30,
      stopLoss: 5,
      takeProfit: 15,
      useVolume: false,
      indicator: 'rsi',
      allowWeekendTrading: false
    },
    performance: {
      winRate: 65,
      profitFactor: 1.5,
      sharpeRatio: 1.2,
      trades: 150,
      profitLoss: 15.5,
      drawdown: 8.3
    }
  },
  {
    id: 'strategy-macd-trend',
    name: 'MACD Trend Following',
    description: 'Follows trends using MACD signal line crossovers',
    type: 'trend-following',
    timeframe: '4h',
    riskLevel: 'Medium',
    parameters: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      stopLoss: 8,
      takeProfit: 20,
      useVolume: true,
      indicator: 'macd',
      allowWeekendTrading: false
    },
    performance: {
      winRate: 58,
      profitFactor: 1.8,
      sharpeRatio: 1.5,
      trades: 120,
      profitLoss: 22.3,
      drawdown: 12.5
    }
  },
  {
    id: 'strategy-bb-breakout',
    name: 'Bollinger Breakout',
    description: 'Captures price breakouts from Bollinger Bands',
    type: 'breakout',
    timeframe: '15m',
    riskLevel: 'High',
    parameters: {
      period: 20,
      stdDev: 2,
      stopLoss: 3.5,
      takeProfit: 7,
      useVolume: true,
      indicator: 'bb',
      volumeThreshold: 1.5,
      allowWeekendTrading: false
    },
    performance: {
      winRate: 45,
      profitFactor: 1.6,
      sharpeRatio: 0.9,
      trades: 380,
      profitLoss: 28.7,
      drawdown: 18.5
    }
  },
  {
    id: 'strategy-ma-crossover',
    name: 'Moving Average Crossover',
    description: 'Trades based on fast and slow moving average crossovers',
    type: 'trend-following',
    timeframe: '1d',
    riskLevel: 'Low',
    parameters: {
      fastMAPeriod: 10,
      slowMAPeriod: 50,
      stopLoss: 10,
      takeProfit: 25,
      useVolume: false,
      indicator: 'ma',
      confirmationCandles: 2,
      allowWeekendTrading: true
    },
    performance: {
      winRate: 52,
      profitFactor: 1.4,
      sharpeRatio: 1.1,
      trades: 85,
      profitLoss: 17.6,
      drawdown: 14.2
    }
  },
  {
    id: 'strategy-sentiment-ai',
    name: 'Sentiment AI Trader',
    description: 'Uses AI to analyze market sentiment and news for trading decisions',
    type: 'sentiment',
    timeframe: '4h',
    riskLevel: 'Medium',
    parameters: {
      sentimentThreshold: 70,
      newsWeight: 0.6,
      socialWeight: 0.4,
      stopLoss: 7,
      takeProfit: 15,
      useVolume: true,
      indicator: 'sentiment',
      maximumHoldTime: 72,
      allowWeekendTrading: false
    },
    performance: {
      winRate: 61,
      profitFactor: 1.7,
      sharpeRatio: 1.3,
      trades: 110,
      profitLoss: 19.8,
      drawdown: 11.3
    }
  },
  {
    id: 'strategy-multi-timeframe',
    name: 'Multi-Timeframe Strategy',
    description: 'Analyzes multiple timeframes for confluence before entering trades',
    type: 'multi-timeframe',
    timeframe: '1h',
    riskLevel: 'Medium',
    parameters: {
      primaryTimeframe: '1h',
      secondaryTimeframe: '4h',
      tertiaryTimeframe: '1d',
      confirmationLevel: 2,
      stopLoss: 6,
      takeProfit: 18,
      useVolume: true,
      indicator: 'rsi',
      allowWeekendTrading: false
    },
    performance: {
      winRate: 67,
      profitFactor: 1.9,
      sharpeRatio: 1.6,
      trades: 95,
      profitLoss: 24.3,
      drawdown: 10.1
    }
  }
];

// Strategy templates for different trading styles
export const strategyTemplates = {
  trendFollowing: {
    type: 'trend-following',
    timeframe: '4h',
    parameters: {
      period: 14,
      threshold: 70,
      stopLoss: 8,
      takeProfit: 20,
      useVolume: true,
      indicator: 'macd',
      allowWeekendTrading: false
    }
  },
  meanReversion: {
    type: 'mean-reversion',
    timeframe: '1h',
    parameters: {
      period: 14,
      overbought: 70,
      oversold: 30,
      stopLoss: 5,
      takeProfit: 15,
      useVolume: false,
      indicator: 'rsi',
      allowWeekendTrading: false
    }
  },
  breakout: {
    type: 'breakout',
    timeframe: '15m',
    parameters: {
      period: 20,
      stdDev: 2,
      stopLoss: 3.5,
      takeProfit: 7,
      useVolume: true,
      indicator: 'bb',
      volumeThreshold: 1.5,
      allowWeekendTrading: false
    }
  },
  sentiment: {
    type: 'sentiment',
    timeframe: '4h',
    parameters: {
      sentimentThreshold: 70,
      newsWeight: 0.6,
      socialWeight: 0.4,
      stopLoss: 7,
      takeProfit: 15,
      useVolume: true,
      indicator: 'sentiment',
      maximumHoldTime: 72,
      allowWeekendTrading: false
    }
  }
};
