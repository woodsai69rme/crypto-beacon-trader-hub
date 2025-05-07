
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LocalModel, ModelRunningTabProps } from './types';
import { AlertCircle, Play, Square, Bot } from "lucide-react";

const ModelRunningTab: React.FC<ModelRunningTabProps> = ({ 
  selectedModel,
  isRunning,
  onStartModel,
  onStopModel
}) => {
  const [timeframe, setTimeframe] = useState<string>("1h");
  const [dataPoints, setDataPoints] = useState<string>("100");
  const [predictionHorizon, setPredictionHorizon] = useState<string>("24h");

  if (!selectedModel) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No model selected</AlertTitle>
        <AlertDescription>
          Please connect to a model in the Connect tab before running predictions
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${selectedModel.isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div>
                <div className="font-medium">{selectedModel.name}</div>
                <div className="text-xs text-muted-foreground">Type: {selectedModel.type}</div>
              </div>
            </div>
            <Badge variant={isRunning ? "default" : "outline"}>
              {isRunning ? "Running" : "Idle"}
            </Badge>
          </div>

          {!selectedModel.isConnected ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Model not connected</AlertTitle>
              <AlertDescription>
                Connect the model in the Connect tab before running it
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Timeframe</label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5m">5 minutes</SelectItem>
                      <SelectItem value="15m">15 minutes</SelectItem>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="4h">4 hours</SelectItem>
                      <SelectItem value="1d">1 day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Points</label>
                  <Select value={dataPoints} onValueChange={setDataPoints}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="200">200</SelectItem>
                      <SelectItem value="500">500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Prediction Horizon</label>
                  <Select value={predictionHorizon} onValueChange={setPredictionHorizon}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6h">6 hours</SelectItem>
                      <SelectItem value="12h">12 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="48h">48 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                {isRunning ? (
                  <Button variant="destructive" onClick={onStopModel}>
                    <Square className="h-4 w-4 mr-2" />
                    Stop Model
                  </Button>
                ) : (
                  <Button onClick={() => onStartModel(selectedModel)}>
                    <Bot className="h-4 w-4 mr-2" />
                    Run Model
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isRunning && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="font-medium">Model is running...</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Analyzing data and generating predictions
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <div className="h-2 w-full max-w-md bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModelRunningTab;
