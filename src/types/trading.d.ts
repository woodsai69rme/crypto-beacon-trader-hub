
// Basic trading types
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
  // For select component
  value: string;
  label: string;
}

export interface PricePoint {
  timestamp: number;
  price: number;
  date?: string; // Formatted date string
  volume?: number;
  open?: number;
  close?: number;
  high?: number;
  low?: number;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  priceChangePercentage24h: number;
  marketCap: number;
  totalVolume: number;
  high24h?: number;
  low24h?: number;
  prices?: [number, number][]; // [timestamp, price]
}

export interface Trade {
  id: string;
  coinId: string;
  coinName: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  total: number;
  timestamp: number;
}

export interface WalletAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  assets: {
    coinId: string;
    name: string;
    symbol: string;
    quantity: number;
    averagePrice: number;
  }[];
}

export interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  supported: boolean;
}

export type SupportedCurrency = 'AUD' | 'USD' | 'EUR' | 'GBP';

export type TransactionStatusVariant = 'pending' | 'success' | 'warning' | 'destructive';

// AI Trading types
export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe?: string;
  riskLevel: 'low' | 'medium' | 'high';
  parameters?: Record<string, any>;
}

export interface AIStrategyParameters {
  buySignalThreshold: number;
  sellSignalThreshold: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  maxOpenPositions: number;
  positionSizePercentage: number;
}

export interface PaperTradingConfig {
  enabled: boolean;
  initialBalance: number;
  currency: string;
  slippageModel: 'none' | 'simple' | 'realistic';
  slippagePercentage: number;
  maxTradeSize: number;
  includeFees: boolean;
  feePercentage: number;
}

// Dashboard & widgets
export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  data?: any;
  settings?: any;
  position?: { x: number; y: number; w: number; h: number };
}

export type WidgetType = 'price' | 'chart' | 'news' | 'portfolio' | 'alerts' | 'trading' | 'custom';
export type WidgetSize = 'small' | 'medium' | 'large' | 'custom';

export interface DetachableDashboardProps {
  onClose: () => void;
  isDetached?: boolean;
  children?: React.ReactNode;
}

export interface LiveAnalyticsDashboardProps {
  refreshInterval?: number;
  availableCoins?: CoinOption[];
  apiUsageStats?: ApiUsageStats;
}

// API related types
export interface ApiProvider {
  id: string;
  name: string;
  enabled: boolean;
  baseUrl: string;
  description?: string;
  endpoints: Record<string, string>;
  requiresAuth: boolean;
  apiKey?: string;
  apiKeyName?: string;
  authMethod?: 'header' | 'query';
  defaultHeaders?: Record<string, string>;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description?: string;
  requiredParams?: string[];
}

export interface ApiUsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  lastRequest: string;
  rateLimit: number;
  rateLimitRemaining: number;
  rateLimitReset: number;
}

// Settings types
export interface SettingsFormValues {
  displayName: string;
  username: string;
  contactEmail: string;
  userLanguage: string;
  display: {
    showPortfolio: boolean;
    showBalances: boolean;
    compactMode: boolean;
  };
  theme: {
    mode: 'dark' | 'light' | 'system';
    accentColor: string;
  };
  currency: {
    defaultCurrency: SupportedCurrency;
    showConversion: boolean;
  };
  notifications: {
    enablePush: boolean;
    enableEmail: boolean;
    alertPrice: boolean;
    alertNews: boolean;
  };
  api: {
    provider: string;
    refreshInterval: number;
  };
  privacy: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
    dataCollection: boolean;
    marketingConsent: boolean;
    thirdPartySharing: boolean;
  };
  appearance: {
    densityMode: 'compact' | 'comfortable' | 'spacious';
    fontScale: number;
  };
  ticker: {
    enabled: boolean;
    position: 'top' | 'bottom';
    speed: number;
    direction: 'ltr' | 'rtl';
    coins: string[];
    showVolume: boolean;
    showPercentChange: boolean;
    autoPause: boolean;
  };
  account: {
    twoFactor: boolean;
    loginAlerts: boolean;
  };
}

export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 'blue' | 'green' | 'orange' | 'purple' | 'red';

// Portfolio benchmarking types
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioData?: any[];
  benchmarks?: string[];
  timeframe?: 'week' | 'month' | 'quarter' | 'year' | 'max';
}
