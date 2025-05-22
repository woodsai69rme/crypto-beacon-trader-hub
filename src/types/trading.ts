
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
  parameters?: Record<string, any>;
  backtestResults?: {
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  type?: string;
}

// AI strategy performance metrics
export interface AIStrategyPerformance {
  winRate?: number;
  profitLoss?: number;
  sharpeRatio?: number;
  maxDrawdown?: number;
  totalTrades?: number;
  profitFactor?: number;
  averageProfit?: number;
  accuracy?: number;
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

// Enhanced portfolio benchmarking props
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioData: any;
  benchmarks: string[];
  timeframe: string;
}

// ATO tax calculation
export interface ATOTaxCalculation {
  year: number;
  gains: number;
  losses: number;
  netPosition: number;
  taxableAmount: number;
  taxOwed: number;
  effectiveTaxRate: number;
  transactions: {
    date: string;
    asset: string;
    quantity: number;
    costBase: number;
    proceedsAmount: number;
    gainLoss: number;
    isShortTerm: boolean;
  }[];
  financialYear?: string;
  taxableIncome?: number;
  CGTDiscount?: number;
  netCapitalGains?: number;
  bracketInfo?: string;
  incomeTax?: number;
  medicareLevy?: number;
  totalTaxLiability?: number;
  taxWithheld?: number;
  taxRefundOrOwed?: number;
}

// Ticker settings
export interface TickerSettings {
  enabled: boolean;
  position: 'top' | 'bottom' | 'both';
  speed: number;
  direction: 'left' | 'right';
  autoPause: boolean;
}

// Sidebar settings
export interface SidebarSettings {
  enabled: boolean;
  position: 'left' | 'right';
  defaultCollapsed: boolean;
  showLabels: boolean;
  collapsed?: boolean;
}

// Settings form values
export interface SettingsFormValues {
  theme: string;
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    app: boolean;
  };
  tickerSettings: TickerSettings;
  sidebarSettings: SidebarSettings;
}

// Trading account
export interface TradingAccount {
  id: string;
  name: string;
  trades: Trade[];
  balance: number;
  currency: SupportedCurrency;
  createdAt: string;
  type?: string;
  provider?: string;
  assets?: PortfolioAsset[];
  lastUpdated?: string;
  isActive?: boolean;
}

// Widget types
export type WidgetType = 'chart' | 'table' | 'stats' | 'news' | 'alerts' | 'custom' | 
  'price-chart' | 'portfolio-summary' | 'watchlist' | 'trading' | 'aiTrading' | 
  'aiAnalysis' | 'market-overview' | 'crypto-news';

export type WidgetSize = 'small' | 'medium' | 'large' | 'flexible';

// Widget definition
export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size?: WidgetSize;
  position?: { x: number; y: number };
  customContent?: string;
}

// Supported currencies
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

// News ticker props
export interface NewsTickerProps {
  items: {
    id: string;
    title: string;
    source: string;
    timestamp: string;
    url: string;
  }[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
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
