
import { LocalModel } from "@/types/trading";

export interface ModelRunningTabProps {
  selectedModel: LocalModel | null;
  isModelRunning: boolean;
  onStartModel: () => void;
  onStopModel: () => void;
}
