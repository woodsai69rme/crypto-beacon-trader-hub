
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelRunningTabProps } from './types';
import { Play, Square, BarChart3, Settings, FileJson } from 'lucide-react';
import { LocalModel } from '@/types/trading';

const ModelRunningTab: React.FC<ModelRunningTabProps> = ({ 
  selectedModel, 
  isRunning,
  onStartModel,
  onStopModel
}) => {
  const [modelOutput, setModelOutput] = useState<string>("");
  const [processedItems, setProcessedItems] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<string>("output");
  
  useEffect(() => {
    if (isRunning) {
      // Simulate model processing
      const interval = setInterval(() => {
        setProcessedItems(prev => {
          const newValue = prev + 1 + Math.floor(Math.random() * 3);
          if (newValue >= totalItems) {
            clearInterval(interval);
            return totalItems;
          }
          return newValue;
        });
        
        // Add model output
        setModelOutput(prev => {
          const timestampStr = new Date().toISOString().split('T')[1].split('.')[0];
          const messages = [
            `[${timestampStr}] Analyzing market data for ${selectedModel?.name}...`,
            `[${timestampStr}] Detected pattern: Double Bottom on BTC/USD`,
            `[${timestampStr}] Signal: Long BTC/USD (confidence: 67%)`,
            `[${timestampStr}] Calculating risk parameters...`,
            `[${timestampStr}] Warning: High volatility detected`,
            `[${timestampStr}] Processing order book data...`
          ];
          
          return prev + "\n" + messages[Math.floor(Math.random() * messages.length)];
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      // Reset when stopped
      if (processedItems === totalItems) {
        setModelOutput(prev => prev + "\n\n[INFO] Model execution completed successfully.\n");
      }
    }
  }, [isRunning, selectedModel]);
  
  if (!selectedModel) {
    return (
      <div className="text-center p-6 border rounded-lg">
        <p className="text-muted-foreground">No model selected. Please connect to a model first.</p>
      </div>
    );
  }
  
  const completionPercentage = Math.round((processedItems / totalItems) * 100);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Running: {selectedModel.name}</CardTitle>
            <div>
              {isRunning ? (
                <Button variant="destructive" size="sm" onClick={onStopModel}>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Model
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={() => onStartModel(selectedModel)}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Model
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Processing</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="output">Output</TabsTrigger>
                <TabsTrigger value="config">Configuration</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="output" className="mt-0">
                <div className="bg-muted rounded-md p-2 h-[300px] overflow-auto font-mono text-xs whitespace-pre">
                  {modelOutput || "Model not started yet. Press 'Start Model' to begin processing."}
                </div>
              </TabsContent>
              
              <TabsContent value="config" className="mt-0">
                <div className="bg-muted rounded-md p-4 h-[300px] overflow-auto">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Settings className="h-4 w-4 mr-1" />
                    Model Configuration
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {selectedModel.type}
                    </div>
                    <div>
                      <span className="font-medium">Endpoint:</span> {selectedModel.endpoint}
                    </div>
                    <div>
                      <span className="font-medium">Parameters:</span>
                      <div className="ml-4 mt-1 text-xs">
                        <div>timeframe: 1h</div>
                        <div>lookback_period: 30 days</div>
                        <div>leverage: 1.0</div>
                        <div>risk_tolerance: medium</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="results" className="mt-0">
                <div className="bg-muted rounded-md p-4 h-[300px] overflow-auto">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Results Summary
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-background rounded p-2">
                        <div className="text-xs text-muted-foreground">Prediction Accuracy</div>
                        <div className="text-lg font-bold">
                          {selectedModel.performance?.accuracy ? 
                            `${(selectedModel.performance.accuracy * 100).toFixed(1)}%` : 
                            'N/A'}
                        </div>
                      </div>
                      
                      <div className="bg-background rounded p-2">
                        <div className="text-xs text-muted-foreground">Return Rate</div>
                        <div className="text-lg font-bold text-green-500">
                          {selectedModel.performance?.returns ? 
                            `+${selectedModel.performance.returns.toFixed(1)}%` : 
                            'N/A'}
                        </div>
                      </div>
                      
                      <div className="bg-background rounded p-2">
                        <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                        <div className="text-lg font-bold">
                          {selectedModel.performance?.sharpeRatio ? 
                            selectedModel.performance.sharpeRatio.toFixed(2) : 
                            'N/A'}
                        </div>
                      </div>
                      
                      <div className="bg-background rounded p-2">
                        <div className="text-xs text-muted-foreground">Max Drawdown</div>
                        <div className="text-lg font-bold text-red-500">
                          {selectedModel.performance?.maxDrawdown ? 
                            `-${selectedModel.performance.maxDrawdown.toFixed(1)}%` : 
                            'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-center text-muted-foreground">
                      {isRunning ? 
                        'Model is running. Results will update in real-time.' : 
                        'Start the model to see real-time performance metrics.'}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileJson className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-lg font-medium">Latest Signal</h3>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">BUY BTC/USD</div>
                  <div className="text-xs text-muted-foreground">Signal Confidence: 76%</div>
                </div>
                <Button size="sm" variant="outline">Apply</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModelRunningTab;
