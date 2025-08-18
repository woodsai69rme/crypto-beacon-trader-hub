export type SupportedCurrency = 'AUD' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'CHF';

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceAUD?: number;
  priceEUR?: number; 
  priceGBP?: number;
  image?: string;
  priceChange?: number;
  changePercent?: number;
  change24h: number;
  volume?: number;
  marketCap?: number;
  rank?: number;
  value: string;
  label: string;
}

export interface PortfolioAsset {
  symbol: string;
  name: string;
  amount: number;
  price: number;
  priceAUD: number;
  value: number;
  valueAUD: number;
  change24h: number;
  allocation: number;
  coinId?: string;
}

export interface AIBot {
  id: string;
  name: string;
  description: string;
  strategy: AITradingStrategyConfig;
  status: 'active' | 'paused' | 'stopped';
  balance: number;
  model?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  maxTradeAmount?: number;
  targetAssets?: string[];
  performance: {
    totalReturn: number;
    winRate: number;
    totalTrades: number;
    trades?: number;
    maxDrawdown?: number;
    sharpeRatio?: number;
  };
  createdAt: string;
  updatedAt: string;
  auditLog?: AuditLogEntry[];
  isActive?: boolean;
  config?: BotConfig;
}

export interface AuditLogEntry {
  id: string;
  action: 'BOT_STARTED' | 'BOT_STOPPED' | 'TRADE_EXECUTED' | 'SIGNAL_GENERATED';
  timestamp: string;
  reasoning: string;
  data?: any;
}

export interface BotConfig {
  strategy: AITradingStrategy;
  riskLevel: 'low' | 'medium' | 'high';
  maxPositionSize: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  targetSymbols: string[];
  id?: string;
  name?: string;
  description?: string;
  model?: string;
  maxTradeAmount?: number;
  targetAssets?: string[];
  parameters?: any;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  endpoint?: string;
  isLocal: boolean;
}

export type AITradingStrategy = 
  | 'trend-following'
  | 'mean-reversion' 
  | 'scalping'
  | 'breakout'
  | 'grid'
  | 'arbitrage'
  | 'momentum'
  | 'pattern-recognition'
  | 'ml-prediction'
  | 'sentiment-based'
  | 'custom'
  | 'risk-weighted'
  | 'whale-tracking'
  | 'portfolio-balancing'
  | 'machine-learning'
  | 'sentiment'
  | 'hybrid'
  | 'ai-predictive'
  | 'traditional';

export interface AITradingStrategyConfig {
  id: string;
  name: string;
  description: string;
  type: AITradingStrategy;
  timeframe: string;
  parameters: any;
  riskLevel?: string;
  indicators?: string[];
  performance?: {
    winRate?: number;
    profitFactor?: number;
    sharpeRatio?: number;
    trades?: number;
    profitLoss?: number;
    drawdown?: number;
    returns?: number;
  };
  creator?: string;
  tags?: string[];
}

export interface TradingAccount {
  id: string;
  name: string;
  type: 'paper' | 'live';
  balance: number;
  currency: SupportedCurrency;
  assets: PortfolioAsset[];
  trades: Trade[];
  createdAt: string;
  isActive?: boolean;
  initialBalance?: number;
}

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
  quantity?: number;
  symbol?: string;
  total?: number;
}

export interface SystemStats {
  totalBots: number;
  activeBots: number;
  totalReturn?: number;
  avgReturn?: number;
  avgWinRate: number;
  totalTrades: number;
  systemRunning?: boolean;
}

export interface ATOTaxCalculation {
  capitalGains: number;
  taxableIncome: number;
  totalTax: number;
  netGain: number;
  marginalRate: number;
  medicareLevy: number;
  applicableBracket: string;
  totalGain: number;
  totalLoss: number;
  taxOwed: number;
  events: any[];
  shortTermGains: number;
  longTermGains: number;
  carryForwardLosses: number;
  discountEligible: number;
  assessableGain: number;
  effectiveRate: number;
  recommendations: string[];
  optimizationSuggestions: string[];
  nextYearProjection: number;
  year?: number;
  gains?: number;
  losses?: number;
  effectiveTaxRate?: number;
}

// Widget types
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

export interface Widget {
  id: string;
  position?: { x: number; y: number };
  title: string;
  type: WidgetType;
  size: WidgetSize;
  customContent?: string;
}

// Additional interfaces for missing types
export interface DetachedAiTradingDashboardProps {
  onClose?: () => void;
  isDetached?: boolean;
  initialCoinId?: string;
  refreshInterval?: number;
  darkMode?: boolean;
  children?: React.ReactNode;
}

export interface AIBotStrategy {
  id: string;
  name: string;
  description: string;
  type: AITradingStrategy;
}

export interface AdvancedAIBotConfig extends BotConfig {
  advanced: boolean;
  customParameters: Record<string, any>;
}

export interface FakeTradingFormProps {
  onAddTrade?: (trade: Trade) => void;
  advancedMode?: boolean;
  activeCurrency: SupportedCurrency;
  formatCurrency: (value: number) => string;
  availableCoins: any[];
}

export interface TradingFormProps {
  onSubmit: (trade: Trade) => void;
  availableCoins: any[];
  formatCurrency: (value: number) => string;
}

export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected: boolean;
  lastUsed?: string;
  description?: string;
  status?: 'connected' | 'disconnected' | 'error';
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

export interface MarketInsight {
  id: string;
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  title: string;
  description: string;
  timeframe: string;
  symbols: string[];
}

