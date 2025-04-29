
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply?: number;
  max_supply?: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  roi?: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  price?: number;
  marketCap?: number;
  rank?: number;
  volume?: number;
  priceChange?: number;
  changePercent?: number;
}

export interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface WatchlistItem {
  id: string;
  coinId: string;
  symbol: string;
  name: string;
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

export interface CoinOption {
  value: string;
  label: string;
  image?: string;
  id?: string;
  name?: string;
  symbol?: string;
  price?: number;
  priceAUD?: number;
  priceEUR?: number; 
  priceGBP?: number;
  priceChange?: number;
  changePercent?: number;
  volume?: number;
  marketCap?: number;
  rank?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  preferences: {
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
      priceAlerts: boolean;
    };
    currency: string;
    marketAlerts: boolean;
  };
}

export interface ApiKeyInfo {
  id: string;
  provider: string;
  key: string;
  name: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
  isValid: boolean;
  rateLimit?: number;
  service: string;
  permissions: string[];
}

export interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  parameters?: Record<string, string>;
  authentication?: boolean;
  rateLimit?: string;
}

export interface ApiProvider {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  apiKey?: string;
  enabled: boolean;
  endpoints: ApiEndpoint[];
  rateLimit: number;
  tier: string;
  authMethod?: string;
  apiKeyName?: string;
  requiresAuth?: boolean;
  priority?: number;
  defaultHeaders?: Record<string, string>;
}

export interface ApiUsageStats {
  provider: string;
  totalCalls: number;
  successRate: number;
  averageResponseTime: number;
  errorsLastHour: number;
  status: 'operational' | 'degraded' | 'down';
  usageTrend: {
    date: string;
    calls: number;
  }[];
  quota: {
    limit: number;
    used: number;
    remaining: number;
    resetsAt: string;
  };
  service?: string;
  currentUsage?: number;
  maxUsage?: number;
  resetTime?: string;
  endpoint?: string;
}

export interface Trade {
  id: string;
  type: 'buy' | 'sell';
  coin: string;
  amount: number;
  price: number;
  date: Date | string;
  fees?: number;
  status: 'completed' | 'pending' | 'failed';
  exchangeRate?: number;
  exchangeId?: string;
  coinId?: string;
  coinName?: string;
  coinSymbol?: string;
  totalValue?: number;
  timestamp?: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'spot' | 'margin' | 'futures';
  createdAt: string;
  updatedAt: string;
  trades: Trade[];
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    allTime: number;
  };
  risk: {
    level: 'low' | 'medium' | 'high';
    exposure: number;
  };
  isActive: boolean;
  isDemo: boolean;
}

export interface PortfolioBenchmark {
  id: string;
  name: string;
  data: number[] | Array<{ date: string; value: number; performance: number }>;
  color: string;
  performance?: number[];
  lastUpdated?: string;
  symbol?: string;
  type?: 'index' | 'stock' | 'crypto' | 'custom';
}

export interface PortfolioAllocation {
  asset: string;
  value: number;
  percentage: number;
  color: string;
}

export interface ATOTaxRate {
  minIncome: number;
  maxIncome: number;
  baseAmount: number;
  marginRate: number;
  year?: number;
}

export interface ATOTaxCalculation {
  income: number;
  taxBracket: string;
  taxPayable: number;
  effectiveRate: number;
  marginalRate: number;
  takeHome: number;
  breakdown: {
    bracket: string;
    amount: number;
    tax: number;
  }[];
  financialYear?: string;
  taxableIncome?: number;
  medicareLevyPayable?: number;
  year?: number;
  assessableIncome?: number;
  taxBracket?: ATOTaxRate;
  taxWithheld?: number;
  taxRefundOrOwed?: number;
  capitalGains?: number;
  CGTDiscount?: number;
  deductions?: number;
  effectiveTaxRate?: number;
}

export type WidgetType = 
  | 'price-chart' 
  | 'portfolio-summary' 
  | 'watchlist' 
  | 'news' 
  | 'trade-history'
  | 'market-overview'
  | 'performance-metrics'
  | 'alerts'
  | 'portfolio'
  | 'chart'
  | 'trading'
  | 'aiTrading'
  | 'multiExchange'
  | 'education'
  | 'community'
  | 'aiAnalysis'
  | 'custom';

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface Widget {
  id: string;
  position: { x: number; y: number };
  title: string;
  type: WidgetType;
  size: WidgetSize;
  lastUpdated?: string;
  customContent?: string;
}

export interface CryptoSearchProps {
  onCoinSelect: (coin: CoinOption) => void;
  placeholder?: string;
  className?: string;
}

export interface DashboardHeaderProps {
  notificationCount?: number;
  alertCount?: number;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export interface WidgetGridProps {
  widgets: Widget[];
  onRemove?: (id: string) => void;
  onUpdatePosition?: (id: string, position: { x: number; y: number }) => void;
}

export interface WidgetListProps {
  widgets: Widget[];
  onRemove?: (id: string) => void;
}

export interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWidget: (widget: { title: string; type: WidgetType; size: WidgetSize; customContent?: string; }) => void;
}

export type AITradingStrategy = {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'breakout' | 'sentiment' | 'machine-learning' | 'multi-timeframe' | 'traditional' | 'ai-predictive' | 'hybrid';
  timeframe: string;
  parameters: any;
  riskLevel?: string;
  indicators?: string[];
};
