
import { AIBot, AITradingStrategy } from '@/types/trading';

export const AVAILABLE_MODELS = [
  'deepseek/deepseek-r1',
  'google/gemini-2.0-flash-exp', 
  'anthropic/claude-3.5-sonnet',
  'openai/gpt-4o',
  'meta-llama/llama-3.1-405b-instruct',
  'mistralai/mistral-large',
  'cohere/command-r-plus',
  'perplexity/llama-3.1-sonar-large',
  'nvidia/llama-3.1-nemotron-70b',
  'qwen/qwen-2.5-72b-instruct'
];

export const ENHANCED_STRATEGIES: AITradingStrategy[] = [
  {
    id: 'trend-following-btc',
    name: 'Bitcoin Trend Master',
    description: 'Advanced trend following specifically optimized for Bitcoin volatility patterns',
    type: 'trend-following',
    timeframe: '4h',
    parameters: { lookback: 20, threshold: 0.02 },
    performance: { winRate: 72, profitFactor: 2.1, sharpeRatio: 1.4, trades: 156 }
  },
  {
    id: 'mean-reversion-eth',
    name: 'Ethereum Mean Reversion Pro',
    description: 'Mean reversion strategy tuned for Ethereum DeFi correlation patterns',
    type: 'mean-reversion',
    timeframe: '1h',
    parameters: { rsi_period: 14, oversold: 30, overbought: 70 },
    performance: { winRate: 68, profitFactor: 1.9, sharpeRatio: 1.2, trades: 203 }
  },
  {
    id: 'scalping-sol',
    name: 'Solana Lightning Scalper',
    description: 'High-frequency scalping for Solana using micro-trend analysis',
    type: 'scalping',
    timeframe: '5m',
    parameters: { profit_target: 0.005, stop_loss: 0.003 },
    performance: { winRate: 64, profitFactor: 1.7, sharpeRatio: 1.1, trades: 847 }
  },
  {
    id: 'breakout-ada',
    name: 'Cardano Breakout Hunter',
    description: 'Identifies and trades Cardano breakouts from consolidation patterns',
    type: 'breakout',
    timeframe: '1d',
    parameters: { volume_threshold: 1.5, price_range: 0.02 },
    performance: { winRate: 58, profitFactor: 2.4, sharpeRatio: 1.6, trades: 89 }
  },
  {
    id: 'grid-trading-btc',
    name: 'Bitcoin Grid Master',
    description: 'Automated grid trading system for Bitcoin range-bound markets',
    type: 'grid',
    timeframe: '1h',
    parameters: { grid_levels: 10, spacing: 0.01 },
    performance: { winRate: 78, profitFactor: 1.8, sharpeRatio: 1.3, trades: 324 }
  },
  {
    id: 'arbitrage-multi',
    name: 'Multi-Exchange Arbitrage',
    description: 'Cross-exchange arbitrage opportunities across major platforms',
    type: 'arbitrage',
    timeframe: '1m',
    parameters: { min_spread: 0.002, max_exposure: 0.1 },
    performance: { winRate: 89, profitFactor: 1.4, sharpeRatio: 2.1, trades: 1247 }
  },
  {
    id: 'momentum-defi',
    name: 'DeFi Momentum Rider',
    description: 'Momentum strategy targeting DeFi tokens during trend acceleration',
    type: 'momentum',
    timeframe: '4h',
    parameters: { momentum_period: 12, acceleration: 0.05 },
    performance: { winRate: 65, profitFactor: 2.2, sharpeRatio: 1.5, trades: 178 }
  },
  {
    id: 'pattern-recognition-eth',
    name: 'Ethereum Pattern AI',
    description: 'AI-powered pattern recognition for Ethereum chart formations',
    type: 'pattern-recognition',
    timeframe: '1h',
    parameters: { pattern_types: ['head_shoulders', 'triangles', 'flags'] },
    performance: { winRate: 61, profitFactor: 1.9, sharpeRatio: 1.2, trades: 134 }
  },
  {
    id: 'sentiment-analysis',
    name: 'Social Sentiment Trader',
    description: 'News and social media sentiment analysis for trading signals',
    type: 'sentiment',
    timeframe: '1h',
    parameters: { sentiment_threshold: 0.7, news_weight: 0.6 },
    performance: { winRate: 69, profitFactor: 2.0, sharpeRatio: 1.3, trades: 256 }
  },
  {
    id: 'whale-tracker',
    name: 'Whale Movement Tracker',
    description: 'Tracks large wallet movements and follows whale trading patterns',
    type: 'whale-tracking',
    timeframe: '30m',
    parameters: { min_transaction: 1000000, follow_delay: 300 },
    performance: { winRate: 74, profitFactor: 2.3, sharpeRatio: 1.7, trades: 93 }
  },
  {
    id: 'ml-prediction-btc',
    name: 'Bitcoin ML Predictor',
    description: 'Machine learning model for Bitcoin price prediction',
    type: 'machine-learning',
    timeframe: '1h',
    parameters: { model_type: 'lstm', features: 15, lookback: 24 },
    performance: { winRate: 71, profitFactor: 2.1, sharpeRatio: 1.6, trades: 187 }
  },
  {
    id: 'portfolio-rebalancer',
    name: 'Smart Portfolio Rebalancer',
    description: 'Risk-weighted portfolio rebalancing with dynamic allocation',
    type: 'portfolio-balancing',
    timeframe: '1d',
    parameters: { rebalance_threshold: 0.05, max_position: 0.3 },
    performance: { winRate: 76, profitFactor: 1.6, sharpeRatio: 1.4, trades: 45 }
  },
  {
    id: 'news-reaction-trader',
    name: 'News Reaction Trader',
    description: 'Rapid response to breaking news and market events',
    type: 'sentiment',
    timeframe: '5m',
    parameters: { reaction_speed: 30, confidence_threshold: 0.8 },
    performance: { winRate: 63, profitFactor: 1.8, sharpeRatio: 1.1, trades: 312 }
  },
  {
    id: 'volatility-hunter',
    name: 'Volatility Hunter',
    description: 'Exploits high volatility periods across multiple assets',
    type: 'momentum',
    timeframe: '15m',
    parameters: { volatility_threshold: 0.03, exposure_limit: 0.2 },
    performance: { winRate: 59, profitFactor: 2.4, sharpeRatio: 1.3, trades: 423 }
  },
  {
    id: 'support-resistance',
    name: 'Support/Resistance Master',
    description: 'Advanced support and resistance level trading system',
    type: 'pattern-recognition',
    timeframe: '1h',
    parameters: { touch_threshold: 3, bounce_confirmation: 0.005 },
    performance: { winRate: 67, profitFactor: 1.9, sharpeRatio: 1.2, trades: 198 }
  },
  {
    id: 'correlation-trader',
    name: 'Cross-Asset Correlation Trader',
    description: 'Trades based on correlations between crypto and traditional assets',
    type: 'hybrid',
    timeframe: '4h',
    parameters: { correlation_window: 30, threshold: 0.7 },
    performance: { winRate: 66, profitFactor: 1.7, sharpeRatio: 1.1, trades: 156 }
  },
  {
    id: 'options-flow-crypto',
    name: 'Crypto Options Flow Trader',
    description: 'Follows options flow data for directional crypto trades',
    type: 'sentiment',
    timeframe: '1h',
    parameters: { volume_threshold: 100, gamma_weight: 0.4 },
    performance: { winRate: 70, profitFactor: 2.0, sharpeRatio: 1.5, trades: 123 }
  },
  {
    id: 'funding-rate-arbitrage',
    name: 'Funding Rate Arbitrageur',
    description: 'Exploits funding rate differentials across perpetual markets',
    type: 'arbitrage',
    timeframe: '8h',
    parameters: { min_rate_diff: 0.001, max_holding: 24 },
    performance: { winRate: 82, profitFactor: 1.5, sharpeRatio: 1.8, trades: 67 }
  },
  {
    id: 'defi-yield-farmer',
    name: 'DeFi Yield Farmer Pro',
    description: 'Automated yield farming strategy optimization',
    type: 'hybrid',
    timeframe: '1d',
    parameters: { min_apy: 0.05, gas_limit: 0.02 },
    performance: { winRate: 88, profitFactor: 1.3, sharpeRatio: 1.6, trades: 34 }
  },
  {
    id: 'liquidation-hunter',
    name: 'Liquidation Level Hunter',
    description: 'Targets areas with high liquidation clusters',
    type: 'breakout',
    timeframe: '15m',
    parameters: { liquidation_threshold: 10000000, proximity: 0.01 },
    performance: { winRate: 61, profitFactor: 2.2, sharpeRatio: 1.4, trades: 267 }
  }
];

