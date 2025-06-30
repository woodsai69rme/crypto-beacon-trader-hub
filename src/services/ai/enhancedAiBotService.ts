
import { AIBot, BotConfig, AITradingStrategy } from '@/types/trading';

export class EnhancedAiBotService {
  private bots: AIBot[] = [
    {
      id: 'bot-1',
      name: 'BTC Grid Master',
      description: 'Advanced grid trading bot for Bitcoin with dynamic range adjustments',
      strategy: 'grid',
      model: 'gpt-4o-mini',
      status: 'active',
      accountId: 'paper-1',
      targetAssets: ['BTC'],
      riskLevel: 'medium',
      maxTradeAmount: 5000,
      performance: {
        totalReturn: 12.5,
        winRate: 72,
        trades: 156,
        maxDrawdown: -3.2,
        sharpeRatio: 1.8
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'bot-2',
      name: 'ETH Trend Follower',
      description: 'Sophisticated trend following bot for Ethereum using multiple timeframes',
      strategy: 'trend-following',
      model: 'claude-3.5-sonnet',
      status: 'active',
      accountId: 'paper-1',
      targetAssets: ['ETH'],
      riskLevel: 'medium',
      maxTradeAmount: 3000,
      performance: {
        totalReturn: 18.3,
        winRate: 68,
        trades: 89,
        maxDrawdown: -5.1,
        sharpeRatio: 2.1
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'bot-3',
      name: 'Multi-Asset Momentum',
      description: 'Advanced momentum trading bot covering multiple cryptocurrencies',
      strategy: 'momentum',
      model: 'deepseek-r1',
      status: 'paused',
      accountId: 'paper-1',
      targetAssets: ['BTC', 'ETH', 'SOL', 'ADA'],
      riskLevel: 'high',
      maxTradeAmount: 8000,
      performance: {
        totalReturn: 24.7,
        winRate: 65,
        trades: 234,
        maxDrawdown: -8.3,
        sharpeRatio: 1.9
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'bot-4',
      name: 'Arbitrage Hunter',
      description: 'Cross-exchange arbitrage bot with real-time opportunity detection',
      strategy: 'arbitrage',
      model: 'gpt-4o',
      status: 'active',
      accountId: 'live-1',
      targetAssets: ['BTC', 'ETH', 'USDT'],
      riskLevel: 'low',
      maxTradeAmount: 2000,
      performance: {
        totalReturn: 8.9,
        winRate: 85,
        trades: 445,
        maxDrawdown: -1.2,
        sharpeRatio: 3.4
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'bot-5',
      name: 'Mean Reversion Pro',
      description: 'Statistical mean reversion bot with advanced volatility modeling',
      strategy: 'mean-reversion',
      model: 'gemini-2.0-flash',
      status: 'active',
      accountId: 'paper-1',
      targetAssets: ['BTC', 'ETH'],
      riskLevel: 'medium',
      maxTradeAmount: 4000,
      performance: {
        totalReturn: 15.2,
        winRate: 74,
        trades: 178,
        maxDrawdown: -4.1,
        sharpeRatio: 2.3
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'bot-6',
      name: 'Breakout Scanner',
      description: 'Pattern recognition bot specialized in breakout trading strategies',
      strategy: 'breakout',
      model: 'local-llama',
      status: 'active',
      accountId: 'paper-1',
      targetAssets: ['SOL', 'ADA', 'DOT'],
      riskLevel: 'high',
      maxTradeAmount: 6000,
      performance: {
        totalReturn: 21.8,
        winRate: 61,
        trades: 92,
        maxDrawdown: -7.5,
        sharpeRatio: 1.7
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'bot-7',
      name: 'Scalping Speed Demon',
      description: 'High-frequency scalping bot for quick profit opportunities',
      strategy: 'scalping',
      model: 'gpt-4o-mini',
      status: 'paused',
      accountId: 'live-1',
      targetAssets: ['BTC', 'ETH'],
      riskLevel: 'high',
      maxTradeAmount: 1500,
      performance: {
        totalReturn: 32.1,
        winRate: 58,
        trades: 1247,
        maxDrawdown: -12.3,
        sharpeRatio: 1.4
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'bot-8',
      name: 'Pattern Recognition AI',
      description: 'Advanced ML-powered pattern recognition for complex market structures',
      strategy: 'pattern-recognition',
      model: 'claude-3.5-sonnet',
      status: 'active',
      accountId: 'paper-1',
      targetAssets: ['BTC', 'ETH', 'SOL'],
      riskLevel: 'medium',
      maxTradeAmount: 7000,
      performance: {
        totalReturn: 19.6,
        winRate: 69,
        trades: 134,
        maxDrawdown: -6.2,
        sharpeRatio: 2.0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'bot-9',
      name: 'Sentiment Analysis Pro',
      description: 'News and social sentiment-driven trading bot with fake news detection',
      strategy: 'sentiment',
      model: 'deepseek-r1',
      status: 'active',
      accountId: 'paper-1',
      targetAssets: ['BTC', 'ETH', 'DOGE', 'SHIB'],
      riskLevel: 'medium',
      maxTradeAmount: 3500,
      performance: {
        totalReturn: 16.4,
        winRate: 71,
        trades: 203,
        maxDrawdown: -5.8,
        sharpeRatio: 1.9
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'bot-10',
      name: 'Machine Learning Hybrid',
      description: 'Advanced ML bot combining multiple strategies with adaptive learning',
      strategy: 'machine-learning',
      model: 'gpt-4o',
      status: 'active',
      accountId: 'live-1',
      targetAssets: ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'],
      riskLevel: 'high',
      maxTradeAmount: 10000,
      performance: {
        totalReturn: 28.9,
        winRate: 66,
        trades: 167,
        maxDrawdown: -9.1,
        sharpeRatio: 2.2
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'bot-11',
      name: 'AI Predictive Oracle',
      description: 'Next-generation predictive AI using advanced forecasting models',
      strategy: 'ai-predictive',
      model: 'local-mistral',
      status: 'active',
      accountId: 'paper-1',
      targetAssets: ['BTC', 'ETH'],
      riskLevel: 'high',
      maxTradeAmount: 12000,
      performance: {
        totalReturn: 35.7,
        winRate: 63,
        trades: 98,
        maxDrawdown: -11.4,
        sharpeRatio: 2.1
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'bot-12',
      name: 'Traditional TA Master',
      description: 'Classic technical analysis bot with proven indicators and strategies',
      strategy: 'traditional',
      model: 'gemini-2.0-flash',
      status: 'active',
      accountId: 'paper-1',
      targetAssets: ['BTC', 'ETH', 'LTC'],
      riskLevel: 'low',
      maxTradeAmount: 2500,
      performance: {
        totalReturn: 11.3,
        winRate: 78,
        trades: 145,
        maxDrawdown: -2.8,
        sharpeRatio: 2.4
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  private strategies: AITradingStrategy[] = [
    {
      id: 'grid-1',
      name: 'Dynamic Grid Trading',
      description: 'Advanced grid trading with dynamic range adjustments',
      type: 'grid',
      timeframe: '5m',
      parameters: {
        gridSize: 20,
        rangeFactor: 0.02,
        dynamicAdjustment: true
      }
    },
    {
      id: 'trend-1',
      name: 'Multi-Timeframe Trend Following',
      description: 'Trend following across multiple timeframes',
      type: 'trend-following',
      timeframe: '15m',
      parameters: {
        fastMA: 12,
        slowMA: 26,
        signalMA: 9
      }
    },
    {
      id: 'arbitrage-1',
      name: 'Cross-Exchange Arbitrage',
      description: 'Profit from price differences between exchanges',
      type: 'arbitrage',
      timeframe: '1m',
      parameters: {
        minSpread: 0.5,
        maxSlippage: 0.1
      }
    },
    {
      id: 'whale-1',
      name: 'Whale Activity Tracker',
      description: 'Monitor and follow large wallet movements',
      type: 'whale-tracking',
      timeframe: '1m',
      parameters: {
        minTransactionSize: 1000000,
        followDelay: 30
      }
    },
    {
      id: 'portfolio-1',
      name: 'Portfolio Rebalancing',
      description: 'Automatic portfolio rebalancing based on targets',
      type: 'portfolio-balancing',
      timeframe: '1h',
      parameters: {
        rebalanceThreshold: 5,
        targetAllocations: {
          BTC: 40,
          ETH: 30,
          SOL: 20,
          Others: 10
        }
      }
    }
  ];

  getAllBots(): AIBot[] {
    return this.bots;
  }

  getActiveBots(): AIBot[] {
    return this.bots.filter(bot => bot.status === 'active');
  }

  getTopPerformingBots(limit: number = 5): AIBot[] {
    return [...this.bots]
      .sort((a, b) => b.performance.totalReturn - a.performance.totalReturn)
      .slice(0, limit);
  }

  getBotsByAccount(accountId: string): AIBot[] {
    return this.bots.filter(bot => bot.accountId === accountId);
  }

  getBotsByStrategy(strategy: string): AIBot[] {
    return this.bots.filter(bot => bot.strategy === strategy);
  }

  getAvailableStrategies(): AITradingStrategy[] {
    return this.strategies;
  }

  toggleBot(botId: string): boolean {
    const bot = this.bots.find(b => b.id === botId);
    if (!bot) return false;

    bot.status = bot.status === 'active' ? 'paused' : 'active';
    bot.updatedAt = new Date().toISOString();
    return true;
  }

  updateBotPerformance(botId: string, performance: Partial<AIBot['performance']>): boolean {
    const bot = this.bots.find(b => b.id === botId);
    if (!bot) return false;

    bot.performance = { ...bot.performance, ...performance };
    bot.updatedAt = new Date().toISOString();
    return true;
  }

  createBot(config: BotConfig): AIBot {
    const newBot: AIBot = {
      ...config,
      status: 'paused',
      accountId: config.parameters.accountId || 'paper-1',
      performance: {
        totalReturn: 0,
        winRate: 0,
        trades: 0,
        maxDrawdown: 0,
        sharpeRatio: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.bots.push(newBot);
    return newBot;
  }

  deleteBot(botId: string): boolean {
    const index = this.bots.findIndex(b => b.id === botId);
    if (index === -1) return false;

    this.bots.splice(index, 1);
    return true;
  }

  getBotStats() {
    const totalBots = this.bots.length;
    const activeBots = this.bots.filter(bot => bot.status === 'active').length;
    const totalTrades = this.bots.reduce((sum, bot) => sum + bot.performance.trades, 0);
    const avgReturn = this.bots.reduce((sum, bot) => sum + bot.performance.totalReturn, 0) / totalBots;
    const avgWinRate = this.bots.reduce((sum, bot) => sum + bot.performance.winRate, 0) / totalBots;

    return {
      totalBots,
      activeBots,
      totalTrades,
      avgReturn,
      avgWinRate
    };
  }
}

export const enhancedAiBotService = new EnhancedAiBotService();
export default enhancedAiBotService;
