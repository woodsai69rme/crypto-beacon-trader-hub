import openRouterService from '../openRouterService';
import realTradingEngine from '../trading/realTradingEngine';
import n8nAutomationService from '../automation/n8nAutomationService';
import freeApiIntegrationService from '../api/freeApiIntegrationService';
import { toast } from "@/hooks/use-toast";

interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'trend_following' | 'mean_reversion' | 'breakout' | 'arbitrage' | 'sentiment' | 'ml_prediction' | 'custom';
  parameters: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
  targetAssets: string[];
}

interface AITradingBot {
  id: string;
  name: string;
  strategy: TradingStrategy;
  aiModel: string;
  accountId: string;
  isActive: boolean;
  isSimulation: boolean;
  configuration: {
    maxPositionSize: number;
    stopLossPercent: number;
    takeProfitPercent: number;
    maxDailyTrades: number;
    riskPerTrade: number;
    trailingStopPercent?: number;
  };
  performance: {
    totalTrades: number;
    winRate: number;
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    avgHoldingTime: number;
    profitFactor: number;
  };
  currentPositions: Array<{
    symbol: string;
    side: 'long' | 'short';
    size: number;
    entryPrice: number;
    currentPrice: number;
    unrealizedPnl: number;
    entryTime: string;
  }>;
  tradeHistory: Array<{
    id: string;
    symbol: string;
    side: 'buy' | 'sell';
    amount: number;
    price: number;
    timestamp: string;
    pnl: number;
    confidence: number;
    reasoning: string;
  }>;
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
    acknowledged: boolean;
  }>;
  lastUpdate: string;
}

interface MarketSignal {
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  strength: number; // 0-1
  confidence: number; // 0-1
  timeframe: string;
  indicators: Record<string, number>;
  sentiment: number; // -1 to 1
  reasoning: string;
}

