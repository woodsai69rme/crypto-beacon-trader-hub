
export type SupportedCurrency = 'AUD' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'CHF';

export interface PortfolioAsset {
  symbol: string;
  name: string;
  amount: number;
  price: number;
  priceAUD: number;
  value: number;
  valueAUD: number;
  change24h: number;
  allocation: number;
}

export interface AIBot {
  id: string;
  name: string;
  description: string;
  strategy: AITradingStrategy;
  status: 'active' | 'paused' | 'stopped';
  balance: number;
  performance: {
    totalReturn: number;
    winRate: number;
    totalTrades: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BotConfig {
  strategy: AITradingStrategy;
  riskLevel: 'low' | 'medium' | 'high';
  maxPositionSize: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  targetSymbols: string[];
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  endpoint?: string;
  isLocal: boolean;
}

export type AITradingStrategy = 
  | 'trend-following'
  | 'mean-reversion' 
  | 'scalping'
  | 'breakout'
  | 'grid'
  | 'arbitrage'
  | 'momentum'
  | 'pattern-recognition'
  | 'ml-prediction'
  | 'sentiment-based'
  | 'custom'
  | 'risk-weighted'
  | 'whale-tracking'
  | 'portfolio-balancing';

export type AITradingStrategyType = AITradingStrategy;

export interface Account {
  id: string;
  name: string;
  type: 'paper' | 'live';
  balance: number;
  currency: SupportedCurrency;
  assets: PortfolioAsset[];
  createdAt: string;
}

export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  volume24h: number;
}

export interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop';
  amount: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: string;
}

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: string;
}

export interface Exchange {
  id: string;
  name: string;
  isConnected: boolean;
  apiKey?: string;
  apiSecret?: string;
  sandboxMode: boolean;
}
