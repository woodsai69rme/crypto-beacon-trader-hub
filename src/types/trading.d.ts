
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent: number;
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
  total: number;
  timestamp: string;
  currency: SupportedCurrency;
  botGenerated?: boolean;
  strategyId?: string;
  fees?: number;
  coin?: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  initialBalance?: number;
  currency: SupportedCurrency;
  trades?: Trade[];
  createdAt?: string;
  lastModified?: string;
  provider?: string;
  isActive?: boolean;
  type?: string;
}

export interface AccountWithBotsEnabled extends TradingAccount {
  id: string;
  name: string;
  balance: number;
  isActive: boolean;
  provider: string;
  botsEnabled: boolean;
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

export type OrderType = 'market' | 'limit' | 'stop' | 'stop-limit' | 'trailing_stop';

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

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'breakout' | 'sentiment' | 'machine-learning' | 'multi-timeframe' | 'momentum' | 'traditional' | 'ai-predictive' | 'hybrid' | 'custom';
  timeframe: string;
  parameters: any;
  riskLevel?: string;
  creator?: string;
  tags?: string[];
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
}

export interface AiBotTradingProps {
  botId?: string;
  strategyId?: string;
  strategyName?: string;
}

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
  authRequired?: boolean;
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

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
}

export type SupportedCurrency = 'USD' | 'AUD' | 'EUR' | 'GBP';

export interface StrategyParameter {
  id: string;
  name: string;
  description: string;
  type: 'number' | 'boolean' | 'string' | 'select';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
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
  trades: Array<{
    id: string;
    date: string;
    type: 'buy' | 'sell';
    price: number;
    amount: number;
    profit: number;
  }>;
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

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  changePercent: number;
  marketCap: number;
  volume: number;
}

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  customContent?: string;
}

export type WidgetType = 
  'price-chart' | 
  'portfolio-summary' | 
  'watchlist' | 
  'news' | 
  'alerts' | 
  'trading' | 
  'aiTrading' | 
  'aiAnalysis' | 
  'custom';

export type WidgetSize = 'small' | 'medium' | 'large';

import { UseFormReturn } from "react-hook-form";
