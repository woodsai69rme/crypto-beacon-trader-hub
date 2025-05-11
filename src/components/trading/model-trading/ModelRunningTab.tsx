
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Play, Pause, Activity, Clock, RefreshCw } from "lucide-react";
import { LocalModel } from "./ModelConnectionTab";

interface ModelRunningTabProps {
  selectedModel: LocalModel | null;
  isRunning: boolean;
  onStartModel: (model: LocalModel) => void;
  onStopModel: () => void;
}

const ModelRunningTab: React.FC<ModelRunningTabProps> = ({
  selectedModel,
  isRunning,
  onStartModel,
  onStopModel
}) => {
  const [runDuration, setRunDuration] = useState<number>(0);
  const [predictionCount, setPredictionCount] = useState<number>(0);
  
  // Simulate running model stats
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setRunDuration(prev => prev + 1);
        
        if (Math.random() > 0.7) {
          setPredictionCount(prev => prev + 1);
        }
      }, 1000);
    } else {
      setRunDuration(0);
      setPredictionCount(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);
  
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours > 0 ? `${hours}h` : '',
      minutes > 0 ? `${minutes}m` : '',
      `${secs}s`
    ].filter(Boolean).join(' ');
  };
  
  if (!selectedModel) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <Brain className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-1">No Model Selected</h3>
          <p className="text-sm text-muted-foreground">Please connect to a model first</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">{selectedModel.name}</h3>
              <div className="flex items-center mt-1 space-x-2">
                <Badge variant="outline">
                  {selectedModel.type.charAt(0).toUpperCase() + selectedModel.type.slice(1)}
                </Badge>
                <Badge className={isRunning ? "bg-green-500" : "bg-muted"}>
                  {isRunning ? "Running" : "Stopped"}
                </Badge>
              </div>
            </div>
            
            <div>
              {isRunning ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onStopModel}
                  className="flex items-center"
                >
                  <Pause className="mr-1 h-4 w-4" />
                  Stop Model
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onStartModel(selectedModel)}
                  className="flex items-center"
                  disabled={!selectedModel.isConnected}
                >
                  <Play className="mr-1 h-4 w-4" />
                  Start Model
                </Button>
              )}
            </div>
          </div>
          
          {selectedModel.description && (
            <p className="text-sm text-muted-foreground mt-4">
              {selectedModel.description}
            </p>
          )}
          
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-4">Model Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Endpoint</p>
                <p className="font-medium text-xs truncate">{selectedModel.endpoint}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{selectedModel.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{selectedModel.isConnected ? "Connected" : "Disconnected"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Used</p>
                <p className="font-medium">{selectedModel.lastUsed ? new Date(selectedModel.lastUsed).toLocaleString() : "Never"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isRunning && (
        <Card>
          <CardContent className="p-6">
            <h4 className="font-medium mb-4">Runtime Metrics</h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="border rounded-lg p-4 flex flex-col items-center">
                <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Running Time</p>
                <p className="font-bold text-xl">{formatDuration(runDuration)}</p>
              </div>
              
              <div className="border rounded-lg p-4 flex flex-col items-center">
                <Activity className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Predictions Made</p>
                <p className="font-bold text-xl">{predictionCount}</p>
              </div>
              
              <div className="col-span-2 border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">Recent Activity</h5>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </div>
                
                <div className="space-y-2 max-h-[120px] overflow-y-auto">
                  {[...Array(Math.min(predictionCount, 5))].map((_, i) => (
                    <div key={i} className="text-sm flex justify-between items-center py-1 border-b last:border-b-0">
                      <span>Prediction #{predictionCount - i}</span>
                      <span className="text-muted-foreground">
                        {new Date(Date.now() - (i * 20000)).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                  
                  {predictionCount === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      No predictions made yet
                    </div>
                  )}
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
