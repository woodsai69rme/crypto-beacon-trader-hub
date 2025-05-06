
export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected: boolean;
  lastUsed?: string;
  description?: string;
  performance?: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

export interface ModelListProps {
  models: LocalModel[];
  onSelect: (model: LocalModel) => void;
  onConnect: (model: LocalModel) => void;
  onDisconnect: (modelId: string) => void;
}

export interface ModelRunningTabProps {
  selectedModel: LocalModel;
  isRunning: boolean;
  onStartModel: (model: LocalModel) => void;
  onStopModel: () => void;
}

export interface ModelConnectionTabProps {
  models: LocalModel[];
  onConnect: (model: LocalModel) => void;
  onDisconnect: (modelId: string) => void;
}

export interface ModelGenerationTabProps {
  onModelGenerated: (model: LocalModel) => void;
}
