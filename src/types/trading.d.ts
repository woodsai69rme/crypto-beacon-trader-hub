
export interface AIStrategyParameters {
  buySignalThreshold?: number;
  sellSignalThreshold?: number;
  stopLossPercentage?: number;
  takeProfitPercentage?: number;
  timeframe?: string;
  maxPositions?: number;
  lookbackPeriod?: number;
  entryThreshold?: number;
  exitThreshold?: number;
  stopLoss?: number;
  meanPeriod?: number;
  entryDeviation?: number;
  exitDeviation?: number;
  momentumPeriod?: number;
  consolidationPeriod?: number;
  volatilityThreshold?: number;
  upperLimit?: number;
  lowerLimit?: number;
  gridLines?: number;
  maFast?: number;
  maSlow?: number;
  deviationThreshold?: number;
}

export interface AIStrategyPerformance {
  accuracy?: number;
  returns?: number;
  sharpeRatio?: number;
  maxDrawdown?: number;
  winRate?: number;
  profitFactor?: number;
  totalTrades?: number;
  averageProfit?: number; // Added missing property
  profit?: number;
  profitLoss?: number;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  riskLevel: string;
  timeframe?: string; // Make timeframe optional
  parameters: {
    lookbackPeriod?: number;
    stopLoss?: number;
    takeProfit?: number;
    capitalAllocation?: number;
    buySignalThreshold?: number;
    sellSignalThreshold?: number;
    stopLossPercentage?: number;
    takeProfitPercentage?: number;
    maxPositions?: number;
    entryThreshold?: number;
    exitThreshold?: number;
    meanPeriod?: number;
    entryDeviation?: number;
    exitDeviation?: number;
    momentumPeriod?: number;
    consolidationPeriod?: number;
    volatilityThreshold?: number;
    upperLimit?: number;
    lowerLimit?: number;
    gridLines?: number;
    maFast?: number;
    maSlow?: number;
    deviationThreshold?: number;
    [key: string]: any; // Allow for additional custom parameters
  };
  performance?: {
    winRate?: number;
    profitFactor?: number;
    totalTrades?: number;
    averageProfit?: number;
    maxDrawdown?: number;
    profitLoss?: number;
    sharpeRatio?: number;
    accuracy?: number;
    returns?: number;
  };
  indicators?: string[];
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  initialBalance: number;
  trades: any[];
  currency: string;
  createdAt: string;
  type: string;
  address: string;
  network: string;
  assets: any[];
  provider?: string;
  lastUpdated?: string;
  isActive?: boolean;
}

export interface PaperTradingConfig {
  enabled: boolean;
  initialBalance: number;
  currency: string;
  slippageModel: string;
  slippagePercentage: number;
  maxTradeSize: number;
  includeFees: boolean;
  feePercentage: number;
}

export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: string;
  isConnected: boolean;
}

export interface AIModelConfig {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  parameters?: Record<string, any>;
}

export type SupportedCurrency = string;

export interface AITradingBot {
  id: string;
  name: string;
  description: string;
  strategy: AITradingStrategy;
  strategyId: string;
  strategyName: string;
  status: string;
  createdAt: string;
  lastRun?: string;
  model: string;
  asset: string;
  accuracy?: number;
  successRate?: number;
  trades?: number;
  totalTrades?: number;
  performance?: {
    winRate: number;
    trades: number;
    profit: number;
  };
  profitLoss?: number;
}

export interface BacktestResults {
  totalTrades: number;
  winRate: number;
  profitLoss: number;
  sharpeRatio: number;
  maxDrawdown: number;
  trades: any[];
}

export interface SettingsFormValues {
  theme: string;
  colorScheme?: string;
  displayName?: string;
  username?: string;
  contactEmail?: string;
  userLanguage?: string;
  currency: SupportedCurrency;
  display: {
    showPortfolio: boolean;
    defaultTab: string;
    compactMode: boolean;
    colorScheme?: string;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    priceAlerts: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
    marketUpdates?: boolean;
    newsletterAndPromotions?: boolean;
  };
  api: {
    provider: string;
    key: string;
    refreshInterval?: number;
    timeout?: number;
  };
  privacy: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
    dataCollection: boolean;
    marketingConsent: boolean;
    thirdPartySharing: boolean;
    publicProfile?: boolean;
  };
  appearance: {
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
  };
  account?: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
  tradingPreferences?: {
    autoConfirm: boolean;
    showAdvanced?: boolean;
    defaultAsset?: string;
    defaultTradeSize?: number;
    riskLevel?: "medium" | "low" | "high";
    tradingStrategy?: string;
    defaultLeverage?: number;
    showPnL?: boolean;
    defaultTimeframe?: string;
  };
  dataPrivacy?: {
    storeHistory?: boolean;
    anonymizeData?: boolean;
    enableTracking?: boolean;
    shareAnalytics?: boolean;
  };
  ticker?: {
    enabled: boolean;
    position: "top" | "bottom";
    direction: "ltr" | "rtl";
    speed: number;
    autoPause: boolean;
    coins?: string[];
  };
  exportFormat?: "CSV" | "JSON" | "PDF";
  layout?: string;
  sidebar?: {
    expanded: boolean;
    position: "left" | "right";
    visible: boolean;
  };
  bio?: string;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  market_cap?: number;
  volume_24h?: number;
  change_24h?: number;
  price_history?: { timestamp: number; price: number }[];
  fully_diluted_valuation?: number;
  // Add any other properties that are used in the app
}

export interface CryptoChartData {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  requiresAuth: boolean;
  parameters?: Array<{
    name: string;
    description: string;
    required: boolean;
    type: string;
    default?: string;
  }>;
  isActive?: boolean;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
  authType: 'header' | 'query' | 'apiKey'; // Added 'apiKey' as valid option
  authKey: string;
  enabled: boolean;
  endpoints: Record<string, ApiEndpoint>;
  apiKey?: string;
  rateLimit?: number;
}

export interface WalletProvider {
  id: string;
  name: string;
  logo?: string;
  description: string;
  icon: string;
  supported: boolean;
  isInstalled?: boolean;
  isConnected?: boolean;
  supportedChains?: string[];
}
