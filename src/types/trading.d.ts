
export type SupportedCurrency = 'AUD' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';
export type ColorScheme = 'default' | 'neon-future' | 'sunset-gradient' | 'matrix-code' | 'cyber-pulse';
export type AlertType = 'price' | 'volume' | 'news' | 'technical' | 'portfolio';
export type AlertFrequency = 'once' | 'daily' | 'weekly' | 'always';
export type NotificationMethod = 'email' | 'push' | 'sms' | 'in-app';

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

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  name: string;
  bracket?: string;
}

export interface AuditLogEntry {
  id: string;
  action: 'TRADE_EXECUTED' | 'ANALYSIS' | 'ERROR' | 'SIGNAL_GENERATED' | 'STRATEGY_UPDATED' | 'BOT_STARTED' | 'BOT_STOPPED';
  timestamp: string;
  reasoning: string;
  signal?: {
    signal: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    entryPrice: number;
    targetPrice: number;
    stopLoss?: number;
  };
  result?: string;
  marketData?: {
    symbol: string;
    price: number;
    change24h: number;
  };
}

export interface AIBot {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'stopped';
  isActive?: boolean;
  model: string;
  createdAt: string;
  riskLevel: 'low' | 'medium' | 'high';
  maxTradeAmount: number;
  targetAssets: string[];
  performance: {
    totalReturn: number;
    winRate: number;
    trades: number;
    totalTrades: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  auditLog: AuditLogEntry[];
}

export interface PortfolioAsset {
  coinId: string;
  coinName?: string;
  amount: number;
  price: number;
  priceChange?: number;
  symbol?: string;
  name?: string;
  value?: number;
  allocation?: number;
  change24h?: number;
  changePercent24h?: number;
  assetId?: number;
  decimals?: number;
  isNative?: boolean;
  priceAUD?: number;
  valueAUD?: number;
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

export interface CryptoData extends CoinOption {}

export interface AlgorandAccount {
  address: string;
  amount: number;
  assets: any[];
  'created-at-round': number;
}

export interface AlgorandAsset {
  index: number;
  params: {
    name: string;
    'unit-name': string;
    total: number;
    decimals: number;
    creator: string;
  };
}

export interface AlgorandAssetHolding {
  'asset-id': number;
  amount: number;
  'is-frozen': boolean;
  assetId?: number;
  decimals?: number;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'breakout' | 'scalping' | 'arbitrage' | 'grid' | 'momentum' | 'pattern-recognition' | 'machine-learning' | 'sentiment' | 'hybrid' | 'custom';
  timeframe: number | string;
  parameters: any;
  riskLevel?: string;
  indicators?: string[];
  triggers?: string[];
  confidence?: number;
  tags?: string[];
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
  profitPotential?: string;
  backtestResults?: {
    winRate?: number;
    profitFactor?: number;
    sharpeRatio?: number;
    trades?: number;
    maxDrawdown?: number;
  };
}

export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  status?: 'connected' | 'disconnected' | 'error';
  isConnected?: boolean;
  lastUsed?: string;
  description?: string;
  performance?: {
    accuracy: number;
    latency: number;
    uptime: number;
    returns?: number;
    sharpeRatio?: number;
    maxDrawdown?: number;
  };
}

export interface ModelListProps {
  models: LocalModel[];
  onSelect?: (model: LocalModel) => void;
  onConnect?: (model: LocalModel) => void;
  onDisconnect?: (modelId: string) => void;
  onModelSelect?: (model: LocalModel) => void;
  onModelRemove?: (modelId: string) => void;
}

export interface TradingFormProps {
  mode: 'paper' | 'live';
  onSubmit: (data: any) => void;
  selectedCoin?: CoinOption;
}

export interface FakeTradingFormProps {
  onTrade: (trade: Trade) => void;
  selectedCoin: CoinOption;
  onAddTrade: (trade: Trade) => void;
  advancedMode?: boolean;
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

export type WidgetType = 'chart' | 'portfolio' | 'news' | 'trade' | 'performance' | 'custom' | 'price-chart' | 'portfolio-summary' | 'watchlist' | 'alerts' | 'trading' | 'aiTrading' | 'aiAnalysis';
export type WidgetSize = 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'full';

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size?: WidgetSize;
  position?: { x: number; y: number };
  config?: any;
  customContent?: string;
}

export interface RiskAssessmentResult {
  score: number;
  overallScore: number;
  diversificationScore: number;
  volatilityScore: number;
  liquidityScore: number;
  concentrationRisk: number;
  correlationRisk: number;
  factors: {
    volatility: number;
    correlation: number;
    liquidity: number;
    marketCap: number;
  };
  recommendations: string[];
  riskByAsset: Record<string, { score: number; factors: string[] }>;
}

export interface WalletAccount {
  address: string;
  balance: number;
  assets: PortfolioAsset[];
  network: string;
  provider?: string;
}

export interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  logo?: string;
  description?: string;
  isInstalled: boolean;
  isConnected: boolean;
  accounts: WalletAccount[];
}

export interface WalletConnectionProps {
  onConnect: (account: WalletAccount) => void;
  onDisconnect: () => void;
}

