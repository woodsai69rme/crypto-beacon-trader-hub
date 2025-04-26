
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";
import { LocalModel } from "./types";

interface ModelListProps {
  models: LocalModel[];
  isTestingConnection: string | null;
  onTestConnection: (model: LocalModel) => void;
  onRemoveModel: (id: string) => void;
}

const ModelList: React.FC<ModelListProps> = ({
  models,
  isTestingConnection,
  onTestConnection,
  onRemoveModel
}) => {
  const getModelTypeBadge = (type: LocalModel["type"]) => {
    switch (type) {
      case "prediction":
        return <Badge className="bg-blue-500">Price Prediction</Badge>;
      case "sentiment":
        return <Badge className="bg-green-500">Sentiment Analysis</Badge>;
      case "trading":
        return <Badge className="bg-purple-500">Trading Strategy</Badge>;
      case "analysis":
        return <Badge className="bg-amber-500">Market Analysis</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (models.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-2">No local models configured yet</div>
        <Button>Add Your First Model</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {models.map(model => (
        <div key={model.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium text-lg">{model.name}</div>
              <div className="text-muted-foreground text-sm mb-2">{model.endpoint}</div>
              <div className="flex flex-wrap gap-2 mb-2 items-center">
                {getModelTypeBadge(model.type)}
                <div className="flex items-center text-sm">
                  {model.isConnected ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500">Connected</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-amber-500">Not connected</span>
                    </>
                  )}
                </div>
              </div>
              {model.lastUsed && (
                <div className="text-xs text-muted-foreground">
                  Last used: {new Date(model.lastUsed).toLocaleString()}
                </div>
              )}
            </div>
            <div className="space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onTestConnection(model)}
                disabled={isTestingConnection === model.id}
              >
                {isTestingConnection === model.id ? "Testing..." : "Test Connection"}
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onRemoveModel(model.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModelList;
