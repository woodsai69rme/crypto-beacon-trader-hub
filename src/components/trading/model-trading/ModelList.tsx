
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Plug, Power, Star, Loader2 } from 'lucide-react';
import { LocalModel, ModelListProps } from '@/types/trading';

const ModelList: React.FC<ModelListProps> = ({ 
  models, 
  onSelect, 
  onConnect, 
  onDisconnect 
}) => {
  return (
    <div className="space-y-4">
      {models.map((model) => (
        <Card key={model.id} className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-medium flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-primary" />
                  {model.name}
                </h3>
                <Badge
                  variant="outline"
                  className={`ml-2 ${
                    model.type === "prediction"
                      ? "bg-blue-500/10 text-blue-500 border-blue-200"
                      : model.type === "sentiment"
                        ? "bg-purple-500/10 text-purple-500 border-purple-200"
                        : model.type === "trading"
                          ? "bg-green-500/10 text-green-500 border-green-200"
                          : "bg-amber-500/10 text-amber-500 border-amber-200"
                  }`}
                >
                  {model.type.charAt(0).toUpperCase() + model.type.slice(1)}
                </Badge>
                
                <Badge
                  variant="outline"
                  className={`ml-2 ${
                    model.isConnected
                      ? "bg-green-500/10 text-green-500 border-green-200"
                      : "bg-red-500/10 text-red-500 border-red-200"
                  }`}
                >
                  {model.isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              
              {model.description && (
                <p className="text-sm text-muted-foreground mb-2">{model.description}</p>
              )}
              
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Endpoint:</span> {model.endpoint}
                {model.lastUsed && (
                  <span className="ml-4">
                    <span className="font-medium">Last used:</span> {new Date(model.lastUsed).toLocaleString()}
                  </span>
                )}
              </div>
              
              {model.performance && (
                <div className="grid grid-cols-4 gap-4 mt-3">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                    <div className="text-sm font-medium">{model.performance.accuracy}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Returns</div>
                    <div className="text-sm font-medium">{model.performance.returns}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Sharpe</div>
                    <div className="text-sm font-medium">{model.performance.sharpeRatio}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Max DD</div>
                    <div className="text-sm font-medium">{model.performance.maxDrawdown}%</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSelect && onSelect(model)}
              >
                <Star className="h-4 w-4 mr-1" />
                Select
              </Button>
              
              {model.isConnected ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDisconnect && onDisconnect(model.id)}
                >
                  <Power className="h-4 w-4 mr-1" />
                  Disconnect
                </Button>
              ) : (
                <Button 
                  size="sm"
                  onClick={() => onConnect && onConnect(model)}
                >
                  <Plug className="h-4 w-4 mr-1" />
                  Connect
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
      
      {models.length === 0 && (
        <div className="text-center py-8">
          <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No Models Available</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first AI model to get started with automated trading
          </p>
        </div>
      )}
    </div>
  );
};

export default ModelList;
