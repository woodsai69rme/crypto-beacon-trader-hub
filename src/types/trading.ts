
export interface Coin {
  id: string;
  name: string;
  symbol: string;
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
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

// Make CryptoData compatible with CoinOption
export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  change24h: number;
  image?: string;
  value: string;
  label: string;
}

export type SupportedCurrency = "USD" | "EUR" | "GBP" | "AUD" | "JPY" | "CAD" | "CHF";

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  totalValue: number;
  timestamp: string;
  fees?: number;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  amount: number;
  currency: SupportedCurrency;
  currentValue?: number;
  profitLoss?: number;
  botGenerated?: boolean;
  strategyId?: string;
  coin?: string;
}

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: string;
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
  | 'portfolio-balancing';

export interface AITradingStrategyConfig {
  id: string;
  name: string;
  description: string;
  type: AITradingStrategy;
  timeframe: 'short' | 'medium' | 'long';
  parameters: Record<string, any>;
  riskLevel?: 'low' | 'medium' | 'high';
  indicators?: string[];
  performance?: {
    totalReturn: number;
    winRate: number;
    trades: number;
    totalTrades: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
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
}

export interface AIBot {
  id: string;
  name: string;
  description: string;
  strategy: AITradingStrategyConfig;
  status: 'active' | 'paused' | 'stopped';
  balance: number;
  performance: {
    totalReturn: number;
    winRate: number;
    totalTrades: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BotConfig {
  strategy: AITradingStrategyConfig;
  riskLevel: 'low' | 'medium' | 'high';
  maxPositionSize: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  targetSymbols: string[];
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  endpoint?: string;
  isLocal: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: 'paper' | 'live';
  balance: number;
  currency: SupportedCurrency;
  assets: PortfolioAsset[];
  createdAt: string;
}

export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  volume24h: number;
}

export interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop';
  amount: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: string;
}

export interface Exchange {
  id: string;
  name: string;
  isConnected: boolean;
  apiKey?: string;
  apiSecret?: string;
  sandboxMode: boolean;
}

// Widget types
export type WidgetType = 'price-chart' | 'portfolio-summary' | 'watchlist' | 'news' | 'alerts' | 'trading' | 'aiTrading' | 'aiAnalysis' | 'custom';
export type WidgetSize = 'small' | 'medium' | 'large' | 'flexible' | 'wide' | 'tall' | 'full';

export interface Widget {
  id: string;
  position?: { x: number; y: number };
  title: string;
  type: WidgetType;
  size: WidgetSize;
  customContent?: string;
}

export interface CorrelationHeatmapProps {
  correlationData: number[][];
  coins: CryptoData[];
  onCoinSelect?: (coin: CryptoData) => void;
}

export interface PriceCorrelationChartProps {
  coins: CryptoData[];
  asset1Data?: Array<{ timestamp: string; price: number }>;
  asset2Data?: Array<{ timestamp: string; price: number }>;
  asset1Symbol?: string;
  asset2Symbol?: string;
}

// Risk assessment types
export interface RiskAssessmentResult {
  score: number;
  factors: string[];
  recommendation: string;
  recommendations: string[];
  overallScore: number;
  diversificationScore: number;
  volatilityScore: number;
  liquidityScore: number;
  concentrationRisk: number;
  correlationRisk: number;
  riskByAsset: Array<{
    symbol: string;
    score: number;
    factors: string[];
  }>;
}

// Wallet and account types
export interface WalletAccount {
  id: string;
  name: string;
  address: string;
  balance: number;
  provider: string;
  network: string;
}

export interface WalletProvider {
  id: string;
  name: string;
  isConnected: boolean;
  icon?: string;
  logo?: string;
  description?: string;
  isInstalled?: boolean;
  accounts?: any[];
}

export interface TradingAccount {
  id: string;
  name: string;
  type: 'paper' | 'live';
  balance: number;
  currency: SupportedCurrency;
  exchange?: string;
}

// Tax and reporting types
export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  name?: string;
  bracket?: string;
}

