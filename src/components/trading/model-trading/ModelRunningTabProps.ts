
import { LocalModel } from "@/types/trading";

export interface ModelRunningTabProps {
  model: LocalModel;
  onDisconnect: (modelId: string) => void;
}
