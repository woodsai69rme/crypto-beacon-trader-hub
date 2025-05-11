// Common interfaces
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent?: number;
  image?: string;
  volume?: number;
  marketCap?: number;
  value?: string;
  label?: string;
  priceAUD?: number;
  priceEUR?: number;
  priceGBP?: number;
  rank?: number;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price?: number;
  priceChange: number;  // Explicitly required
  image?: string;
  marketCap?: number;
  volume?: number;
  changePercent?: number;
  current_price?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  total_volume?: number;
  market_cap?: number;
  circulatingSupply?: number;
}

// Trading interfaces
export interface Trade {
  id: string;
  coinId: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number | string;
  total: number;
  fees?: number;
  coinName?: string;
  coinSymbol?: string;
  totalValue?: number;
  currency?: SupportedCurrency;
  currentValue?: number;
  profitLoss?: number;
  botGenerated?: boolean;
  strategyId?: string;
  coin?: string;
}

export interface TradeResult {
  success: boolean;
  trade: Trade;
  message?: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  exchange?: string;
  apiKey?: string;
  apiSecret?: string;
  balance?: number;
  initialBalance?: number;
  currency?: string;
  connected?: boolean;
  isActive?: boolean;
  provider?: string;
  trades?: Trade[];
  createdAt?: string;
  lastModified?: string;
  type?: string;
  lastUpdated?: string;
  assets?: {
    id: string;
    symbol: string;
    name: string;
    amount: number;
    value: number;
  }[];
}

export interface AccountWithBotsEnabled {
  id?: string;
  name?: string;
  exchange?: string;
  balance?: number;
  currency?: string;
  connected?: boolean;
  isActive?: boolean;
  provider?: string;
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  indicators: string[];
  parameters: Record<string, any>;
  performance?: {
    winRate?: number;
    profitFactor?: number;
    sharpeRatio?: number;
  };
  type?: string;
  creator?: string;
  tags?: string[];
}

// Adding AITradingStrategy which is missing in many imports
export interface AITradingStrategy extends TradingStrategy {
  aiModel: string;
  confidenceThreshold: number;
  riskLevel: 'low' | 'medium' | 'high';
  maxDrawdown: number;
}

// Adding missing TradingAccount interface
export interface TradingAccount {
  id: string;
  name: string;
  exchange?: string;
  apiKey?: string;
  apiSecret?: string;
  balance?: number;
  initialBalance?: number;
  currency?: string;
  connected?: boolean;
  isActive?: boolean;
  provider?: string;
  trades?: Trade[];
  createdAt?: string;
  lastModified?: string;
  type?: string;
  lastUpdated?: string;
  assets?: {
    id: string;
    symbol: string;
    name: string;
    amount: number;
    value: number;
  }[];
}

// Adding missing QuantitativeAnalysisProps interface
export interface QuantitativeAnalysisProps {
  symbol: string;
  timeframe: string;
  depth?: number;
  onResultsCalculated?: (results: any) => void;
}

// Adding missing TradingFormProps interface
export interface TradingFormProps {
  balance: number;
  availableCoins: CoinOption[];
  onTrade: (coinId: string, type: 'buy' | 'sell', amount: number, price: number) => void;
  getOwnedCoinAmount: (coinId: string) => number;
  activeCurrency: SupportedCurrency;
  onCurrencyChange?: (currency: SupportedCurrency) => void;
  conversionRate: number;
  trades?: Trade[];
}

// Adding missing AiBotTradingProps interface
export interface AiBotTradingProps {
  accounts?: TradingAccount[];
  strategies?: AITradingStrategy[];
  botId?: string;
  strategyId?: string;
  strategyName?: string;
}

// Adding missing TickerSettings and SidebarSettings interfaces
export interface TickerSettings {
  enabled: boolean;
  position: string;
  speed: number;
  direction: string;
  autoPause: boolean;
}

export interface SidebarSettings {
  enabled: boolean;
  position: string;
  collapsed: boolean;
  autoHide: boolean;
}

// Adding missing ATOTaxCalculation interface
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
  bracketInfo: {
    bracket: string;
    rate: string;
  };
  capitalGains: number;
  CGTDiscount: number;
  trades?: {
    id: string;
    asset: string;
    acquiredDate: Date;
    disposedDate: Date;
    costBase: number;
    proceedsOfDisposal: number;
    gainOrLoss: number;
    isLongTerm: boolean;
  }[];
}

