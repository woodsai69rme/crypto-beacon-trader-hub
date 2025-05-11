
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AITradingStrategy } from '@/types/trading';
import { optimizeStrategy } from '@/services/strategyBuilderService';

interface AdvancedParameterOptimizationProps {
  strategy: AITradingStrategy | null;
  onApplyParameters?: (params: any) => void;
}

const AdvancedParameterOptimization: React.FC<AdvancedParameterOptimizationProps> = ({ 
  strategy,
  onApplyParameters
}) => {
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationTarget, setOptimizationTarget] = useState<'profitFactor' | 'sharpeRatio' | 'profit' | 'drawdown'>('profitFactor');
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [paramRanges, setParamRanges] = useState([
    { id: 'period', label: 'Period', min: 7, max: 30, step: 1, current: [14], enabled: true },
    { id: 'threshold', label: 'Threshold', min: 50, max: 90, step: 5, current: [70], enabled: true },
    { id: 'stopLoss', label: 'Stop Loss (%)', min: 1, max: 10, step: 0.5, current: [5], enabled: true },
    { id: 'takeProfit', label: 'Take Profit (%)', min: 2, max: 20, step: 1, current: [10], enabled: true },
  ]);
  
  useEffect(() => {
    // Reset optimization result when strategy changes
    setOptimizationResult(null);
    
    // Initialize parameter ranges based on strategy
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
            current: [value],
            enabled: true
          });
        }
      }
      
      if (initialRanges.length > 0) {
        setParamRanges(initialRanges);
      }
    }
  }, [strategy]);
  
  const handleOptimize = async () => {
    if (!strategy) return;
    
    setIsOptimizing(true);
    
    try {
      // Prepare parameter ranges for optimization - only use enabled parameters
      const parameterRanges = paramRanges
        .filter(param => param.enabled)
        .map(param => ({
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
    if (optimizationResult && onApplyParameters) {
      onApplyParameters(optimizationResult.parameterValues);
    }
  };
  
  const handleParamRangeChange = (id: string, values: number[]) => {
    setParamRanges(prev => 
      prev.map(param => 
        param.id === id ? { ...param, current: values } : param
      )
    );
  };
  
  const handleToggleParameter = (id: string, enabled: boolean) => {
    setParamRanges(prev => 
      prev.map(param => 
        param.id === id ? { ...param, enabled } : param
      )
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Parameter Optimization</CardTitle>
        <CardDescription>
          Fine-tune your strategy parameters to maximize performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {strategy ? (
          <div className="space-y-6">
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
              
              <div className="space-y-4 mt-4">
                <h3 className="text-sm font-medium mb-2">Parameter Ranges</h3>
                
                {paramRanges.length > 0 ? (
                  paramRanges.map((param) => (
                    <div key={param.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`${param.id}-enabled`}
                            checked={param.enabled}
                            onCheckedChange={(checked) => handleToggleParameter(param.id, checked)}
                          />
                          <Label htmlFor={`${param.id}-enabled`} className="cursor-pointer">{param.label}</Label>
                        </div>
                        <span className="text-sm">{param.current[0]}</span>
                      </div>
                      <div className={param.enabled ? '' : 'opacity-50 pointer-events-none'}>
                        <Slider
                          id={param.id}
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={param.current}
                          onValueChange={(values) => handleParamRangeChange(param.id, values)}
                          disabled={!param.enabled}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{param.min.toFixed(param.step < 1 ? 2 : 0)}</span>
                          <span>{param.max.toFixed(param.step < 1 ? 2 : 0)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No parameters available for optimization
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleOptimize}
                disabled={isOptimizing || paramRanges.filter(p => p.enabled).length === 0}
              >
                {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
              </Button>
            </div>
            
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
                  {paramRanges.filter(p => p.enabled).map(param => (
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
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Select a strategy to begin optimization
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedParameterOptimization;
