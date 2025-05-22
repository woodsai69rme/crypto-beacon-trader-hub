import { AITradingStrategy, AIStrategyParameters, AITradingBot, BacktestResults, AIModelConfig } from '@/types/trading';

// Mock strategies for use in the application
export const availableStrategies: AITradingStrategy[] = [
  {
    id: "trend-following",
    name: "Trend Following",
    description: "Follows the market trend using moving averages",
    type: "trend",
    timeframe: "1d",
    riskLevel: "medium",
    parameters: {
      maFast: 20,
      maSlow: 50,
      stopLoss: 5,
      takeProfit: 15
    },
    indicators: ["MA", "MACD"],
    performance: {
      accuracy: 68,
      returns: 12.5,
      sharpeRatio: 1.8,
      maxDrawdown: 15
    }
  },
  {
    id: "mean-reversion",
    name: "Mean Reversion",
    description: "Trades on the principle that prices will revert to the mean",
    type: "reversion",
    timeframe: "4h",
    riskLevel: "high",
    parameters: {
      lookbackPeriod: 20,
      deviationThreshold: 2,
      stopLoss: 3,
      takeProfit: 5
    },
    indicators: ["Bollinger Bands", "RSI"],
    performance: {
      accuracy: 62,
      returns: 18.5,
      sharpeRatio: 1.6,
      maxDrawdown: 22
    }
  },
  {
    id: "momentum",
    name: "Momentum",
    description: "Buys assets showing upward momentum",
    type: "momentum",
    timeframe: "1h",
    riskLevel: "medium",
    parameters: {
      momentumPeriod: 14,
      entryThreshold: 0.05,
      stopLoss: 4,
      takeProfit: 8
    },
    indicators: ["RSI", "Volume"],
    performance: {
      accuracy: 58,
      returns: 15.2,
      sharpeRatio: 1.4,
      maxDrawdown: 18
    }
  },
  {
    id: "breakout",
    name: "Breakout",
    description: "Trades on price breakouts from consolidation patterns",
    type: "breakout",
    timeframe: "1d",
    riskLevel: "high",
    parameters: {
      consolidationPeriod: 20,
      volatilityThreshold: 2.5,
      stopLoss: 6,
      takeProfit: 18
    },
    indicators: ["ATR", "Bollinger Bands"],
    performance: {
      accuracy: 52,
      returns: 22.5,
      sharpeRatio: 1.2,
      maxDrawdown: 28
    }
  },
  {
    id: "grid",
    name: "Grid Trading",
    description: "Places buy and sell orders at regular price intervals",
    type: "grid",
    timeframe: "1d",
    riskLevel: "low",
    parameters: {
      upperLimit: 10,
      lowerLimit: -10,
      gridLines: 10,
      stopLoss: 15
    },
    indicators: ["Price Levels"],
    performance: {
      accuracy: 75,
      returns: 8.5,
      sharpeRatio: 1.9,
      maxDrawdown: 10
    }
  }
];

// Default strategy parameters to use for new strategy creation
export const defaultStrategyParameters: AIStrategyParameters = {
  buySignalThreshold: 0.7,
  sellSignalThreshold: 0.7,
  stopLossPercentage: 5,
  takeProfitPercentage: 10,
  timeframe: "1h",
  maxPositions: 5
};

// Function to create a new strategy
export const createStrategy = (
  name: string,
  description: string,
  type: string,
  parameters?: AIStrategyParameters,
  indicators?: string[]
): AITradingStrategy => {
  return {
    id: `strategy-${Date.now()}`,
    name,
    description,
    type,
    riskLevel: "medium",
    parameters: parameters || defaultStrategyParameters,
    indicators: indicators || ["MA", "RSI"]
  };
};

