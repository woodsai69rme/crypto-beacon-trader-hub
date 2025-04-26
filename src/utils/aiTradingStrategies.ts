
export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  type: "momentum" | "mean-reversion" | "breakout" | "ai-predictive" | "sentiment" | "custom";
  riskLevel: "low" | "medium" | "high";
  timeframe: "5m" | "15m" | "30m" | "1h" | "4h" | "1d" | "1w";
  indicators: string[];
  parameters: Record<string, any>;
  backtestResults?: BacktestResult;
}

export interface BacktestResult {
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  trades: number;
  averageTrade: number;
}

export const predefinedStrategies: TradingStrategy[] = [
  {
    id: "momentum-ai-1",
    name: "AI Momentum Alpha",
    description: "Captures multi-timeframe momentum with machine learning pattern recognition",
    type: "momentum",
    riskLevel: "medium",
    timeframe: "1h",
    indicators: ["RSI", "MACD", "ML Pattern Recognition", "Volume Profile"],
    parameters: {
      rsiPeriod: 14,
      rsiOverbought: 70,
      rsiOversold: 30,
      volumeThreshold: 1.5,
      trendStrengthMin: 65,
      stopLoss: 2.5,
      takeProfit: 5.0,
      trailingStop: true
    },
    backtestResults: {
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      initialCapital: 10000,
      finalCapital: 13240,
      totalReturn: 32.4,
      annualizedReturn: 129.6,
      maxDrawdown: 8.3,
      winRate: 68,
      profitFactor: 2.4,
      sharpeRatio: 1.8,
      trades: 47,
      averageTrade: 68.94
    }
  },
  {
    id: "mean-reversion-ai-1",
    name: "Smart Mean Reversion",
    description: "Identifies oversold/overbought conditions using AI sentiment analysis",
    type: "mean-reversion",
    riskLevel: "low",
    timeframe: "4h",
    indicators: ["Bollinger Bands", "Stochastic", "Market Sentiment", "Support/Resistance AI"],
    parameters: {
      bollingerPeriod: 20,
      bollingerDeviation: 2,
      stochasticPeriod: 14,
      stochasticOverbought: 80,
      stochasticOversold: 20,
      sentimentThreshold: 65,
      stopLoss: 1.5,
      takeProfit: 3.0,
      trailingStop: false
    },
    backtestResults: {
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      initialCapital: 10000,
      finalCapital: 11750,
      totalReturn: 17.5,
      annualizedReturn: 70.0,
      maxDrawdown: 4.2,
      winRate: 73,
      profitFactor: 2.1,
      sharpeRatio: 1.6,
      trades: 62,
      averageTrade: 28.23
    }
  },
  {
    id: "breakout-ai-1",
    name: "Neural Breakout Detector",
    description: "Uses neural networks to detect high-probability breakout patterns",
    type: "breakout",
    riskLevel: "high",
    timeframe: "15m",
    indicators: ["Volume", "ATR", "Pattern Recognition", "Support/Resistance"],
    parameters: {
      consolidationPeriod: 48,
      volumeIncrease: 2.5,
      volatilityThreshold: 1.8,
      breakoutConfirmation: "3-candle",
      stopLoss: 3.0,
      takeProfit: 9.0,
      trailingStop: true
    },
    backtestResults: {
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      initialCapital: 10000,
      finalCapital: 14680,
      totalReturn: 46.8,
      annualizedReturn: 187.2,
      maxDrawdown: 12.4,
      winRate: 58,
      profitFactor: 2.8,
      sharpeRatio: 1.9,
      trades: 36,
      averageTrade: 130.0
    }
  },
  {
    id: "ai-predictive-1",
    name: "Quantum Price Predictor",
    description: "Advanced deep learning model for short-term price movement prediction",
    type: "ai-predictive",
    riskLevel: "high",
    timeframe: "30m",
    indicators: ["LSTM Network", "Transformer Model", "On-chain Data", "Market Microstructure"],
    parameters: {
      confidenceThreshold: 75,
      predictionHorizon: "6-candles",
      ensembleModels: 5,
      stopLoss: 2.5,
      takeProfit: 7.5,
      dynamicPositionSizing: true
    },
    backtestResults: {
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      initialCapital: 10000,
      finalCapital: 15240,
      totalReturn: 52.4,
      annualizedReturn: 209.6,
      maxDrawdown: 14.6,
      winRate: 62,
      profitFactor: 2.6,
      sharpeRatio: 2.1,
      trades: 84,
      averageTrade: 62.38
    }
  },
  {
    id: "sentiment-ai-1",
    name: "Social Sentiment Analyzer",
    description: "Analyzes social media, news, and market sentiment for trading opportunities",
    type: "sentiment",
    riskLevel: "medium",
    timeframe: "1d",
    indicators: ["Social Media Analysis", "News Sentiment", "Fear & Greed", "Whale Alerts"],
    parameters: {
      sentimentChangeThreshold: 15,
      newsImpactFilter: "high",
      whaleThreshold: "$1M",
      sentimentConfirmation: "4h",
      stopLoss: 4.0,
      takeProfit: 12.0,
      trailingStop: true
    },
    backtestResults: {
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      initialCapital: 10000,
      finalCapital: 12950,
      totalReturn: 29.5,
      annualizedReturn: 118.0,
      maxDrawdown: 9.8,
      winRate: 64,
      profitFactor: 2.2,
      sharpeRatio: 1.7,
      trades: 28,
      averageTrade: 105.36
    }
  }
];

