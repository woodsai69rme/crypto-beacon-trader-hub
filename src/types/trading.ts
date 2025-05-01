
import { ReactNode } from "react";

export type Trade = {
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
  tags?: string[];
  coin?: {
    name: string;
    symbol: string;
    image?: string;
  };
};

export type TradingAccount = {
  id: string;
  name: string;
  balance: number;
  initialBalance: number;
  trades: Trade[];
  currency: string;
  createdAt: string;
  type?: 'standard' | 'ai' | 'demo';
};

export type PortfolioBenchmark = {
  id: string;
  name: string;
  symbol: string;
  color: string;
  type: 'index' | 'stock' | 'crypto' | 'custom';
  performance: number[];
  lastUpdated: string;
  data: { date: string; value: number; performance: number }[];
};

export type WatchlistItem = {
  id: string;
  coinId: string;
  name: string;
  symbol: string;
  price: number;
  priceChangePercentage24h: number;
  addedAt: string;
  alertSettings?: {
    highPrice?: number;
    lowPrice?: number;
    percentageChangeThreshold?: number;
    enabled: boolean;
  };
};

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position: { x: number; y: number };
  config?: any;
  lastUpdated?: string;
  customContent?: string; 
}

export type WidgetType = 
  | 'price-chart' 
  | 'portfolio-summary' 
  | 'watchlist' 
  | 'news' 
  | 'trade-history'
  | 'market-overview'
  | 'performance-metrics'
  | 'alerts'
  | 'portfolio'
  | 'chart'
  | 'trading'
  | 'aiTrading'
  | 'multiExchange'
  | 'education'
  | 'community'
  | 'aiAnalysis'
  | 'custom';

export type WidgetSize = 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'full';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  roles: string[];
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: string;
  marketView: string;
  defaultCoin: string;
  notifications: {
    email: boolean;
    push: boolean;
    priceAlerts: boolean;
  };
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange?: number;
  changePercent?: number;
  image?: string;
  volume?: number;
  marketCap?: number;
  value: string;
  label: string;
  priceAUD?: number;
  priceEUR?: number;
  priceGBP?: number;
}

export interface CryptoSearchProps {
  onSearch: (query: string) => void;
  recentSearches?: string[];
}

export interface DashboardHeaderProps {
  user: User;
  onSearch: (query: string) => void;
  unreadNotifications: number;
  portfolioValue: number;
  dailyChange: number;
  dailyChangePercent: number;
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

export type AITradingStrategy = {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'breakout' | 'sentiment' | 'machine-learning' | 'multi-timeframe' | 'traditional' | 'ai-predictive' | 'hybrid' | 'custom';
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
};

export interface ApiKeyInfo {
  id: string;
  name: string;
  key: string;
  service: string;
  provider: string;
  createdAt: string;
  lastUsed?: string;
  isValid: boolean;
  isActive: boolean;
  permissions: string[];
}

export interface ApiUsageStats {
  service: string;
  currentUsage: number;
  maxUsage: number;
  resetTime: string;
  endpoint?: string;
  costPerCall?: number;
  remainingBalance?: number;
}

export interface ATOTaxRate {
  year: number;
  minIncome: number;
  maxIncome: number | null;
  baseAmount: number;
  marginRate: number;
}

export interface ATOTaxCalculation {
  year: number;
  taxYear: string;
  assessableIncome: number;
  taxableIncome: number;
  bracketInfo: ATOTaxRate;
  taxPayable: number;
  taxWithheld: number;
  taxRefundOwed: number;
  medicareLevyPayable: number;
  medicareLevySurcharge: number;
  helpDebtRepayment: number;
  totalTaxPayable: number;
}

export type SupportedCurrency = "USD" | "AUD" | "EUR" | "GBP";

export type CurrencySymbol = "$" | "€" | "£";

export type CurrencyRates = {
  USD_AUD: number;
  USD_EUR: number;
  USD_GBP: number;
  AUD_USD: number;
  AUD_EUR: number;
  AUD_GBP: number;
  EUR_USD: number;
  EUR_AUD: number;
  EUR_GBP: number;
  GBP_USD: number;
  GBP_AUD: number;
  GBP_EUR: number;
};

export interface ApiProvider {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  website: string;
  docs: string;
  authRequired: boolean;
  apiKey: string;
  enabled: boolean;
  requiresAuth: boolean;
  apiKeyName: string;
  authMethod: "header" | "query" | "none";
  priority: number;
  endpoints: ApiEndpoint[];
  defaultHeaders: Record<string, string>;
  rateLimit: number;
  tier: "free" | "basic" | "premium";
}

export interface ApiEndpoint {
  id: string;
  name: string;
  description: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, string>;
  requiresAuth?: boolean;
}

export type RealTimePriceChartProps = {
  coinId: string;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins: CoinOption[];
  updateInterval?: number;
};

export type LocalModel = {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected: boolean;
  lastUsed?: string;
  description?: string;
  performance?: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
};

export interface ModelListProps {
  models: LocalModel[];
  onSelect?: (model: LocalModel) => void;
  onConnect?: (model: LocalModel) => void;
  onDisconnect?: (modelId: string) => void;
}

export interface QuantitativeAnalysisProps {
  symbol?: string;
  timeframe?: string;
  onResultsCalculated?: (results: any) => void;
}

export interface StrategyShare {
  id: string;
  strategyId: string;
  strategyName: string;
  userId: string;
  username: string;
  userAvatar?: string;
  description: string;
  performance: {
    winRate: number;
    profitFactor: number;
    netProfit: number;
    trades: number;
    sharpeRatio: number;
  };
  timeframe: string;
  tags: string[];
  likes: number;
  createdAt: string;
  isVerified: boolean;
}

export interface TradingSignal {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  coin: string;
  symbol: string;
  direction: 'buy' | 'sell';
  price: number;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  confidence: number;
  reasoning: string;
  createdAt: string;
  expiresAt: string;
  likes: number;
  status: 'active' | 'fulfilled' | 'failed' | 'expired';
}

export type ExtendedTradingTimeframe = {
  value: string;
  label: string;
  chartPeriod: string;
  interval: string;
  dataPoints: number;
  description: string;
};

export type TimeframeOption = {
  value: string;
  label: string;
  description: string;
  interval: string;
};

export type ValueType = string | number;
