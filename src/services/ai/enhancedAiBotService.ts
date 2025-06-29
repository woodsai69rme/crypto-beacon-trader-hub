import { AIBot, AITradingStrategy, AITradingStrategyType } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

class EnhancedAiBotService {
  private static readonly PREDEFINED_BOTS: Omit<AIBot, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Trend Master Pro',
      description: 'Advanced trend-following bot with ML enhancement',
      strategy: 'trend-following',
      model: 'gpt-4',
      isActive: false,
      riskLevel: 'medium',
      maxTradeAmount: 1000,
      targetAssets: ['bitcoin', 'ethereum'],
      settings: {
        stopLoss: 5,
        takeProfit: 15,
        maxPositions: 3,
        riskPerTrade: 2
      },
      performance: {
        totalReturn: 24.5,
        winRate: 68,
        trades: 47,
        maxDrawdown: 8.2,
        sharpeRatio: 1.4
      },
      status: 'inactive'
    },
    {
      name: 'Mean Reversion Maestro',
      description: 'Exploits overbought/oversold conditions with precision',
      strategy: 'mean-reversion',
      model: 'claude-3-opus',
      isActive: false,
      riskLevel: 'low',
      maxTradeAmount: 500,
      targetAssets: ['ethereum', 'ripple'],
      settings: {
        stopLoss: 3,
        takeProfit: 10,
        maxPositions: 5,
        riskPerTrade: 1
      },
      performance: {
        totalReturn: 18.9,
        winRate: 71,
        trades: 63,
        maxDrawdown: 5.9,
        sharpeRatio: 1.6
      },
      status: 'inactive'
    },
    {
      name: 'Breakout Blitz',
      description: 'Captures explosive price movements with rapid execution',
      strategy: 'breakout',
      model: 'deepseek-coder-33b',
      isActive: false,
      riskLevel: 'high',
      maxTradeAmount: 2000,
      targetAssets: ['solana', 'cardano'],
      settings: {
        stopLoss: 7,
        takeProfit: 20,
        maxPositions: 2,
        riskPerTrade: 4
      },
      performance: {
        totalReturn: 32.1,
        winRate: 59,
        trades: 31,
        maxDrawdown: 11.8,
        sharpeRatio: 1.9
      },
      status: 'inactive'
    },
    {
      name: 'Scalping Samurai',
      description: 'High-frequency scalping bot for small, quick profits',
      strategy: 'scalping',
      model: 'gemini-1.5-pro',
      isActive: false,
      riskLevel: 'medium',
      maxTradeAmount: 300,
      targetAssets: ['litecoin', 'polkadot'],
      settings: {
        stopLoss: 2,
        takeProfit: 5,
        maxPositions: 10,
        riskPerTrade: 0.5
      },
      performance: {
        totalReturn: 15.6,
        winRate: 75,
        trades: 124,
        maxDrawdown: 3.5,
        sharpeRatio: 2.2
      },
      status: 'inactive'
    },
    {
      name: 'Grid Guardian',
      description: 'Places buy/sell orders in a grid for consistent profits',
      strategy: 'grid',
      model: 'claude-3-haiku',
      isActive: false,
      riskLevel: 'low',
      maxTradeAmount: 800,
      targetAssets: ['chainlink', 'tron'],
      settings: {
        stopLoss: 4,
        takeProfit: 12,
        maxPositions: 6,
        riskPerTrade: 1.5
      },
      performance: {
        totalReturn: 11.2,
        winRate: 69,
        trades: 87,
        maxDrawdown: 4.8,
        sharpeRatio: 1.5
      },
      status: 'inactive'
    },
    {
      name: 'Arbitrage Ace',
      description: 'Exploits price differences between exchanges for risk-free profits',
      strategy: 'arbitrage',
      model: 'gpt-4',
      isActive: false,
      riskLevel: 'low',
      maxTradeAmount: 1500,
      targetAssets: ['bitcoin', 'ethereum'],
      settings: {
        stopLoss: 1,
        takeProfit: 3,
        maxPositions: 1,
        riskPerTrade: 0.25
      },
      performance: {
        totalReturn: 9.5,
        winRate: 92,
        trades: 53,
        maxDrawdown: 2.1,
        sharpeRatio: 2.8
      },
      status: 'inactive'
    },
    {
      name: 'Momentum Maverick',
      description: 'Rides strong price trends for maximum gains',
      strategy: 'momentum',
      model: 'deepseek-coder-33b',
      isActive: false,
      riskLevel: 'high',
      maxTradeAmount: 2200,
      targetAssets: ['solana', 'cardano'],
      settings: {
        stopLoss: 6,
        takeProfit: 18,
        maxPositions: 3,
        riskPerTrade: 3.5
      },
      performance: {
        totalReturn: 28.7,
        winRate: 63,
        trades: 39,
        maxDrawdown: 10.5,
        sharpeRatio: 1.7
      },
      status: 'inactive'
    },
    {
      name: 'Pattern Prodigy',
      description: 'Identifies and trades chart patterns with high accuracy',
      strategy: 'pattern-recognition',
      model: 'gemini-1.5-pro',
      isActive: false,
      riskLevel: 'medium',
      maxTradeAmount: 700,
      targetAssets: ['litecoin', 'polkadot'],
      settings: {
        stopLoss: 3.5,
        takeProfit: 11,
        maxPositions: 4,
        riskPerTrade: 1.25
      },
      performance: {
        totalReturn: 16.4,
        winRate: 72,
        trades: 95,
        maxDrawdown: 4.1,
        sharpeRatio: 2.0
      },
      status: 'inactive'
    },
    {
      name: 'AI Predictive Pioneer',
      description: 'Uses AI to predict market movements and execute trades',
      strategy: 'ai-predictive',
      model: 'gpt-4',
      isActive: false,
      riskLevel: 'medium',
      maxTradeAmount: 1200,
      targetAssets: ['bitcoin', 'ethereum'],
      settings: {
        stopLoss: 4.5,
        takeProfit: 13,
        maxPositions: 3,
        riskPerTrade: 2.25
      },
      performance: {
        totalReturn: 21.9,
        winRate: 66,
        trades: 58,
        maxDrawdown: 7.3,
        sharpeRatio: 1.6
      },
      status: 'inactive'
    },
    {
      name: 'Traditional Trend Tracker',
      description: 'Applies traditional indicators to crypto markets',
      strategy: 'traditional',
      model: 'claude-3-opus',
      isActive: false,
      riskLevel: 'low',
      maxTradeAmount: 600,
      targetAssets: ['chainlink', 'tron'],
      settings: {
        stopLoss: 2.5,
        takeProfit: 9,
        maxPositions: 5,
        riskPerTrade: 0.75
      },
      performance: {
        totalReturn: 10.3,
        winRate: 70,
        trades: 79,
        maxDrawdown: 3.9,
        sharpeRatio: 1.8
      },
      status: 'inactive'
    },
    {
      name: 'Whale Activity Tracker',
      description: 'Monitors large wallet movements and follows whale patterns',
      strategy: 'whale-tracking' as AITradingStrategyType,
      model: 'claude-3-sonnet',
      isActive: false,
      riskLevel: 'high',
      maxTradeAmount: 2500,
      targetAssets: ['bitcoin', 'ethereum', 'binancecoin'],
      settings: {
        stopLoss: 8,
        takeProfit: 25,
        maxPositions: 2,
        riskPerTrade: 3
      },
      performance: {
        totalReturn: 31.2,
        winRate: 61,
        trades: 23,
        maxDrawdown: 12.5,
        sharpeRatio: 1.8
      },
      status: 'inactive'
    },
    {
      name: 'Portfolio Rebalance Bot',
      description: 'Automatically rebalances portfolio based on target allocations',
      strategy: 'portfolio-balancing' as AITradingStrategyType,
      model: 'gpt-4',
      isActive: false,
      riskLevel: 'low',
      maxTradeAmount: 5000,
      targetAssets: ['bitcoin', 'ethereum', 'solana', 'cardano'],
      settings: {
        stopLoss: 3,
        takeProfit: 8,
        maxPositions: 8,
        riskPerTrade: 1
      },
      performance: {
        totalReturn: 12.8,
        winRate: 73,
        trades: 156,
        maxDrawdown: 4.2,
        sharpeRatio: 2.1
      },
      status: 'inactive'
    }
  ];

  private static bots: AIBot[] = EnhancedAiBotService.PREDEFINED_BOTS.map(bot => ({
    ...bot,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  }));

  static getAllBots(): AIBot[] {
    return this.bots;
  }

  static getBotById(botId: string): AIBot | undefined {
    return this.bots.find(bot => bot.id === botId);
  }

  static getActiveBots(): AIBot[] {
    return this.bots.filter(bot => bot.status === 'active');
  }

  static getTopPerformingBots(count: number): AIBot[] {
    return [...this.bots]
      .sort((a, b) => b.performance.totalReturn - a.performance.totalReturn)
      .slice(0, count);
  }

  static getAvailableStrategies(): AITradingStrategy[] {
    return [
      {
        id: 'trend-following',
        name: 'Trend Following',
        description: 'Trades in the direction of the current trend',
        type: 'trend-following',
        timeframe: '1D',
        parameters: {
          movingAverage: 200,
          stopLoss: 5,
          takeProfit: 15
        },
        performance: {
          winRate: 65,
          profitFactor: 1.8,
          sharpeRatio: 1.2
        }
      },
      {
        id: 'mean-reversion',
        name: 'Mean Reversion',
        description: 'Trades against extreme price movements',
        type: 'mean-reversion',
        timeframe: '4H',
        parameters: {
          rsiOversold: 30,
          rsiOverbought: 70,
          stopLoss: 3,
          takeProfit: 10
        },
        performance: {
          winRate: 70,
          profitFactor: 2.1,
          sharpeRatio: 1.5
        }
      },
      {
        id: 'breakout',
        name: 'Breakout',
        description: 'Trades when price breaks through resistance/support',
        type: 'breakout',
        timeframe: '1H',
        parameters: {
          volumeMultiplier: 1.5,
          stopLoss: 7,
          takeProfit: 20
        },
        performance: {
          winRate: 60,
          profitFactor: 1.6,
          sharpeRatio: 0.9
        }
      },
      {
        id: 'scalping',
        name: 'Scalping',
        description: 'Executes high-frequency trades for small profits',
        type: 'scalping',
        timeframe: '5m',
        parameters: {
          orderBookImbalance: 0.8,
          stopLoss: 2,
          takeProfit: 5
        },
        performance: {
          winRate: 75,
          profitFactor: 2.4,
          sharpeRatio: 1.8
        }
      },
      {
        id: 'arbitrage',
        name: 'Arbitrage',
        description: 'Exploits price differences between exchanges',
        type: 'arbitrage',
        timeframe: '1m',
        parameters: {
          minProfit: 0.5,
          maxSlippage: 0.1
        },
        performance: {
          winRate: 90,
          profitFactor: 3.5,
          sharpeRatio: 2.5
        }
      },
      {
        id: 'grid',
        name: 'Grid Trading',
        description: 'Places buy/sell orders in a grid pattern',
        type: 'grid',
        timeframe: '1H',
        parameters: {
          gridSpacing: 1,
          stopLoss: 4,
          takeProfit: 12
        },
        performance: {
          winRate: 68,
          profitFactor: 1.9,
          sharpeRatio: 1.3
        }
      },
      {
        id: 'momentum',
        name: 'Momentum',
        description: 'Trades assets with strong upward momentum',
        type: 'momentum',
        timeframe: '4H',
        parameters: {
          rsiThreshold: 60,
          stopLoss: 6,
          takeProfit: 18
        },
        performance: {
          winRate: 62,
          profitFactor: 1.7,
          sharpeRatio: 1.1
        }
      },
      {
        id: 'pattern-recognition',
        name: 'Pattern Recognition',
        description: 'Identifies and trades chart patterns',
        type: 'pattern-recognition',
        timeframe: '1D',
        parameters: {
          pattern: 'head-and-shoulders',
          stopLoss: 3.5,
          takeProfit: 11
        },
        performance: {
          winRate: 72,
          profitFactor: 2.2,
          sharpeRatio: 1.6
        }
      },
      {
        id: 'machine-learning',
        name: 'Machine Learning',
        description: 'Uses ML to predict market movements',
        type: 'machine-learning',
        timeframe: '1H',
        parameters: {
          modelType: 'lstm',
          stopLoss: 4.5,
          takeProfit: 13
        },
        performance: {
          winRate: 66,
          profitFactor: 1.8,
          sharpeRatio: 1.4
        }
      },
      {
        id: 'sentiment',
        name: 'Sentiment Analysis',
        description: 'Trades based on market sentiment from news/social media',
        type: 'sentiment',
        timeframe: '4H',
        parameters: {
          sentimentThreshold: 0.7,
          stopLoss: 2.5,
          takeProfit: 9
        },
        performance: {
          winRate: 69,
          profitFactor: 2.0,
          sharpeRatio: 1.7
        }
      },
      {
        id: 'whale-tracking',
        name: 'Whale Tracking',
        description: 'Monitors large wallet movements and follows whale patterns',
        type: 'whale-tracking',
        timeframe: '1H',
        parameters: {
          volumeThreshold: 1000000,
          stopLoss: 8,
          takeProfit: 25
        },
        performance: {
          winRate: 61,
          profitFactor: 1.9,
          sharpeRatio: 1.5
        }
      },
      {
        id: 'portfolio-balancing',
        name: 'Portfolio Balancing',
        description: 'Automatically rebalances portfolio allocations',
        type: 'portfolio-balancing',
        timeframe: '1D',
        parameters: {
          targetAllocation: {
            bitcoin: 0.4,
            ethereum: 0.3,
            solana: 0.2,
            cardano: 0.1
          },
          stopLoss: 3,
          takeProfit: 8
        },
        performance: {
          winRate: 73,
          profitFactor: 2.3,
          sharpeRatio: 1.9
        }
      }
    ];
  }

  static toggleBot(botId: string): void {
    this.bots = this.bots.map(bot =>
      bot.id === botId ? { ...bot, status: bot.status === 'active' ? 'paused' : 'active' } : bot
    );
  }

  static createBot(bot: Omit<AIBot, 'id' | 'createdAt' | 'updatedAt' | 'performance' | 'status'>): AIBot {
    const newBot: AIBot = {
      id: uuidv4(),
      ...bot,
      createdAt: new Date().toISOString(),
      performance: {
        totalReturn: 0,
        winRate: 0,
        trades: 0,
        maxDrawdown: 0,
        sharpeRatio: 0
      },
      status: 'inactive'
    };
    this.bots.push(newBot);
    return newBot;
  }

  static updateBot(botId: string, updates: Partial<AIBot>): AIBot | undefined {
    this.bots = this.bots.map(bot => (bot.id === botId ? { ...bot, ...updates } : bot));
    return this.getBotById(botId);
  }

  static deleteBot(botId: string): void {
    this.bots = this.bots.filter(bot => bot.id !== botId);
  }
}

export const enhancedAiBotService = EnhancedAiBotService;
