
// Define cryptocurrency data types
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: number | null;
  total_volume?: number;
  high_24h?: number | null;
  low_24h?: number | null;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  market_cap_change_24h?: number;
  market_cap_change_percentage_24h?: number;
  circulating_supply?: number;
  total_supply?: number | null;
  max_supply?: number | null;
  ath?: number | null;
  ath_change_percentage?: number | null;
  ath_date?: string | null;
  atl?: number | null;
  atl_change_percentage?: number | null;
  atl_date?: string | null;
  roi?: any | null;
  last_updated?: string;
}

// Type for chart data
export interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// Type for supported currencies
export type SupportedCurrency = "USD" | "EUR" | "GBP" | "AUD";

// Type for coin options in dropdowns and selections
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceAUD?: number;
  priceEUR?: number;
  priceGBP?: number;
  // Additional fields needed across the application
  image?: string;
  priceChange?: number;
  changePercent?: number;
  volume?: number;
  marketCap?: number;
  rank?: number;
  volume24h?: number;
  change24h?: number;
}

// Type for watchlist items
export interface WatchlistItem extends CryptoData {
  // Additional watchlist-specific fields can be added here
  addedAt?: string;
  notes?: string;
  id: string;
  name: string;
  symbol: string;
  image?: string;
  current_price: number;
  price_change_percentage_24h?: number;
  market_cap?: number;
  market_cap_rank?: number;
}

// Type for API key information
export interface ApiKeyInfo {
  service: string;
  key: string;
  isActive: boolean;
  lastTested?: string;
  testResult?: 'success' | 'failed';
}

// Type for API usage statistics
export interface ApiUsageStats {
  service: string;
  currentUsage: number;
  maxUsage: number;
  resetTime?: string;
  endpoint?: string;
}

// Type for real-time price updates
export interface PriceUpdate {
  coinId: string;
  price: number;
  timestamp: number;
}

// Type for API rate limits
export interface ApiRateLimit {
  name: string;
  current: number;
  max: number;
  unit: string;
  interval: string;
  warning?: boolean;
}

// Type for API exchange rate limit groups
export interface ExchangeRateLimit {
  exchange: string;
  limits: ApiRateLimit[];
}

// Additional imports from src/components/trading/types.ts
export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected: boolean;
  lastUsed?: string;
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
  date?: string;
  value?: number;
  profitLoss?: number;
}

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
  type: string;
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

export interface CurrencyConversion {
  USD_AUD: number;
  AUD_USD: number;
  USD_EUR?: number;
  EUR_USD?: number;
  USD_GBP?: number;
  GBP_USD?: number;
  lastUpdated: string;
}

export interface AiTradingContextType {
  executeAiTrade: (params: {
    botId: string;
    strategyId: string;
    accountId: string;
    coinId: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
  }) => boolean;
  getConnectedAccount: (botId: string) => string | undefined;
  isProcessing: boolean;
  connectBotToAccount: (botId: string, accountId: string) => void;
  disconnectBot: (botId: string) => void;
  activeBots: Record<string, {
    lastTrade?: string;
    status: 'connected' | 'disconnected';
  }>;
}
