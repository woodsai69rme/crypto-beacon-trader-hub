
export type SupportedCurrency = 'AUD' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';
export type ColorScheme = 'default' | 'neon-future' | 'sunset-gradient' | 'matrix-code' | 'cyber-pulse';

export interface Trade {
  id: string;
  coinId?: string;
  coinName?: string;
  coinSymbol?: string;
  symbol: string; // Primary symbol field
  type: 'buy' | 'sell';
  amount?: number;
  quantity: number; // Primary quantity field
  price: number;
  totalValue: number;
  total?: number;
  timestamp: string;
  currency?: string;
  botGenerated?: boolean;
  strategyId?: string;
  botId?: string;
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
  type: 'paper' | 'live';
  assets: any[];
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

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters?: Record<string, any>;
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

export interface DefiPosition {
  id: string;
  protocolId: string;
  protocolName: string;
  type: 'lending' | 'borrowing' | 'staking' | 'liquidity' | 'yield';
  assetId: string;
  assetSymbol: string;
  amount: number;
  value: number;
  apy: number;
  startDate: string;
  endDate?: string;
  rewards?: {
    assetId: string;
    assetSymbol: string;
    amount: number;
    value: number;
  }[];
}

export interface DefiProtocol {
  id: string;
  name: string;
  category: string;
  chain: string;
  tvl: number;
  apy: number;
  risk: 'low' | 'medium' | 'high';
  url: string;
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

export interface WalletAccount {
  id: string;
  address: string;
  network: string;
  balance: number;
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

export interface ATOTaxCalculation {
  totalGains: number;
  totalLosses: number;
  netCapitalGain: number;
  taxableAmount: number;
  events: any[];
}

export type WidgetType = 'custom' | 'price-chart' | 'portfolio-summary' | 'watchlist' | 'news' | 'alerts' | 'trading' | 'aiTrading' | 'aiAnalysis';
export type WidgetSize = 'small' | 'medium' | 'large';

export interface Widget {
  id: string;
  position?: { x: number; y: number };
  title: string;
  type: WidgetType;
  size: WidgetSize;
  customContent?: string;
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

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  app: boolean;
  trades?: boolean;
  pricing?: boolean;
  news?: boolean;
}

export interface AppearanceSettings {
  colorScheme: string;
  compactMode: boolean;
  animationsEnabled: boolean;
  highContrastMode: boolean;
}

export interface PrivacySettings {
  showOnlineStatus?: boolean;
  sharePortfolio?: boolean;
  shareTrades?: boolean;
  dataCollection: boolean;
  marketingConsent: boolean;
  thirdPartySharing?: boolean;
}

export interface AccountSettings {
  twoFactorEnabled?: boolean;
  loginAlerts?: boolean;
}

export interface TradingPreferences {
  autoConfirm?: boolean;
  showAdvanced?: boolean;
  defaultAsset?: string;
}

// Enhanced SettingsFormValues to include all required fields
export interface SettingsFormValues {
  email?: string;
  username?: string;
  displayName?: string;
  bio?: string;
  theme: string;
  currency: string;
  language?: string;
  notifications: NotificationSettings;
  tickerSettings?: TickerSettings;
  sidebarSettings?: SidebarSettings;
  sidebar?: boolean;
  appearance?: AppearanceSettings;
  privacy?: PrivacySettings;
  account?: AccountSettings;
  tradingPreferences?: TradingPreferences;
  autoSave?: boolean;
  dataRetention?: number;
  marketDataProvider?: string;
}

export interface CorrelationHeatmapProps {
  correlationData: number[][];
  coins: CoinOption[];
  onCoinSelect?: (coin: CoinOption) => void;
}

export interface PriceCorrelationChartProps {
  coins: CoinOption[];
}

export interface DetachableDashboardProps {
  onDetach?: () => void;
  isDetached?: boolean;
}

export interface LiveAnalyticsDashboardProps {
  selectedCoin: CoinOption;
  apiStats: ApiUsageStats;
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolio: any;
  benchmarks?: any[];
}
