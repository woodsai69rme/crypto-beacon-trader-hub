
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LocalModel, ModelListProps } from '@/types/trading';
import { Bot, Link, Unlink, Settings } from 'lucide-react';

const ModelList: React.FC<ModelListProps> = ({
  models,
  onSelect,
  onConnect,
  onDisconnect
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'default';
      case 'sentiment': return 'secondary';
      case 'trading': return 'destructive';
      case 'analysis': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      {models.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No AI Models Available</h3>
            <p className="text-muted-foreground">
              Configure local AI models to start trading with them
            </p>
          </CardContent>
        </Card>
      ) : (
        models.map((model) => (
          <Card key={model.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription>{model.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getTypeColor(model.type)}>
                    {model.type}
                  </Badge>
                  <Badge variant={model.isConnected ? 'default' : 'secondary'}>
                    {model.isConnected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Endpoint:</span>
                  <span className="ml-2 font-mono">{model.endpoint}</span>
                </div>
                
                {model.performance && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Accuracy:</span>
                      <span className="ml-2 font-medium">{model.performance.accuracy}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Returns:</span>
                      <span className="ml-2 font-medium text-green-600">+{model.performance.returns}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sharpe Ratio:</span>
                      <span className="ml-2 font-medium">{model.performance.sharpeRatio}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max Drawdown:</span>
                      <span className="ml-2 font-medium text-red-600">-{model.performance.maxDrawdown}%</span>
                    </div>
                  </div>
                )}
                
                {model.lastUsed && (
                  <div className="text-sm text-muted-foreground">
                    Last used: {new Date(model.lastUsed).toLocaleDateString()}
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelect(model)}
                    className="gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Configure
                  </Button>
                  
                  {model.isConnected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDisconnect(model.id)}
                      className="gap-2"
                    >
                      <Unlink className="h-4 w-4" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onConnect(model)}
                      className="gap-2"
                    >
                      <Link className="h-4 w-4" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ModelList;
