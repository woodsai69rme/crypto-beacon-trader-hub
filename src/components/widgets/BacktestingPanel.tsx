
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { predefinedStrategies, runBacktest } from '@/utils/aiTradingStrategies';
import { BarChart3, Calendar, Coins, Info, LineChart, AreaChart } from 'lucide-react';
import { AITradingStrategy, BacktestResult } from '@/types/trading';
import { format, subDays, subMonths } from 'date-fns';

interface BacktestingPanelProps {
  selectedStrategyId: string | null;
}

const BacktestingPanel: React.FC<BacktestingPanelProps> = ({ selectedStrategyId }) => {
  const [availableCoins] = useState([
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP' },
    { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
    { id: 'cosmos', name: 'Cosmos', symbol: 'ATOM' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  ]);
  
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [timeframe, setTimeframe] = useState<string>('30d');
  const [initialCapital, setInitialCapital] = useState<number>(10000);
  const [strategy, setStrategy] = useState<AITradingStrategy | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [parameterValues, setParameterValues] = useState<Record<string, any>>({});
  
  // Find the selected strategy from the predefined list
  useEffect(() => {
    if (selectedStrategyId) {
      const found = predefinedStrategies.find(s => s.id === selectedStrategyId);
      if (found) {
        setStrategy(found);
        
        // Initialize parameter values
        const initialParams: Record<string, any> = {};
        found.parameters.forEach(param => {
          initialParams[param.name] = param.value;
        });
        setParameterValues(initialParams);
      }
    }
  }, [selectedStrategyId]);
  
  const handleRunBacktest = async () => {
    if (!strategy) return;
    
    setIsRunning(true);
    setBacktestResult(null);
    
    try {
      // Determine date range
      let startDate: Date;
      const endDate = new Date();
      
      switch (timeframe) {
        case '7d':
          startDate = subDays(endDate, 7);
          break;
        case '30d':
          startDate = subDays(endDate, 30);
          break;
        case '90d':
          startDate = subDays(endDate, 90);
          break;
        case '6m':
          startDate = subMonths(endDate, 6);
          break;
        case '1y':
          startDate = subMonths(endDate, 12);
          break;
        default:
          startDate = subDays(endDate, 30);
      }
      
      // Run backtest
      const result = await runBacktest(
        strategy.id,
        selectedCoin,
        startDate,
        endDate,
        initialCapital,
        parameterValues
      );
      
      setBacktestResult(result);
      
      toast({
        title: "Backtest complete",
        description: `${strategy.name} showed ${result.totalReturn.toFixed(2)}% return over ${timeframe}`,
      });
    } catch (error) {
      console.error("Backtest error:", error);
      toast({
        variant: "destructive",
        title: "Backtest failed",
        description: "There was an error running the backtest",
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleParameterChange = (paramName: string, value: any) => {
    setParameterValues({
      ...parameterValues,
      [paramName]: value,
    });
  };
  
  // Show a message if no strategy is selected
  if (!strategy) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-md border-dashed p-6">
        <Info size={32} className="text-muted-foreground mb-2" />
        <h3 className="text-xl font-medium">No Strategy Selected</h3>
        <p className="text-muted-foreground text-center mt-2">
          Please select a strategy from the Strategies tab to start backtesting.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coin">Coin</Label>
                <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                  <SelectTrigger id="coin">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCoins.map((coin) => (
                      <SelectItem key={coin.id} value={coin.id}>
                        {coin.name} ({coin.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger id="timeframe">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="6m">6 Months</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capital">Initial Capital (USD)</Label>
                <Input
                  id="capital"
                  type="number"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Number(e.target.value))}
                  min={100}
                  step={100}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Strategy Parameters */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="font-medium text-lg">Strategy Parameters</h3>
          <div className="space-y-6">
            {strategy.parameters.map((param) => (
              <div key={param.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor={param.name}>{param.label}</Label>
                  <span className="text-sm font-medium">
                    {parameterValues[param.name]}
                  </span>
                </div>
                
                {param.type === 'number' && param.min !== undefined && param.max !== undefined && (
                  <Slider
                    id={param.name}
                    min={param.min}
                    max={param.max}
                    step={param.step || 1}
                    value={[parameterValues[param.name]]}
                    onValueChange={(value) => handleParameterChange(param.name, value[0])}
                  />
                )}
                
                {param.type === 'select' && param.options && (
                  <Select
                    value={String(parameterValues[param.name])}
                    onValueChange={(value) => handleParameterChange(param.name, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {param.options.map((option) => (
                        <SelectItem key={String(option.value)} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {param.description && (
                  <p className="text-xs text-muted-foreground">{param.description}</p>
                )}
              </div>
            ))}
          </div>
          
          <Button 
            className="w-full mt-4" 
            onClick={handleRunBacktest}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run Backtest"}
          </Button>
        </div>
        
        {/* Backtest Results */}
        <div className="md:col-span-3 border rounded-lg p-4">
          {isRunning ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
              <p className="mt-4 text-sm text-center text-muted-foreground">
                Running backtest for {strategy.name} on {availableCoins.find(c => c.id === selectedCoin)?.name}.<br />
                This may take a moment...
              </p>
            </div>
          ) : backtestResult ? (
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="overview" className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="equity" className="flex items-center">
                    <LineChart className="w-4 h-4 mr-1" />
                    <span>Equity Curve</span>
                  </TabsTrigger>
                  <TabsTrigger value="trades" className="flex items-center">
                    <AreaChart className="w-4 h-4 mr-1" />
                    <span>Trades</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4 pt-4">
                  {/* Overview Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-background rounded-lg p-3 border">
                      <div className="text-muted-foreground text-sm">Total Return</div>
                      <div className={`text-xl font-semibold ${backtestResult.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {backtestResult.totalReturn.toFixed(2)}%
                      </div>
                    </div>
                    
                    <div className="bg-background rounded-lg p-3 border">
                      <div className="text-muted-foreground text-sm">Win Rate</div>
                      <div className="text-xl font-semibold">
                        {backtestResult.winRate.toFixed(2)}%
                      </div>
                    </div>
                    
                    <div className="bg-background rounded-lg p-3 border">
                      <div className="text-muted-foreground text-sm">Profit Factor</div>
                      <div className="text-xl font-semibold">
                        {backtestResult.profitFactor.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="bg-background rounded-lg p-3 border">
                      <div className="text-muted-foreground text-sm">Max Drawdown</div>
                      <div className="text-xl font-semibold text-amber-500">
                        {backtestResult.maxDrawdown.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background rounded-lg p-3 border">
                      <h4 className="text-sm font-medium mb-2">Trade Statistics</h4>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-muted-foreground">Total Trades</span>
                        <span>{backtestResult.totalTrades}</span>
                        
                        <span className="text-muted-foreground">Winning Trades</span>
                        <span>{backtestResult.winningTrades}</span>
                        
                        <span className="text-muted-foreground">Losing Trades</span>
                        <span>{backtestResult.losingTrades}</span>
                        
                        <span className="text-muted-foreground">Avg Profit</span>
                        <span>${backtestResult.averageProfit.toFixed(2)}</span>
                        
                        <span className="text-muted-foreground">Avg Loss</span>
                        <span>${backtestResult.averageLoss.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-background rounded-lg p-3 border">
                      <h4 className="text-sm font-medium mb-2">Risk Metrics</h4>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-muted-foreground">Initial Capital</span>
                        <span>${backtestResult.initialCapital.toFixed(2)}</span>
                        
                        <span className="text-muted-foreground">Final Capital</span>
                        <span>${backtestResult.finalCapital.toFixed(2)}</span>
                        
                        <span className="text-muted-foreground">Sharpe Ratio</span>
                        <span>{backtestResult.sharpeRatio.toFixed(2)}</span>
                        
                        <span className="text-muted-foreground">Sortino Ratio</span>
                        <span>{backtestResult.sortinoRatio.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="equity" className="pt-4">
                  <div className="h-[350px] flex items-center justify-center border rounded">
                    <div className="text-center p-4">
                      <LineChart className="h-10 w-10 mb-2 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-medium">Equity Curve Chart</h3>
                      <p className="text-muted-foreground">
                        Normally this would show an interactive chart of your equity curve.
                      </p>
                      <p className="text-sm mt-2">
                        Starting: ${backtestResult.initialCapital.toFixed(2)} | 
                        Ending: ${backtestResult.finalCapital.toFixed(2)} |
                        Change: {backtestResult.totalReturn.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="trades" className="pt-4">
                  <div className="border rounded overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-2 px-3 text-left">Date</th>
                          <th className="py-2 px-3 text-left">Type</th>
                          <th className="py-2 px-3 text-right">Price</th>
                          <th className="py-2 px-3 text-right">Amount</th>
                          <th className="py-2 px-3 text-right">Value</th>
                          <th className="py-2 px-3 text-right">P/L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {backtestResult.trades.slice(0, 10).map((trade) => (
                          <tr key={trade.id} className="border-b">
                            <td className="py-2 px-3">
                              {format(new Date(trade.date), 'MMM d, yyyy HH:mm')}
                            </td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-1 rounded text-xs ${
                                trade.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {trade.type === 'buy' ? 'BUY' : 'SELL'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right">${trade.price.toFixed(2)}</td>
                            <td className="py-2 px-3 text-right">{trade.amount.toFixed(6)}</td>
                            <td className="py-2 px-3 text-right">${trade.value.toFixed(2)}</td>
                            <td className="py-2 px-3 text-right">
                              {trade.profitLoss !== undefined ? (
                                <span className={trade.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {trade.profitLoss >= 0 ? '+' : ''}{trade.profitLoss.toFixed(2)}
                                </span>
                              ) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {backtestResult.trades.length > 10 && (
                      <div className="text-center p-2 text-sm text-muted-foreground">
                        Showing 10 of {backtestResult.trades.length} trades
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <Calendar className="h-12 w-12 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Backtest Results</h3>
              <p className="text-muted-foreground text-center mt-2 max-w-md">
                Configure your strategy parameters and run a backtest to see how it would have performed historically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BacktestingPanel;
