
/**
 * Type definitions for the trading components and functionality
 */

// Supported currencies
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'JPY' | 'CNY';

// Alert types
export type AlertType = 'price' | 'volume' | 'pattern' | 'technical';
export type NotificationMethod = 'email' | 'push' | 'app';
export type AlertFrequency = 'once' | 'always' | 'daily' | 'hourly';

// Tax bracket type
export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  bracket: string;
}

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
export interface CryptoData extends CoinOption {
  circulatingSupply?: number;
  current_price?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  total_volume?: number;
  market_cap?: number;
  priceChangePercentage?: number;
}

// News item interface
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  relevance?: number;
  categories?: string[];
  coins?: string[];
  isFake?: boolean;
  confidence?: number;
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
  priceChange?: number;
}

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

// Risk assessment result
export interface RiskAssessmentResult {
  overallScore: number;
  diversificationScore: number;
  volatilityScore: number;
  liquidityScore: number;
  concentrationRisk: number;
  correlationRisk: number;
  recommendations: string[];
  riskByAsset: Record<string, { score: number; factors: string[] }>;
}

// Optimization settings
export interface OptimizationSettings {
  riskTolerance: 'low' | 'medium' | 'high';
  timeHorizon?: 'short' | 'medium' | 'long';
  focusArea?: 'growth' | 'income' | 'balanced';
  constraints?: {
    maxAllocation?: number;
    minAllocation?: number;
    excludeAssets?: string[];
    maxAssetAllocation?: number;
    minCash?: number;
  };
  objectives?: string[];
}

// Portfolio optimization result
export interface PortfolioOptimizationResult {
  currentAllocation: Record<string, number>;
  suggestedAllocation: Record<string, number>;
  expectedReturn: number;
  expectedRisk: number;
  sharpeRatio: number;
  diversification: number;
  rebalancingTrades: Trade[];
}

// API endpoint
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

// API provider
export interface ApiProvider {
  id: string;
  name: string;
  type: 'free' | 'paid';
  url: string;
  documentation: string;
  apiKey?: string;
  baseUrl?: string;
  description?: string;
  usageLimit?: number;
  currentUsage?: number;
  maxUsage?: number;
  resetTime?: string;
  endpoint?: string;
  status?: string;
  website?: string;
  docs?: string;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  endpoints: ApiEndpoint[];
  isActive: boolean;
  enabled?: boolean;
  authMethod?: string;
  apiKeyName?: string;
  defaultHeaders?: Record<string, string>;
}

// API usage statistics
export interface ApiUsageStats {
  provider: string;
  service?: string;
  endpoint?: string;
  resetTime?: string;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  avgResponseTime: number;
  lastCalled: string;
  currentUsage?: number;
  maxUsage?: number;
  remainingQuota?: {
    day: number;
    month: number;
  };
  costEstimate?: number;
}

// DeFi protocol
export interface DefiProtocol {
  id: string;
  name: string;
  category: string;
  chain: string;
  tvl: number;
  apy: number;
  risk: 'low' | 'medium' | 'high';
  url: string;
  logoUrl?: string;
  description?: string;
}

// DeFi position
export interface DefiPosition {
  id: string;
  protocolId: string;
  walletAddress: string;
  asset: string;
  assetAmount: number;
  assetValue: number;
  apy: number;
  rewards?: number;
  startDate: string;
  unlockDate?: string;
  type: 'deposit' | 'borrow' | 'stake' | 'farm' | 'pool';
}

// Local AI Model
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
  onConnect: (model: LocalModel) => void;
  onDisconnect: (modelId: string) => void;
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

// Appearance settings
export interface AppearanceSettings {
  colorScheme: string;
  compactMode: boolean;
  animationsEnabled: boolean;
  highContrastMode: boolean;
}

// Privacy settings
export interface PrivacySettings {
  showOnlineStatus?: boolean;
  sharePortfolio?: boolean;
  shareTrades?: boolean;
  dataCollection: boolean;
  marketingConsent: boolean;
  thirdPartySharing?: boolean;
}

