
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
  current_price?: number;
  market_cap?: number;
  market_cap_rank?: number;
  price_change_percentage_24h?: number;
}

// Type for watchlist items
export interface WatchlistItem {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  current_price: number;
  price_change_percentage_24h?: number;
  market_cap?: number;
  market_cap_rank?: number;
  addedAt?: string;
  notes?: string;
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

// Type for API provider
export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
  logo?: string;
  documentation?: string;
  version?: string;
  authMethod?: 'header' | 'query' | 'none';
  apiKeyName?: string;
  requiresAuth?: boolean;
  enabled?: boolean;
  priority?: number;
  rateLimitPerMinute?: number;
  rateLimitPerDay?: number;
  rateLimitPerMonth?: number;
  defaultHeaders?: Record<string, string>;
  defaultParams?: Record<string, string>;
  endpoints?: ApiEndpoint[];
  apiKey?: string;
  apiSecret?: string;
}

// Type for API endpoint
export interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description?: string;
  requiresAuth?: boolean;
  params?: ApiParameter[];
  headers?: ApiParameter[];
  body?: ApiParameter[];
  rateLimited?: boolean;
  cacheDuration?: number; // in seconds
}

// Type for API parameter
export interface ApiParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description?: string;
  defaultValue?: any;
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

// Trade type
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

// Trading Account
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

// BacktestTrade
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

// Widget size and type
export type WidgetSize = 'small' | 'medium' | 'large' | 'full';
export type WidgetType = 'trading' | 'aiTrading' | 'multiExchange' | 'education' | 'community' | 'aiAnalysis' | 'custom';

// Widget
export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  customContent?: string;
  position?: number;
}

// AI Strategy Type
export type AIStrategyType = 
  | "trend-following" 
  | "mean-reversion" 
  | "momentum" 
  | "breakout" 
  | "sentiment" 
  | "machine-learning"
  | "custom"
  | "multi-timeframe";

// AI Trading Strategy
export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe: string;
  parameters: Record<string, any>;
}

// Strategy Parameter
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

// Technical Indicator
export interface TechnicalIndicator {
  name: string;
  period: number;
  params?: Record<string, any>;
  key?: string;
  category?: string;
  description?: string;
}

// Extended Trading Timeframe
export type ExtendedTradingTimeframe =
  | '1m' | '3m' | '5m' | '15m' | '30m' 
  | '1h' | '2h' | '4h' | '6h' | '8h' | '12h'
  | '1d' | '3d' | '1w' | '2w' | '1M' | '3M' | '6M' | '1y';

// Timeframe Option
export interface TimeframeOption {
  value: ExtendedTradingTimeframe;
  label: string;
  description: string;
  minutes?: number;
}

// Trading Timeframe
export type TradingTimeframe = ExtendedTradingTimeframe | TimeframeOption;

// Backtest Result
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

// Optimization Result
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

// Currency Conversion
export interface CurrencyConversion {
  USD_AUD: number;
  AUD_USD: number;
  USD_EUR?: number;
  EUR_USD?: number;
  USD_GBP?: number;
  GBP_USD?: number;
  lastUpdated: string;
}

// AI Trading Context Type
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
  addStrategy?: (strategy: AITradingStrategy) => void;
}

// Fibonacci Levels
export interface FibonacciLevels {
  coin: string;
  timeframe: string;
  levels: {
    extension: number;
    price: number;
    significance: 'weak' | 'medium' | 'strong';
  }[];
  lastCalculated: string;
}

// Liquidity Heatmap
export interface LiquidityHeatmap {
  coin: string;
  timeframe: string;
  buyLevels: {
    price: number;
    volume: number;
    strength: number;
  }[];
  sellLevels: {
    price: number;
    volume: number;
    strength: number;
  }[];
  lastUpdated: string;
}

// Trade Prediction
export interface TradePrediction {
  coin: string;
  timeframe: string;
  direction: 'up' | 'down' | 'sideways';
  confidence: number;
  targetPrice: number;
  stopLoss: number;
  probability: number;
  indicators: {
    name: string;
    value: number;
    signal: 'buy' | 'sell' | 'neutral';
  }[];
  timestamp: string;
}

// Hyblock API specific types
export interface HyblockOrderBookData {
  exchange: string;
  symbol: string;
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
}

