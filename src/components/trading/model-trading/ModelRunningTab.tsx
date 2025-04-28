
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LocalModel, ModelPredictionResult } from "@/types/trading";
import { 
  PlayCircle, 
  StopCircle, 
  Gauge, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle,
  RefreshCcw,
  ChartLineUp
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ModelRunningTabProps {
  model: LocalModel | null;
  onDisconnect: (modelId: string) => void;
}

const ModelRunningTab: React.FC<ModelRunningTabProps> = ({ model, onDisconnect }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastPrediction, setLastPrediction] = useState<ModelPredictionResult | null>(null);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [predictionCount, setPredictionCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Simulate getting stats from model
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCpuUsage(Math.min(Math.random() * 40 + 20, 100));
        setMemoryUsage(Math.min(Math.random() * 30 + 30, 100));
        setPredictionCount(prev => prev + Math.floor(Math.random() * 3));
        
        // Generate a new prediction occasionally
        if (Math.random() > 0.7) {
          generatePrediction();
        }
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isRunning]);
  
  const handleStartModel = () => {
    setLoading(true);
    
    // Simulate starting model
    setTimeout(() => {
      setIsRunning(true);
      setLoading(false);
      generatePrediction();
      
      toast({
        title: "Model Started",
        description: model ? `${model.name} is now running and generating predictions` : "Model is now running"
      });
    }, 1500);
  };
  
  const handleStopModel = () => {
    setLoading(true);
    
    // Simulate stopping model
    setTimeout(() => {
      setIsRunning(false);
      setLoading(false);
      
      toast({
        title: "Model Stopped",
        description: model ? `${model.name} has been stopped` : "Model has been stopped"
      });
    }, 1000);
  };
  
  const generatePrediction = () => {
    if (!model) return;
    
    // Generate a mock prediction
    const direction = Math.random() > 0.6 ? 'up' : Math.random() > 0.5 ? 'down' : 'sideways';
    const probability = 0.5 + Math.random() * 0.45;
    const confidence = 0.6 + Math.random() * 0.3;
    
    const prediction: ModelPredictionResult = {
      timestamp: new Date().toISOString(),
      direction,
      probability,
      targetPrice: direction === 'up' ? 62000 + Math.random() * 2000 : 60000 - Math.random() * 2000,
      confidence,
      timeframe: '4h'
    };
    
    setLastPrediction(prediction);
  };
  
  if (!model) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No model connected. Please connect a model to continue.</p>
          <Button onClick={() => onDisconnect('')} variant="outline">
            Back to Connect Page
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/20 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
              <CardTitle className="text-lg">{model.name}</CardTitle>
            </div>
            <Badge variant={isRunning ? "default" : "outline"}>
              {isRunning ? "Running" : "Idle"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1 flex items-center">
                <Gauge className="h-4 w-4 mr-1" /> CPU Usage
              </span>
              <div className="flex items-center gap-2">
                <Progress value={cpuUsage} className="h-2" />
                <span className="text-sm font-mono w-10">{Math.round(cpuUsage)}%</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1 flex items-center">
                <Gauge className="h-4 w-4 mr-1" /> Memory
              </span>
              <div className="flex items-center gap-2">
                <Progress value={memoryUsage} className="h-2" />
                <span className="text-sm font-mono w-10">{Math.round(memoryUsage)}%</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="text-2xl font-bold">{predictionCount}</div>
              <div className="ml-2 text-sm text-muted-foreground">
                predictions generated
              </div>
            </div>
          </div>
          
          {lastPrediction && (
            <Card className="bg-card/50">
              <CardHeader className="pb-2 pt-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <ChartLineUp className="h-4 w-4 mr-1" />
                    Latest Prediction
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(lastPrediction.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="p-3 pt-0">
                <div className="flex flex-wrap items-center justify-between gap-y-2">
                  <div className="flex items-center gap-2">
                    {lastPrediction.direction === 'up' ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : lastPrediction.direction === 'down' ? (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    ) : (
                      <span className="h-5 w-5 text-yellow-500">➡️</span>
                    )}
                    
                    <div>
                      <div className="font-medium">
                        {lastPrediction.direction === 'up' 
                          ? 'Upward Movement' 
                          : lastPrediction.direction === 'down'
                            ? 'Downward Movement'
                            : 'Sideways Movement'
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(lastPrediction.probability * 100)}% probability in {lastPrediction.timeframe} timeframe
                      </div>
                    </div>
                  </div>
                  
                  {lastPrediction.targetPrice && (
                    <Badge 
                      variant={lastPrediction.direction === 'up' ? "default" : "destructive"}
                      className="ml-auto"
                    >
                      Target: ${lastPrediction.targetPrice.toFixed(0)}
                    </Badge>
                  )}
                </div>
                
                <div className="mt-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Confidence</span>
                    <span className="font-medium">{(lastPrediction.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={lastPrediction.confidence * 100} 
                    className="h-1 mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
        
        <CardFooter className="p-4 bg-muted/20 flex flex-wrap gap-2">
          {isRunning ? (
            <Button 
              variant="destructive" 
              onClick={handleStopModel}
              disabled={loading}
              className="flex-1"
            >
              <StopCircle className="mr-2 h-4 w-4" />
              Stop Model
            </Button>
          ) : (
            <Button 
              onClick={handleStartModel}
              disabled={loading}
              className="flex-1"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Model
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => onDisconnect(model.id)}
            disabled={loading}
          >
            Disconnect
          </Button>
          
          {lastPrediction && (
            <Button
              variant="ghost"
              onClick={generatePrediction}
              disabled={loading || !isRunning}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Generate New Prediction
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Model Performance Metrics</CardTitle>
        </CardHeader>
        
        <CardContent className="p-4">
          {model.performance ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="text-sm text-muted-foreground">Accuracy</div>
                <div className="text-lg font-bold">{(model.performance.accuracy * 100).toFixed(1)}%</div>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="text-sm text-muted-foreground">Precision</div>
                <div className="text-lg font-bold">{(model.performance.precision * 100).toFixed(1)}%</div>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="text-sm text-muted-foreground">Recall</div>
                <div className="text-lg font-bold">{(model.performance.recall * 100).toFixed(1)}%</div>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="text-sm text-muted-foreground">F1 Score</div>
                <div className="text-lg font-bold">{(model.performance.f1Score * 100).toFixed(1)}%</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-3 text-muted-foreground">
              <p>No performance data available yet.</p>
              <p className="text-xs">
                Performance metrics will be calculated after the model generates predictions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelRunningTab;
