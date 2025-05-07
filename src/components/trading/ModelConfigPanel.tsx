
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Bot, BrainCircuit } from "lucide-react";

interface ModelConfigPanelProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
  activeServerId: string;
  isTraining: boolean;
  trainingProgress: number;
  startTraining: () => void;
}

const ModelConfigPanel: React.FC<ModelConfigPanelProps> = ({
  selectedModel,
  setSelectedModel,
  timeframe,
  setTimeframe,
  activeServerId,
  isTraining,
  trainingProgress,
  startTraining
}) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="text-lg font-medium">Model Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Model Type</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lstm-attention">LSTM with Attention</SelectItem>
                <SelectItem value="transformer">Transformer</SelectItem>
                <SelectItem value="gru-cnn">GRU-CNN Hybrid</SelectItem>
                <SelectItem value="gpt-nano">GPT-Nano</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Timeframe</label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5m">5 Minutes</SelectItem>
                <SelectItem value="15m">15 Minutes</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isTraining ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Training Model...</span>
              <span>{trainingProgress}%</span>
            </div>
            <Progress value={trainingProgress} />
          </div>
        ) : (
          <Button onClick={startTraining} className="w-full">
            <BrainCircuit className="h-4 w-4 mr-2" />
            Train Model
          </Button>
        )}
        
        <div className="text-xs text-muted-foreground">
          Connected to server: {activeServerId}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelConfigPanel;
