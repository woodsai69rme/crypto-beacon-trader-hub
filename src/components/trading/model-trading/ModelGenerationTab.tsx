
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LocalModel, ModelGenerationTabProps } from "./types";
import { toast } from "@/components/ui/use-toast";
import { Bot, Loader2 } from "lucide-react";

const ModelGenerationTab: React.FC<ModelGenerationTabProps> = ({ onModelGenerated }) => {
  const [modelName, setModelName] = useState<string>("");
  const [modelEndpoint, setModelEndpoint] = useState<string>("http://localhost:8000");
  const [modelType, setModelType] = useState<"prediction" | "sentiment" | "trading" | "analysis">("prediction");
  const [modelDescription, setModelDescription] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = () => {
    if (!modelName || !modelEndpoint) {
      toast({
        title: "Missing Information",
        description: "Please provide both model name and endpoint",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Simulate model generation
    setTimeout(() => {
      const newModel: LocalModel = {
        id: `model-${Date.now()}`,
        name: modelName,
        endpoint: modelEndpoint,
        type: modelType,
        isConnected: false,
        description: modelDescription,
        performance: {
          accuracy: 0.65 + Math.random() * 0.2,
          returns: 10 + Math.random() * 20,
          sharpeRatio: 1 + Math.random() * 1,
          maxDrawdown: 10 + Math.random() * 10
        }
      };

      onModelGenerated(newModel);
      
      toast({
        title: "Model Generated",
        description: `Successfully created ${modelName} model`
      });

      setIsGenerating(false);
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setModelName("");
    setModelEndpoint("http://localhost:8000");
    setModelType("prediction");
    setModelDescription("");
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="text-sm text-muted-foreground mb-2">
          Generate new AI trading models by defining their parameters below
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model-name">Model Name</Label>
              <Input
                id="model-name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Price Predictor v1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model-endpoint">Model Endpoint</Label>
              <Input
                id="model-endpoint"
                value={modelEndpoint}
                onChange={(e) => setModelEndpoint(e.target.value)}
                placeholder="http://localhost:8000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model-type">Model Type</Label>
            <Select value={modelType} onValueChange={(value) => setModelType(value as any)}>
              <SelectTrigger>
                <SelectValue />
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
            <Label htmlFor="model-description">Description (Optional)</Label>
            <Textarea
              id="model-description"
              value={modelDescription}
              onChange={(e) => setModelDescription(e.target.value)}
              placeholder="Describe the model's purpose and functionality..."
            />
          </div>

          <div className="pt-2">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Model...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Generate Model
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelGenerationTab;
