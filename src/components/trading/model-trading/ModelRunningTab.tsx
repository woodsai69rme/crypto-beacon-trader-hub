
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Square, Activity, LineChart, Cpu } from "lucide-react";
import { ModelRunningTabProps } from "./types";

const ModelRunningTab: React.FC<ModelRunningTabProps> = ({
  selectedModel,
  isRunning,
  onStartModel,
  onStopModel,
}) => {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [processedData, setProcessedData] = useState(0);
  const [modelMetrics, setModelMetrics] = useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
  });
  const [activeTab, setActiveTab] = useState("metrics");

  // Simulate model metrics and resource usage updates
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCpuUsage(Math.min(Math.random() * 40 + 30, 100)); // 30-70% range
        setMemoryUsage(Math.min(Math.random() * 30 + 40, 100)); // 40-70% range
        setProcessedData(prev => Math.min(prev + Math.random() * 5, 100));
        
        setModelMetrics({
          accuracy: Math.min(Math.random() * 10 + modelMetrics.accuracy, 95),
          precision: Math.min(Math.random() * 5 + modelMetrics.precision, 90),
          recall: Math.min(Math.random() * 8 + modelMetrics.recall, 85),
          f1Score: Math.min(Math.random() * 7 + modelMetrics.f1Score, 88),
        });
      }, 1500);
      
      return () => clearInterval(interval);
    } else {
      // Reset progress if model is stopped
      setProcessedData(0);
    }
  }, [isRunning, modelMetrics]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-medium">{selectedModel.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedModel.endpoint}</p>
              <div className="flex items-center mt-1">
                <div className={`w-2 h-2 rounded-full mr-2 ${isRunning ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                <span className="text-sm">{isRunning ? 'Running' : 'Ready'}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {!isRunning ? (
                <Button 
                  variant="default" 
                  className="gap-1"
                  onClick={() => onStartModel(selectedModel)}
                >
                  <Play className="h-4 w-4" />
                  Start Model
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  className="gap-1"
                  onClick={onStopModel}
                >
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              )}
            </div>
          </div>
          
          {isRunning && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Processing Data</span>
                <span>{Math.round(processedData)}%</span>
              </div>
              <Progress value={processedData} />
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="metrics" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="metrics">
            <Activity className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Cpu className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="output">
            <LineChart className="h-4 w-4 mr-2" />
            Output
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Accuracy</span>
                  <span>{modelMetrics.accuracy.toFixed(2)}%</span>
                </div>
                <Progress value={modelMetrics.accuracy} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Precision</span>
                  <span>{modelMetrics.precision.toFixed(2)}%</span>
                </div>
                <Progress value={modelMetrics.precision} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Recall</span>
                  <span>{modelMetrics.recall.toFixed(2)}%</span>
                </div>
                <Progress value={modelMetrics.recall} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>F1 Score</span>
                  <span>{modelMetrics.f1Score.toFixed(2)}%</span>
                </div>
                <Progress value={modelMetrics.f1Score} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU Usage</span>
                  <span>{cpuUsage.toFixed(1)}%</span>
                </div>
                <Progress value={cpuUsage} className={cpuUsage > 80 ? "bg-red-200" : ""} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory Usage</span>
                  <span>{memoryUsage.toFixed(1)}%</span>
                </div>
                <Progress value={memoryUsage} className={memoryUsage > 80 ? "bg-red-200" : ""} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Threads</div>
                  <div className="text-xl font-medium">{isRunning ? Math.floor(Math.random() * 4) + 2 : 0}</div>
                </div>
                
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Batch Size</div>
                  <div className="text-xl font-medium">{isRunning ? 32 : 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="output">
          <Card>
            <CardContent className="pt-6">
              {isRunning ? (
                <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm h-[200px] overflow-y-auto">
                  <div>[INFO] Model initialized successfully</div>
                  <div>[INFO] Loading historical data...</div>
                  <div>[INFO] Processing batch 1/10</div>
                  <div>[INFO] Processing batch 2/10</div>
                  <div>[INFO] Processing batch 3/10</div>
                  <div>[INFO] Market trend analysis: Neutral</div>
                  <div>[INFO] Signal strength: 0.68</div>
                  <div>[INFO] Processing volume indicators</div>
                  <div>[INFO] Analyzing price patterns</div>
                  <div>[INFO] Machine learning prediction confidence: {(Math.random() * 20 + 70).toFixed(2)}%</div>
                </div>
              ) : (
                <div className="text-center p-10 text-muted-foreground">
                  <p>Model is not running. Start the model to see output.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelRunningTab;
