
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Zap, Activity } from 'lucide-react';
import { LocalModel } from '@/types/trading';

export interface ModelPerformanceProps {
  model: LocalModel;
  performance: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  isRunning?: boolean;
  performanceData?: any;
}

const ModelPerformance: React.FC<ModelPerformanceProps> = ({ 
  model, 
  performance,
  isRunning = false
}) => {
  const getStatusColor = (value: number, metric: 'accuracy' | 'returns' | 'sharpeRatio' | 'maxDrawdown') => {
    switch (metric) {
      case 'accuracy':
        return value >= 70 ? 'bg-green-500' : value >= 50 ? 'bg-amber-500' : 'bg-red-500';
      case 'returns':
        return value >= 30 ? 'bg-green-500' : value >= 0 ? 'bg-amber-500' : 'bg-red-500';
      case 'sharpeRatio':
        return value >= 1.5 ? 'bg-green-500' : value >= 1.0 ? 'bg-amber-500' : 'bg-red-500';
      case 'maxDrawdown':
        return value <= 15 ? 'bg-green-500' : value <= 25 ? 'bg-amber-500' : 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{model.name} Performance</CardTitle>
          {isRunning ? (
            <Badge className="bg-green-500">Running</Badge>
          ) : (
            <Badge variant="outline">Idle</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Accuracy
              </span>
              <span className="text-sm font-medium">{performance.accuracy}%</span>
            </div>
            <Progress value={performance.accuracy} className={getStatusColor(performance.accuracy, 'accuracy')} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Returns
              </span>
              <span className="text-sm font-medium">{performance.returns}%</span>
            </div>
            <Progress value={performance.returns > 0 ? Math.min(performance.returns, 100) : 0} className={getStatusColor(performance.returns, 'returns')} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Sharpe Ratio
              </span>
              <span className="text-sm font-medium">{performance.sharpeRatio.toFixed(2)}</span>
            </div>
            <Progress 
              value={Math.min(performance.sharpeRatio * 33.3, 100)} 
              className={getStatusColor(performance.sharpeRatio, 'sharpeRatio')}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-1">
                <TrendingDown className="h-4 w-4" />
                Max Drawdown
              </span>
              <span className="text-sm font-medium">-{performance.maxDrawdown}%</span>
            </div>
            <Progress 
              value={Math.min(100 - performance.maxDrawdown, 100)} 
              className={getStatusColor(performance.maxDrawdown, 'maxDrawdown')}
            />
          </div>
          
          <div className="border-t pt-4 mt-2">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-secondary/50 p-2 rounded">
                <div className="text-xs text-muted-foreground">First Used</div>
                <div className="font-medium">{model.lastUsed ? new Date(model.lastUsed).toLocaleDateString() : 'Never'}</div>
              </div>
              <div className="bg-secondary/50 p-2 rounded">
                <div className="text-xs text-muted-foreground">Type</div>
                <div className="font-medium capitalize">{model.type}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelPerformance;
