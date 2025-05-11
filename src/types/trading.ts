/**
 * Type definitions for the trading components and functionality
 */

// Cryptocurrency option type for selection dropdowns and market data
export interface CoinOption {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  changePercent: number;
  image?: string;
  volume?: number;
  marketCap?: number;
  value: string;
  label: string;
}

// Cryptocurrency data type from API
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  price: number;
  priceChange: number;
  changePercent: number;
  priceChangePercentage?: number;
  marketCap?: number;
  volume?: number;
  circulatingSupply?: number;
  current_price?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  total_volume?: number;
  market_cap?: number;
}

// Props for the RealTimePriceChart component
export interface RealTimePriceChartProps {
  coinId: string;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins: CoinOption[];
  updateInterval?: number;
}

// Props for the RealTimePrices component
export interface RealTimePricesProps {
  initialCoins: CoinOption[];
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string;
  refreshInterval?: number;
}

// Props for the RealTimeTrader component
export interface RealTimeTraderProps {
  marketData: CoinOption[];
  selectedCoinId: string;
  onSelectCoin: (coinId: string) => void;
}

// Props for the LiveAnalyticsDashboard component
export interface LiveAnalyticsDashboardProps {
  initialCoinId?: string;
  refreshInterval?: number;
  showDetailedView?: boolean;
  onAlertTriggered?: (alert: any) => void;
  darkMode?: boolean;
}

// Wallet provider information
export interface WalletProvider {
  id: string;
  name: string;
  logo?: string;
  description: string;
  isInstalled: boolean;
  isConnected: boolean;
  enabled?: boolean;
  apiKey?: string;
  usageLimit?: number;
  requiresAuth?: boolean;
  authRequired?: boolean;
  baseUrl?: string;
  endpoints?: ApiEndpoint[];
  isActive?: boolean;
  website?: string;
  docs?: string;
}

// API endpoint information
export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: string;
  parameters?: any[];
  requiresAuth: boolean;
  description: string;
  url?: string;
  responseTime?: number;
  lastUsed?: string;
}

// Wallet account details
export interface WalletAccount {
  address: string;
  balance: string;
  network: string;
  provider: string;
}

// Props for the WalletConnection component
export interface WalletConnectionProps {
  onConnect: (account: WalletAccount) => void;
  supportedWallets: WalletProvider[];
}

// Trading transaction details
export interface TradeTransaction {
  id: string;
  type: 'buy' | 'sell';
  coinId: string;
  symbol: string;
  amount: number;
  price: number;
  total: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

// Order types
export type OrderType = 'market' | 'limit' | 'stop' | 'stop-limit';

// Trade order details
export interface TradeOrder {
  id: string;
  type: OrderType;
  side: 'buy' | 'sell';
  coinId: string;
  symbol: string;
  amount: number;
  price: number;
  total: number;
  timestamp: Date;
  status: 'open' | 'filled' | 'canceled' | 'expired';
  expiresAt?: Date;
  triggerPrice?: number;
}

// AI trading strategy configuration
export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'momentum' | 'sentiment' | 'custom';
  timeframe: string;
  parameters: any;
  performance?: {
    winRate?: number;
    profitFactor?: number;
    drawdown?: number;
    volatility?: number;
  };
}

// API provider information
export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
  currentUsage: number;
  maxUsage: number;
  resetTime: string;
  endpoint: string;
  status: string;
  website?: string;
  docs?: string;
  endpoints?: ApiEndpoint[];
  isActive: boolean;
  apiKey?: string;
  usageLimit: number;
  authMethod?: string;
  apiKeyName?: string;
  defaultHeaders?: Record<string, string>;
  enabled?: boolean;
  requiresAuth?: boolean;
  authRequired?: boolean;
  priority?: number;
}

// API usage metrics
export interface ApiUsageMetrics {
  provider: string;
  endpoint: string;
  requestCount: number;
  successCount: number;
  errorCount: number;
  avgResponseTime: number;
  lastUsed: string;
  service?: string;
  serviceName?: string;
  serviceId?: string;
  totalRequests?: number;
  periodRequests?: number;
  requestsLimit?: number;
  averageResponseTime?: number;
  errorRate?: number;
  lastRequested?: string;
  currentUsage: number;
  maxUsage: number;
  resetTime?: string;
}

// API usage stats
export interface ApiUsageStats {
  service: string;
  provider?: string;
  currentUsage: number;
  maxUsage: number;
  endpoint?: string;
  resetTime?: string;
  requestCount?: number;
  successCount?: number;
  errorCount?: number;
  avgResponseTime?: number;
  lastUsed?: string;
  serviceName?: string;
  serviceId?: string;
  totalRequests?: number;
  periodRequests?: number;
  requestsLimit?: number;
  averageResponseTime?: number;
  errorRate?: number;
  lastRequested?: string;
}

