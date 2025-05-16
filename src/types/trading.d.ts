
import { ReactNode } from 'react';

// Widget related types
export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size?: WidgetSize;
  position?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  content?: ReactNode;
  data?: any;
  config?: any;
  customContent?: string;
  settings?: any;
}

export type WidgetType = 
  | 'chart' 
  | 'portfolio' 
  | 'watchlist' 
  | 'news' 
  | 'alerts' 
  | 'trades' 
  | 'market-overview'
  | 'correlation'
  | 'price-chart' 
  | 'portfolio-summary'  
  | 'trading' 
  | 'aiTrading' 
  | 'aiAnalysis'
  | 'price'
  | 'table'
  | 'stats'
  | 'custom';

export type WidgetSize = 'small' | 'medium' | 'large' | 'x-large' | 'wide' | 'tall' | 'full' | 'custom';

// Crypto data related types
export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  currentPrice?: number;
  price?: number;
  priceChange?: number;
  changePercent?: number;
  priceChangePercentage24h?: number;
  marketCap?: number;
  volume?: number;
  totalVolume?: number;
  high24h?: number;
  low24h?: number;
  market_cap?: number;
  market_cap_rank?: number;
  image?: string;
  current_price?: number;
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price?: number;
  priceChange?: number;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
  image?: string;
  value?: string;
  label?: string;
  rank?: number;
}

// Price chart data types
export interface PricePoint {
  timestamp: number;
  price: number;
  volume?: number;
  date?: string;
  open?: number;
  close?: number;
  high?: number;
  low?: number;
  time?: number;
}

// Transaction/Trade related types
export interface Trade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol?: string;
  type: 'buy' | 'sell';
  price: number;
  amount?: number;
  quantity?: number;
  date?: string;
  timestamp?: number | string;
  status?: 'pending' | 'completed' | 'failed';
  fee?: number;
  total?: number;
  totalValue?: number;
  currency?: SupportedCurrency;
  currentValue?: number;
  profitLoss?: number;
  botGenerated?: boolean;
  strategyId?: string;
  fees?: number;
  tags?: string[];
}

export type TransactionStatusVariant = 'pending' | 'success' | 'warning' | 'destructive' | 'completed' | 'failed' | 'cancelled';

// API related types
export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
  documentation?: string;
  endpoints?: ApiEndpoint[] | Record<string, string>;
  requiresKey?: boolean;
  requiresAuth?: boolean;
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
  enabled?: boolean;
}

export interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description?: string;
  requiresAuth?: boolean;
  rateLimit?: number;
  url?: string;
  responseTime?: number;
  lastUsed?: string;
  requiredParams?: string[];
  parameters?: any[];
  name?: string;
}

export interface ApiUsageStats {
  totalRequests?: number;
  successfulRequests?: number;
  failedRequests?: number;
  lastRequest?: string;
  rateLimit?: number;
  rateLimitRemaining?: number;
  rateLimitReset?: number;
  service?: string;
  provider?: string;
  currentUsage?: number;
  maxUsage?: number;
  endpoint?: string;
  resetTime?: string;
  totalCalls?: number;
  successfulCalls?: number;
  failedCalls?: number;
  latency?: number;
  lastUpdated?: string;
}

// Dashboard and analytics props
export interface LiveAnalyticsDashboardProps {
  selectedCoin?: CoinOption;
  apiUsage?: ApiUsageStats[];
  refreshInterval?: number;
  availableCoins?: CoinOption[];
  initialCoinId?: string;
  showDetailedView?: boolean;
  onAlertTriggered?: (alert: any) => void;
  darkMode?: boolean;
}

export interface DetachableDashboardProps {
  position?: 'left' | 'right' | 'float';
  defaultOpen?: boolean;
  onClose?: () => void;
  isDetached?: boolean;
  children?: React.ReactNode;
  initialCoinId?: string;
  refreshInterval?: number;
  darkMode?: boolean;
}

// Wallet and provider types
export interface WalletProvider {
  id: string;
  name: string;
  logo?: string;
  icon?: string;
  supportedChains?: string[];
  description?: string;
  isInstalled?: boolean;
  isConnected?: boolean;
  supported?: boolean;
}

export interface WalletAccount {
  id?: string;
  address: string;
  balance: number | string;
  provider?: string;
  network?: string;
  name?: string;
  assets?: Array<{
    coinId: string;
    name: string;
    symbol: string;
    quantity: number;
    averagePrice: number;
  }>;
  isConnected?: boolean;
}

// Theming types
export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 
  | 'blue'
  | 'green'
  | 'orange'
  | 'purple'
  | 'red'
  | 'default'
  | 'midnight-tech'
  | 'cyber-pulse'
  | 'matrix-code'
  | 'neon-future'
  | 'sunset-gradient';

// Supported currencies
export type SupportedCurrency = 'AUD' | 'USD' | 'EUR' | 'GBP';

