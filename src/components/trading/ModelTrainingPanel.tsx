
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Cpu } from "lucide-react";

interface ModelTrainingPanelProps {
  isServerConnected: boolean;
  isTraining: boolean;
  trainingProgress: number;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
  startTraining: () => void;
}

const ModelTrainingPanel: React.FC<ModelTrainingPanelProps> = ({
  isServerConnected,
  isTraining,
  trainingProgress,
  selectedModel,
  setSelectedModel,
  timeframe,
  setTimeframe,
  startTraining
}) => {
  return (
    <div className="border-t pt-6">
      <h3 className="font-medium mb-3">AI Model Configuration</h3>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="model">Trading Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lstm-attention">LSTM + Attention</SelectItem>
              <SelectItem value="transformer">Transformer</SelectItem>
              <SelectItem value="cnn-lstm">CNN-LSTM Hybrid</SelectItem>
              <SelectItem value="reinforcement">Reinforcement Learning</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="timeframe">Trading Timeframe</Label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Minute</SelectItem>
              <SelectItem value="5m">5 Minutes</SelectItem>
              <SelectItem value="15m">15 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="4h">4 Hours</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="risk">Risk Level</Label>
          <Select defaultValue="medium">
            <SelectTrigger>
              <SelectValue placeholder="Select risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="advanced-params" className="cursor-pointer">Advanced Parameters</Label>
          <Switch id="advanced-params" />
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-medium mb-3">Training</h3>
        
        {isTraining ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Training in progress...</span>
              <span>{trainingProgress}%</span>
            </div>
            <Progress value={trainingProgress} className="h-2" />
          </div>
        ) : (
          <Button 
            onClick={startTraining} 
            className="w-full" 
            disabled={!isServerConnected}
          >
            <Cpu className="mr-2 h-4 w-4" />
            Train Model
          </Button>
        )}
      </div>
    </div>
  );
};

export default ModelTrainingPanel;
