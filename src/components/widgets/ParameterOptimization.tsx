
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Bot, TrendingUp, RefreshCw } from "lucide-react";
import { AITradingStrategy, OptimizationResult } from '@/types/trading';
import { optimizeStrategy } from '@/services/strategyBuilderService';

interface ParameterOptimizationProps {
  strategy: AITradingStrategy | null;
  onApplyOptimizedParameters?: (parameters: Record<string, any>) => void;
}

const ParameterOptimization: React.FC<ParameterOptimizationProps> = ({
  strategy,
  onApplyOptimizedParameters
}) => {
  const [optimizationTarget, setOptimizationTarget] = useState<'profit' | 'profitFactor' | 'sharpeRatio' | 'drawdown'>('profitFactor');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  
  // Define parameter ranges
  const getParameterRanges = () => {
    if (!strategy) return [];
    
    const ranges = [];
    
    // Add parameters based on strategy type and what's available in the strategy
    if (strategy.parameters.period) {
      ranges.push({
        id: 'period',
        name: 'Period Length',
        min: Math.max(5, strategy.parameters.period - 10),
        max: strategy.parameters.period + 10,
        step: 1
      });
    }
    
    if (strategy.parameters.threshold) {
      ranges.push({
        id: 'threshold',
        name: 'Signal Threshold',
        min: Math.max(50, strategy.parameters.threshold - 15),
        max: Math.min(95, strategy.parameters.threshold + 15),
        step: 5
      });
    }
    
    if (strategy.parameters.stopLoss) {
      ranges.push({
        id: 'stopLoss',
        name: 'Stop Loss %',
        min: Math.max(1, strategy.parameters.stopLoss - 2),
        max: strategy.parameters.stopLoss + 3,
        step: 0.5
      });
    }
    
    if (strategy.parameters.takeProfit) {
      ranges.push({
        id: 'takeProfit',
        name: 'Take Profit %',
        min: Math.max(2, strategy.parameters.takeProfit - 5),
        max: strategy.parameters.takeProfit + 10,
        step: 1
      });
    }
    
    if (strategy.parameters.upperBand) {
      ranges.push({
        id: 'upperBand',
        name: 'Upper Band',
        min: Math.max(1, strategy.parameters.upperBand - 1),
        max: strategy.parameters.upperBand + 1.5,
        step: 0.1
      });
    }
    
    if (strategy.parameters.lowerBand) {
      ranges.push({
        id: 'lowerBand',
        name: 'Lower Band',
        min: Math.max(1, strategy.parameters.lowerBand - 1),
        max: strategy.parameters.lowerBand + 1.5,
        step: 0.1
      });
    }
    
    return ranges;
  };
  
  const parameterRanges = getParameterRanges();
  
  const toggleParameterSelection = (paramId: string) => {
    setSelectedParameters(prev => 
      prev.includes(paramId) ? 
        prev.filter(id => id !== paramId) : 
        [...prev, paramId]
    );
  };
  
  const handleOptimize = async () => {
    if (!strategy) return;
    
    setIsOptimizing(true);
    setOptimizationResult(null);
    
    try {
      // Filter parameters based on selection
      const rangesToOptimize = parameterRanges
        .filter(param => selectedParameters.includes(param.id));
      
      if (rangesToOptimize.length === 0) {
        // If none selected, optimize all parameters
        rangesToOptimize.push(...parameterRanges);
      }
      
      const result = await optimizeStrategy(
        strategy,
        rangesToOptimize,
        optimizationTarget
      );
      
      setOptimizationResult(result);
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const handleApplyParameters = () => {
    if (optimizationResult && onApplyOptimizedParameters) {
      onApplyOptimizedParameters(optimizationResult.parameterValues);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Parameter Optimization
        </CardTitle>
        <CardDescription>
          Optimize strategy parameters to improve performance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!strategy ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Select or create a strategy to optimize</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Optimization Target</h3>
                <Select
                  value={optimizationTarget}
                  onValueChange={(value: 'profit' | 'profitFactor' | 'sharpeRatio' | 'drawdown') => setOptimizationTarget(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profit">Maximum Profit</SelectItem>
                    <SelectItem value="profitFactor">Profit Factor</SelectItem>
                    <SelectItem value="sharpeRatio">Sharpe Ratio</SelectItem>
                    <SelectItem value="drawdown">Minimum Drawdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Select Parameters to Optimize</h3>
                <div className="space-y-2">
                  {parameterRanges.map((param) => (
                    <div key={param.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`param-${param.id}`}
                        className="mr-2"
                        checked={selectedParameters.includes(param.id)}
                        onChange={() => toggleParameterSelection(param.id)}
                      />
                      <label htmlFor={`param-${param.id}`} className="text-sm flex-1">
                        {param.name}
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {param.min} - {param.max}
                      </span>
                    </div>
                  ))}
                  
                  {parameterRanges.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No parameters available to optimize
                    </p>
                  )}
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleOptimize} 
                disabled={isOptimizing || parameterRanges.length === 0}
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Start Optimization
                  </>
                )}
              </Button>
            </div>
            
            {optimizationResult && (
              <div className="border rounded-md p-3 mt-4">
                <h3 className="text-sm font-medium mb-2">Optimization Results</h3>
                <p className="text-sm mb-3">
                  <span className="text-green-500 font-medium">+{optimizationResult.improvement}%</span> improvement in {optimizationTarget === 'drawdown' ? 'drawdown reduction' : 'performance'}
                </p>
                
                <div className="space-y-2 mb-3">
                  {Object.entries(optimizationResult.parameterValues).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-mono">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-xs">
                    <div className="text-muted-foreground">Profit</div>
                    <div className="font-medium">+{optimizationResult.performance.profit.toFixed(2)}%</div>
                  </div>
                  <div className="text-xs">
                    <div className="text-muted-foreground">Win Rate</div>
                    <div className="font-medium">{optimizationResult.performance.winRate.toFixed(1)}%</div>
                  </div>
                  <div className="text-xs">
                    <div className="text-muted-foreground">Sharpe Ratio</div>
                    <div className="font-medium">{optimizationResult.performance.sharpeRatio.toFixed(2)}</div>
                  </div>
                  <div className="text-xs">
                    <div className="text-muted-foreground">Max Drawdown</div>
                    <div className="font-medium">-{optimizationResult.performance.maxDrawdown.toFixed(2)}%</div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3" 
                  onClick={handleApplyParameters}
                >
                  Apply Optimized Parameters
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ParameterOptimization;
