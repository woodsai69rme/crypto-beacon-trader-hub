
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Play, StopCircle } from 'lucide-react';
import { LocalModel } from './types';
import { ModelRunningTabProps } from './ModelRunningTabProps';

const ModelRunningTab: React.FC<ModelRunningTabProps> = ({
  selectedModel,
  isRunning,
  onStopModel,
  onStartModel
}) => {
  if (!selectedModel) {
    return (
      <Card className="border border-dashed border-muted-foreground/50">
        <CardContent className="pt-6 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No model selected</p>
          <p className="text-xs text-muted-foreground mt-1">
            Please select a model from the available models list
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{selectedModel.name}</CardTitle>
            <CardDescription>{selectedModel.type} model</CardDescription>
          </div>
          <Badge variant={isRunning ? "success" : "outline"}>
            {isRunning ? "Running" : "Stopped"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Model Description</p>
            <p className="text-sm text-muted-foreground">
              {selectedModel.description || `An AI ${selectedModel.type} model for cryptocurrency trading.`}
            </p>
          </div>
          
          {selectedModel.performance && (
            <div>
              <p className="text-sm font-medium mb-1">Performance Metrics</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Accuracy</p>
                  <p className="font-medium">{selectedModel.performance.accuracy}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Returns</p>
                  <p className="font-medium">{selectedModel.performance.returns}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sharpe Ratio</p>
                  <p className="font-medium">{selectedModel.performance.sharpeRatio}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Max Drawdown</p>
                  <p className="font-medium">{selectedModel.performance.maxDrawdown}%</p>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <p className="text-sm font-medium mb-1">Status</p>
            <p className="text-sm text-muted-foreground">
              {isRunning ? "Model is currently active and processing market data." : "Model is currently inactive."}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        {isRunning ? (
          <Button variant="destructive" onClick={onStopModel} className="w-full">
            <StopCircle className="h-4 w-4 mr-2" /> Stop Model
          </Button>
        ) : (
          <Button variant="default" onClick={() => onStartModel(selectedModel)} className="w-full">
            <Play className="h-4 w-4 mr-2" /> Start Model
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ModelRunningTab;
