
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { LocalModel } from "./types";
import { Spinner } from "@/components/ui/spinner";

interface ModelGenerationTabProps {
  onModelGenerated: (model: LocalModel) => void;
}

export const ModelGenerationTab: React.FC<ModelGenerationTabProps> = ({ 
  onModelGenerated 
}) => {
  const [modelName, setModelName] = useState("");
  const [modelType, setModelType] = useState<"prediction" | "sentiment" | "trading" | "analysis">("prediction");
  const [modelDescription, setModelDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const generateModel = () => {
    if (!modelName) return;
    
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate model generation with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Generate the model once progress hits 100%
          setTimeout(() => {
            const newModel: LocalModel = {
              id: `model-${Date.now()}`,
              name: modelName,
              description: modelDescription || `Auto-generated ${modelType} model`,
              endpoint: `http://localhost:8000/models/${modelName.toLowerCase().replace(/\s+/g, "-")}`,
              type: modelType,
              isConnected: false
            };
            
            onModelGenerated(newModel);
            
            // Reset the form
            setModelName("");
            setModelType("prediction");
            setModelDescription("");
            setIsGenerating(false);
            setProgress(0);
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Generate New AI Model</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Create a new AI model with our automated generation system. 
          Define your requirements below and our system will build and optimize a model for you.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Model Name</label>
          <Input
            value={modelName}
            onChange={e => setModelName(e.target.value)}
            placeholder="e.g. Bitcoin Price Predictor"
            disabled={isGenerating}
            className="mt-1"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Model Type</label>
          <Select
            value={modelType}
            onValueChange={value => setModelType(value as "prediction" | "sentiment" | "trading" | "analysis")}
            disabled={isGenerating}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select model type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prediction">Price Prediction</SelectItem>
              <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
              <SelectItem value="trading">Trading Bot</SelectItem>
              <SelectItem value="analysis">Market Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium">Model Description</label>
          <Textarea
            value={modelDescription}
            onChange={e => setModelDescription(e.target.value)}
            placeholder="Describe what you want this model to do..."
            disabled={isGenerating}
            className="mt-1"
            rows={4}
          />
        </div>
        
        {isGenerating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Generating model...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
            <div className="text-xs text-muted-foreground">
              {progress < 20 && "Preparing training data..."}
              {progress >= 20 && progress < 40 && "Configuring model architecture..."}
              {progress >= 40 && progress < 60 && "Training model..."}
              {progress >= 60 && progress < 80 && "Validating model performance..."}
              {progress >= 80 && progress < 100 && "Finalizing and saving model..."}
              {progress >= 100 && "Model generation complete!"}
            </div>
          </div>
        )}
        
        <Button
          onClick={generateModel}
          disabled={isGenerating || !modelName}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Generating Model...
            </>
          ) : (
            "Generate Model"
          )}
        </Button>
      </div>
    </div>
  );
};
