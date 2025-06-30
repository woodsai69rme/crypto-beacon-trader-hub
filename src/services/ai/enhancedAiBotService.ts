
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

  getTopPerformingBots(limit: number = 5): AIBot[] {
    return [...this.bots]
      .sort((a, b) => b.performance.totalReturn - a.performance.totalReturn)
      .slice(0, limit);
  }

  getAvailableStrategies(): string[] {
    return [
      'grid',
      'trend-following',
      'mean-reversion',
      'breakout',
      'scalping',
      'arbitrage',
      'momentum',
      'pattern-recognition',
      'machine-learning',
      'sentiment',
      'hybrid',
      'custom',
      'whale-tracking',
      'portfolio-balancing'
    ];
  }

  toggleBot(id: string): boolean {
    const bot = this.getBotById(id);
    if (!bot) return false;

    if (bot.status === 'active') {
      bot.status = 'paused';
    } else if (bot.status === 'paused') {
      bot.status = 'active';
    }
    bot.updatedAt = new Date().toISOString();
    return true;
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
