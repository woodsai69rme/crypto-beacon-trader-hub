
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { AITradingStrategy, OptimizationResult } from '@/types/trading';

export interface ParameterOptimizationProps {
  strategy: AITradingStrategy;
  onApplyParameters: (parameters: Record<string, any>) => void;
}

const ParameterOptimization: React.FC<ParameterOptimizationProps> = ({ 
  strategy, 
  onApplyParameters 
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<string>("returns");
  
  // Get optimizable parameters from strategy
  const getOptimizableParameters = () => {
    const params = strategy.parameters;
    return Object.entries(params)
      .filter(([key, value]) => 
        typeof value === 'number' && 
        !key.includes('Pct') && 
        !key.includes('Period') &&
        key !== 'risk'
      )
      .map(([key, value]) => ({
        name: key,
        value
      }));
  };
  
  const toggleParameter = (param: string) => {
    setSelectedParameters(prev => 
      prev.includes(param) 
        ? prev.filter(p => p !== param) 
        : [...prev, param]
    );
  };
  
  const handleOptimize = () => {
    if (selectedParameters.length === 0) return;
    
    setIsOptimizing(true);
    
    // Simulate optimization process
    setTimeout(() => {
      // Create optimized parameters (with slight improvements)
      const optimizedParams = { ...strategy.parameters };
      
      selectedParameters.forEach(param => {
        // Slightly modify parameter value (±20%)
        const currentValue = strategy.parameters[param] as number;
        const variation = currentValue * (Math.random() * 0.4 - 0.2);
        optimizedParams[param] = Math.max(1, Math.round((currentValue + variation) * 10) / 10);
      });
      
      // Calculate "improvement"
      const basePerformance = strategy.performance?.returns || 0;
      const improvement = Math.random() * 15 + 5; // 5-20% improvement
      
      setOptimizationResult({
        id: `opt-${Date.now()}`,
        strategyId: strategy.id,
        parameters: optimizedParams,
        performance: {
          returns: basePerformance + improvement,
          winRate: (strategy.performance?.winRate || 60) + (Math.random() * 5),
          profitFactor: (strategy.performance?.profitFactor || 1.5) + (Math.random() * 0.5),
          sharpeRatio: 2.1 + (Math.random() * 0.4),
          maxDrawdown: 12 - (Math.random() * 2)
        },
        trades: strategy.performance?.trades || 100,
        timeframe: strategy.timeframe,
        optimizationDate: new Date().toISOString(),
        improvement,
        parameterValues: optimizedParams
      });
      
      setIsOptimizing(false);
    }, 2000);
  };
  
  const handleApplyOptimization = () => {
    if (!optimizationResult) return;
    onApplyParameters(optimizationResult.parameterValues);
    setOptimizationResult(null);
  };
  
  const optimizableParams = getOptimizableParameters();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Parameter Optimization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {optimizableParams.length > 0 ? (
            <>
              {!optimizationResult ? (
                <>
                  <div className="text-sm text-muted-foreground mb-2">
                    Select parameters to optimize:
                  </div>
                  <div className="space-y-3">
                    {optimizableParams.map((param) => (
                      <div key={param.name} className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                            {param.name}
                          </span>
                          <span className="ml-2 text-sm">
                            = {param.value}
                          </span>
                        </div>
                        <Button
                          variant={selectedParameters.includes(param.name) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleParameter(param.name)}
                        >
                          {selectedParameters.includes(param.name) ? "Selected" : "Select"}
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      className="w-full"
                      disabled={selectedParameters.length === 0 || isOptimizing}
                      onClick={handleOptimize}
                    >
                      {isOptimizing ? "Optimizing..." : "Run Optimization"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-md border p-3 bg-muted/50">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Optimization Result</div>
                      <Badge variant="outline" className="text-green-500">
                        +{optimizationResult.improvement.toFixed(1)}% improvement
                      </Badge>
                    </div>
                    
                    <div className="mt-3 space-y-3">
                      {selectedParameters.map(param => (
                        <div key={param} className="grid grid-cols-5 gap-2 items-center">
                          <div className="col-span-1 font-mono text-xs">
                            {param}
                          </div>
                          <div className="col-span-3 flex items-center gap-2">
                            <div className="text-sm">
                              {strategy.parameters[param]}
                            </div>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <div className="text-sm font-medium">
                              {optimizationResult.parameterValues[param]}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="rounded-md bg-background border p-2 text-center">
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                        <div className="text-sm font-medium">
                          {optimizationResult.performance.winRate.toFixed(1)}%
                        </div>
                      </div>
                      <div className="rounded-md bg-background border p-2 text-center">
                        <div className="text-xs text-muted-foreground">Return</div>
                        <div className="text-sm font-medium">
                          {optimizationResult.performance.returns.toFixed(1)}%
                        </div>
                      </div>
                      <div className="rounded-md bg-background border p-2 text-center">
                        <div className="text-xs text-muted-foreground">Drawdown</div>
                        <div className="text-sm font-medium">
                          {optimizationResult.performance.maxDrawdown.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setOptimizationResult(null)}
                    >
                      Reset
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleApplyOptimization}
                    >
                      Apply Parameters
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No optimizable parameters found</p>
              <p className="text-xs mt-1">
                Select a strategy first or add numeric parameters
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParameterOptimization;
