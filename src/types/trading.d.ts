
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
  strategyId?: string;
  tags?: string[];
  total: number;
  fees?: number;
  coin?: string;
}

export type SupportedCurrency = 'USD' | 'AUD' | 'EUR' | 'GBP';

export interface TradingAccount {
  id: string;
  name: string;
  trades: Trade[];
  balance: number;
  currency: SupportedCurrency;
  createdAt: string;
  type?: string;
  provider?: string;
  assets?: PortfolioAsset[];
  lastUpdated?: string;
  isActive?: boolean;
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
  timeframe: string;
  indicators: string[];
  triggers: string[];
  implementation?: string;
  recommendation?: string;
  confidence?: number;
  type?: string;
  parameters?: any;
  backtestResults?: {
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
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

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
}

export interface BacktestResult {
  startDate: string;
  endDate: string;
  initialBalance: number;
  finalBalance: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: BacktestTrade[];
  profit?: number;
  profitPercentage?: number;
  averageProfit?: number;
  averageLoss?: number;
  initialCapital?: number;
  finalCapital?: number;
  totalReturn?: number;
  sortinoRatio?: number;
}

export interface BacktestTrade {
  id?: string;
  date: string;
  type?: 'buy' | 'sell';
  action?: 'buy' | 'sell';
  price: number;
  amount: number;
  profit?: number;
  profitPercentage?: number;
  balance?: number;
  total?: number;
  timestamp?: string;
}

export interface OptimizationResult {
  strategyId: string;
  parameterValues: Record<string, any>;
  performance: {
    profit: number;
    profitPercentage: number;
    maxDrawdown: number;
    winRate: number;
    sharpeRatio: number;
    profitFactor: number;
    totalReturn: number;
  };
  improvement: number;
}

export interface PortfolioAsset {
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
  price: number;
  value: number;
  allocation: number;
  change24h: number;
  changePercent24h: number;
}

export type WidgetType = 'chart' | 'table' | 'stats' | 'news' | 'alerts' | 'custom' | 
  'price-chart' | 'portfolio-summary' | 'watchlist' | 'trading' | 'aiTrading' | 'aiAnalysis';

export interface SettingsFormValues {
  displayName?: string;
  email?: string;
  username?: string;
  bio?: string;
  theme?: string;
  language?: string;
  appearance?: {
    colorScheme?: string;
    compactMode?: boolean;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
  };
  notifications?: {
    email?: boolean;
    push?: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
  };
  privacy?: {
    showOnlineStatus?: boolean;
    sharePortfolio?: boolean;
    shareTrades?: boolean;
    dataCollection?: boolean;
    marketingConsent?: boolean;
    thirdPartySharing?: boolean;
  };
  account?: {
    twoFactorEnabled?: boolean;
    loginAlerts?: boolean;
  };
  tradingPreferences?: {
    autoConfirm?: boolean;
    showAdvanced?: boolean;
    defaultAsset?: string;
  };
  ticker?: {
    enabled?: boolean;
    position?: string;
    speed?: number;
    direction?: string;
    autoPause?: boolean;
  };
  sidebar?: {
    enabled?: boolean;
    position?: string;
    collapsed?: boolean;
    showLabels?: boolean;
  };
}
