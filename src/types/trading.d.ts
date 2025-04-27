
import { SupportedCurrency } from "../components/trading/TradingStats";

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

// Additional types from trading.ts file
export interface CurrencyConversion {
  USD_AUD: number;
  AUD_USD: number;
  USD_EUR?: number;
  EUR_USD?: number;
  USD_GBP?: number;
  GBP_USD?: number;
  lastUpdated: string;
}

export interface BacktestTrade {
  id: string;
  timestamp: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  profit?: number;
  profitPercentage?: number;
  date?: string;
  value?: number;
  profitLoss?: number;
}

export interface BacktestResult {
  startDate: string;
  endDate: string;
  initialBalance: number;
  finalBalance: number;
  profit: number;
  profitPercentage: number;
  maxDrawdown: number;
  winRate: number;
  trades: BacktestTrade[];
  sharpeRatio?: number;
  profitFactor?: number;
  averageProfit?: number;
  averageLoss?: number;
  initialCapital?: number;
  finalCapital?: number;
  totalReturn?: number;
  totalTrades?: number;
  winningTrades?: number;
  losingTrades?: number;
  sortinoRatio?: number;
}

export interface OptimizationResult {
  strategyId: string;
  parameterValues: Record<string, any>;
  parameters?: StrategyParameter[];
  performance: {
    profit: number;
    profitPercentage: number;
    maxDrawdown: number;
    winRate: number;
    sharpeRatio?: number;
    profitFactor?: number;
    totalReturn?: number;
  };
  improvement: number;
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

export interface TechnicalIndicator {
  name: string;
  period: number;
  params?: Record<string, any>;
  key?: string;
  category?: string;
  description?: string;
}

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
