
import { AITradingStrategy, AIStrategyParameters, AIModelConfig, BacktestResults } from '@/types/trading';

// Mock AI trading strategies
export const availableStrategies: AITradingStrategy[] = [
  {
    id: 'trend-following',
    name: 'Trend Following',
    description: 'Follows established price trends with momentum indicators',
    type: 'trend',
    timeframe: '4h',
    riskLevel: 'medium',
    indicators: ['Moving Average', 'RSI', 'MACD'],
    parameters: {
      shortPeriod: 10,
      longPeriod: 21,
      signalPeriod: 9,
      rsiPeriod: 14
    }
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion',
    description: 'Identifies overbought or oversold conditions for reversal trades',
    type: 'reversion',
    timeframe: '1h',
    riskLevel: 'medium',
    indicators: ['Bollinger Bands', 'RSI', 'Stochastic'],
    parameters: {
      bollingerPeriod: 20,
      bollingerDeviation: 2,
      rsiOverbought: 70,
      rsiOversold: 30
    }
  },
  {
    id: 'breakout',
    name: 'Breakout',
    description: 'Identifies key support and resistance levels for breakout trades',
    type: 'breakout',
    timeframe: '1d',
    riskLevel: 'high',
    indicators: ['Support/Resistance', 'Volume', 'ATR'],
    parameters: {
      lookbackPeriod: 14,
      volatilityFilter: true,
      volumeThreshold: 1.5,
      atrMultiplier: 2
    }
  },
  {
    id: 'sentiment',
    name: 'Sentiment Analysis',
    description: 'Uses NLP on news and social media to gauge market sentiment',
    type: 'sentiment',
    timeframe: '1d',
    riskLevel: 'high',
    indicators: ['News Sentiment', 'Social Media', 'Search Volume'],
    parameters: {
      sentimentThreshold: 0.65,
      newsWeight: 0.6,
      socialWeight: 0.4,
      minimumConfidence: 0.7
    }
  },
  {
    id: 'grid',
    name: 'Grid Trading',
    description: 'Places multiple buy and sell orders at regular price intervals',
    type: 'grid',
    timeframe: '1h',
    riskLevel: 'low',
    indicators: ['Price Grid', 'Volume Profile'],
    parameters: {
      gridSize: 10,
      upperBound: 5,
      lowerBound: -5,
      profitTarget: 1.5
    }
  }
];

// Mock AI model configurations
export const availableAiModels: AIModelConfig[] = [
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'openrouter',
    endpoint: 'deepseek-ai/deepseek-coder-v1',
    parameters: {
      temperature: 0.7,
      maxTokens: 1024
    }
  },
  {
    id: 'gemini-2',
    name: 'Gemini 2',
    provider: 'openrouter',
    endpoint: 'google/gemini-2-pro',
    parameters: {
      temperature: 0.7,
      maxTokens: 1024
    }
  },
  {
    id: 'gpt-4',
    name: 'GPT-4 Turbo',
    provider: 'openrouter',
    endpoint: 'openai/gpt-4-turbo',
    parameters: {
      temperature: 0.7,
      maxTokens: 1024
    }
  },
  {
    id: 'claude-3',
    name: 'Claude 3 Opus',
    provider: 'openrouter',
    endpoint: 'anthropic/claude-3-opus',
    parameters: {
      temperature: 0.7,
      maxTokens: 1024
    }
  }
];

// Initialize a new AI trading bot with default parameters
export const initializeAiBot = (strategyId: string, modelId: string) => {
  const strategy = availableStrategies.find(s => s.id === strategyId);
  const model = availableAiModels.find(m => m.id === modelId);
  
  if (!strategy || !model) {
    throw new Error('Invalid strategy or model ID');
  }
  
  return {
    id: `bot-${Date.now()}`,
    name: `${strategy.name} Bot`,
    description: `AI trading bot using ${strategy.name} strategy with ${model.name}`,
    strategy,
    model: model.name,
    strategyId: strategy.id,
    status: 'paused' as const,
    createdAt: new Date().toISOString(),
    performance: {
      winRate: 0,
      trades: 0,
      profit: 0
    }
  };
};

