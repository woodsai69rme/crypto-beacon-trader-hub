
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AITradingStrategy, OptimizationResult } from '@/types/trading';

export interface AdvancedParameterOptimizationProps {
  strategy: AITradingStrategy;
  onApplyParameters: (parameters: Record<string, any>) => void;
}

const AdvancedParameterOptimization: React.FC<AdvancedParameterOptimizationProps> = ({ 
  strategy, 
  onApplyParameters 
}) => {
  const [activeTab, setActiveTab] = useState('parameters');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<OptimizationResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<OptimizationResult | null>(null);
  
  // Parameter ranges for optimization
  const [parameterRanges, setParameterRanges] = useState({
    period: { min: 10, max: 20, step: 1 },
    threshold: { min: 60, max: 80, step: 1 },
    stopLoss: { min: 3, max: 7, step: 0.5 },
    takeProfit: { min: 6, max: 14, step: 0.5 },
    ...(strategy.parameters.fastPeriod ? {
      fastPeriod: { min: 8, max: 16, step: 2 },
      slowPeriod: { min: 20, max: 30, step: 2 },
      signalPeriod: { min: 7, max: 12, step: 1 }
    } : {}),
    ...(strategy.parameters.upperBand ? {
      upperBand: { min: 65, max: 75, step: 1 },
      lowerBand: { min: 25, max: 35, step: 1 }
    } : {})
  });
  
  // Optimization settings
  const [optimizationSettings, setOptimizationSettings] = useState({
    iterations: 50,
    targetMetric: 'returns',
    initialCapital: 10000,
    timeframe: strategy.timeframe,
    useCrossValidation: false,
    asset: 'bitcoin',
    startDate: '2022-01-01',
    endDate: '2023-01-01'
  });
  
  // Handle parameter range change
  const handleRangeChange = (
    param: string, 
    field: 'min' | 'max' | 'step', 
    value: number
  ) => {
    setParameterRanges(prev => ({
      ...prev,
      [param]: {
        ...prev[param],
        [field]: value
      }
    }));
  };
  
  // Handle optimization settings change
  const handleSettingChange = (setting: string, value: any) => {
    setOptimizationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const runOptimization = () => {
    setIsOptimizing(true);
    
    // Simulate optimization process with a timeout
    setTimeout(() => {
      // Generate 3-5 random optimization results
      const count = Math.floor(Math.random() * 3) + 3;
      const newResults: OptimizationResult[] = [];
      
      for (let i = 0; i < count; i++) {
        // Create randomized parameters
        const optimizedParams = { ...strategy.parameters };
        
        // Modify parameters within the defined range
        Object.entries(parameterRanges).forEach(([param, range]) => {
          if (strategy.parameters[param] !== undefined) {
            const randValue = range.min + Math.random() * (range.max - range.min);
            optimizedParams[param] = Math.round(randValue / range.step) * range.step;
          }
        });
        
        // Base improvement amount - higher for first result
        const improvementBase = i === 0 ? 15 : 5 + Math.random() * 10;
        
        newResults.push({
          id: `opt-${Date.now()}-${i}`,
          strategyId: strategy.id,
          parameters: optimizedParams,
          performance: {
            returns: (strategy.performance?.returns || 20) + improvementBase,
            winRate: (strategy.performance?.winRate || 60) + (Math.random() * 7),
            profitFactor: (strategy.performance?.profitFactor || 1.5) + (Math.random() * 0.5),
            sharpeRatio: 2.0 + (Math.random() * 0.5),
            maxDrawdown: (Math.random() * 5) + 7
          },
          trades: (strategy.performance?.trades || 100) + Math.floor(Math.random() * 30),
          timeframe: strategy.timeframe,
          optimizationDate: new Date().toISOString(),
          improvement: improvementBase,
          parameterValues: optimizedParams
        });
      }
      
      // Sort by improvement (best first)
      newResults.sort((a, b) => b.improvement - a.improvement);
      
      setResults(newResults);
      setSelectedResult(newResults[0]);
      setIsOptimizing(false);
    }, 2500);
  };
  
  const handleApplyOptimization = () => {
    if (!selectedResult) return;
    onApplyParameters(selectedResult.parameterValues);
    setResults([]);
    setSelectedResult(null);
  };
  
  // Get parameters that can be optimized
  const optimizableParams = Object.entries(strategy.parameters)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({
      name: key,
      value
    }))
    .filter(param => parameterRanges[param.name]);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Advanced Optimization</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4 mx-6">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="parameters" className="px-6 pb-6">
            <div className="space-y-5">
              <div className="text-sm text-muted-foreground">
                Define parameter ranges for optimization:
              </div>
              
              {optimizableParams.length > 0 ? (
                <>
                  {optimizableParams.map((param) => (
                    <div key={param.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>
                          <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                            {param.name}
                          </span>
                          <span className="ml-2 text-sm">
                            (Current: {param.value})
                          </span>
                        </Label>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">Min</Label>
                          <Input
                            type="number"
                            value={parameterRanges[param.name]?.min}
                            onChange={(e) => handleRangeChange(
                              param.name, 
                              'min', 
                              parseFloat(e.target.value) || 0
                            )}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Max</Label>
                          <Input
                            type="number"
                            value={parameterRanges[param.name]?.max}
                            onChange={(e) => handleRangeChange(
                              param.name, 
                              'max', 
                              parseFloat(e.target.value) || 0
                            )}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Step</Label>
                          <Input
                            type="number"
                            value={parameterRanges[param.name]?.step}
                            onChange={(e) => handleRangeChange(
                              param.name, 
                              'step', 
                              parseFloat(e.target.value) || 0.1
                            )}
                            className="h-8"
                            step="0.1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No optimizable parameters found</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="px-6 pb-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Asset</Label>
                  <Select
                    value={optimizationSettings.asset}
                    onValueChange={(value) => handleSettingChange('asset', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                      <SelectItem value="solana">Solana (SOL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Target Metric</Label>
                  <Select
                    value={optimizationSettings.targetMetric}
                    onValueChange={(value) => handleSettingChange('targetMetric', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="returns">Returns</SelectItem>
                      <SelectItem value="sharpeRatio">Sharpe Ratio</SelectItem>
                      <SelectItem value="winRate">Win Rate</SelectItem>
                      <SelectItem value="profitFactor">Profit Factor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={optimizationSettings.startDate}
                    onChange={(e) => handleSettingChange('startDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={optimizationSettings.endDate}
                    onChange={(e) => handleSettingChange('endDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Initial Capital</Label>
                  <Input
                    type="number"
                    value={optimizationSettings.initialCapital}
                    onChange={(e) => handleSettingChange('initialCapital', parseInt(e.target.value, 10) || 10000)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Iterations</Label>
                  <Input
                    type="number"
                    value={optimizationSettings.iterations}
                    onChange={(e) => handleSettingChange('iterations', parseInt(e.target.value, 10) || 50)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="cross-validation"
                  checked={optimizationSettings.useCrossValidation}
                  onCheckedChange={(checked) => handleSettingChange('useCrossValidation', checked)}
                />
                <Label htmlFor="cross-validation">Use Cross Validation</Label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="px-6 pb-6">
            {results.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {results.map((result, index) => (
                    <Button
                      key={result.id}
                      variant={selectedResult?.id === result.id ? "default" : "outline"}
                      className={`${index === 0 ? "border-green-500" : ""}`}
                      onClick={() => setSelectedResult(result)}
                    >
                      <div>
                        <div className="font-medium">{result.performance.returns.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Variant {index + 1}</div>
                      </div>
                    </Button>
                  ))}
                </div>
                
                {selectedResult && (
                  <>
                    <div className="rounded-md border p-3 bg-muted/50">
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <div className="text-xs text-muted-foreground">Return</div>
                          <div className="text-sm font-semibold text-green-500">
                            +{selectedResult.performance.returns.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Win Rate</div>
                          <div className="text-sm font-semibold">
                            {selectedResult.performance.winRate.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Trades</div>
                          <div className="text-sm">{selectedResult.trades}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Sharpe</div>
                          <div className="text-sm">{selectedResult.performance.sharpeRatio.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Drawdown</div>
                          <div className="text-sm">{selectedResult.performance.maxDrawdown.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-md border p-3">
                      <div className="text-xs font-medium mb-2">Optimized Parameters:</div>
                      <div className="space-y-1 max-h-36 overflow-auto">
                        {Object.entries(parameterRanges).map(([param, range]) => {
                          if (selectedResult.parameterValues[param] !== undefined) {
                            const originalValue = strategy.parameters[param];
                            const newValue = selectedResult.parameterValues[param];
                            const isChanged = originalValue !== newValue;
                            
                            return (
                              <div key={param} className="grid grid-cols-4 text-xs">
                                <div className="font-mono">
                                  {param}:
                                </div>
                                <div className={isChanged ? "line-through text-muted-foreground" : ""}>
                                  {originalValue}
                                </div>
                                {isChanged && (
                                  <>
                                    <div className="text-center">→</div>
                                    <div className="font-medium">
                                      {newValue}
                                    </div>
                                  </>
                                )}
                                {!isChanged && <div className="col-span-2"></div>}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleApplyOptimization}
                    >
                      Apply Optimized Parameters
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No optimization results yet
                </p>
                <Button
                  onClick={runOptimization}
                  disabled={isOptimizing}
                >
                  {isOptimizing ? "Optimizing..." : "Run Optimization"}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedParameterOptimization;
