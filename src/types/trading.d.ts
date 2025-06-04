
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
  timeframe: number; // in hours
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
  documentation: string;
  apiKey?: string;
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

export interface ApiUsageStats {
  provider: string;
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
}

export interface CryptoData extends CoinOption {
  // Additional properties for crypto data
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
}

export interface SettingsFormValues {
  email: string;
  username: string;
  displayName: string;
  bio: string;
  theme: string;
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    app: boolean;
  };
  tickerSettings: TickerSettings;
  sidebarSettings: SidebarSettings;
  sidebar: boolean;
  appearance: {
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
  };
  privacy: {
    dataCollection: boolean;
    marketingConsent: boolean;
  };
}
