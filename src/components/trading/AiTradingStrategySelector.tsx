
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StrategyParameter, AITradingStrategy } from "@/types/trading";
import { predefinedStrategies } from "@/utils/aiTradingStrategies";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Brain, BarChart4, Settings, LineChart } from "lucide-react";

interface AiTradingStrategySelectorProps {
  botId: string;
  onSelectStrategy: (strategy: AITradingStrategy) => void;
}

const AiTradingStrategySelector: React.FC<AiTradingStrategySelectorProps> = ({ botId, onSelectStrategy }) => {
  const [strategies, setStrategies] = useState<AITradingStrategy[]>(predefinedStrategies);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
  const [parameters, setParameters] = useState<Record<string, StrategyParameter[]>>({
    'momentum-1': [
      { id: 'rsi-period', name: 'RSI Period', description: 'Period for RSI calculation', type: 'number', value: 14, min: 5, max: 30, step: 1 },
      { id: 'rsi-overbought', name: 'RSI Overbought', description: 'Threshold for overbought condition', type: 'number', value: 70, min: 60, max: 90, step: 1 },
      { id: 'rsi-oversold', name: 'RSI Oversold', description: 'Threshold for oversold condition', type: 'number', value: 30, min: 10, max: 40, step: 1 },
      { id: 'use-macd', name: 'Use MACD', description: 'Include MACD in the strategy', type: 'boolean', value: true },
    ],
    'trend-following-1': [
      { id: 'short-ma', name: 'Short MA Period', description: 'Short moving average period', type: 'number', value: 20, min: 5, max: 50, step: 1 },
      { id: 'long-ma', name: 'Long MA Period', description: 'Long moving average period', type: 'number', value: 50, min: 20, max: 200, step: 5 },
      { id: 'trend-strength', name: 'Trend Strength', description: 'Minimum difference between MAs', type: 'number', value: 0.02, min: 0.01, max: 0.1, step: 0.01 },
      { id: 'use-volume', name: 'Volume Confirmation', description: 'Use volume for confirmation', type: 'boolean', value: true },
    ],
    'mean-reversion-1': [
      { id: 'lookback', name: 'Lookback Period', description: 'Period for standard deviation calculation', type: 'number', value: 20, min: 5, max: 50, step: 1 },
      { id: 'std-dev', name: 'Standard Deviations', description: 'Number of standard deviations', type: 'number', value: 2, min: 1, max: 4, step: 0.1 },
      { id: 'ma-period', name: 'MA Period', description: 'Moving average period', type: 'number', value: 50, min: 20, max: 200, step: 5 },
      { id: 'use-rsi', name: 'Use RSI Filter', description: 'Include RSI filter', type: 'boolean', value: true },
    ],
  });
  
  useEffect(() => {
    if (botId && strategies.length > 0 && !selectedStrategyId) {
      // Auto-select first strategy when bot is selected
      setSelectedStrategyId(strategies[0].id);
    }
  }, [botId, strategies, selectedStrategyId]);
  
  const selectedStrategy = strategies.find(s => s.id === selectedStrategyId);
  const selectedParams = selectedStrategyId ? parameters[selectedStrategyId] : [];
  
  const updateParameter = (paramId: string, value: any) => {
    if (!selectedStrategyId) return;
    
    setParameters({
      ...parameters,
      [selectedStrategyId]: parameters[selectedStrategyId].map(param => 
        param.id === paramId ? { ...param, value } : param
      )
    });
  };
  
  const handleApplyStrategy = () => {
    if (!selectedStrategy) return;
    
    // Update strategy with current parameters
    const updatedStrategy = {
      ...selectedStrategy,
      parameters: {
        ...selectedStrategy.parameters,
        customParameters: selectedParams.reduce((acc, param) => {
          acc[param.id] = param.value;
          return acc;
        }, {} as Record<string, any>)
      }
    };
    
    onSelectStrategy(updatedStrategy);
  };
  
  if (!botId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Please select an AI bot to configure strategies
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              AI Strategies
            </CardTitle>
            <CardDescription>
              Select a strategy for your trading bot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {strategies.map((strategy) => (
                <Button
                  key={strategy.id}
                  variant={selectedStrategyId === strategy.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedStrategyId(strategy.id)}
                >
                  <div className="text-left">
                    <div>{strategy.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {strategy.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        {selectedStrategy ? (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{selectedStrategy.name}</CardTitle>
                  <CardDescription>{selectedStrategy.description}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10">
                  {selectedStrategy.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="parameters">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="parameters">
                    <Settings className="h-4 w-4 mr-2" />
                    Parameters
                  </TabsTrigger>
                  <TabsTrigger value="performance">
                    <BarChart4 className="h-4 w-4 mr-2" />
                    Performance
                  </TabsTrigger>
                  <TabsTrigger value="analysis">
                    <LineChart className="h-4 w-4 mr-2" />
                    Analysis
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="parameters" className="space-y-6">
                  {selectedParams.map((param) => (
                    <div key={param.id} className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{param.name}</div>
                          <div className="text-xs text-muted-foreground">{param.description}</div>
                        </div>
                        
                        {param.type === 'boolean' ? (
                          <Switch
                            checked={param.value}
                            onCheckedChange={(checked) => updateParameter(param.id, checked)}
                          />
                        ) : (
                          <div className="text-right font-mono">
                            {param.value}
                          </div>
                        )}
                      </div>
                      
                      {param.type === 'number' && (
                        <div className="pt-2">
                          <Slider
                            value={[param.value]}
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            onValueChange={(values) => updateParameter(param.id, values[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <div>{param.min}</div>
                            <div>{param.max}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <div className="text-sm font-medium mb-2">Timeframe</div>
                    <Select defaultValue={selectedStrategy.timeframe}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5m">5 Minutes</SelectItem>
                        <SelectItem value="15m">15 Minutes</SelectItem>
                        <SelectItem value="1h">1 Hour</SelectItem>
                        <SelectItem value="4h">4 Hours</SelectItem>
                        <SelectItem value="1d">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleApplyStrategy}>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Apply Strategy
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="performance">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                        <div className="text-2xl font-bold">68%</div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-muted-foreground">Profit Factor</div>
                        <div className="text-2xl font-bold">1.85</div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                        <div className="text-2xl font-bold">1.42</div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-muted-foreground">Max Drawdown</div>
                        <div className="text-2xl font-bold">15%</div>
                      </div>
                    </div>
                    
                    <div className="h-[200px] bg-muted/20 rounded-md relative">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                        Performance chart
                      </div>
                      {/* Mock equity curve */}
                      <svg className="absolute inset-0 w-full h-full">
                        <path
                          d="M0,180 C50,170 100,160 150,140 C200,130 250,120 300,100 C350,85 400,95 450,65 C500,45 550,30 600,20"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">Best Month</div>
                        <div className="flex justify-between text-sm">
                          <span>March 2023</span>
                          <span className="text-green-500">+12.4%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Worst Month</div>
                        <div className="flex justify-between text-sm">
                          <span>January 2023</span>
                          <span className="text-red-500">-4.2%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="analysis">
                  <div className="space-y-4">
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="text-sm font-medium">Strategy Overview</div>
                      <p className="text-sm text-muted-foreground">
                        {selectedStrategy.type === 'momentum' && (
                          "This momentum strategy uses RSI to identify overbought and oversold conditions, combined with MACD for trend confirmation. It performs well in trending markets but may generate false signals during ranging periods."
                        )}
                        {selectedStrategy.type === 'trend-following' && (
                          "This trend following strategy uses moving average crossovers to identify and follow market trends. It's effective in trending markets but can underperform in choppy or sideways markets."
                        )}
                        {selectedStrategy.type === 'mean-reversion' && (
                          "This mean reversion strategy identifies assets that have deviated significantly from their historical average and trades on the expectation they will revert back. It works well in ranging markets but can suffer during strong trends."
                        )}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-md p-3">
                        <div className="text-sm font-medium">Optimal Market</div>
                        <div className="flex items-center text-sm pt-1">
                          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                          {selectedStrategy.type === 'momentum' && "Trending with volatility"}
                          {selectedStrategy.type === 'trend-following' && "Strong directional trends"}
                          {selectedStrategy.type === 'mean-reversion' && "Ranging markets"}
                        </div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-sm font-medium">Risk Level</div>
                        <div className="flex items-center text-sm pt-1">
                          <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                          Medium
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="text-sm font-medium">Strategy Limitations</div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>
                            {selectedStrategy.type === 'momentum' && "Can produce false signals in ranging markets"}
                            {selectedStrategy.type === 'trend-following' && "Lags behind at trend reversals"}
                            {selectedStrategy.type === 'mean-reversion' && "Vulnerable to prolonged trends"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Requires regular parameter optimization</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Performance varies across different assets</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              Select a strategy from the list
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTradingStrategySelector;
