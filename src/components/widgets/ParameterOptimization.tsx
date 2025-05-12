
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Settings, RefreshCw, Check } from "lucide-react";
import { AITradingStrategy, OptimizationResult } from "@/types/trading";
import { optimizeStrategy } from "@/services/strategyBuilderService";

export interface ParameterOptimizationProps {
  strategy: AITradingStrategy;
  onApplyParameters: (parameters: Record<string, any>) => void;
  onApplyOptimizedParameters?: (parameters: Record<string, any>) => void;
}

const ParameterOptimization: React.FC<ParameterOptimizationProps> = ({
  strategy,
  onApplyParameters,
  onApplyOptimizedParameters
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedParameters, setOptimizedParameters] = useState<Record<string, any> | null>(null);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>("profit");
  const [parameterValues, setParameterValues] = useState<Record<string, any>>(strategy.parameters);

  // Start optimization process
  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await optimizeStrategy(strategy, selectedMetric);
      setOptimizedParameters(result.parameters);
      setOptimizationResults({
        strategyId: strategy.id,
        parameters: result.parameters,
        performance: result.performance,
        improvement: result.improvement,
        parameterValues: result.parameterValues
      });
    } catch (error) {
      console.error("Optimization failed:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Apply the optimized parameters
  const handleApply = () => {
    if (optimizedParameters) {
      if (onApplyOptimizedParameters) {
        onApplyOptimizedParameters(optimizedParameters);
      } else {
        onApplyParameters(optimizedParameters);
      }
    }
  };

  // Handle parameter adjustment
  const handleParameterChange = (paramName: string, value: number | boolean) => {
    setParameterValues(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const renderParameter = (name: string, value: any, min: number, max: number, step: number) => {
    if (typeof value !== 'number') return null;

    return (
      <div key={name} className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor={name}>
            {name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')}
          </Label>
          <span className="text-sm font-medium">{parameterValues[name]}</span>
        </div>
        <Slider
          id={name}
          min={min}
          max={max}
          step={step}
          value={[parameterValues[name]]}
          onValueChange={values => handleParameterChange(name, values[0])}
          className="w-full"
        />
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Parameter Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {Object.entries(strategy.parameters).map(([name, value]) => {
            if (typeof value === 'number') {
              const range = value * 2;
              const min = Math.max(0.1, value - range / 2);
              const max = value + range / 2;
              const step = value < 1 ? 0.1 : 1;
              
              return renderParameter(name, value, min, max, step);
            }
            return null;
          })}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={handleOptimize} 
            disabled={isOptimizing}
            className="flex-1"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Optimize
              </>
            )}
          </Button>
          
          <Button
            onClick={handleApply}
            disabled={!optimizedParameters || isOptimizing}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-2" />
            Apply
          </Button>
        </div>
        
        {optimizationResults && (
          <div className="mt-4 p-3 border rounded-md bg-muted/50">
            <h4 className="font-medium mb-2">Optimization Results</h4>
            <div className="text-sm grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Improvement:</span>
                <span className="font-medium ml-2 text-green-600">+{optimizationResults.improvement.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Win Rate:</span>
                <span className="font-medium ml-2">{optimizationResults.performance.winRate.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Profit:</span>
                <span className="font-medium ml-2">{optimizationResults.performance.profitPercentage.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Sharpe:</span>
                <span className="font-medium ml-2">{optimizationResults.performance.sharpeRatio.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParameterOptimization;
