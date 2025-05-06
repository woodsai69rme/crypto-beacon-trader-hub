
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Brain, Loader2 } from "lucide-react";
import { ModelGenerationTabProps } from "./types";
import { LocalModel } from "./types";

const ModelGenerationTab: React.FC<ModelGenerationTabProps> = ({
  onModelGenerated,
}) => {
  const [modelName, setModelName] = useState("");
  const [modelType, setModelType] = useState<"prediction" | "sentiment" | "trading" | "analysis">("prediction");
  const [modelEndpoint, setModelEndpoint] = useState("http://localhost:8000");
  const [modelDescription, setModelDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!modelName || !modelEndpoint) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate model generation
    setTimeout(() => {
      const newModel: LocalModel = {
        id: `model-${Date.now()}`,
        name: modelName,
        type: modelType,
        endpoint: modelEndpoint,
        description: modelDescription,
        isConnected: false,
        performance: {
          accuracy: Math.random() * 20 + 70, // 70-90%
          returns: Math.random() * 30 - 5, // -5% to 25%
          sharpeRatio: Math.random() * 2 + 0.5, // 0.5-2.5
          maxDrawdown: Math.random() * 15 + 5, // 5-20%
        },
      };

      onModelGenerated(newModel);
      
      toast({
        title: "Model Created",
        description: `${modelName} has been successfully created and is ready to connect`,
      });

      // Reset form
      setModelName("");
      setModelType("prediction");
      setModelEndpoint("http://localhost:8000");
      setModelDescription("");
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="modelName">Model Name</Label>
              <Input
                id="modelName"
                placeholder="Bitcoin Price Predictor"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="modelType">Model Type</Label>
              <Select value={modelType} onValueChange={(value: any) => setModelType(value)}>
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

            <div>
              <Label htmlFor="modelEndpoint">Endpoint URL</Label>
              <Input
                id="modelEndpoint"
                placeholder="http://localhost:8000"
                value={modelEndpoint}
                onChange={(e) => setModelEndpoint(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="modelDescription">Description (Optional)</Label>
              <Textarea
                id="modelDescription"
                placeholder="Describe your model's function and architecture..."
                value={modelDescription}
                onChange={(e) => setModelDescription(e.target.value)}
              />
            </div>

            <Button
              className="w-full gap-2"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Model...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Generate Model
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p className="mb-2">Model Generation creates a new model configuration that can connect to your local MCP server.</p>
        <p>For advanced model configuration and custom architecture, please consult the MCP server documentation.</p>
      </div>
    </div>
  );
};

export default ModelGenerationTab;
