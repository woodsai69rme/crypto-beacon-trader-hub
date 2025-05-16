
// Define the basic trading types for the application

export interface PricePoint {
  price: number;
  timestamp: number;
  date: string; // ISO string representation
  volume?: number;
  time?: string; // For compatibility with some charts
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'trend' | 'mean-reversion' | 'breakout' | 'momentum' | 'pattern' | 'arbitrage' | 'sentiment' | 'grid' | 'custom';
  timeframe?: string;
  pairs: string[];
  riskLevel: 'low' | 'medium' | 'high';
  aiModel: string;
  params?: Record<string, any>;
  backtest?: {
    returns: number;
    drawdown: number;
    winRate: number;
    tradesCount: number;
  }
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
  slippagePercentage?: number;
  maxTradeSize: number;
  includeFees: boolean;
  feePercentage?: number;
}

export interface AITradingBot {
  id: string;
  name: string;
  strategy: AITradingStrategy;
  pair: string;
  status: 'running' | 'paused' | 'stopped' | 'error';
  profitLoss: number;
  totalTrades: number;
  created: string;
  lastModified: string;
}

export interface WalletAccount {
  address: string;
  balance: string;
  network: string;
  provider: string;
}

export interface WalletProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  isInstalled: boolean;
  isConnected: boolean;
}

// Additional required interfaces based on build errors

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  price?: number;
  priceChangePercentage24h?: number;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  prices: PricePoint[];
  marketCap?: number[];
  volumes?: number[];
  change24h?: number;
  change7d?: number;
}

export interface Trade {
  id: string;
  pair: string;
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  date: string;
  fee?: number;
  feeAsset?: string;
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position?: { x: number; y: number };
  config?: Record<string, any>;
}

export type WidgetType = 'price' | 'chart' | 'news' | 'portfolio' | 'trades' | 'alerts' | 'ai-insights' | 'watchlist' | 'market-depth' | 'order-book';

export type WidgetSize = 'small' | 'medium' | 'large' | 'x-large';

export interface WidgetComponentProps {
  id: string;
  type: WidgetType;
  title: string;
  onRemove?: (id: string) => void;
  config?: Record<string, any>;
}

export interface ApiProvider {
  id: string;
  name: string;
  description: string;
  url: string;
  enabled: boolean;
  requiresKey: boolean;
  endpoints: ApiEndpoint[];
}

export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  description: string;
  parameters?: Record<string, string>;
  requiresAuth: boolean;
}

export interface ApiUsageStats {
  provider: string;
  requestsTotal: number;
  requestsRemaining: number;
  requestsPerSecond: number;
  cost: number;
  nextReset: string;
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioValue: number;
  portfolioHistory: { date: string; value: number }[];
  benchmarks: { id: string; name: string; history: { date: string; value: number }[] }[];
}

export interface DetachableDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  botId?: string;
}

export interface LiveAnalyticsDashboardProps {
  selectedCoins: CoinOption[];
  apiUsage: ApiUsageStats;
  refreshInterval?: number;
}
