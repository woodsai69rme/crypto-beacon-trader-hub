
import { LocalModel } from '@/types/trading';

// Define interfaces for model trading
export interface ModelTradingProps {
  initialCoins: string[];
  onTrade?: (trade: any) => void;
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  parameters: ModelParameter[];
  defaultValues: Record<string, any>;
}

export interface ModelParameter {
  id: string;
  name: string;
  description?: string;
  type: 'number' | 'boolean' | 'select' | 'range';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  default: any;
}

export interface ModelResult {
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  suggestedAmount?: number;
  suggestedPrice?: number;
  timestamp: string;
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
}

export interface BacktestTrade {
  date: string;
  action: 'buy' | 'sell';
  price: number;
  amount: number;
  balance: number;
  profit?: number;
}

export interface ModelTradingContextType {
  activeModel: string;
  setActiveModel: (modelId: string) => void;
  modelConfig: Record<string, any>;
  updateModelConfig: (config: Record<string, any>) => void;
  isModelRunning: boolean;
  startModel: () => void;
  stopModel: () => void;
  modelResults: ModelResult[];
  backtestResults: BacktestResult | null;
  runBacktest: (days: number) => Promise<void>;
}

export interface ModelPerformanceProps {
  model: LocalModel;
  performance: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}
