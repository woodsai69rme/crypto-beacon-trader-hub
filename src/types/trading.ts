export interface Widget {
  id: string;
  position: {
    x: number;
    y: number;
  };
  title: string;
  type: WidgetType;
  size: WidgetSize;
  lastUpdated?: string;
  customContent?: string;
  config?: any;
}

export type WidgetType = 
  | "price-chart" 
  | "portfolio-summary" 
  | "watchlist" 
  | "news" 
  | "alerts" 
  | "trading" 
  | "aiTrading" 
  | "aiAnalysis" 
  | "custom"
  | "trade-history"
  | "market-overview"
  | "performance-metrics"
  | "portfolio"
  | "chart"
  | "multiExchange"
  | "education"
  | "community";

export type WidgetSize = 
  | "small" 
  | "medium" 
  | "large" 
  | "wide" 
  | "tall"
  | "full";

export interface WidgetListProps {
  widgets: Widget[];
  onRemove?: (id: string) => void;
}

export interface WidgetGridProps extends WidgetListProps {
  onUpdatePosition?: (id: string, position: { x: number; y: number }) => void;
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange?: number;
  changePercent?: number;
  image?: string;
  volume?: number;
  marketCap?: number;
  value: string;
  label: string;
  priceAUD?: number;
  priceEUR?: number;
  priceGBP?: number;
  rank?: number;
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | string;
  timeframe: string;
  type?: 'trend-following' | 'mean-reversion' | 'breakout' | 'sentiment' | 'machine-learning' | 'multi-timeframe' | 'traditional' | 'ai-predictive' | 'hybrid';
  performance?: number;
  creator?: string;
  tags?: string[];
  parameters?: any;
  indicators?: string[];
}

export type SupportedCurrency = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "BTC" | "ETH";

// Additional properties for compatibility
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
  botGenerated?: boolean;
  strategyId?: string;
  tags?: string[];
  result?: 'profit' | 'loss';
  pnl?: string;
  pnlPercent?: number;
  fees?: number;
  coin?: string;
};

export type TradingAccount = {
  id: string;
  name: string;
  balance: number;
  initialBalance: number;
  trades: Trade[];
  currency: string;
  createdAt: string;
};

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
  endpoints: ApiEndpoint[];
  isActive?: boolean;
  enabled?: boolean;
  rateLimits?: RateLimit[];
  apiKey?: string;
  website?: string;
  docs?: string;
  priority?: number;
  requiresAuth?: boolean;
  authRequired?: boolean;
  authMethod?: string;
  apiKeyName?: string;
  defaultHeaders?: Record<string, string>;
  tier?: string;
  rateLimit?: number;
  usageLimit?: number;
  currentUsage?: number;
}

export interface ApiEndpoint {
  id?: string;
  name?: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters?: ApiParameter[];
  isActive?: boolean;
  authentication?: boolean;
  rateLimit?: string;
  requiresAuth?: boolean;
  responseTime?: number;
  lastUsed?: string;
  url?: string;
}

export interface ApiParameter {
  name: string;
  description: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  default?: any;
}

export interface RateLimit {
  limit: number;
  per: 'second' | 'minute' | 'hour' | 'day';
  remaining?: number;
  reset?: Date;
}

export interface ApiUsageStats {
  id?: string;
  name?: string;
  service: string;
  currentUsage: number;
  maxUsage: number;
  resetTime: string;
  endpoint?: string;
  costPerCall?: number;
  remainingBalance?: number;
  limit: number;
  usagePercent: number;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  price?: number;
  priceChange?: number;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
  rank?: number;
  current_price?: number;
  market_cap?: number;
  market_cap_rank?: number;
  total_volume?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  fully_diluted_valuation?: number | null;
  circulating_supply?: number;
  total_supply?: number | null;
  max_supply?: number | null;
  ath?: number;
  ath_change_percentage?: number;
  ath_date?: string;
  atl?: number;
  atl_change_percentage?: number;
  atl_date?: string;
  roi?: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated?: string;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  high_24h?: number;
  low_24h?: number;
}

export interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
  time?: Date[];
  price?: number[];
  volume?: number[];
}

export interface TaxHarvestTrade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  totalValue: number;
  timestamp: string;
  currentValue?: number;
  profitLoss?: number;
}

export interface ATOTaxRate {
  year: number;
  minIncome: number;
  maxIncome: number | null;
  baseAmount: number;
  marginRate: number;
}

export interface ATOTaxCalculation {
  year: number;
  taxYear: string;
  assessableIncome: number;
  taxableIncome: number;
  bracketInfo: ATOTaxRate;
  taxPayable: number;
  taxWithheld: number;
  taxRefundOrOwed: number;
  capitalGains: number;
  CGTDiscount: number;
  deductions: number;
  effectiveTaxRate: number;
  effectiveRate: number;
  marginalRate: number;
  takeHome: number;
  medicareLevyPayable: number;
  income: number;
  breakdown: {
    bracket: string;
    amount: number;
    tax: number;
  }[];
  financialYear?: string;
}

export interface TradeHistoryItem {
  id: string;
  type: "buy" | "sell";
  asset: string;
  amount: number;
  price: number;
  total: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

export interface WatchlistItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  priceChangePercentage24h?: number;
  image?: string;
  isWatched: boolean;
  coinId?: string;
  alertSettings?: {
    priceAbove?: number;
    priceBelow?: number;
    percentageChange?: number;
    enabled: boolean;
  };
}

export interface PortfolioAsset {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  averagePrice: number;
  currentPrice: number;
}

export interface Theme {
  name: string;
  label: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
}

export interface ThemeOption {
  value: string;
  label: string;
  description?: string;
  preview?: string;
}
