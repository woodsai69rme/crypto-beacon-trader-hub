// Define basic trading types
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
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
  symbol: string;
  name: string;
  price?: number;
  currentPrice?: number;
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
  volume_24h?: number;
  fully_diluted_valuation?: number;
}

export interface CryptoChartData {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
}

export interface Trade {
  id: string;
  coinId: string;
  coinName: string;
  type: 'buy' | 'sell';
  price: number;
  quantity?: number;
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
  tags?: string[];
  status?: string;
}

export interface PricePoint {
  timestamp: number;
  price: number;
  volume?: number;
  date?: string;
  open?: number;
  close?: number;
  high?: number;
  low?: number;
  time?: number; // Add time property for compatibility
}

export interface WalletAccount {
  id?: string;
  name?: string;
  address: string;
  balance: number | string;
  currency?: string;
  assets?: Array<{
    coinId: string;
    name: string;
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice?: number;
  }>;
  network?: string;
  provider?: string;
  isConnected?: boolean;
}

export interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  supported: boolean;
  logo?: string;
  isInstalled?: boolean;
  isConnected?: boolean;
  supportedChains?: string[];
}

export interface TradingAccount {
  id: string;
  name: string;
  trades?: Trade[];
  balance: number;
  currency: string;
  createdAt?: string;
  address: string;
  network: string;
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
  initialBalance: number;
}

export type TransactionStatusVariant = 'pending' | 'success' | 'warning' | 'destructive';

// Dashboard & widgets
export type WidgetType = 
  | 'price-chart' 
  | 'portfolio-summary' 
  | 'watchlist' 
  | 'trading' 
  | 'aiTrading' 
  | 'aiAnalysis'
  | 'news'
  | 'alerts'
  | 'price'
  | 'chart'
  | 'portfolio'
  | 'custom';

export type WidgetSize = 'small' | 'medium' | 'large' | 'x-large' | 'wide' | 'tall' | 'full' | 'custom';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  data?: any;
  settings?: any;
  customContent?: string;
  position?: { x: number; y: number; w: number; h: number };
  config?: any;
}

export interface WidgetComponentProps {
  id: string;
  type: WidgetType;
  title: string;
  onRemove?: (id: string) => void;
  config?: any;
  widget?: Widget;
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
  provider?: string;
  currentUsage?: number;
  maxUsage?: number;
  endpoint?: string;
  resetTime?: string;
}

// Dashboard props
export interface DetachableDashboardProps {
  onClose?: () => void;
  isDetached?: boolean;
  children?: React.ReactNode;
  initialCoinId?: string;
  refreshInterval?: number;
  darkMode?: boolean;
  position?: 'left' | 'right' | 'float';
  defaultOpen?: boolean;
}

export interface LiveAnalyticsDashboardProps {
  refreshInterval?: number;
  availableCoins?: CoinOption[];
  apiUsageStats?: ApiUsageStats[];
  initialCoinId?: string;
  showDetailedView?: boolean;
  onAlertTriggered?: (alert: any) => void;
  darkMode?: boolean;
  selectedCoin?: CoinOption;
  apiUsage?: ApiUsageStats[];
}

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
  theme: Theme;
  display?: {
    showPortfolio: boolean;
    showBalances?: boolean;
    compactMode: boolean;
    defaultTab?: string;
    colorScheme?: string;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
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
    refreshInterval?: number;
    key?: string;
    timeout?: number;
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
    densityMode?: 'compact' | 'comfortable' | 'spacious';
    fontScale?: number;
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
  };
  account?: {
    twoFactor?: boolean;
    loginAlerts?: boolean;
    twoFactorEnabled?: boolean;
  };
  ticker?: {
    enabled: boolean;
    position: 'top' | 'bottom';
    speed: number;
    direction: 'ltr' | 'rtl';
    coins?: string[];
    showVolume?: boolean;
    showPercentChange?: boolean;
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
  language?: string;
  email?: string;
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
    totalTrades?: number;
    averageProfit?: number;
    maxDrawdown?: number;
    accuracy?: number;
    returns?: number;
    sharpeRatio?: number;
  };
}

export interface AITradingBot {
  id: string;
  name: string;
  description: string;
  strategy: AITradingStrategy;
  status: 'active' | 'paused' | 'stopped';
  createdAt: string;
  lastRun?: string;
  model?: string;
  strategyId?: string;
  strategyName?: string;
  asset?: string;
  accuracy?: number;
  successRate?: number;
  trades?: number;
  totalTrades?: number;
  performance?: {
    winRate: number;
    trades: number;
    profit: number;
  };
  profitLoss?: number;
}

export interface AIStrategyParameters {
  buySignalThreshold: number;
  sellSignalThreshold: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  timeframe: string;
  maxPositions: number;
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

export interface ModelListProps {
  models: LocalModel[];
  onSelect: (model: LocalModel) => void;
  onDelete?: (modelId: string) => void;
  selectedModelId?: string;
  onConnect?: (model: LocalModel) => void;
  onDisconnect?: (modelId: string) => void;
}

export interface FakeTradingFormProps {
  onTrade: (trade: Trade) => void;
  availableCoins: CoinOption[];
  initialCoinId?: string;
  advancedMode?: boolean; // Added this property
}

export interface RealTimePricesProps {
  coins?: CoinOption[];
  refreshInterval?: number;
}

export interface RealTimePriceChartProps {
  coinId: string;
  timeRange: string;
  height?: number;
  width?: string;
  showControls?: boolean;
}

export interface AiBotTradingProps {
  botId: string;
  strategyId: string;
  strategyName: string;
}

export interface WalletConnectionProps {
  onWalletConnected: (wallet: WalletAccount) => void;
}

export interface TradingFormProps {
  onTrade: (trade: Trade) => void;
  initialCoinId?: string;
  availableCoins?: CoinOption[];
}

// Additional types for missing interfaces
export interface AIModelConfig {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  apiKey?: string;
  parameters?: Record<string, any>;
}

export interface BacktestResults {
  totalTrades: number;
  winRate: number;
  profitLoss: number;
  sharpeRatio: number;
  maxDrawdown: number;
  trades: any[];
}

export interface OptimizationResult {
  parameters: Record<string, any>;
  performance: {
    winRate: number;
    profitLoss: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

export interface PortfolioBenchmark {
  name: string;
  data: number[];
  color: string;
}

export interface FibonacciAnalysisProps {
  coinId: string;
  timeRange?: string;
  data?: PricePoint[];
  height?: number;
  width?: string;
}

export interface FibonacciLevels {
  level: number;
  value: number;
  color: string;
}

export interface HyblockLiquidityMapProps {
  coinId: string;
  timeframe?: string;
  width?: string;
  height?: number;
  showControls?: boolean;
}

export interface HyblockLiquidityZone {
  priceRange: [number, number];
  volume: number;
  type: 'buy' | 'sell';
  strength: number;
}
