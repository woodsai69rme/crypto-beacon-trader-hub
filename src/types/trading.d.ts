
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
  };
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
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  priceChangePercentage24h?: number;
}

export interface CoinOption {
  value: string;
  label: string;
  image?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  preferences: {
    theme: string;
    notifications: boolean;
    marketAlerts: boolean;
    currency: string;
  };
}

export interface ApiKeyInfo {
  id: string;
  provider: string;
  key: string;
  name: string;
  created: string;
  lastUsed?: string;
  isActive: boolean;
  rateLimit?: number;
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
}

export interface PortfolioBenchmark {
  id: string;
  name: string;
  symbol?: string;
  type: 'index' | 'coin' | 'custom';
  performance: number;
  lastUpdated?: string;
  color?: string;
  data?: { date: string; value: number; performance: number; }[];
}

export interface ATOTaxRate {
  rate: number;
  minIncome: number;
  maxIncome?: number;
  offset?: number;
  marginRate: number;
}

export interface ATOTaxCalculation {
  assessableIncome: number;
  taxOnAssessableIncome: number;
  taxWithheld: number;
  capitalGains: number;
  CGTDiscount: number;
  deductions: number;
  taxRefundOrOwed: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export type WidgetType = 'portfolio' | 'chart' | 'watchlist' | 'news' | 'alerts' | 'trading' | 'aiTrading' | 'multiExchange' | 'aiAnalysis' | 'education' | 'community';

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface Widget {
  id: string;
  position: WidgetPosition;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  lastUpdated?: string;
  config?: any;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description?: string;
  requiresKey: boolean;
  category: string;
  sampleResponse?: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  exchange?: string;
  isActive: boolean;
  isDemo: boolean;
  created: string;
  lastUpdated: string;
  apiCredentials?: {
    key: string;
    secret: string;
  };
}
