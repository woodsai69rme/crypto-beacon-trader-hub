
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent: number;
  image: string;
  volume: number;
  marketCap: number;
  value: string;
  label: string;
}

export interface Widget {
  id: string;
  position?: { x: number, y: number };
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

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe: string;
  parameters: Record<string, any>;
}

export interface StrategyParameter {
  id: string;
  name: string;
  description: string;
  type: string;
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
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
  trades: BacktestTrade[];
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

export interface BacktestTrade {
  id: string;
  timestamp: string;
  date: string;
  type: string;
  price: number;
  amount: number;
  total: number;
  profit: number;
  profitPercentage: number;
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

export interface NotificationsSettings {
  email: boolean;
  push: boolean;
  priceAlerts: boolean;
  marketUpdates: boolean;
  newsletterAndPromotions: boolean;
}

export interface PrivacySettings {
  showOnlineStatus: boolean;
  sharePortfolio: boolean;
  shareTrades: boolean;
}

export interface AppearanceSettings {
  compactMode: boolean;
  animationsEnabled: boolean;
  showTradingHistory: boolean;
  showPortfolioChart: boolean;
  highContrastMode: boolean;
}

export interface AccountSettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
}

export interface TradingSettings {
  confirmTradeExecutions: boolean;
  showPriceAlerts: boolean;
  defaultOrder: "market" | "limit" | "stop";
}

export interface DashboardCustomizationSettings {
  defaultCurrency: string;
  defaultTimeframe: string;
  alertVolume: number;
  alertFrequency: "low" | "medium" | "high";
}

export interface DataPrivacySettings {
  storeHistory: boolean;
  enableTracking: boolean;
}

export interface SettingsFormValues {
  email: string;
  username: string;
  displayName: string;
  bio: string;
  darkMode: boolean;
  language: string;
  timeZone: string;
  layout: string;
  theme: "light" | "dark";
  colorScheme: string;
  notifications: NotificationsSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
  account: AccountSettings;
  trading: TradingSettings;
  dashboardCustomization: DashboardCustomizationSettings;
  dataPrivacy: DataPrivacySettings;
  exportFormat: string;
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
  currency: string;
  botGenerated?: boolean;
  strategyId?: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  initialBalance: number;
  currency: string;
  trades: Trade[];
  createdAt: string;
  lastModified?: string;
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

export type TaxHarvestTradeItem = TaxHarvestTrade;

export interface TradingFormProps {
  onSubmit: (trade: Omit<Trade, 'id' | 'timestamp'>) => void;
  availableBalance: number;
  selectedCoin: CoinOption;
}

export interface RealTimePriceChartProps {
  coinId: string;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins?: CoinOption[];
  timeframe?: string;
  height?: number | string;
  showControls?: boolean;
  updateInterval?: number;
}

export interface QuantitativeAnalysisProps {
  coinId: string;
  timeframe?: string;
}

export interface ExtendedTradingTimeframe {
  id: string;
  label: string;
  value: string;
  duration: number;
  candleCount: number;
  description: string;
}

export interface TradingSignal {
  id: string;
  type: 'buy' | 'sell' | 'hold';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  price: number;
  confidence: number;
  description: string;
  timestamp: string;
  source: string;
  parameters?: Record<string, any>;
}

export interface StrategyShare {
  id: string;
  name: string;
  description: string;
  userId: string;
  userName: string;
  performance: {
    roi: number;
    winRate: number;
    sharpeRatio: number;
  };
  popularity: number;
  timestamp: string;
  tags: string[];
}

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

// Add the missing interfaces from build errors
export interface CryptoChartData {
  id: string;
  name: string;
  symbol: string;
  priceData: {
    timestamp: string;
    price: number;
  }[];
  currentPrice: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  priceChangePercentage: number;
  marketCap: number;
  volume: number;
  circulatingSupply: number;
}

export interface ApiProvider {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  documentation: string;
  endpoints: ApiEndpoint[];
  isActive: boolean;
  requiresAuth: boolean;
  authType: 'apiKey' | 'oauth' | 'none';
  category: 'market' | 'exchange' | 'analytics' | 'other';
  icon?: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  requiresAuth: boolean;
  parameters: ApiParameter[];
  rateLimit: {
    requests: number;
    period: string;
  };
  responseExample: string;
}

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: any;
}

export interface ApiUsageStats {
  id: string;
  serviceId: string;
  serviceName: string;
  totalRequests: number;
  periodRequests: number;
  requestsLimit: number;
  averageResponseTime: number;
  errorRate: number;
  lastRequested: string;
  currentUsage: number;
  maxUsage: number;
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioId: string;
  timeframe: string;
  benchmarks: string[];
}

export interface ATOTaxCalculation {
  id: string;
  financialYear: string;
  totalGains: number;
  totalLosses: number;
  netGain: number;
  taxRate: number;
  estimatedTax: number;
  transactions: TaxHarvestTrade[];
  discountApplied: boolean;
  discountAmount?: number;
  dateCalculated: string;
}

