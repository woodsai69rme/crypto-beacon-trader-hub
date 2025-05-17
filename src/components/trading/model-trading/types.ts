
import { LocalModel } from "@/types/trading";

export interface ModelRunningTabProps {
  activeModels: LocalModel[];
  inactiveModels: LocalModel[];
  onActivateModel: (modelId: string) => void;
  onDeactivateModel: (modelId: string) => void;
  isLoading?: boolean;
}

export interface ModelPerformanceProps {
  model: LocalModel;
}

export interface ModelPerformanceData {
  accuracy: number;
  returns: number;
  predictions: number; 
  successRate: number;
  lastUpdated: string;
}
