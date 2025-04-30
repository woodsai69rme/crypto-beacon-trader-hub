
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Link, Unlink } from 'lucide-react';
import { LocalModel, ModelListProps } from './types';

const ModelList: React.FC<ModelListProps> = ({ models, onSelect, onConnect, onDisconnect }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-4">
      {models.length === 0 ? (
        <div className="text-center p-6 text-muted-foreground">
          <p>No models available</p>
        </div>
      ) : (
        models.map(model => (
          <Card key={model.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-base">{model.name}</h3>
                  <p className="text-sm text-muted-foreground">{model.description || 'No description'}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Last used: {formatDate(model.lastUsed)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onSelect && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelect(model)}
                      disabled={!model.isConnected}
                    >
                      Select
                    </Button>
                  )}
                  
                  {model.isConnected ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDisconnect && onDisconnect(model.id)}
                    >
                      <Unlink className="h-4 w-4 mr-1" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onConnect && onConnect(model)}
                    >
                      <Link className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="border border-border rounded-md p-2">
                  <div className="text-muted-foreground">Endpoint</div>
                  <div className="truncate">{model.endpoint}</div>
                </div>
                <div className="border border-border rounded-md p-2">
                  <div className="text-muted-foreground">Type</div>
                  <div className="capitalize">{model.type}</div>
                </div>
              </div>
              
              {model.performance && (
                <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                  <div className="border border-border rounded-md p-2 text-center">
                    <div className="text-muted-foreground">Accuracy</div>
                    <div>{(model.performance.accuracy * 100).toFixed(1)}%</div>
                  </div>
                  <div className="border border-border rounded-md p-2 text-center">
                    <div className="text-muted-foreground">Returns</div>
                    <div>{model.performance.returns.toFixed(2)}%</div>
                  </div>
                  <div className="border border-border rounded-md p-2 text-center">
                    <div className="text-muted-foreground">Sharpe</div>
                    <div>{model.performance.sharpeRatio.toFixed(2)}</div>
                  </div>
                  <div className="border border-border rounded-md p-2 text-center">
                    <div className="text-muted-foreground">Max DD</div>
                    <div>{model.performance.maxDrawdown.toFixed(2)}%</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ModelList;
