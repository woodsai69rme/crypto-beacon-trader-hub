
import { LocalModel as TradingLocalModel } from '@/types/trading';

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  type: "ai-predictive" | "traditional" | "hybrid" | "trend-following" | "mean-reversion" | "breakout" | "sentiment" | "machine-learning" | "multi-timeframe";
  riskLevel: "low" | "medium" | "high";
  timeframe: string;
  indicators: string[];
  parameters: {
    [key: string]: any;
  };
}

// Define a full LocalModel interface that has all the properties needed
export interface LocalModel {
  id: string;
  name: string;
  description?: string;
  endpoint?: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected?: boolean;
  lastUsed?: string;
  performance?: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  status?: 'active' | 'inactive' | 'training';
  creator?: string;
  fileSize?: number;
  version?: string;
}
