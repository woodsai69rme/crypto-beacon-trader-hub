export interface Coin {
  id: string;
  name: string;
  symbol: string;
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
}

export type SupportedCurrency = "USD" | "EUR" | "GBP" | "AUD" | "JPY" | "CAD" | "CHF";

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  totalValue: number;
  timestamp: string;
  fees?: number;
}

export interface MarketData {
  [symbol: string]: {
    price: number;
    change24h: number;
  };
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'scalping' | 'breakout' | 'arbitrage' | 'grid' | 'momentum' | 'pattern-recognition' | 'ml-prediction' | 'sentiment-based' | 'custom' | 'portfolio-balancing';
  timeframe: 'short' | 'medium' | 'long';
  parameters: Record<string, any>;
  riskLevel?: 'low' | 'medium' | 'high';
  indicators?: string[];
  performance?: {
    totalReturn: number;
    winRate: number;
    trades: number;
    totalTrades: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
}