// Function to backtest a strategy
export const backtestStrategy = async (
  strategyId: string,
  assetId: string,
  timeframe: string,
  startDate: string,
  endDate: string
): Promise<BacktestResults> => {
  // Mock backtest results - in a real app, this would run actual backtesting
  return {
    totalTrades: 48,
    winRate: 0.63,
    profitLoss: 1850.75,
    sharpeRatio: 1.4,
    maxDrawdown: 15.2,
    trades: [
      // Mock trade examples
      {
        id: "trade-1",
        timestamp: new Date(startDate).getTime() + 86400000,
        type: "buy",
        price: 45000,
        amount: 0.1,
        total: 4500,
        pnl: 300
      },
      {
        id: "trade-2",
        timestamp: new Date(startDate).getTime() + 172800000,
        type: "sell",
        price: 48000,
        amount: 0.1,
        total: 4800,
        pnl: 300
      }
    ]
  };
};

// Function to optimize a strategy by adjusting parameters
export const optimizeStrategy = async (
  strategyId: string,
  assetId: string,
  timeframe: string,
  parameterRanges: Record<string, [number, number]>
): Promise<AIStrategyParameters> => {
  // Mock optimization - would run parameter optimization in a real app
  return {
    buySignalThreshold: 0.65,
    sellSignalThreshold: 0.75,
    stopLossPercentage: 4.5,
    takeProfitPercentage: 12,
    timeframe,
    maxPositions: 3
  };
};

// Get strategy by ID
export const getStrategyById = (id: string): AITradingStrategy | undefined => {
  return availableStrategies.find(strategy => strategy.id === id);
};

// Function to get model details
export const getModelConfig = (modelId: string): AIModelConfig => {
  // Simple mock function to return model configs
  const models: Record<string, AIModelConfig> = {
    "gpt-4": {
      id: "gpt-4",
      name: "GPT-4",
      provider: "OpenRouter",
      endpoint: "https://openrouter.ai/api/v1/chat/completions"
    },
    "claude-3": {
      id: "claude-3",
      name: "Claude 3",
      provider: "OpenRouter",
      endpoint: "https://openrouter.ai/api/v1/chat/completions"
    },
    "deepseek-r1": {
      id: "deepseek-r1",
      name: "DeepSeek R1",
      provider: "OpenRouter",
      endpoint: "https://openrouter.ai/api/v1/chat/completions",
      parameters: {
        temperature: 0.7,
        top_p: 0.9
      }
    },
    "local-llama": {
      id: "local-llama",
      name: "Local LLaMA",
      provider: "Ollama",
      endpoint: "http://localhost:11434/v1/chat/completions"
    }
  };
  
  return models[modelId] || {
    id: modelId,
    name: modelId,
    provider: "Unknown",
    endpoint: ""
  };
};

// Function to generate a trading strategy using AI
export const generateStrategyWithAI = async (
  description: string,
  modelId: string
): Promise<AITradingStrategy> => {
  // In a real app, this would call the AI model via OpenRouter or local API
  // Mock response for now
  const mockResponse: AITradingStrategy = {
    id: `ai-strategy-${Date.now()}`,
    name: "AI Generated Strategy",
    description: description || "AI generated trading strategy based on user description",
    type: "hybrid",
    riskLevel: "medium",
    parameters: {}, // Add empty parameters object
    indicators: ["RSI", "MACD", "Bollinger Bands", "Volume"],
    performance: {
      accuracy: 65,
      returns: 14.3,
      sharpeRatio: 1.6,
      maxDrawdown: 16
    }
  };
  
  return mockResponse;
};

// Function to analyze market sentiment using AI
export const analyzeSentimentWithAI = async (
  assetId: string,
  timeframe: string
): Promise<{
  sentiment: "bearish" | "neutral" | "bullish";
  confidence: number;
  reasoning: string;
}> => {
  // Mock response
  return {
    sentiment: "bullish",
    confidence: 0.78,
    reasoning: "Recent positive price action combined with increasing institutional adoption and favorable regulatory news suggests continued upward momentum."
  };
};
