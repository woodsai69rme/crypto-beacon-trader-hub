
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { ModelRunningTabProps } from './ModelRunningTabProps';
import { formatDistanceToNow } from 'date-fns';

const ModelRunningTab: React.FC<ModelRunningTabProps> = ({ model, onDisconnect }) => {
  // Calculate running time if startedAt is available
  const runningTime = model.startedAt 
    ? formatDistanceToNow(new Date(model.startedAt), { addSuffix: false })
    : 'Unknown';

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{model.name}</CardTitle>
            <CardDescription>{model.description || 'AI trading model'}</CardDescription>
          </div>
          <Badge 
            variant={model.status === 'running' ? 'default' : 'destructive'}
            className="uppercase text-xs"
          >
            {model.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Strategy</p>
              <p className="font-medium">{model.strategy}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Runtime</p>
              <p className="font-medium">{runningTime}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Coins</p>
              <p className="font-medium">
                {model.coins?.length > 0 
                  ? model.coins.join(', ').toUpperCase() 
                  : 'No coins selected'}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Update</p>
              <p className="font-medium">
                {model.lastUpdate 
                  ? formatDistanceToNow(new Date(model.lastUpdate), { addSuffix: true })
                  : 'No updates yet'}
              </p>
            </div>
          </div>
          
          {model.performance && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
              <div className="text-center p-2 bg-muted/50 rounded">
                <p className="text-xs text-muted-foreground">Total P&L</p>
                <p className={`font-semibold ${model.performance.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {model.performance.totalPnL >= 0 ? '+' : ''}{model.performance.totalPnL.toFixed(2)}%
                </p>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <p className="text-xs text-muted-foreground">Win Rate</p>
                <p className="font-semibold">{model.performance.winRate.toFixed(1)}%</p>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <p className="text-xs text-muted-foreground">Trades</p>
                <p className="font-semibold">{model.performance.trades}</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2">
            {model.status === 'running' ? (
              <div className="flex items-center">
                <Spinner size="sm" className="text-green-500 mr-2" />
                <span className="text-sm">Model is active</span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Model is not running</div>
            )}
            
            <Button 
              variant="outline"
              size="sm"
              onClick={() => onDisconnect(model.id)}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelRunningTab;
