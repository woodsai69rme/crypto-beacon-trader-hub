import { SupportedCurrency } from "@/types/trading";

export type Trade = {
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
  quantity?: number;
  symbol?: string;
  total?: number;
};

export type CoinOption = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceAUD?: number;
  priceEUR?: number; 
  priceGBP?: number;
  image?: string;
  priceChange?: number;
  changePercent?: number;
  change24h?: number;
  volume?: number;
  marketCap?: number;
  rank?: number;
  value: string;
  label: string;
};

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

export interface FibonacciLevels {
  level0: number;
  level236: number;
  level382: number;
  level500: number;
  level618: number;
  level786: number;
  level1000: number;
}

export interface FibonacciAnalysisProps {
  symbol?: string;
  timeframe?: string;
}

export interface HyblockLiquidityZone {
  min: number;
  max: number;
  strength: number;
  type: 'buy' | 'sell';
}

export interface HyblockLiquidityMapProps {
  symbol?: string;
  timeframe?: string;
}

export interface AiBotTradingProps {
  botId: string;
  strategyId: string;
  strategyName: string;
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
  profit: number;
  profitPercentage: number;
  maxDrawdown: number;
  winRate: number;
  trades: {
    id: string;
    timestamp: string;
    date: string;
    type: 'buy' | 'sell';
    price: number;
    amount: number;
    total: number;
    profit: number;
    profitPercentage: number;
  }[];
  sharpeRatio: number;
  profitFactor: number;
  averageProfit: number;
  averageLoss: number;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  sortinoRatio: number;
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

export interface StrategyParameter {
  id: string;
  name: string;
  description: string;
  type: "number" | "boolean" | "select" | "string";
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export type AITradingStrategy = {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'breakout' | 'sentiment' | 'machine-learning' | 'multi-timeframe' | 'traditional' | 'ai-predictive' | 'hybrid' | 'custom';
  timeframe: string;
  parameters: any;
  riskLevel?: string;
  indicators?: string[];
  performance?: {
    winRate?: number;
    profitFactor?: number;
    sharpeRatio?: number;
    trades?: number;
    profitLoss?: number;
    drawdown?: number;
    returns?: number;
  };
  creator?: string;
  tags?: string[];
};

export interface ExtendedTradingTimeframe {
  id: string;
  label: string;
  value: string;
  description: string;
  candleCount?: number;
  defaultIndicators?: string[];
}

export interface TradingSignal {
  id: string;
  coinId: string;
  type: 'buy' | 'sell' | 'hold';
  price: number;
  confidence: number;
  source: string;
  timestamp: string;
  reason: string;
}

export interface StrategyShare {
  id: string;
  strategyId: string;
  strategyName: string;
  userId: string;
  username: string;
  description: string;
  performance: {
    winRate: number;
    returns: number;
    trades: number;
  };
  likes: number;
  timestamp: string;
}

export interface QuantitativeAnalysisProps {
  symbol: string;
  timeframe: string;
  depth?: number;
}

export interface RealTimePriceChartProps {
  selectedCoinId: string;
  onSelectCoin: (coinId: string) => void;
  coinId?: string;
  availableCoins?: CoinOption[];
}
