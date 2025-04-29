
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

export type PortfolioBenchmark = {
  id: string;
  name: string;
  symbol: string;
  color: string;
  type: 'index' | 'stock' | 'crypto' | 'custom';
  performance: number[];
  lastUpdated: string;
  data: { date: string; value: number; performance: number }[];
};

export type WatchlistItem = {
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
};

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position: { x: number; y: number };
  config?: any;
  lastUpdated?: string;
}

export type WidgetType = 
  | 'price-chart' 
  | 'portfolio-summary' 
  | 'watchlist' 
  | 'news' 
  | 'trade-history'
  | 'market-overview'
  | 'performance-metrics'
  | 'alerts';

export type WidgetSize = 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'full';

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

export type AITradingStrategy = {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'breakout' | 'sentiment' | 'machine-learning' | 'multi-timeframe' | 'traditional' | 'ai-predictive' | 'hybrid';
  timeframe: string;
  parameters: {
    riskLevel: string;
    strategyType?: string;
    backtestResults?: {
      winRate: number;
      profitFactor: number;
      sharpeRatio: number;
      drawdown: number;
      returns: number;
    };
  };
};

export interface ApiKeyInfo {
  id: string;
  name: string;
  key: string;
  service: string;
  createdAt: string;
  lastUsed?: string;
  isValid: boolean;
  permissions: string[];
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

export interface ATOTaxRate {
  year: number;
  minIncome: number;
  maxIncome: number | null;
  baseAmount: number;
  marginRate: number;
}

export interface ATOTaxCalculation {
  year: number;
  assessableIncome: number;
  taxBracket: ATOTaxRate;
  taxPayable: number;
  taxWithheld: number;
  taxRefundOrOwed: number;
  capitalGains: number;
  CGTDiscount: number;
  deductions: number;
  effectiveTaxRate: number;
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
};

export interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export type SupportedCurrency = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "BTC" | "ETH";

export interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  parameters?: Record<string, string>;
  authentication?: boolean;
  rateLimit?: string;
}
