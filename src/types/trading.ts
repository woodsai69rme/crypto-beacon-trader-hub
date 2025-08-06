
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
  coinId?: string;
  coinName?: string;
  coinSymbol?: string;
  amount?: number;
  currency?: SupportedCurrency;
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

// Market correlation types
export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  image?: string;
  value: string;
  label: string;
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
}

// Wallet and account types
export interface WalletAccount {
  id: string;
  name: string;
  address: string;
  balance: number;
  provider: string;
}

export interface WalletProvider {
  id: string;
  name: string;
  isConnected: boolean;
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
export interface ATOTaxCalculation {
  totalGain: number;
  totalLoss: number;
  netGain: number;
  taxOwed: number;
  events: any[];
}

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
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
export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  isEnabled: boolean;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  rateLimit: number;
}

export interface ApiUsageStats {
  provider: string;
  requests: number;
  errors: number;
  responseTime: number;
}

// DeFi types
export interface DefiProtocol {
  id: string;
  name: string;
  tvl: number;
  apy: number;
  risk: 'low' | 'medium' | 'high';
}

export interface DefiPosition {
  id: string;
  protocol: string;
  amount: number;
  value: number;
  rewards: number;
}

export interface YieldFarmingPool {
  id: string;
  name: string;
  apy: number;
  tvl: number;
  tokens: string[];
}

// News types
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface NewsTickerProps {
  items: NewsItem[];
  speed?: number;
  direction?: 'left' | 'right';
}

// Alert types
export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: string;
}

// Portfolio optimization types
export interface OptimizationSettings {
  riskTolerance: number;
  timeHorizon: string;
  constraints: Record<string, any>;
}

export interface PortfolioOptimizationResult {
  allocation: Record<string, number>;
  expectedReturn: number;
  risk: number;
  sharpeRatio: number;
}

// Dashboard types
export interface DetachedAiTradingDashboardProps {
  bots: AIBot[];
  onBotUpdate: (bot: AIBot) => void;
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
}
