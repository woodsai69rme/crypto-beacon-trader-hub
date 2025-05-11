
import type { LocalModel } from '@/types/trading';

// Re-export the LocalModel type
export type { LocalModel };

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
  performanceData?: Record<string, any>;
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
}

export interface ModelMetricsProps {
  model: LocalModel;
  metrics: {
    accuracy: number;
    reliability: number;
    speed: number;
    efficiency: number;
  };
}

export interface ModelHistoryItemProps {
  date: string;
  operation: 'start' | 'stop' | 'config' | 'error';
  details: string;
}
