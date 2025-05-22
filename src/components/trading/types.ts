
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
  total: number;
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

export type CoinOption = {
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
  value: string;
  label: string;
};

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
  timeframe: string;  // Using string to support '1h', '4h', '1d', etc.
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
