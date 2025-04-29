
import { AITradingStrategy } from "@/types/trading";

// Predefined AI trading strategies
export const predefinedStrategies: AITradingStrategy[] = [
  {
    id: "strategy-1",
    name: "AI Price Prediction",
    description: "Uses machine learning to predict price movements and execute trades based on predicted direction",
    type: "ai-predictive",
    riskLevel: "medium",
    timeframe: "4h",
    indicators: ["RSI", "MACD", "Bollinger Bands"],
    parameters: {
      confidenceThreshold: 0.7,
      maxPositionSize: 5,
      stopLossPercent: 2,
      takeProfitPercent: 4
    }
  },
  {
    id: "strategy-2",
    name: "Sentiment Analysis Trader",
    description: "Analyzes news and social media sentiment to make trading decisions",
    type: "hybrid",
    riskLevel: "medium",
    timeframe: "1d",
    indicators: ["Sentiment Score", "Volume", "Price Action"],
    parameters: {
      sentimentThreshold: 0.65,
      newsWeight: 0.6,
      socialWeight: 0.4,
      orderSize: 3
    }
  },
  {
    id: "strategy-3",
    name: "Mean Reversion",
    description: "Identifies when prices have deviated significantly from their historical mean and trades towards the mean",
    type: "traditional",
    riskLevel: "low",
    timeframe: "1h",
    indicators: ["Standard Deviation", "Bollinger Bands", "Keltner Channel"],
    parameters: {
      lookbackPeriod: 20,
      entryDeviation: 2.0,
      exitDeviation: 0.5,
      tradeSize: 2
    }
  },
  {
    id: "strategy-4",
    name: "Trend Following",
    description: "Identifies and follows established market trends to capture larger price movements",
    type: "hybrid",
    riskLevel: "medium",
    timeframe: "4h",
    indicators: ["Moving Averages", "ADX", "Supertrend"],
    parameters: {
      fastPeriod: 9,
      slowPeriod: 21,
      adxThreshold: 25,
      trailingStop: 3
    }
  },
  {
    id: "strategy-5",
    name: "Breakout Detection",
    description: "Identifies price breakouts from consolidation patterns and trades in the direction of the breakout",
    type: "hybrid",
    riskLevel: "high",
    timeframe: "15m",
    indicators: ["Donchian Channels", "Volume", "ATR"],
    parameters: {
      channelPeriod: 20,
      volumeMultiplier: 1.5,
      stopMultiplier: 2,
      profitTarget: 3
    }
  },
  {
    id: "strategy-6",
    name: "Multi-Factor AI",
    description: "Combines multiple AI models to analyze technical patterns, sentiment, and on-chain metrics",
    type: "ai-predictive",
    riskLevel: "high",
    timeframe: "1d",
    indicators: ["Technical", "Sentiment", "On-chain", "Correlation"],
    parameters: {
      technicalWeight: 0.4,
      sentimentWeight: 0.3,
      onChainWeight: 0.3,
      minConfidence: 0.75
    }
  }
];

// Function to get a strategy by ID
export const getStrategyById = (
  strategyId: string
): AITradingStrategy | undefined => {
  return predefinedStrategies.find(strategy => strategy.id === strategyId);
};