export interface HyblockLiquidityZone {
  price: number;
  volume: number;
  type: 'buy' | 'sell';
  strength: number;
  exchanges: string[];
}

export interface HyblockMarketData {
  symbol: string;
  liquidityZones: HyblockLiquidityZone[];
  largeOrders: {
    price: number;
    size: number;
    side: 'buy' | 'sell';
    exchange: string;
    timestamp: number;
  }[];
  lastUpdated: string;
}

// LocalModel Interface
export interface LocalModel {
  id: string;
  name: string;
  description: string;
  endpoint?: string;
  type: string;
  isConnected?: boolean;
  lastUsed?: string;
  parameters: Record<string, any>;
  performance: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  status: 'active' | 'inactive' | 'training';
  creator: string;
  fileSize?: number;
  version?: string;
}

// TradingViewChart Config
export interface TradingViewChartConfig {
  symbol: string;
  interval: string;
  timezone?: string;
  theme?: 'light' | 'dark';
  style?: 'candles' | 'bars' | 'line' | 'area';
  studies?: string[];
  width?: string | number;
  height?: string | number;
  containerId?: string;
}

// Quantitative Analysis
export interface QuantitativeAnalysis {
  id: string;
  symbol: string;
  timeframe: string;
  timestamp: string;
  buyProbability: number;
  sellProbability: number;
  holdProbability: number;
  expectedValue: number;
  riskRewardRatio: number;
  confidenceScore: number;
  signals: {
    indicator: string;
    value: number;
    signal: 'buy' | 'sell' | 'neutral';
    strength: number;
    timeframe: string;
  }[];
  shortTerm: {
    direction: 'up' | 'down' | 'sideways';
    probability: number;
    targetPrice?: number;
  };
  mediumTerm: {
    direction: 'up' | 'down' | 'sideways';
    probability: number;
    targetPrice?: number;
  };
  longTerm: {
    direction: 'up' | 'down' | 'sideways';
    probability: number;
    targetPrice?: number;
  };
}

// Portfolio Benchmark type
export interface PortfolioBenchmark {
  id: string;
  name: string;
  symbol: string;
  performance: {
    day: number;
    week: number;
    month: number;
    threeMonth: number;
    year: number;
    ytd: number;
  };
  lastUpdated: string;
  description?: string;
  type: 'index' | 'etf' | 'stock' | 'crypto' | 'custom';
}

// ATO Tax related types
export interface ATOTaxRate {
  lowerBound: number;
  upperBound: number | null;
  baseAmount: number;
  rate: number;
  taxableYear: string;
}

export interface ATOTaxCalculation {
  id: string;
  financialYear: string;
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxPayable: number;
  medicareLevyPayable: number;
  taxOffsets: number;
  netTaxPayable: number;
  effectiveTaxRate: number;
  trades: Trade[];
  timestamp: string;
  notes?: string;
}

// Trading Signal and Strategy Share types
export interface TradingSignal {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  coinId: string;
  coinSymbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  confidence: 'low' | 'medium' | 'high';
  reasoning: string;
  timestamp: string;
  likes: number;
  comments: number;
}

export interface StrategyShare {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  strategyName: string;
  strategyType: string;
  description: string;
  performance: {
    winRate: number;
    profitFactor: number;
    totalTrades: number;
    averageReturn: number;
  };
  tags: string[];
  likes: number;
  downloads: number;
  timestamp: string;
}

// Props types for components
export interface QuantitativeAnalysisProps {
  symbol: string;
  timeframe: string;
  timestamp: string;
  buyProbability: number;
  sellProbability: number;
  holdProbability: number;
  expectedValue: number;
  riskRewardRatio: number;
  confidenceScore: number;
  signals: Array<{
    indicator: string;
    value: number;
    signal: 'buy' | 'sell' | 'neutral';
    strength: number;
    timeframe: string;
  }>;
  shortTerm: {
    direction: 'up' | 'down' | 'sideways';
    probability: number;
    targetPrice?: number;
  };
  mediumTerm: {
    direction: 'up' | 'down' | 'sideways';
    probability: number;
    targetPrice?: number;
  };
  longTerm: {
    direction: 'up' | 'down' | 'sideways';
    probability: number;
    targetPrice?: number;
  };
}

export interface CryptoSearchProps {
  coins: CoinOption[] | CryptoData[];
  onSelect: (coin: CoinOption | CryptoData) => void;
}
