
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
  onSelect?: (model: LocalModel) => void;
  onConnect?: (model: LocalModel) => void;
  onDisconnect?: (modelId: string) => void;
}

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

export interface ModelTrainingProgress {
  currentEpoch: number;
  totalEpochs: number;
  accuracy: number;
  loss: number;
  status: 'idle' | 'training' | 'completed' | 'failed';
  error?: string;
}

export interface ModelPrediction {
  timestamp: string;
  predictedPrice: number;
  actualPrice?: number;
  direction: 'up' | 'down' | 'neutral';
  confidence: number;
}

export interface ModelConnection {
  id: string;
  status: 'connected' | 'disconnected' | 'error';
  lastConnected?: string;
  endpoint: string;
  latency?: number;
}
