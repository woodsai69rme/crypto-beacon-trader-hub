
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Plug, Power } from "lucide-react";
import { LocalModel, ModelConnectionTabProps } from './types';

const ModelConnectionTab: React.FC<ModelConnectionTabProps> = ({ models, onConnect, onDisconnect }) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        Connect to your local AI models to generate trading strategies
      </div>

      {models.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <Plug className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">No models available</p>
        </div>
      ) : (
        <div className="space-y-2">
          {models.map(model => (
            <Card key={model.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${model.isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-muted-foreground">Endpoint: {model.endpoint}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {model.isConnected ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onDisconnect(model.id)}
                      >
                        <Power className="h-4 w-4 mr-1" />
                        Disconnect
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onConnect(model)}
                      >
                        <Plug className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>

                {model.description && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {model.description}
                  </div>
                )}

                {model.performance && (
                  <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">Accuracy</div>
                      <div>{(model.performance.accuracy * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Returns</div>
                      <div>{model.performance.returns.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Sharpe</div>
                      <div>{model.performance.sharpeRatio.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Max DD</div>
                      <div>{model.performance.maxDrawdown.toFixed(1)}%</div>
                    </div>
                  </div>
                )}

                {model.lastUsed && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Last used: {new Date(model.lastUsed).toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelConnectionTab;
