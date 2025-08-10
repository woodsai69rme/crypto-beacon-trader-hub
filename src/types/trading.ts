export type SupportedCurrency = 'AUD' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'CHF';

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
}

// Additional interfaces for missing types
export interface DetachedAiTradingDashboardProps {
  onClose?: () => void;
  isDetached?: boolean;
  initialCoinId?: string;
  refreshInterval?: number;
  darkMode?: boolean;
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
}

export interface RealTimePriceChartProps {
  selectedCoinId: string;
  onSelectCoin: (coinId: string) => void;
  coinId?: string;
  availableCoins?: any[];
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

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
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
