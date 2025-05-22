
import { LocalModel } from "./types";

export interface ModelRunningTabProps {
  selectedModel: LocalModel | null;
  isRunning: boolean;
  onStopModel: () => void;
  onStartModel: (model: LocalModel) => void;
}