// Account settings
export interface AccountSettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
}

// Trading preferences
export interface TradingPreferences {
  autoConfirm?: boolean;
  showAdvanced?: boolean;
  defaultAsset?: string;
}

// Trading form props
export interface TradingFormProps {
  onTrade: (trade: Omit<Trade, 'id' | 'timestamp'>) => void;
  account: TradingAccount;
  selectedCoin: CoinOption;
}

export interface FakeTradingFormProps {
  onSubmit: (trade: Omit<Trade, 'id' | 'timestamp'>) => void;
  selectedCoin: CoinOption;
  account: TradingAccount;
}

// Settings form values
export interface SettingsFormValues {
  email?: string;
  username?: string;
  displayName?: string;
  bio?: string;
  theme: string;
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    app: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
  };
  tickerSettings: TickerSettings;
  sidebarSettings: SidebarSettings;
  sidebar?: boolean;
  ticker?: TickerSettings;
  appearance?: AppearanceSettings;
  privacy?: PrivacySettings;
  account?: AccountSettings;
  tradingPreferences?: TradingPreferences;
}

// Enhanced portfolio benchmarking props
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioData?: any;
  benchmarks?: string[];
  timeframe?: string;
  portfolioPerformance?: number[];
  portfolioDates?: string[];
}

// Correlation heatmap props
export interface CorrelationHeatmapProps {
  correlationData: number[][];
  coins: CoinOption[];
  onCoinSelect?: (coin: CoinOption) => void;
}

// Price correlation chart props
export interface PriceCorrelationChartProps {
  coins: CoinOption[];
  timeframe?: string;
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

// Trading signal
export interface TradingSignal {
  id: string;
  coinId: string;
  coinSymbol: string;
  type: 'buy' | 'sell';
  price: number;
  strength: number;
  timestamp: string;
  reason: string;
  suggestedActions: {
    entry: number;
    target: number;
    stopLoss: number;
  };
}

// Market insight
export interface MarketInsight {
  id: string;
  type: 'trend' | 'opportunity' | 'risk' | 'event' | 'analysis';
  title: string;
  summary: string;
  relevance: number;
  confidence: number;
  timestamp: string;
  assets: string[];
  details: string;
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

// Other interfaces for compatibility
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

export interface WalletAccount {
  address: string;
  balance: string;
  network: string;
  provider: string;
}

export interface WalletConnectionProps {
  onConnect: (account: WalletAccount) => void;
  supportedWallets: WalletProvider[];
}

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

export type OrderType = 'market' | 'limit' | 'stop' | 'stop-limit';

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
  tags?: string[];
}

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

export interface AiTradingStrategySelectorProps {
  strategies: AITradingStrategy[];
  onSelectStrategy: (strategy: AITradingStrategy) => void;
  selectedStrategy?: AITradingStrategy;
}

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

export interface DetachableDashboardProps {
  initialCoinId?: string;
  refreshInterval?: number;
  onClose?: () => void;
  darkMode?: boolean;
  isDetached?: boolean;
  children?: React.ReactNode;
}

export interface RealTimePriceChartProps {
  coinId: string;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins: CoinOption[];
  updateInterval?: number;
}

export interface RealTimePricesProps {
  initialCoins: CoinOption[];
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string;
  refreshInterval?: number;
}

export interface RealTimeTraderProps {
  marketData: CoinOption[];
  selectedCoinId: string;
  onSelectCoin: (coinId: string) => void;
}

export interface LiveAnalyticsDashboardProps {
  initialCoinId?: string;
  refreshInterval?: number;
  showDetailedView?: boolean;
  onAlertTriggered?: (alert: any) => void;
  darkMode?: boolean;
}

// Color scheme type for theme
export type ColorScheme = 'default' | 'neon-future' | 'sunset-gradient' | 'matrix-code' | 'cyber-pulse';
