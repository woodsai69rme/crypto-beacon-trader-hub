import { SupportedCurrency } from "../components/trading/TradingStats";

export type CoinOption = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceAUD?: number;
  priceEUR?: number; 
  priceGBP?: number;
  volume24h?: number;
  marketCap?: number;
  change24h?: number;
  exchange?: string;
  lastUpdated?: string;
  priceChange?: number;
  changePercent?: number;
  volume?: number;
  image?: string;
  current_price?: number;
  market_cap?: number;
  market_cap_rank?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
};

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  image?: string;
  priceChange?: number;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
  priceAUD?: number;
  priceEUR?: number;
  priceGBP?: number;
}

export interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface Trade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  totalValue: number;
  timestamp: string;
  currency: SupportedCurrency;
  botGenerated?: boolean;
  fee?: number;
  feeAsset?: string;
  exchange?: string;
  notes?: string;
  tags?: string[];
  strategyId?: string;
  currentValue?: number;
  profitLoss?: number;
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  initialBalance: number;
  currency: string;
  trades: Trade[];
  createdAt: string;
  lastModified: string;
  allowBots?: boolean;
}

export type WidgetType = 
  | "trading"
  | "aiTrading"
  | "multiExchange"
  | "aiAnalysis"
  | "education"
  | "community"
  | "custom";

export type WidgetSize = "small" | "medium" | "large" | "full";

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  position: number;
  customContent?: string;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyName?: string;
  authMethod: "header" | "query" | "none";
  requiresAuth: boolean;
  apiKey?: string;
  defaultHeaders?: Record<string, string>;
  endpoints: Record<string, string>;
  enabled: boolean;
  priority: number;
}

export type AIStrategyType = 
  | "trend-following" 
  | "mean-reversion" 
  | "momentum" 
  | "breakout" 
  | "sentiment" 
  | "machine-learning"
  | "custom"
  | "multi-timeframe";

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: AIStrategyType;
  risk: "low" | "medium" | "high";
  backtestResults?: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    drawdown: number;
    returns: number;
  };
  parameters?: Record<string, any>;
  isActive?: boolean;
  isCustom?: boolean;
  createdAt?: string;
  lastModified?: string;
}
