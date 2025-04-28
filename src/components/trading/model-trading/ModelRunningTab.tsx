
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LocalModel } from '@/types/trading';
import { toast } from '@/components/ui/use-toast';

interface ModelRunningTabProps {
  model: LocalModel | null;
  onDisconnect: (modelId: string) => void;
}

const ModelRunningTab: React.FC<ModelRunningTabProps> = ({ model, onDisconnect }) => {
  const [isRunning, setIsRunning] = useState(false);

  if (!model) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No model is currently connected.</p>
        <p className="text-sm text-muted-foreground mt-2">Please connect a model first.</p>
      </div>
    );
  }

  const handleStart = () => {
    setIsRunning(true);
    toast({
      title: "Model Started",
      description: `${model.name} has started processing data`
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    toast({
      title: "Model Stopped",
      description: `${model.name} has stopped processing data`
    });
  };

  const handleDisconnect = () => {
    onDisconnect(model.id);
    toast({
      title: "Model Disconnected",
      description: `${model.name} has been disconnected`
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Model Status</h3>
      <p>Model Name: {model.name}</p>
      <p>Endpoint: {model.endpoint}</p>
      <p>Type: {model.type}</p>

      <div className="flex gap-2">
        {isRunning ? (
          <Button variant="destructive" onClick={handleStop}>
            Stop Model
          </Button>
        ) : (
          <Button onClick={handleStart}>Start Model</Button>
        )}
        <Button variant="outline" onClick={handleDisconnect}>
          Disconnect Model
        </Button>
      </div>

      {isRunning && (
        <div className="border rounded-md p-4 bg-muted/30">
          <h4 className="text-md font-medium">Real-time Output</h4>
          <p className="text-sm text-muted-foreground">
            Simulated real-time output from the model will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default ModelRunningTab;
