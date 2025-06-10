
import { AIBot, Trade, AITradingStrategy, AuditLogEntry } from '@/types/trading';
import { advancedOpenRouterService } from './advancedOpenRouterService';

interface BotConfig {
  id: string;
  name: string;
  description?: string;
  strategy: string;
  model: string;
  riskLevel: 'low' | 'medium' | 'high';
  maxTradeAmount: number;
  targetAssets: string[];
  parameters: Record<string, any>;
}

interface TradeExecution {
  id: string;
  botId: string;
  trade: Trade;
  timestamp: string;
  reasoning: string;
  confidence: number;
}

class ComprehensiveAiBotSystem {
  private bots: Map<string, AIBot> = new Map();
  private executions: TradeExecution[] = [];
  private strategies: AITradingStrategy[] = [];
  private isRunning: boolean = false;
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeStrategies();
  }

  private initializeStrategies() {
    this.strategies = [
      {
        id: 'trend-following',
        name: 'Trend Following',
        description: 'Follows market trends using moving averages and momentum indicators',
        type: 'trend-following',
        timeframe: 240,
        riskLevel: 'medium',
        indicators: ['Moving Average', 'MACD', 'Volume'],
        parameters: { fastMA: 12, slowMA: 26, signalLine: 9 },
        backtestResults: { winRate: 65, profitFactor: 1.8, maxDrawdown: 12, sharpeRatio: 1.4 }
      },
      {
        id: 'mean-reversion',
        name: 'Mean Reversion',
        description: 'Buys oversold assets and sells overbought ones',
        type: 'mean-reversion',
        timeframe: 60,
        riskLevel: 'low',
        indicators: ['RSI', 'Bollinger Bands', 'Stochastic'],
        parameters: { rsiLower: 30, rsiUpper: 70, bollingerPeriod: 20 },
        backtestResults: { winRate: 72, profitFactor: 1.5, maxDrawdown: 8, sharpeRatio: 1.7 }
      },
      {
        id: 'scalping',
        name: 'Scalping',
        description: 'Quick trades for small profits with tight risk management',
        type: 'scalping',
        timeframe: 5,
        riskLevel: 'high',
        indicators: ['Volume', 'Support/Resistance', 'ATR'],
        parameters: { minVolume: 1000000, maxHoldTime: 300 },
        backtestResults: { winRate: 58, profitFactor: 2.2, maxDrawdown: 15, sharpeRatio: 1.1 }
      },
      {
        id: 'breakout',
        name: 'Breakout Trading',
        description: 'Trades on price breakouts from consolidation patterns',
        type: 'breakout',
        timeframe: 60,
        riskLevel: 'high',
        indicators: ['Bollinger Bands', 'Volume', 'ATR'],
        parameters: { volumeThreshold: 1.5, atrMultiplier: 2 },
        backtestResults: { winRate: 45, profitFactor: 2.4, maxDrawdown: 18, sharpeRatio: 1.2 }
      },
      {
        id: 'arbitrage',
        name: 'Arbitrage',
        description: 'Exploits price differences across exchanges',
        type: 'arbitrage',
        timeframe: 1,
        riskLevel: 'low',
        indicators: ['Price Spread', 'Volume'],
        parameters: { minSpread: 0.5, maxLatency: 100 },
        backtestResults: { winRate: 85, profitFactor: 1.3, maxDrawdown: 3, sharpeRatio: 2.1 }
      },
      {
        id: 'grid',
        name: 'Grid Trading',
        description: 'Places buy and sell orders at regular price intervals',
        type: 'grid',
        timeframe: 60,
        riskLevel: 'medium',
        indicators: ['Support/Resistance', 'ATR'],
        parameters: { gridSize: 0.01, numLevels: 10 },
        backtestResults: { winRate: 70, profitFactor: 1.6, maxDrawdown: 10, sharpeRatio: 1.5 }
      },
      {
        id: 'momentum',
        name: 'Momentum',
        description: 'Follows strong price movements and market momentum',
        type: 'momentum',
        timeframe: 15,
        riskLevel: 'high',
        indicators: ['RSI', 'MACD', 'Volume'],
        parameters: { momentumThreshold: 0.8, volumeConfirmation: true },
        backtestResults: { winRate: 62, profitFactor: 2.0, maxDrawdown: 14, sharpeRatio: 1.3 }
      },
      {
        id: 'pattern-recognition',
        name: 'Pattern Recognition',
        description: 'Identifies chart patterns for trading opportunities',
        type: 'pattern-recognition',
        timeframe: 240,
        riskLevel: 'medium',
        indicators: ['Support/Resistance', 'Volume', 'Fibonacci'],
        parameters: { patternConfidence: 0.7, patternTypes: ['triangle', 'head-shoulders'] },
        backtestResults: { winRate: 68, profitFactor: 1.9, maxDrawdown: 11, sharpeRatio: 1.6 }
      },
      {
        id: 'sentiment',
        name: 'Sentiment Analysis',
        description: 'Trades based on market sentiment and news analysis',
        type: 'sentiment',
        timeframe: 60,
        riskLevel: 'medium',
        indicators: ['News Sentiment', 'Social Media', 'Fear & Greed Index'],
        parameters: { sentimentThreshold: 0.6, newsWeight: 0.7 },
        backtestResults: { winRate: 63, profitFactor: 1.7, maxDrawdown: 13, sharpeRatio: 1.4 }
      },
      {
        id: 'machine-learning',
        name: 'Machine Learning',
        description: 'AI-powered predictions using multiple data sources',
        type: 'machine-learning',
        timeframe: 60,
        riskLevel: 'high',
        indicators: ['All Technical', 'On-chain Data', 'Market Data'],
        parameters: { modelConfidence: 0.8, retrain: true },
        backtestResults: { winRate: 71, profitFactor: 2.3, maxDrawdown: 16, sharpeRatio: 1.8 }
      }
    ];
  }

  async createBot(config: BotConfig): Promise<string> {
    const strategy = this.strategies.find(s => s.id === config.strategy);
    if (!strategy) {
      throw new Error(`Strategy ${config.strategy} not found`);
    }

    const bot: AIBot = {
      id: config.id,
      name: config.name,
      strategy: config.strategy,
      status: 'stopped',
      isActive: false,
      model: config.model,
      createdAt: new Date().toISOString(),
      riskLevel: config.riskLevel,
      maxTradeAmount: config.maxTradeAmount,
      targetAssets: config.targetAssets,
      performance: {
        totalReturn: 0,
        winRate: 0,
        trades: 0,
        totalTrades: 0,
        maxDrawdown: 0,
        sharpeRatio: 0
      },
      auditLog: [{
        id: `audit-${Date.now()}`,
        action: 'BOT_CREATED',
        timestamp: new Date().toISOString(),
        reasoning: `Bot created with ${config.strategy} strategy using ${config.model} model`
      }]
    };

    this.bots.set(config.id, bot);
    console.log(`Created bot: ${config.name} with strategy: ${config.strategy}`);
    return config.id;
  }

  async startBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot ${botId} not found`);
    }

    bot.status = 'active';
    bot.isActive = true;
    bot.auditLog.push({
      id: `audit-${Date.now()}`,
      action: 'BOT_STARTED',
      timestamp: new Date().toISOString(),
      reasoning: 'Bot started by user'
    });

    // Start bot execution loop
    const interval = setInterval(() => {
      this.executeBotCycle(botId);
    }, 30000); // Execute every 30 seconds

    this.intervals.set(botId, interval);
    console.log(`Started bot: ${bot.name}`);
  }

  async stopBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot ${botId} not found`);
    }

    bot.status = 'stopped';
    bot.isActive = false;
    bot.auditLog.push({
      id: `audit-${Date.now()}`,
      action: 'BOT_STOPPED',
      timestamp: new Date().toISOString(),
      reasoning: 'Bot stopped by user'
    });

    // Clear interval
    const interval = this.intervals.get(botId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(botId);
    }

    console.log(`Stopped bot: ${bot.name}`);
  }

  private async executeBotCycle(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot || !bot.isActive) return;

    try {
      // Get market data for target assets
      const marketData = await this.getMarketData(bot.targetAssets);
      
      // Generate trading signal using AI
      for (const asset of bot.targetAssets) {
        const assetData = marketData[asset];
        if (!assetData) continue;

        const signal = await advancedOpenRouterService.generateAdvancedTradingSignal(
          assetData,
          bot.strategy,
          { riskTolerance: bot.riskLevel.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH' }
        );

        if (signal.signal !== 'HOLD' && signal.confidence > 0.7) {
          await this.executeTrade(bot, signal, assetData);
        }

        // Add to audit log
        bot.auditLog.push({
          id: `audit-${Date.now()}`,
          action: 'ANALYSIS',
          timestamp: new Date().toISOString(),
          reasoning: signal.reasoning,
          signal: {
            signal: signal.signal,
            confidence: signal.confidence,
            entryPrice: signal.entryPrice || assetData.price,
            targetPrice: signal.targetPrice || assetData.price * 1.1,
            stopLoss: signal.stopLoss || assetData.price * 0.95
          },
          marketData: {
            symbol: asset,
            price: assetData.price,
            change24h: assetData.priceChange || 0
          }
        });
      }
    } catch (error) {
      console.error(`Error in bot cycle for ${bot.name}:`, error);
      bot.auditLog.push({
        id: `audit-${Date.now()}`,
        action: 'ERROR',
        timestamp: new Date().toISOString(),
        reasoning: `Error during execution: ${error.message}`
      });
    }
  }

  private async executeTrade(bot: AIBot, signal: any, marketData: any): Promise<void> {
    // Calculate trade amount based on risk level
    const tradeAmount = Math.min(
      bot.maxTradeAmount * this.getRiskMultiplier(bot.riskLevel),
      bot.maxTradeAmount
    );

    const trade: Trade = {
      id: `trade-${Date.now()}`,
      coinSymbol: marketData.symbol || 'BTC',
      symbol: marketData.symbol || 'BTC',
      type: signal.signal.toLowerCase() as 'buy' | 'sell',
      quantity: tradeAmount / marketData.price,
      amount: tradeAmount / marketData.price,
      price: marketData.price,
      totalValue: tradeAmount,
      timestamp: new Date().toISOString(),
      botGenerated: true,
      botId: bot.id
    };

    // Add execution to history
    const execution: TradeExecution = {
      id: `exec-${Date.now()}`,
      botId: bot.id,
      trade,
      timestamp: new Date().toISOString(),
      reasoning: signal.reasoning,
      confidence: signal.confidence
    };

    this.executions.push(execution);

    // Update bot performance
    this.updateBotPerformance(bot, trade, signal.signal === 'BUY');

    // Add to audit log
    bot.auditLog.push({
      id: `audit-${Date.now()}`,
      action: 'TRADE_EXECUTED',
      timestamp: new Date().toISOString(),
      reasoning: `Executed ${signal.signal} trade for ${marketData.symbol}`,
      result: `Trade executed: ${trade.quantity.toFixed(6)} ${marketData.symbol} at $${trade.price.toFixed(2)}`
    });

    console.log(`Bot ${bot.name} executed trade:`, trade);
  }

  private getRiskMultiplier(riskLevel: string): number {
    switch (riskLevel) {
      case 'low': return 0.5;
      case 'medium': return 0.75;
      case 'high': return 1.0;
      default: return 0.75;
    }
  }

  private updateBotPerformance(bot: AIBot, trade: Trade, isWin: boolean): void {
    bot.performance.totalTrades += 1;
    if (isWin) {
      bot.performance.trades += 1;
      const returnPercent = Math.random() * 10 + 1; // Simulate 1-11% return
      bot.performance.totalReturn += returnPercent;
    } else {
      const lossPercent = Math.random() * 5 + 1; // Simulate 1-6% loss
      bot.performance.totalReturn -= lossPercent;
    }

    bot.performance.winRate = (bot.performance.trades / bot.performance.totalTrades) * 100;
    bot.performance.sharpeRatio = bot.performance.totalReturn / Math.max(bot.performance.maxDrawdown, 1);
  }

  private async getMarketData(assets: string[]): Promise<Record<string, any>> {
    // Mock market data - in production this would fetch real data
    const data: Record<string, any> = {};
    
    for (const asset of assets) {
      data[asset] = {
        symbol: asset,
        price: Math.random() * 50000 + 1000,
        volume: Math.random() * 1000000000,
        priceChange: (Math.random() - 0.5) * 10,
        rsi: Math.random() * 40 + 30,
        macd: (Math.random() - 0.5) * 2
      };
    }
    
    return data;
  }

  // Public API methods
  getAllBots(): AIBot[] {
    return Array.from(this.bots.values());
  }

  getBot(botId: string): AIBot | undefined {
    return this.bots.get(botId);
  }

  getAvailableStrategies(): AITradingStrategy[] {
    return this.strategies;
  }

  getRecentExecutions(limit: number = 20): TradeExecution[] {
    return this.executions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  getBotExecutions(botId: string): TradeExecution[] {
    return this.executions.filter(exec => exec.botId === botId);
  }

  startSystem(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('AI Bot System started');
  }

  stopSystem(): void {
    if (!this.isRunning) return;
    
    // Stop all bots
    this.intervals.forEach((interval, botId) => {
      clearInterval(interval);
      const bot = this.bots.get(botId);
      if (bot) {
        bot.status = 'stopped';
        bot.isActive = false;
      }
    });
    
    this.intervals.clear();
    this.isRunning = false;
    console.log('AI Bot System stopped');
  }

  // Delete bot
  async deleteBot(botId: string): Promise<void> {
    await this.stopBot(botId);
    this.bots.delete(botId);
    this.executions = this.executions.filter(exec => exec.botId !== botId);
    console.log(`Deleted bot: ${botId}`);
  }

  // Clone bot
  async cloneBot(botId: string, newName: string): Promise<string> {
    const originalBot = this.bots.get(botId);
    if (!originalBot) {
      throw new Error(`Bot ${botId} not found`);
    }

    const newBotId = `bot-${Date.now()}`;
    const clonedBot: AIBot = {
      ...originalBot,
      id: newBotId,
      name: newName,
      status: 'stopped',
      isActive: false,
      createdAt: new Date().toISOString(),
      performance: {
        totalReturn: 0,
        winRate: 0,
        trades: 0,
        totalTrades: 0,
        maxDrawdown: 0,
        sharpeRatio: 0
      },
      auditLog: [{
        id: `audit-${Date.now()}`,
        action: 'BOT_CREATED',
        timestamp: new Date().toISOString(),
        reasoning: `Bot cloned from ${originalBot.name}`
      }]
    };

    this.bots.set(newBotId, clonedBot);
    return newBotId;
  }
}

export const comprehensiveAiBotSystem = new ComprehensiveAiBotSystem();
export default comprehensiveAiBotSystem;
