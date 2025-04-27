
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocalModel } from "@/types/trading";
import { AlertCircle, CheckCircle, Server } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ModelConnectionTabProps {
  onModelSelect: (model: LocalModel) => void;
}

export const ModelConnectionTab = ({ onModelSelect }: ModelConnectionTabProps) => {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  
  // Mock local models
  const localModels: LocalModel[] = [
    {
      id: "model-1",
      name: "Local LLaMA 2 Trading",
      endpoint: "http://localhost:8000/v1",
      type: "trading",
      isConnected: false
    },
    {
      id: "model-2",
      name: "PyTorch Price Predictor",
      endpoint: "http://localhost:5000/api",
      type: "prediction",
      isConnected: false
    },
    {
      id: "model-3",
      name: "TensorFlow Sentiment Analysis",
      endpoint: "http://localhost:5500/analyze",
      type: "sentiment",
      isConnected: false
    }
  ];
  
  const handleConnect = async (model: LocalModel) => {
    setIsConnecting(model.id);
    
    try {
      // Simulate API connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const connectedModel: LocalModel = {
        ...model,
        isConnected: true,
        lastUsed: new Date().toISOString()
      };
      
      onModelSelect(connectedModel);
      
      toast({
        title: "Model Connected",
        description: `Successfully connected to ${model.name}`
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the local model. Please check if it's running.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(null);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        Connect to a locally running AI model for trading strategy generation and execution
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {localModels.map((model) => (
          <Card key={model.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-muted-foreground" />
                    <div className="font-medium">{model.name}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {model.endpoint}
                  </div>
                  <div className="text-xs bg-muted px-2 py-1 rounded-md inline-block mt-2">
                    {model.type}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isConnecting === model.id}
                  onClick={() => handleConnect(model)}
                >
                  {isConnecting === model.id ? (
                    <>Connecting...</>
                  ) : (
                    <>Connect</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-muted/50 p-4 rounded-md flex items-start gap-3 mt-4">
        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">Running local models</p>
          <p className="text-muted-foreground mt-1">
            Make sure your local models are running and accessible at the specified endpoints.
            These models should support API endpoints for strategy generation and execution.
          </p>
        </div>
      </div>
    </div>
  );
};
