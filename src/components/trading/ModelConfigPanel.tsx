
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";
import { McpServerConfig } from "./McpServerList";

interface ModelConfigPanelProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
  activeServerId: string | null;
  isTraining: boolean;
  trainingProgress: number;
  startTraining: () => void;
}

const ModelConfigPanel = ({
  selectedModel,
  setSelectedModel,
  timeframe,
  setTimeframe,
  activeServerId,
  isTraining,
  trainingProgress,
  startTraining
}: ModelConfigPanelProps) => {
  return (
    <Card className="w-full">
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Model Selection</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full rounded-md border p-2"
            >
              <option value="lstm-attention">LSTM with Attention</option>
              <option value="transformer">Transformer</option>
              <option value="hybrid">Hybrid Model</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full rounded-md border p-2"
            >
              <option value="1h">1 Hour</option>
              <option value="4h">4 Hours</option>
              <option value="1d">1 Day</option>
            </select>
          </div>
          
          {isTraining && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Training Progress</span>
                <span>{trainingProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${trainingProgress}%` }}
                />
              </div>
            </div>
          )}
          
          <button
            onClick={startTraining}
            disabled={!activeServerId || isTraining}
            className="w-full px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50"
          >
            {isTraining ? (
              <span className="flex items-center justify-center">
                Training in Progress...
                {trainingProgress === 100 && <Check className="ml-2 h-4 w-4" />}
              </span>
            ) : (
              "Start Training"
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelConfigPanel;