export interface ATOTaxCalculation {
  capitalGains: number;
  taxableIncome: number;
  totalTax: number;
  netGain: number;
  marginalRate: number;
  medicareLevy: number;
  applicableBracket: string;
  taxOwed?: number;
  effectiveRate?: number;
  bracket?: TaxBracket;
  year?: number;
  gains?: number;
  losses?: number;
  netPosition?: number;
  financialYear?: string;
  bracketInfo?: string;
  CGTDiscount?: number;
  effectiveTaxRate?: number;
  taxRefundOrOwed?: number;
  transactions?: any[];
  netCapitalGain?: number;
  taxableAmount?: number;
  incomeTax?: number;
  netCapitalGains?: number;
  totalTaxLiability?: number;
  taxWithheld?: number;
}

export interface TaxHarvestTradeItem {
  id: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  currentValue?: number;
  costBasis?: number;
  unrealizedLoss: number;
  unrealizedGainLoss: number;
  profitLoss?: number;
  purchaseDate: string;
  taxLotId?: string;
  recommendedAction?: 'sell' | 'hold';
}

export interface OptimizationSettings {
  riskTolerance: 'low' | 'medium' | 'high';
  timeHorizon: 'short' | 'medium' | 'long';
  maxDrawdown: number;
  targetReturn: number;
  objectives?: string[];
  constraints?: {
    maxPosition?: number;
    minPosition?: number;
    sectors?: string[];
    maxAssetAllocation?: number;
    minCash?: number;
  };
}

export interface PortfolioOptimizationResult {
  allocation: Record<string, number>;
  expectedReturn: number;
  expectedRisk: number;
  sharpeRatio: number;
  recommendations: string[];
  diversification?: number;
  suggestedAllocation?: Record<string, number>;
  currentAllocation?: Record<string, number>;
  rebalancingTrades?: Trade[];
}

export interface ApiEndpoint {
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  rateLimit: number;
  path?: string;
  description?: string;
  requiresAuth?: boolean;
}

export interface ApiUsageStats {
  endpoint: string;
  requestCount: number;
  successRate: number;
  averageResponseTime: number;
  lastUsed: string;
  provider?: string;
  totalCalls?: number;
  successfulCalls?: number;
  failedCalls?: number;
  avgResponseTime?: number;
  currentUsage?: number;
  maxUsage?: number;
  service?: string;
  resetTime?: string;
}

export interface DefiProtocol {
  id: string;
  name: string;
  tvl: number;
  apy: number;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
  chain?: string;
  logoUrl?: string;
  description?: string;
  risk?: string;
  url?: string;
}

export interface DefiPosition {
  protocolId: string;
  asset: string;
  amount: number;
  value: number;
  apy: number;
  rewards: any[];
  id?: string;
  protocolName?: string;
  type?: string;
  assetSymbol?: string;
  assetId?: string;
  startDate?: string;
}

export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  summary?: string;
  details?: string;
  confidence: number;
  impact?: 'low' | 'medium' | 'high';
  timeframe?: string;
  relatedAssets?: string[];
  assets?: string[];
  type?: 'bullish' | 'bearish' | 'neutral';
  relevance?: number;
  timestamp?: string;
}

export interface MarketInsightsResponse {
  insights: MarketInsight[];
  summary: string;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface RealTimePriceChartProps {
  symbol: string;
  interval: string;
  height?: number;
  coinId?: string;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins: CoinOption[];
  updateInterval?: number;
}

export interface RealTimePricesProps {
  symbols?: string[];
  onPriceUpdate?: (symbol: string, price: number) => void;
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string;
  initialCoins?: CoinOption[];
  refreshInterval?: number;
}

export interface DetachableDashboardProps {
  title: string;
  onDetach: () => void;
  isDetached: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}

export interface DetachedAiTradingDashboardProps {
  onClose: () => void;
  isDetached: boolean;
  children: React.ReactNode;
  initialCoinId?: string;
  refreshInterval?: number;
  darkMode?: boolean;
}

export interface AiBotTradingProps {
  botId: string;
  onClose?: () => void;
}

export interface ExtendedAiBotTradingProps {
  botId: string;
  strategyId?: string;
  strategyName?: string;
  onClose?: () => void;
}

export interface NewsTickerProps {
  items: NewsItem[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
  portfolioData?: Array<{
    date: string;
    portfolioValue: number;
    benchmarkValue: number;
  }>;
  benchmarks?: string[];
  timeframe?: string;
}

export interface CorrelationHeatmapProps {
  correlationData: number[][];
  coins: CoinOption[];
  onCoinSelect?: (coin: CoinOption) => void;
}

export interface PriceCorrelationChartProps {
  coins: CoinOption[];
  asset1Data?: Array<{ timestamp: string; price: number }>;
  asset2Data?: Array<{ timestamp: string; price: number }>;
  asset1Symbol?: string;
  asset2Symbol?: string;
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

export interface SettingsFormValues {
  theme: string;
  currency: string;
  language?: string;
  notifications: {
    email: boolean;
    push: boolean;
    app: boolean;
  };
  tickerSettings: TickerSettings;
  sidebarSettings: SidebarSettings;
}

export interface CryptoChartData {
  id: string;
  timestamp: string;
  price: number;
  timestamps: string[];
  prices: number[];
  volumes: number[];
  chartData: any[];
}

export interface RiskAlertData {
  type: string;
  level: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
  accountId?: string;
  symbol?: string;
  value?: number;
}
