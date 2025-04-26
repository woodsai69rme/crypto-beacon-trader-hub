
import { AITradingStrategy } from '@/types/trading';

export const predefinedStrategies: AITradingStrategy[] = [
  {
    id: "momentum-ai",
    name: "AI Momentum Strategy",
    description: "Uses AI to identify and trade on momentum patterns across multiple timeframes",
    type: "ai",
    color: "#3B82F6",
    indicators: ["RSI", "MACD", "Volume"],
    timeframes: ["1h", "4h", "1d"],
    stats: {
      winRate: 68,
      averageReturn: 2.4,
      riskLevel: "Medium",
      maxDrawdown: 12
    }
  },
  {
    id: "trend-following",
    name: "Trend Following",
    description: "Classic trend following strategy using moving averages and breakout signals",
    type: "traditional",
    color: "#10B981",
    indicators: ["SMA", "EMA", "Bollinger Bands"],
    timeframes: ["4h", "1d"],
    stats: {
      winRate: 58,
      averageReturn: 1.8,
      riskLevel: "Low",
      maxDrawdown: 8
    }
  },
  {
    id: "mean-reversion",
    name: "Mean Reversion",
    description: "Strategy that capitalizes on price deviations from historical averages",
    type: "traditional",
    color: "#F59E0B",
    indicators: ["Bollinger Bands", "RSI", "Stochastic"],
    timeframes: ["15m", "1h", "4h"],
    stats: {
      winRate: 62,
      averageReturn: 1.5,
      riskLevel: "Medium",
      maxDrawdown: 15
    }
  },
  {
    id: "adaptive-neural-net",
    name: "Adaptive Neural Network",
    description: "Deep learning model that adapts to changing market conditions",
    type: "ai",
    color: "#8B5CF6",
    indicators: ["Custom Neural Indicators"],
    timeframes: ["1h", "4h", "1d"],
    stats: {
      winRate: 72,
      averageReturn: 3.2,
      riskLevel: "High",
      maxDrawdown: 18
    }
  },
  {
    id: "sentiment-analysis",
    name: "Sentiment Analysis",
    description: "Analyzes market sentiment from social media and news sources",
    type: "ai",
    color: "#EC4899",
    indicators: ["Social Media Metrics", "News Sentiment"],
    timeframes: ["4h", "1d"],
    stats: {
      winRate: 64,
      averageReturn: 2.8,
      riskLevel: "Medium-High",
      maxDrawdown: 16
    }
  },
  {
    id: "volatility-breakout",
    name: "Volatility Breakout",
    description: "Trades breakouts during periods of increasing market volatility",
    type: "traditional",
    color: "#EF4444",
    indicators: ["ATR", "Volatility", "Support/Resistance"],
    timeframes: ["15m", "1h", "4h"],
    stats: {
      winRate: 54,
      averageReturn: 2.6,
      riskLevel: "High",
      maxDrawdown: 22
    }
  }
];
