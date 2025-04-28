import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocalModel } from '@/types/trading';
import { toast } from '@/components/ui/use-toast';

interface ModelConnectionTabProps {
  models: LocalModel[];
  onConnect: (modelId: string) => void;
  onDisconnect: (modelId: string) => void;
  onUpdateEndpoint: (modelId: string, newEndpoint: string) => void;
}

const ModelConnectionTab: React.FC<ModelConnectionTabProps> = ({ models, onConnect, onDisconnect, onUpdateEndpoint }) => {
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [newEndpoint, setNewEndpoint] = useState<string>("");

  const handleConnect = (modelId: string) => {
    onConnect(modelId);
  };

  const handleDisconnect = (modelId: string) => {
    onDisconnect(modelId);
  };

  const handleEditEndpoint = (modelId: string) => {
    setEditingModelId(modelId);
    const model = models.find(m => m.id === modelId);
    setNewEndpoint(model?.endpoint || "");
  };

  const handleSaveEndpoint = (modelId: string) => {
    onUpdateEndpoint(modelId, newEndpoint);
    setEditingModelId(null);
    toast({
      title: "Endpoint Updated",
      description: "Model endpoint has been updated"
    });
  };

  return (
    <div className="space-y-4">
      {models.length > 0 ? (
        models.map((model) => (
          <div key={model.id} className="border rounded-md p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">{model.name}</h3>
                <p className="text-sm text-muted-foreground">Type: {model.type}</p>
              </div>
              <div>
                {model.isConnected ? (
                  <Button variant="destructive" size="sm" onClick={() => handleDisconnect(model.id)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleConnect(model.id)}>
                    Connect
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-2">
              {editingModelId === model.id ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={newEndpoint}
                    onChange={(e) => setNewEndpoint(e.target.value)}
                    placeholder="Enter new endpoint"
                  />
                  <Button size="sm" onClick={() => handleSaveEndpoint(model.id)}>
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <Label>Endpoint:</Label>
                    <p className="text-sm text-muted-foreground">{model.endpoint}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEditEndpoint(model.id)}>
                    Edit Endpoint
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-6 text-muted-foreground">
          No local models available. Please generate a model first.
        </div>
      )}
    </div>
  );
};

export default ModelConnectionTab;
