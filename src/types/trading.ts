
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