// Portfolio asset
export interface PortfolioAsset {
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
  price: number;
  value: number;
  allocation: number;
  change24h: number;
  changePercent24h: number;
}

// Portfolio performance metrics
export interface PortfolioPerformance {
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  allTimeHigh: number;
  allTimeLow: number;
  dataPoints: {
    timestamp: Date;
    value: number;
  }[];
}

// Currency types
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'JPY' | 'CNY';

// Trade definition
export interface Trade {
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
  fees?: number;
  coin?: string;
  total: number;
  tags?: string[];
}

// Detachable dashboard props
export interface DetachableDashboardProps {
  initialCoinId?: string;
  refreshInterval?: number;
  onClose?: () => void;
  darkMode?: boolean;
  isDetached?: boolean;
  children?: React.ReactNode;
}

// Widget related interfaces
export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size?: WidgetSize;
  position?: { x: number; y: number };
  customContent?: string;
}

export type WidgetType = 
  | 'price-chart'
  | 'portfolio-summary'
  | 'watchlist'
  | 'news'
  | 'alerts'
  | 'trading'
  | 'aiTrading'
  | 'aiAnalysis'
  | 'custom';

export type WidgetSize = 'small' | 'medium' | 'large' | 'flexible';

// Local model types
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

export interface ModelListProps {
  models: LocalModel[];
  onSelect?: (model: LocalModel) => void;
  onConnect?: (model: LocalModel) => void;
  onDisconnect?: (modelId: string) => void;
}

// Portfolio benchmarking props
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance?: number[];
  portfolioDates?: string[];
  daily?: number;
  weekly?: number;
  monthly?: number;
  yearly?: number;
  allTime?: number;
}

// Settings interfaces
export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
  onSave?: (values: Partial<SettingsFormValues>) => void;
  defaultValues?: Partial<SettingsFormValues>;
}

export interface SettingsFormValues {
  username?: string;
  displayName?: string;
  email?: string;
  theme?: string;
  bio?: string;
  language?: string;
  notifications: {
    email: boolean;
    push: boolean;
    trades: boolean;
    pricing: boolean;
    news: boolean;
  };
  tradingPreferences: {
    autoConfirm: boolean;
    showAdvanced: boolean;
    defaultAsset: string;
  };
  privacy?: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
    dataCollection: boolean;
    marketingConsent: boolean;
    thirdPartySharing: boolean;
  };
  account?: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
  appearance?: {
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
  };
  ticker?: {
    enabled: boolean;
    position: string;
    speed: number;
    direction: string;
    autoPause: boolean;
  };
  sidebar?: {
    enabled: boolean;
    position: string;
    collapsed: boolean;
    autoHide: boolean;
  };
}

import { UseFormReturn } from "react-hook-form";

// Added missing interfaces
export interface TradingAccount {
  id: string;
  name: string;
  type: string;
  provider: string;
  balance: number;
  currency: string;
  lastUpdated: string;
  isActive: boolean;
  assets?: PortfolioAsset[];
}

export interface AiBotTradingProps {
  botId: string;
  strategyId: string;
  strategyName: string;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'breakout' | 'sentiment' | 'machine-learning' | 'multi-timeframe' | 'traditional' | 'ai-predictive' | 'hybrid' | 'custom';
  timeframe: string;
  parameters: any;
  riskLevel?: string;
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

export interface QuantitativeAnalysisProps {
  symbol: string;
  timeframe: string;
  depth?: number;
}

export interface TradingFormProps {
  initialCoin?: CoinOption;
  onTradeSubmit?: (trade: Trade) => void;
}

export interface CryptoChartData {
  timestamps: number[];
  prices: number[];
  volumes: number[];
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
  bracketInfo: {
    bracket: string;
    rate: string;
  };
  capitalGains: number;
  CGTDiscount: number;
}

export interface TickerSettings {
  enabled: boolean;
  position: string;
  speed: number;
  direction: string;
  autoPause: boolean;
}

export interface SidebarSettings {
  enabled: boolean;
  position: string;
  collapsed: boolean;
  autoHide: boolean;
}

// Add the BacktestResult type to include it in the exported types
export interface BacktestResult {
  returns: number;
  winRate: number;
  trades: number;
  sharpeRatio: number;
  maxDrawdown: number;
  tradeHistory: Trade[];
}
