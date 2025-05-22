
import { LocalModel } from '@/types/trading';

export interface ModelRunningTabProps {
  model: LocalModel;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  results: any[];
}
