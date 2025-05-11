
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent: number; // Added this missing property
  image?: string;
  volume?: number;
  marketCap?: number;
  value: string;
  label: string;
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
  total: number; // Added for compatibility
  timestamp: string;
  currency: SupportedCurrency;
  botGenerated?: boolean;
  strategyId?: string;
  fees?: number; // Added fees field
  coin?: string; // Added coin field
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  initialBalance: number;
  currency: SupportedCurrency;
  trades: Trade[];
  createdAt: string;
  lastModified?: string;
  provider?: string; // Added provider field
  isActive?: boolean; // Added isActive field
}

export interface AccountWithBotsEnabled {
  id: string; // Explicitly defining id for BotAccountConnector
  name: string; // Explicitly defining name field
  balance: number; // Explicitly defining balance field
  isActive: boolean; // Explicitly defining isActive field
  provider: string; // Explicitly defining provider field
  currency: SupportedCurrency;
  trades: Trade[];
}

export interface TaxHarvestTrade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  totalValue: number;
  currentValue: number;
  timestamp: string;
  profitLoss: number;
}

export interface ATOTaxCalculation {
  financialYear: string;
  income: number;
  capitalGains: number;
  shortTermGains: number;
  longTermGains: number;
  discountedGains: number;
  taxOwed: number;
  taxRate: number;
  transactions: TaxHarvestTrade[];
}

export interface TradingFormProps {
  onSubmit: (trade: Omit<Trade, 'id' | 'timestamp'>) => void;
  availableBalance: number;
  selectedCoin: CoinOption;
}

export interface RealTimePriceChartProps {
  coinId?: string;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins?: CoinOption[];
  timeframe?: string;
  height?: number | string;
  showControls?: boolean;
  showVolume?: boolean;
}

export interface QuantitativeAnalysisProps {
  symbol?: string;
  timeframe?: string;
  depth?: number;
  onResultsCalculated?: (results: any) => void;
}

export interface ExtendedTradingTimeframe {
  id: string;
  label: string;
  value: string;
  description: string;
  candleCount?: number;
  defaultIndicators?: string[];
}

export interface TradingSignal {
  id: string;
  type: 'buy' | 'sell' | 'hold';
  coinId: string;
  price: number;
  confidence: number;
  description?: string;
  timestamp: string;
  source: string;
  reason?: string;
  parameters?: Record<string, any>;
}

export interface StrategyShare {
  id: string;
  strategyId: string;
  strategyName: string;
  userId: string;
  userName: string;
  description: string;
  performance: {
    winRate: number;
    returns: number;
    trades: number;
  };
  popularity: number;
  timestamp: string;
  tags: string[];
  likes: number;
}

export type OrderType = 'market' | 'limit' | 'stop' | 'stop_limit' | 'trailing_stop';

export interface LocalModel {
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
}

export interface ModelListProps {
  models: LocalModel[];
  onSelect?: (model: LocalModel) => void;
  onConnect?: (model: LocalModel) => void;
  onDisconnect?: (modelId: string) => void;
}

// Renaming AITradingStrategy to TradingStrategy to match existing usages
export interface TradingStrategy {
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
}

export interface AiBotTradingProps {
  botId: string;
  strategyId: string;
  strategyName: string;
}

// Adding missing interfaces for settings components
export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
  onSave?: (values: Partial<SettingsFormValues>) => void;
  defaultValues?: Partial<SettingsFormValues>;
}

export interface SettingsFormValues {
  username?: string;
  displayName?: string;
  email?: string;
  theme?: string;
  bio?: string;
  language?: string;
  notifications: {
    email: boolean;
    push: boolean;
    trades: boolean;
    pricing: boolean;
    news: boolean;
  };
  tradingPreferences: {
    autoConfirm: boolean;
    showAdvanced: boolean;
    defaultAsset: string;
  };
  privacy?: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
    dataCollection: boolean;
    marketingConsent: boolean;
    thirdPartySharing: boolean;
  };
  account?: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
  appearance?: {
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
  };
  ticker?: {
    enabled: boolean;
    position: string;
    speed: number;
    direction: string;
    autoPause: boolean;
  };
  sidebar?: {
    enabled: boolean;
    position: string;
    collapsed: boolean;
    autoHide: boolean;
  };
}

// Adding missing interfaces for LiveAnalyticsDashboard
export interface LiveAnalyticsDashboardProps {
  initialCoinId?: string;
  refreshInterval?: number;
  showDetailedView?: boolean;
  onAlertTriggered?: (alert: any) => void;
  darkMode?: boolean;
}

export interface DetachableDashboardProps {
  onClose: () => void;
  isDetached?: boolean;
  children?: React.ReactNode;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
  currentUsage: number;
  maxUsage: number;
  resetTime: string;
  endpoint: string;
  status: string;
  website?: string;
  docs?: string;
  endpoints?: ApiEndpoint[];
  isActive: boolean;
  apiKey?: string;
  usageLimit: number;
  authMethod?: string;
  apiKeyName?: string;
  defaultHeaders?: Record<string, string>;
  enabled?: boolean;
  requiresAuth?: boolean;
  authRequired?: boolean; // Adding missing authRequired property
}

export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: string;
  description?: string;
  url: string;
  responseTime?: number;
  lastUsed?: string;
  requiresAuth?: boolean;
}

export interface ApiUsageStats {
  service: string;
  provider?: string;
  currentUsage: number;
  maxUsage: number;
  endpoint?: string;
  resetTime?: string;
  
  // Adding missing properties reported in errors
  requestCount?: number;
  successCount?: number;
  errorCount?: number;
  avgResponseTime?: number;
  lastUsed?: string;
  serviceName?: string;
  serviceId?: string;
  totalRequests?: number;
  periodRequests?: number;
  requestsLimit?: number;
  averageResponseTime?: number;
  errorRate?: number;
  lastRequested?: string;
}

// Add missing interface for EnhancedPortfolioBenchmarking
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance?: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    allTime: number;
  };
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  price: number;
  priceChange: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
}

export interface StrategyParameter {
  id: string;
  name: string;
  description?: string;
  type: 'number' | 'boolean' | 'string' | 'select' | 'range';
  default: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
}

export interface BacktestResult {
  profit: number;
  profitPercentage: number;
  drawdown: number;
  maxDrawdown: number;
  winRate: number;
  winningTrades: number;
  losingTrades: number;
  totalTrades: number;
  sharpeRatio: number;
  profitFactor: number;
  trades: {
    id: string;
    date: string;
    type: 'buy' | 'sell';
    price: number;
    amount: number;
    profit: number;
  }[];
}

export interface OptimizationResult {
  improvement: number;
  parameterValues: Record<string, any>;
  performance: {
    profit: number;
    maxDrawdown: number;
    sharpeRatio: number;
    winRate: number;
  };
}

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  customContent?: string;
}

export type WidgetType = 'price-chart' | 'portfolio-summary' | 'watchlist' | 'news' | 'alerts' | 'trading' | 'aiTrading' | 'aiAnalysis' | 'custom';
export type WidgetSize = 'small' | 'medium' | 'large';

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'JPY' | 'CNY';

import { UseFormReturn } from "react-hook-form";
