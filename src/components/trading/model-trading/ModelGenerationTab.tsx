
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { LocalModel } from './ModelConnectionTab';

interface ModelGenerationTabProps {
  onModelGenerated: (model: LocalModel) => void;
}

const ModelGenerationTab: React.FC<ModelGenerationTabProps> = ({ onModelGenerated }) => {
  const [modelName, setModelName] = useState<string>("");
  const [modelEndpoint, setModelEndpoint] = useState<string>("http://localhost:8000");
  const [modelType, setModelType] = useState<"prediction" | "sentiment" | "trading" | "analysis">("prediction");
  const [modelDescription, setModelDescription] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  
  const validateEndpoint = (endpoint: string): boolean => {
    try {
      const url = new URL(endpoint);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
      return false;
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!modelName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your model",
        variant: "destructive"
      });
      return;
    }
    
    if (!validateEndpoint(modelEndpoint)) {
      toast({
        title: "Invalid Endpoint",
        description: "Please enter a valid HTTP/HTTPS URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    // Simulate API connection check
    setTimeout(() => {
      const newModel: LocalModel = {
        id: `model-${Date.now()}`,
        name: modelName,
        endpoint: modelEndpoint,
        type: modelType,
        isConnected: false,
        description: modelDescription || `A ${modelType} model at ${modelEndpoint}`,
        performance: {
          accuracy: Math.random() * 0.3 + 0.6, // 0.6-0.9
          returns: Math.random() * 20 + 10, // 10-30%
          sharpeRatio: Math.random() * 1 + 1.2, // 1.2-2.2
          maxDrawdown: Math.random() * 15 + 5 // 5-20%
        }
      };
      
      onModelGenerated(newModel);
      
      // Reset form
      setModelName("");
      setModelEndpoint("http://localhost:8000");
      setModelType("prediction");
      setModelDescription("");
      
      setIsCreating(false);
      
      toast({
        title: "Model Created",
        description: `${modelName} has been successfully created`,
      });
    }, 1500);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Create New Model Configuration</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model-name">Model Name</Label>
            <Input
              id="model-name"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter a name for your model"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model-endpoint">Endpoint URL</Label>
            <Input
              id="model-endpoint"
              value={modelEndpoint}
              onChange={(e) => setModelEndpoint(e.target.value)}
              placeholder="http://localhost:8000"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL where your local AI model service is running
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model-type">Model Type</Label>
            <Select value={modelType} onValueChange={(value: any) => setModelType(value)}>
              <SelectTrigger id="model-type">
                <SelectValue placeholder="Select a model type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prediction">Price Prediction</SelectItem>
                <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                <SelectItem value="trading">Trading Strategy</SelectItem>
                <SelectItem value="analysis">Market Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model-description">Description (optional)</Label>
            <Input
              id="model-description"
              value={modelDescription}
              onChange={(e) => setModelDescription(e.target.value)}
              placeholder="Enter a brief description of your model"
            />
          </div>
          
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? "Creating Model..." : "Create Model"}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-2">Setting Up Local AI Models</h4>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              To use local AI models, you'll need to have a service running that exposes an API endpoint
              that the platform can connect to.
            </p>
            <p>
              Your AI model service should accept JSON requests with market data and return predictions
              in a standardized format.
            </p>
            <div className="mt-2 text-xs bg-muted p-2 rounded">
              <p className="font-medium">Example Request:</p>
              <pre className="mt-1 overflow-x-auto">
                {JSON.stringify({
                  symbol: "BTC",
                  timeframe: "1h",
                  bars: [
                    { time: "2025-01-01T00:00:00Z", open: 65000, high: 65500, low: 64800, close: 65200, volume: 1200 }
                  ]
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelGenerationTab;
