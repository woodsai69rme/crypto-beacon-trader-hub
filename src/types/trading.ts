
// Generic interfaces
export interface CoinOption {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  price: number;
  priceChange?: number;
  value?: string;
  label?: string;
}

export interface Widget {
  id: string;
  type: string;
  title: string;
  size?: WidgetSize;
  position?: { x: number; y: number };
  data?: any;
  settings?: any;
  customContent?: string;
  lastUpdated?: string;
}

export type WidgetSize = 'small' | 'medium' | 'large' | 'custom' | 'wide' | 'tall' | 'full';
export type WidgetType = 'chart' | 'portfolio' | 'watchlist' | 'news' | 'alerts' | 'analysis' | 'price-chart' | 'custom' | 'portfolio-summary' | 'aiTrading' | 'aiAnalysis' | 'trading' | 'trade-history' | 'market-overview' | 'performance-metrics';

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

// Chart data interfaces
export interface CryptoChartData {
  prices: [number, number][];
  market_caps?: [number, number][];
  total_volumes?: [number, number][];
}

// Trading related interfaces
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  price: number;
  current_price?: number;
  priceChange?: number;
  price_change_24h: number;
  changePercent?: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank?: number;
  volume_24h: number;
  total_volume?: number;
  circulating_supply: number;
  rank?: number;
}

export interface TradingAccount {
  id: string;
  name: string;
  type: 'exchange' | 'wallet' | 'bank';
  provider: string;
  balance: number;
  currency: string;
  lastUpdated: string;
  assets?: Asset[];
  settings?: AccountSettings;
  isActive: boolean;
}

export interface AccountWithBotsEnabled extends TradingAccount {
  id: string;
  name: string;
  balance: number;
  botsEnabled: boolean;
}

interface Asset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  value: number;
}

interface AccountSettings {
  notifications: boolean;
  autoSync: boolean;
  apiKeyName?: string;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'breakout' | 'sentiment' | 'machine-learning' | 'multi-timeframe' | 'traditional' | 'ai-predictive' | 'hybrid';
  timeframe: string;
  parameters: any;
  creator: string;
  tags: string[];
  riskLevel: 'low' | 'medium' | 'high';
  performance?: {
    totalReturn: number;
    winRate: number;
    sharpeRatio: number;
  };
  indicators?: string[];
}

export interface AiBotTradingProps {
  strategyId?: string;
  strategyName?: string;
  botId?: string;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
  endpoints: ApiEndpoint[];
  isActive: boolean;
  apiKey: string;
  usageLimit: number;
  currentUsage: number;
  enabled?: boolean;
  requiresAuth?: boolean;
  authRequired?: boolean;
  website?: string;
  docs?: string;
  authMethod?: 'header' | 'query';
  defaultHeaders?: Record<string, string>;
  apiKeyName?: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  responseTime: number;
  lastUsed: string;
  requiresAuth: boolean;
}

export interface ApiUsageStats {
  serviceId: string;
  serviceName: string;
  totalRequests: number;
  periodRequests: number;
  requestsLimit: number;
  averageResponseTime: number;
  errorRate: number;
  costPerRequest?: number;
  lastRequested: string;
  id?: string;
  currentUsage?: number;
  maxUsage?: number;
  resetTime?: string;
  endpoint?: string;
  service?: string;
}

export interface WatchlistItem extends CoinOption {
  isStarred: boolean;
  addedAt: string;
  notes?: string;
  alerts?: PriceAlert[];
  coinId?: string;
  isWatched?: boolean;
  alertSettings?: {
    enabled: boolean;
    highPrice?: number;
    lowPrice?: number;
    percentageChangeThreshold?: number;
    priceAbove?: number;
    priceBelow?: number;
    percentageChange?: number;
    condition?: 'above' | 'below';
    price?: number;
  };
  priceChangePercentage24h?: number;
}

export interface PriceAlert {
  id: string;
  condition: 'above' | 'below';
  price: number;
  isActive: boolean;
  createdAt: string;
}

export interface Trade {
  id: string;
  coinId: string;
  coinSymbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  date?: string;
  status?: 'completed' | 'pending' | 'failed';
  exchange?: string;
  timestamp?: string;
  totalValue?: number;
  coinName?: string;
  profitLoss?: number;
  currentValue?: number;
  botGenerated?: boolean;
  strategyId?: string;
  currency?: SupportedCurrency;
  tags?: string[];
  result?: 'profit' | 'loss';
  pnl?: string;
  pnlPercent?: number;
}

export interface TaxHarvestTrade extends Trade {
  coinName: string;
  profitLoss: number;
  currentValue: number;
  tags: string[];
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'JPY' | 'CNY' | 'BTC' | 'ETH';

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
  bracketInfo?: {
    bracket: string;
    rate: string;
  };
  capitalGains?: number;
  CGTDiscount?: number;
  year?: number;
  taxYear?: string;
  incomeBracket?: string;
  effectiveTaxRate?: number;
  effectiveRate?: number;
  marginalRate?: number;
  takeHome?: number;
  medicareLevyPayable?: number;
  income?: number;
  breakdown?: {
    bracket: string;
    amount: number;
    tax: number;
  }[];
  deductions?: number;
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
}

// Add missing notifications structure for settings forms
export interface NotificationsSettings {
  email: boolean;
  push: boolean;
  priceAlerts?: boolean;
  trading?: boolean;
  marketAlerts?: boolean;
  newFeatures?: boolean;
  marketUpdates?: boolean;
  newsletterAndPromotions?: boolean;
}

export interface PrivacySettings {
  showOnlineStatus?: boolean;
  sharePortfolio?: boolean;
  shareTrades?: boolean;
  publicProfile?: boolean;
  showPortfolio?: boolean;
  shareActivity?: boolean;
}

export interface DataPrivacySettings {
  storeHistory?: boolean;
  anonymizeData?: boolean;
  enableTracking?: boolean;
  shareAnalytics?: boolean;
}

export interface AccountSettings {
  twoFactorEnabled?: boolean;
  loginAlerts?: boolean;
}

export interface TradingSettings {
  defaultOrder?: "market" | "limit";
  confirmTradeExecutions?: boolean;
  showPriceAlerts?: boolean;
  autoSyncExchanges?: boolean;
  tradingViewCharts?: boolean;
  defaultTradingPair?: string;
}

export interface DashboardCustomizationSettings {
  defaultCurrency?: string;
  defaultTimeframe?: string;
  alertVolume?: number;
  alertFrequency?: string;
}

export interface SettingsFormValues {
  theme?: string;
  colorScheme?: string;
  layout?: string;
  username?: string;
  displayName?: string;
  email?: string;
  bio?: string;
  notifications?: NotificationsSettings;
  appearance?: {
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
    showTradingHistory: boolean;
    showPortfolioChart: boolean;
  };
  privacy?: PrivacySettings;
  trading?: TradingSettings;
  ticker?: {
    enabled: boolean;
    position: 'top' | 'bottom' | 'both';
    speed: number;
    direction: 'left' | 'right';
    autoPause: boolean;
  };
  sidebar?: {
    enabled: boolean;
    position: 'left' | 'right';
    defaultCollapsed: boolean;
    showLabels: boolean;
  };
  language?: string;
  timeZone?: string;
  darkMode?: boolean;
  exportFormat?: "CSV" | "JSON" | "PDF";
  dataPrivacy?: DataPrivacySettings;
  account?: AccountSettings;
  dashboardCustomization?: DashboardCustomizationSettings;
}

export interface SettingsFooterProps {
  isSaving: boolean;
  onReset: () => void;
}
