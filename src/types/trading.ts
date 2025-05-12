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
  name: string;
  symbol: string;
  price?: number;
  priceChange?: number;
  image?: string;
  marketCap?: number;
  volume?: number;
  changePercent?: number;
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
export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  profitPotential: 'low' | 'medium' | 'high';
  timeframe: 'short' | 'medium' | 'long';
  indicators: string[];
  triggers: string[];
  implementation?: string;
  recommendation?: string;
  confidence?: number;
  backtestResults?: {
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
}

// Trading strategy configuration
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
  
  // Adding missing properties reported in errors
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

// Trading account information
export interface TradingAccount {
  id: string;
  name: string;
  trades: Trade[];
  balance: number;
  currency: SupportedCurrency;
  createdAt: string;
}

// Trading form props
export interface TradingFormProps {
  onAddTrade: (trade: Trade) => void;
  defaultValues?: Partial<Trade>;
}

// Fake trading form props
export interface FakeTradingFormProps extends TradingFormProps {
  advancedMode?: boolean;
}

// Quantitative analysis props
export interface QuantitativeAnalysisProps {
  coinId: string;
  timeframe?: string;
}

// AI bot trading props
export interface AiBotTradingProps {
  tradingBot: AITradingStrategy;
  onStart: (botId: string, config: any) => void;
  onStop: (botId: string) => void;
  isRunning: boolean;
  performance?: {
    totalTrades: number;
    winRate: number;
    profitLoss: number;
    startDate: string;
  };
}

// Tax calculation interface
export interface ATOTaxCalculation {
  financialYear: string;
  taxableIncome: number;
  CGTDiscount: number;
  netCapitalGains: number;
  bracketInfo: string;
  incomeTax: number;
  medicareLevy: number;
  totalTaxLiability: number;
  taxWithheld: number;
  taxRefundOrOwed: number;
}

// Ticker settings interface
export interface TickerSettings {
  enabled: boolean;
  position: 'top' | 'bottom' | 'both';
  speed: number;
  direction: 'left' | 'right';
  autoPause: boolean;
}

// Sidebar settings interface
export interface SidebarSettings {
  enabled: boolean;
  position: 'left' | 'right';
  defaultCollapsed: boolean;
  showLabels: boolean;
  collapsed?: boolean;
}

// Widget types
export type WidgetSize = 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'full';
export type WidgetType = 
  | 'price-chart' 
  | 'portfolio-summary' 
  | 'watchlist' 
  | 'news' 
  | 'alerts' 
  | 'custom' 
  | 'trading' 
  | 'aiTrading'
  | 'aiAnalysis';

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size?: WidgetSize;
  position?: { x: number; y: number };
  customContent?: string;
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

// Add missing types for portfolio benchmarking
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioId?: string;
  timeframe?: string;
  comparisonAssets?: string[];
  showDetailedView?: boolean;
}

// Settings form values type
export interface SettingsFormValues {
  theme: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    priceAlerts: boolean;
  };
  api: {
    provider: string;
    key: string;
  };
  display: {
    showPortfolio: boolean;
    defaultTab: string;
    compactMode: boolean;
  };
}
