
import { LocalModel as BaseLocalModel } from "@/types/trading";

export type LocalModel = BaseLocalModel;

export interface ModelStatus {
  isRunning: boolean;
  lastStarted?: Date;
  lastStopped?: Date;
  performance?: {
    accuracy: number;
    predictions: number;
    successRate: number;
  };
}

export interface ModelPerformanceProps {
  model: LocalModel;
}
