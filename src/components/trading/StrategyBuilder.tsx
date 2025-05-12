
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
import { AITradingStrategy, BacktestResult } from "@/types/trading";
import { createCustomStrategy, DEFAULT_STRATEGY_PARAMETERS, runBacktest } from "@/services/strategyBuilderService";
import ParameterOptimization from '@/components/widgets/ParameterOptimization';

interface BasicStrategyFormProps {
  strategy: AITradingStrategy;
  onStrategyChange: (field: string, value: any) => void;
}

const BasicStrategyForm: React.FC<BasicStrategyFormProps> = ({ strategy, onStrategyChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="strategy-name">Strategy Name</Label>
        <Input
          id="strategy-name"
          value={strategy.name}
          onChange={(e) => onStrategyChange('name', e.target.value)}
          placeholder="Enter strategy name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="strategy-description">Description</Label>
        <Textarea
          id="strategy-description"
          value={strategy.description}
          onChange={(e) => onStrategyChange('description', e.target.value)}
          placeholder="Describe your trading strategy"
          className="h-24 resize-none"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="strategy-type">Strategy Type</Label>
          <Select
            value={strategy.type}
            onValueChange={(value) => onStrategyChange('type', value)}
          >
            <SelectTrigger id="strategy-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trend-following">Trend Following</SelectItem>
              <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
              <SelectItem value="breakout">Breakout</SelectItem>
              <SelectItem value="sentiment">Sentiment</SelectItem>
              <SelectItem value="machine-learning">Machine Learning</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
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
              <SelectItem value="1m">1 Minute</SelectItem>
              <SelectItem value="5m">5 Minutes</SelectItem>
              <SelectItem value="15m">15 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="4h">4 Hours</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="1w">1 Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="risk-level">Risk Level</Label>
          <Select
            value={strategy.riskLevel || 'medium'}
            onValueChange={(value) => onStrategyChange('riskLevel', value)}
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
        
        <div className="space-y-2">
          <Label>Assets</Label>
          <div className="flex flex-wrap gap-1 pt-2">
            {strategy.assets && strategy.assets.map((asset) => (
              <Badge key={asset} variant="secondary" className="text-xs">
                {asset.toUpperCase()}
              </Badge>
            ))}
            {(!strategy.assets || strategy.assets.length === 0) && (
              <span className="text-muted-foreground text-sm">No assets selected</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="weekend-trading" className="cursor-pointer">Allow Weekend Trading</Label>
          <Switch
            id="weekend-trading"
            checked={strategy.parameters.allowWeekendTrading || false}
            onCheckedChange={(checked) => onStrategyChange('parameters', { 
              ...strategy.parameters,
              allowWeekendTrading: checked
            })}
          />
        </div>
      </div>
    </div>
  );
};

interface StrategyParametersProps {
  strategy: AITradingStrategy;
  onParameterChange: (param: string, value: any) => void;
}

const StrategyParameters: React.FC<StrategyParametersProps> = ({ strategy, onParameterChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="period">Period: {strategy.parameters.period}</Label>
          <Slider
            id="period"
            value={[strategy.parameters.period || 14]}
            onValueChange={([value]) => onParameterChange('period', value)}
            max={30}
            min={5}
            step={1}
          />
          <div className="text-xs text-muted-foreground">
            Number of candles or periods to consider
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="threshold">Threshold: {strategy.parameters.threshold}</Label>
          <Slider
            id="threshold"
            value={[strategy.parameters.threshold || 70]}
            onValueChange={([value]) => onParameterChange('threshold', value)}
            max={90}
            min={50}
            step={1}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stop-loss">Stop Loss: {strategy.parameters.stopLoss}%</Label>
          <Slider
            id="stop-loss"
            value={[strategy.parameters.stopLoss || 5]}
            onValueChange={([value]) => onParameterChange('stopLoss', value)}
            max={10}
            min={1}
            step={0.5}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="take-profit">Take Profit: {strategy.parameters.takeProfit}%</Label>
          <Slider
            id="take-profit"
            value={[strategy.parameters.takeProfit || 10]}
            onValueChange={([value]) => onParameterChange('takeProfit', value)}
            max={20}
            min={5}
            step={0.5}
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <Label>Indicator</Label>
        <Select 
          value={strategy.parameters.indicator || "RSI"}
          onValueChange={(value) => onParameterChange('indicator', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RSI">RSI</SelectItem>
            <SelectItem value="MACD">MACD</SelectItem>
            <SelectItem value="Bollinger">Bollinger Bands</SelectItem>
            <SelectItem value="SMA">Simple Moving Average</SelectItem>
            <SelectItem value="EMA">Exponential Moving Average</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {strategy.parameters.indicator === 'MACD' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="fast-period">Fast: {strategy.parameters.fastPeriod}</Label>
              <Slider
                id="fast-period"
                value={[strategy.parameters.fastPeriod || 12]}
                onValueChange={([value]) => onParameterChange('fastPeriod', value)}
                max={20}
                min={5}
                step={1}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slow-period">Slow: {strategy.parameters.slowPeriod}</Label>
              <Slider
                id="slow-period"
                value={[strategy.parameters.slowPeriod || 26]}
                onValueChange={([value]) => onParameterChange('slowPeriod', value)}
                max={40}
                min={15}
                step={1}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signal-period">Signal: {strategy.parameters.signalPeriod}</Label>
              <Slider
                id="signal-period"
                value={[strategy.parameters.signalPeriod || 9]}
                onValueChange={([value]) => onParameterChange('signalPeriod', value)}
                max={15}
                min={5}
                step={1}
              />
            </div>
          </div>
        </div>
      )}
      
      {strategy.parameters.indicator === 'RSI' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="upper-band">Overbought: {strategy.parameters.upperBand}</Label>
              <Slider
                id="upper-band"
                value={[strategy.parameters.upperBand || 70]}
                onValueChange={([value]) => onParameterChange('upperBand', value)}
                max={90}
                min={60}
                step={1}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lower-band">Oversold: {strategy.parameters.lowerBand}</Label>
              <Slider
                id="lower-band"
                value={[strategy.parameters.lowerBand || 30]}
                onValueChange={([value]) => onParameterChange('lowerBand', value)}
                max={40}
                min={10}
                step={1}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="use-volume" className="cursor-pointer">Use Volume Confirmation</Label>
          <Switch
            id="use-volume"
            checked={strategy.parameters.useVolume || false}
            onCheckedChange={(checked) => onParameterChange('useVolume', checked)}
          />
        </div>
      </div>
    </div>
  );
};

interface StrategyBacktestProps {
  isBacktesting: boolean;
  backtestResults: BacktestResult | null;
  onBacktest: () => void;
  onResetBacktest: () => void;
}

const StrategyBacktest: React.FC<StrategyBacktestProps> = ({ 
  isBacktesting,
  backtestResults,
  onBacktest,
  onResetBacktest
}) => {
  return (
    <div className="space-y-6">
      {backtestResults ? (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Backtest Results</h3>
            <Button variant="outline" size="sm" onClick={onResetBacktest}>
              New Backtest
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Total Return</div>
              <div className="text-xl font-bold text-green-500">
                {backtestResults.returns.toFixed(2)}%
              </div>
            </div>
            
            <div className="border rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Win Rate</div>
              <div className="text-xl font-bold">
                {backtestResults.winRate.toFixed(1)}%
              </div>
            </div>
            
            <div className="border rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Trades</div>
              <div className="text-xl font-bold">
                {backtestResults.trades}
              </div>
            </div>
            
            <div className="border rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Drawdown</div>
              <div className="text-xl font-bold text-amber-500">
                {backtestResults.maxDrawdown.toFixed(2)}%
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
              <div className="text-lg font-bold">
                {backtestResults.sharpeRatio.toFixed(2)}
              </div>
            </div>
            
            <div className="border rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Profit Factor</div>
              <div className="text-lg font-bold">
                {backtestResults.profitFactor.toFixed(2)}
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-3 font-medium">Trade History</div>
            <div className="max-h-64 overflow-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-xs font-medium text-left p-2">Date</th>
                    <th className="text-xs font-medium text-left p-2">Type</th>
                    <th className="text-xs font-medium text-right p-2">Price</th>
                    <th className="text-xs font-medium text-right p-2">P/L</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {backtestResults.tradeHistory && backtestResults.tradeHistory.slice(0, 10).map((trade) => (
                    <tr key={trade.id}>
                      <td className="text-xs p-2">{trade.date}</td>
                      <td className="text-xs p-2">
                        <span className={`${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-xs text-right p-2">${trade.price.toFixed(2)}</td>
                      <td className={`text-xs font-mono text-right p-2 
                        ${trade.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Initial Capital</Label>
              <Input type="number" defaultValue="10000" />
            </div>
            <div className="space-y-2">
              <Label>Asset</Label>
              <Select defaultValue="bitcoin">
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
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" defaultValue="2022-01-01" />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" defaultValue="2023-01-01" />
            </div>
          </div>
          
          <Button
            className="w-full"
            onClick={onBacktest}
            disabled={isBacktesting}
          >
            {isBacktesting ? 'Running Backtest...' : 'Run Backtest'}
          </Button>
          
          <div className="text-xs text-muted-foreground text-center">
            Backtest your strategy against historical market data to assess its performance.
          </div>
        </div>
      )}
    </div>
  );
};

export interface StrategyBuilderProps {
  initialStrategy?: AITradingStrategy | null;
  onSaveStrategy?: (strategy: AITradingStrategy) => void;
}

const StrategyBuilder: React.FC<StrategyBuilderProps> = ({ initialStrategy, onSaveStrategy }) => {
  const [strategy, setStrategy] = useState<AITradingStrategy>(initialStrategy || {
    id: '',
    name: '',
    description: '',
    type: 'trend-following',
    timeframe: '1h',
    parameters: { ...DEFAULT_STRATEGY_PARAMETERS },
    assets: []
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
      
      if (onSaveStrategy) {
        onSaveStrategy(newStrategy);
      }
    } else {
      // Just update the existing one
      if (onSaveStrategy) {
        onSaveStrategy(strategy);
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
  
  const handleApplyParameters = (parameters: Record<string, any>) => {
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
          strategy={strategy}
          onApplyParameters={handleApplyParameters}
        />
      </div>
    </div>
  );
};

export default StrategyBuilder;
