
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
  currentUsage: number;
  maxUsage: number;
  resetTime: string;
  endpoint: string;
  status: 'ok' | 'warning' | 'critical';
  description?: string;
  enabled?: boolean;
  apiKey?: string;
  usageLimit?: number;
  requiresAuth?: boolean;
  authRequired?: boolean;
  baseUrl?: string;
  endpoints?: ApiEndpoint[];
  isActive?: boolean;
}

// API usage metrics
export interface ApiUsageMetrics {
  provider: string;
  currentUsage: number;
  limit: number;
  resetTime: string;
  endpoint: string;
}

// API usage stats
export interface ApiUsageStats {
  provider: string;
  endpoint: string;
  requestCount: number;
  successCount: number;
  errorCount: number;
  avgResponseTime: number;
  lastUsed: string;
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
}

// Detachable dashboard props
export interface DetachableDashboardProps {
  initialCoinId?: string;
  refreshInterval?: number;
  onClose?: () => void;
  darkMode?: boolean;
}
