
// Common types for trading features
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
  image?: string;
  value: string; // For select component
  label: string; // For select component
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange?: number;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
  image?: string;
}

// Interface for trading analysis types
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export interface RealTimePricesProps {
  initialCoins: CoinOption[];
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string;
  refreshInterval?: number;
}

export interface ApiProvider {
  id: string;
  name: string;
  enabled: boolean;
  apiKey?: string;
  rate_limit: number;
  endpoints: string[];
  priority: number;
  baseUrl: string;
  requiresAuth?: boolean;
  authMethod?: 'header' | 'query';
  apiKeyName?: string;
  defaultHeaders?: Record<string, string>;
}

export interface ApiUsageStats {
  service: string;
  currentUsage: number;
  maxUsage: number;
  endpoint: string;
  resetTime: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  source: string;
  url: string;
  timestamp: string;
  sentiment?: number;
  topics?: string[];
  image?: string;
}

export interface TaxBracket {
  bracket: number;
  rate: number;
  description: string;
}

export interface PortfolioAsset {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  amount: number;
  averagePrice: number;
  value: number;
  price: number;
  changePercent?: number;
  allocation?: number;
  change24h?: number;
  changePercent24h?: number;
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'paper' | 'live' | 'exchange';
  assets: PortfolioAsset[];
  createdAt: string;
  isActive: boolean;
  trades: Trade[];
  exchange?: string;
  apiKey?: string;
  apiSecret?: string;
}

// Added for EnhancedPortfolioBenchmarkingProps
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioData: any;
  benchmarks: string[];
  timeframe: string;
  portfolioPerformance: number[];
  portfolioDates: string[];
}

// For settings components
export interface SettingsComponentProps {
  form: any;
}

// For settings form values with privacy and account sections
export interface SettingsFormValues {
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
  privacy?: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
    dataCollection?: boolean;
  };
  account?: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
  tradingPreferences?: {
    autoConfirm: boolean;
    showAdvanced: boolean;
    defaultAsset: string;
  };
  appearance?: {
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
  };
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

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'JPY' | 'CNY';

// Added for compatibility with missing types
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

export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: string;
  isConnected: boolean;
  description: string;
  performance?: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  lastUsed?: string;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'breakout' | 'sentiment' | 'machine-learning' | string;
  timeframe: string;
  parameters: Record<string, any>;
  riskLevel: string;
  creator: string;
  tags: string[];
}

export interface BacktestResult {
  profit: number;
  profitPercentage: number;
  winRate: number;
  winningTrades: number;
  totalTrades: number;
  maxDrawdown: number;
  sharpeRatio: number;
  profitFactor: number;
  trades: any[];
}

export interface OptimizationResult {
  parameterValues: Record<string, any>;
  improvement: number;
  performance: {
    profit: number;
    maxDrawdown: number;
    sharpeRatio: number;
    winRate: number;
  };
}

// Portfolio optimization types
export interface OptimizationSettings {
  riskTolerance: 'low' | 'medium' | 'high';
  timeHorizon: 'short' | 'medium' | 'long';
  objectives: string[];
  constraints: Record<string, any>;
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
  strength: number;
  timestamp: string;
  source: string;
  reason: string;
  indicators: Record<string, number>;
  price: number;
  suggestedActions: {
    action: 'buy' | 'sell' | 'hold' | 'watch';
    entry?: number;
    target?: number;
    stopLoss?: number;
  };
}

export interface RiskAssessmentResult {
  overallScore: number;
  diversificationScore: number;
  volatilityScore: number;
  liquidityScore: number;
  concentrationRisk: number;
  correlationRisk: number;
  recommendations: string[];
  riskByAsset: Record<string, {
    score: number;
    factors: string[];
  }>;
}

export interface MarketInsight {
  id: string;
  type: 'trend' | 'event' | 'opportunity' | 'risk' | 'analysis';
  title: string;
  summary: string;
  content: string;
  relevance: number;
  timestamp: string;
  assets: string[];
  tags: string[];
  source: string;
  confidence: number;
}

export interface DefiProtocol {
  id: string;
  name: string;
  category: 'lending' | 'dex' | 'yield' | 'bridge' | 'staking' | 'other';
  apy?: number;
  tvl?: number;
  chain: string;
  url: string;
  logoUrl?: string;
  description?: string;
}

export interface DefiPosition {
  id: string;
  protocolId: string;
  walletAddress: string;
  asset: string;
  assetAmount: number;
  assetValue: number;
  apy?: number;
  rewards?: number;
  startDate: string;
  unlockDate?: string;
  type: 'deposit' | 'borrow' | 'farm' | 'stake' | 'pool' | 'other';
}

export interface NFTAsset {
  id: string;
  name: string;
  collection: string;
  tokenId: string;
  contractAddress: string;
  chain: string;
  imageUrl?: string;
  lastPrice?: number;
  estimatedValue?: number;
  acquiredAt?: string;
  metadata?: Record<string, any>;
}

export interface StakingPosition {
  id: string;
  asset: string;
  amount: number;
  validator?: string;
  delegator?: string;
  apy: number;
  rewards: number;
  startDate: string;
  unlockDate?: string;
  chain: string;
  status: 'active' | 'unbonding' | 'inactive';
}

export interface ExchangeAccount {
  id: string;
  name: string;
  exchange: 'binance' | 'coinbase' | 'kraken' | 'kucoin' | 'bybit' | string;
  apiKey: string;
  secretKey: string;
  passphrase?: string;
  connected: boolean;
  lastSync?: string;
  assets?: PortfolioAsset[];
  balances?: Record<string, number>;
}

export interface OnChainActivity {
  id: string;
  address: string;
  chain: string;
  type: 'transfer' | 'swap' | 'approve' | 'mint' | 'burn' | 'other';
  hash: string;
  timestamp: string;
  asset: string;
  amount: number;
  counterparty?: string;
  fee?: number;
  status: 'confirmed' | 'pending' | 'failed';
  blockNumber?: number;
}

export interface WhaleActivity {
  id: string;
  address: string;
  label?: string;
  type: 'buy' | 'sell' | 'transfer' | 'mint' | 'burn' | 'other';
  asset: string;
  amount: number;
  value: number;
  timestamp: string;
  chain: string;
  txHash: string;
  impact: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface LiquidityData {
  id: string;
  pair: string;
  exchange: string;
  depth: number;
  spreadPercentage: number;
  buyDepth: number;
  sellDepth: number;
  volume24h: number;
  timestamp: string;
  orderBook?: {
    bids: [number, number][]; // [price, amount]
    asks: [number, number][]; // [price, amount]
  };
}