// Get default strategy parameters for a given strategy
export const getDefaultStrategyParameters = (strategyId: string): AIStrategyParameters => {
  const strategy = availableStrategies.find(s => s.id === strategyId);
  
  if (!strategy) {
    return {
      buySignalThreshold: 0.7,
      sellSignalThreshold: 0.7,
      stopLossPercentage: 5,
      takeProfitPercentage: 10,
      timeframe: '1h',
      maxPositions: 3
    };
  }
  
  // Return strategy-specific default parameters
  switch (strategyId) {
    case 'trend-following':
      return {
        buySignalThreshold: 0.7,
        sellSignalThreshold: 0.7,
        stopLossPercentage: 5,
        takeProfitPercentage: 10,
        timeframe: strategy.timeframe || '4h',
        maxPositions: 3
      };
    case 'mean-reversion':
      return {
        buySignalThreshold: 0.8,
        sellSignalThreshold: 0.8,
        stopLossPercentage: 3,
        takeProfitPercentage: 5,
        timeframe: strategy.timeframe || '1h',
        maxPositions: 5
      };
    default:
      return {
        buySignalThreshold: 0.7,
        sellSignalThreshold: 0.7,
        stopLossPercentage: 5,
        takeProfitPercentage: 10,
        timeframe: strategy.timeframe || '1h',
        maxPositions: 3
      };
  }
};

// Run backtesting for a strategy with parameters
export const runBacktest = async (
  strategyId: string,
  coinId: string,
  params: AIStrategyParameters,
  startDate: string,
  endDate: string
): Promise<BacktestResults> => {
  // This is a mock implementation that would normally call an API or run a backtest
  // For demo purposes, we'll just return some fake results
  
  const strategy = availableStrategies.find(s => s.id === strategyId);
  if (!strategy) {
    throw new Error('Invalid strategy ID');
  }
  
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock results based on strategy risk level
  const winRate = strategy.riskLevel === 'high' ? 
    0.55 + Math.random() * 0.1 :
    strategy.riskLevel === 'medium' ?
      0.6 + Math.random() * 0.15 :
      0.65 + Math.random() * 0.2;
      
  const totalTrades = 50 + Math.floor(Math.random() * 100);
  const winningTrades = Math.floor(totalTrades * winRate);
  const losingTrades = totalTrades - winningTrades;
  
  const avgWin = strategy.riskLevel === 'high' ? 
    3 + Math.random() * 2 :
    strategy.riskLevel === 'medium' ?
      2 + Math.random() * 1.5 :
      1 + Math.random() * 1;
      
  const avgLoss = strategy.riskLevel === 'high' ? 
    2 + Math.random() * 1 :
    strategy.riskLevel === 'medium' ?
      1.5 + Math.random() * 0.8 :
      1 + Math.random() * 0.5;
  
  const profitLoss = (winningTrades * avgWin) - (losingTrades * avgLoss);
  const sharpeRatio = 0.8 + Math.random() * 1.2;
  const maxDrawdown = strategy.riskLevel === 'high' ? 
    15 + Math.random() * 10 :
    strategy.riskLevel === 'medium' ?
      10 + Math.random() * 7 :
      5 + Math.random() * 5;
  
  // Generate mock trades
  const trades = Array.from({ length: totalTrades }, (_, i) => {
    const isWin = i < winningTrades;
    return {
      id: `trade-${i}`,
      date: new Date(Date.now() - (i * 86400000)).toISOString(),
      type: Math.random() > 0.5 ? 'buy' : 'sell',
      entry: 100 + Math.random() * 20,
      exit: isWin ? 
        (100 + Math.random() * 20) * (1 + avgWin / 100) :
        (100 + Math.random() * 20) * (1 - avgLoss / 100),
      profit: isWin ? avgWin : -avgLoss,
      duration: Math.floor(Math.random() * 48) + 1
    };
  });
  
  return {
    totalTrades,
    winRate,
    profitLoss,
    sharpeRatio,
    maxDrawdown,
    trades
  };
};

export default {
  availableStrategies,
  availableAiModels,
  initializeAiBot,
  getDefaultStrategyParameters,
  runBacktest
};
