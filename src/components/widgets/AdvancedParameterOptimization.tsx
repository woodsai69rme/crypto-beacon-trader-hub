
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from "@/components/ui/select";
import { AITradingStrategy, OptimizationResult } from "@/types/trading";
import { optimizeStrategy } from "@/services/strategyBuilderService";
import { RefreshCw, TrendingUp, Zap, Check, Settings2, Sliders } from "lucide-react";

interface AdvancedParameterOptimizationProps {
  strategy: AITradingStrategy;
  onApplyParameters: (parameters: Record<string, any>) => void;
}

const AdvancedParameterOptimization: React.FC<AdvancedParameterOptimizationProps> = ({
  strategy,
  onApplyParameters
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<OptimizationResult | null>(null);
  const [parameterValues, setParameterValues] = useState<Record<string, any>>({...strategy.parameters});
  const [optimizationTarget, setOptimizationTarget] = useState<"profit" | "sharpeRatio" | "profitFactor" | "drawdown">("profit");
  const [optimizationMethod, setOptimizationMethod] = useState<string>("grid");

  // Start optimization process
  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await optimizeStrategy(strategy, optimizationTarget);
      
      // Add result to history
      setOptimizationResults(prev => [
        {
          id: `opt-${Date.now()}`,
          strategyId: strategy.id,
          parameters: result.parameters,
          performance: result.performance,
          improvement: result.improvement,
          parameterValues: result.parameterValues
        },
        ...prev
      ]);
      
      // Select the newly created result
      setSelectedResult({
        id: `opt-${Date.now()}`,
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

  // Apply the selected optimization result
  const handleApply = () => {
    if (selectedResult) {
      onApplyParameters(selectedResult.parameters);
    }
  };

  // Apply custom parameters
  const handleApplyCustom = () => {
    onApplyParameters(parameterValues);
  };

  // Handle parameter adjustment
  const handleParameterChange = (paramName: string, value: number | boolean | string) => {
    setParameterValues(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  // Format improvement as percentage
  const formatImprovement = (value: number) => {
    return value > 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  // Format numeric values
  const formatNumber = (value: number, decimals = 2) => {
    return value.toFixed(decimals);
  };

  const renderParameterControls = (name: string, value: any) => {
    if (typeof value === 'boolean') {
      // Boolean parameter (switch)
      return (
        <div className="flex items-center justify-between">
          <Label htmlFor={`param-${name}`}>
            {name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')}
          </Label>
          <Switch
            id={`param-${name}`}
            checked={parameterValues[name] || false}
            onCheckedChange={(checked) => handleParameterChange(name, checked)}
          />
        </div>
      );
    } 
    else if (typeof value === 'number') {
      // Numeric parameter (slider)
      const range = value * 3;
      const min = Math.max(0.1, value - range / 2);
      const max = value + range / 2;
      const step = value < 1 ? 0.1 : 1;
      
      return (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor={`param-${name}`}>
              {name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')}
            </Label>
            <span className="text-sm font-medium">
              {typeof parameterValues[name] === 'number' ? parameterValues[name].toFixed(1) : '0'}
            </span>
          </div>
          <Slider
            id={`param-${name}`}
            min={min}
            max={max}
            step={step}
            value={[parameterValues[name] || 0]}
            onValueChange={values => handleParameterChange(name, values[0])}
          />
        </div>
      );
    } 
    else if (typeof value === 'string') {
      // String parameter (select box)
      return (
        <div className="space-y-2">
          <Label htmlFor={`param-${name}`}>
            {name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')}
          </Label>
          <Select
            value={parameterValues[name] || ''}
            onValueChange={value => handleParameterChange(name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sliders className="h-5 w-5" />
          Advanced Parameter Optimization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="optimize">
          <TabsList className="mb-4">
            <TabsTrigger value="optimize" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              Quick Optimize
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-1">
              <Settings2 className="h-4 w-4" />
              Manual Tuning
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Results History
            </TabsTrigger>
          </TabsList>
          
          {/* Quick Optimize Tab */}
          <TabsContent value="optimize" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Optimization Target</Label>
                <Select
                  value={optimizationTarget}
                  onValueChange={(value: "profit" | "sharpeRatio" | "profitFactor" | "drawdown") => 
                    setOptimizationTarget(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profit">Maximum Profit</SelectItem>
                    <SelectItem value="sharpeRatio">Best Sharpe Ratio</SelectItem>
                    <SelectItem value="profitFactor">Best Profit Factor</SelectItem>
                    <SelectItem value="drawdown">Minimum Drawdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Optimization Method</Label>
                <Select
                  value={optimizationMethod}
                  onValueChange={setOptimizationMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid Search</SelectItem>
                    <SelectItem value="bayesian">Bayesian</SelectItem>
                    <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                    <SelectItem value="montecarlo">Monte Carlo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleOptimize} 
                disabled={isOptimizing} 
                className="w-full mt-4"
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Run Optimization
                  </>
                )}
              </Button>
            </div>
            
            {selectedResult && (
              <div className="border rounded-md p-4 bg-muted/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Optimization Results</h4>
                  <span className="text-sm font-medium text-green-600">
                    {formatImprovement(selectedResult.improvement)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Profit:</span>
                    <span>{formatNumber(selectedResult.performance.profitPercentage)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sharpe Ratio:</span>
                    <span>{formatNumber(selectedResult.performance.sharpeRatio)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Win Rate:</span>
                    <span>{formatNumber(selectedResult.performance.winRate)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max Drawdown:</span>
                    <span>{formatNumber(selectedResult.performance.maxDrawdown)}%</span>
                  </div>
                </div>
                
                <Button onClick={handleApply} className="w-full">
                  <Check className="h-4 w-4 mr-2" />
                  Apply These Parameters
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Manual Tuning Tab */}
          <TabsContent value="manual" className="space-y-6">
            <div className="grid gap-6">
              {Object.entries(strategy.parameters).map(([name, value]) => (
                <div key={`param-${name}`}>
                  {renderParameterControls(name, value)}
                </div>
              ))}
              
              <Button onClick={handleApplyCustom}>
                <Check className="h-4 w-4 mr-2" />
                Apply Custom Parameters
              </Button>
            </div>
          </TabsContent>
          
          {/* Results History Tab */}
          <TabsContent value="history" className="space-y-4">
            {optimizationResults.length > 0 ? (
              <div className="space-y-3">
                {optimizationResults.map((result, index) => (
                  <div 
                    key={result.id || index}
                    className={`border p-3 rounded-md cursor-pointer transition-colors ${
                      selectedResult?.id === result.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedResult(result)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Result #{optimizationResults.length - index}</span>
                      <span className={`text-sm font-medium ${result.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatImprovement(result.improvement)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex gap-3">
                      <span>Profit: {formatNumber(result.performance.profitPercentage)}%</span>
                      <span>Sharpe: {formatNumber(result.performance.sharpeRatio)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No optimization results yet</p>
                <p className="text-sm mt-1">Run an optimization to see results here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedParameterOptimization;
