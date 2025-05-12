
export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe: string;
  riskLevel?: string;
  parameters: {
    period?: number;
    threshold?: number;
    stopLoss?: number;
    takeProfit?: number;
    useVolume?: boolean;
    indicator?: string;
    allowWeekendTrading?: boolean;
    fastPeriod?: number;
    slowPeriod?: number;
    signalPeriod?: number;
    upperBand?: number;
    lowerBand?: number;
    riskFactor?: number;
    sentimentThreshold?: number;
    sentimentTimeframe?: string;
    [key: string]: any;
  };
  assets?: string[];
}

export interface BacktestResult {
  returns: number;
  winRate: number;
  trades: number;
  maxDrawdown: number;
  sharpeRatio?: number;
  profitFactor?: number;
  tradeHistory?: Trade[];
}

export interface OptimizationResult {
  id: string;
  strategyId: string;
  parameters: Record<string, any>;
  performance: {
    returns: number;
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  trades: number;
  timeframe: string;
  optimizationDate: string;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange?: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
  image?: string;
}

export interface Trade {
  id: string;
  timestamp: string;
  date: string;
  type: string;
  price: number;
  amount: number;
  total: number;
  profit: number;
  profitPercentage: number;
  coin: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  currency: string;
  totalValue: number; // Adding missing property
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent: number;
  value: string;
  label: string;
}
