
import React, { useState } from 'react';
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
import { AITradingStrategy, BacktestResult } from '@/types/trading';
import ParameterOptimization from "@/components/widgets/ParameterOptimization";

// Placeholder components for simplicity
const BasicStrategyForm = ({ strategy, onStrategyChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Strategy Name</Label>
        <Input 
          id="name" 
          value={strategy.name || ''} 
          onChange={(e) => onStrategyChange('name', e.target.value)} 
          placeholder="Enter strategy name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={strategy.description || ''} 
          onChange={(e) => onStrategyChange('description', e.target.value)}
          placeholder="Describe your strategy"
          className="min-h-[80px]"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Strategy Type</Label>
          <Select 
            value={strategy.type} 
            onValueChange={(value) => onStrategyChange('type', value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select strategy type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trend-following">Trend Following</SelectItem>
              <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
              <SelectItem value="breakout">Breakout</SelectItem>
              <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
              <SelectItem value="multi-timeframe">Multi-Timeframe</SelectItem>
              <SelectItem value="machine-learning">Machine Learning</SelectItem>
              <SelectItem value="custom">Custom Strategy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timeframe">Timeframe</Label>
          <Select 
            value={strategy.timeframe} 
            onValueChange={(value) => onStrategyChange('timeframe', value)}
          >
            <SelectTrigger id="timeframe">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 minute</SelectItem>
              <SelectItem value="5m">5 minutes</SelectItem>
              <SelectItem value="15m">15 minutes</SelectItem>
              <SelectItem value="30m">30 minutes</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="4h">4 hours</SelectItem>
              <SelectItem value="1d">1 day</SelectItem>
              <SelectItem value="1w">1 week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="riskLevel">Risk Level</Label>
        <Select 
          value={strategy.riskLevel || 'medium'} 
          onValueChange={(value) => onStrategyChange('riskLevel', value)}
        >
          <SelectTrigger id="riskLevel">
            <SelectValue placeholder="Select risk level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

const StrategyParameters = ({ strategy, onParameterChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Technical Indicators</h3>
        
        <div className="space-y-2">
          <Label htmlFor="period">Period Length</Label>
          <div className="flex items-center gap-2">
            <Slider
              id="period"
              min={5}
              max={50}
              step={1}
              value={[strategy.parameters?.period || 14]}
              onValueChange={(values) => onParameterChange('period', values[0])}
            />
            <span className="w-12 text-right">{strategy.parameters?.period || 14}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="threshold">Signal Threshold</Label>
          <div className="flex items-center gap-2">
            <Slider
              id="threshold"
              min={50}
              max={90}
              step={1}
              value={[strategy.parameters?.threshold || 70]}
              onValueChange={(values) => onParameterChange('threshold', values[0])}
            />
            <span className="w-12 text-right">{strategy.parameters?.threshold || 70}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fastPeriod">Fast Period</Label>
            <Input
              id="fastPeriod"
              type="number"
              min="2"
              max="50"
              value={strategy.parameters?.fastPeriod || 12}
              onChange={(e) => onParameterChange('fastPeriod', parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slowPeriod">Slow Period</Label>
            <Input
              id="slowPeriod"
              type="number"
              min="5"
              max="100"
              value={strategy.parameters?.slowPeriod || 26}
              onChange={(e) => onParameterChange('slowPeriod', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Risk Management</h3>
        
        <div className="space-y-2">
          <Label htmlFor="stopLoss">Stop Loss (%)</Label>
          <Input
            id="stopLoss"
            type="number"
            min="1"
            max="20"
            step="0.5"
            value={strategy.parameters?.stopLoss || 5}
            onChange={(e) => onParameterChange('stopLoss', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="takeProfit">Take Profit (%)</Label>
          <Input
            id="takeProfit"
            type="number"
            min="2"
            max="50"
            step="0.5"
            value={strategy.parameters?.takeProfit || 15}
            onChange={(e) => onParameterChange('takeProfit', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="useVolume" className="cursor-pointer">Use Volume Confirmation</Label>
          <Switch
            id="useVolume"
            checked={strategy.parameters?.useVolume || false}
            onCheckedChange={(checked) => onParameterChange('useVolume', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="allowWeekendTrading" className="cursor-pointer">Allow Weekend Trading</Label>
          <Switch
            id="allowWeekendTrading"
            checked={strategy.parameters?.allowWeekendTrading || false}
            onCheckedChange={(checked) => onParameterChange('allowWeekendTrading', checked)}
          />
        </div>
      </div>
    </div>
  </div>
);

const StrategyBacktest = ({ isBacktesting, backtestResults, onBacktest, onResetBacktest }) => (
  <div className="space-y-6">
    {!backtestResults ? (
      <div className="border rounded-md p-6 text-center">
        <Play className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium mb-2">Run Backtest</h3>
        <p className="text-muted-foreground mb-4">
          Simulate your strategy against historical market data to evaluate performance.
        </p>
        <Button onClick={onBacktest} disabled={isBacktesting}>
          {isBacktesting ? 'Running Backtest...' : 'Start Backtest'}
        </Button>
      </div>
    ) : (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Backtest Results</h3>
          <Button variant="outline" size="sm" onClick={onResetBacktest}>
            Reset
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 border rounded-md">
            <div className="text-xs text-muted-foreground">Profit</div>
            <div className="font-medium text-green-600">+{backtestResults.profitPercentage.toFixed(2)}%</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-xs text-muted-foreground">Win Rate</div>
            <div className="font-medium">{(backtestResults.winRate * 100).toFixed(0)}%</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
            <div className="font-medium">{backtestResults.sharpeRatio.toFixed(2)}</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-xs text-muted-foreground">Max Drawdown</div>
            <div className="font-medium text-red-600">-{backtestResults.maxDrawdown.toFixed(2)}%</div>
          </div>
        </div>
        
        <div className="border rounded-md p-4">
          <h4 className="text-sm font-medium mb-2">Trade Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-sm">
              <div className="text-muted-foreground">Total Trades</div>
              <div className="font-medium">{backtestResults.totalTrades}</div>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">Winning Trades</div>
              <div className="font-medium text-green-600">{backtestResults.winningTrades}</div>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">Losing Trades</div>
              <div className="font-medium text-red-600">{backtestResults.losingTrades}</div>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">Profit Factor</div>
              <div className="font-medium">{backtestResults.profitFactor.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

interface StrategyBuilderProps {
  onSave?: (strategy: AITradingStrategy) => void;
  initialStrategy?: AITradingStrategy | null;
}

const StrategyBuilder: React.FC<StrategyBuilderProps> = ({ onSave, initialStrategy }) => {
  const [strategy, setStrategy] = useState<AITradingStrategy>(initialStrategy || {
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
              
              <TabsContent value="basic">
                <BasicStrategyForm 
                  strategy={strategy}
                  onStrategyChange={handleStrategyChange}
                />
              </TabsContent>
              
              <TabsContent value="parameters">
                <StrategyParameters
                  strategy={strategy}
                  onParameterChange={handleParameterChange}
                />
              </TabsContent>
              
              <TabsContent value="backtest">
                <StrategyBacktest
                  isBacktesting={isBacktesting}
                  backtestResults={backtestResults}
                  onBacktest={handleBacktest}
                  onResetBacktest={() => setBacktestResults(null)}
                />
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
