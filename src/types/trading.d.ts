
// Define types for the trading system
export type SupportedCurrency = "USD" | "AUD" | "EUR" | "GBP";

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
  price?: number;
}

export interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceAUD?: number;
  priceEUR?: number;
  priceGBP?: number;
  priceChange?: number;
  changePercent?: number;
  image?: string;
  marketCap?: number;
  volume?: number;
  market_cap?: number;
  market_cap_rank?: number;
  current_price?: number;
}

export type WatchlistItem = CryptoData;

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe: string;
  parameters: Record<string, any>;
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  initialBalance: number;
  trades: Trade[];
  createdAt: string;
  apiKeys?: ApiKeyInfo[];
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
  strategyId?: string;
}

export interface BacktestResult {
  strategy: AITradingStrategy;
  startDate: string;
  endDate: string;
  initialBalance: number;
  finalBalance: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  trades: BacktestTrade[];
}

export interface BacktestTrade {
  id: string;
  timestamp: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  profit?: number;
  profitPercentage?: number;
}

export interface OptimizationResult {
  strategyId: string;
  parameters: Record<string, any>;
  performance: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    returns: number;
  };
}

export interface StrategyParameter {
  id: string;
  name: string;
  description: string;
  type: 'number' | 'boolean' | 'string' | 'select';
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export interface ApiKeyInfo {
  id: string;
  name: string;
  exchange: string;
  key: string;
  secret: string;
  createdAt: string;
  lastUsed?: string;
  permissions?: string[];
  isActive: boolean;
}

export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected: boolean;
  lastUsed?: string;
}
