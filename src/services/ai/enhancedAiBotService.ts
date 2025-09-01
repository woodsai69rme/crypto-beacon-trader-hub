
import { AIBot, BotConfig, AITradingStrategyConfig } from '@/types/trading';

class EnhancedAiBotService {
  private bots: AIBot[] = [];

  async getAllBots(): Promise<AIBot[]> {
    return this.bots;
  }

  async createBot(config: BotConfig): Promise<AIBot> {
    const bot: AIBot = {
      id: `bot-${Date.now()}`,
      name: config.name || `AI Bot ${this.bots.length + 1}`,
      description: config.description || 'AI Trading Bot',
      strategy: {
        id: config.strategy,
        name: config.strategy,
        description: 'AI Trading Strategy',
        type: config.strategy,
        timeframe: '1h',
        parameters: config.parameters || {}
      } as AITradingStrategyConfig,
      status: 'stopped',
      balance: 10000,
      model: config.model || 'deepseek-r1',
      riskLevel: config.riskLevel,
      maxTradeAmount: config.maxTradeAmount,
      targetAssets: config.targetAssets,
      performance: {
        totalReturn: 0,
        winRate: 0,
        totalTrades: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditLog: [],
      config
    };

    this.bots.push(bot);
    return bot;
  }

  async startBot(botId: string): Promise<void> {
    const bot = this.bots.find(b => b.id === botId);
    if (bot) {
      bot.status = 'active';
      bot.updatedAt = new Date().toISOString();
    }
  }

  async pauseBot(botId: string): Promise<void> {
    const bot = this.bots.find(b => b.id === botId);
    if (bot) {
      bot.status = 'paused';
      bot.updatedAt = new Date().toISOString();
    }
  }

  async stopBot(botId: string): Promise<void> {
    const bot = this.bots.find(b => b.id === botId);
    if (bot) {
      bot.status = 'stopped';
      bot.updatedAt = new Date().toISOString();
    }
  }

  async deleteBot(botId: string): Promise<void> {
    this.bots = this.bots.filter(b => b.id !== botId);
  }
}

export const enhancedAiBotService = new EnhancedAiBotService();
