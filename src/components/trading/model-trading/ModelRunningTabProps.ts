
import { LocalModel } from "./types";

export interface ModelRunningTabProps {
  model: LocalModel;
  onDisconnect: (modelId: string) => void;
}
