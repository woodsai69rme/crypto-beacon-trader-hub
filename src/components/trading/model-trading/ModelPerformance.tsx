
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ModelPerformanceProps } from './types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ModelPerformance: React.FC<ModelPerformanceProps> = ({
  model,
  isRunning,
  performanceData
}) => {
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  
  // Generate mock performance data
  useEffect(() => {
    const initialData = [];
    const now = new Date();
    
    // Generate data points for the past 20 minutes
    for (let i = 20; i > 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60000).toLocaleTimeString();
      const accuracy = model?.performance?.accuracy 
        ? model.performance.accuracy * (0.9 + Math.random() * 0.2)
        : 0.5 + Math.random() * 0.3;
      
      initialData.push({
        timestamp,
        accuracy: parseFloat(accuracy.toFixed(3)),
        confidence: parseFloat((accuracy * (0.8 + Math.random() * 0.4)).toFixed(3))
      });
    }
    
    setHistoricalData(initialData);
    
    // If running, update periodically
    if (isRunning) {
      const interval = setInterval(() => {
        setHistoricalData(prev => {
          const lastAccuracy = prev[prev.length - 1].accuracy;
          const newAccuracy = Math.max(0, Math.min(1, 
            lastAccuracy + (Math.random() * 0.1 - 0.05)
          ));
          
          const timestamp = new Date().toLocaleTimeString();
          return [
            ...prev.slice(1),
            {
              timestamp,
              accuracy: parseFloat(newAccuracy.toFixed(3)),
              confidence: parseFloat((newAccuracy * (0.8 + Math.random() * 0.4)).toFixed(3))
            }
          ];
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [model, isRunning]);
  
  if (!model) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Accuracy</div>
            <div className="text-xl font-bold">
              {model.performance?.accuracy ? (model.performance.accuracy * 100).toFixed(1) : 'N/A'}%
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Returns</div>
            <div className="text-xl font-bold">
              {model.performance?.returns ? model.performance.returns.toFixed(1) : 'N/A'}%
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
            <div className="text-xl font-bold">
              {model.performance?.sharpeRatio ? model.performance.sharpeRatio.toFixed(2) : 'N/A'}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Max Drawdown</div>
            <div className="text-xl font-bold">
              {model.performance?.maxDrawdown ? model.performance.maxDrawdown.toFixed(1) : 'N/A'}%
            </div>
          </div>
        </div>
        
        <h4 className="font-medium text-sm text-muted-foreground mb-2">Real-time Performance</h4>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 10 }} 
                tickLine={false}
                minTickGap={30}
              />
              <YAxis 
                domain={[0, 1]} 
                tick={{ fontSize: 10 }} 
                tickFormatter={(value) => `${value * 100}%`}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`]} 
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#3b82f6" 
                dot={false}
                name="Accuracy"
              />
              <Line 
                type="monotone" 
                dataKey="confidence" 
                stroke="#10b981" 
                dot={false} 
                strokeDasharray="4 4"
                name="Confidence"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelPerformance;
