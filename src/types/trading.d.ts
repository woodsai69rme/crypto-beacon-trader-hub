
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
  type?: 'exchange' | 'wallet' | 'manual';
}

export interface TradingFormProps {
  onAddTrade: (trade: Trade) => void;
  defaultValues?: Partial<Trade>;
  balance?: number;
  availableCoins?: CoinOption[];
  onTrade?: (trade: Trade) => void;
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
  profitPotential: 'low' | 'medium' | 'high';
  timeframe: string;  // Changed from enum to string to support '1h', '4h', etc.
  indicators: string[];
  triggers: string[];
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

export interface SettingsFormValues {
  currency: {
    defaultCurrency: SupportedCurrency;
    showPriceInBTC: boolean;
  };
  api: {
    selectedProvider: string;
    refreshInterval: number;
    timeout: number;
  };
  display: {
    theme: string;
    compactMode: boolean;
    showAllDecimals: boolean;
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
