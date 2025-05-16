
// Trading related type definitions

export interface WidgetComponentProps {
  id: string;
  type: string;
  title: string;
  onRemove: (id: string) => void;
  [key: string]: any;
}

// PricePoint definition for real-time price chart
export interface PricePoint {
  timestamp: number;
  price: number;
  volume?: number;
  date?: string; // Formatted date string
  open?: number;
  close?: number;
  high?: number;
  low?: number;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe: string;
  riskLevel: string;
  indicators: string[];
}

export interface BacktestResults {
  initialBalance: number;
  finalBalance: number;
  profit: number;
  trades: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface OpenRouterRequest {
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  max_tokens?: number;
}

// Widget-related types
export type WidgetType = 
  | 'price-chart' 
  | 'portfolio-summary' 
  | 'watchlist' 
  | 'trading' 
  | 'aiTrading' 
  | 'aiAnalysis'
  | 'price'
  | 'chart'
  | 'news'
  | 'portfolio'
  | 'alerts'
  | 'custom';

export interface TradingData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}

export interface Order {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: number;
  status: 'open' | 'filled' | 'cancelled';
}

export interface TradingStrategy {
  name: string;
  description: string;
  parameters: any;
}

export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}

// Define the TradingPosition enum
export enum TradingPosition {
  LONG = 'long',
  SHORT = 'short',
  NEUTRAL = 'neutral',
}

// Add missing types from trading.d.ts that are required by other components
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
  image?: string;
  current_price?: number;
  market_cap?: number;
  market_cap_rank?: number;
  price?: number; // Added to match usage in components
  priceChange?: number; // Added to match usage in components
}

export interface Trade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol?: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  total: number;
  timestamp: number;
  amount?: number; // Added for backward compatibility
  totalValue?: number; // Added for backward compatibility
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
  network?: string; // Added for compatibility with existing components
  address?: string; // Added for compatibility with existing components
  provider?: string; // Added for compatibility with existing components
}

export interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  supported: boolean;
  logo?: string; // Added for compatibility with existing components
}

export type TransactionStatusVariant = 'pending' | 'success' | 'warning' | 'destructive';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  data?: any;
  settings?: any;
  position?: { x: number; y: number; w: number; h: number };
}

export type WidgetSize = 'small' | 'medium' | 'large' | 'custom';

export interface DetachableDashboardProps {
  onClose: () => void;
  isDetached?: boolean;
  children?: React.ReactNode;
  initialCoinId?: string; // Added for compatibility
  refreshInterval?: number; // Added for compatibility
  darkMode?: boolean; // Added for compatibility
}

export interface LiveAnalyticsDashboardProps {
  refreshInterval?: number;
  availableCoins?: CoinOption[];
  apiUsageStats?: ApiUsageStats;
  showDetailedView?: boolean; // Added for compatibility
  initialCoinId?: string;  // Added for compatibility
  onAlertTriggered?: (alert: any) => void;  // Added for compatibility
  darkMode?: boolean;  // Added for compatibility
}

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
  usageLimit?: number; // Added for compatibility
}

export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description?: string;
  requiredParams?: string[];
  url?: string; // Added for compatibility
  responseTime?: number; // Added for compatibility
  lastUsed?: string; // Added for compatibility
  requiresAuth?: boolean; // Added for compatibility
}

export interface ApiUsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  lastRequest: string;
  rateLimit: number;
  rateLimitRemaining: number;
  rateLimitReset: number;
  maxUsage?: number; // Added for compatibility
  currentUsage?: number; // Added for compatibility
  service?: string; // Added for compatibility
}

// Update Theme type to include custom themes
export type Theme = 'light' | 'dark' | 'system' | 'default' | 'midnight-tech' | 'cyber-pulse' | 'matrix-code' | 'neon-future' | 'sunset-gradient';

export type ColorScheme = 'blue' | 'green' | 'orange' | 'purple' | 'red' | Theme;

export interface CryptoChartData {
  prices: [number, number][];
  market_caps?: [number, number][];
  total_volumes?: [number, number][];
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioData?: any[];
  benchmarks?: string[];
  timeframe?: 'week' | 'month' | 'quarter' | 'year' | 'max';
}

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

export type SupportedCurrency = 'AUD' | 'USD' | 'EUR' | 'GBP';
