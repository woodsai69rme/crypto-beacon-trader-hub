export type SupportedCurrency = 'AUD' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';
export type ColorScheme = 'default' | 'neon-future' | 'sunset-gradient' | 'matrix-code' | 'cyber-pulse';
export type AlertType = 'price' | 'volume' | 'news' | 'technical' | 'portfolio';

export interface Trade {
  id: string;
  coinId?: string;
  coinName?: string;
  coinSymbol?: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount?: number;
  quantity: number;
  price: number;
  totalValue: number;
  total?: number;
  timestamp: string;
  currency?: string;
  botGenerated?: boolean;
  strategyId?: string;
  botId?: string;
  tags?: string[];
}

export interface PortfolioAsset {
  coinId: string;
  amount: number;
  price: number;
  priceChange?: number;
  symbol?: string;
  name?: string;
  value?: number;
  allocation?: number;
  change24h?: number;
  changePercent24h?: number;
}

export interface TradingAccount {
  id: string;
  name: string;
  trades: Trade[];
  balance: number;
  currency: SupportedCurrency;
  createdAt: string;
  type: 'paper' | 'live';
  assets: PortfolioAsset[];
  isActive?: boolean;
  initialBalance?: number;
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange?: number;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
  image?: string;
  value: string;
  label: string;
  rank?: number;
}

export interface CryptoData extends CoinOption {
  // Additional properties for crypto data
}

export interface CryptoChartData extends CryptoData {
  // Chart-specific data
  chartData?: number[][];
  timestamps?: string[];
  prices?: number[];
  volumes?: number[];
}

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

export interface OptimizationSettings {
  riskTolerance: 'low' | 'medium' | 'high';
  timeHorizon?: 'short' | 'medium' | 'long';
  focusArea?: 'growth' | 'income' | 'balanced';
  objectives?: string[];
  constraints?: {
    maxAssetAllocation: number;
    minCash: number;
  };
}

export interface PortfolioOptimizationResult {
  currentAllocation: Record<string, number>;
  suggestedAllocation: Record<string, number>;
  expectedReturn: number;
  expectedRisk: number;
  sharpeRatio: number;
  diversification: number;
  rebalancingTrades: Trade[];
}

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

export interface ApiProvider {
  id: string;
  name: string;
  type: 'free' | 'paid';
  url: string;
  baseUrl?: string;
  description?: string;
  documentation: string;
  apiKey?: string;
  usageLimit?: number;
  enabled?: boolean;
  defaultHeaders?: Record<string, string>;
  requiresAuth?: boolean;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  endpoints: {
    price: string;
    markets: string;
    assets: string;
    news?: string;
  };
  isActive: boolean;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  path?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters?: Record<string, any>;
  requiresAuth?: boolean;
}

export interface ApiUsageStats {
  provider: string;
  service?: string;
  currentUsage?: number;
  maxUsage?: number;
  endpoint?: string;
  resetTime?: string;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  avgResponseTime: number;
  lastCalled: string;
  remainingQuota?: {
    day: number;
    month: number;
  };
  costEstimate?: number;
}

export interface DefiPosition {
  id: string;
  protocolId: string;
  protocolName: string;
  type: 'lending' | 'borrowing' | 'staking' | 'liquidity' | 'yield';
  assetId: string;
  assetSymbol: string;
  amount: number;
  value: number;
  apy: number;
  startDate: string;
  endDate?: string;
  rewards?: {
    assetId: string;
    assetSymbol: string;
    amount: number;
    value: number;
  }[];
}

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

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  timestamp?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  relevance?: number;
  categories?: string[];
  coins?: string[];
  isFake?: boolean;
  confidence?: number;
}

export interface WalletAccount {
  id?: string;
  address: string;
  network: string;
  balance: string | number;
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

export interface ATOTaxCalculation {
  year?: number;
  totalGains: number;
  totalLosses: number;
  netCapitalGain: number;
  taxableAmount: number;
  events: any[];
  gains?: number;
  losses?: number;
  netPosition?: number;
  taxOwed?: number;
  effectiveTaxRate?: number;
  financialYear?: string;
  taxableIncome?: number;
  CGTDiscount?: number;
  netCapitalGains?: number;
  incomeTax?: number;
  medicareLevy?: number;
  totalTaxLiability?: number;
  taxWithheld?: number;
  taxRefundOrOwed?: number;
  transactions?: Array<{
    date: string;
    asset: string;
    quantity: number;
    costBase: number;
    proceedsAmount: number;
    gainLoss: number;
    isShortTerm: boolean;
  }>;
  bracketInfo?: {
    min: number;
    max: number;
    rate: number;
    bracket: string;
  };
}

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  bracket: string;
}

export interface TaxHarvestTradeItem {
  id: string;
  symbol: string;
  quantity: number;
  costBasis: number;
  currentPrice: number;
  currentValue?: number;
  profitLoss?: number;
  purchaseDate: string;
  taxLotId: string;
}

export type WidgetType = 'custom' | 'price-chart' | 'portfolio-summary' | 'watchlist' | 'news' | 'alerts' | 'trading' | 'aiTrading' | 'aiAnalysis';
export type WidgetSize = 'small' | 'medium' | 'large';

export interface Widget {
  id: string;
  position?: { x: number; y: number };
  title: string;
  type: WidgetType;
  size: WidgetSize;
  customContent?: string;
}

export interface TickerSettings {
  enabled: boolean;
  position: 'top' | 'bottom' | 'both';
  speed: number;
  direction: 'left' | 'right';
  autoPause: boolean;
}

