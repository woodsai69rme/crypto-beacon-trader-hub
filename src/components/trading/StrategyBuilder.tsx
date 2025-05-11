
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Brain, Save, Play } from "lucide-react";
import { createCustomStrategy, DEFAULT_STRATEGY_PARAMETERS, runBacktest } from "@/services/strategyBuilderService";
import { AITradingStrategy, BacktestResult } from "@/types/trading";
import ParameterOptimization from "@/components/widgets/ParameterOptimization";

interface StrategyBuilderProps {
  onSave?: (strategy: AITradingStrategy) => void;
  initialStrategy?: AITradingStrategy | null;
}

const strategyTypes = [
  { value: 'trend-following', label: 'Trend Following', description: 'Follows established market trends' },
  { value: 'mean-reversion', label: 'Mean Reversion', description: 'Trades towards historical mean' },
  { value: 'breakout', label: 'Breakout', description: 'Identifies and trades breakouts from consolidation' },
  { value: 'sentiment', label: 'Sentiment-based', description: 'Uses market sentiment analysis' },
  { value: 'machine-learning', label: 'Machine Learning', description: 'Leverages ML algorithms' },
  { value: 'custom', label: 'Custom', description: 'Build a completely custom strategy' },
];

const timeframes = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: '1 Day' },
];

