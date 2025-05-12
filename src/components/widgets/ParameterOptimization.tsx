
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AITradingStrategy } from "@/types/trading";
import { Sliders, ArrowRight } from "lucide-react";
import { optimizeStrategy } from "@/services/strategyBuilderService";

interface ParameterOptimizationProps {
  strategy: AITradingStrategy | null;
  onApplyOptimizedParameters: (parameters: Record<string, any>) => void;
}

const ParameterOptimization: React.FC<ParameterOptimizationProps> = ({
  strategy,
  onApplyOptimizedParameters
}) => {
  const [target, setTarget] = useState<string>('profitFactor');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  
  const runOptimization = async () => {
    if (!strategy) return;
    
    setIsOptimizing(true);
    setOptimizationResult(null);
    
    try {
      // Create parameter ranges for optimization
      const paramRanges = Object.entries(strategy.parameters)
        .filter(([_, value]) => typeof value === 'number')
        .map(([key, value]) => ({
          id: key,
          min: Math.max(1, Number(value) * 0.7),
          max: Number(value) * 1.3,
          step: Number(value) * 0.05
        }))
        .slice(0, 3); // Limit to top 3 parameters for simplicity
      
      const result = await optimizeStrategy(
        strategy,
        paramRanges,
        target as any
      );
      
      setOptimizationResult(result);
    } catch (error) {
      console.error('Error optimizing strategy:', error);
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const handleApplyParameters = () => {
    if (optimizationResult) {
      onApplyOptimizedParameters(optimizationResult.parameterValues);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Sliders className="h-5 w-5 mr-2" />
          Quick Optimization
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!strategy ? (
          <p className="text-center text-muted-foreground py-4">
            Save your strategy first to enable optimization
          </p>
        ) : (
          <>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Optimization Target</label>
                <Select defaultValue={target} onValueChange={setTarget}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profit">Total Return</SelectItem>
                    <SelectItem value="profitFactor">Profit Factor</SelectItem>
                    <SelectItem value="sharpeRatio">Sharpe Ratio</SelectItem>
                    <SelectItem value="drawdown">Minimize Drawdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={runOptimization} 
                disabled={isOptimizing}
                className="w-full"
              >
                {isOptimizing ? 'Optimizing...' : 'Run Quick Optimization'}
              </Button>
            </div>
            
            {optimizationResult && (
              <div className="space-y-3 pt-2">
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Optimization Results</h4>
                    <Badge className="bg-green-600">
                      +{optimizationResult.improvement.toFixed(2)}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(optimizationResult.parameterValues).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-mono">{Number(value).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleApplyParameters}
                >
                  Apply Parameters
                  <ArrowRight className="h-4 w-4 ml-2" />
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
