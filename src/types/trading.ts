
import { SupportedCurrency } from "../components/trading/TradingStats";

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

export interface CoinOption {
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

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  initialBalance: number;
  currency: string;
  trades: Trade[];
  createdAt: string;
  lastModified?: string;
  description?: string;
  type?: 'spot' | 'margin' | 'futures';
  riskLevel?: 'low' | 'medium' | 'high';
  allowBots?: boolean;
  apiKeys?: {
    exchange: string;
    key: string;
    secret: boolean;
    permissions: string[];
  }[];
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
  date?: string; // For display purposes
  value?: number; // Current value
  profitLoss?: number; // For tracking P&L
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
  position?: number; // Added position field for ordering widgets
}

// AI Trading Strategy types
export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'momentum' | 'mean-reversion' | 'trend-following' | 'custom';
  timeframe: string;
  parameters: Record<string, any>;
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
  label?: string; // Display label
}

export interface TechnicalIndicator {
  name: string;
  period: number;
  params?: Record<string, any>;
  key?: string; // Unique identifier
  category?: string; // Category for grouping
  description?: string; // Description of the indicator
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
  washSalePeriod: number; // Days
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
    performance: number; // Percentage
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
  rateLimit?: number; // Requests per minute
  requiresAuth: boolean;
  endpoints: {
    [key: string]: string;
  };
  enabled: boolean;
  priority: number; // Lower number = higher priority
}

// Australian Tax Office specific interfaces
export interface ATOTaxCalculation {
  financialYear: string; // Format: "2023-2024"
  assessableIncome: number;
  capitalGains: number;
  shortTermGains: number; // Less than 12 months
  longTermGains: number; // More than 12 months
  CGTDiscount?: number; // Capital Gains Tax Discount (usually 50% for individuals)
  deductions: number;
  taxableIncome: number;
  taxPayable: number;
  medicareLevyPayable: number;
  taxWithheld?: number;
  taxRefundOrOwed: number; // Positive = refund, negative = owing
  currency: string;
}

export interface ATOTaxRate {
  minIncome: number;
  maxIncome: number | null;
  baseAmount: number;
  marginRate: number; // Percentage
  year: string; // Financial year e.g., "2023-2024"
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
