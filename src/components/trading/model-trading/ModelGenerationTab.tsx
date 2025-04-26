
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import type { LocalModel, TradingStrategy } from "./types";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface ModelGenerationTabProps {
  selectedModel: LocalModel | null;
  onBack: () => void;
  onGenerate: () => void;
}

export const ModelGenerationTab = ({
  selectedModel,
  onBack,
  onGenerate,
}: ModelGenerationTabProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [_, setGeneratedStrategies] = useLocalStorage<TradingStrategy[]>(
    "localGeneratedStrategies",
    []
  );

  const generateStrategy = async () => {
    if (!selectedModel) {
      toast({
        title: "No model selected",
        description: "Please select a local model first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const newStrategy: TradingStrategy = {
        id: `local-strategy-${Date.now()}`,
        name: `Local ${selectedModel.name} Strategy`,
        description: `A trading strategy generated using your local ${selectedModel.name} model`,
        type: "ai-predictive",
        riskLevel: "medium",
        timeframe: "1h",
        indicators: [
          "LSTM Network",
          "Local Model Prediction",
          "Volume Profile",
          "Support/Resistance AI",
        ],
        parameters: {
          confidenceThreshold: 72,
          predictionHorizon: "8-candles",
          ensembleModels: 3,
          stopLoss: 3.0,
          takeProfit: 6.0,
          dynamicPositionSizing: true,
          localInference: true,
          localModelId: selectedModel.id,
        },
      };

      setGeneratedStrategies((prev) => [newStrategy, ...prev]);
      onGenerate();

      toast({
        title: "Strategy generated",
        description: "A new trading strategy has been created using your local model",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate a strategy with your local model",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedModel) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
        <div className="font-medium text-lg mb-1">No Local Model Selected</div>
        <div className="text-muted-foreground mb-4">
          Please connect to a local model first before generating strategies
        </div>
        <Button onClick={onBack}>Select a Local Model</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <div className="font-medium">Connected to: {selectedModel.name}</div>
        </div>
        <div className="text-sm text-muted-foreground mb-3">
          Endpoint: {selectedModel.endpoint}
        </div>
        <p className="text-sm mb-4">
          Generate a new trading strategy using your local {selectedModel.type} model.
          This will create a strategy that you can backtest and deploy.
        </p>
        <Button
          onClick={generateStrategy}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating Strategy...
            </>
          ) : (
            "Generate Trading Strategy"
          )}
        </Button>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Strategy Generation Parameters</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Model Type</span>
            <span className="font-medium">{selectedModel.type}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Default Timeframe</span>
            <span className="font-medium">1 Hour</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Risk Profile</span>
            <span className="font-medium">Medium (Configurable)</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Strategy Type</span>
            <span className="font-medium">AI Predictive</span>
          </div>
        </div>
      </div>
    </div>
  );
};
