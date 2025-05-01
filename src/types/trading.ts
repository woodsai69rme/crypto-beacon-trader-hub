
// Update the types with various additions and fixes
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange?: number;
  changePercent?: number;
  image?: string;
  volume?: number;
  marketCap?: number;
  value?: string; // For select components
  label?: string; // For select components
  rank?: number;   // For market correlations
  priceAUD?: number; // For currency conversion
  priceEUR?: number; // For currency conversion
  priceGBP?: number; // For currency conversion
}

export interface CryptoChartData {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent: number;
  image?: string;
  volume?: number;
  marketCap?: number;
  rank?: number;
  // Fields for compatibility with existing code
  market_cap_rank?: number;
  current_price?: number;
  market_cap?: number;
}

export interface ExtendedTradingTimeframe {
  value: string;
  label: string;
  chartPeriod: string;
  interval: string;
  dataPoints: number;
  description: string;
  id?: string; // Added for MultiTimeframeStrategy
}

export interface WidgetGridProps {
  id: string;
  title: string;
  type: string;
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'full';
  position: { x: number; y: number };
  onRemove?: (id: string) => void;
  onUpdatePosition?: (id: string, position: { x: number; y: number }) => void;
  children?: React.ReactNode;
}

export interface WidgetListProps {
  widgets: Widget[];
  onRemove?: (id: string) => void;
}

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  position: { x: number; y: number };
  lastUpdated?: string;
  customContent?: string;
}

export type WidgetType = 
  | "price-chart" 
  | "portfolio-summary" 
  | "watchlist" 
  | "news" 
  | "trade-history" 
  | "market-overview" 
  | "performance-metrics"
  | "alerts"
  | "aiTrading"
  | "custom"
  | "trading";

export type WidgetSize = 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'full';

export interface QuantitativeAnalysisProps {
  coinId: string;
  timeframe: string;
  availableCoins: CoinOption[];
}

export interface StrategyShare {
  id: string;
  userId: string;
  username: string;
  strategyName: string;
  description: string;
  performance: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
  };
  tags: string[];
  popularity: number;
  createdAt: string;
}

export interface TradingSignal {
  id: string;
  userId: string;
  username: string;
  coinId: string;
  coinSymbol: string;
  direction: 'buy' | 'sell';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  confidence: number;
  rationale: string;
  createdAt: string;
}

export interface LocalModel {
  id: string;
  name: string;
  description: string;
  type: 'prediction' | 'sentiment' | 'trading' | 'analysis';
  endpoint: string;
  status: 'connected' | 'disconnected' | 'error';
  active: boolean;
  metadata: {
    version: string;
    author?: string;
    accuracy?: number;
    trainedOn?: string;
    lastUpdated?: string;
  };
  isConnected?: boolean;
  lastUsed?: string;
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
  onConnect: (model: LocalModel) => void;
  onDisconnect: (modelId: string) => void;
  onActivate?: (id: string) => void;
  onDeactivate?: (id: string) => void;
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AUD';

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
  currentValue?: number;
  profitLoss?: number;
  botGenerated?: boolean;
  strategyId?: string;
  fees?: number;
  coin?: string;
}

export interface TradeHistoryProps {
  trades: Trade[];
  formatCurrency: (value: number) => string;
  activeCurrency: SupportedCurrency;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  lastUpdated: string;
  isWatched: boolean;
}

export interface ApiUsageStats {
  provider: string;
  endpoint: string;
  requests: number;
  success: number;
  failed: number;
  avgLatency: number;
  lastUsed: string;
  costPerRequest: number;
  totalCost: number;
  quota: number;
  quotaReset: string;
  quotaRemaining: number;
}

export interface ApiProvider {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  website: string;
  docs: string;
  authRequired: boolean;
  apiKey: string;
  enabled: boolean;
  requiresAuth: boolean; // Same as authRequired but kept for backward compatibility
  apiKeyName: string;
  authMethod: 'header' | 'query' | 'none';
  priority: number;
  endpoints: ApiEndpoint[];
  defaultHeaders: Record<string, string>;
  rateLimit: number;
  tier: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params: Record<string, string>;
  responseType: 'json' | 'text' | 'blob';
  cacheDuration: number;
  enabled: boolean;
  description: string;
  category: string;
  rateLimit?: number;
}

// ATO Tax calculation types
export interface ATOTaxCalculation {
  year: number;
  totalIncome: number;
  taxableIncome: number;
  incomeTax: number;
  medicareLevyBase: number;
  medicareLevySurcharge: number;
  hecs: number;
  totalTaxPayable: number;
  taxRefundOwed: number;
  taxBracket: string;
  effectiveTaxRate?: number;
  marginalRate?: number;
  capitalGains?: number;
  CGTDiscount?: number;
  breakdown?: any;
}

export interface ATOTaxRate {
  min: number;
  max: number;
  base: number;
  rate: number;
  name: string;
}

export interface TaxHarvestTrade {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  amount: number;
  price: number;
  totalValue: number;
  currentValue: number;
  timestamp: string;
  id: string;
  profitLoss: number;
  type: 'buy' | 'sell';
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
}

export interface TradingFormProps {
  balance: number;
  availableCoins: CoinOption[];
  onExecuteTrade: (type: "buy" | "sell", coinId: string, amount: number) => void;
  getOwnedCoinAmount: (coinId: string) => number;
  activeCurrency: SupportedCurrency;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  conversionRate: number;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  className: string;
  darkMode: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
}
