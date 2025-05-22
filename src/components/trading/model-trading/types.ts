
import { LocalModel } from '@/types/trading';

export interface ModelPerformanceProps {
  model: LocalModel;
  timeframe?: string;
  isRunning?: boolean;
  performanceData?: any;
}

export interface ModelRunningTabProps {
  models?: LocalModel[];
  selectedModel: LocalModel | null;
  isRunning: boolean;
  progress?: number;
  onStartModel: (model: LocalModel) => void;
  onStopModel: () => void;
}

export interface ModelInfoProps {
  model: LocalModel;
  onEdit?: () => void;
}

export interface ModelSettingsProps {
  model: LocalModel;
  onSave: (updatedModel: LocalModel) => void;
  onCancel: () => void;
}

export interface ModelTrainingProps {
  model: LocalModel;
  onSave: (updatedModel: LocalModel) => void;
  onCancel: () => void;
}

export interface ModelConnectionProps {
  model: LocalModel;
  onConnect: () => void;
  onDisconnect: () => void;
}

export interface ModelExecutionProps {
  model: LocalModel;
  isConnected: boolean;
  onExecute: () => void;
}

export interface ModelResultsProps {
  model: LocalModel;
  results: any;
  isLoading: boolean;
}
