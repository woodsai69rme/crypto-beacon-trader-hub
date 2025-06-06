
export type SupportedCurrency = 'AUD' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';

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
  total: number;
  tags?: string[];
  fees?: number;
  coin?: string;
  currentValue?: number;
  profitLoss?: number;
  botGenerated?: boolean;
  strategyId?: string;
  symbol?: string;
  quantity?: number;
}

export interface PortfolioAsset {
  coinId: string;
  amount: number;
  price: number;
  priceChange?: number;
}

export interface TradingAccount {
  id: string;
  name: string;
  trades: Trade[];
  balance: number;
  currency: SupportedCurrency;
  createdAt: string;
  assets?: PortfolioAsset[];
  type?: 'paper' | 'live';
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'breakout' | 'scalping' | 'arbitrage' | 'grid' | 'momentum' | 'pattern-recognition' | 'machine-learning' | 'sentiment' | 'hybrid' | 'custom';
  riskLevel: 'low' | 'medium' | 'high';
  profitPotential: 'low' | 'medium' | 'high';
  timeframe: number;
  indicators?: string[];
  triggers?: string[];
  parameters: Record<string, any>;
  backtestResults?: {
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
}

export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected?: boolean;
  lastUsed?: string;
  description?: string;
  performance?: {
    accuracy: number;
    returns?: number;
    sharpeRatio?: number;
    maxDrawdown?: number;
    latency: number;
    uptime: number;
  };
}

export interface ModelListProps {
  models: LocalModel[];
  onSelect?: (model: LocalModel) => void;
  onConnect?: (model: LocalModel) => void;
  onDisconnect?: (modelId: string) => void;
}

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
  volume?: number;
  marketCap?: number;
  rank?: number;
  value: string;
  label: string;
}

export interface MarketInsight {
  id: string;
  title: string;
  summary?: string;
  details: string;
  relevance?: number;
  confidence: number;
  timestamp?: string;
  assets: string[];
  type?: 'bullish' | 'bearish' | 'neutral';
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

export interface OptimizationSettings {
  riskTolerance: 'low' | 'medium' | 'high';
  timeHorizon?: 'short' | 'medium' | 'long';
  focusArea?: 'growth' | 'income' | 'balanced';
  maxDrawdown: number;
  targetReturn: number;
}

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  name: string;
}

export interface ATOTaxCalculation {
  capitalGains: number;
  taxableIncome: number;
  totalTax: number;
  netGain: number;
  marginalRate: number;
  medicareLevy: number;
  applicableBracket: string;
}

export interface TaxHarvestTradeItem {
  id: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice?: number;
  unrealizedGainLoss: number;
  unrealizedLoss?: number;
  taxLotId: string;
  purchaseDate: string;
}

export interface CorrelationHeatmapProps {
  correlationData: Array<{
    asset1: string;
    asset2: string;
    correlation: number;
  }>;
}

export interface PriceCorrelationChartProps {
  asset1Data: Array<{ timestamp: string; price: number }>;
  asset2Data: Array<{ timestamp: string; price: number }>;
  asset1Symbol: string;
  asset2Symbol: string;
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
  portfolioData: Array<{
    date: string;
    portfolioValue: number;
    benchmarkValue: number;
  }>;
}

export interface AiBotTradingProps {
  botId: string;
  strategyId?: string;
  strategyName?: string;
}

export interface DetachableDashboardProps {
  title: string;
  children: React.ReactNode;
  isDetached: boolean;
  onDetach: () => void;
}

export interface RealTimePricesProps {
  selectedCoinId: string;
  onSelectCoin: (coinId: string) => void;
  initialCoins?: CoinOption[];
  refreshInterval?: number;
}

export interface TradingFormProps {
  balance?: number;
  availableCoins?: CoinOption[];
  onTrade?: (trade: Partial<Trade>) => void;
  getOwnedCoinAmount?: (coinId: string) => number;
  activeCurrency?: SupportedCurrency;
  onCurrencyChange?: (currency: SupportedCurrency) => void;
  conversionRate?: number;
}

export interface MarketInsightsResponse {
  insights: MarketInsight[];
  signals?: TradingSignal[];
}

export interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  logo: string;
  description: string;
  isInstalled: boolean;
  isConnected: boolean;
  accounts: string[];
}

export interface WalletAccount {
  address: string;
  balance: string;
  network: string;
  provider: string;
}

export interface DefiProtocol {
  id: string;
  name: string;
  category: string;
  chain: string;
  tvl: number;
  apy: number;
  riskLevel: string;
  url: string;
  logoUrl: string;
  description: string;
}

export interface NewsTickerProps {
  articles: NewsItem[];
  className?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  relevance?: number;
  categories?: string[];
  coins?: string[];
  isFake?: boolean;
  confidence?: number;
}

export interface AIBot {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'stopped';
  isActive: boolean;
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

export interface AuditLogEntry {
  id: string;
  action: string;
  timestamp: string;
  reasoning: string;
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
  trades: any[];
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

export interface AlgorandAccountInfo {
  address: string;
  amount: number;
  assets: AlgorandAssetHolding[];
  'created-at-round': number;
  'min-balance': number;
  status: string;
}

export interface AlgorandAssetHolding {
  'asset-id': number;
  amount: number;
  'is-frozen': boolean;
}

export interface AlgorandTransaction {
  id: string;
  'confirmed-round': number;
  'round-time': number;
  sender: string;
  'tx-type': string;
  fee: number;
}
