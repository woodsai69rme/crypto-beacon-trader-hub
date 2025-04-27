
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
  price_change_percentage_24h?: number;
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
  fee?: number;
  feeAsset?: string;
  exchange?: string;
  notes?: string;
  tags?: string[];
  currentValue?: number;
  profitLoss?: number;
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
  date?: string; 
  value?: number; 
  profitLoss?: number;
  total?: number;
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
  label?: string;
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

// Widget types
export type WidgetSize = 'small' | 'medium' | 'large' | 'full';
export type WidgetType = 'trading' | 'aiTrading' | 'multiExchange' | 'education' | 'community' | 'aiAnalysis' | 'custom';

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  customContent?: string;
  position?: number;
}

// AI Trading Strategy types
export type AIStrategyType = 
  | "trend-following" 
  | "mean-reversion" 
  | "momentum" 
  | "breakout" 
  | "sentiment" 
  | "machine-learning"
  | "custom"
  | "multi-timeframe";

export type ExtendedTradingTimeframe =
  | '1m' | '3m' | '5m' | '15m' | '30m' 
  | '1h' | '2h' | '4h' | '6h' | '8h' | '12h'
  | '1d' | '3d' | '1w' | '2w' | '1M' | '3M' | '6M' | '1y';

export interface TimeframeOption {
  value: ExtendedTradingTimeframe;
  label: string;
  description: string;
  minutes?: number;
}

export type TradingTimeframe = ExtendedTradingTimeframe | TimeframeOption;

export interface TechnicalIndicator {
  name: string;
  period: number;
  params?: Record<string, any>;
  key?: string;
  category?: string;
  description?: string;
}

// Portfolio and market analysis
export interface PortfolioBenchmark {
  id: string;
  name: string;
  symbol?: string;
  type: 'crypto' | 'index' | 'stock' | 'custom';
  data: {
    date: string;
    value: number;
    performance: number;
  }[];
  color: string;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKey?: string;
  apiKeyName?: string;
  authMethod: 'header' | 'query' | 'none';
  defaultHeaders?: Record<string, string>;
  rateLimit?: number;
  requiresAuth: boolean;
  endpoints: {
    [key: string]: string;
  };
  enabled: boolean;
  priority: number;
}

export interface AiTradingContextType {
  executeAiTrade: (botId: string, tradeDetails: any) => Promise<void>;
  getConnectedAccount: (botId: string) => string | undefined;
  isProcessing: boolean;
  connectBotToAccount: (botId: string, accountId: string) => void;
  disconnectBot: (botId: string) => void;
  activeBots: Record<string, {
    lastTrade?: string;
    status: 'connected' | 'disconnected';
  }>;
}

export interface CurrencyConversion {
  USD_AUD: number;
  AUD_USD: number;
  USD_EUR?: number;
  EUR_USD?: number;
  USD_GBP?: number;
  GBP_USD?: number;
  lastUpdated: string;
}

export interface ATOTaxCalculation {
  financialYear: string;
  assessableIncome: number;
  capitalGains: number;
  shortTermGains: number;
  longTermGains: number;
  CGTDiscount?: number;
  deductions: number;
  taxableIncome: number;
  taxPayable: number;
  medicareLevyPayable: number;
  taxWithheld?: number;
  taxRefundOrOwed: number;
  currency: string;
}

export interface ATOTaxRate {
  minIncome: number;
  maxIncome: number | null;
  baseAmount: number;
  marginRate: number;
  year: string;
}

export interface TaxHarvestingOptions {
  year: number;
  minLossThreshold: number;
  washSalePeriod: number;
  includeFees: boolean;
  maximizeLoss: boolean;
}

export interface TaxLotMatchingMethod {
  id: string;
  name: string;
  description: string;
  type: 'FIFO' | 'LIFO' | 'HIFO' | 'LOFO' | 'avgCost' | 'specificID';
}

export interface TaxHarvestingOpportunity {
  coinId: string;
  coinSymbol: string;
  currentPrice: number;
  averageCost: number;
  quantity: number;
  potentialLoss: number;
  recommendedAction: 'sell' | 'hold';
  reasoning: string;
  washSaleWarning: boolean;
}
