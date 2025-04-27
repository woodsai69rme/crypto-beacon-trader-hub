
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
  botGenerated?: boolean;
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceAUD?: number;
}

export interface CurrencyConversion {
  USD_AUD: number;
  AUD_USD: number;
  lastUpdated: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  initialBalance: number;
  currency: string;
  trades: Trade[];
  createdAt: string;
}

export interface BacktestTrade {
  id: string;
  timestamp: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  profit?: number;
  profitPercentage?: number;
}

// Widget types
export type WidgetSize = 'small' | 'medium' | 'large' | 'full';
export type WidgetType = 'trading' | 'aiTrading' | 'multiExchange' | 'education' | 'community' | 'aiAnalysis' | 'custom';

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  customContent?: string;
}

// AI Trading Strategy types
export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  tags: string[];
  performance?: {
    winRate: number;
    profitFactor: number;
    sharpeRatio?: number;
    maxDrawdown: number;
    averageProfit?: number;
  };
  parameters: StrategyParameter[];
  suitableFor?: string[];
  riskLevel?: 'low' | 'medium' | 'high';
  timeframes: TradingTimeframe[];
  indicators: TechnicalIndicator[];
  backtest?: BacktestResult;
}

export interface StrategyParameter {
  id: string;
  name: string;
  description: string;
  type: 'number' | 'boolean' | 'string' | 'select';
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export interface TechnicalIndicator {
  name: string;
  period: number;
  params?: Record<string, any>;
}

export type TradingTimeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M';

export interface BacktestResult {
  startDate: string;
  endDate: string;
  initialBalance: number;
  finalBalance: number;
  profit: number;
  profitPercentage: number;
  maxDrawdown: number;
  winRate: number;
  trades: BacktestTrade[];
  sharpeRatio?: number;
  profitFactor?: number;
  averageProfit?: number;
  averageLoss?: number;
}

export interface OptimizationResult {
  strategyId: string;
  parameterValues: Record<string, any>;
  performance: {
    profit: number;
    profitPercentage: number;
    maxDrawdown: number;
    winRate: number;
    sharpeRatio?: number;
    profitFactor?: number;
  };
  improvement: number;
}
