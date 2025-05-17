
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

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price?: number;
  priceChange: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
  image?: string;
  value: string;
  label: string;
}
