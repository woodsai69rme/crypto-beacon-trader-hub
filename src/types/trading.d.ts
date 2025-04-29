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
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters?: ApiParameter[];
  isActive?: boolean;
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
  service: string;
  currentUsage: number;
  maxUsage: number;
  resetTime: string;
  endpoint: string;
}

export interface Widget {
  id: string;
  position: { x: number; y: number };
  title: string;
  type: WidgetType;
  size: WidgetSize;
  lastUpdated?: string;
  customContent?: string;
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
  | "custom";

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
  price?: number;
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
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
  type?: 'trend-following' | 'mean-reversion' | 'breakout' | 'sentiment' | 'machine-learning' | 'multi-timeframe' | 'traditional' | 'ai-predictive' | 'hybrid';
  performance?: number;
  creator?: string;
  tags?: string[];
  parameters?: any;
  indicators?: string[];
}

export interface AiBotTradingProps {
  botId: string;
  strategyId: string;
  strategyName: string;
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
