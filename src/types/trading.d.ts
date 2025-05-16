
// Import any external types needed
import { Theme, ColorScheme } from '@/contexts/ThemeContext';

// Re-export theme types
export { Theme, ColorScheme };

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
  rank?: number;
  // For select component
  value?: string;
  label?: string;
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
  price?: number;
  priceChange?: number;
  changePercent?: number;
  image?: string;
  volume?: number;
  market_cap?: number;
  market_cap_rank?: number;
  current_price?: number;
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
  time?: number; // Add time property for compatibility with charts
}

export interface Trade {
  id: string;
  coinId: string;
  coinName: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  amount?: number;
  total: number;
  totalValue?: number;
  timestamp: number | string;
  coinSymbol?: string;
  fees?: number;
  currency?: SupportedCurrency;
  currentValue?: number;
  profitLoss?: number;
  botGenerated?: boolean;
  strategyId?: string;
  coin?: string;
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
  address?: string;
  network?: string;
  provider?: string;
  isConnected?: boolean;
}

export interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  logo?: string;
  description: string;
  supported: boolean;
  isInstalled?: boolean;
  isConnected?: boolean;
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
  customContent?: string;
  config?: any;
}

export type WidgetType = 
  'price' | 'chart' | 'news' | 'portfolio' | 'alerts' | 
  'trading' | 'aiTrading' | 'aiAnalysis' | 'custom' |
  'price-chart' | 'portfolio-summary' | 'watchlist' | 'news';
  
export type WidgetSize = 'small' | 'medium' | 'large' | 'x-large' | 'wide' | 'tall' | 'full' | 'custom';

export interface WidgetComponentProps {
  id: string;
  type: WidgetType;
  title: string;
  onRemove?: (id: string) => void;
  widget?: Widget;
  className?: string;
}

export interface DetachableDashboardProps {
  onClose: () => void;
  isDetached?: boolean;
  children?: React.ReactNode;
  initialCoinId?: string;
  refreshInterval?: number;
  darkMode?: boolean;
}

export interface LiveAnalyticsDashboardProps {
  refreshInterval?: number;
  initialCoinId?: string;
  showDetailedView?: boolean;
  darkMode?: boolean;
  availableCoins?: CoinOption[];
  apiUsageStats?: ApiUsageStats[];
  onAlertTriggered?: (alert: any) => void;
  isLoading?: boolean;
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
  currentUsage?: number;
  maxUsage?: number;
  resetTime?: string;
  isActive?: boolean;
  status?: string;
  endpoint?: string;
  usageLimit?: number;
  website?: string;
  docs?: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description?: string;
  requiredParams?: string[];
  url?: string;
  responseTime?: number;
  lastUsed?: string;
  requiresAuth?: boolean;
  parameters?: any[];
}

export interface ApiUsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  lastRequest: string;
  rateLimit: number;
  rateLimitRemaining: number;
  rateLimitReset: number;
  service?: string;
  currentUsage?: number;
  maxUsage?: number;
  endpoint?: string;
  resetTime?: string;
  provider?: string;
}

// Settings types
export interface SettingsFormValues {
  theme?: string;
  displayName?: string;
  username?: string;
  contactEmail?: string;
  userLanguage?: string;
  currency?: {
    defaultCurrency: SupportedCurrency;
    showConversion: boolean;
    showPriceInBTC?: boolean;
  };
  api?: {
    provider: string;
    key?: string;
    refreshInterval: number;
    timeout?: number;
  };
  display?: {
    showPortfolio: boolean;
    showBalances: boolean;
    defaultTab?: string;
    compactMode: boolean;
    colorScheme?: string;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
  };
  notifications?: {
    enableEmail: boolean;
    enablePush: boolean;
    alertPrice: boolean;
    alertNews: boolean;
    email?: boolean;
    push?: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
    priceAlerts?: boolean;
  };
  privacy?: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
    dataCollection: boolean;
    marketingConsent: boolean;
    thirdPartySharing: boolean;
  };
  appearance?: {
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
    densityMode?: 'compact' | 'comfortable' | 'spacious';
    fontScale?: number;
  };
  account?: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    twoFactor?: boolean;
  };
  ticker?: {
    enabled: boolean;
    position: 'top' | 'bottom';
    speed: number;
    direction: 'ltr' | 'rtl';
    autoPause: boolean;
    coins?: string[];
    showVolume?: boolean;
    showPercentChange?: boolean;
  };
}

// Portfolio benchmarking types
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioData?: any[];
  benchmarks?: string[];
  timeframe?: 'week' | 'month' | 'quarter' | 'year' | 'max';
  portfolioPerformance?: number[];
  portfolioDates?: string[];
  portfolioId?: string;
  comparisonAssets?: string[];
  showDetailedView?: boolean;
}

// Real-time prices component props
export interface RealTimePricesProps {
  coins?: CoinOption[];
  refreshInterval?: number;
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string | null;
  isLoading?: boolean;
}

// Trading position enum
export enum TradingPosition {
  LONG = 'long',
  SHORT = 'short',
  NEUTRAL = 'neutral',
}

// Alert form data type
export interface AlertFormData {
  type: string;
  frequency: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice?: number;
  isAbove?: boolean;
  enabled: boolean;
  recurring?: boolean;
  percentageChange?: number;
  notifyVia: ("email" | "app" | "push")[];
  volumeThreshold?: number;
  indicator?: string;
  condition?: string;
  value?: number;
}
