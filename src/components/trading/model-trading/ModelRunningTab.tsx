
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { LocalModel, TradingStrategy } from "./types";

interface ModelRunningTabProps {
  selectedModel: LocalModel | null;
  onBack: () => void;
}

export const ModelRunningTab = ({ selectedModel, onBack }: ModelRunningTabProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [generatedStrategies] = useLocalStorage<TradingStrategy[]>(
    "localGeneratedStrategies",
    []
  );

  const runLocalModel = async () => {
    setIsRunning(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast({
        title: "Model execution complete",
        description: "Your local model has processed the latest market data successfully",
      });
    } catch (error) {
      toast({
        title: "Execution failed",
        description: "Failed to run your local model",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (!selectedModel) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
        <div className="font-medium text-lg mb-1">No Local Model Selected</div>
        <div className="text-muted-foreground mb-4">
          Please connect to a local model first before running strategies
        </div>
        <Button onClick={onBack}>Select a Local Model</Button>
      </div>
    );
  }

  if (generatedStrategies.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-2">
          You haven't generated any strategies with your local model yet
        </div>
        <Button onClick={onBack}>Generate a Strategy First</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {generatedStrategies.map((strategy) => (
        <div key={strategy.id} className="border rounded-lg p-4">
          <div className="font-medium text-lg">{strategy.name}</div>
          <div className="text-muted-foreground text-sm mb-3">
            {strategy.description}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-4">
            <div className="bg-muted/50 p-2 rounded">
              <div className="text-muted-foreground">Risk</div>
              <div className="font-medium">{strategy.riskLevel}</div>
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <div className="text-muted-foreground">Timeframe</div>
              <div className="font-medium">{strategy.timeframe}</div>
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <div className="text-muted-foreground">Type</div>
              <div className="font-medium">{strategy.type}</div>
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <div className="text-muted-foreground">Engine</div>
              <div className="font-medium">Local Model</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {strategy.indicators.map((indicator, i) => (
              <div
                key={i}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
              >
                {indicator}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button size="sm" variant="outline" onClick={onBack}>
              <RefreshCw className="h-3 w-3 mr-1" /> Regenerate
            </Button>
            <Button size="sm" onClick={runLocalModel} disabled={isRunning}>
              {isRunning ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Running...
                </>
              ) : (
                "Run Strategy"
              )}
            </Button>
          </div>
        </div>
      ))}

      <div className="p-4 border border-dashed rounded-lg bg-muted/50 mt-6">
        <div className="flex gap-2 items-center mb-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <div className="font-medium">Local Model Execution Notes</div>
        </div>
        <p className="text-sm text-muted-foreground">
          Running local models requires significant computational resources on your
          machine. Ensure your model server has enough memory and processing power
          for real-time inference.
        </p>
      </div>
    </div>
  );
};