export interface TradingSignal {
  id: string;
  coinId: string;
  type: 'buy' | 'sell' | 'hold';
  price: number;
  confidence: number;
  source: string;
  timestamp: string;
  reason: string;
}

export interface RealTimePricesProps {
  onSelectCoin: (coinId: string) => void;
  selectedCoinId: string;
  onPriceUpdate: (symbol: string, price: number) => void;
  symbols?: string[];
  initialCoins?: CoinOption[];
  refreshInterval?: number;
}

export interface RealTimePriceChartProps {
  selectedCoinId: string;
  onSelectCoin: (coinId: string) => void;
  coinId?: string;
  availableCoins?: any[];
}

// Correlation types
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
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

// Risk Assessment
export interface RiskAssessmentResult {
  score: number;
  factors: Array<{
    name: string;
    weight: number;
    score: number;
    description: string;
  }>;
  recommendations: string[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
}

// Wallet and DeFi types
export interface WalletAccount {
  id: string;
  address: string;
  balance: number;
  currency: SupportedCurrency;
  provider: WalletProvider;
  isConnected: boolean;
}

export interface WalletProvider {
  id: string;
  name: string;
  type: 'metamask' | 'walletconnect' | 'coinbase' | 'phantom';
  isInstalled: boolean;
}

export interface DefiProtocol {
  id: string;
  name: string;
  type: 'lending' | 'dex' | 'yield-farming' | 'staking';
  tvl: number;
  apy: number;
  chain: string;
  isActive: boolean;
}

export interface DefiPosition {
  id: string;
  protocol: string;
  asset: string;
  amount: number;
  value: number;
  apy: number;
  rewards: number;
  timestamp: string;
}

export interface YieldFarmingPool {
  id: string;
  name: string;
  tokens: string[];
  apy: number;
  tvl: number;
  rewards: string[];
  lockPeriod?: number;
  riskLevel: 'low' | 'medium' | 'high';
}

// Tax types
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
  purchasePrice: number;
  currentPrice: number;
  unrealizedLoss: number;
  taxSavings: number;
  recommended: boolean;
}

// News and API types
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relevantCoins: string[];
  image?: string;
}

export interface NewsTickerProps {
  items: NewsItem[];
  speed?: number;
  direction?: 'left' | 'right';
}

export interface ApiProvider {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  endpoints: ApiEndpoint[];
  rateLimit: number;
  cost: number;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  isActive: boolean;
  rateLimit: number;
}

export interface ApiUsageStats {
  provider: string;
  service?: string;
  endpoint?: string;
  currentUsage: number;
  maxUsage: number;
  resetTime?: string;
}

export interface PriceAlert {
  id: string;
  coinId: string;
  symbol: string;
  type: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
}

// Portfolio optimization
export interface OptimizationSettings {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  timeHorizon: 'short' | 'medium' | 'long';
  targetReturn: number;
  constraints: {
    maxAssetWeight: number;
    minAssetWeight: number;
    excludeAssets: string[];
  };
}

export interface PortfolioOptimizationResult extends OptimizationResult {
  allocations: Array<{
    symbol: string;
    weight: number;
    expectedReturn: number;
    risk: number;
  }>;
  expectedReturn: number;
  risk: number;
  sharpeRatio: number;
}

// Enhanced Portfolio types
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
  portfolioData?: any[];
  benchmarks?: any[];
  timeframe?: string;
}

export interface FibonacciLevels {
  level0: number;
  level236: number;
  level382: number;
  level500: number;
  level618: number;
  level786: number;
  level1000: number;
}

export interface FibonacciAnalysisProps {
  symbol?: string;
  timeframe?: string;
}

export interface HyblockLiquidityZone {
  min: number;
  max: number;
  strength: number;
  type: 'buy' | 'sell';
}

export interface HyblockLiquidityMapProps {
  symbol?: string;
  timeframe?: string;
}

export interface AiBotTradingProps {
  botId: string;
  strategyId: string;
  strategyName: string;
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

export interface StrategyParameter {
  id: string;
  name: string;
  description: string;
  type: "number" | "boolean" | "select" | "string";
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export interface ExtendedTradingTimeframe {
  id: string;
  label: string;
  value: string;
  description: string;
  candleCount?: number;
  defaultIndicators?: string[];
}

export interface StrategyShare {
  id: string;
  strategyId: string;
  strategyName: string;
  userId: string;
  username: string;
  description: string;
  performance: {
    winRate: number;
    returns: number;
    trades: number;
  };
  likes: number;
  timestamp: string;
}

export interface QuantitativeAnalysisProps {
  symbol: string;
  timeframe: string;
  depth?: number;
}

// Audit types
export interface AuditTestResult {
  id: string;
  name: string;
  category: 'account' | 'trading' | 'ai' | 'data' | 'risk' | 'currency';
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation?: string;
}

export interface ProfitabilityAnalysis {
  initialCapital: number;
  finalCapital: number;
  totalProfit: number;
  profitPercentage: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgProfit: number;
  avgLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  totalFees: number;
  netProfit: number;
  annualizedReturn: number;
  tradingDays: number;
  wouldBeProfitable: boolean;
  riskAdjustedReturn: number;
}

export interface AuditSummary {
  totalTests: number;
  passed: number;
  failed: number;
  warnings: number;
  criticalIssues: number;
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  profitabilityAnalysis: ProfitabilityAnalysis;
  recommendations: string[];
}
