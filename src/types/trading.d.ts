
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
}

export type SupportedCurrency = 'USD' | 'AUD' | 'EUR' | 'GBP';

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
  total: number;
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
  onCoinSelect?: (coinId: string) => void;
  selectedCoinId?: string;
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
    maxDrawdown?: number;
    sharpeRatio: number;
    drawdown?: number;
    returns?: number;
  };
  type?: string;
  parameters?: any;
  tags?: string[];
}

export interface SettingsFormValues {
  currency: {
    defaultCurrency: SupportedCurrency;
    showPriceInBTC: boolean;
  };
  api: {
    provider: string;
    key: string;
    refreshInterval?: number;
    timeout?: number;
    selectedProvider?: string;
  };
  display?: {
    theme?: string;
    showPortfolio: boolean;
    defaultTab: string;
    compactMode: boolean;
    showAllDecimals?: boolean;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
    colorScheme?: string;
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
  | 'performance-tracker'
  | 'trading'
  | 'aiTrading'
  | 'aiAnalysis';

export type WidgetSize = 'small' | 'medium' | 'large';

// Add the missing PricePoint interface
export interface PricePoint {
  time: number;
  price: number;
  volume?: number;
  marketCap?: number;
}

// Added missing interfaces
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

export interface BacktestResult {
  startDate: string;
  endDate: string;
  initialBalance: number;
  finalBalance: number;
  roi: number;
  trades: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio: number;
  strategy: AITradingStrategy;
  transactions: BacktestTransaction[];
}

export interface BacktestTransaction {
  date: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  balanceAfter: number;
  reason: string;
}

export interface WalletAccount {
  id?: string;
  type: string;
  address: string;
  balance: number;
  network: string;
  provider?: string;
}

export interface WalletProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  isInstalled: boolean;
  isConnected: boolean;
  supported?: boolean;
}

export interface OpenRouterOptions {
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface BotExecutionOptions {
  useRealTrading: boolean;
  maxInvestmentPerTrade: number;
  stopLossPercentage?: number;
  takeProfitPercentage?: number;
  timeframe: string;
}

export interface ToastOptions {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

// Add missing CryptoData interface
export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price?: number;
  priceChange: number;  // Required field
  image?: string;
  marketCap?: number;
  volume?: number;
  changePercent?: number;
}

// Add enhanced portfolio benchmarking props
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioId?: string;
  timeframe?: string;
  comparisonAssets?: string[];
  showDetailedView?: boolean;
}

// Add ATOTaxCalculation interface
export interface ATOTaxCalculation {
  financialYear: string;
  taxableIncome: number;
  CGTDiscount: number;
  netCapitalGains: number;
  bracketInfo: string;
  incomeTax: number;
  medicareLevy: number;
  totalTaxLiability: number;
  taxWithheld: number;
  taxRefundOrOwed: number;
}

// Add OpenRouterRequest interface
export interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

// Add WidgetComponentProps interface
export interface WidgetComponentProps {
  widget: Widget;
  onRemove?: (id: string) => void;
}
