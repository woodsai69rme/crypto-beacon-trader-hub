
import { AIBot, BotConfig, AITradingStrategyType } from '@/types/trading';
import { enhancedAiBotService } from './enhancedAiBotService';
import { openRouterIntegrationService } from '../openrouter/openrouterIntegrationService';
import { contextService } from '../context/contextService';

export interface BotInstance {
  config: BotConfig;
  status: 'idle' | 'active' | 'paused' | 'error' | 'stopped';
  lastAnalysis?: string;
  performance: {
    totalReturn: number;
    winRate: number;
    trades: number;
    totalTrades: number;
    maxDrawdown: number;
    sharpeRatio: number;
    lastTradeAt?: string;
  };
  executionLog: string[];
}

class ComprehensiveAiBotSystem {
  private botInstances: Map<string, BotInstance> = new Map();
  private isSystemRunning: boolean = false;
  private analysisInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeSystem();
  }

  private initializeSystem(): void {
    console.log('🤖 Comprehensive AI Bot System initialized');
    
    // Create default bot instances from enhanced service
    const defaultBots = enhancedAiBotService.getAllBots();
    defaultBots.forEach(bot => {
      const instance: BotInstance = {
        config: {
          id: bot.id,
          name: bot.name,
          description: bot.description,
          strategy: bot.strategy,
          model: bot.model,
          riskLevel: bot.riskLevel,
          maxTradeAmount: bot.maxTradeAmount,
          targetAssets: bot.targetAssets,
          parameters: {}
        },
        status: bot.status === 'active' ? 'active' : 'paused',
        performance: {
          ...bot.performance,
          totalTrades: bot.performance.trades
        },
        executionLog: [`Bot ${bot.name} initialized at ${new Date().toISOString()}`]
      };
      this.botInstances.set(bot.id, instance);
    });
  }

  getAvailableStrategies(): AITradingStrategyType[] {
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
      'ai-predictive',
      'traditional',
      'whale-tracking',
      'portfolio-balancing'
    ];
  }

  async createBot(config: BotConfig): Promise<BotInstance> {
    const instance: BotInstance = {
      config,
      status: 'idle',
      performance: {
        totalReturn: 0,
        winRate: 0,
        trades: 0,
        totalTrades: 0,
        maxDrawdown: 0,
        sharpeRatio: 0
      },
      executionLog: [`Bot ${config.name} created at ${new Date().toISOString()}`]
    };

    this.botInstances.set(config.id, instance);
    
    // Store bot creation in context
    await contextService.storeUserAction('bot_created', {
      botId: config.id,
      name: config.name,
      strategy: config.strategy
    });

    console.log(`✅ Created bot: ${config.name}`);
    return instance;
  }

  async startBot(botId: string): Promise<boolean> {
    const instance = this.botInstances.get(botId);
    if (!instance) {
      console.error(`❌ Bot ${botId} not found`);
      return false;
    }

    instance.status = 'active';
    instance.executionLog.push(`Bot started at ${new Date().toISOString()}`);
    
    // Store bot start in context
    await contextService.storeUserAction('bot_started', {
      botId,
      name: instance.config.name
    });

    console.log(`▶️ Started bot: ${instance.config.name}`);
    return true;
  }

  async stopBot(botId: string): Promise<boolean> {
    const instance = this.botInstances.get(botId);
    if (!instance) {
      console.error(`❌ Bot ${botId} not found`);
      return false;
    }

    instance.status = 'stopped';
    instance.executionLog.push(`Bot stopped at ${new Date().toISOString()}`);
    
    // Store bot stop in context
    await contextService.storeUserAction('bot_stopped', {
      botId,
      name: instance.config.name
    });

    console.log(`⏹️ Stopped bot: ${instance.config.name}`);
    return true;
  }

  async pauseBot(botId: string): Promise<boolean> {
    const instance = this.botInstances.get(botId);
    if (!instance) return false;

    instance.status = 'paused';
    instance.executionLog.push(`Bot paused at ${new Date().toISOString()}`);

    console.log(`⏸️ Paused bot: ${instance.config.name}`);
    return true;
  }

  async deleteBot(botId: string): Promise<boolean> {
    const instance = this.botInstances.get(botId);
    if (!instance) return false;

    // Stop bot first if running
    if (instance.status === 'active') {
      await this.stopBot(botId);
    }

    this.botInstances.delete(botId);
    
    // Store bot deletion in context
    await contextService.storeUserAction('bot_deleted', {
      botId,
      name: instance.config.name
    });

    console.log(`🗑️ Deleted bot: ${instance.config.name}`);
    return true;
  }

  getBots(): BotInstance[] {
    return Array.from(this.botInstances.values());
  }

  getBot(botId: string): BotInstance | null {
    return this.botInstances.get(botId) || null;
  }

  getActiveBots(): BotInstance[] {
    return this.getBots().filter(bot => bot.status === 'active');
  }

  async runAnalysis(botId: string): Promise<void> {
    const instance = this.botInstances.get(botId);
    if (!instance || instance.status !== 'active') return;

    try {
      // Generate mock market data for analysis
      const mockMarketData = {
        symbol: instance.config.targetAssets[0] || 'BTC',
        price: Math.random() * 50000 + 10000,
        change24h: (Math.random() - 0.5) * 20,
        volume: Math.random() * 1000000000,
        marketCap: Math.random() * 100000000000,
        high24h: Math.random() * 55000 + 10000,
        low24h: Math.random() * 45000 + 10000,
      };

      // Run AI analysis using OpenRouter
      const analysis = await openRouterIntegrationService.generateTradingAnalysis({
        symbol: mockMarketData.symbol,
        marketData: mockMarketData,
        strategy: instance.config.strategy,
        timeframe: '15m',
        riskTolerance: instance.config.riskLevel
      });

      instance.lastAnalysis = analysis.reasoning;
      instance.executionLog.push(`Analysis completed: ${analysis.signal} signal with ${analysis.confidence}% confidence`);

      // Store analysis in context
      await contextService.storeTradingSignal({
        symbol: mockMarketData.symbol,
        signal: analysis.signal,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning
      }, `bot-${botId}`);

      // Simulate trade execution based on analysis
      if (analysis.confidence > 70) {
        await this.simulateTradeExecution(instance, analysis);
      }

    } catch (error) {
      console.error(`❌ Analysis error for bot ${instance.config.name}:`, error);
      instance.status = 'error';
      instance.executionLog.push(`Analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async simulateTradeExecution(instance: BotInstance, analysis: any): Promise<void> {
    // Simulate trade execution
    const tradeAmount = Math.min(instance.config.maxTradeAmount, 1000);
    const isWin = Math.random() > 0.35; // 65% win rate simulation
    const returnPercent = isWin ? Math.random() * 5 + 1 : -(Math.random() * 3 + 0.5);

    // Update performance metrics
    instance.performance.trades++;
    instance.performance.totalTrades++;
    instance.performance.totalReturn += returnPercent;
    instance.performance.winRate = ((instance.performance.winRate * (instance.performance.trades - 1)) + (isWin ? 100 : 0)) / instance.performance.trades;
    instance.performance.lastTradeAt = new Date().toISOString();

    // Update max drawdown if necessary
    if (returnPercent < 0 && Math.abs(returnPercent) > instance.performance.maxDrawdown) {
      instance.performance.maxDrawdown = Math.abs(returnPercent);
    }

    // Calculate simple Sharpe ratio approximation
    instance.performance.sharpeRatio = instance.performance.totalReturn / Math.max(instance.performance.maxDrawdown, 1);

    instance.executionLog.push(`Trade executed: ${analysis.signal} ${tradeAmount} ${analysis.symbol || 'BTC'} - ${isWin ? 'WIN' : 'LOSS'} (${returnPercent.toFixed(2)}%)`);

    console.log(`💰 Bot ${instance.config.name} executed trade: ${analysis.signal} - ${isWin ? 'WIN' : 'LOSS'} (${returnPercent.toFixed(2)}%)`);
  }

  async startSystem(): Promise<void> {
    if (this.isSystemRunning) return;

    this.isSystemRunning = true;
    console.log('🚀 Starting comprehensive AI bot system');

    // Start analysis interval for all active bots
    this.analysisInterval = setInterval(async () => {
      const activeBots = this.getActiveBots();
      
      for (const bot of activeBots) {
        await this.runAnalysis(bot.config.id);
        
        // Small delay between bot analyses
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }, 30000); // Run analysis every 30 seconds

    // Store system start in context
    await contextService.storeSystemEvent('system_started', {
      activeBots: this.getActiveBots().length,
      totalBots: this.getBots().length
    });
  }

  async stopSystem(): Promise<void> {
    if (!this.isSystemRunning) return;

    this.isSystemRunning = false;
    
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }

    // Stop all active bots
    const activeBots = this.getActiveBots();
    for (const bot of activeBots) {
      await this.stopBot(bot.config.id);
    }

    // Store system stop in context
    await contextService.storeSystemEvent('system_stopped', {
      stoppedBots: activeBots.length
    });

    console.log('⏹️ Stopped comprehensive AI bot system');
  }

  getSystemStats() {
    const bots = this.getBots();
    const activeBots = this.getActiveBots();
    
    const totalTrades = bots.reduce((sum, bot) => sum + bot.performance.trades, 0);
    const avgReturn = bots.reduce((sum, bot) => sum + bot.performance.totalReturn, 0) / bots.length;
    const avgWinRate = bots.reduce((sum, bot) => sum + bot.performance.winRate, 0) / bots.length;

    return {
      totalBots: bots.length,
      activeBots: activeBots.length,
      pausedBots: bots.filter(bot => bot.status === 'paused').length,
      errorBots: bots.filter(bot => bot.status === 'error').length,
      totalTrades,
      avgReturn: avgReturn || 0,
      avgWinRate: avgWinRate || 0,
      systemRunning: this.isSystemRunning
    };
  }

  async generateBotRecommendations(): Promise<string[]> {
    const stats = this.getSystemStats();
    const recommendations: string[] = [];

    if (stats.activeBots === 0) {
      recommendations.push("Consider starting some bots to begin automated trading");
    }

    if (stats.avgWinRate < 60) {
      recommendations.push("Review bot strategies - win rate could be improved");
    }

    if (stats.totalTrades < 10) {
      recommendations.push("Allow more time for bots to accumulate trading data");
    }

    if (stats.errorBots > 0) {
      recommendations.push(`${stats.errorBots} bot(s) have errors - check logs and restart`);
    }

    return recommendations;
  }
}

export const comprehensiveAiBotSystem = new ComprehensiveAiBotSystem();
export default comprehensiveAiBotSystem;
