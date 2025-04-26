
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { predefinedStrategies, technicalIndicators, tradingTimeframes, generateCustomStrategy } from '@/utils/aiTradingStrategies';
import { Settings2, LineChart, Code2, PlaySquare, Zap, Braces, Save } from 'lucide-react';
import { AITradingStrategy, StrategyParameter, TechnicalIndicator, TradingTimeframe } from '@/types/trading';

const CustomStrategy = () => {
  // Strategy metadata
  const [strategyName, setStrategyName] = useState('');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [riskLevel, setRiskLevel] = useState('Medium');
  
  // Strategy components
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [customParameters, setCustomParameters] = useState<StrategyParameter[]>([]);
  
  // Strategy template
  const [templateStrategy, setTemplateStrategy] = useState<string>('');
  
  // Custom parameter editor
  const [paramName, setParamName] = useState('');
  const [paramLabel, setParamLabel] = useState('');
  const [paramType, setParamType] = useState<'number' | 'boolean' | 'string' | 'select'>('number');
  const [paramValue, setParamValue] = useState<string>('0');
  const [paramMin, setParamMin] = useState<string>('0');
  const [paramMax, setParamMax] = useState<string>('100');
  const [paramStep, setParamStep] = useState<string>('1');
  
  // Custom code
  const [customCode, setCustomCode] = useState('// Define your custom trading logic here\n\n// Entry condition\nif (rsi < rsiOversold && price > sma200) {\n  return BUY;\n}\n\n// Exit condition\nif (rsi > rsiOverbought || price < sma50) {\n  return SELL;\n}\n\nreturn HOLD;');
  
  // Created strategy
  const [createdStrategy, setCreatedStrategy] = useState<AITradingStrategy | null>(null);

  // Set template when selected
  useEffect(() => {
    if (templateStrategy) {
      const template = predefinedStrategies.find(s => s.id === templateStrategy);
      if (template) {
        setStrategyName(`Custom ${template.name}`);
        setStrategyDescription(`${template.description} (Custom Version)`);
        setRiskLevel(template.stats.riskLevel);
        setSelectedIndicators(template.indicators);
        setSelectedTimeframes(template.timeframes);
        setCustomParameters(template.parameters);
      }
    }
  }, [templateStrategy]);
  
  const handleAddIndicator = (indicator: string) => {
    if (!selectedIndicators.includes(indicator)) {
      setSelectedIndicators([...selectedIndicators, indicator]);
    }
  };
  
  const handleRemoveIndicator = (indicator: string) => {
    setSelectedIndicators(selectedIndicators.filter(i => i !== indicator));
  };
  
  const handleAddTimeframe = (timeframe: string) => {
    if (!selectedTimeframes.includes(timeframe)) {
      setSelectedTimeframes([...selectedTimeframes, timeframe]);
    }
  };
  
  const handleRemoveTimeframe = (timeframe: string) => {
    setSelectedTimeframes(selectedTimeframes.filter(t => t !== timeframe));
  };
  
  const handleAddParameter = () => {
    if (!paramName || !paramLabel) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Parameter name and label are required",
      });
      return;
    }
    
    // Clean up parameter name (no spaces, lowercase with camelCase)
    const cleanName = paramName
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^([A-Z])/, m => m.toLowerCase());
    
    // Validate param name is unique
    if (customParameters.some(p => p.name === cleanName)) {
      toast({
        variant: "destructive", 
        title: "Validation Error",
        description: "Parameter name must be unique",
      });
      return;
    }
    
    const newParam: StrategyParameter = {
      name: cleanName,
      label: paramLabel,
      type: paramType,
      value: paramType === 'number' ? Number(paramValue) : paramValue
    };
    
    if (paramType === 'number') {
      newParam.min = Number(paramMin);
      newParam.max = Number(paramMax);
      newParam.step = Number(paramStep);
    }
    
    setCustomParameters([...customParameters, newParam]);
    
    // Reset form
    setParamName('');
    setParamLabel('');
    setParamValue('0');
    setParamMin('0');
    setParamMax('100');
    setParamStep('1');
    
    toast({
      title: "Parameter Added",
      description: `Added ${paramLabel} to strategy parameters`,
    });
  };
  
  const handleRemoveParameter = (index: number) => {
    setCustomParameters(customParameters.filter((_, i) => i !== index));
  };
  
  const handleCreateStrategy = () => {
    // Validate
    if (!strategyName) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Strategy name is required",
      });
      return;
    }
    
    if (selectedIndicators.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "At least one indicator is required",
      });
      return;
    }
    
    if (selectedTimeframes.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "At least one timeframe is required",
      });
      return;
    }
    
    // Create the strategy
    const newStrategy = generateCustomStrategy(
      strategyName,
      strategyDescription,
      selectedIndicators,
      selectedTimeframes,
      customParameters,
      riskLevel
    );
    
    setCreatedStrategy(newStrategy);
    
    toast({
      title: "Strategy Created",
      description: `${strategyName} has been created successfully`,
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-medium text-lg">Strategy Basics</h3>
            
            <div className="space-y-2">
              <Label htmlFor="strategyName">Strategy Name</Label>
              <Input 
                id="strategyName" 
                value={strategyName} 
                onChange={(e) => setStrategyName(e.target.value)} 
                placeholder="Enter strategy name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategyDescription">Description</Label>
              <Textarea 
                id="strategyDescription" 
                value={strategyDescription} 
                onChange={(e) => setStrategyDescription(e.target.value)} 
                placeholder="Describe your strategy"
                className="resize-none h-20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="riskLevel">Risk Level</Label>
              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger id="riskLevel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Very High">Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="templateStrategy">Start From Template (Optional)</Label>
              <Select value={templateStrategy} onValueChange={setTemplateStrategy}>
                <SelectTrigger id="templateStrategy">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Template</SelectItem>
                  {predefinedStrategies.map(strategy => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full" onClick={handleCreateStrategy}>
              <Save className="w-4 h-4 mr-2" />
              Create Strategy
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-2">
          <CardContent className="p-4">
            <Tabs defaultValue="indicators">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="indicators" className="flex items-center">
                  <LineChart className="w-4 h-4 mr-1" />
                  <span>Indicators</span>
                </TabsTrigger>
                <TabsTrigger value="timeframes" className="flex items-center">
                  <Settings2 className="w-4 h-4 mr-1" />
                  <span>Timeframes</span>
                </TabsTrigger>
                <TabsTrigger value="parameters" className="flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  <span>Parameters</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center">
                  <Code2 className="w-4 h-4 mr-1" />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="indicators" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Available Indicators</h4>
                    <div className="border rounded-md p-3 h-80 overflow-y-auto space-y-2">
                      {technicalIndicators.map(indicator => (
                        <button
                          key={indicator.key}
                          onClick={() => handleAddIndicator(indicator.key)}
                          className="w-full text-left p-2 hover:bg-muted rounded-md flex justify-between items-center"
                          disabled={selectedIndicators.includes(indicator.key)}
                        >
                          <span>{indicator.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted">{indicator.category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Selected Indicators</h4>
                    <div className="border rounded-md p-3 h-80 overflow-y-auto space-y-2">
                      {selectedIndicators.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-20">
                          <p className="text-sm text-muted-foreground">No indicators selected</p>
                          <p className="text-xs text-muted-foreground">Click on available indicators to add them</p>
                        </div>
                      ) : (
                        selectedIndicators.map(indicatorKey => {
                          const indicator = technicalIndicators.find(i => i.key === indicatorKey);
                          return (
                            <div key={indicatorKey} className="flex justify-between items-center p-2 bg-muted/40 rounded-md">
                              <span>{indicator ? indicator.name : indicatorKey}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveIndicator(indicatorKey)}
                                className="h-6 text-xs"
                              >
                                Remove
                              </Button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="timeframes" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Available Timeframes</h4>
                    <div className="border rounded-md p-3 h-64 overflow-y-auto space-y-2">
                      {tradingTimeframes.map(timeframe => (
                        <button
                          key={timeframe.value}
                          onClick={() => handleAddTimeframe(timeframe.value)}
                          className="w-full text-left p-2 hover:bg-muted rounded-md flex justify-between items-center"
                          disabled={selectedTimeframes.includes(timeframe.value)}
                        >
                          <span>{timeframe.label}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted">{timeframe.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Selected Timeframes</h4>
                    <div className="border rounded-md p-3 h-64 overflow-y-auto space-y-2">
                      {selectedTimeframes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-20">
                          <p className="text-sm text-muted-foreground">No timeframes selected</p>
                          <p className="text-xs text-muted-foreground">Click on available timeframes to add them</p>
                        </div>
                      ) : (
                        selectedTimeframes.map(timeframeValue => {
                          const timeframe = tradingTimeframes.find(t => t.value === timeframeValue);
                          return (
                            <div key={timeframeValue} className="flex justify-between items-center p-2 bg-muted/40 rounded-md">
                              <div>
                                <span className="font-medium">{timeframe?.label || timeframeValue}</span>
                                <span className="text-xs text-muted-foreground ml-2">{timeframe?.description}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveTimeframe(timeframeValue)}
                                className="h-6 text-xs"
                              >
                                Remove
                              </Button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="parameters" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Add Parameter</h4>
                    <div className="border rounded-md p-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="paramName">Parameter Name</Label>
                          <Input 
                            id="paramName" 
                            value={paramName} 
                            onChange={(e) => setParamName(e.target.value)} 
                            placeholder="e.g. rsiPeriod"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paramLabel">Display Label</Label>
                          <Input 
                            id="paramLabel" 
                            value={paramLabel} 
                            onChange={(e) => setParamLabel(e.target.value)} 
                            placeholder="e.g. RSI Period"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="paramType">Parameter Type</Label>
                        <Select value={paramType} onValueChange={(value) => setParamType(value as any)}>
                          <SelectTrigger id="paramType">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="string">Text</SelectItem>
                            <SelectItem value="select">Selection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {paramType === 'number' && (
                        <div className="grid grid-cols-4 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="paramValue">Default</Label>
                            <Input 
                              id="paramValue" 
                              type="number" 
                              value={paramValue} 
                              onChange={(e) => setParamValue(e.target.value)} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="paramMin">Min</Label>
                            <Input 
                              id="paramMin" 
                              type="number" 
                              value={paramMin} 
                              onChange={(e) => setParamMin(e.target.value)} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="paramMax">Max</Label>
                            <Input 
                              id="paramMax" 
                              type="number" 
                              value={paramMax} 
                              onChange={(e) => setParamMax(e.target.value)} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="paramStep">Step</Label>
                            <Input 
                              id="paramStep" 
                              type="number" 
                              value={paramStep} 
                              onChange={(e) => setParamStep(e.target.value)} 
                            />
                          </div>
                        </div>
                      )}
                      
                      {(paramType === 'boolean' || paramType === 'string' || paramType === 'select') && (
                        <div className="space-y-2">
                          <Label htmlFor="paramValue">Default Value</Label>
                          <Input 
                            id="paramValue" 
                            value={paramValue} 
                            onChange={(e) => setParamValue(e.target.value)} 
                            placeholder="Enter default value"
                          />
                        </div>
                      )}
                      
                      <Button onClick={handleAddParameter} className="w-full mt-2">
                        Add Parameter
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Strategy Parameters</h4>
                    <div className="border rounded-md p-3 h-80 overflow-y-auto space-y-3">
                      {customParameters.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-20">
                          <p className="text-sm text-muted-foreground">No parameters defined</p>
                          <p className="text-xs text-muted-foreground">Add parameters to customize your strategy</p>
                        </div>
                      ) : (
                        customParameters.map((param, index) => (
                          <div key={index} className="p-3 border rounded-md">
                            <div className="flex justify-between">
                              <div>
                                <span className="font-medium">{param.label}</span>
                                <span className="text-xs bg-muted px-2 py-1 rounded-full ml-2">{param.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveParameter(index)}
                                className="h-6 text-xs"
                              >
                                Remove
                              </Button>
                            </div>
                            <div className="mt-2 text-sm">
                              <span className="text-muted-foreground">Type: </span>
                              <span>{param.type}</span>
                              {param.type === 'number' && (
                                <>
                                  <span className="text-muted-foreground ml-3">Range: </span>
                                  <span>{param.min} to {param.max} (step: {param.step})</span>
                                </>
                              )}
                            </div>
                            <div className="mt-1 text-sm">
                              <span className="text-muted-foreground">Default: </span>
                              <span>{param.value}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="pt-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Custom Strategy Code</h4>
                  <div className="border rounded-md p-0 overflow-hidden">
                    <div className="bg-muted px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <Code2 className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Strategy Logic</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <PlaySquare className="w-4 h-4 mr-1" />
                        Test Logic
                      </Button>
                    </div>
                    <div className="p-1">
                      <Textarea
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                        className="font-mono text-sm resize-none h-80 border-0 bg-background focus-visible:ring-0"
                      />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Define your strategy logic using JavaScript. Available variables:</p>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      <li>All parameters defined in the Parameters tab</li>
                      <li>Technical indicators: rsi, macd, sma, ema, bollinger...</li>
                      <li>Price data: price, open, high, low, close, volume</li>
                      <li>Return BUY, SELL, or HOLD to signal trading actions</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Created Strategy Preview */}
      {createdStrategy && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Strategy Preview</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Strategy Details</h4>
                <div className="bg-muted/50 p-3 rounded-md space-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground block">Name</span>
                    <span className="font-medium">{createdStrategy.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Description</span>
                    <span>{createdStrategy.description}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Type</span>
                    <span className="capitalize">{createdStrategy.type}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Risk Level</span>
                    <span>{createdStrategy.riskLevel}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Components</h4>
                <div className="bg-muted/50 p-3 rounded-md space-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground block">Indicators</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {createdStrategy.indicators.map(indicator => (
                        <span key={indicator} className="px-2 py-1 bg-background text-xs rounded-full border">
                          {indicator}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Timeframes</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {createdStrategy.timeframes.map(timeframe => (
                        <span key={timeframe} className="px-2 py-1 bg-background text-xs rounded-full border">
                          {timeframe}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Performance Estimate</h4>
                <div className="bg-muted/50 p-3 rounded-md space-y-2">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground block">Win Rate</span>
                      <span className="font-medium">{createdStrategy.stats.winRate.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Avg Return</span>
                      <span className="font-medium">{createdStrategy.stats.averageReturn.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Max Drawdown</span>
                      <span className="font-medium text-amber-600">{createdStrategy.stats.maxDrawdown.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Risk Level</span>
                      <span className="font-medium">{createdStrategy.stats.riskLevel}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <span className="text-xs text-muted-foreground block">Note</span>
                    <p className="text-xs">Performance is estimated based on strategy components. Run backtests for actual results.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between">
                <Button>
                  <Braces className="w-4 h-4 mr-2" />
                  Export Strategy
                </Button>
                <Button variant="default">
                  <PlaySquare className="w-4 h-4 mr-2" />
                  Run Backtest
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomStrategy;
