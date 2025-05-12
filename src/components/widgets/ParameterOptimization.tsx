
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { optimizeStrategy } from '@/services/strategyBuilderService';
import { AITradingStrategy } from '@/types/trading';

interface ParameterOptimizationProps {
  strategy: AITradingStrategy | null;
  onApplyOptimizedParameters?: (parameters: Record<string, any>) => void;
}

const ParameterOptimization: React.FC<ParameterOptimizationProps> = ({ 
  strategy,
  onApplyOptimizedParameters
}) => {
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationTarget, setOptimizationTarget] = useState<'profitFactor' | 'sharpeRatio' | 'profit' | 'drawdown'>('profitFactor');
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [paramRanges, setParamRanges] = useState<Array<{
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    current: number[];
  }>>([]);

  // Initialize parameter ranges based on strategy
  useEffect(() => {
    if (strategy && strategy.parameters) {
      const initialRanges = [];
      
      // Get ranges based on strategy parameters
      for (const [key, value] of Object.entries(strategy.parameters)) {
        // Only add numerical parameters
        if (typeof value === 'number') {
          const min = Math.max(0, value * 0.5);
          const max = value * 1.5;
          const step = (max - min) / 20;
          
          initialRanges.push({
            id: key,
            label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            min,
            max,
            step,
            current: [value]
          });
        }
      }
      
      setParamRanges(initialRanges);
      setOptimizationResult(null);
    }
  }, [strategy]);
  
  const handleOptimize = async () => {
    if (!strategy) return;
    
    setIsOptimizing(true);
    
    try {
      // Prepare parameter ranges for optimization
      const parameterRanges = paramRanges.map(param => ({
        id: param.id,
        min: param.min,
        max: param.max,
        step: param.step
      }));
      
      // Call the strategy optimization service
      const result = await optimizeStrategy(
        strategy,
        parameterRanges,
        optimizationTarget
      );
      
      setOptimizationResult(result);
    } catch (error) {
      console.error('Error optimizing strategy:', error);
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const handleApplyParameters = () => {
    if (optimizationResult && onApplyOptimizedParameters) {
      onApplyOptimizedParameters(optimizationResult.parameterValues);
    }
  };
  
  const handleParamRangeChange = (id: string, values: number[]) => {
    setParamRanges(prev => 
      prev.map(param => 
        param.id === id ? { ...param, current: values } : param
      )
    );
  };
  
  if (!strategy) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <p>Select a strategy to optimize parameters</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Parameter Optimization</CardTitle>
        <CardDescription>
          Optimize strategy parameters to improve performance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="optimization-target">Optimization Target</Label>
            <Select
              value={optimizationTarget}
              onValueChange={(value) => setOptimizationTarget(value as any)}
            >
              <SelectTrigger id="optimization-target">
                <SelectValue placeholder="Select optimization target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profitFactor">Profit Factor</SelectItem>
                <SelectItem value="sharpeRatio">Sharpe Ratio</SelectItem>
                <SelectItem value="profit">Total Profit</SelectItem>
                <SelectItem value="drawdown">Minimize Drawdown</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-4">Parameter Ranges</h3>
            
            {paramRanges.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No numerical parameters available for this strategy
              </div>
            ) : (
              <div className="space-y-6">
                {paramRanges.map((param) => (
                  <div key={param.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={param.id}>{param.label}</Label>
                      <span className="text-sm font-mono">{param.current[0]}</span>
                    </div>
                    <Slider
                      id={param.id}
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={param.current}
                      onValueChange={(values) => handleParamRangeChange(param.id, values)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{param.min.toFixed(2)}</span>
                      <span>{param.max.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleOptimize}
          disabled={isOptimizing || paramRanges.length === 0}
        >
          {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
        </Button>
        
        {optimizationResult && (
          <div className="border rounded-md p-4 mt-4 bg-muted/40">
            <h3 className="font-medium mb-2">Optimization Results</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Improvement:</span>
                <span className="font-medium text-green-600">
                  +{optimizationResult.improvement.toFixed(2)}%
                </span>
              </div>
              
              <div className="text-sm font-medium mt-2">Optimized Parameters:</div>
              {paramRanges.map(param => (
                <div key={param.id} className="flex justify-between text-sm">
                  <span>{param.label}:</span>
                  <span className="font-medium">
                    {optimizationResult.parameterValues[param.id]}
                    <span className="text-muted-foreground ml-1">
                      (was {param.current[0]})
                    </span>
                  </span>
                </div>
              ))}
              
              <div className="text-sm font-medium mt-2">Performance Metrics:</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Profit:</span>
                  <span className="font-medium text-green-600">
                    {optimizationResult.performance.profit.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Win Rate:</span>
                  <span className="font-medium">
                    {(optimizationResult.performance.winRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Drawdown:</span>
                  <span className="font-medium text-red-500">
                    {optimizationResult.performance.maxDrawdown.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sharpe Ratio:</span>
                  <span className="font-medium">
                    {optimizationResult.performance.sharpeRatio.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <Button className="w-full mt-2" onClick={handleApplyParameters}>
                Apply Optimized Parameters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParameterOptimization;
