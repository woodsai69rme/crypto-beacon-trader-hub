
export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe: string;
  riskLevel?: string;
  parameters: {
    period?: number;
    threshold?: number;
    stopLoss?: number;
    takeProfit?: number;
    useVolume?: boolean;
    indicator?: string;
    allowWeekendTrading?: boolean;
    fastPeriod?: number;
    slowPeriod?: number;
    signalPeriod?: number;
    upperBand?: number;
    lowerBand?: number;
    riskFactor?: number;
    sentimentThreshold?: number;
    sentimentTimeframe?: string;
    [key: string]: any;
  };
  assets?: string[]; // Adding assets property
  performance?: {
    winRate: number;
    returnRate?: number; // Adding returnRate
    returns?: number; // Keep returns for compatibility
    sharpeRatio: number;
    maxDrawdown?: number; // Adding maxDrawdown
    drawdown?: number; // Keep drawdown for compatibility
    profitFactor?: number;
    trades?: number;
    profitLoss?: number;
  };
  risk?: number;
  return?: number;
  status?: 'active' | 'paused' | 'backtest';
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
  id?: string;
  strategyId: string;
  parameters: Record<string, any>;
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
  parameterValues: Record<string, any>;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
  image?: string;
}

export interface Trade {
  id: string;
  timestamp: string;
  date: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  profit?: number;
  profitPercentage?: number;
  coin: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  currency: SupportedCurrency;
  totalValue: number;
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price?: number;
  priceChange?: number;
  changePercent?: number;
  value: string;
  label: string;
  marketCap?: number;
  volume?: number;
  image?: string;
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AUD';

export interface Position {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  value: number;
  profitLoss: number;
  profitLossPercentage: number;
  openedAt: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  type: string;
  provider: string;
  balance: number;
  initialBalance?: number; // Adding initialBalance
  currency: SupportedCurrency;
  lastUpdated: string;
  isActive: boolean;
  assets?: PortfolioAsset[];
  positions?: Position[]; // Adding positions
  trades?: Trade[]; // Adding trades
  createdAt?: string; // Adding createdAt
  performance?: {
    daily: number;
    weekly: number;
    monthly: number;
    allTime: number;
  };
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  rateLimit: number;
  usageCount: number;
  lastUsed?: string;
  category: string;
  description: string;
  isActive: boolean;
  provider?: string;
}

export interface SidebarSettings {
  defaultCollapsed: boolean;
  showLabels: boolean;
  position: 'left' | 'right';
  width: number;
}

export interface LocalModel {
  id: string;
  name: string;
  type: string;
  description: string;
  version: string;
  connected: boolean;
  parameters: Record<string, any>;
  status: 'idle' | 'running' | 'error';
  performance?: Record<string, any>;
  lastUsed?: string;
}

export interface RealTimePriceChartProps {
  coinId?: string;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins?: CoinOption[];
  updateInterval?: number;
}

export interface TradingFormProps {
  initialCoin?: CoinOption;
  onTradeSubmit?: (trade: Trade) => void;
}

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
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKey?: string;
  apiKeyName?: string;
  authMethod?: 'query' | 'header';
  defaultHeaders?: Record<string, string>;
  currentUsage: number;
  maxUsage: number;
  resetPeriod: string;
  lastReset?: string;
  priority?: number;
  isActive: boolean;
}

export interface ApiUsageMetrics {
  provider: string;
  endpoint: string;
  requestCount: number;
  successCount: number;
  errorCount: number;
  avgResponseTime: number;
  lastUsed: string;
  currentUsage: number;
  maxUsage: number;
}

export interface WalletAccount {
  address: string;
  balance: number;
  network: string;
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

export interface SentimentData {
  coinId: string;
  symbol: string;
  score: number;
  change24h: number;
  sources: {
    twitter: number;
    reddit: number;
    news: number;
  };
  bullishPercentage: number;
  bearishPercentage: number;
  trendingPosts?: TrendingPost[];
}

export interface TrendingPost {
  id: string;
  source: 'twitter' | 'reddit' | 'news';
  title?: string;
  content: string;
  sentiment: number;
  timestamp: string;
  url?: string;
  author?: string;
}

export interface OnChainMetrics {
  networkId: string;
  name: string;
  activeAddresses: number;
  activeAddressesChange: number;
  transactionCount: number;
  transactionCountChange: number;
  averageFee: number;
  averageFeeChange: number;
  newWallets: number;
  newWalletsChange: number;
  timestamp: string;
}

export interface WhaleTransaction {
  id: string;
  network: string;
  senderAddress: string;
  receiverAddress: string;
  amount: number;
  amountUsd: number;
  tokenSymbol: string;
  tokenName: string;
  timestamp: string;
  txHash: string;
  type: 'send' | 'receive' | 'swap';
}

export interface ExchangeArbitrage {
  id: string;
  tokenId: string;
  symbol: string;
  name: string;
  buyExchange: string;
  buyPrice: number;
  sellExchange: string;
  sellPrice: number;
  spreadPercent: number;
  volume24h: number;
  timestamp: string;
  isExecutable: boolean;
}

export interface PricePrediction {
  coinId: string;
  symbol: string;
  name: string;
  currentPrice: number;
  predictions: {
    timestamp: string;
    price: number;
    confidenceLow: number;
    confidenceHigh: number;
  }[];
  modelAccuracy: number;
  modelName: string;
  lastUpdated: string;
}

export interface ATOTaxCalculation {
  financialYear: string;
  taxableIncome: number;
  capitalGainsIncome: number;
  taxRate: number;
  medicareLevyRate: number;
  taxPayable: number;
  medicareLevy: number;
  totalTaxLiability: number;
  taxCredits: number;
  taxRefundOrOwed: number;
  incomeTax: number;
  taxWithheld: number;
  netCapitalGains: number;
  assessableIncome: number;
  bracketInfo: {
    bracket: string;
    rate: string;
  };
  capitalGains: number;
  CGTDiscount: number;
}