export const runBacktest = async (
  strategyId: string,
  symbol: string,
  timeframe: string,
  startDate: string,
  endDate: string,
  initialCapital: number
): Promise<BacktestResult> => {
  // In a real application, this would call an API to run a backtest
  console.log(`Running backtest for strategy ${strategyId} on ${symbol}`);
  
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock results
  return {
    startDate,
    endDate,
    initialCapital,
    finalCapital: initialCapital * 1.324,
    totalReturn: 32.4,
    annualizedReturn: 129.6,
    maxDrawdown: 8.3,
    winRate: 68,
    profitFactor: 2.4,
    sharpeRatio: 1.8,
    trades: 47,
    averageTrade: 68.94
  };
};

export const generateCustomStrategy = async (
  baseStrategyId: string,
  customParameters: Record<string, any>
): Promise<TradingStrategy> => {
  // Find the base strategy
  const baseStrategy = predefinedStrategies.find(s => s.id === baseStrategyId);
  
  if (!baseStrategy) {
    throw new Error("Base strategy not found");
  }
  
  // In a real app, this would call an API to generate a custom strategy
  console.log(`Generating custom strategy based on ${baseStrategyId}`);
  
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a new strategy with merged parameters
  return {
    ...baseStrategy,
    id: `custom-${Date.now()}`,
    name: `Custom ${baseStrategy.name}`,
    parameters: {
      ...baseStrategy.parameters,
      ...customParameters
    },
    backtestResults: undefined // Reset backtest results for the new strategy
  };
};

export const optimizeStrategy = async (
  strategyId: string,
  symbol: string,
  timeframe: string,
  startDate: string,
  endDate: string
): Promise<Record<string, any>> => {
  // Find the strategy
  const strategy = predefinedStrategies.find(s => s.id === strategyId);
  
  if (!strategy) {
    throw new Error("Strategy not found");
  }
  
  // In a real app, this would call an API to optimize a strategy
  console.log(`Optimizing strategy ${strategyId} for ${symbol}`);
  
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Return optimized parameters
  const optimizedParams = { ...strategy.parameters };
  
  // Simulate some optimizations
  switch (strategy.type) {
    case "momentum":
      optimizedParams.rsiPeriod = 12;
      optimizedParams.stopLoss = 2.2;
      optimizedParams.takeProfit = 5.5;
      break;
    case "mean-reversion":
      optimizedParams.bollingerDeviation = 2.2;
      optimizedParams.stochasticOverbought = 82;
      optimizedParams.stochasticOversold = 18;
      break;
    case "breakout":
      optimizedParams.volumeIncrease = 2.8;
      optimizedParams.stopLoss = 2.8;
      optimizedParams.takeProfit = 8.4;
      break;
    default:
      // Just return original params for other types
  }
  
  return optimizedParams;
};