class AdvancedAiTradingBot {
  private bots: Map<string, AITradingBot> = new Map();
  private strategies: Map<string, TradingStrategy> = new Map();
  private marketData: Map<string, any> = new Map();
  private lastPriceUpdate = 0;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeStrategies();
    this.loadStoredBots();
    this.startMarketDataUpdates();
  }

  private initializeStrategies() {
    const strategies: TradingStrategy[] = [
      {
        id: 'trend_following_ma',
        name: 'Moving Average Trend Following',
        description: 'Follows trends using multiple moving averages with AI confirmation',
        type: 'trend_following',
        parameters: {
          shortMAPeriod: 20,
          longMAPeriod: 50,
          signalMAPeriod: 9,
          trendConfirmationThreshold: 0.02,
          aiConfidenceThreshold: 0.7
        },
        riskLevel: 'medium',
        timeframe: '1h',
        targetAssets: ['BTC', 'ETH', 'ADA', 'SOL']
      },
      {
        id: 'mean_reversion_rsi',
        name: 'RSI Mean Reversion',
        description: 'Trades oversold/overbought conditions with AI sentiment analysis',
        type: 'mean_reversion',
        parameters: {
          rsiPeriod: 14,
          oversoldThreshold: 30,
          overboughtThreshold: 70,
          sentimentFilter: true,
          aiValidationRequired: true
        },
        riskLevel: 'medium',
        timeframe: '15m',
        targetAssets: ['BTC', 'ETH', 'ADA', 'DOT', 'LINK']
      },
      {
        id: 'breakout_bollinger',
        name: 'Bollinger Bands Breakout',
        description: 'Trades breakouts from Bollinger Bands with volume confirmation',
        type: 'breakout',
        parameters: {
          bbPeriod: 20,
          bbStdDev: 2,
          volumeThreshold: 1.5,
          breakoutConfirmationBars: 2,
          aiConfirmationRequired: true
        },
        riskLevel: 'high',
        timeframe: '1h',
        targetAssets: ['BTC', 'ETH', 'SOL', 'ADA']
      },
      {
        id: 'sentiment_news_trader',
        name: 'AI Sentiment News Trader',
        description: 'Trades based on news sentiment and social media analysis',
        type: 'sentiment',
        parameters: {
          sentimentThreshold: 0.75,
          newsImpactWeight: 0.6,
          socialMediaWeight: 0.4,
          timeDecayHours: 24,
          minNewsRelevance: 0.8
        },
        riskLevel: 'high',
        timeframe: '5m',
        targetAssets: ['BTC', 'ETH', 'ADA', 'SOL', 'DOT']
      },
      {
        id: 'ml_prediction_ensemble',
        name: 'Multi-Model ML Prediction',
        description: 'Uses ensemble of AI models for price prediction and trading',
        type: 'ml_prediction',
        parameters: {
          models: ['deepseek/deepseek-r1', 'google/gemini-2.0-flash-exp', 'meta-llama/llama-3.3-70b-instruct'],
          ensembleMethod: 'weighted_average',
          predictionHorizon: '1h',
          confidenceThreshold: 0.8,
          retrainInterval: 24 // hours
        },
        riskLevel: 'medium',
        timeframe: '30m',
        targetAssets: ['BTC', 'ETH']
      },
      {
        id: 'arbitrage_cross_exchange',
        name: 'Cross-Exchange Arbitrage',
        description: 'Identifies and exploits price differences across exchanges',
        type: 'arbitrage',
        parameters: {
          minProfitThreshold: 0.5, // percent
          maxExecutionTime: 30, // seconds
          slippageTolerance: 0.1,
          exchangePairs: [
            ['binance', 'coinbase'],
            ['kraken', 'kucoin']
          ]
        },
        riskLevel: 'low',
        timeframe: '1m',
        targetAssets: ['BTC', 'ETH', 'ADA']
      }
    ];

    strategies.forEach(strategy => {
      this.strategies.set(strategy.id, strategy);
    });
  }

  private loadStoredBots() {
    try {
      const stored = localStorage.getItem('ai-trading-bots');
      if (stored) {
        const bots = JSON.parse(stored);
        bots.forEach((bot: AITradingBot) => {
          this.bots.set(bot.id, bot);
        });
      }
    } catch (error) {
      console.error('Failed to load stored bots:', error);
    }
  }

  private saveBots() {
    try {
      const bots = Array.from(this.bots.values());
      localStorage.setItem('ai-trading-bots', JSON.stringify(bots));
    } catch (error) {
      console.error('Failed to save bots:', error);
    }
  }

  private startMarketDataUpdates() {
    this.updateInterval = setInterval(() => {
      this.updateMarketData();
      this.processBots();
    }, 30000); // Update every 30 seconds
  }

  private async updateMarketData() {
    try {
      const marketData = await freeApiIntegrationService.getComprehensiveMarketData(100);
      const globalMetrics = await freeApiIntegrationService.getGlobalMarketMetrics();
      const news = await freeApiIntegrationService.getCryptoNews(20);

      this.marketData.set('coins', marketData);
      this.marketData.set('global', globalMetrics);
      this.marketData.set('news', news);
      this.lastPriceUpdate = Date.now();

    } catch (error) {
      console.error('Failed to update market data:', error);
    }
  }

  async createBot(config: {
    name: string;
    strategyId: string;
    aiModel: string;
    accountId: string;
    isSimulation: boolean;
    configuration: AITradingBot['configuration'];
  }): Promise<string> {
    const strategy = this.strategies.get(config.strategyId);
    if (!strategy) {
      throw new Error('Strategy not found');
    }

    const botId = `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const bot: AITradingBot = {
      id: botId,
      name: config.name,
      strategy,
      aiModel: config.aiModel,
      accountId: config.accountId,
      isActive: false,
      isSimulation: config.isSimulation,
      configuration: config.configuration,
      performance: {
        totalTrades: 0,
        winRate: 0,
        totalReturn: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        avgHoldingTime: 0,
        profitFactor: 0
      },
      currentPositions: [],
      tradeHistory: [],
      alerts: [],
      lastUpdate: new Date().toISOString()
    };

    this.bots.set(botId, bot);
    this.saveBots();

    toast({
      title: "AI Trading Bot Created",
      description: `${config.name} has been created successfully`,
    });

    return botId;
  }

  async startBot(botId: string): Promise<boolean> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error('Bot not found');
    }

    // Validate account
    if (!bot.isSimulation) {
      const account = realTradingEngine.getAccount(bot.accountId);
      if (!account || !account.isActive) {
        throw new Error('Trading account not active');
      }
    }

    bot.isActive = true;
    bot.lastUpdate = new Date().toISOString();
    this.bots.set(botId, bot);
    this.saveBots();

    // Add activation alert
    this.addAlert(botId, 'info', `Bot ${bot.name} has been activated`);

    toast({
      title: "Bot Started",
      description: `${bot.name} is now active`,
    });

    return true;
  }

  async stopBot(botId: string): Promise<boolean> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error('Bot not found');
    }

    bot.isActive = false;
    bot.lastUpdate = new Date().toISOString();
    this.bots.set(botId, bot);
    this.saveBots();

    // Add deactivation alert
    this.addAlert(botId, 'info', `Bot ${bot.name} has been deactivated`);

    toast({
      title: "Bot Stopped",
      description: `${bot.name} has been deactivated`,
    });

    return true;
  }

  private async processBots() {
    const activeBots = Array.from(this.bots.values()).filter(bot => bot.isActive);
    
    for (const bot of activeBots) {
      try {
        await this.processBot(bot);
      } catch (error) {
        console.error(`Error processing bot ${bot.id}:`, error);
        this.addAlert(bot.id, 'error', `Processing error: ${error.message}`);
      }
    }
  }

  private async processBot(bot: AITradingBot): Promise<void> {
    // Get market signals for target assets
    const signals: MarketSignal[] = [];
    
    for (const asset of bot.strategy.targetAssets) {
      const signal = await this.generateMarketSignal(asset, bot);
      if (signal) {
        signals.push(signal);
      }
    }

    // Process signals and make trading decisions
    for (const signal of signals) {
      if (signal.signal !== 'HOLD' && signal.confidence >= (bot.strategy.parameters.aiConfidenceThreshold || 0.7)) {
        await this.processSignal(bot, signal);
      }
    }

    // Update bot performance and positions
    await this.updateBotPerformance(bot);
    
    // Check for risk management actions
    await this.checkRiskManagement(bot);

    bot.lastUpdate = new Date().toISOString();
    this.bots.set(bot.id, bot);
    this.saveBots();
  }

  private async generateMarketSignal(asset: string, bot: AITradingBot): Promise<MarketSignal | null> {
    try {
      const coinData = this.marketData.get('coins')?.find((coin: any) => coin.symbol === asset);
      if (!coinData) return null;

      const globalData = this.marketData.get('global');
      const newsData = this.marketData.get('news');

      // Get technical indicators based on strategy
      const indicators = await this.calculateTechnicalIndicators(asset, bot.strategy);
      
      // Get sentiment analysis
      const sentiment = await this.analyzeSentiment(asset, newsData);

      // Generate AI signal using OpenRouter
      const aiSignal = await openRouterService.generateTradingSignal(
        {
          asset,
          price: coinData.price,
          indicators,
          sentiment,
          globalMetrics: globalData,
          strategy: bot.strategy,
          timeframe: bot.strategy.timeframe
        },
        bot.strategy.type,
        bot.aiModel
      );

      return {
        symbol: asset,
        signal: aiSignal.signal,
        strength: Math.min(Math.abs(indicators.momentum || 0), 1),
        confidence: aiSignal.confidence,
        timeframe: bot.strategy.timeframe,
        indicators,
        sentiment: sentiment.score,
        reasoning: aiSignal.reasoning
      };

    } catch (error) {
      console.error(`Error generating signal for ${asset}:`, error);
      return null;
    }
  }

  private async calculateTechnicalIndicators(asset: string, strategy: TradingStrategy): Promise<Record<string, number>> {
    // Mock technical indicator calculations
    // In production, this would use real price history and technical analysis libraries
    const indicators: Record<string, number> = {};

    switch (strategy.type) {
      case 'trend_following':
        indicators.sma20 = Math.random() * 100;
        indicators.sma50 = Math.random() * 100;
        indicators.macd = (Math.random() - 0.5) * 10;
        indicators.signal = (Math.random() - 0.5) * 10;
        indicators.momentum = Math.random() - 0.5;
        break;

      case 'mean_reversion':
        indicators.rsi = Math.random() * 100;
        indicators.stochastic = Math.random() * 100;
        indicators.williams_r = -(Math.random() * 100);
        indicators.momentum = Math.random() - 0.5;
        break;

      case 'breakout':
        indicators.bb_upper = Math.random() * 100;
        indicators.bb_lower = Math.random() * 100;
        indicators.bb_width = Math.random() * 20;
        indicators.volume_ratio = 0.5 + Math.random() * 2;
        indicators.momentum = Math.random() - 0.5;
        break;

      case 'sentiment':
        indicators.news_sentiment = Math.random() - 0.5;
        indicators.social_sentiment = Math.random() - 0.5;
        indicators.fear_greed = Math.random() * 100;
        indicators.momentum = Math.random() - 0.5;
        break;

      default:
        indicators.momentum = Math.random() - 0.5;
        indicators.volatility = Math.random() * 0.5;
        indicators.volume = Math.random() * 2;
    }

    return indicators;
  }

  private async analyzeSentiment(asset: string, newsData: any[]): Promise<{ score: number; confidence: number }> {
    if (!newsData || newsData.length === 0) {
      return { score: 0, confidence: 0 };
    }

    // Filter news relevant to the asset
    const relevantNews = newsData.filter(news => 
      news.title.toLowerCase().includes(asset.toLowerCase()) ||
      news.summary.toLowerCase().includes(asset.toLowerCase()) ||
      news.categories?.includes(asset.toLowerCase())
    );

    if (relevantNews.length === 0) {
      return { score: 0, confidence: 0 };
    }

    // Analyze sentiment using AI
    const newsText = relevantNews
      .slice(0, 5) // Use top 5 most relevant news
      .map(news => `${news.title}: ${news.summary}`)
      .join(' ');

    try {
      const sentimentAnalysis = await openRouterService.analyzeSentiment(
        newsText,
        'deepseek/deepseek-r1'
      );

      return {
        score: sentimentAnalysis.score,
        confidence: 0.8 // Mock confidence
      };
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return { score: 0, confidence: 0 };
    }
  }

  private async processSignal(bot: AITradingBot, signal: MarketSignal): Promise<void> {
    // Check if we already have a position in this asset
    const existingPosition = bot.currentPositions.find(pos => pos.symbol === signal.symbol);
    
    if (signal.signal === 'BUY' && !existingPosition) {
      await this.executeBuy(bot, signal);
    } else if (signal.signal === 'SELL' && existingPosition) {
      await this.executeSell(bot, signal, existingPosition);
    }
  }

  private async executeBuy(bot: AITradingBot, signal: MarketSignal): Promise<void> {
    try {
      const currentPrice = realTradingEngine.getCurrentPrices()[signal.symbol] || 0;
      if (currentPrice === 0) return;

      // Calculate position size based on risk management
      const accountValue = bot.isSimulation ? 10000 : // Mock simulation balance
                          realTradingEngine.getAccount(bot.accountId)?.totalValue || 0;
      
      const riskAmount = accountValue * bot.configuration.riskPerTrade;
      const positionSize = Math.min(
        riskAmount / currentPrice,
        accountValue * bot.configuration.maxPositionSize / currentPrice
      );

      if (positionSize < 0.0001) return; // Too small to trade

      // Execute order
      if (bot.isSimulation) {
        // Simulate order execution
        this.executeSimulatedOrder(bot, {
          symbol: signal.symbol,
          side: 'buy',
          amount: positionSize,
          price: currentPrice,
          confidence: signal.confidence,
          reasoning: signal.reasoning
        });
      } else {
        // Execute real order
        const order = await realTradingEngine.placeOrder({
          accountId: bot.accountId,
          symbol: signal.symbol,
          side: 'buy',
          type: 'market',
          amount: positionSize
        });

        // Record trade
        bot.tradeHistory.push({
          id: order.id,
          symbol: signal.symbol,
          side: 'buy',
          amount: positionSize,
          price: currentPrice,
          timestamp: new Date().toISOString(),
          pnl: 0,
          confidence: signal.confidence,
          reasoning: signal.reasoning
        });
      }

      // Add position
      bot.currentPositions.push({
        symbol: signal.symbol,
        side: 'long',
        size: positionSize,
        entryPrice: currentPrice,
        currentPrice: currentPrice,
        unrealizedPnl: 0,
        entryTime: new Date().toISOString()
      });

      // Trigger N8N workflow
      await n8nAutomationService.triggerWorkflow('trading-signal-processor', {
        botId: bot.id,
        signal,
        action: 'buy_executed',
        amount: positionSize,
        price: currentPrice
      });

      this.addAlert(bot.id, 'info', `Bought ${positionSize.toFixed(6)} ${signal.symbol} at ${currentPrice.toFixed(2)} AUD`);

    } catch (error) {
      console.error('Buy execution failed:', error);
      this.addAlert(bot.id, 'error', `Buy order failed: ${error.message}`);
    }
  }

  private async executeSell(bot: AITradingBot, signal: MarketSignal, position: any): Promise<void> {
    try {
      const currentPrice = realTradingEngine.getCurrentPrices()[signal.symbol] || position.currentPrice;
      const pnl = (currentPrice - position.entryPrice) * position.size;

      // Execute order
      if (bot.isSimulation) {
        // Simulate order execution
        this.executeSimulatedOrder(bot, {
          symbol: signal.symbol,
          side: 'sell',
          amount: position.size,
          price: currentPrice,
          confidence: signal.confidence,
          reasoning: signal.reasoning,
          pnl
        });
      } else {
        // Execute real order
        const order = await realTradingEngine.placeOrder({
          accountId: bot.accountId,
          symbol: signal.symbol,
          side: 'sell',
          type: 'market',
          amount: position.size
        });

        // Record trade
        bot.tradeHistory.push({
          id: order.id,
          symbol: signal.symbol,
          side: 'sell',
          amount: position.size,
          price: currentPrice,
          timestamp: new Date().toISOString(),
          pnl,
          confidence: signal.confidence,
          reasoning: signal.reasoning
        });
      }

      // Remove position
      bot.currentPositions = bot.currentPositions.filter(pos => pos.symbol !== signal.symbol);

      // Trigger N8N workflow
      await n8nAutomationService.triggerWorkflow('trading-signal-processor', {
        botId: bot.id,
        signal,
        action: 'sell_executed',
        amount: position.size,
        price: currentPrice,
        pnl
      });

      const pnlColor = pnl >= 0 ? 'profit' : 'loss';
      this.addAlert(bot.id, 'info', `Sold ${position.size.toFixed(6)} ${signal.symbol} at ${currentPrice.toFixed(2)} AUD (${pnlColor}: ${pnl.toFixed(2)} AUD)`);

    } catch (error) {
      console.error('Sell execution failed:', error);
      this.addAlert(bot.id, 'error', `Sell order failed: ${error.message}`);
    }
  }

  private executeSimulatedOrder(bot: AITradingBot, order: {
    symbol: string;
    side: 'buy' | 'sell';
    amount: number;
    price: number;
    confidence: number;
    reasoning: string;
    pnl?: number;
  }): void {
    // Add to trade history for simulation
    bot.tradeHistory.push({
      id: `sim-${Date.now()}`,
      symbol: order.symbol,
      side: order.side,
      amount: order.amount,
      price: order.price,
      timestamp: new Date().toISOString(),
      pnl: order.pnl || 0,
      confidence: order.confidence,
      reasoning: order.reasoning
    });
  }

  private async updateBotPerformance(bot: AITradingBot): Promise<void> {
    // Update current position prices
    bot.currentPositions.forEach(position => {
      const currentPrice = realTradingEngine.getCurrentPrices()[position.symbol] || position.currentPrice;
      position.currentPrice = currentPrice;
      position.unrealizedPnl = (currentPrice - position.entryPrice) * position.size;
    });

    // Calculate performance metrics
    const trades = bot.tradeHistory;
    if (trades.length === 0) return;

    const winningTrades = trades.filter(trade => trade.pnl > 0);
    const losingTrades = trades.filter(trade => trade.pnl < 0);
    
    bot.performance.totalTrades = trades.length;
    bot.performance.winRate = winningTrades.length / trades.length;
    bot.performance.totalReturn = trades.reduce((sum, trade) => sum + trade.pnl, 0);
    
    // Calculate Sharpe ratio (simplified)
    const returns = trades.map(trade => trade.pnl);
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const returnStdDev = Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length);
    bot.performance.sharpeRatio = returnStdDev > 0 ? avgReturn / returnStdDev : 0;

    // Calculate max drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let cumulative = 0;
    
    trades.forEach(trade => {
      cumulative += trade.pnl;
      if (cumulative > peak) peak = cumulative;
      const drawdown = (peak - cumulative) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });
    
    bot.performance.maxDrawdown = maxDrawdown;

    // Calculate profit factor
    const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0));
    bot.performance.profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

    // Calculate average holding time
    const holdingTimes = trades.map(trade => {
      // Mock holding time calculation
      return Math.random() * 24; // hours
    });
    bot.performance.avgHoldingTime = holdingTimes.reduce((sum, time) => sum + time, 0) / holdingTimes.length;
  }

  private async checkRiskManagement(bot: AITradingBot): Promise<void> {
    // Check stop loss and take profit for current positions
    for (const position of bot.currentPositions) {
      const currentPrice = position.currentPrice;
      const entryPrice = position.entryPrice;
      const changePercent = (currentPrice - entryPrice) / entryPrice;

      // Stop loss check
      if (changePercent <= -bot.configuration.stopLossPercent / 100) {
        await this.executeSell(bot, {
          symbol: position.symbol,
          signal: 'SELL',
          strength: 1,
          confidence: 1,
          timeframe: bot.strategy.timeframe,
          indicators: {},
          sentiment: 0,
          reasoning: 'Stop loss triggered'
        }, position);
        continue;
      }

      // Take profit check
      if (changePercent >= bot.configuration.takeProfitPercent / 100) {
        await this.executeSell(bot, {
          symbol: position.symbol,
          signal: 'SELL',
          strength: 1,
          confidence: 1,
          timeframe: bot.strategy.timeframe,
          indicators: {},
          sentiment: 0,
          reasoning: 'Take profit triggered'
        }, position);
        continue;
      }

      // Trailing stop check
      if (bot.configuration.trailingStopPercent && changePercent > 0) {
        const trailingStopPrice = currentPrice * (1 - bot.configuration.trailingStopPercent / 100);
        if (currentPrice <= trailingStopPrice) {
          await this.executeSell(bot, {
            symbol: position.symbol,
            signal: 'SELL',
            strength: 1,
            confidence: 1,
            timeframe: bot.strategy.timeframe,
            indicators: {},
            sentiment: 0,
            reasoning: 'Trailing stop triggered'
          }, position);
        }
      }
    }

    // Check overall portfolio risk
    if (bot.performance.maxDrawdown > 0.15) { // 15% max drawdown
      this.addAlert(bot.id, 'warning', 'High drawdown detected - consider reducing position sizes');
    }

    // Check daily trade limit
    const today = new Date().toDateString();
    const todayTrades = bot.tradeHistory.filter(trade => 
      new Date(trade.timestamp).toDateString() === today
    );
    
    if (todayTrades.length >= bot.configuration.maxDailyTrades) {
      this.addAlert(bot.id, 'warning', 'Daily trade limit reached');
      // Temporarily disable bot for today
      if (bot.isActive) {
        bot.isActive = false;
        this.addAlert(bot.id, 'info', 'Bot temporarily disabled due to daily trade limit');
      }
    }
  }

  private addAlert(botId: string, type: 'info' | 'warning' | 'error', message: string): void {
    const bot = this.bots.get(botId);
    if (!bot) return;

    bot.alerts.push({
      id: `alert-${Date.now()}`,
      type,
      message,
      timestamp: new Date().toISOString(),
      acknowledged: false
    });

    // Keep only last 50 alerts
    if (bot.alerts.length > 50) {
      bot.alerts = bot.alerts.slice(-50);
    }
  }

  // Public methods
  getBot(botId: string): AITradingBot | undefined {
    return this.bots.get(botId);
  }

  getAllBots(): AITradingBot[] {
    return Array.from(this.bots.values());
  }

  getActiveBots(): AITradingBot[] {
    return Array.from(this.bots.values()).filter(bot => bot.isActive);
  }

  getStrategies(): TradingStrategy[] {
    return Array.from(this.strategies.values());
  }

  async updateBotConfiguration(botId: string, config: Partial<AITradingBot['configuration']>): Promise<boolean> {
    const bot = this.bots.get(botId);
    if (!bot) return false;

    bot.configuration = { ...bot.configuration, ...config };
    bot.lastUpdate = new Date().toISOString();
    this.bots.set(botId, bot);
    this.saveBots();

    this.addAlert(botId, 'info', 'Bot configuration updated');
    return true;
  }

  async acknowledgeAlert(botId: string, alertId: string): Promise<boolean> {
    const bot = this.bots.get(botId);
    if (!bot) return false;

    const alert = bot.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.bots.set(botId, bot);
      this.saveBots();
      return true;
    }
    return false;
  }

  async deleteBot(botId: string): Promise<boolean> {
    const bot = this.bots.get(botId);
    if (!bot) return false;

    if (bot.isActive) {
      await this.stopBot(botId);
    }

    this.bots.delete(botId);
    this.saveBots();

    toast({
      title: "Bot Deleted",
      description: `${bot.name} has been deleted`,
    });

    return true;
  }

  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

export const advancedAiTradingBot = new AdvancedAiTradingBot();
export default advancedAiTradingBot;