export const PRE_CONFIGURED_BOTS: Omit<AIBot, 'id' | 'createdAt'>[] = ENHANCED_STRATEGIES.map((strategy, index) => ({
  name: strategy.name,
  strategy: strategy.id,
  status: Math.random() > 0.7 ? 'active' : 'paused',
  model: AVAILABLE_MODELS[index % AVAILABLE_MODELS.length],
  riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
  maxTradeAmount: Math.floor(Math.random() * 5000) + 1000,
  targetAssets: ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'].slice(0, Math.floor(Math.random() * 3) + 1),
  performance: strategy.performance || {
    totalReturn: Math.random() * 40 - 10,
    winRate: Math.floor(Math.random() * 30) + 50,
    trades: Math.floor(Math.random() * 500) + 50,
    totalTrades: Math.floor(Math.random() * 500) + 50,
    maxDrawdown: Math.random() * 15,
    sharpeRatio: Math.random() * 2 + 0.5
  },
  auditLog: []
}));

export class EnhancedAiBotService {
  private bots: Map<string, AIBot> = new Map();

  constructor() {
    this.initializePreConfiguredBots();
  }

  private initializePreConfiguredBots() {
    PRE_CONFIGURED_BOTS.forEach((botData, index) => {
      const bot: AIBot = {
        id: `bot-${index + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        ...botData
      };
      this.bots.set(bot.id, bot);
    });
  }

  getAllBots(): AIBot[] {
    return Array.from(this.bots.values());
  }

  getActiveBots(): AIBot[] {
    return this.getAllBots().filter(bot => bot.status === 'active');
  }

  getBotsByStrategy(strategy: string): AIBot[] {
    return this.getAllBots().filter(bot => bot.strategy === strategy);
  }

  getBotsByRiskLevel(riskLevel: 'low' | 'medium' | 'high'): AIBot[] {
    return this.getAllBots().filter(bot => bot.riskLevel === riskLevel);
  }

  getTopPerformingBots(limit: number = 10): AIBot[] {
    return this.getAllBots()
      .sort((a, b) => b.performance.totalReturn - a.performance.totalReturn)
      .slice(0, limit);
  }

  toggleBot(botId: string): boolean {
    const bot = this.bots.get(botId);
    if (bot) {
      bot.status = bot.status === 'active' ? 'paused' : 'active';
      this.bots.set(botId, bot);
      return true;
    }
    return false;
  }

  getAvailableStrategies(): AITradingStrategy[] {
    return ENHANCED_STRATEGIES;
  }

  getAvailableModels(): string[] {
    return AVAILABLE_MODELS;
  }
}

export const enhancedAiBotService = new EnhancedAiBotService();
