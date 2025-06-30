
import { AIBot, BotConfig } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

class EnhancedAiBotService {
  private bots: AIBot[] = [
    {
      id: uuidv4(),
      name: 'Grid Master Pro',
      description: 'Advanced grid trading with dynamic range adjustment',
      strategy: 'grid',
      model: 'deepseek-r1',
      status: 'paused',
      accountId: 'paper-1',
      targetAssets: ['BTC', 'ETH'],
      riskLevel: 'medium',
      maxTradeAmount: 1000,
      performance: {
        totalReturn: 15.2,
        winRate: 72.5,
        trades: 145,
        totalTrades: 145,
        maxDrawdown: 8.1,
        sharpeRatio: 1.8
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Trend Follower AI',
      description: 'AI-powered trend following with momentum analysis',
      strategy: 'trend-following',
      model: 'gpt-4o-mini',
      status: 'active',
      accountId: 'paper-1',
      targetAssets: ['BTC', 'SOL'],
      riskLevel: 'high',
      maxTradeAmount: 2000,
      performance: {
        totalReturn: 28.7,
        winRate: 68.2,
        trades: 89,
        totalTrades: 89,
        maxDrawdown: 12.4,
        sharpeRatio: 2.1
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Mean Reversion Wizard',
      description: 'Statistical arbitrage with mean reversion detection',
      strategy: 'mean-reversion',
      model: 'claude-3.5-sonnet',
      status: 'active',
      accountId: 'paper-2',
      targetAssets: ['ETH', 'ADA'],
      riskLevel: 'low',
      maxTradeAmount: 500,
      performance: {
        totalReturn: 12.3,
        winRate: 78.9,
        trades: 203,
        totalTrades: 203,
        maxDrawdown: 5.2,
        sharpeRatio: 1.9
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Breakout Hunter',
      description: 'Volatility breakout detection with volume confirmation',
      strategy: 'breakout',
      model: 'gemini-2.0-flash',
      status: 'paused',
      accountId: 'paper-1',
      targetAssets: ['BTC', 'ETH', 'SOL'],
      riskLevel: 'high',
      maxTradeAmount: 1500,
      performance: {
        totalReturn: 22.1,
        winRate: 65.4,
        trades: 76,
        totalTrades: 76,
        maxDrawdown: 15.7,
        sharpeRatio: 1.6
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Scalp Master 3000',
      description: 'High-frequency scalping with micro-trend analysis',
      strategy: 'scalping',
      model: 'deepseek-r1',
      status: 'active',
      accountId: 'paper-2',
      targetAssets: ['BTC'],
      riskLevel: 'medium',
      maxTradeAmount: 300,
      performance: {
        totalReturn: 8.9,
        winRate: 82.1,
        trades: 567,
        totalTrades: 567,
        maxDrawdown: 3.8,
        sharpeRatio: 2.3
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Arbitrage Scanner',
      description: 'Cross-exchange arbitrage opportunity scanner',
      strategy: 'arbitrage',
      model: 'gpt-4o',
      status: 'paused',
      accountId: 'paper-1',
      targetAssets: ['BTC', 'ETH', 'USDT'],
      riskLevel: 'low',
      maxTradeAmount: 2000,
      performance: {
        totalReturn: 6.7,
        winRate: 89.3,
        trades: 234,
        totalTrades: 234,
        maxDrawdown: 2.1,
        sharpeRatio: 2.8
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Momentum Rider',
      description: 'Momentum-based trading with RSI and MACD confirmation',
      strategy: 'momentum',
      model: 'claude-3.5-sonnet',
      status: 'active',
      accountId: 'paper-2',
      targetAssets: ['SOL', 'ADA', 'DOT'],
      riskLevel: 'medium',
      maxTradeAmount: 800,
      performance: {
        totalReturn: 19.4,
        winRate: 71.2,
        trades: 156,
        totalTrades: 156,
        maxDrawdown: 9.8,
        sharpeRatio: 1.7
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Pattern Recognition AI',
      description: 'Advanced chart pattern recognition and trading',
      strategy: 'pattern-recognition',
      model: 'gpt-4o-mini',
      status: 'paused',
      accountId: 'paper-1',
      targetAssets: ['BTC', 'ETH'],
      riskLevel: 'medium',
      maxTradeAmount: 1200,
      performance: {
        totalReturn: 16.8,
        winRate: 69.7,
        trades: 98,
        totalTrades: 98,
        maxDrawdown: 11.2,
        sharpeRatio: 1.5
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'ML Predictor',
      description: 'Machine learning price prediction model',
      strategy: 'machine-learning',
      model: 'deepseek-r1',
      status: 'active',
      accountId: 'paper-2',
      targetAssets: ['BTC', 'ETH', 'SOL', 'ADA'],
      riskLevel: 'high',
      maxTradeAmount: 1800,
      performance: {
        totalReturn: 31.5,
        winRate: 64.8,
        trades: 112,
        totalTrades: 112,
        maxDrawdown: 18.3,
        sharpeRatio: 1.9
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Sentiment Trader',
      description: 'Social sentiment and news-based trading',
      strategy: 'sentiment',
      model: 'claude-3.5-sonnet',
      status: 'active',
      accountId: 'paper-1',
      targetAssets: ['BTC', 'ETH', 'DOGE'],
      riskLevel: 'medium',
      maxTradeAmount: 1000,
      performance: {
        totalReturn: 24.6,
        winRate: 67.3,
        trades: 87,
        totalTrades: 87,
        maxDrawdown: 13.9,
        sharpeRatio: 1.8
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Hybrid Strategy Bot',
      description: 'Multi-strategy approach with dynamic switching',
      strategy: 'hybrid',
      model: 'gpt-4o',
      status: 'paused',
      accountId: 'paper-2',
      targetAssets: ['BTC', 'ETH', 'SOL'],
      riskLevel: 'medium',
      maxTradeAmount: 1500,
      performance: {
        totalReturn: 21.7,
        winRate: 73.1,
        trades: 134,
        totalTrades: 134,
        maxDrawdown: 10.4,
        sharpeRatio: 2.0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Custom Strategy X',
      description: 'User-defined custom trading strategy',
      strategy: 'custom',
      model: 'local-llama',
      status: 'paused',
      accountId: 'paper-1',
      targetAssets: ['BTC'],
      riskLevel: 'low',
      maxTradeAmount: 600,
      performance: {
        totalReturn: 7.8,
        winRate: 76.4,
        trades: 45,
        totalTrades: 45,
        maxDrawdown: 4.2,
        sharpeRatio: 1.6
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Whale Tracker',
      description: 'Large transaction and whale movement tracker',
      strategy: 'whale-tracking',
      model: 'deepseek-r1',
      status: 'active',
      accountId: 'paper-1',
      targetAssets: ['BTC', 'ETH'],
      riskLevel: 'high',
      maxTradeAmount: 2500,
      performance: {
        totalReturn: 18.9,
        winRate: 61.2,
        trades: 67,
        totalTrades: 67,
        maxDrawdown: 16.7,
        sharpeRatio: 1.4
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Portfolio Balancer',
      description: 'Automated portfolio rebalancing and optimization',
      strategy: 'portfolio-balancing',
      model: 'claude-3.5-sonnet',
      status: 'active',
      accountId: 'paper-2',
      targetAssets: ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'],
      riskLevel: 'low',
      maxTradeAmount: 1000,
      performance: {
        totalReturn: 14.3,
        winRate: 79.6,
        trades: 189,
        totalTrades: 189,
        maxDrawdown: 6.8,
        sharpeRatio: 2.1
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  getAllBots(): AIBot[] {
    return [...this.bots];
  }

  getBotById(id: string): AIBot | undefined {
    return this.bots.find(bot => bot.id === id);
  }

  getActiveBots(): AIBot[] {
    return this.bots.filter(bot => bot.status === 'active');
  }

  getBotsByStrategy(strategy: string): AIBot[] {
    return this.bots.filter(bot => bot.strategy === strategy);
  }

  createBot(config: BotConfig): AIBot {
    const newBot: AIBot = {
      id: config.id,
      name: config.name,
      description: config.description,
      strategy: config.strategy,
      model: config.model,
      status: 'paused',
      accountId: 'paper-1',
      targetAssets: config.targetAssets,
      riskLevel: config.riskLevel,
      maxTradeAmount: config.maxTradeAmount,
      performance: {
        totalReturn: 0,
        winRate: 0,
        trades: 0,
        totalTrades: 0,
        maxDrawdown: 0,
        sharpeRatio: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.bots.push(newBot);
    return newBot;
  }

  updateBot(id: string, updates: Partial<AIBot>): AIBot | null {
    const index = this.bots.findIndex(bot => bot.id === id);
    if (index === -1) return null;

    this.bots[index] = {
      ...this.bots[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.bots[index];
  }

  deleteBot(id: string): boolean {
    const index = this.bots.findIndex(bot => bot.id === id);
    if (index === -1) return false;

    this.bots.splice(index, 1);
    return true;
  }

  startBot(id: string): boolean {
    const bot = this.getBotById(id);
    if (!bot) return false;

    bot.status = 'active';
    bot.updatedAt = new Date().toISOString();
    return true;
  }

  stopBot(id: string): boolean {
    const bot = this.getBotById(id);
    if (!bot) return false;

    bot.status = 'paused';
    bot.updatedAt = new Date().toISOString();
    return true;
  }

  getPerformanceStats() {
    const activeBots = this.getActiveBots();
    const totalReturn = activeBots.reduce((sum, bot) => sum + bot.performance.totalReturn, 0);
    const avgWinRate = activeBots.reduce((sum, bot) => sum + bot.performance.winRate, 0) / activeBots.length;
    const totalTrades = activeBots.reduce((sum, bot) => sum + bot.performance.trades, 0);

    return {
      totalBots: this.bots.length,
      activeBots: activeBots.length,
      totalReturn: totalReturn / activeBots.length || 0,
      avgWinRate: avgWinRate || 0,
      totalTrades
    };
  }
}

export const enhancedAiBotService = new EnhancedAiBotService();
export default enhancedAiBotService;
