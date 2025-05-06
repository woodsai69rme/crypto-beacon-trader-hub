
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocalModel, ModelListProps } from '@/types/trading';

const ModelList: React.FC<ModelListProps> = ({ models, onSelect, onConnect, onDisconnect }) => {
  if (models.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">No AI models available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {models.map((model) => (
        <Card key={model.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-medium">
                  {model.name}
                </CardTitle>
                <div className="flex items-center mt-1 space-x-2">
                  <Badge variant={model.isConnected ? "success" : "secondary"}>
                    {model.isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                  <Badge variant="outline">{model.type}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-3 pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              {model.description || "No description available"}
            </p>
            
            {model.performance && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-muted rounded">
                  <p className="font-medium">Accuracy</p>
                  <p className="text-sm">{model.performance.accuracy}%</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p className="font-medium">Returns</p>
                  <p className="text-sm">{model.performance.returns}%</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p className="font-medium">Sharpe Ratio</p>
                  <p className="text-sm">{model.performance.sharpeRatio}</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p className="font-medium">Max Drawdown</p>
                  <p className="text-sm">{model.performance.maxDrawdown}%</p>
                </div>
              </div>
            )}
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Endpoint: {model.endpoint}</p>
              {model.lastUsed && (
                <p>Last used: {new Date(model.lastUsed).toLocaleString()}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-3 flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSelect && onSelect(model)}
              disabled={!model.isConnected}
            >
              Select
            </Button>
            
            {model.isConnected ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDisconnect && onDisconnect(model.id)}
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => onConnect && onConnect(model)}
              >
                Connect
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ModelList;