// Adding missing CryptoChartData interface
export interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
  enabled: boolean;
  requiresAuth: boolean;
  authRequired?: boolean;
  apiKey?: string;
  apiKeyName?: string;
  authMethod?: 'header' | 'query';
  endpoints: Record<string, string>;
  defaultHeaders?: Record<string, string>;
  priority?: number;
  currentUsage?: number;
  maxUsage?: number;
  resetTime?: string;
  status?: string;
  website?: string;
  docs?: string;
  usageLimit?: number;
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'JPY' | 'CNY';

// Props interfaces
export interface RealTimePriceChartProps {
  coinId: string;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins?: CoinOption[];
  updateInterval?: number;
}

export interface RealTimePricesProps {
  initialCoins: CoinOption[];
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string;
  refreshInterval?: number;
}

// Adding TradingFormProps interface which is missing
export interface TradingFormProps {
  balance: number;
  availableCoins: CoinOption[];
  onTrade: (coinId: string, type: 'buy' | 'sell', amount: number, price: number) => void;
  getOwnedCoinAmount: (coinId: string) => number;
  activeCurrency: SupportedCurrency;
  onCurrencyChange?: (currency: SupportedCurrency) => void;
  conversionRate: number;
}

export interface AiBotTradingProps {
  accounts?: TradingAccount[];
  strategies?: AITradingStrategy[];
  botId?: string;
  strategyId?: string;
  strategyName?: string;
}

// Adding QuantitativeAnalysisProps interface which is missing
export interface QuantitativeAnalysisProps {
  symbol: string;
  timeframe: string;
  depth?: number;
  onResultsCalculated?: (results: any) => void;
}

// Adding ATOTaxCalculation interface which is missing
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
  bracketInfo: {
    bracket: string;
    rate: string;
  };
  capitalGains: number;
  CGTDiscount: number;
  trades?: {
    id: string;
    asset: string;
    acquiredDate: Date;
    disposedDate: Date;
    costBase: number;
    proceedsOfDisposal: number;
    gainOrLoss: number;
    isLongTerm: boolean;
  }[];
}

// Wallet related interfaces
export interface WalletProvider {
  id: string;
  name: string;
  logo?: string;
  description: string;
  isInstalled: boolean;
  isConnected: boolean;
  enabled?: boolean;
  apiKey?: string;
  usageLimit?: number;
  requiresAuth?: boolean;
  authRequired?: boolean;
  baseUrl?: string;
  endpoints?: ApiEndpoint[];
  isActive?: boolean;
  website?: string;
  docs?: string;
  supportsChains?: string[];
}

export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: string;
  parameters?: any[];
  requiresAuth: boolean;
  description: string;
  url?: string;
  responseTime?: number;
  lastUsed?: string;
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

export interface FibonacciLevels {
  level0: number;
  level236: number;
  level382: number;
  level500: number;
  level618: number;
  level786: number;
  level1000: number;
}

export interface FibonacciAnalysisProps {
  symbol?: string;
  timeframe?: string;
}

export interface HyblockLiquidityZone {
  min: number;
  max: number;
  strength: number;
  type: 'buy' | 'sell';
}

export interface HyblockLiquidityMapProps {
  symbol?: string;
  timeframe?: string;
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance?: number[] | {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    allTime: number;
  };
  portfolioDates?: string[];
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
  trades: {
    id: string;
    timestamp: string;
    date: string;
    type: 'buy' | 'sell';
    price: number;
    amount: number;
    total: number;
    profit: number;
    profitPercentage: number;
  }[];
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

export interface TradingSignal {
  id: string;
  coinId: string;
  type: 'buy' | 'sell' | 'hold';
  price: number;
  confidence: number;
  source: string;
  timestamp: string;
  reason: string;
}

// Settings interfaces
export interface TickerSettings {
  enabled: boolean;
  position: string;
  speed: number;
  direction: string;
  autoPause: boolean;
}

export interface SidebarSettings {
  enabled: boolean;
  position: string;
  collapsed: boolean;
  autoHide: boolean;
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
  ticker?: TickerSettings;
  sidebar?: SidebarSettings;
}

export interface WalletAccount {
  address: string;
  balance: string;
  network: string;
  provider: string;
}

// Add in RealTimeTraderProps interface
export interface RealTimeTraderProps {
  marketData: CoinOption[];
  selectedCoinId: string;
  onSelectCoin: (coinId: string) => void;
}

// Add additional interfaces for Correlation Analysis
export interface MarketCorrelationProps {
  selectedCoinId?: string;
  timeframe?: string;
}
