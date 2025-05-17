// Create or update the trading types
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  price?: number;
  value: string;
  label?: string;
  priceChange?: number;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
}

export interface FakeTradingFormProps {
  onTrade: (trade: Trade) => void;
  availableCoins: CoinOption[];
  initialCoinId?: string;
  advancedMode?: boolean;
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
  currency: string;
  total: number;
  status?: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  address: string;
  balance: number;
  currency: string;
  network: string;
  createdAt?: string;
  type?: string;
  provider?: string;
  isActive?: boolean;
  lastUpdated?: string;
  initialBalance?: number;
  trades?: Trade[];
  assets?: Array<{
    coinId: string;
    name: string;
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice?: number;
  }>;
}

export interface AITradingBot {
  id: string;
  name: string;
  description?: string;
  strategy: AITradingStrategy | string;
  status: 'active' | 'paused' | 'stopped';
  createdAt: string;
  lastRun?: string;
  model?: string;
  strategyId?: string;
  strategyName?: string;
  asset?: string;
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

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe?: string;
  riskLevel: 'low' | 'medium' | 'high';
  parameters?: Record<string, any>;
  indicators?: string[];
  performance?: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

export interface AIStrategyParameters {
  buySignalThreshold: number;
  sellSignalThreshold: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  timeframe: string;
  maxPositions: number;
}

export interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  supportedChains?: string[];
}

export interface RealTimePriceChartProps {
  coinId: string;
  timeRange: string;
  height?: number;
  width?: string;
  showControls?: boolean;
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AUD';

export interface AIModelConfig {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  apiKey?: string;
  parameters?: Record<string, any>;
}

export interface BacktestResults {
  totalTrades: number;
  winRate: number;
  profitLoss: number;
  sharpeRatio: number;
  maxDrawdown: number;
  trades: any[];
}

export interface FibonacciAnalysisProps {
  coinId: string;
  timeRange?: string;
  data?: PricePoint[];
  height?: number;
  width?: string;
}

export interface FibonacciLevels {
  level: number;
  value: number;
  color: string;
}

export interface HyblockLiquidityMapProps {
  coinId: string;
  timeframe?: string;
  width?: string;
  height?: number;
  showControls?: boolean;
}

export interface HyblockLiquidityZone {
  priceRange: [number, number];
  volume: number;
  type: 'buy' | 'sell';
  strength: number;
}

export type AlertFrequency = 'once' | 'recurring' | 'daily' | 'hourly' | '1h' | '4h' | '24h';

export interface AlertFormData {
  type: 'price' | 'volume' | 'technical';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  frequency?: AlertFrequency;
  notifyVia?: Array<"email" | "app" | "push">;
  targetPrice?: number;
  isAbove?: boolean;
  recurring?: boolean;
  percentageChange?: number;
  volumeThreshold?: number;
  indicator?: string;
  condition?: string;
  value?: number;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price?: number;
  currentPrice?: number;
  priceChange?: number;
  changePercent?: number;
  priceChangePercentage24h?: number;
  marketCap?: number;
  volume?: number;
  totalVolume?: number;
  high24h?: number;
  low24h?: number;
  market_cap?: number;
  market_cap_rank?: number;
  fully_diluted_valuation?: number;
  image?: string;
  current_price?: number;
}

export interface SettingsFormValues {
  displayName?: string;
  username?: string;
  contactEmail?: string;
  userLanguage?: string;
  theme: Theme;
  display?: {
    showPortfolio: boolean;
    showBalances?: boolean;
    compactMode: boolean;
    defaultTab?: string;
    colorScheme?: string;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
  };
  currency?: {
    defaultCurrency: SupportedCurrency;
    showConversion: boolean;
    showPriceInBTC?: boolean;
  };
  notifications?: {
    enablePush: boolean;
    enableEmail: boolean;
    alertPrice: boolean;
    alertNews: boolean;
    email?: boolean;
    push?: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
    priceAlerts?: boolean;
  };
  api?: {
    provider: string;
    refreshInterval?: number;
    key?: string;
    timeout?: number;
  };
  privacy?: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
    dataCollection: boolean;
    marketingConsent: boolean;
    thirdPartySharing: boolean;
  };
  appearance?: {
    densityMode?: 'compact' | 'comfortable' | 'spacious';
    fontScale?: number;
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
  };
  account?: {
    twoFactor?: boolean;
    loginAlerts?: boolean;
    twoFactorEnabled?: boolean;
  };
  ticker?: {
    enabled: boolean;
    position: 'top' | 'bottom';
    speed: number;
    direction: 'ltr' | 'rtl';
    coins?: string[];
    showVolume?: boolean;
    showPercentChange?: boolean;
    autoPause: boolean;
  };
  tradingPreferences?: {
    autoConfirm: boolean;
    showAdvanced?: boolean;
    defaultAsset?: string;
    defaultTradeSize?: number;
    riskLevel?: 'low' | 'medium' | 'high';
    tradingStrategy?: string;
    defaultLeverage?: number;
    showPnL?: boolean;
    defaultTimeframe?: string;
  };
  language?: string;
  email?: string;
}
