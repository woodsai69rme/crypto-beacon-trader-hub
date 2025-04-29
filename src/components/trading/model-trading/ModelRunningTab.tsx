
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelRunningTabProps } from "./ModelRunningTabProps";

const ModelRunningTab = ({ selectedModel, isRunning, onStopModel, onStartModel }: ModelRunningTabProps) => {
  if (!selectedModel) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p>Select a model to run first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{selectedModel.name}</h3>
          <p className="text-sm text-muted-foreground">{selectedModel.description}</p>
        </div>
        <Badge variant={isRunning ? "default" : "outline"}>
          {isRunning ? "Running" : "Stopped"}
        </Badge>
      </div>

      {isRunning && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Processing data...</span>
            <span>75%</span>
          </div>
          <Progress value={75} className="h-2" />
        </div>
      )}

      <Tabs defaultValue="output">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="output">Output</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="output" className="space-y-4">
          <div className="border rounded-md p-4 h-48 overflow-y-auto bg-muted/30 font-mono text-sm">
            {isRunning ? (
              <>
                <p className="text-green-500">[INFO] Model started successfully</p>
                <p className="text-muted-foreground">[INFO] Loading market data...</p>
                <p className="text-muted-foreground">[INFO] Processing BTC/USD pair</p>
                <p className="text-muted-foreground">[INFO] Analyzing historical patterns</p>
                <p className="text-amber-500">[WARN] Limited data for accurate predictions</p>
                <p className="text-muted-foreground">[INFO] Generating forecast...</p>
              </>
            ) : (
              <p className="text-muted-foreground">Start the model to see output</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="metrics">
          <div className="border rounded-md p-4 h-48">
            <p className="text-center text-muted-foreground pt-16">
              {isRunning ? "Collecting metrics..." : "No metrics available"}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="logs">
          <div className="border rounded-md p-4 h-48 overflow-y-auto bg-muted/30 font-mono text-xs">
            {isRunning ? (
              <>
                <p>[2025-04-28 10:15:32] Initializing model parameters</p>
                <p>[2025-04-28 10:15:33] Loading LSTM architecture</p>
                <p>[2025-04-28 10:15:34] Configuration: epochs=50, batch_size=32</p>
                <p>[2025-04-28 10:15:35] Preprocessing historical data</p>
                <p>[2025-04-28 10:15:36] Normalizing inputs</p>
                <p>[2025-04-28 10:15:37] Starting training loop</p>
              </>
            ) : (
              <p className="text-muted-foreground">Model logs will appear here</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        {isRunning ? (
          <Button variant="destructive" onClick={onStopModel}>
            Stop Model
          </Button>
        ) : (
          <Button onClick={() => onStartModel(selectedModel)}>
            Start Model
          </Button>
        )}
      </div>
    </div>
  );
};

export default ModelRunningTab;
