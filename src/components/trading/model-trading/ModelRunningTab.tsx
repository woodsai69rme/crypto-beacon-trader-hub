
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModelRunningTabProps } from './types';
import { Badge } from "@/components/ui/badge";
import { ModelPerformance } from './ModelPerformance';
import { ModelConfiguration } from './ModelConfiguration';
import { toast } from "@/components/ui/use-toast";

const ModelRunningTab: React.FC<ModelRunningTabProps> = ({
  selectedModel,
  isRunning,
  onStartModel,
  onStopModel
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  
  const handleStartModel = () => {
    if (!selectedModel) {
      toast({
        title: "No Model Selected",
        description: "Please select a model to run",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedModel.isConnected) {
      toast({
        title: "Model Not Connected",
        description: "Please connect to the model first",
        variant: "destructive"
      });
      return;
    }
    
    onStartModel(selectedModel);
    
    // Add log entries
    setLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Starting model: ${selectedModel.name}`,
      `[${new Date().toLocaleTimeString()}] Initializing model parameters`,
      `[${new Date().toLocaleTimeString()}] Model running`,
      ...prev
    ]);
    
    // Simulate periodic log updates
    const logInterval = setInterval(() => {
      if (!isRunning) {
        clearInterval(logInterval);
        return;
      }
      
      const actions = [
        "Analyzing market data",
        "Processing price patterns",
        "Evaluating sentiment signals",
        "Running prediction algorithm",
        "Updating model state",
        "Calculating confidence scores"
      ];
      
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      setLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ${randomAction}`,
        ...prev.slice(0, 19) // Keep only the last 20 logs
      ]);
    }, 5000);
    
    return () => clearInterval(logInterval);
  };
  
  const handleStopModel = () => {
    onStopModel();
    
    setLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Stopping model: ${selectedModel?.name}`,
      `[${new Date().toLocaleTimeString()}] Saving model state`,
      `[${new Date().toLocaleTimeString()}] Model stopped`,
      ...prev
    ]);
  };
  
  const handleSaveConfig = (config: Record<string, any>) => {
    toast({
      title: "Configuration Updated",
      description: "Model configuration has been updated"
    });
    
    setLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Configuration updated`,
      `[${new Date().toLocaleTimeString()}] Parameters saved`,
      ...prev
    ]);
  };
  
  return (
    <div className="space-y-6">
      {selectedModel ? (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium">{selectedModel.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedModel.description}</p>
                </div>
                <Badge variant={selectedModel.isConnected ? "default" : "secondary"}>
                  {selectedModel.isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  {!isRunning ? (
                    <Button 
                      onClick={handleStartModel}
                      disabled={!selectedModel.isConnected}
                    >
                      Start Model
                    </Button>
                  ) : (
                    <Button 
                      variant="destructive"
                      onClick={handleStopModel}
                    >
                      Stop Model
                    </Button>
                  )}
                </div>
                
                <div className="text-sm">
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <span className={isRunning ? "text-green-500" : "text-muted-foreground"}>
                    {isRunning ? "Running" : "Idle"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModelPerformance 
              model={selectedModel}
              isRunning={isRunning}
            />
            
            <ModelConfiguration 
              onSaveConfig={handleSaveConfig}
              defaultConfig={{
                confidenceThreshold: 0.7,
                updateInterval: 5,
                enableLogging: true
              }}
            />
          </div>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Model Logs</h3>
              
              <div className="bg-muted rounded-md p-4 h-60 overflow-y-auto font-mono text-xs">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className="py-1">
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">
                    No logs available. Start the model to see logs.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No model selected</p>
              <p className="text-xs text-muted-foreground mt-1">
                Connect to a model in the "Connect Models" tab first
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModelRunningTab;
