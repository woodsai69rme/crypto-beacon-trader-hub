
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
}

export type ValueType = number | string;

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: "trend-following" | "mean-reversion" | "breakout" | "sentiment" | "machine-learning" | "multi-timeframe" | "traditional" | "ai-predictive" | "hybrid";
  timeframe: string;
  parameters: any;
  creator?: string;
  tags?: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface AiBotTradingProps {
  botId: string;
  strategy: AITradingStrategy;
  assetPair: string;
  isActive: boolean;
}

export interface RealTimePriceChartProps {
  coinId: string;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins: CoinOption[];
  updateInterval?: number;
}

// Define interfaces for API-related components
export interface ApiUsageMetricsProps {
  apiUsage: Array<ApiUsageStats>;
  onRefresh: () => void;
}

export interface RealTimeApiUsageProps {
  selectedService: string;
  onServiceSelect: (service: any) => void;
}

// Define interface for crypto data
export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  price?: number;
  priceChange?: number;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
  rank?: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank?: number;
  volume_24h: number;
  total_volume?: number;
  circulating_supply: number;
  current_price?: number;
}

// Define chart data interface
export interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// Define ATOTaxCalculation interface
export interface ATOTaxCalculation {
  totalIncome: number;
  taxableIncome: number;
  taxOwed: number;
  medicareLevyOwed: number;
  totalTaxOwed: number;
  taxRefundOrOwed: number;
  taxRate: number;
  effectiveTaxRate: number;
}

// Define ApiEndpoint and ApiProvider interfaces
export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description: string;
  responseTime?: number;
  lastUsed?: string;
  requiresAuth?: boolean;
  parameters?: ApiParameter[];
  authentication?: boolean;
  rateLimit?: string;
}

export interface ApiParameter {
  name: string;
  description: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  default?: any;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
  endpoints: ApiEndpoint[];
  isActive?: boolean;
  apiKey?: string;
  usageLimit?: number;
  currentUsage?: number;
  enabled?: boolean;
  rateLimits?: RateLimit[];
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
}

export interface ApiUsageStats {
  service: string;
  currentUsage: number;
  maxUsage: number;
  resetTime: string;
  endpoint?: string;
  costPerCall?: number;
  remainingBalance?: number;
}

export interface RateLimit {
  limit: number;
  per: 'second' | 'minute' | 'hour' | 'day';
  remaining?: number;
  reset?: Date;
}

export interface Widget {
  id: string;
  position: { x: number; y: number };
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

export type SupportedCurrency = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "BTC" | "ETH";

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
  currentValue?: number;
  profitLoss?: number;
  botGenerated?: boolean;
  strategyId?: string;
  fees?: number;
  coin?: string;
  tags?: string[];
  result?: 'profit' | 'loss';
  pnl?: string;
  pnlPercent?: number;
}

export interface WatchlistItem {
  id: string;
  coinId: string;
  name: string;
  symbol: string;
  price: number;
  priceChangePercentage24h: number;
  addedAt: string;
  alertSettings?: {
    highPrice?: number;
    lowPrice?: number;
    percentageChangeThreshold?: number;
    enabled: boolean;
  };
}
