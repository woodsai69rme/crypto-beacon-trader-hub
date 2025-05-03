
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
  | 'aiTrading'
  | 'custom';

export type WidgetSize = 
  | 'small'  // 1x1
  | 'medium' // 1x2
  | 'large'  // 2x2
  | 'wide'   // 2x1
  | 'tall'   // 1x3
  | 'full';  // Full width

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  price: number;
  priceChange: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
  rank?: number;
  current_price?: number;
  market_cap?: number;
  market_cap_rank?: number;
  total_volume?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  circulating_supply?: number;
  last_updated?: string;
}

export interface CryptoChartData {
  time: Date[];
  price: number[];
  volume?: number[];
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

export interface ApiUsageStats {
  id: string;
  name: string;
  service?: string;
  currentUsage?: number;
  maxUsage?: number;
  usagePercent: number;
  limit: number;
  resetTime?: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  responseTime: number;
  lastUsed: string;
  requiresAuth?: boolean;
}

export interface ApiProvider {
  id: string;
  name: string;
  description: string;
  endpoints: ApiEndpoint[];
  isActive: boolean;
  apiKey?: string;
  usageLimit: number;
  currentUsage: number;
}

export interface TransactionItem {
  id: string;
  type: 'deposit' | 'withdrawal' | 'buy' | 'sell' | 'transfer';
  amount: number;
  asset: string;
  price?: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  fee?: number;
  notes?: string;
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  price?: number;
  marketCap?: number;
  volume?: number;
  rank?: number;
  priceChange?: number;
  changePercent?: number;
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'spot' | 'margin' | 'futures';
  createdAt: string;
  updatedAt: string;
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
