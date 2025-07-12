
import { AIBot, BotConfig, AITradingStrategy } from '@/types/trading';

export interface SystemStats {
  totalBots: number;
  activeBots: number;
  totalReturn: number;
  avgWinRate: number;
  totalTrades: number;
}

class ComprehensiveAiBotSystem {
  private bots: Map<string, AIBot> = new Map();
  private activeStrategies: Map<string, any> = new Map();
  private systemRunning: boolean = false;

  async createBot(config: BotConfig): Promise<AIBot> {
    const bot: AIBot = {
      id: config.id,
      name: config.name,
      description: config.description,
      strategy: config.strategy,
      status: 'stopped',
      model: config.model,
      riskLevel: config.riskLevel,
      maxTradeAmount: config.maxTradeAmount,
      targetAssets: config.targetAssets,
      balance: 10000,
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

    this.bots.set(bot.id, bot);
    return bot;
  }

  getBots(): AIBot[] {
    return Array.from(this.bots.values());
  }

  getBot(botId: string): AIBot | undefined {
    return this.bots.get(botId);
  }

  async startBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (bot) {
      bot.status = 'active';
      bot.updatedAt = new Date().toISOString();
      this.bots.set(botId, bot);
    }
  }

  async pauseBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (bot) {
      bot.status = 'paused';
      bot.updatedAt = new Date().toISOString();
      this.bots.set(botId, bot);
    }
  }

  async stopBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (bot) {
      bot.status = 'stopped';
      bot.updatedAt = new Date().toISOString();
      this.bots.set(botId, bot);
    }
  }

  async startSystem(): Promise<void> {
    this.systemRunning = true;
  }

  async stopSystem(): Promise<void> {
    this.systemRunning = false;
  }

  getSystemStats(): SystemStats {
    const bots = Array.from(this.bots.values());
    const activeBots = bots.filter(bot => bot.status === 'active');
    
    return {
      totalBots: bots.length,
      activeBots: activeBots.length,
      totalReturn: activeBots.reduce((sum, bot) => sum + bot.performance.totalReturn, 0) / (activeBots.length || 1),
      avgWinRate: activeBots.reduce((sum, bot) => sum + bot.performance.winRate, 0) / (activeBots.length || 1),
      totalTrades: activeBots.reduce((sum, bot) => sum + bot.performance.totalTrades, 0)
    };
  }

  getAvailableStrategies(): Array<{id: string, name: string, description: string}> {
    return [
      { id: 'trend-following', name: 'Trend Following', description: 'Follow market trends' },
      { id: 'mean-reversion', name: 'Mean Reversion', description: 'Buy low, sell high' },
      { id: 'scalping', name: 'Scalping', description: 'Quick small profits' },
      { id: 'breakout', name: 'Breakout', description: 'Trade breakouts' },
      { id: 'grid', name: 'Grid Trading', description: 'Grid-based trading' },
      { id: 'arbitrage', name: 'Arbitrage', description: 'Price differences' },
      { id: 'momentum', name: 'Momentum', description: 'Follow momentum' },
      { id: 'pattern-recognition', name: 'Pattern Recognition', description: 'Chart patterns' },
      { id: 'sentiment-based', name: 'Sentiment Based', description: 'News sentiment' },
      { id: 'custom', name: 'Custom', description: 'Custom strategy' }
    ];
  }

  async updateBot(botId: string, updates: Partial<AIBot>): Promise<AIBot | undefined> {
    const bot = this.bots.get(botId);
    if (bot) {
      const updatedBot = { ...bot, ...updates, updatedAt: new Date().toISOString() };
      this.bots.set(botId, updatedBot);
      return updatedBot;
    }
    return undefined;
  }

  async deleteBot(botId: string): Promise<boolean> {
    return this.bots.delete(botId);
  }
}

export const comprehensiveAiBotSystem = new ComprehensiveAiBotSystem();
