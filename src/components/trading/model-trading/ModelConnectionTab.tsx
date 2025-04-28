
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LocalModel } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";
import { Server, Check, X, LinkIcon, Unlink, ArrowRight } from "lucide-react";

interface ModelConnectionTabProps {
  models: LocalModel[];
  onConnect: (modelId: string) => void;
  onDisconnect: (modelId: string) => void;
  onUpdateEndpoint: (modelId: string, newEndpoint: string) => void;
}

const ModelConnectionTab: React.FC<ModelConnectionTabProps> = ({
  models,
  onConnect,
  onDisconnect,
  onUpdateEndpoint
}) => {
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [newEndpoint, setNewEndpoint] = useState<string>('');

  const handleEditStart = (model: LocalModel) => {
    setEditingModelId(model.id);
    setNewEndpoint(model.endpoint);
  };

  const handleUpdateEndpoint = () => {
    if (!editingModelId) return;
    
    onUpdateEndpoint(editingModelId, newEndpoint);
    setEditingModelId(null);
    
    toast({
      title: "Endpoint Updated",
      description: "The model endpoint has been updated successfully."
    });
  };

  const handleConnect = (modelId: string) => {
    onConnect(modelId);
    
    toast({
      title: "Model Connected",
      description: "Successfully connected to the AI model endpoint."
    });
  };

  const handleDisconnect = (modelId: string) => {
    onDisconnect(modelId);
    
    toast({
      title: "Model Disconnected",
      description: "The AI model has been disconnected."
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/40 rounded-lg p-4 mb-4">
        <h3 className="text-md font-medium mb-2">Connect Local AI Models</h3>
        <p className="text-sm text-muted-foreground">
          Link your locally running AI models for trading analysis, prediction, and automation.
          Make sure your model server is running and accessible at the specified endpoint.
        </p>
      </div>
      
      <div className="grid gap-4">
        {models.map((model) => (
          <Card key={model.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">{model.name}</h3>
                  <Badge variant={model.isConnected ? "default" : "outline"}>
                    {model.isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <Badge variant="outline">{model.type}</Badge>
              </div>
              
              <div className="mt-2">
                {editingModelId === model.id ? (
                  <div className="flex gap-2">
                    <Input 
                      value={newEndpoint}
                      onChange={(e) => setNewEndpoint(e.target.value)}
                      placeholder="http://localhost:5000/predict"
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleUpdateEndpoint}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setEditingModelId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-mono text-muted-foreground">
                      {model.endpoint}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditStart(model)}
                      className="h-8 px-2"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="bg-muted/20 p-3">
              {model.isConnected ? (
                <Button 
                  variant="outline" 
                  onClick={() => handleDisconnect(model.id)}
                  className="w-full"
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              ) : (
                <Button 
                  onClick={() => handleConnect(model.id)}
                  className="w-full"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
        <div className="text-sm">
          <span className="font-medium">Need help?</span> Follow our 
          <Button variant="link" className="px-1 h-auto">
            Local Model Setup Guide
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          Add Custom Model
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ModelConnectionTab;