// Trading position enum
export enum TradingPosition {
  LONG = 'long',
  SHORT = 'short',
  NEUTRAL = 'neutral',
}

// Settings form values
export interface SettingsFormValues {
  displayName?: string;
  username?: string;
  contactEmail?: string;
  userLanguage?: string;
  theme?: Theme;
  display?: {
    showPortfolio: boolean;
    showBalances?: boolean;
    defaultTab?: string;
    compactMode: boolean;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
    colorScheme?: string;
  };
  currency?: {
    defaultCurrency: SupportedCurrency;
    showConversion: boolean;
    showPriceInBTC?: boolean;
  };
  notifications?: {
    enablePush: boolean;
    enableEmail: boolean;
    alertPrice: boolean;
    alertNews: boolean;
    email?: boolean;
    push?: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
    priceAlerts?: boolean;
  };
  api?: {
    provider: string;
    key: string;
    refreshInterval?: number;
    timeout?: number;
  };
  privacy?: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
    dataCollection: boolean;
    marketingConsent: boolean;
    thirdPartySharing: boolean;
    publicProfile?: boolean;
  };
  appearance?: {
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
  };
  account?: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
  ticker?: {
    enabled: boolean;
    position: 'top' | 'bottom';
    speed: number;
    direction: 'ltr' | 'rtl';
    coins: string[];
    showVolume: boolean;
    showPercentChange: boolean;
    autoPause: boolean;
  };
  tradingPreferences?: {
    autoConfirm: boolean;
    showAdvanced?: boolean;
    defaultAsset?: string;
    defaultTradeSize?: number;
    riskLevel?: 'low' | 'medium' | 'high';
    tradingStrategy?: string;
    defaultLeverage?: number;
    showPnL?: boolean;
    defaultTimeframe?: string;
  };
  exportFormat?: "CSV" | "JSON" | "PDF";
  layout?: string;
  sidebar?: {
    expanded: boolean;
    position: "left" | "right";
    visible: boolean;
  };
  bio?: string;
}

// AI Trading types
export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe?: string;
  riskLevel: 'low' | 'medium' | 'high';
  parameters?: Record<string, any>;
  indicators?: string[];
  performance?: {
    winRate?: number;
    profitFactor?: number;
    sharpeRatio?: number;
    trades?: number;
    profitLoss?: number;
    drawdown?: number;
    returns?: number;
  };
  creator?: string;
  tags?: string[];
}

export interface AiBotTradingProps {
  botId: string;
  strategyId: string;
  strategyName: string;
}

export interface AITradingBot {
  id: string;
  name: string;
  description: string;
  strategy: AITradingStrategy;
  pair?: string;
  status: 'active' | 'paused' | 'stopped';
  createdAt: string;
  lastRun?: string;
  profitLoss?: number;
  totalTrades?: number;
  performance?: {
    winRate: number;
    trades: number;
    profit: number;
  };
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

export interface FakeTradingFormProps {
  onTrade: (trade: Trade) => void;
  availableCoins?: CoinOption[];
  initialCoinId?: string;
  advancedMode?: boolean;
}

export interface RealTimePricesProps {
  coins?: CoinOption[];
  refreshInterval?: number;
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string;
  isLoading?: boolean;
  initialCoins?: CoinOption[];
}

export interface ModelListProps {
  models: LocalModel[];
  onSelect: (model: LocalModel) => void;
  onDelete?: (modelId: string) => void;
  selectedModelId?: string;
  onConnect?: (model: LocalModel) => void;
  onDisconnect?: (modelId: string) => void;
}

export interface ModelPerformanceProps {
  model: LocalModel;
}

export interface WalletConnectionProps {
  onConnect: (account: WalletAccount) => void;
  supportedWallets: WalletProvider[];
}

export interface TradingFormProps {
  balance: number;
  availableCoins: CoinOption[];
  onTrade: (coinId: string, type: 'buy' | 'sell', amount: number, price: number) => void;
  getOwnedCoinAmount: (coinId: string) => number;
  activeCurrency: SupportedCurrency;
  onCurrencyChange?: (currency: SupportedCurrency) => void;
  conversionRate?: number;
}

// TradingAccount type
export interface TradingAccount {
  id: string;
  name: string;
  address: string;
  balance: number;
  network: string;
  trades?: Trade[];
  createdAt?: string;
  type?: string;
  provider?: string;
  assets?: Array<{
    coinId: string;
    name: string;
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice?: number;
  }>;
  isActive?: boolean;
  lastUpdated?: string;
  currency?: SupportedCurrency;
  initialBalance?: number;
}

// Import and re-export alert types
import { AlertData, AlertFormData, PriceAlert, VolumeAlert, TechnicalAlert, AlertFrequency, PriceAlertFormData, VolumeAlertFormData, TechnicalAlertFormData } from './alerts';
export type { AlertData, AlertFormData, PriceAlert, VolumeAlert, TechnicalAlert, AlertFrequency, PriceAlertFormData, VolumeAlertFormData, TechnicalAlertFormData };
