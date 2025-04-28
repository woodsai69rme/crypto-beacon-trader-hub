import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  AlertCircle, 
  CheckCircle2,
  Brain,
  ChartLine
} from 'lucide-react';
import { LocalModel, ModelPredictionResult } from '@/types/trading';

interface ModelRunningTabProps {
  model: LocalModel;
  onStop: () => void;
  onAnalyze: () => void;
}

const ModelRunningTab: React.FC<ModelRunningTabProps> = ({ model, onStop, onAnalyze }) => {
  const [lastPrediction, setLastPrediction] = useState<ModelPredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const simulatePrediction = async () => {
    setIsLoading(true);
    
    // Simulate an API call to the local model
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a random prediction result
    const randomDirection = ['up', 'down', 'sideways'][Math.floor(Math.random() * 3)];
    const randomProbability = Math.random();
    const randomConfidence = Math.random() * 100;
    
    const prediction: ModelPredictionResult = {
      timestamp: new Date().toISOString(),
      direction: randomDirection,
      probability: randomProbability,
      confidence: randomConfidence,
      timeframe: '15m'
    };
    
    setLastPrediction(prediction);
    setIsLoading(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Model Running: {model.name}
        </CardTitle>
        <CardDescription>
          Real-time predictions and analysis from your local AI model
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Model is actively running and generating predictions.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Last Prediction</div>
          {lastPrediction ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Timestamp: {new Date(lastPrediction.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span>Direction:</span>
                <Badge variant="secondary">
                  {lastPrediction.direction.toUpperCase()}
                  {lastPrediction.direction === 'up' && <ArrowUp className="h-4 w-4 ml-1" />}
                  {lastPrediction.direction === 'down' && <ArrowDown className="h-4 w-4 ml-1" />}
                  {lastPrediction.direction === 'sideways' && <ArrowRight className="h-4 w-4 ml-1" />}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <span>Probability:</span>
                <Badge variant="outline">{lastPrediction.probability.toFixed(2)}</Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <span>Confidence:</span>
                <Badge variant="outline">{lastPrediction.confidence.toFixed(0)}%</Badge>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">No predictions yet.</div>
          )}
        </div>
        
        <div className="flex justify-between">
          <Button onClick={simulatePrediction} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Get Prediction'}
          </Button>
          
          <Button variant="secondary" onClick={onAnalyze}>
            <ChartLine className="h-4 w-4 mr-2" />
            Analyze Model
          </Button>
        </div>
      </CardContent>
      
      <CardContent className="border-t">
        <Button variant="destructive" onClick={onStop} className="w-full">
          Stop Model
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModelRunningTab;
