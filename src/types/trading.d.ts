
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
}

export type SupportedCurrency = 'USD' | 'AUD' | 'EUR' | 'GBP';

export interface TradingAccount {
  id: string;
  name: string;
  trades: Trade[];
  balance: number;
  currency: SupportedCurrency;
  createdAt: string;
  type?: 'live' | 'paper' | 'demo';
  provider?: string;
  assets?: PortfolioAsset[];
  lastUpdated?: string;
  isActive?: boolean;
  initialBalance?: number;
}

export interface PortfolioAsset {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  amount: number;
  averageBuyPrice: number;
  currentPrice?: number;
}

export interface TradingFormProps {
  onAddTrade: (trade: Trade) => void;
  defaultValues?: Partial<Trade>;
}

export interface FakeTradingFormProps extends TradingFormProps {
  advancedMode?: boolean;
}

export interface QuantitativeAnalysisProps {
  coinId: string;
  timeframe?: string;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  profitPotential: 'low' | 'medium' | 'high';
  timeframe: 'short' | 'medium' | 'long';
  indicators: string[];
  triggers: string[];
  implementation?: string;
  recommendation?: string;
  confidence?: number;
  parameters?: Record<string, any>;
  tags?: string[];
  backtestResults?: {
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
}

export interface AIStrategyPerformance {
  winRate?: number;
  profitLoss?: number;
  sharpeRatio?: number;
  maxDrawdown?: number;
  totalTrades?: number;
  profitFactor?: number;
  averageProfit?: number;
  accuracy?: number;
}

export interface AiBotTradingProps {
  tradingBot: AITradingStrategy;
  onStart: (botId: string, config: any) => void;
  onStop: (botId: string) => void;
  isRunning: boolean;
  performance?: {
    totalTrades: number;
    winRate: number;
    profitLoss: number;
    startDate: string;
  };
}

export interface ATOTaxCalculation {
  year: number;
  gains: number;
  losses: number;
  netPosition: number;
  taxableAmount: number;
  taxOwed: number;
  effectiveTaxRate: number;
  transactions: {
    date: string;
    asset: string;
    quantity: number;
    costBase: number;
    proceedsAmount: number;
    gainLoss: number;
    isShortTerm: boolean;
  }[];
  financialYear?: string;
  taxableIncome?: number;
  CGTDiscount?: number;
  netCapitalGains?: number;
  bracketInfo?: string;
  incomeTax?: number;
  medicareLevy?: number;
  totalTaxLiability?: number;
  taxWithheld?: number;
  taxRefundOrOwed?: number;
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
  collapsed?: boolean;
  showLabels: boolean;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  image?: string;
  marketCap?: number;
  volume?: number;
  changePercent?: number;
}

export interface RealTimePricesProps {
  initialCoins: CoinOption[];
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string;
  refreshInterval?: number;
}

export interface RealTimePriceChartProps {
  coinId: string;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins: CoinOption[];
  updateInterval?: number;
}

export interface Widget {
  id: string;
  type: string;
  title: string;
  config?: any;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  url: string;
  published_at?: string;
}

export interface NewsTickerProps {
  items: NewsItem[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

export type WidgetType = string;

export interface SettingsFormValues {
  theme: string;
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    app: boolean;
  };
  tickerSettings: TickerSettings;
  sidebarSettings: SidebarSettings;
}

export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  apiKey?: string;
  type: 'local' | 'cloud';
  status: 'connected' | 'disconnected' | 'error';
  description?: string;
  isDefault?: boolean;
  lastUsed?: string;
  contextSize?: number;
  maxTokens?: number;
}

export interface ModelListProps {
  models: LocalModel[];
  onSelect: (modelId: string) => void;
  onAdd: () => void;
  onEdit: (modelId: string) => void;
  onDelete: (modelId: string) => void;
  selectedModelId?: string;
}

export interface ModelPerformanceProps {
  modelId: string;
  timeframe?: '1d' | '1w' | '1m' | 'all';
}

// Alert types
export type AlertType = 'price' | 'volume' | 'news' | 'pattern' | 'whale';
export type AlertFrequency = 'once' | 'daily' | 'always';
export type NotificationMethod = 'email' | 'app' | 'push';

export interface AlertBase {
  id: string;
  type: AlertType;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  notifyVia: NotificationMethod[];
  createdAt: Date;
}

export interface PriceAlert extends AlertBase {
  type: 'price';
  targetPrice: number;
  isAbove: boolean;
  recurring: boolean;
  percentageChange?: number;
}

export interface VolumeAlert extends AlertBase {
  type: 'volume';
  volumeThreshold: number;
  frequency: AlertFrequency;
}

export interface NewsAlert extends AlertBase {
  type: 'news';
  keywords: string[];
  sources?: string[];
  sentiment?: 'positive' | 'negative' | 'any';
}

export interface PatternAlert extends AlertBase {
  type: 'pattern';
  pattern: string;
  timeframe: string;
  confirmationNeeded: boolean;
}

export interface WhaleAlert extends AlertBase {
  type: 'whale';
  threshold: number;
  trackExchanges: boolean;
  trackWallets: boolean;
}

export type AlertData = PriceAlert | VolumeAlert | NewsAlert | PatternAlert | WhaleAlert;

export interface AlertFormData {
  type: AlertType;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  notifyVia: NotificationMethod[];
  targetPrice?: number;
  isAbove?: boolean;
  recurring?: boolean;
  percentageChange?: number;
  volumeThreshold?: number;
  frequency?: AlertFrequency;
  keywords?: string[];
  sources?: string[];
  sentiment?: 'positive' | 'negative' | 'any';
  pattern?: string;
  timeframe?: string;
  confirmationNeeded?: boolean;
  threshold?: number;
  trackExchanges?: boolean;
  trackWallets?: boolean;
}

export interface ApiProvider {
  id: string;
  name: string;
  type: 'exchange' | 'data' | 'news';
  apiKey: string;
  apiSecret?: string;
  status: 'active' | 'inactive' | 'error';
  lastUsed?: Date;
  rateLimit?: number;
  tier?: 'free' | 'basic' | 'pro' | 'enterprise';
}

export interface ApiUsageStats {
  provider: string;
  calls: number;
  quota: number;
  resetTime: string;
  lastCalled: string;
}

export interface EnhancedPortfolioBenchmarkingProps {
  coins: CoinOption[];
  timeframe?: '1d' | '1w' | '1m' | '3m' | '1y' | 'all';
  portfolioPerformance?: {
    totalValue: number;
    profitLoss: number;
    profitLossPercentage: number;
    history: Array<{
      timestamp: string;
      value: number;
    }>;
  };
}
