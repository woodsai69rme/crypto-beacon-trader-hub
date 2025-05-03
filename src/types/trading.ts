
// Generic interfaces
export interface CoinOption {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  price: number;
  priceChange?: number;
  value?: string;
  label?: string;
}

export interface Widget {
  id: string;
  type: string;
  title: string;
  size?: WidgetSize;
  position?: { x: number; y: number };
  data?: any;
  settings?: any;
}

export type WidgetSize = 'small' | 'medium' | 'large' | 'custom';
export type WidgetType = 'chart' | 'portfolio' | 'watchlist' | 'news' | 'alerts' | 'analysis';

export interface TickerSettings {
  enabled: boolean;
  position: 'top' | 'bottom' | 'both';
  speed: number;
  direction: 'left' | 'right';
  autoPause: boolean;
}

export interface SidebarSettings {
  enabled: boolean;
  position: 'left' | 'right';
  defaultCollapsed: boolean;
  showLabels: boolean;
}

// Trading related interfaces
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  price: number;
  current_price?: number;
  priceChange?: number;
  price_change_24h: number;
  changePercent?: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank?: number;
  volume_24h: number;
  total_volume?: number;
  circulating_supply: number;
  rank?: number;
}

export interface TradingAccount {
  id: string;
  name: string;
  type: 'exchange' | 'wallet' | 'bank';
  provider: string;
  balance: number;
  currency: string;
  lastUpdated: string;
  assets?: Asset[];
  settings?: AccountSettings;
  isActive: boolean;
}

export interface AccountWithBotsEnabled extends TradingAccount {
  id: string;
  name: string;
  balance: number;
  botsEnabled: boolean;
}

interface Asset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  value: number;
}

interface AccountSettings {
  notifications: boolean;
  autoSync: boolean;
  apiKeyName?: string;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'breakout' | 'sentiment' | 'machine-learning' | 'multi-timeframe' | 'traditional' | 'ai-predictive' | 'hybrid';
  timeframe: string;
  parameters: any;
  creator: string;
  tags: string[];
  riskLevel: 'low' | 'medium' | 'high';
  performance?: {
    totalReturn: number;
    winRate: number;
    sharpeRatio: number;
  };
  indicators?: string[];
}

export interface AiBotTradingProps {
  strategyId?: string;
  strategyName?: string;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
  endpoints: ApiEndpoint[];
  isActive: boolean;
  apiKey: string;
  usageLimit: number;
  currentUsage: number;
  enabled?: boolean;
  requiresAuth?: boolean;
  authRequired?: boolean;
  website?: string;
  docs?: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  responseTime: number;
  lastUsed: string;
  requiresAuth: boolean;
}

export interface ApiUsageStats {
  serviceId: string;
  serviceName: string;
  totalRequests: number;
  periodRequests: number;
  requestsLimit: number;
  averageResponseTime: number;
  errorRate: number;
  costPerRequest?: number;
  lastRequested: string;
}

export interface WatchlistItem extends CoinOption {
  isStarred: boolean;
  addedAt: string;
  notes?: string;
  alerts?: PriceAlert[];
}

interface PriceAlert {
  id: string;
  condition: 'above' | 'below';
  price: number;
  isActive: boolean;
  createdAt: string;
}

export interface Trade {
  id: string;
  coinId: string;
  coinSymbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  exchange?: string;
}

export interface ATOTaxCalculation {
  financialYear: string;
  taxableIncome: number;
  capitalGainsIncome: number;
  taxRate: number;
  medicareLevyRate: number;
  taxPayable: number;
  medicareLevy: number;
  totalTaxLiability: number;
  taxCredits: number;
  taxRefundOrOwed: number;
  incomeTax: number;
  taxWithheld: number;
  netCapitalGains: number;
  assessableIncome: number;
  bracketInfo?: {
    bracket: string;
    rate: string;
  };
  capitalGains?: number;
  CGTDiscount?: number;
}
