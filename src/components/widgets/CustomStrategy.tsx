import React, { useState, useEffect } from 'react';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent 
} from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  availableTimeframes, 
  sampleStrategies 
} from '@/utils/aiTradingStrategies';
import { 
  AITradingStrategy,
  TimeframeOption,
  TechnicalIndicator,
  StrategyParameter
} from '@/types/trading';

// Placeholder component - in a real implementation, you would connect this to backtesting functionality
const CustomStrategy = () => {
  const [strategy, setStrategy] = useState<AITradingStrategy>({
    id: `strategy-${Date.now()}`,
    name: 'Custom Strategy',
    description: 'My custom trading strategy',
    tags: ['custom'],
    timeframes: ['1h'],
    indicators: [],
    parameters: [],
    riskLevel: 'medium'
  });

  const [selectedIndicators, setSelectedIndicators] = useState<TechnicalIndicator[]>([]);
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>(['1h']);
  const [activeTab, setActiveTab] = useState('general');
  const [template, setTemplate] = useState<string | null>(null);
  
  // Initialize from template if selected
  useEffect(() => {
    if (template) {
      const templateStrategy = sampleStrategies.find(s => s.id === template);
      if (templateStrategy) {
        setStrategy({
          ...templateStrategy,
          id: `strategy-${Date.now()}`,
          name: `Custom ${templateStrategy.name}`,
        });
        setSelectedIndicators([...templateStrategy.indicators]);
        setSelectedTimeframes([...(templateStrategy.timeframes as string[])]);
      }
    }
  }, [template]);

  const handleStrategyChange = (field: keyof AITradingStrategy, value: any) => {
    setStrategy(prev => ({ ...prev, [field]: value }));
  };

  const handleAddParameter = () => {
    const newParam: StrategyParameter = {
      id: `param-${Date.now()}`,
      name: 'newParameter',
      label: 'New Parameter',
      description: 'Description of the parameter',
      type: 'number',
      value: 0,
      min: 0,
      max: 100,
      step: 1
    };

    setStrategy(prev => ({
      ...prev,
      parameters: [...prev.parameters, newParam]
    }));
  };

  const handleParameterChange = (index: number, field: keyof StrategyParameter, value: any) => {
    setStrategy(prev => {
      const updatedParams = [...prev.parameters];
      updatedParams[index] = { ...updatedParams[index], [field]: value };
      return { ...prev, parameters: updatedParams };
    });
  };

  const handleRemoveParameter = (index: number) => {
    setStrategy(prev => {
      const updatedParams = prev.parameters.filter((_, i) => i !== index);
      return { ...prev, parameters: updatedParams };
    });
  };

  const handleSaveStrategy = () => {
    console.log('Saving strategy:', {
      ...strategy,
      indicators: selectedIndicators,
      timeframes: selectedTimeframes
    });
    // In a real application, you would save this to your state management or API
  };

  // All available indicators
  const availableIndicators: TechnicalIndicator[] = [
    {
      name: 'Moving Average',
      period: 20,
      key: 'ma',
      category: 'Trend',
      description: 'Simple moving average'
    },
    {
      name: 'RSI',
      period: 14,
      key: 'rsi',
      category: 'Momentum',
      description: 'Relative Strength Index'
    },
    {
      name: 'MACD',
      period: 26,
      params: { fast: 12, slow: 26, signal: 9 },
      key: 'macd',
      category: 'Momentum',
      description: 'Moving Average Convergence Divergence'
    },
    {
      name: 'Bollinger Bands',
      period: 20,
      key: 'bollinger',
      category: 'Volatility',
      description: 'Price volatility bands'
    },
    {
      name: 'Stochastic Oscillator',
      period: 14,
      key: 'stochastic',
      category: 'Momentum',
      description: 'Stochastic momentum indicator'
    }
  ];

  const isIndicatorSelected = (indicator: TechnicalIndicator) => {
    return selectedIndicators.some(i => i.key === indicator.key);
  };

  const toggleIndicator = (indicator: TechnicalIndicator) => {
    if (isIndicatorSelected(indicator)) {
      setSelectedIndicators(prev => prev.filter(i => i.key !== indicator.key));
    } else {
      setSelectedIndicators(prev => [...prev, indicator]);
    }
  };

  const isTimeframeSelected = (timeframe: TimeframeOption) => {
    return selectedTimeframes.includes(timeframe.value);
  };

  const toggleTimeframe = (timeframe: TimeframeOption) => {
    if (isTimeframeSelected(timeframe)) {
      setSelectedTimeframes(prev => prev.filter(t => t !== timeframe.value));
    } else {
      setSelectedTimeframes(prev => [...prev, timeframe.value]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Custom Strategy</CardTitle>
        <CardDescription>
          Design your own trading strategy by defining indicators, timeframes and parameters
        </CardDescription>

        <div className="mt-2">
          <Label>Start from Template</Label>
          <Select
            value={template || ''}
            onValueChange={value => value ? setTemplate(value) : setTemplate(null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a template or start from scratch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Start from scratch</SelectItem>
              {sampleStrategies.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="rules">Rules & Indicators</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-4">
              <div>
                <Label htmlFor="strategy-name">Strategy Name</Label>
                <Input
                  id="strategy-name"
                  value={strategy.name}
                  onChange={(e) => handleStrategyChange('name', e.target.value)}
                  placeholder="Enter strategy name"
                />
              </div>

              <div>
                <Label htmlFor="strategy-desc">Description</Label>
                <Input
                  id="strategy-desc"
                  value={strategy.description}
                  onChange={(e) => handleStrategyChange('description', e.target.value)}
                  placeholder="Describe your strategy"
                />
              </div>

              <div>
                <Label htmlFor="risk-level">Risk Level</Label>
                <Select
                  value={strategy.riskLevel}
                  onValueChange={(value) => handleStrategyChange('riskLevel', value)}
                >
                  <SelectTrigger id="risk-level">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['trend', 'momentum', 'reversal', 'breakout', 'scalping', 'swing', 'position', 'mean-reversion'].map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`tag-${tag}`}
                        checked={strategy.tags?.includes(tag)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleStrategyChange('tags', [...(strategy.tags || []), tag]);
                          } else {
                            handleStrategyChange('tags', strategy.tags?.filter(t => t !== tag) || []);
                          }
                        }}
                      />
                      <label
                        htmlFor={`tag-${tag}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Timeframes</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {availableTimeframes.map((timeframe) => (
                    <div key={timeframe.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`timeframe-${timeframe.value}`}
                        checked={isTimeframeSelected(timeframe)}
                        onCheckedChange={() => toggleTimeframe(timeframe)}
                      />
                      <label
                        htmlFor={`timeframe-${timeframe.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {timeframe.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules">
            <div className="space-y-4">
              <div>
                <Label>Technical Indicators</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {availableIndicators.map((indicator) => (
                    <div key={indicator.key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`indicator-${indicator.key}`}
                        checked={isIndicatorSelected(indicator)}
                        onCheckedChange={() => toggleIndicator(indicator)}
                      />
                      <label
                        htmlFor={`indicator-${indicator.key}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {indicator.name} ({indicator.period})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Selected Indicators</Label>
                <div className="space-y-3 mt-2">
                  {selectedIndicators.length > 0 ? (
                    selectedIndicators.map((indicator, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="font-medium">{indicator.name}</div>
                        <div className="text-sm text-gray-500 mt-1">Period: {indicator.period}</div>
                        {indicator.description && (
                          <div className="text-sm mt-1">{indicator.description}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 text-gray-500">
                      No indicators selected yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="parameters">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={handleAddParameter} size="sm">
                  Add Parameter
                </Button>
              </div>

              {strategy.parameters && strategy.parameters.length > 0 ? (
                <div className="space-y-6">
                  {strategy.parameters.map((param, index) => (
                    <div key={param.id} className="p-4 border rounded-md space-y-3">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{param.label || param.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveParameter(index)}
                          className="h-8 w-8 p-0"
                        >
                          ✕
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`param-name-${index}`}>Name</Label>
                          <Input
                            id={`param-name-${index}`}
                            value={param.name}
                            onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`param-label-${index}`}>Label</Label>
                          <Input
                            id={`param-label-${index}`}
                            value={param.label || ''}
                            onChange={(e) => handleParameterChange(index, 'label', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`param-type-${index}`}>Type</Label>
                          <Select
                            value={param.type}
                            onValueChange={(value) => handleParameterChange(index, 'type', value)}
                          >
                            <SelectTrigger id={`param-type-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="select">Select</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`param-value-${index}`}>Default Value</Label>
                          <Input
                            id={`param-value-${index}`}
                            value={param.value.toString()}
                            onChange={(e) => {
                              const value = param.type === 'number' 
                                ? parseFloat(e.target.value) || 0 
                                : e.target.value;
                              handleParameterChange(index, 'value', value);
                            }}
                            type={param.type === 'number' ? 'number' : 'text'}
                          />
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor={`param-desc-${index}`}>Description</Label>
                          <Input
                            id={`param-desc-${index}`}
                            value={param.description}
                            onChange={(e) => handleParameterChange(index, 'description', e.target.value)}
                          />
                        </div>

                        {param.type === 'number' && (
                          <>
                            <div>
                              <Label htmlFor={`param-min-${index}`}>Min Value</Label>
                              <Input
                                id={`param-min-${index}`}
                                value={param.min || 0}
                                onChange={(e) => handleParameterChange(index, 'min', parseFloat(e.target.value) || 0)}
                                type="number"
                              />
                            </div>

                            <div>
                              <Label htmlFor={`param-max-${index}`}>Max Value</Label>
                              <Input
                                id={`param-max-${index}`}
                                value={param.max || 0}
                                onChange={(e) => handleParameterChange(index, 'max', parseFloat(e.target.value) || 0)}
                                type="number"
                              />
                            </div>

                            <div>
                              <Label htmlFor={`param-step-${index}`}>Step</Label>
                              <Input
                                id={`param-step-${index}`}
                                value={param.step || 1}
                                onChange={(e) => handleParameterChange(index, 'step', parseFloat(e.target.value) || 1)}
                                type="number"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500 border rounded-md">
                  No parameters defined yet. Click "Add Parameter" to create one.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button variant="outline" className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleSaveStrategy}>
            Save Strategy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomStrategy;
