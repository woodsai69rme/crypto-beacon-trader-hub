import { SupportedCurrency } from "../components/trading/TradingStats";

export type CoinOption = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange?: number;
  changePercent?: number;
  marketCap: number;
  volume: number;
  image?: string;
  priceAUD?: number;
  priceEUR?: number;
  priceGBP?: number;
};

export type Trade = {
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
  currentValue?: number;
  profitLoss?: number;
};

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
