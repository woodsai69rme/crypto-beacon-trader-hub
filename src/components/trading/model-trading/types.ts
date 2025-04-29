
import { LocalModel } from "@/types/trading";

export type { LocalModel };

// Add any additional model-specific types here
export interface ModelPerformanceMetrics {
  accuracy: number;
  returns: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface ModelTrainingConfig {
  epochs: number;
  batchSize: number;
  learningRate: number;
  validationSplit: number;
}
