
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Brain, Minimize2, Maximize2 } from 'lucide-react';
import { AITradingStrategy, OptimizationResult } from '@/types/trading';

interface ParameterOptimizationProps {
  strategy?: AITradingStrategy;
  onParameterChange?: (paramName: string, value: number) => void;
  onOptimize?: (targetMetric: string) => Promise<OptimizationResult | null>;
}

const ParameterOptimization: React.FC<ParameterOptimizationProps> = ({
  strategy,
  onParameterChange,
  onOptimize
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('profit');
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

  const handleOptimize = async () => {
    if (!onOptimize) return;
    
    setIsOptimizing(true);
    try {
      const result = await onOptimize(selectedMetric);
      setOptimizationResult(result);
    } catch (error) {
      console.error("Optimization error:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  if (!strategy) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No strategy selected
        </CardContent>
      </Card>
    );
  }

  const getParameterConfig = (paramName: string) => {
    switch (paramName) {
      case 'period':
        return {
          min: 5,
          max: 200,
          step: 1,
          label: 'Period'
        };
      case 'threshold':
        return {
          min: 0.1,
          max: 5,
          step: 0.1,
          label: 'Threshold'
        };
      case 'stopLoss':
        return {
          min: 0.5,
          max: 10,
          step: 0.5,
          label: 'Stop Loss %'
        };
      case 'takeProfit':
        return {
          min: 0.5,
          max: 20,
          step: 0.5,
          label: 'Take Profit %'
        };
      case 'upperBand':
        return {
          min: 1,
          max: 3,
          step: 0.1,
          label: 'Upper Band'
        };
      case 'lowerBand':
        return {
          min: 1,
          max: 3,
          step: 0.1,
          label: 'Lower Band'
        };
      case 'fastPeriod':
        return {
          min: 5,
          max: 50,
          step: 1,
          label: 'Fast Period'
        };
      case 'slowPeriod':
        return {
          min: 10,
          max: 200,
          step: 5,
          label: 'Slow Period'
        };
      case 'signalPeriod':
        return {
          min: 5,
          max: 50,
          step: 1,
          label: 'Signal Period'
        };
      case 'riskFactor':
        return {
          min: 0.1,
          max: 2,
          step: 0.1,
          label: 'Risk Factor'
        };
      default:
        return {
          min: 0,
          max: 100,
          step: 1,
          label: paramName
        };
    }
  };

  const renderOptimizationResults = () => {
    if (!optimizationResult) return null;
    
    return (
      <div className="mt-4 border rounded-md p-3 bg-muted/30">
        <h4 className="font-medium mb-2">Optimization Results</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-muted-foreground">Improvement</div>
            <div className="font-medium">+{optimizationResult.improvement.toFixed(2)}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Win Rate</div>
            <div className="font-medium">{optimizationResult.performance.winRate.toFixed(2)}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Profit</div>
            <div className="font-medium">{optimizationResult.performance.profit.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Sharpe Ratio</div>
            <div className="font-medium">{optimizationResult.performance.sharpeRatio.toFixed(2)}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">Parameter Optimization</CardTitle>
            <CardDescription>Optimize strategy parameters for better performance</CardDescription>
          </div>
          {strategy && (
            <Badge variant="outline" className="ml-2">
              {strategy.type}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1 block">Optimize For</Label>
            <Select
              value={selectedMetric}
              onValueChange={setSelectedMetric}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profit">Profit</SelectItem>
                <SelectItem value="profitFactor">Profit Factor</SelectItem>
                <SelectItem value="sharpeRatio">Sharpe Ratio</SelectItem>
                <SelectItem value="drawdown">Min Drawdown</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleOptimize} disabled={isOptimizing} className="w-full">
              {isOptimizing ? "Optimizing..." : "Optimize"}
              <Brain className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="space-y-6 pt-2">
          {Object.entries(strategy.parameters).map(([paramName, value]) => {
            if (typeof value !== 'number' || paramName === 'id') return null;
            
            const config = getParameterConfig(paramName);
            
            return (
              <div key={paramName}>
                <div className="flex justify-between mb-1">
                  <Label>{config.label}</Label>
                  <span className="text-sm font-mono">{value}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <Minimize2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[value]}
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    onValueChange={(newValue) => {
                      if (onParameterChange) {
                        onParameterChange(paramName, newValue[0]);
                      }
                    }}
                    className="flex-1"
                  />
                  <Maximize2 className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>
        
        {renderOptimizationResults()}
      </CardContent>
    </Card>
  );
};

export default ParameterOptimization;
