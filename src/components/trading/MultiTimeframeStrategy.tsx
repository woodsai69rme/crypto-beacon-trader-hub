
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Info, Activity, BarChart, Clock, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface TimeframeOption {
  value: string;
  label: string;
  duration: string;
}

interface IndicatorOption {
  id: string;
  name: string;
  category: "trend" | "oscillator" | "volume" | "momentum" | "volatility";
  description: string;
  parameters: Array<{
    name: string;
    type: "number" | "boolean" | "select";
    default: any;
    min?: number;
    max?: number;
    options?: {value: string, label: string}[];
  }>;
}

const timeframeOptions: TimeframeOption[] = [
  { value: "1m", label: "1 Minute", duration: "short" },
  { value: "5m", label: "5 Minutes", duration: "short" },
  { value: "15m", label: "15 Minutes", duration: "short" },
  { value: "30m", label: "30 Minutes", duration: "short" },
  { value: "1h", label: "1 Hour", duration: "medium" },
  { value: "4h", label: "4 Hours", duration: "medium" },
  { value: "1d", label: "1 Day", duration: "long" },
  { value: "1w", label: "1 Week", duration: "long" },
  { value: "1M", label: "1 Month", duration: "long" }
];

const indicatorOptions: IndicatorOption[] = [
  {
    id: "sma",
    name: "Simple Moving Average",
    category: "trend",
    description: "Average price over a specific time period",
    parameters: [
      { name: "period", type: "number", default: 14, min: 2, max: 200 }
    ]
  },
  {
    id: "ema",
    name: "Exponential Moving Average",
    category: "trend",
    description: "Weighted average price with more weight to recent prices",
    parameters: [
      { name: "period", type: "number", default: 14, min: 2, max: 200 }
    ]
  },
  {
    id: "rsi",
    name: "Relative Strength Index",
    category: "oscillator",
    description: "Measures the speed and change of price movements",
    parameters: [
      { name: "period", type: "number", default: 14, min: 2, max: 50 },
      { name: "overbought", type: "number", default: 70, min: 50, max: 100 },
      { name: "oversold", type: "number", default: 30, min: 0, max: 50 }
    ]
  },
  {
    id: "macd",
    name: "MACD",
    category: "momentum",
    description: "Moving Average Convergence Divergence",
    parameters: [
      { name: "fastPeriod", type: "number", default: 12, min: 2, max: 50 },
      { name: "slowPeriod", type: "number", default: 26, min: 2, max: 50 },
      { name: "signalPeriod", type: "number", default: 9, min: 2, max: 50 }
    ]
  },
  {
    id: "bb",
    name: "Bollinger Bands",
    category: "volatility",
    description: "Volatility bands placed above and below a moving average",
    parameters: [
      { name: "period", type: "number", default: 20, min: 2, max: 100 },
      { name: "deviations", type: "number", default: 2, min: 1, max: 5 }
    ]
  }
];

interface TimeframeStrategy {
  timeframe: string;
  indicators: {
    id: string;
    parameters: Record<string, any>;
  }[];
  weight: number;
}

