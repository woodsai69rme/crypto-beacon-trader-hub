
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Cpu, Server, Network, History } from "lucide-react";

export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected: boolean;
  lastUsed?: string;
  description?: string;
  performance?: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

interface ModelConnectionTabProps {
  models: LocalModel[];
  onConnect: (model: LocalModel) => void;
  onDisconnect: (modelId: string) => void;
}

const ModelConnectionTab: React.FC<ModelConnectionTabProps> = ({ models, onConnect, onDisconnect }) => {
  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case "prediction": return <Brain className="h-5 w-5" />;
      case "sentiment": return <Network className="h-5 w-5" />;
      case "trading": return <Cpu className="h-5 w-5" />;
      case "analysis": return <Server className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getModelTypeLabel = (type: string) => {
    switch (type) {
      case "prediction": return "Price Prediction";
      case "sentiment": return "Sentiment Analysis";
      case "trading": return "Trading Strategy";
      case "analysis": return "Market Analysis";
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Available AI Models</h3>
      
      {models.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <Brain className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No AI models available</p>
          <p className="text-sm text-muted-foreground mt-1">Connect to a local model to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {models.map(model => (
            <Card key={model.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className={`p-4 ${model.isConnected ? "border-l-4 border-green-500" : ""}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getModelTypeIcon(model.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{model.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{getModelTypeLabel(model.type)}</Badge>
                          {model.isConnected && <Badge className="bg-green-500">Connected</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {model.description || `${getModelTypeLabel(model.type)} model at ${model.endpoint}`}
                        </p>
                        {model.lastUsed && (
                          <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <History className="h-3 w-3 mr-1" />
                            Last used: {new Date(model.lastUsed).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      {model.isConnected ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDisconnect(model.id)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => onConnect(model)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {model.performance && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                        <p className="font-medium">{model.performance.accuracy * 100}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Returns</p>
                        <p className="font-medium">{model.performance.returns}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Sharpe</p>
                        <p className="font-medium">{model.performance.sharpeRatio.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Max DD</p>
                        <p className="font-medium">{model.performance.maxDrawdown}%</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelConnectionTab;
