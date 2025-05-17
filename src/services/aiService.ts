
import { AITradingBot, AITradingStrategy, AIStrategyParameters } from '@/types/trading';
import { AIModelConfig, BacktestResults } from '@/types/trading';

// Implement mock functions
export const fetchAiModels = async (): Promise<AIModelConfig[]> => {
  return [
    {
      id: 'model-1',
      name: 'DeepSeek R1',
      provider: 'OpenRouter',
      endpoint: 'https://api.openrouter.ai/api/v1/chat',
      parameters: {
        temperature: 0.7,
        max_tokens: 1024
      }
    },
    {
      id: 'model-2',
      name: 'Gemini Pro',
      provider: 'OpenRouter',
      endpoint: 'https://api.openrouter.ai/api/v1/chat',
      parameters: {
        temperature: 0.5,
        max_tokens: 2048
      }
    }
  ];
};

export const getAiTradingBots = async (): Promise<AITradingBot[]> => {
  return [
    {
      id: 'bot-1',
      name: 'Trend Follower',
      model: 'DeepSeek R1',
      status: 'active',
      strategy: 'trend-following',
      asset: 'bitcoin',
      createdAt: new Date().toISOString(),
      accuracy: 0.78,
      trades: 42,
      successRate: 0.65,
      profitLoss: 1250.50,
      totalTrades: 65,
      performance: {
        winRate: 0.65,
        trades: 65,
        profit: 1250.50
      }
    },
    {
      id: 'bot-2',
      name: 'Mean Reversal',
      model: 'Gemini Pro',
      status: 'paused',
      strategy: 'mean-reversion',
      asset: 'ethereum',
      createdAt: new Date().toISOString(),
      accuracy: 0.69,
      trades: 28,
      successRate: 0.58,
      profitLoss: 850.30,
      totalTrades: 45,
      performance: {
        winRate: 0.58,
        trades: 45,
        profit: 850.30
      }
    }
  ];
};

export const getAiStrategyParameters = (strategyId: string): AIStrategyParameters => {
  return {
    buySignalThreshold: 0.7,
    sellSignalThreshold: 0.8,
    stopLossPercentage: 5,
    takeProfitPercentage: 10,
    timeframe: '4h',
    maxPositions: 5
  };
};

export const getStrategies = async (): Promise<AITradingStrategy[]> => {
  return [
    {
      id: 'trend-following',
      name: 'Trend Following',
      description: 'Follows market trends for steady gains',
      type: 'trend',
      timeframe: '4h',
      riskLevel: 'medium',
      parameters: {
        lookbackPeriod: 14,
        buyThreshold: 0.7
      },
      indicators: ['SMA', 'EMA', 'MACD']
    },
    {
      id: 'mean-reversion',
      name: 'Mean Reversion',
      description: 'Capitalizes on price returning to the mean',
      type: 'reversion',
      timeframe: '1h',
      riskLevel: 'medium',
      parameters: {
        bands: 2,
        period: 20
      },
      indicators: ['Bollinger Bands', 'RSI', 'Stochastics']
    },
    {
      id: 'breakout',
      name: 'Breakout Strategy',
      description: 'Identifies and trades breakout patterns',
      type: 'breakout',
      timeframe: '1d',
      riskLevel: 'high',
      parameters: {
        volatilityThreshold: 2.5,
        volumeIncrease: 200
      },
      indicators: ['ATR', 'Volume', 'Support/Resistance']
    },
    {
      id: 'sentiment-based',
      name: 'NLP Sentiment Analysis',
      description: 'Trades based on news sentiment and social media',
      type: 'sentiment',
      timeframe: '6h',
      riskLevel: 'high',
      parameters: {
        sentimentThreshold: 0.65,
        newsWeight: 0.7,
        socialWeight: 0.3
      },
      indicators: ['Sentiment Score', 'News Volume', 'Social Activity']
    }
  ];
};

// Export availableStrategies as a constant for components that need it
export const availableStrategies = [
  {
    id: 'trend-following',
    name: 'Trend Following'
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion'
  },
  {
    id: 'breakout',
    name: 'Breakout Trading'
  },
  {
    id: 'sentiment-based',
    name: 'Sentiment Analysis'
  }
];

export const runBacktest = async (
  strategyId: string,
  coinId: string,
  timeframe: string,
  params: Record<string, any> = {}
): Promise<BacktestResults> => {
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    totalTrades: 48,
    winRate: 0.65,
    profitLoss: 1250.75,
    sharpeRatio: 1.8,
    maxDrawdown: 12.5,
    trades: []
  };
};

export const createTradeBot = async (
  name: string,
  modelId: string,
  strategyId: string,
  asset: string,
  params: Record<string, any> = {}
): Promise<AITradingBot> => {
  return {
    id: `bot-${Date.now()}`,
    name,
    model: modelId,
    status: 'active',
    strategy: strategyId,
    asset,
    createdAt: new Date().toISOString(),
    accuracy: 0,
    trades: 0,
    successRate: 0,
    profitLoss: 0,
    totalTrades: 0,
    performance: {
      winRate: 0,
      trades: 0,
      profit: 0
    }
  };
};
