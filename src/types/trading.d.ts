
// Updating the trading.d.ts file to include all missing interfaces and fix type errors

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
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters?: ApiParameter[];
  isActive?: boolean;
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
  endpoint?: string;
  costPerCall?: number;
  remainingBalance?: number;
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
  tags?: string[];
  result?: 'profit' | 'loss';
  pnl?: string;
  pnlPercent?: number;
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

export interface FibonacciLevels {
  level0: number; // 0%
  level236: number; // 23.6%
  level382: number; // 38.2%
  level500: number; // 50.0%
  level618: number; // 61.8%
  level786: number; // 78.6%
  level1000: number; // 100%
  level1618: number; // 161.8%
  level2618: number; // 261.8%
  level4236: number; // 423.6%
}

export interface HyblockLiquidityZone {
  id: string;
  priceRange: {
    min: number;
    max: number;
  };
  volumeProfile: number;
  strength: 'weak' | 'medium' | 'strong';
  type: 'support' | 'resistance' | 'neutral';
  timeframe: string;
  lastTested?: string;
  breachCount?: number;
}

export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected: boolean;
  lastUsed?: string;
  description?: string;
  performance?: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

export interface FibonacciAnalysisProps {
  priceData: any[];
  symbol: string;
}

export interface HyblockLiquidityMapProps {
  currentPrice: number;
  symbol: string;
}

export interface PortfolioBenchmark {
  id: string;
  name: string;
  symbol: string;
  color: string;
  type: 'index' | 'stock' | 'crypto' | 'custom';
  performance: number[];
  lastUpdated: string;
  data: { date: string; value: number; performance: number }[];
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

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  roles: string[];
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: string;
  marketView: string;
  defaultCoin: string;
  notifications: {
    email: boolean;
    push: boolean;
    priceAlerts: boolean;
  };
}

export interface CryptoSearchProps {
  onSearch: (query: string) => void;
  recentSearches?: string[];
}

export interface DashboardHeaderProps {
  user: User;
  onSearch: (query: string) => void;
  unreadNotifications: number;
  portfolioValue: number;
  dailyChange: number;
  dailyChangePercent: number;
}

export interface ApiKeyInfo {
  id: string;
  name: string;
  key: string;
  service: string;
  provider: string;
  createdAt: string;
  lastUsed?: string;
  isValid: boolean;
  isActive: boolean;
  permissions: string[];
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

export type CryptoData = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  // Add properties that other files are looking for
  price?: number;
  marketCap?: number;
  rank?: number;
  volume?: number;
  priceChange?: number;
  changePercent?: number;
};

export interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}
