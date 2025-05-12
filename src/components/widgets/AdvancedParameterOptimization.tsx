
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TrendingUp, RefreshCw, ArrowUpRight, Play } from 'lucide-react';
import { AITradingStrategy } from '@/types/trading';
import { optimizeStrategy } from '@/services/strategyBuilderService';

interface OptimizationResult {
  strategyId: string;
  parameterValues: Record<string, any>;
  performance: {
    profit: number;
    profitPercentage: number;
    maxDrawdown: number;
    winRate: number;
    sharpeRatio: number;
    profitFactor: number;
    totalReturn: number;
  };
  improvement: number;
}

interface StrategyParameter {
  id: string;
  name: string;
  value: any;
  min?: number;
  max?: number;
  step?: number;
  type: 'number' | 'boolean' | 'select';
  options?: string[];
}

interface AdvancedParameterOptimizationProps {
  strategy: AITradingStrategy;
  onApplyParameters?: (parameters: Record<string, any>) => void;
}

const AdvancedParameterOptimization: React.FC<AdvancedParameterOptimizationProps> = ({
  strategy,
  onApplyParameters
}) => {
  const [optimizationTarget, setOptimizationTarget] = useState<'profit' | 'profitFactor' | 'sharpeRatio' | 'drawdown'>('profitFactor');
  const [optimizationMethod, setOptimizationMethod] = useState<string>('grid');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState('parameters');
  const [modifiedParameters, setModifiedParameters] = useState<Record<string, any>>({});
  const [parameterRanges, setParameterRanges] = useState<Record<string, {min: number, max: number, step: number}>>({});
  
  // Extract parameters from strategy
  const getStrategyParameters = (): StrategyParameter[] => {
    const paramsList: StrategyParameter[] = [];
    
    if (!strategy || !strategy.parameters) return paramsList;
    
    Object.entries(strategy.parameters).forEach(([key, value]) => {
      if (typeof value === 'number') {
        paramsList.push({
          id: key,
          name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          value,
          min: value * 0.5,
          max: value * 1.5,
          step: key.includes('Period') ? 1 : 0.5,
          type: 'number'
        });
      } else if (typeof value === 'boolean') {
        paramsList.push({
          id: key,
          name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          value,
          type: 'boolean'
        });
      } else if (typeof value === 'string') {
        paramsList.push({
          id: key,
          name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          value,
          type: 'select',
          options: ['slow', 'medium', 'fast'] // Default options, should be customized for each string parameter
        });
      }
    });
    
    return paramsList;
  };
  
  const parameters = getStrategyParameters();
  
  const handleParameterRangeChange = (paramId: string, type: 'min' | 'max' | 'step', value: number) => {
    setParameterRanges(prev => ({
      ...prev,
      [paramId]: {
        ...prev[paramId] || {
          min: parameters.find(p => p.id === paramId)?.min || 0,
          max: parameters.find(p => p.id === paramId)?.max || 100,
          step: parameters.find(p => p.id === paramId)?.step || 1
        },
        [type]: value
      }
    }));
  };
  
  const handleParameterChange = (paramId: string, value: any) => {
    setModifiedParameters(prev => ({
      ...prev,
      [paramId]: value
    }));
  };
  
  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    try {
      // Prepare parameter ranges for optimization
      const rangesToOptimize = parameters
        .filter(param => param.type === 'number')
        .map(param => ({
          id: param.id,
          min: parameterRanges[param.id]?.min ?? param.min!,
          max: parameterRanges[param.id]?.max ?? param.max!,
          step: parameterRanges[param.id]?.step ?? param.step!
        }));
      
      const result = await optimizeStrategy(
        strategy,
        rangesToOptimize,
        optimizationTarget
      );
      
      setOptimizationResults(prev => [...prev, result]);
      setSelectedResultIndex(prev => prev === -1 ? 0 : prev);
      
      // Switch to results tab
      setActiveTab('results');
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const handleApplyParameters = () => {
    if (selectedResultIndex === -1 || !optimizationResults[selectedResultIndex]) return;
    
    const resultToApply = optimizationResults[selectedResultIndex];
    
    if (onApplyParameters) {
      onApplyParameters(resultToApply.parameterValues);
    }
  };
  
  const handleApplyManualParameters = () => {
    if (onApplyParameters && Object.keys(modifiedParameters).length > 0) {
      onApplyParameters(modifiedParameters);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Advanced Parameter Optimization
        </CardTitle>
        <CardDescription>
          Fine-tune strategy parameters for optimal performance
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="optimize">Optimize</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="parameters" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Current Parameters</h3>
              
              {parameters.map((param) => (
                <div key={param.id} className="space-y-2">
                  <Label htmlFor={`param-${param.id}`}>
                    {param.name}
                  </Label>
                  
                  {param.type === 'number' && (
                    <div className="flex items-center gap-2">
                      <Slider
                        id={`param-${param.id}`}
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={[modifiedParameters[param.id] ?? param.value]}
                        onValueChange={(values) => handleParameterChange(param.id, values[0])}
                        className="flex-1"
                      />
                      <Input
                        value={modifiedParameters[param.id] ?? param.value}
                        onChange={(e) => handleParameterChange(param.id, Number(e.target.value))}
                        className="w-16"
                      />
                    </div>
                  )}
                  
                  {param.type === 'boolean' && (
                    <Switch
                      id={`param-${param.id}`}
                      checked={modifiedParameters[param.id] ?? param.value}
                      onCheckedChange={(value) => handleParameterChange(param.id, value)}
                    />
                  )}
                  
                  {param.type === 'select' && param.options && (
                    <Select 
                      value={modifiedParameters[param.id] ?? param.value} 
                      onValueChange={(value) => handleParameterChange(param.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {param.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
              
              {Object.keys(modifiedParameters).length > 0 && (
                <Button onClick={handleApplyManualParameters} className="w-full mt-4">
                  Apply Manual Changes
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="optimize" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Optimization Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="optimization-target">Optimization Target</Label>
                    <Select
                      id="optimization-target"
                      value={optimizationTarget}
                      onValueChange={(value: 'profit' | 'profitFactor' | 'sharpeRatio' | 'drawdown') => 
                        setOptimizationTarget(value)
                      }
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="optimization-method">Optimization Method</Label>
                    <Select
                      id="optimization-method"
                      value={optimizationMethod}
                      onValueChange={setOptimizationMethod}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid Search</SelectItem>
                        <SelectItem value="random">Random Search</SelectItem>
                        <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Parameter Ranges</h3>
                
                {parameters
                  .filter(param => param.type === 'number')
                  .map((param) => (
                    <div key={param.id} className="space-y-2">
                      <Label className="text-muted-foreground">{param.name}</Label>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor={`${param.id}-min`} className="text-xs">Min</Label>
                          <Input
                            id={`${param.id}-min`}
                            type="number"
                            value={parameterRanges[param.id]?.min ?? param.min}
                            onChange={(e) => handleParameterRangeChange(
                              param.id, 'min', parseFloat(e.target.value)
                            )}
                            step={param.step}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`${param.id}-max`} className="text-xs">Max</Label>
                          <Input
                            id={`${param.id}-max`}
                            type="number"
                            value={parameterRanges[param.id]?.max ?? param.max}
                            onChange={(e) => handleParameterRangeChange(
                              param.id, 'max', parseFloat(e.target.value)
                            )}
                            step={param.step}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`${param.id}-step`} className="text-xs">Step</Label>
                          <Input
                            id={`${param.id}-step`}
                            type="number"
                            value={parameterRanges[param.id]?.step ?? param.step}
                            onChange={(e) => handleParameterRangeChange(
                              param.id, 'step', parseFloat(e.target.value)
                            )}
                            step={0.1}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              <Button 
                onClick={handleOptimize} 
                className="w-full"
                disabled={isOptimizing}
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Optimization
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            {optimizationResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No optimization results yet</p>
                <p className="text-xs">Run an optimization to see results here</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {optimizationResults.map((result, index) => (
                    <div
                      key={index}
                      className={`border rounded-md p-3 cursor-pointer hover:bg-muted/40 transition-colors ${
                        selectedResultIndex === index ? "bg-primary/10 border-primary" : ""
                      }`}
                      onClick={() => setSelectedResultIndex(index)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Optimization #{index + 1}</h3>
                        <span className="text-green-500 text-sm font-medium">
                          +{result.improvement}%
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Profit:</span>{" "}
                          <span className="font-medium">
                            {result.performance.profit.toFixed(2)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Win Rate:</span>{" "}
                          <span className="font-medium">
                            {result.performance.winRate.toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sharpe:</span>{" "}
                          <span className="font-medium">
                            {result.performance.sharpeRatio.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Drawdown:</span>{" "}
                          <span className="font-medium">
                            {result.performance.maxDrawdown.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedResultIndex !== -1 && optimizationResults[selectedResultIndex] && (
                  <div className="space-y-4 border rounded-md p-4">
                    <h3 className="font-medium">Optimized Parameters</h3>
                    
                    <div className="space-y-2">
                      {Object.entries(optimizationResults[selectedResultIndex].parameterValues).map(
                        ([key, value]) => (
                          <div key={key} className="grid grid-cols-2 text-sm">
                            <div className="text-muted-foreground">{key}</div>
                            <div className="font-medium">
                              {typeof value === "number"
                                ? value.toFixed(2)
                                : String(value)}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    
                    <Button onClick={handleApplyParameters} className="w-full">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Apply These Parameters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedParameterOptimization;
