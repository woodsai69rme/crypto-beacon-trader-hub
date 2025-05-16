
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalModel } from "@/types/trading";
import { ModelPerformanceProps } from './types';

const ModelPerformance: React.FC<ModelPerformanceProps> = ({ model }) => {
  if (!model.performance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            No performance data available for this model yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Accuracy</p>
            <p className="text-xl font-bold">{model.performance.accuracy.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
            <p className="text-xl font-bold">{model.performance.sharpeRatio?.toFixed(2) || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Returns</p>
            <p className="text-xl font-bold">
              {model.performance.returns ? `${model.performance.returns.toFixed(2)}%` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Max Drawdown</p>
            <p className="text-xl font-bold">
              {model.performance.maxDrawdown ? `${model.performance.maxDrawdown.toFixed(2)}%` : 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelPerformance;