export interface ATOTaxCalculation {
  totalGain: number;
  totalLoss: number;
  netGain: number;
  taxOwed: number;
  events: any[];
  year: number;
  gains: number;
  losses: number;
  netPosition: number;
  financialYear: string;
  bracket: TaxBracket;
  CGTDiscount: number;
  effectiveTaxRate: number;
  taxRefundOrOwed: number;
  transactions: any[];
  
  // Optional extended fields
  totalTax?: number;
  taxableIncome?: number;
  netCapitalGains?: number;
  incomeTax?: number;
  medicareLevy?: number;
  totalTaxLiability?: number;
  taxWithheld?: number;
  capitalGains?: number;
  marginalRate?: number;
  applicableBracket?: string;
}

export interface TaxHarvestTradeItem {
  id: string;
  symbol: string;
  amount: number;
  price: number;
  type: 'buy' | 'sell';
  date: string;
  gainLoss: number;
}

// API types
export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  rateLimit: number;
  path?: string;
  description?: string;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  isEnabled: boolean;
  enabled?: boolean;
  url?: string;
  type?: 'free' | 'paid';
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  isActive?: boolean;
  apiKey?: string;
  description?: string;
  documentation?: string;
  usageLimit?: number;
  endpoints?: ApiEndpoint[];
}

export interface ApiUsageStats {
  provider?: string;
  service: string;
  requests?: number;
  errors?: number;
  responseTime?: number;
  totalCalls?: number;
  successfulCalls?: number;
  failedCalls?: number;
  avgResponseTime?: number;
  currentUsage: number;
  maxUsage: number;
  resetTime: string;
  endpoint?: string;
}

// DeFi types
export interface DefiProtocol {
  id: string;
  name: string;
  tvl: number;
  apy: number;
  risk: 'low' | 'medium' | 'high';
  category?: string;
  chain?: string;
  logoUrl?: string;
  description?: string;
  url?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface DefiPosition {
  id: string;
  protocol: string;
  protocolId?: string;
  protocolName?: string;
  type?: string;
  assetId?: string;
  assetSymbol?: string;
  asset?: string;
  amount: number;
  value: number;
  rewards: Array<{
    assetId?: string;
    assetSymbol?: string;
    amount: number;
    value: number;
  }>;
  apy?: number;
  startDate?: string;
}

export interface YieldFarmingPool {
  id: string;
  name: string;
  apy: number;
  tvl: number;
  tokens: string[];
  protocol?: string;
  tokenPair?: string;
  rewards?: string[];
  risk?: 'low' | 'medium' | 'high';
  blockchain?: string;
}

// News types
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary?: string;
  source?: string;
  isFake?: boolean;
  confidence?: number;
  tags?: string[];
  image?: string;
  author?: string;
}

export interface NewsTickerProps {
  items: NewsItem[];
  speed?: number;
  direction?: 'left' | 'right';
}

// Alert types
export interface PriceAlert {
  id: string;
  userId?: string;
  symbol: string;
  targetPrice?: number;
  targetValue?: number;
  currentValue?: number;
  condition?: 'above' | 'below';
  conditionMet?: boolean;
  isActive: boolean;
  createdAt: string;
  notificationSent?: boolean;
  triggeredAt?: string;
  type: 'price_above' | 'price_below' | 'percentage_change' | 'volume_spike';
}

// Portfolio optimization types
export interface OptimizationSettings {
  riskTolerance: 'low' | 'medium' | 'high';
  timeHorizon: string;
  targetReturn: number;
  maxDrawdown: number;
  constraints: Record<string, any>;
  objectives?: string[];
}

export interface PortfolioOptimizationResult {
  allocation: Record<string, number>;
  expectedReturn: number;
  risk: number;
  sharpeRatio: number;
  recommendations: string[];
}

// Dashboard types
export interface DetachedAiTradingDashboardProps {
  bots: AIBot[];
  onBotUpdate: (bot: AIBot) => void;
  onClose?: () => void;
  isDetached?: boolean;
  children?: React.ReactNode;
  initialCoinId?: string;
  refreshInterval?: number;
  darkMode?: boolean;
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
}
