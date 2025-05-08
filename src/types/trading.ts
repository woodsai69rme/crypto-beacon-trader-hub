
// Basic types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  priceChange: number;
  changePercent: number;
  priceChangePercentage: number;
  marketCap: number;
  volume: number;
  circulatingSupply: number;
  rank?: number;
  current_price?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  market_cap?: number;
  volume_24h?: number;
}

export interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface Trade {
  id: string;
  coinId: string;
  coinSymbol: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  total: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

export interface PriceAlert {
  id: string;
  coinId: string;
  coinSymbol: string;
  price: number;
  condition: "above" | "below";
  triggered: boolean;
  createdAt: string;
}

export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  assets: PortfolioAsset[];
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    allTime: number;
  };
}

export interface PortfolioAsset {
  coinId: string;
  coinSymbol: string;
  coinName: string;
  amount: number;
  averageBuyPrice: number;
  currentPrice: number;
  value: number;
  allocation: number;
  profit: number;
  profitPercentage: number;
}

export interface TradingPair {
  baseAsset: string;
  quoteAsset: string;
  price: number;
  volume: number;
  change: number;
}

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: "positive" | "neutral" | "negative";
  categories: string[];
  relatedAssets: string[];
}

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  position?: {
    x: number;
    y: number;
  };
  size: WidgetSize;
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

export type WidgetSize = "small" | "medium" | "large" | "full";

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
  endpoints: ApiEndpoint[];
  isActive: boolean;
  enabled?: boolean;
  apiKey?: string;
  apiSecret?: string;
  usageLimit?: number;
  currentUsage?: number;
  authMethod?: string;
  apiKeyName?: string;
  defaultHeaders?: Record<string, string>;
  website?: string;
  docs?: string;
  authRequired?: boolean;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  url?: string;
  method: string;
  description?: string;
  requiresAuth?: boolean;
  responseTime?: number;
  lastUsed?: string;
  parameters?: ApiParameter[];
}

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface ApiUsageStats {
  service: string;
  currentUsage: number;
  maxUsage: number;
  endpoint?: string;
  resetTime?: string;
}

export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: string;
  isConnected: boolean;
  description?: string;
  lastUsed?: string;
  performance?: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

export interface SettingsData {
  notifications: {
    email: boolean;
    push: boolean;
    trades: boolean;
    pricing: boolean;
    news: boolean;
    priceAlerts?: boolean;
  };
  tradingPreferences: {
    autoConfirm: boolean;
    showAdvanced: boolean;
    defaultAsset: string;
  };
  display: {
    theme: string;
    chartType: string;
    currency: string;
    timeFormat: string;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    apiKeyVisibility: boolean;
  };
}

// Create a detachable analytics dashboard component
export interface LiveAnalyticsDashboardProps {
  initialCoinId?: string;
  refreshInterval?: number;
  showDetailedView?: boolean;
  onAlertTriggered?: (alert: any) => void;
  darkMode?: boolean;
}

export interface DetachableDashboardProps {
  isDetached: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Additional interface for the EnhancedPortfolioBenchmarking component
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance?: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    allTime: number;
  };
}
