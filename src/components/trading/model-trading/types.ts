
import { LocalModel } from '@/types/trading';

// Re-export the LocalModel type
export { LocalModel };

export interface ModelConnectionTabProps {
  models: LocalModel[];
  onConnect: (model: LocalModel) => void;
  onDisconnect: (modelId: string) => void;
}

export interface ModelGenerationTabProps {
  onModelGenerated: (model: LocalModel) => void;
}

export interface ModelRunningTabProps {
  selectedModel: LocalModel | null;
  isRunning: boolean;
  onStartModel: (model: LocalModel) => void;
  onStopModel: () => void;
}

export interface ModelConfigurationProps {
  defaultConfig?: Record<string, any>;
  onSaveConfig: (config: Record<string, any>) => void;
}

export interface ModelPerformanceProps {
  model: LocalModel;
  isRunning: boolean;
  performanceData?: any;
}
