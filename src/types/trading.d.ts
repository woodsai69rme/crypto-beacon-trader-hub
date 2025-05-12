
export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe: string;
  riskLevel?: string;
  parameters: Record<string, any>;
  assets?: string[]; // Adding assets property
  performance?: {
    winRate?: number;
    returns?: number;
    returnRate?: number;
    sharpeRatio?: number;
    drawdown?: number;
    maxDrawdown?: number;
    profitFactor?: number;
    trades?: number;
    profitLoss?: number;
  };
  risk?: number;
  return?: number;
  status?: 'active' | 'paused' | 'backtest';
}

export interface BacktestResult {
  startDate: string;
  endDate: string;
  initialBalance: number;
  finalBalance: number;
  profit: number;
  profitPercentage: number;
  maxDrawdown: number;
  winRate: number;
  trades: {
    id: string;
    timestamp: string;
    date: string;
    type: 'buy' | 'sell';
    price: number;
    amount: number;
    total: number;
    profit: number;
    profitPercentage: number;
  }[];
  sharpeRatio: number;
  profitFactor: number;
  averageProfit: number;
  averageLoss: number;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  sortinoRatio: number;
}

export interface OptimizationResult {
  id?: string;
  strategyId: string;
  parameters: Record<string, any>;
  performance: {
    profit: number;
    profitPercentage: number;
    maxDrawdown: number;
    winRate: number;
    sharpeRatio: number;
    profitFactor: number;
    totalReturn: number;
  };
  improvement: number;
  parameterValues: Record<string, any>;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
  image?: string;
}

export interface Trade {
  id: string;
  timestamp: string;
  date: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  profit?: number;
  profitPercentage?: number;
  coin: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  currency: SupportedCurrency;
  totalValue: number;
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price?: number;
  priceChange?: number;
  changePercent?: number;
  value: string;
  label: string;
  marketCap?: number;
  volume?: number;
  image?: string;
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AUD';

export interface Position {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  value: number;
  profitLoss: number;
  profitLossPercentage: number;
  openedAt: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  type: string;
  provider?: string;
  balance: number;
  initialBalance?: number;
  currency: SupportedCurrency;
  lastUpdated?: string;
  isActive?: boolean;
  assets?: PortfolioAsset[];
  positions?: Position[];
  trades?: Trade[];
  createdAt?: string;
  performance?: {
    daily: number;
    weekly: number;
    monthly: number;
    allTime: number;
  };
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  rateLimit: number;
  usageCount: number;
  lastUsed?: string;
  category: string;
  description: string;
  isActive: boolean;
  provider?: string;
}

export interface SidebarSettings {
  collapsed: boolean;
  showLabels?: boolean;
  position: 'left' | 'right';
  width: number;
}

export interface LocalModel {
  id: string;
  name: string;
  type: string;
  description: string;
  version: string;
  connected: boolean;
  parameters: Record<string, any>;
  status: 'idle' | 'running' | 'error';
  performance?: Record<string, any>;
  lastUsed?: string;
}

export interface RealTimePriceChartProps {
  coinId?: string;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins?: CoinOption[];
  updateInterval?: number;
}

export interface TradingFormProps {
  initialCoin?: CoinOption;
  onTradeSubmit?: (trade: Trade) => void;
}

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

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKey?: string;
  apiKeyName?: string;
  authMethod?: 'query' | 'header';
  defaultHeaders?: Record<string, string>;
  currentUsage: number;
  maxUsage: number;
  resetPeriod: string;
  lastReset?: string;
  priority?: number;
  isActive: boolean;
}

export interface ApiUsageMetrics {
  provider: string;
  endpoint: string;
  requestCount: number;
  successCount: number;
  errorCount: number;
  avgResponseTime: number;
  lastUsed: string;
  currentUsage: number;
  maxUsage: number;
}

export interface WalletAccount {
  address: string;
  balance: number;
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

// Settings interfaces
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

// Alert types
export interface PriceAlertFormData {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  isAbove: boolean;
  recurring?: boolean;
  percentageChange?: number;
  enabled?: boolean;
  notifyVia?: string[];
  notes?: string;
  currentPrice?: number;
  coin?: CoinOption;
  condition?: string;
  price?: number;
  repeat?: boolean;
}

export interface ParameterOptimizationProps {
  strategy: AITradingStrategy;
  onApplyParameters: (parameters: Record<string, any>) => void;
  onApplyOptimizedParameters?: (parameters: Record<string, any>) => void;
}