const StrategyBuilder: React.FC<StrategyBuilderProps> = ({ onSave, initialStrategy }) => {
  const [strategy, setStrategy] = useState<AITradingStrategy>({
    id: '',
    name: '',
    description: '',
    type: 'trend-following',
    timeframe: '1h',
    parameters: { ...DEFAULT_STRATEGY_PARAMETERS },
  });
  
  const [activeTab, setActiveTab] = useState('basic');
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null);
  
  // Initialize with props if available
  useEffect(() => {
    if (initialStrategy) {
      setStrategy(initialStrategy);
    }
  }, [initialStrategy]);
  
  const handleStrategyChange = (field: string, value: any) => {
    setStrategy(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleParameterChange = (param: string, value: any) => {
    setStrategy(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [param]: value
      }
    }));
  };
  
  const handleSaveStrategy = () => {
    // If no id, create a new one
    if (!strategy.id) {
      const newStrategy = createCustomStrategy(
        strategy.name,
        strategy.description,
        strategy.type,
        strategy.timeframe,
        strategy.parameters
      );
      
      if (onSave) {
        onSave(newStrategy);
      }
    } else {
      // Just update the existing one
      if (onSave) {
        onSave(strategy);
      }
    }
  };
  
  const handleBacktest = async () => {
    setIsBacktesting(true);
    
    try {
      const result = await runBacktest(
        strategy,
        '2022-01-01',
        '2023-01-01',
        10000,
        'bitcoin'
      );
      
      setBacktestResults(result);
    } catch (error) {
      console.error('Error running backtest:', error);
    } finally {
      setIsBacktesting(false);
    }
  };
  
  const handleApplyOptimizedParameters = (parameters: Record<string, any>) => {
    setStrategy(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        ...parameters
      }
    }));
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Strategy Builder
            </CardTitle>
            <CardDescription>
              Create and customize your trading strategy
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="backtest">Backtest</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Strategy Name</Label>
                    <Input
                      id="name"
                      value={strategy.name}
                      onChange={(e) => handleStrategyChange('name', e.target.value)}
                      placeholder="Enter strategy name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={strategy.description}
                      onChange={(e) => handleStrategyChange('description', e.target.value)}
                      placeholder="Describe your strategy"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Strategy Type</Label>
                      <Select
                        value={strategy.type}
                        onValueChange={(value) => handleStrategyChange('type', value)}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select strategy type" />
                        </SelectTrigger>
                        <SelectContent>
                          {strategyTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeframe">Timeframe</Label>
                      <Select
                        value={strategy.timeframe}
                        onValueChange={(value) => handleStrategyChange('timeframe', value)}
                      >
                        <SelectTrigger id="timeframe">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeframes.map(tf => (
                            <SelectItem key={tf.value} value={tf.value}>
                              {tf.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="parameters" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-4">Indicator Parameters</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="period">Period</Label>
                        <span className="text-sm font-mono">{strategy.parameters.period}</span>
                      </div>
                      <Slider
                        id="period"
                        min={4}
                        max={50}
                        step={1}
                        value={[strategy.parameters.period]}
                        onValueChange={(values) => handleParameterChange('period', values[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>4</span>
                        <span>50</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="threshold">Threshold</Label>
                        <span className="text-sm font-mono">{strategy.parameters.threshold}</span>
                      </div>
                      <Slider
                        id="threshold"
                        min={50}
                        max={90}
                        step={1}
                        value={[strategy.parameters.threshold]}
                        onValueChange={(values) => handleParameterChange('threshold', values[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>50</span>
                        <span>90</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="useVolume"
                        checked={strategy.parameters.useVolume}
                        onCheckedChange={(checked) => handleParameterChange('useVolume', checked)}
                      />
                      <Label htmlFor="useVolume">Include volume data in analysis</Label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="indicator">Main Indicator</Label>
                        <Select
                          value={strategy.parameters.indicator}
                          onValueChange={(value) => handleParameterChange('indicator', value)}
                        >
                          <SelectTrigger id="indicator">
                            <SelectValue placeholder="Select indicator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rsi">RSI</SelectItem>
                            <SelectItem value="macd">MACD</SelectItem>
                            <SelectItem value="bb">Bollinger Bands</SelectItem>
                            <SelectItem value="ma">Moving Average</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-4">Risk Parameters</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                        <span className="text-sm font-mono">{strategy.parameters.stopLoss}%</span>
                      </div>
                      <Slider
                        id="stopLoss"
                        min={1}
                        max={15}
                        step={0.5}
                        value={[strategy.parameters.stopLoss]}
                        onValueChange={(values) => handleParameterChange('stopLoss', values[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1%</span>
                        <span>15%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="takeProfit">Take Profit (%)</Label>
                        <span className="text-sm font-mono">{strategy.parameters.takeProfit}%</span>
                      </div>
                      <Slider
                        id="takeProfit"
                        min={2}
                        max={30}
                        step={1}
                        value={[strategy.parameters.takeProfit]}
                        onValueChange={(values) => handleParameterChange('takeProfit', values[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>2%</span>
                        <span>30%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allowWeekendTrading"
                        checked={strategy.parameters.allowWeekendTrading}
                        onCheckedChange={(checked) => handleParameterChange('allowWeekendTrading', checked)}
                      />
                      <Label htmlFor="allowWeekendTrading">Allow weekend trading</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="backtest">
                {backtestResults ? (
                  <div className="space-y-6">
                    <div className="border rounded-md p-4">
                      <h3 className="text-sm font-medium mb-4">Backtest Results</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 border rounded-md">
                          <div className="text-xs text-muted-foreground">Total Return</div>
                          <div className={`text-lg font-semibold ${backtestResults.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {backtestResults.returns >= 0 ? '+' : ''}{backtestResults.returns.toFixed(2)}%
                          </div>
                        </div>
                        
                        <div className="p-3 border rounded-md">
                          <div className="text-xs text-muted-foreground">Win Rate</div>
                          <div className="text-lg font-semibold">
                            {backtestResults.winRate.toFixed(1)}%
                          </div>
                        </div>
                        
                        <div className="p-3 border rounded-md">
                          <div className="text-xs text-muted-foreground">Total Trades</div>
                          <div className="text-lg font-semibold">
                            {backtestResults.trades}
                          </div>
                        </div>
                        
                        <div className="p-3 border rounded-md">
                          <div className="text-xs text-muted-foreground">Max Drawdown</div>
                          <div className="text-lg font-semibold text-red-600">
                            -{backtestResults.maxDrawdown.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Button variant="outline" onClick={() => setBacktestResults(null)}>
                          Run New Backtest
                        </Button>
                      </div>
                    </div>
                    
                    {backtestResults.tradeHistory && (
                      <div className="border rounded-md p-4">
                        <h3 className="text-sm font-medium mb-4">Trade History</h3>
                        <div className="max-h-64 overflow-y-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Date</th>
                                <th className="text-left py-2">Type</th>
                                <th className="text-left py-2">Price</th>
                                <th className="text-left py-2">Amount</th>
                                <th className="text-right py-2">P/L</th>
                              </tr>
                            </thead>
                            <tbody>
                              {backtestResults.tradeHistory.slice(0, 10).map((trade) => (
                                <tr key={trade.id} className="border-b">
                                  <td className="py-2">{new Date(trade.timestamp).toLocaleDateString()}</td>
                                  <td className="py-2 capitalize">{trade.type}</td>
                                  <td className="py-2">${trade.price.toFixed(2)}</td>
                                  <td className="py-2">{trade.amount.toFixed(4)}</td>
                                  <td className={`py-2 text-right ${trade.profitLoss && trade.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {trade.profitLoss && trade.profitLoss >= 0 ? '+' : ''}
                                    ${trade.profitLoss?.toFixed(2) || '0.00'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-6">
                      Run a backtest to see how your strategy would have performed on historical data
                    </p>
                    <Button onClick={handleBacktest} disabled={isBacktesting}>
                      <Play className="h-4 w-4 mr-2" />
                      {isBacktesting ? 'Running Backtest...' : 'Run Backtest'}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="flex items-center space-x-2">
              {strategy.type && (
                <Badge variant="outline">{strategy.type}</Badge>
              )}
              {strategy.timeframe && (
                <Badge variant="outline">{strategy.timeframe}</Badge>
              )}
            </div>
            <Button onClick={handleSaveStrategy} disabled={!strategy.name}>
              <Save className="h-4 w-4 mr-2" />
              Save Strategy
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="lg:col-span-4">
        <ParameterOptimization
          strategy={strategy.id ? strategy : null}
          onApplyOptimizedParameters={handleApplyOptimizedParameters}
        />
      </div>
    </div>
  );
};

export default StrategyBuilder;