const MultiTimeframeStrategy: React.FC = () => {
  const [strategies, setStrategies] = useState<TimeframeStrategy[]>([
    {
      timeframe: "1h",
      indicators: [
        { id: "ema", parameters: { period: 20 } },
        { id: "rsi", parameters: { period: 14, overbought: 70, oversold: 30 } }
      ],
      weight: 40
    },
    {
      timeframe: "4h",
      indicators: [
        { id: "macd", parameters: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 } }
      ],
      weight: 30
    },
    {
      timeframe: "1d",
      indicators: [
        { id: "bb", parameters: { period: 20, deviations: 2 } }
      ],
      weight: 30
    }
  ]);
  
  const [activeTab, setActiveTab] = useState("strategy");
  const [selectedTimeframeIndex, setSelectedTimeframeIndex] = useState(0);
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
  
  const addTimeframe = () => {
    // Find an unused timeframe
    const usedTimeframes = strategies.map(s => s.timeframe);
    const availableTimeframe = timeframeOptions.find(t => !usedTimeframes.includes(t.value));
    
    if (availableTimeframe) {
      setStrategies([
        ...strategies,
        {
          timeframe: availableTimeframe.value,
          indicators: [],
          weight: 10
        }
      ]);
      
      // Adjust weights to ensure they sum to 100
      recalculateWeights(strategies.length + 1);
    } else {
      toast({
        title: "Cannot Add Timeframe",
        description: "All available timeframes are already in use.",
        variant: "destructive"
      });
    }
  };
  
  const removeTimeframe = (index: number) => {
    if (strategies.length <= 1) {
      toast({
        title: "Cannot Remove Timeframe",
        description: "At least one timeframe must remain in the strategy.",
        variant: "destructive"
      });
      return;
    }
    
    const newStrategies = strategies.filter((_, i) => i !== index);
    setStrategies(newStrategies);
    
    // Adjust weights to ensure they sum to 100
    recalculateWeights(newStrategies.length);
    
    // Adjust selected timeframe if needed
    if (index === selectedTimeframeIndex) {
      setSelectedTimeframeIndex(0);
    } else if (index < selectedTimeframeIndex) {
      setSelectedTimeframeIndex(selectedTimeframeIndex - 1);
    }
  };
  
  const addIndicator = (timeframeIndex: number, indicatorId: string) => {
    const indicator = indicatorOptions.find(i => i.id === indicatorId);
    if (!indicator) return;
    
    // Check if indicator already exists in this timeframe
    const timeframeStrategy = strategies[timeframeIndex];
    if (timeframeStrategy.indicators.some(i => i.id === indicatorId)) {
      toast({
        title: "Indicator Already Added",
        description: `${indicator.name} is already being used in this timeframe.`,
        variant: "destructive"
      });
      return;
    }
    
    // Create default parameters
    const parameters: Record<string, any> = {};
    indicator.parameters.forEach(param => {
      parameters[param.name] = param.default;
    });
    
    const newStrategies = [...strategies];
    newStrategies[timeframeIndex].indicators.push({
      id: indicatorId,
      parameters
    });
    
    setStrategies(newStrategies);
  };
  
  const removeIndicator = (timeframeIndex: number, indicatorId: string) => {
    const newStrategies = [...strategies];
    newStrategies[timeframeIndex].indicators = 
      newStrategies[timeframeIndex].indicators.filter(i => i.id !== indicatorId);
    
    setStrategies(newStrategies);
  };
  
  const updateIndicatorParameter = (
    timeframeIndex: number,
    indicatorId: string,
    paramName: string,
    value: any
  ) => {
    const newStrategies = [...strategies];
    const indicatorIndex = newStrategies[timeframeIndex].indicators.findIndex(i => i.id === indicatorId);
    
    if (indicatorIndex >= 0) {
      newStrategies[timeframeIndex].indicators[indicatorIndex].parameters[paramName] = value;
      setStrategies(newStrategies);
    }
  };
  
  const updateTimeframeWeight = (timeframeIndex: number, weight: number) => {
    const newStrategies = [...strategies];
    newStrategies[timeframeIndex].weight = weight;
    
    // Calculate the total weight excluding the current timeframe
    const totalOtherWeight = newStrategies.reduce(
      (sum, s, i) => i !== timeframeIndex ? sum + s.weight : sum, 
      0
    );
    
    // Ensure total weight is 100
    const remaining = 100 - weight;
    
    // Redistribute remaining weight proportionally
    if (totalOtherWeight > 0) {
      newStrategies.forEach((s, i) => {
        if (i !== timeframeIndex) {
          const proportion = s.weight / totalOtherWeight;
          s.weight = Math.round(remaining * proportion);
        }
      });
    }
    
    // Handle rounding errors
    const newTotal = newStrategies.reduce((sum, s) => sum + s.weight, 0);
    if (newTotal !== 100 && newStrategies.length > 1) {
      // Add or subtract the difference from the first non-selected timeframe
      const adjustIndex = newStrategies.findIndex((_, i) => i !== timeframeIndex);
      if (adjustIndex >= 0) {
        newStrategies[adjustIndex].weight += (100 - newTotal);
      }
    }
    
    setStrategies(newStrategies);
  };
  
  const recalculateWeights = (count: number) => {
    if (count <= 0) return;
    
    const newStrategies = [...strategies];
    const baseWeight = Math.floor(100 / count);
    const remainder = 100 - (baseWeight * count);
    
    newStrategies.forEach((s, i) => {
      s.weight = baseWeight + (i < remainder ? 1 : 0);
    });
    
    setStrategies(newStrategies);
  };
  
  const saveStrategy = () => {
    // Validate strategy configuration
    
    // Ensure at least one indicator per timeframe
    const emptyTimeframes = strategies.filter(s => s.indicators.length === 0);
    if (emptyTimeframes.length > 0) {
      toast({
        title: "Invalid Strategy",
        description: `${emptyTimeframes.length} timeframe(s) have no indicators. Add at least one indicator to each timeframe.`,
        variant: "destructive"
      });
      return;
    }
    
    // Ensure weights sum to 100
    const totalWeight = strategies.reduce((sum, s) => sum + s.weight, 0);
    if (totalWeight !== 100) {
      toast({
        title: "Invalid Weights",
        description: `Timeframe weights must sum to 100%. Current total: ${totalWeight}%`,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Strategy Saved",
      description: "Multi-timeframe strategy has been saved successfully.",
    });
  };
  
  const getTimeframeLabel = (value: string) => {
    return timeframeOptions.find(t => t.value === value)?.label || value;
  };
  
  const getIndicatorById = (id: string) => {
    return indicatorOptions.find(i => i.id === id);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
            <CardTitle>Multi-Timeframe Strategy</CardTitle>
            <CardDescription>
              Combine indicators across different timeframes for more robust trading signals
            </CardDescription>
          </div>
          <Button onClick={saveStrategy}>Save Strategy</Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="strategy" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Strategy Design</span>
            </TabsTrigger>
            <TabsTrigger value="backtesting" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Backtesting</span>
            </TabsTrigger>
            <TabsTrigger value="simulation" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Simulation</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="strategy" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Timeframe List */}
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Timeframes</h3>
                  <Button size="sm" onClick={addTimeframe}>Add Timeframe</Button>
                </div>
                
                <div className="space-y-2">
                  {strategies.map((strategy, index) => (
                    <div 
                      key={`${strategy.timeframe}-${index}`}
                      className={`p-3 border rounded-md cursor-pointer ${
                        selectedTimeframeIndex === index ? 'bg-accent border-primary' : ''
                      }`}
                      onClick={() => setSelectedTimeframeIndex(index)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{getTimeframeLabel(strategy.timeframe)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{strategy.weight}%</Badge>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTimeframe(index);
                            }}
                          >
                            &times;
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {strategy.indicators.length} indicator{strategy.indicators.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Timeframe Configuration */}
              <div className="border rounded-md p-4 lg:col-span-2">
                {strategies.length > 0 && (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Configure: {getTimeframeLabel(strategies[selectedTimeframeIndex].timeframe)}</h3>
                    </div>
                    
                    <div className="mb-6">
                      <Label className="mb-2 block">Timeframe</Label>
                      <Select 
                        value={strategies[selectedTimeframeIndex].timeframe}
                        onValueChange={(value) => {
                          // Check if timeframe is already in use
                          const isUsed = strategies.some((s, i) => i !== selectedTimeframeIndex && s.timeframe === value);
                          
                          if (isUsed) {
                            toast({
                              title: "Timeframe Already Used",
                              description: "This timeframe is already part of your strategy.",
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          const newStrategies = [...strategies];
                          newStrategies[selectedTimeframeIndex].timeframe = value;
                          setStrategies(newStrategies);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeframeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <Label>Weight: {strategies[selectedTimeframeIndex].weight}%</Label>
                        <span className="text-xs text-muted-foreground">
                          Higher weight = more influence on trading decisions
                        </span>
                      </div>
                      <Slider 
                        value={[strategies[selectedTimeframeIndex].weight]} 
                        min={5} 
                        max={85} 
                        step={5}
                        onValueChange={([value]) => updateTimeframeWeight(selectedTimeframeIndex, value)} 
                      />
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Indicators</h4>
                        <Select 
                          value={selectedIndicator || ''} 
                          onValueChange={(value) => {
                            if (value) {
                              addIndicator(selectedTimeframeIndex, value);
                              setSelectedIndicator(null);
                            }
                          }}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Add indicator..." />
                          </SelectTrigger>
                          <SelectContent>
                            {indicatorOptions.map(indicator => (
                              <SelectItem key={indicator.id} value={indicator.id}>
                                {indicator.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {strategies[selectedTimeframeIndex].indicators.length === 0 ? (
                        <div className="text-center p-4 text-muted-foreground">
                          <Info className="h-10 w-10 mx-auto mb-2" />
                          <p>No indicators added yet.</p>
                          <p className="text-sm">Add indicators to define your strategy.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {strategies[selectedTimeframeIndex].indicators.map(indicator => {
                            const indicatorDef = getIndicatorById(indicator.id);
                            if (!indicatorDef) return null;
                            
                            return (
                              <div key={indicator.id} className="border rounded-md p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <div>
                                    <h5 className="font-medium">{indicatorDef.name}</h5>
                                    <p className="text-xs text-muted-foreground">{indicatorDef.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{indicatorDef.category}</Badge>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6 rounded-full"
                                      onClick={() => removeIndicator(selectedTimeframeIndex, indicator.id)}
                                    >
                                      &times;
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  {indicatorDef.parameters.map(param => (
                                    <div key={param.name} className="grid grid-cols-2 gap-4 items-center">
                                      <Label className="text-sm">{param.name}</Label>
                                      {param.type === "number" ? (
                                        <>
                                          <div className="flex items-center gap-2">
                                            <Slider 
                                              value={[indicator.parameters[param.name]]} 
                                              min={param.min || 0} 
                                              max={param.max || 100}
                                              step={1}
                                              onValueChange={([value]) => 
                                                updateIndicatorParameter(
                                                  selectedTimeframeIndex, 
                                                  indicator.id, 
                                                  param.name, 
                                                  value
                                                )
                                              } 
                                            />
                                            <span className="w-8 text-center">
                                              {indicator.parameters[param.name]}
                                            </span>
                                          </div>
                                        </>
                                      ) : param.type === "boolean" ? (
                                        <Switch 
                                          checked={indicator.parameters[param.name]} 
                                          onCheckedChange={(checked) => 
                                            updateIndicatorParameter(
                                              selectedTimeframeIndex, 
                                              indicator.id, 
                                              param.name, 
                                              checked
                                            )
                                          }
                                        />
                                      ) : (
                                        <Select 
                                          value={indicator.parameters[param.name]} 
                                          onValueChange={(value) => 
                                            updateIndicatorParameter(
                                              selectedTimeframeIndex, 
                                              indicator.id, 
                                              param.name, 
                                              value
                                            )
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {param.options?.map(option => (
                                              <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="backtesting" className="pt-4">
            <div className="text-center py-8">
              <BarChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Backtest Your Strategy</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                Test your multi-timeframe strategy against historical data to analyze its performance
                before deploying it to live trading.
              </p>
              <Button>Run Backtest</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="simulation" className="pt-4">
            <div className="text-center py-8">
              <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Accelerated Simulation</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                Run your strategy through an accelerated market simulation to see how it would perform
                in various market conditions.
              </p>
              <Button>Start Simulation</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="text-xs text-muted-foreground">
          <p>Strategy status: Draft</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Reset</Button>
          <Button onClick={saveStrategy}>Save Strategy</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MultiTimeframeStrategy;
