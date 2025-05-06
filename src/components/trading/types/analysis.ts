
export interface QuantitativeAnalysisProps {
  coinId: string;
  timeframe?: string;
}

export interface MarketMetric {
  name: string;
  value: number | string;
  change: number;
  status: 'positive' | 'negative' | 'neutral';
}

export interface ProbabilityAnalysis {
  timeframe: string;
  upProbability: number;
  downProbability: number;
  neutralProbability: number;
  confidence: number;
  signals: string[];
}
