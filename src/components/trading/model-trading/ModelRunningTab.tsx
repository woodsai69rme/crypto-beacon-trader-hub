
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertCircle, Play, Square } from "lucide-react";
import { LocalModel } from '@/types/trading';

export interface ModelRunningTabProps {
  selectedModel: LocalModel | null;
  isRunning: boolean;
  onStopModel: () => void;
  onStartModel: (model: LocalModel) => void;
}

const ModelRunningTab: React.FC<ModelRunningTabProps> = ({
  selectedModel,
  isRunning,
  onStopModel,
  onStartModel
}) => {
  const [activeTab, setActiveTab] = useState('output');
  const [modelOutput, setModelOutput] = useState<string[]>([]);
  const [predictionData, setPredictionData] = useState<any[] | null>(null);
  const [inferenceProgress, setInferenceProgress] = useState(0);
  
  // Simulate model output when running
  React.useEffect(() => {
    if (isRunning && selectedModel) {
      const interval = setInterval(() => {
        if (inferenceProgress < 100) {
          setInferenceProgress(prev => Math.min(prev + 5, 100));
        } else {
          clearInterval(interval);
          
          // Generate some sample output
          const outputs = [
            `[INFO] Model ${selectedModel.name} initialized`,
            `[INFO] Loading data for inference`,
            `[INFO] Running inference on ${selectedModel.type} model`,
            `[INFO] Processing complete`
          ];
          
          setModelOutput(outputs);
          
          // Generate sample prediction data
          if (selectedModel.type === 'prediction') {
            setPredictionData([
              { timestamp: '2023-05-01', predicted: 28543, actual: 28721 },
              { timestamp: '2023-05-02', predicted: 29102, actual: 29321 },
              { timestamp: '2023-05-03', predicted: 29876, actual: 29654 },
              { timestamp: '2023-05-04', predicted: 30120, actual: 30245 }
            ]);
          }
        }
      }, 300);
      
      return () => clearInterval(interval);
    } else {
      setInferenceProgress(0);
      setPredictionData(null);
    }
  }, [isRunning, selectedModel]);
  
  if (!selectedModel) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No model selected</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{selectedModel.name}</h3>
          <p className="text-sm text-muted-foreground">{selectedModel.type} model</p>
        </div>
        
        <div>
          {isRunning ? (
            <Button 
              variant="destructive" 
              onClick={onStopModel}
              className="flex items-center gap-1"
            >
              <Square className="h-4 w-4" />
              Stop Model
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={() => onStartModel(selectedModel)}
              className="flex items-center gap-1"
            >
              <Play className="h-4 w-4" />
              Run Model
            </Button>
          )}
        </div>
      </div>
      
      {isRunning && (
        <Card className="border-muted-foreground/20">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Inference Progress</span>
                <span className="text-sm text-muted-foreground">{inferenceProgress}%</span>
              </div>
              <Progress value={inferenceProgress} className="h-2" />
              
              {inferenceProgress === 100 && (
                <div className="flex items-center gap-1 text-sm text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <span>Inference completed successfully</span>
                </div>
              )}
              
              {inferenceProgress > 0 && inferenceProgress < 100 && (
                <div className="flex items-center gap-1 text-sm text-amber-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>Inference in progress...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="output">Output Log</TabsTrigger>
          <TabsTrigger value="data">Prediction Data</TabsTrigger>
          <TabsTrigger value="settings">Model Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="output" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="bg-muted p-4 rounded-md font-mono text-xs h-[200px] overflow-auto">
                {modelOutput.length > 0 ? (
                  modelOutput.map((line, idx) => (
                    <div key={idx} className="py-1">
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No output yet. Start the model to see results.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardContent className="pt-6">
              {predictionData ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Timestamp</th>
                        <th className="text-right py-2 px-4">Predicted</th>
                        <th className="text-right py-2 px-4">Actual</th>
                        <th className="text-right py-2 px-4">Difference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictionData.map((item, idx) => {
                        const diff = item.actual - item.predicted;
                        const diffPercentage = (diff / item.actual) * 100;
                        const isPositive = diff >= 0;
                        
                        return (
                          <tr key={idx} className="border-b border-muted/50">
                            <td className="py-2 px-4">{item.timestamp}</td>
                            <td className="text-right py-2 px-4">${item.predicted.toLocaleString()}</td>
                            <td className="text-right py-2 px-4">${item.actual.toLocaleString()}</td>
                            <td className={`text-right py-2 px-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                              {isPositive ? '+' : ''}{diffPercentage.toFixed(2)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No prediction data available. Run the model first.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Model Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Endpoint:</div>
                    <div>{selectedModel.endpoint}</div>
                    <div className="text-muted-foreground">Type:</div>
                    <div className="capitalize">{selectedModel.type}</div>
                    {selectedModel.performance && (
                      <>
                        <div className="text-muted-foreground">Accuracy:</div>
                        <div>{selectedModel.performance.accuracy}%</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelRunningTab;
