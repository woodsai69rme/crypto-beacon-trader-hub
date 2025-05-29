import { openRouterService } from '@/services/openRouterService';
import { n8nAutomationService } from '@/services/automation/n8nAutomationService';
import { Trade, TradingAccount, SupportedCurrency } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

export interface AITradingBot {
  id: string;
  name: string;
  strategy: string;
  aiModel: string;
  isActive: boolean;
  account: TradingAccount;
  performance: {
    totalTrades: number;
    winRate: number;
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  config: {
    riskLevel: 'low' | 'medium' | 'high';
    maxTradeAmount: number;
    targetAssets: string[];
    stopLoss: number;
    takeProfit: number;
    tradingFrequency: 'high' | 'medium' | 'low';
  };
  auditLog: BotAuditEntry[];
  lastAction: string;
  createdAt: string;
  updatedAt: string;
}

export interface BotAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  details: any;
  result: 'success' | 'failed' | 'pending';
  reasoning: string;
  confidence: number;
}

class AITradingBotService {
  private bots: Map<string, AITradingBot> = new Map();
  private isRunning = false;
  private executionInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadBots();
    this.initializeDefaultBots();
  }

  private loadBots() {
    try {
      const stored = localStorage.getItem('ai-trading-bots');
      if (stored) {
        const bots = JSON.parse(stored);
        bots.forEach((bot: AITradingBot) => {
          this.bots.set(bot.id, bot);
        });
      }
    } catch (error) {
      console.error('Failed to load AI trading bots:', error);
    }
  }

  private saveBots() {
    try {
      const bots = Array.from(this.bots.values());
      localStorage.setItem('ai-trading-bots', JSON.stringify(bots));
    } catch (error) {
      console.error('Failed to save AI trading bots:', error);
    }
  }

  private initializeDefaultBots() {
    if (this.bots.size === 0) {
      const defaultBots = [
        {
          id: uuidv4(),
          name: 'Conservative AUD Bot',
          strategy: 'trend-following',
          aiModel: 'deepseek/deepseek-r1',
          isActive: false,
          account: this.createBotAccount('Conservative AUD Bot Account'),
          performance: {
            totalTrades: 0,
            winRate: 0,
            totalReturn: 0,
            sharpeRatio: 0,
            maxDrawdown: 0
          },
          config: {
            riskLevel: 'low' as const,
            maxTradeAmount: 1000,
            targetAssets: ['bitcoin', 'ethereum'],
            stopLoss: 0.05,
            takeProfit: 0.10,
            tradingFrequency: 'low' as const
          },
          auditLog: [],
          lastAction: 'Initialized',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'Aggressive AUD Bot',
          strategy: 'momentum',
          aiModel: 'google/gemini-2.0-flash-exp',
          isActive: false,
          account: this.createBotAccount('Aggressive AUD Bot Account'),
          performance: {
            totalTrades: 0,
            winRate: 0,
            totalReturn: 0,
            sharpeRatio: 0,
            maxDrawdown: 0
          },
          config: {
            riskLevel: 'high' as const,
            maxTradeAmount: 5000,
            targetAssets: ['bitcoin', 'ethereum', 'cardano', 'solana'],
            stopLoss: 0.08,
            takeProfit: 0.20,
            tradingFrequency: 'high' as const
          },
          auditLog: [],
          lastAction: 'Initialized',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      defaultBots.forEach(bot => {
        this.bots.set(bot.id, bot);
      });
      this.saveBots();
    }
  }

  private createBotAccount(name: string): TradingAccount {
    return {
      id: uuidv4(),
      name,
      trades: [],
      balance: 10000, // 10,000 AUD starting balance
      currency: 'AUD' as SupportedCurrency,
      createdAt: new Date().toISOString(),
      type: 'paper',
      assets: []
    };
  }

  async createBot(config: Partial<AITradingBot>): Promise<string> {
    const botId = uuidv4();
    const bot: AITradingBot = {
      id: botId,
      name: config.name || 'Custom AI Bot',
      strategy: config.strategy || 'trend-following',
      aiModel: config.aiModel || 'deepseek/deepseek-r1',
      isActive: false,
      account: this.createBotAccount(config.name + ' Account' || 'Custom Bot Account'),
      performance: {
        totalTrades: 0,
        winRate: 0,
        totalReturn: 0,
        sharpeRatio: 0,
        maxDrawdown: 0
      },
      config: {
        riskLevel: 'medium',
        maxTradeAmount: 2000,
        targetAssets: ['bitcoin', 'ethereum'],
        stopLoss: 0.05,
        takeProfit: 0.15,
        tradingFrequency: 'medium',
        ...config.config
      },
      auditLog: [],
      lastAction: 'Created',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.bots.set(botId, bot);
    this.saveBots();
    this.logBotAction(botId, 'Bot Created', { config }, 'success', 'New AI trading bot initialized', 1.0);

    toast({
      title: "AI Bot Created",
      description: `${bot.name} has been successfully created and is ready to trade`,
    });

    return botId;
  }

  async activateBot(botId: string): Promise<boolean> {
    const bot = this.bots.get(botId);
    if (!bot) return false;

    bot.isActive = true;
    bot.lastAction = 'Activated';
    bot.updatedAt = new Date().toISOString();
    
    this.bots.set(botId, bot);
    this.saveBots();
    this.logBotAction(botId, 'Bot Activated', {}, 'success', 'Bot started active trading', 1.0);

    if (!this.isRunning) {
      this.startBotExecution();
    }

    toast({
      title: "AI Bot Activated",
      description: `${bot.name} is now actively trading`,
    });

    return true;
  }

  async deactivateBot(botId: string): Promise<boolean> {
    const bot = this.bots.get(botId);
    if (!bot) return false;

    bot.isActive = false;
    bot.lastAction = 'Deactivated';
    bot.updatedAt = new Date().toISOString();
    
    this.bots.set(botId, bot);
    this.saveBots();
    this.logBotAction(botId, 'Bot Deactivated', {}, 'success', 'Bot stopped active trading', 1.0);

    toast({
      title: "AI Bot Deactivated",
      description: `${bot.name} has stopped trading`,
    });

    return true;
  }

  private startBotExecution() {
    this.isRunning = true;
    this.executionInterval = setInterval(async () => {
      const activeBots = Array.from(this.bots.values()).filter(bot => bot.isActive);
      
      if (activeBots.length === 0) {
        this.stopBotExecution();
        return;
      }

      for (const bot of activeBots) {
        await this.executeBotStrategy(bot);
      }
    }, 30000); // Execute every 30 seconds
  }

  private stopBotExecution() {
    this.isRunning = false;
    if (this.executionInterval) {
      clearInterval(this.executionInterval);
      this.executionInterval = null;
    }
  }

  private async executeBotStrategy(bot: AITradingBot) {
    try {
      // Get market data for target assets
      const marketData = await this.getMarketData(bot.config.targetAssets);
      
      // Generate AI trading signal
      const signal = await openRouterService.generateTradingSignal(
        marketData,
        bot.strategy,
        bot.aiModel
      );

      this.logBotAction(
        bot.id,
        'AI Analysis Complete',
        { signal, marketData },
        'success',
        signal.reasoning,
        signal.confidence
      );

      // Execute trade if confidence is high enough
      if (signal.confidence > 0.7 && signal.signal !== 'HOLD') {
        await this.executeTrade(bot, signal);
      }

      // Update bot status
      bot.lastAction = `AI Analysis: ${signal.signal} (${(signal.confidence * 100).toFixed(1)}% confidence)`;
      bot.updatedAt = new Date().toISOString();
      this.bots.set(bot.id, bot);
      this.saveBots();

      // Trigger N8N workflow if configured
      await n8nAutomationService.sendTradingSignal({
        symbol: marketData.symbol || 'BTC',
        signal: signal.signal,
        confidence: signal.confidence,
        price: signal.entryPrice || marketData.price || 0,
        timestamp: new Date().toISOString(),
        strategy: bot.strategy,
        reasoning: signal.reasoning
      });

    } catch (error) {
      console.error(`Error executing bot strategy for ${bot.name}:`, error);
      this.logBotAction(
        bot.id,
        'Strategy Execution Failed',
        { error: error.message },
        'failed',
        'Failed to execute trading strategy',
        0
      );
    }
  }

  private async executeTrade(bot: AITradingBot, signal: any) {
    const tradeAmount = Math.min(
      bot.config.maxTradeAmount,
      bot.account.balance * (bot.config.riskLevel === 'low' ? 0.1 : bot.config.riskLevel === 'medium' ? 0.2 : 0.3)
    );

    if (tradeAmount < 10) return; // Minimum trade amount

    const trade: Trade = {
      id: uuidv4(),
      coinId: 'bitcoin', // This would be dynamic based on signal
      coinName: 'Bitcoin',
      coinSymbol: 'BTC',
      type: signal.signal.toLowerCase() as 'buy' | 'sell',
      amount: tradeAmount / (signal.entryPrice || 50000),
      price: signal.entryPrice || 50000,
      totalValue: tradeAmount,
      total: tradeAmount,
      timestamp: new Date().toISOString(),
      currency: 'AUD',
      botGenerated: true,
      strategyId: bot.id
    };

    // Add trade to bot account
    bot.account.trades.push(trade);
    
    // Update account balance
    if (trade.type === 'buy') {
      bot.account.balance -= trade.totalValue;
    } else {
      bot.account.balance += trade.totalValue;
    }

    // Update performance metrics
    bot.performance.totalTrades++;
    this.updateBotPerformance(bot);

    this.logBotAction(
      bot.id,
      `${trade.type.toUpperCase()} Order Executed`,
      trade,
      'success',
      `Executed ${trade.type} order for ${trade.amount.toFixed(6)} ${trade.coinSymbol}`,
      signal.confidence
    );

    toast({
      title: "AI Bot Trade Executed",
      description: `${bot.name} executed ${trade.type} order for ${trade.coinSymbol}`,
    });
  }

  private updateBotPerformance(bot: AITradingBot) {
    const trades = bot.account.trades;
    if (trades.length === 0) return;

    // Calculate win rate (simplified)
    const wins = trades.filter(trade => {
      // This is a simplified calculation - in reality you'd compare entry/exit prices
      return Math.random() > 0.4; // Simulate 60% win rate
    }).length;
    
    bot.performance.winRate = (wins / trades.length) * 100;
    
    // Calculate total return
    const initialBalance = 10000;
    const currentValue = bot.account.balance;
    bot.performance.totalReturn = ((currentValue - initialBalance) / initialBalance) * 100;
    
    // Update other metrics (simplified)
    bot.performance.sharpeRatio = Math.random() * 2; // 0-2 range
    bot.performance.maxDrawdown = Math.random() * 20; // 0-20% range
  }

  private async getMarketData(assets: string[]): Promise<any> {
    // This would normally fetch real market data
    // For now, return mock data
    return {
      symbol: 'BTC',
      price: 45000 + (Math.random() - 0.5) * 2000,
      volume: 1000000000,
      change24h: (Math.random() - 0.5) * 10,
      timestamp: new Date().toISOString()
    };
  }

  private logBotAction(
    botId: string,
    action: string,
    details: any,
    result: 'success' | 'failed' | 'pending',
    reasoning: string,
    confidence: number
  ) {
    const bot = this.bots.get(botId);
    if (!bot) return;

    const auditEntry: BotAuditEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      action,
      details,
      result,
      reasoning,
      confidence
    };

    bot.auditLog.unshift(auditEntry);
    
    // Keep only last 100 entries
    if (bot.auditLog.length > 100) {
      bot.auditLog = bot.auditLog.slice(0, 100);
    }

    this.bots.set(botId, bot);
    this.saveBots();
  }

  getBots(): AITradingBot[] {
    return Array.from(this.bots.values());
  }

  getBot(botId: string): AITradingBot | undefined {
    return this.bots.get(botId);
  }

  getActiveBots(): AITradingBot[] {
    return Array.from(this.bots.values()).filter(bot => bot.isActive);
  }

  getBotAuditLog(botId: string): BotAuditEntry[] {
    const bot = this.bots.get(botId);
    return bot ? bot.auditLog : [];
  }

  updateBotConfig(botId: string, config: Partial<AITradingBot['config']>): boolean {
    const bot = this.bots.get(botId);
    if (!bot) return false;

    bot.config = { ...bot.config, ...config };
    bot.updatedAt = new Date().toISOString();
    this.bots.set(botId, bot);
    this.saveBots();

    this.logBotAction(botId, 'Configuration Updated', config, 'success', 'Bot configuration updated', 1.0);
    return true;
  }

  deleteBotById(botId: string): boolean {
    const bot = this.bots.get(botId);
    if (!bot) return false;

    if (bot.isActive) {
      this.deactivateBot(botId);
    }

    this.bots.delete(botId);
    this.saveBots();

    toast({
      title: "AI Bot Deleted",
      description: `${bot.name} has been permanently deleted`,
    });

    return true;
  }
}

export const aiTradingBotService = new AITradingBotService();
export default aiTradingBotService;
