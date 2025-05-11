
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocalModel, ModelGenerationTabProps } from './types';
import { toast } from "@/components/ui/use-toast";

const ModelGenerationTab: React.FC<ModelGenerationTabProps> = ({
  onModelGenerated
}) => {
  const [modelName, setModelName] = useState<string>('');
  const [modelEndpoint, setModelEndpoint] = useState<string>('http://localhost:8000');
  const [modelType, setModelType] = useState<'prediction' | 'sentiment' | 'trading' | 'analysis'>('prediction');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const handleGenerateModel = () => {
    if (!modelName) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your model",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate model generation process
    setTimeout(() => {
      const newModel: LocalModel = {
        id: `model-${Date.now()}`,
        name: modelName,
        endpoint: modelEndpoint,
        type: modelType,
        isConnected: false,
        description: `Generated ${modelType} model for cryptocurrency trading`,
        performance: {
          accuracy: 0.65 + Math.random() * 0.2,
          returns: 10 + Math.random() * 15,
          sharpeRatio: 1.0 + Math.random() * 1.0,
          maxDrawdown: 8 + Math.random() * 10
        }
      };
      
      onModelGenerated(newModel);
      
      toast({
        title: "Model Generated",
        description: `${modelName} has been successfully generated`
      });
      
      // Reset form
      setModelName('');
      setModelEndpoint('http://localhost:8000');
      setModelType('prediction');
      setIsGenerating(false);
    }, 2000);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Generate New Model</h3>
          
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="model-name">Model Name</Label>
              <Input 
                id="model-name" 
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g., BTC Price Predictor"
              />
            </div>
            
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="model-endpoint">Local Endpoint</Label>
              <Input 
                id="model-endpoint" 
                value={modelEndpoint}
                onChange={(e) => setModelEndpoint(e.target.value)}
                placeholder="http://localhost:8000" 
              />
            </div>
            
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="model-type">Model Type</Label>
              <Select 
                value={modelType}
                onValueChange={(value: 'prediction' | 'sentiment' | 'trading' | 'analysis') => setModelType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prediction">Price Prediction</SelectItem>
                  <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                  <SelectItem value="trading">Trading Strategy</SelectItem>
                  <SelectItem value="analysis">Market Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleGenerateModel}
              disabled={isGenerating}
              className="mt-4"
            >
              {isGenerating ? 'Generating...' : 'Generate Model'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelGenerationTab;
