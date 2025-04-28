
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

// Re-export LocalModel as a type
export type { TradingLocalModel };

// Define a type that merges both LocalModel definitions
export interface LocalModel {
  id: string;
  name: string;
  endpoint?: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected?: boolean;
  lastUsed?: string;
  description?: string;
  parameters?: Record<string, any>;
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
