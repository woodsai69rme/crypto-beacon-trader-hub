
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Brain, CheckCircle, Link, LinkOff } from "lucide-react";
import { LocalModel } from "./types";

export interface ModelConnectionTabProps {
  models: LocalModel[];
  onConnect: (model: LocalModel) => void;
  onDisconnect: (modelId: string) => void;
}

export const ModelConnectionTab: React.FC<ModelConnectionTabProps> = ({ 
  models, 
  onConnect, 
  onDisconnect 
}) => {
  const [newModelUrl, setNewModelUrl] = useState("");
  const [newModelName, setNewModelName] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleConnect = (model: LocalModel) => {
    onConnect(model);
  };
  
  const handleDisconnect = (modelId: string) => {
    onDisconnect(modelId);
  };
  
  const handleAddNewModel = () => {
    if (!newModelUrl || !newModelName) return;
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      const newModel: LocalModel = {
        id: `model-${Date.now()}`,
        name: newModelName,
        description: `Custom model at ${newModelUrl}`,
        endpoint: newModelUrl,
        type: "prediction",
        isConnected: false
      };
      
      onConnect(newModel);
      setNewModelUrl("");
      setNewModelName("");
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map(model => (
          <Card key={model.id} className="p-4 relative overflow-hidden">
            <div className="flex items-center mb-2">
              <Brain className="h-4 w-4 mr-2" />
              <h3 className="font-medium">{model.name}</h3>
              {model.isConnected && (
                <span className="ml-2 text-green-600 text-xs flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </span>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground mb-2">
              {model.description}
            </p>
            
            <div className="text-xs text-muted-foreground mb-3 truncate">
              Endpoint: {model.endpoint}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs">
                {model.lastUsed && (
                  <span className="text-muted-foreground">
                    Last used: {new Date(model.lastUsed).toLocaleString()}
                  </span>
                )}
              </div>
              
              <div>
                {model.isConnected ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDisconnect(model.id)}
                    className="text-xs h-8"
                  >
                    <LinkOff className="h-3 w-3 mr-1" />
                    Disconnect
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => handleConnect(model)}
                    className="text-xs h-8"
                  >
                    <Link className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="border-t pt-6 mt-6">
        <h3 className="text-sm font-medium mb-4">Add New Model</h3>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Model Name"
            value={newModelName}
            onChange={(e) => setNewModelName(e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Model Endpoint (e.g., http://localhost:8000/predict)"
              value={newModelUrl}
              onChange={(e) => setNewModelUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddNewModel} 
              disabled={!newModelUrl || !newModelName || isConnecting}
            >
              {isConnecting ? "Connecting..." : "Add & Connect"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
