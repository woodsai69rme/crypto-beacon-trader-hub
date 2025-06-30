
export type SupportedCurrency = 'AUD' | 'USD' | 'BTC' | 'ETH';

export interface PortfolioAsset {
  coinId: string;
  amount: number;
  price: number;
  priceAUD: number;
  symbol: string;
  name: string;
  value: number;
  valueAUD: number;
  allocation: number;
  change24h: number;
  changePercent24h: number;
}

export interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  fee: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  type: 'market' | 'limit' | 'stop';
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  currency: SupportedCurrency;
  trades: Trade[];
  assets: PortfolioAsset[];
  type: 'paper' | 'live';
  createdAt: string;
  isActive: boolean;
  initialBalance?: number;
}

export type AIModel = 
  | 'gpt-4o-mini'
  | 'gpt-4o'
  | 'claude-3.5-sonnet'
  | 'deepseek-r1'
  | 'gemini-2.0-flash'
  | 'local-llama'
  | 'local-mistral';

export type AITradingStrategyType = 
  | 'grid'
  | 'trend-following'
  | 'mean-reversion'
  | 'breakout'
  | 'scalping'
  | 'arbitrage'
  | 'momentum'
  | 'pattern-recognition'
  | 'machine-learning'
  | 'sentiment'
  | 'hybrid'
  | 'custom'
  | 'ai-predictive'
  | 'traditional'
  | 'whale-tracking'
  | 'portfolio-balancing';

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: AITradingStrategyType;
  timeframe: string;
  parameters: Record<string, any>;
  performance?: {
    winRate: number;
    totalReturn: number;
    maxDrawdown: number;
  };
}

export interface AIBot {
  id: string;
  name: string;
  description: string;
  strategy: AITradingStrategyType;
  model: AIModel;
  status: 'active' | 'paused' | 'stopped' | 'error';
  accountId: string;
  targetAssets: string[];
  riskLevel: 'low' | 'medium' | 'high';
  maxTradeAmount: number;
  performance: {
    totalReturn: number;
    winRate: number;
    trades: number;
    totalTrades: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  createdAt: string;
  updatedAt: string;
  lastTradeAt?: string;
}

export interface BotConfig {
  id: string;
  name: string;
  description: string;
  strategy: AITradingStrategyType;
  model: AIModel;
  riskLevel: 'low' | 'medium' | 'high';
  maxTradeAmount: number;
  targetAssets: string[];
  parameters: Record<string, any>;
}

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap?: number;
  high24h?: number;
  low24h?: number;
}
