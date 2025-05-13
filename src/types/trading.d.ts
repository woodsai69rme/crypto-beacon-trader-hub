
// Define interfaces for the trading module
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  image?: string;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
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
  timestamp: string;
  currency: SupportedCurrency;
  botGenerated?: boolean;
  tags?: string[];
  total: number;
  strategyId?: string;
  fees?: number;
  currentValue?: number;
  profitLoss?: number;
}

export type SupportedCurrency = 'AUD' | 'USD' | 'EUR' | 'GBP';

export interface TradingAccount {
  id: string;
  name: string;
  trades: Trade[];
  balance: number;
  currency: SupportedCurrency;
  createdAt: string;
  provider?: string;
  assets?: Record<string, number>;
  lastUpdated?: string;
  isActive?: boolean;
  type?: 'exchange' | 'wallet' | 'manual' | 'ai';
  initialBalance?: number;
}

export interface TradingFormProps {
  onAddTrade?: (trade: Trade) => void;
  defaultValues?: Partial<Trade>;
  balance?: number;
  availableCoins?: CoinOption[];
  onTrade?: (coinId: string, type: 'buy' | 'sell', amount: number, price: number) => void;
  getOwnedCoinAmount?: (coinId: string) => number;
  activeCurrency?: SupportedCurrency;
  onCurrencyChange?: (currency: SupportedCurrency) => void;
  conversionRate?: number;
}

export interface FakeTradingFormProps extends TradingFormProps {
  advancedMode?: boolean;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  profitPotential?: 'low' | 'medium' | 'high';
  timeframe: string;  // Changed from enum to string to support '1h', '4h', etc.
  indicators: string[];
  triggers?: string[];
  implementation?: string;
  recommendation?: string;
  confidence?: number;
  backtestResults?: {
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  type?: string;
  parameters?: any;
  tags?: string[];
}

// Define the PricePoint interface
export interface PricePoint {
  time: number;
  price: number;
  volume?: number;
  marketCap?: number;
}

export interface SettingsFormValues {
  currency: {
    defaultCurrency: SupportedCurrency;
    showPriceInBTC: boolean;
  };
  api: {
    provider: string;
    key: string;
    selectedProvider?: string;
    refreshInterval?: number;
    timeout?: number;
  };
  display: {
    theme?: string;
    showPortfolio: boolean;
    defaultTab: string;
    compactMode: boolean;
    showAllDecimals?: boolean;
  };
  displayName?: string;
  email?: string;
  username?: string;
  language?: string;
  theme?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
    priceAlerts?: boolean;
  };
  tradingPreferences?: {
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
  onSelect: (model: LocalModel) => void;
  onConnect: (model: LocalModel) => void;
  onDisconnect: (modelId: string) => void;
}

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  position?: { x: number, y: number };
  size?: WidgetSize;
  config?: any;
}

export type WidgetType = 
  | 'portfolio-summary'
  | 'price-chart'
  | 'watchlist'
  | 'news'
  | 'alerts'
  | 'ai-insights'
  | 'market-overview'
  | 'trading-signals'
  | 'correlation-matrix'
  | 'performance-tracker';

export type WidgetSize = 'small' | 'medium' | 'large';

export interface RealTimePricesProps {
  coins?: CoinOption[];
  refreshInterval?: number;
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string;
}

export interface WalletConnectionProps {
  onConnect: (account: WalletAccount) => void;
  supportedWallets: WalletProvider[];
}

export interface WalletAccount {
  address: string;
  balance: string;
  network: string;
  provider: string;
}

export interface WalletProvider {
  id: string;
  name: string;
  logo?: string;
  description: string;
  isInstalled: boolean;
  isConnected: boolean;
  enabled?: boolean;
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe: string;
  parameters: any;
  performance?: {
    winRate?: number;
    profitFactor?: number;
    drawdown?: number;
    volatility?: number;
  };
}

export interface PaperTradingConfig {
  enabled: boolean;
  initialBalance: number;
  currency: SupportedCurrency;
  slippageModel: 'none' | 'simple' | 'realistic';
  slippagePercentage?: number;
  maxTradeSize?: number;
  includeFees: boolean;
  feePercentage?: number;
}

export interface AIStrategyParameters {
  buySignalThreshold?: number;
  sellSignalThreshold?: number;
  stopLossPercentage?: number;
  takeProfitPercentage?: number;
  maxOpenPositions?: number;
  positionSizePercentage?: number;
  timeframes?: string[];
  indicators?: Record<string, any>;
}

export interface AIModelConfig {
  model: string;
  provider: string;
  endpoint?: string;
  apiKey?: string;
  parameters?: {
    temperature?: number;
    topP?: number;
    maxTokens?: number;
  };
}

export interface BacktestResults {
  strategyId: string;
  startDate: string;
  endDate: string;
  trades: Trade[];
  initialBalance: number;
  finalBalance: number;
  returns: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  averageProfitPerTrade: number;
  averageLossPerTrade: number;
  profitTrades: number;
  lossTrades: number;
  currency: SupportedCurrency;
}
