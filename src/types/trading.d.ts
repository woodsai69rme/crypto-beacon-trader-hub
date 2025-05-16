
// Define the basic trading types for the application

export interface PricePoint {
  price: number;
  timestamp: number;
  date: string; // ISO string representation
  volume?: number;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'trend' | 'mean-reversion' | 'breakout' | 'momentum' | 'pattern' | 'arbitrage' | 'sentiment' | 'grid' | 'custom';
  timeframe?: string;
  pairs: string[];
  riskLevel: 'low' | 'medium' | 'high';
  aiModel: string;
  params?: Record<string, any>;
  backtest?: {
    returns: number;
    drawdown: number;
    winRate: number;
    tradesCount: number;
  }
}

export interface AIStrategyParameters {
  buySignalThreshold: number;
  sellSignalThreshold: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  maxOpenPositions: number;
  positionSizePercentage: number;
}

export interface PaperTradingConfig {
  enabled: boolean;
  initialBalance: number;
  currency: string;
  slippageModel: 'none' | 'simple' | 'realistic';
  slippagePercentage?: number;
  maxTradeSize: number;
  includeFees: boolean;
  feePercentage?: number;
}

export interface AITradingBot {
  id: string;
  name: string;
  strategy: AITradingStrategy;
  pair: string;
  status: 'running' | 'paused' | 'stopped' | 'error';
  profitLoss: number;
  totalTrades: number;
  created: string;
  lastModified: string;
}

export interface WalletAccount {
  address: string;
  balance: string;
  network: string;
  provider: string;
}

export interface WalletProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  isInstalled: boolean;
  isConnected: boolean;
}
