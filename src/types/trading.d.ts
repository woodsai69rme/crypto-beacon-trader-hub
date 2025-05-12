
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
  backtestResults?: {
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  type?: string;
  parameters?: any;
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
  financialYear?: number;
  taxableIncome?: number;
  CGTDiscount?: number;
  netCapitalGains?: number;
  bracketInfo?: any;
  incomeTax?: number;
  medicareLevy?: number;
  totalTaxLiability?: number;
  taxWithheld?: number;
  taxRefundOrOwed?: number;
  transactions: {
    date: string;
    asset: string;
    quantity: number;
    costBase: number;
    proceedsAmount: number;
    gainLoss: number;
    isShortTerm: boolean;
  }[];
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
  showLabels: boolean;
  collapsed?: boolean;
  autoHide?: boolean;
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

export interface LiveAnalyticsDashboardProps {
  initialCoinId?: string;
  refreshInterval?: number;
  showDetailedView?: boolean;
  onAlertTriggered?: (alert: any) => void;
  darkMode?: boolean;
}

export interface DetachableDashboardProps {
  initialCoinId?: string;
  refreshInterval?: number;
  onClose?: () => void;
  darkMode?: boolean;
  isDetached?: boolean;
  children?: React.ReactNode;
}

export type WidgetType = 
  | 'chart' 
  | 'table' 
  | 'stats' 
  | 'news' 
  | 'alerts' 
  | 'custom' 
  | 'price-chart' 
  | 'portfolio-summary' 
  | 'watchlist' 
  | 'trading' 
  | 'aiTrading' 
  | 'aiAnalysis';

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size?: WidgetSize;
  position?: { x: number, y: number };
  customContent?: string;
}

export type WidgetSize = 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'full';

export interface WalletProvider {
  id: string;
  name: string;
  logo?: string;
  description: string;
  isInstalled: boolean;
  isConnected: boolean;
}

export interface WalletAccount {
  address: string;
  balance: string;
  network: string;
  provider: string;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
  currentUsage: number;
  maxUsage: number;
  resetTime: string;
  endpoint: string;
  status: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: string;
  parameters?: any[];
  requiresAuth: boolean;
  description: string;
}

export interface ApiUsageStats {
  service: string;
  provider?: string;
  currentUsage: number;
  maxUsage: number;
  endpoint?: string;
  resetTime?: string;
}

// Market Analysis Types
export interface MarketMetric {
  name: string;
  value: number | string;
  change: number;
  status: 'positive' | 'negative' | 'neutral';
}

export interface ProbabilityAnalysis {
  timeframe: string;
  upProbability: number;
  downProbability: number;
  neutralProbability: number;
  confidence: number;
  signals: string[];
}

export interface FibonacciAnalysisProps {
  symbol?: string;
  timeframe?: string;
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

export interface HyblockLiquidityMapProps {
  symbol?: string;
  timeframe?: string;
}

export interface HyblockLiquidityZone {
  min: number;
  max: number;
  strength: number;
  type: 'buy' | 'sell';
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolio: TradingAccount;
  benchmark?: string;
  timeframe?: string;
}

export interface SettingsFormValues {
  displayName?: string;
  email?: string;
  username?: string;
  bio?: string;
  theme?: string;
  language?: string;
  appearance?: string;
  notifications?: boolean;
  privacy?: string;
  account?: string;
  tradingPreferences?: any;
  ticker?: any;
  'sidebar.enabled'?: boolean;
  'sidebar.position'?: string;
  'sidebar.defaultCollapsed'?: boolean;
  'sidebar.showLabels'?: boolean;
  'sidebar.autoHide'?: boolean;
}