export interface SidebarSettings {
  enabled: boolean;
  position: 'left' | 'right';
  defaultCollapsed: boolean;
  showLabels: boolean;
  collapsed?: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  app: boolean;
  trades?: boolean;
  pricing?: boolean;
  news?: boolean;
}

export interface AppearanceSettings {
  colorScheme: string;
  compactMode: boolean;
  animationsEnabled: boolean;
  highContrastMode: boolean;
}

export interface PrivacySettings {
  showOnlineStatus?: boolean;
  sharePortfolio?: boolean;
  shareTrades?: boolean;
  dataCollection: boolean;
  marketingConsent: boolean;
  thirdPartySharing?: boolean;
}

export interface AccountSettings {
  twoFactorEnabled?: boolean;
  loginAlerts?: boolean;
}

export interface TradingPreferences {
  autoConfirm?: boolean;
  showAdvanced?: boolean;
  defaultAsset?: string;
}

export interface SettingsFormValues {
  email?: string;
  username?: string;
  displayName?: string;
  bio?: string;
  theme: string;
  currency: string;
  language?: string;
  notifications: NotificationSettings;
  tickerSettings?: TickerSettings;
  sidebarSettings?: SidebarSettings;
  sidebar?: boolean;
  appearance?: AppearanceSettings;
  privacy?: PrivacySettings;
  account?: AccountSettings;
  tradingPreferences?: TradingPreferences;
  autoSave?: boolean;
  dataRetention?: number;
  marketDataProvider?: string;
}

export interface CorrelationHeatmapProps {
  correlationData: number[][];
  coins: CoinOption[];
  onCoinSelect?: (coin: CoinOption) => void;
}

export interface PriceCorrelationChartProps {
  coins: CoinOption[];
}

export interface DetachableDashboardProps {
  onDetach?: () => void;
  isDetached?: boolean;
  initialCoinId?: string;
  refreshInterval?: number;
  onClose?: () => void;
  darkMode?: boolean;
  children?: React.ReactNode;
}

export interface LiveAnalyticsDashboardProps {
  selectedCoin?: CoinOption;
  apiStats?: ApiUsageStats;
  initialCoinId?: string;
  refreshInterval?: number;
  showDetailedView?: boolean;
  onAlertTriggered?: (alert: any) => void;
  darkMode?: boolean;
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolio: any;
  benchmarks?: any[];
  portfolioData?: any;
  timeframe?: string;
  portfolioPerformance?: number[];
  portfolioDates?: string[];
}

export interface NewsTickerProps {
  items: NewsItem[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
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
  onConnect: (model: LocalModel) => void;
  onDisconnect: (modelId: string) => void;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'custom' | 'sentiment' | 'trend-following' | 'mean-reversion' | 'breakout' | 'machine-learning' | 'multi-timeframe' | 'traditional' | 'ai-predictive' | 'hybrid';
  timeframe: number | string;
  parameters: any;
  riskLevel?: string;
  indicators?: string[];
  triggers?: string[];
  confidence?: number;
  performance?: {
    winRate?: number;
    profitFactor?: number;
    sharpeRatio?: number;
    trades?: number;
    profitLoss?: number;
    drawdown?: number;
    returns?: number;
    maxDrawdown?: number;
    accuracy?: number;
  };
  creator?: string;
  tags?: string[];
  profitPotential?: string;
  backtestResults?: {
    winRate?: number;
    profitFactor?: number;
    sharpeRatio?: number;
    trades?: number;
    maxDrawdown?: number;
  };
}

export interface AiBotTradingProps {
  botId: string;
  strategyId?: string;
  strategyName?: string;
}

export interface FakeTradingFormProps {
  onTrade: (trade: Trade) => void;
  selectedCoin?: CoinOption;
  onAddTrade?: (trade: Trade) => void;
  advancedMode?: boolean;
}

export interface TradingFormProps {
  onTrade: (coinId: string, type: 'buy' | 'sell', amount: number, price: number) => void;
  selectedCoin?: CoinOption;
  balance?: number;
  availableCoins?: CoinOption[];
  getOwnedCoinAmount?: (coinId: string) => number;
  activeCurrency?: SupportedCurrency;
  onCurrencyChange?: (currency: SupportedCurrency) => void;
  conversionRate?: number;
}

export interface RealTimePricesProps {
  initialCoins: CoinOption[];
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  refreshInterval?: number;
}

export interface RealTimePriceChartProps {
  coinId: string;
  height?: number;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins?: CoinOption[];
  updateInterval?: number;
}

export interface WalletConnectionProps {
  onConnect: (wallet: WalletAccount) => void;
  connectedWallets?: WalletAccount[];
  supportedWallets?: WalletProvider[];
}

export interface MarketInsightsResponse {
  insights: MarketInsight[];
  signals: TradingSignal[];
}

export interface BacktestResult {
  startDate: string;
  endDate: string;
  initialBalance: number;
  finalBalance: number;
  profit: number;
  profitPercentage: number;
  winRate: number;
  winningTrades: number;
  totalTrades: number;
  losingTrades: number;
  maxDrawdown: number;
  sharpeRatio: number;
  profitFactor: number;
  trades: Trade[];
  averageProfit: number;
  averageLoss: number;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  sortinoRatio: number;
}

export interface OptimizationResult {
  strategyId: string;
  parameterValues: Record<string, any>;
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
}

export interface PortfolioBenchmark {
  id: string;
  name: string;
  symbol: string;
  description: string;
  type: 'index' | 'etf' | 'crypto' | 'custom';
  data: number[];
  dates: string[];
  currentValue: number;
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}
