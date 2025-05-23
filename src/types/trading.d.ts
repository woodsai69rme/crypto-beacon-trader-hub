
// Support AUD as default currency
export type SupportedCurrency = 'AUD' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'CHF';

// Alert system types
export type AlertType = 'price' | 'volume' | 'pattern' | 'technical';
export type NotificationMethod = 'email' | 'push' | 'app';
export type AlertFrequency = 'once' | 'always' | 'daily' | 'hourly';

export interface BaseAlert {
  id: string;
  type: AlertType;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  notifyVia: NotificationMethod[];
  createdAt?: Date;
}

export interface PriceAlert extends BaseAlert {
  type: 'price';
  targetPrice: number;
  isAbove: boolean;
  recurring: boolean;
  percentageChange?: number;
}

export interface VolumeAlert extends BaseAlert {
  type: 'volume';
  targetVolume: number;
  isAbove: boolean;
}

export interface PatternAlert extends BaseAlert {
  type: 'pattern';
  pattern: string;
}

export interface TechnicalAlert extends BaseAlert {
  type: 'technical';
  indicator: string;
  threshold: number;
}

export type Alert = PriceAlert | VolumeAlert | PatternAlert | TechnicalAlert;

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
  targetVolume?: number;
  pattern?: string;
  indicator?: string;
  threshold?: number;
}

// News and ticker types
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  url: string;
}

export interface NewsTickerProps {
  items?: NewsItem[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

// Coin data types
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  price: number;
  priceChange: number;
  changePercent?: number;
  volume?: number;
  marketCap?: number;
  value?: string;
  label?: string;
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

// Dashboard and widget types
export interface DetachableDashboardProps {
  initialCoinId?: string;
  refreshInterval?: number;
  onClose: () => void;
  darkMode?: boolean;
  isDetached?: boolean;
  children?: React.ReactNode;
}

export type WidgetType = 
  | 'portfolio-summary' 
  | 'price-chart' 
  | 'watchlist' 
  | 'news' 
  | 'alerts'
  | 'trading'
  | 'aiTrading'
  | 'aiAnalysis'
  | 'custom';

export type WidgetSize = 'small' | 'medium' | 'large';

export interface Widget {
  id: string;
  position: { x: number, y: number };
  title: string;
  type: WidgetType;
  size: WidgetSize;
  customContent?: string;
}

// API and Analytics types
export interface ApiUsageStats {
  service: string;
  currentUsage: number;
  maxUsage: number;
  endpoint: string;
  resetTime: string;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  requiresAuth: boolean;
  apiKey?: string;
  isActive: boolean;
  endpoints: ApiEndpoint[];
}

export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: string;
  requiresAuth: boolean;
}

export interface LiveAnalyticsDashboardProps {
  initialCoinId?: string;
  refreshInterval?: number;
  showDetailedView?: boolean;
  onAlertTriggered?: (alert: any) => void;
  darkMode?: boolean;
}

// Trading and Portfolio types
export interface TradingAccount {
  id: string;
  name: string;
  type?: 'paper' | 'exchange' | 'wallet';
  provider?: string;
  balance: number;
  currency: SupportedCurrency;
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
  assets?: PortfolioAsset[];
  lastUpdated?: string;
}

export interface PortfolioAsset {
  id?: string;
  coinId: string;
  coinSymbol: string;
  coinName: string;
  amount: number;
  averagePrice: number;
  value?: number;
  symbol?: string;
  name?: string;
  price?: number;
  allocation?: number;
  change24h?: number;
  changePercent24h?: number;
}

// Trading form props
export interface TradingFormProps {
  selectedCoin?: CoinOption;
  onTrade?: (trade: Trade) => void;
  initialValues?: Partial<{
    type: 'buy' | 'sell';
    amount: number;
    price: number;
  }>;
}

// Fake trading form props
export interface FakeTradingFormProps {
  selectedCoin?: CoinOption;
  onTrade?: (trade: Trade) => void;
}

// AI Trading types
export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'breakout' | 'sentiment' | 'machine-learning' | 'multi-timeframe' | 'traditional' | 'ai-predictive' | 'hybrid' | 'custom';
  timeframe: string;
  parameters: {
    riskLevel: string;
    strategyType?: string;
    backtestResults?: {
      winRate: number;
      profitFactor: number;
      sharpeRatio: number;
      drawdown: number;
      returns: number;
    }
  };
  tags?: string[];
  creator?: string;
  riskLevel?: string;
  indicators?: string[];
}

export interface Trade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: 'buy' | 'sell' | 'hold';
  amount: number;
  price: number;
  totalValue: number;
  timestamp: string;
  currency: string;
  botGenerated?: boolean;
  strategyId?: string;
  fees?: number;
  coin?: string;
  total: number;
}

// Local Model types
export interface LocalModel {
  id: string;
  name: string;
  type: 'cloud' | 'local' | 'api' | 'prediction' | 'sentiment' | 'trading' | 'analysis';
  endpoint: string;
  apiKey?: string;
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
  onConnect: (model: LocalModel) => void;
  onDisconnect: (modelId: string) => void;
  onDelete?: (modelId: string) => void;
  onSelect?: (model: LocalModel) => void;
}

// Enhanced Portfolio Benchmarking Props
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioData?: any;
  benchmarks?: string[];
  timeframe?: string;
  portfolioPerformance?: number[];
  portfolioDates?: string[];
}

// Context types
export interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  formatCurrency: (amount: number) => string;
  activeCurrency: SupportedCurrency;
  setActiveCurrency: (currency: SupportedCurrency) => void;
}

// Settings types
export interface SettingsFormValues {
  theme: string;
  currency: SupportedCurrency;
  language: string;
  bio?: string;
  notifications: {
    email: boolean;
    push: boolean;
    app: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
  };
  tickerSettings: {
    enabled: boolean;
    position: 'top' | 'bottom' | 'both';
    speed: number;
    direction: 'left' | 'right';
  };
  sidebarSettings: {
    enabled: boolean;
    position: 'left' | 'right';
    defaultCollapsed: boolean;
  };
  ticker?: {
    enabled: boolean;
    position: string;
    speed: number;
    direction: string;
    autoPause: boolean;
  };
  sidebar?: {
    enabled: boolean;
    position: string;
    collapsed: boolean;
    showLabels: boolean;
    autoHide?: boolean;
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
  };
  account?: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
  email?: string;
  username?: string;
  displayName?: string;
  apiKeys?: Record<string, string>;
}

export interface SettingsComponentProps {
  form: any; // Specific type should be provided based on the form library in use
}

export interface ModelPerformanceProps {
  model: LocalModel;
  performance: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  isRunning?: boolean;
  performanceData?: any;
}

// Tax calculation types
export interface TaxBracket {
  bracket: string;
  rate: string;
  min: number;
  max: number;
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
  bracketInfo?: TaxBracket;
  incomeTax?: number;
  medicareLevy?: number;
  totalTaxLiability?: number;
  taxWithheld?: number;
  taxRefundOrOwed?: number;
}
