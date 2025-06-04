
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

// Widget and Dashboard Types
export type WidgetType = 'chart' | 'portfolio' | 'news' | 'trade' | 'performance' | 'custom';
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

// Correlation and Analysis Types
export interface CorrelationHeatmapProps {
  correlationData: number[][];
  coins: CoinOption[];
  onCoinSelect?: (coin: CoinOption) => void;
}

export interface PriceCorrelationChartProps {
  coins: CoinOption[];
}

// Risk Assessment Types
export interface RiskAssessmentResult {
  score: number;
  factors: {
    volatility: number;
    correlation: number;
    liquidity: number;
    marketCap: number;
  };
  recommendations: string[];
}

// Wallet Types
export interface WalletAccount {
  address: string;
  balance: number;
  assets: PortfolioAsset[];
  network: string;
}

export interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  isConnected: boolean;
  accounts: WalletAccount[];
}

export interface WalletConnectionProps {
  onConnect: (provider: WalletProvider) => void;
  onDisconnect: () => void;
}

// Tax and Compliance Types
export interface ATOTaxCalculation {
  capitalGains: number;
  taxableIncome: number;
  taxOwed: number;
  effectiveRate: number;
  bracket: string;
}

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  name: string;
}

export interface TaxHarvestTradeItem {
  id: string;
  symbol: string;
  quantity: number;
  currentPrice: number;
  costBasis: number;
  unrealizedLoss: number;
  recommendedAction: 'sell' | 'hold';
}

// AI Portfolio Optimization Types
export interface OptimizationSettings {
  riskTolerance: 'low' | 'medium' | 'high';
  timeHorizon: 'short' | 'medium' | 'long';
  maxDrawdown: number;
  targetReturn: number;
}

export interface PortfolioOptimizationResult {
  allocation: Record<string, number>;
  expectedReturn: number;
  expectedRisk: number;
  sharpeRatio: number;
  recommendations: string[];
}

// API Management Types
export interface ApiEndpoint {
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  rateLimit: number;
}

export interface ApiUsageStats {
  endpoint: string;
  requestCount: number;
  successRate: number;
  averageResponseTime: number;
  lastUsed: string;
}

// DeFi Types
export interface DefiProtocol {
  id: string;
  name: string;
  tvl: number;
  apy: number;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface DefiPosition {
  protocolId: string;
  asset: string;
  amount: number;
  value: number;
  apy: number;
  rewards: number;
}

// Trading Form Types
export interface FakeTradingFormProps {
  onTrade: (trade: Trade) => void;
  selectedCoin: CoinOption;
  onAddTrade: (trade: Trade) => void;
  advancedMode?: boolean;
}

export interface TradingFormProps {
  mode: 'paper' | 'live';
  onSubmit: (data: any) => void;
  selectedCoin?: CoinOption;
}

// Local AI Model Types
export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: 'prediction' | 'sentiment' | 'trading' | 'analysis';
  status: 'connected' | 'disconnected' | 'error';
  lastUsed?: string;
  performance?: {
    accuracy: number;
    latency: number;
    uptime: number;
  };
}

export interface ModelListProps {
  models: LocalModel[];
  onModelSelect: (model: LocalModel) => void;
  onModelRemove: (modelId: string) => void;
}

// Market Insights Types
export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  timeframe: string;
  relatedAssets: string[];
}

export interface MarketInsightsResponse {
  insights: MarketInsight[];
  summary: string;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
}

// Real-time Price Types
export interface RealTimePriceChartProps {
  symbol: string;
  interval: string;
  height?: number;
}

export interface RealTimePricesProps {
  symbols: string[];
  onPriceUpdate?: (symbol: string, price: number) => void;
}

// Dashboard Props Types
export interface DetachedAiTradingDashboardProps {
  onClose: () => void;
  isDetached: boolean;
  children: React.ReactNode;
}

export interface DetachableDashboardProps {
  title: string;
  onDetach: () => void;
  isDetached: boolean;
  children: React.ReactNode;
}

export interface AiBotTradingProps {
  botId: string;
  onClose?: () => void;
}

// News Ticker Types
export interface NewsTickerProps {
  items: NewsItem[];
  speed?: number;
  direction?: 'left' | 'right';
}

// Portfolio Benchmarking Types
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
  benchmarks?: {
    name: string;
    performance: number[];
    color: string;
  }[];
  timeframe?: string;
}

// Settings Types
export interface SettingsFormValues {
  theme: ColorScheme;
  currency: SupportedCurrency;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  trading: {
    defaultAmount: number;
    riskLevel: 'low' | 'medium' | 'high';
    autoTrade: boolean;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
    marketing: boolean;
  };
}
