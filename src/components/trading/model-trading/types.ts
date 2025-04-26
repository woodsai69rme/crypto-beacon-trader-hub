
export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected: boolean;
  lastUsed?: string;
}

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
