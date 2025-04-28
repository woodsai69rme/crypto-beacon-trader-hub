
import { LocalModel } from '@/types/trading';

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  type: "ai-predictive" | "traditional" | "hybrid";
  riskLevel: "low" | "medium" | "high";
  timeframe: string;
  indicators: string[];
  parameters: {
    [key: string]: any;
  };
}

// Re-export LocalModel as a type
export type { LocalModel };
