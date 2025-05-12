import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { optimizeStrategy } from '@/services/strategyBuilderService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sliders, Settings } from 'lucide-react';
import { AITradingStrategy, OptimizationResult } from '@/types/trading';

interface AdvancedParameterOptimizationProps {
  strategy: AITradingStrategy | null;
  onApplyParameters?: (parameters: Record<string, any>) => void;
}

const AdvancedParameterOptimization: React.FC<AdvancedParameterOptimizationProps> = ({ 
  strategy,
  onApplyParameters
}) => {
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationTarget, setOptimizationTarget] = useState<string>('profitFactor');
  const [optimizationMethod, setOptimizationMethod] = useState<string>('grid-search');
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [optimizationProgress, setOptimizationProgress] = useState<number>(0);
  const [iterations, setIterations] = useState<number>(50);
  const [testPeriod, setTestPeriod] = useState<string>('1y');
  const [paramRanges, setParamRanges] = useState<Array<{
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    current: number[];
    enabled: boolean;
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
            current: [value],
            enabled: true
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
    setOptimizationProgress(0);
    
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
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setOptimizationProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 500);
      
      // Call the strategy optimization service
      const result = await optimizeStrategy(
        strategy,
        parameterRanges,
        optimizationTarget as any
      );
      
      clearInterval(progressInterval);
      setOptimizationProgress(100);
      
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
  
  if (!strategy) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-12 text-muted-foreground">
          <p>Select a strategy to optimize parameters</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Sliders className="h-5 w-5 mr-2" />
              Advanced Parameter Optimization
            </CardTitle>
            <CardDescription>
              Optimize strategy parameters to maximize performance
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={strategy?.type === 'trend-following' ? 'default' : 'outline'}>
              {strategy?.type}
            </Badge>
            <Badge variant="outline">{strategy?.timeframe}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="parameters">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            {optimizationResult && <TabsTrigger value="results">Results</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="parameters" className="space-y-4 pt-4">
            <div className="space-y-4">
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
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`${param.id}-enabled`}
                              checked={param.enabled}
                              onCheckedChange={(checked) => handleToggleParameter(param.id, checked)}
                            />
                            <Label htmlFor={`${param.id}-enabled`} className="cursor-pointer">{param.label}</Label>
                          </div>
                          <span className="text-sm font-mono">{param.current[0]}</span>
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
                          
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{param.min.toFixed(2)}</span>
                            <span>{param.max.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="pt-4">
            <div className="space-y-6">
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="text-sm font-medium mb-2">Optimization Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="optimization-method">Optimization Method</Label>
                  <Select
                    value={optimizationMethod}
                    onValueChange={setOptimizationMethod}
                  >
                    <SelectTrigger id="optimization-method">
                      <SelectValue placeholder="Select optimization method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid-search">Grid Search</SelectItem>
                      <SelectItem value="monte-carlo">Monte Carlo</SelectItem>
                      <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="optimization-target">Optimization Target</Label>
                  <Select
                    value={optimizationTarget}
                    onValueChange={setOptimizationTarget}
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
                
                <div className="space-y-2">
                  <Label htmlFor="iterations">Number of Iterations</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="iterations"
                      min={10}
                      max={200}
                      step={10}
                      value={[iterations]}
                      onValueChange={(values) => setIterations(values[0])}
                    />
                    <span className="w-12 text-right">{iterations}</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="text-sm font-medium mb-2">Backtesting Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="test-period">Test Period</Label>
                  <Select value={testPeriod} onValueChange={setTestPeriod}>
                    <SelectTrigger id="test-period">
                      <SelectValue placeholder="Select test period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1 Month</SelectItem>
                      <SelectItem value="3m">3 Months</SelectItem>
                      <SelectItem value="6m">6 Months</SelectItem>
                      <SelectItem value="1y">1 Year</SelectItem>
                      <SelectItem value="2y">2 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data-split">Data Split</Label>
                  <Select defaultValue="80-20">
                    <SelectTrigger id="data-split">
                      <SelectValue placeholder="Select data split" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="70-30">70% Training / 30% Testing</SelectItem>
                      <SelectItem value="80-20">80% Training / 20% Testing</SelectItem>
                      <SelectItem value="90-10">90% Training / 10% Testing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="walk-forward">Walk-Forward Analysis</Label>
                    <Switch id="walk-forward" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tests strategy on out-of-sample data for more robust results
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {optimizationResult && (
            <TabsContent value="results" className="pt-4">
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-4">Optimization Results</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Improvement:</span>
                      <span className="text-green-600 font-bold">
                        +{optimizationResult.improvement?.toFixed(2)}%
                      </span>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Parameter</TableHead>
                          <TableHead>Original</TableHead>
                          <TableHead>Optimized</TableHead>
                          <TableHead>Change</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paramRanges.filter(p => p.enabled).map(param => {
                          const originalValue = param.current[0];
                          const optimizedValue = optimizationResult.parameterValues[param.id];
                          const change = ((optimizedValue - originalValue) / originalValue) * 100;
                          const isPositive = change >= 0;
                          
                          return (
                            <TableRow key={param.id}>
                              <TableCell>{param.label}</TableCell>
                              <TableCell>{originalValue.toFixed(2)}</TableCell>
                              <TableCell>{optimizedValue.toFixed(2)}</TableCell>
                              <TableCell className={isPositive ? 'text-green-600' : 'text-red-600'}>
                                {isPositive ? '+' : ''}{change.toFixed(2)}%
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Performance Comparison</h4>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="p-3 border rounded-md">
                          <div className="text-xs text-muted-foreground">Profit</div>
                          <div className="font-medium text-green-600">
                            +{optimizationResult.performance.returns.toFixed(2)}%
                          </div>
                        </div>
                        <div className="p-3 border rounded-md">
                          <div className="text-xs text-muted-foreground">Win Rate</div>
                          <div className="font-medium">
                            {(optimizationResult.performance.winRate * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="p-3 border rounded-md">
                          <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                          <div className="font-medium">
                            {optimizationResult.performance.sharpeRatio.toFixed(2)}
                          </div>
                        </div>
                        <div className="p-3 border rounded-md">
                          <div className="text-xs text-muted-foreground">Max Drawdown</div>
                          <div className="font-medium text-red-600">
                            -{optimizationResult.performance.maxDrawdown.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleApplyParameters}>
                        <Settings className="h-4 w-4 mr-2" />
                        Apply Optimized Parameters
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4 pb-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {isOptimizing ? (
            <div className="flex items-center">
              <div className="w-36 h-2 bg-muted rounded-full mr-2">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${optimizationProgress}%` }}
                ></div>
              </div>
              <span>{Math.round(optimizationProgress)}% complete</span>
            </div>
          ) : (
            <span>{paramRanges.filter(p => p.enabled).length} parameters selected</span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setOptimizationResult(null)}
            disabled={!optimizationResult || isOptimizing}
          >
            Reset
          </Button>
          <Button 
            onClick={handleOptimize}
            disabled={isOptimizing || paramRanges.filter(p => p.enabled).length === 0}
          >
            {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AdvancedParameterOptimization;
