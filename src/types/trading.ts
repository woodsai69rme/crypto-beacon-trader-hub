
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
  profitLoss?: number;
  currentValue?: number;
  botGenerated?: boolean;
  strategyId?: string;
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceAUD?: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalProfitLoss: number;
  isProfitPositive: boolean;
  percentageChange: number;
  currency: 'USD' | 'AUD';
}

export interface CurrencyConversion {
  USD_AUD: number;
  AUD_USD: number;
  lastUpdated: string;
}

export type WidgetType = 'trading' | 'aiTrading' | 'multiExchange' | 'education' | 'community' | 'aiAnalysis' | 'custom';
export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position: number;
  customContent?: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  initialBalance: number;
  trades: Trade[];
  createdAt: string;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'ai' | 'traditional' | 'hybrid';
  color: string;
  indicators: string[];
  timeframes: string[];
  riskLevel: string;
  parameters: StrategyParameter[];
  stats: {
    winRate: number;
    averageReturn: number;
    riskLevel: string;
    maxDrawdown: number;
  };
  model?: string;
  author?: string;
  creationDate?: string;
  version?: string;
  public?: boolean;
  tags?: string[];
  complexity?: string;
}

export interface StrategyParameter {
  name: string;
  label: string;
  type: 'number' | 'boolean' | 'string' | 'select';
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: {label: string; value: any}[];
  description?: string;
}

export interface BacktestResult {
  strategyId: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  averageProfit: number;
  averageLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  trades: BacktestTrade[];
  equity: {date: string; value: number}[];
  parameters: Record<string, any>;
}

export interface BacktestTrade {
  id: string;
  date: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  value: number;
  profitLoss?: number;
  profitLossPercentage?: number;
  reason?: string;
}

export interface OptimizationResult {
  parameters: Record<string, any>;
  performance: {
    totalReturn: number;
    winRate: number;
    maxDrawdown: number;
    sharpeRatio: number;
    profitFactor: number;
  };
}

export interface TradingTimeframe {
  label: string;
  value: string;
  minutes: number;
  description?: string;
}

export interface TechnicalIndicator {
  name: string;
  key: string;
  description: string;
  parameters: StrategyParameter[];
  category: 'trend' | 'momentum' | 'volatility' | 'volume' | 'oscillator' | 'support/resistance' | 'custom';
}
