
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { predefinedStrategies, optimizeStrategy } from '@/utils/aiTradingStrategies';
import { BarChart2, Calendar, Settings2, Info, LineChart, TrendingUp, TrendingDown } from 'lucide-react';
import { AITradingStrategy, OptimizationResult } from '@/types/trading';
import { format, subDays, subMonths } from 'date-fns';

interface StrategyOptimizationProps {
  selectedStrategyId: string | null;
}

const StrategyOptimization: React.FC<StrategyOptimizationProps> = ({ selectedStrategyId }) => {
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
  const [timeframe, setTimeframe] = useState<string>('90d');
  const [initialCapital, setInitialCapital] = useState<number>(10000);
  const [strategy, setStrategy] = useState<AITradingStrategy | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[] | null>(null);
  const [activeTab, setActiveTab] = useState<string>('results');
  const [parameterRanges, setParameterRanges] = useState<Record<string, {min: number, max: number, step: number}>>({});
  const [enabledParameters, setEnabledParameters] = useState<Record<string, boolean>>({});

  const sortOptions = [
    { label: 'Total Return', value: 'totalReturn' },
    { label: 'Win Rate', value: 'winRate' },
    { label: 'Max Drawdown', value: 'maxDrawdown' },
    { label: 'Sharpe Ratio', value: 'sharpeRatio' },
    { label: 'Profit Factor', value: 'profitFactor' }
  ];
  const [sortBy, setSortBy] = useState<string>('totalReturn');
  
  // Find the selected strategy from the predefined list
  useEffect(() => {
    if (selectedStrategyId) {
      const found = predefinedStrategies.find(s => s.id === selectedStrategyId);
      if (found) {
        setStrategy(found);
        
        // Initialize parameter ranges and enabled state
        const initialRanges: Record<string, {min: number, max: number, step: number}> = {};
        const initialEnabled: Record<string, boolean> = {};
        
        found.parameters.forEach(param => {
          if (param.type === 'number' && param.min !== undefined && param.max !== undefined) {
            initialRanges[param.name] = {
              min: param.min,
              max: param.max,
              step: param.step || 1
            };
            initialEnabled[param.name] = true;
          }
        });
        
        setParameterRanges(initialRanges);
        setEnabledParameters(initialEnabled);
      }
    }
  }, [selectedStrategyId]);
  
  const handleRunOptimization = async () => {
    if (!strategy) return;
    
    // Filter only enabled parameters
    const enabledRanges: Record<string, {min: number, max: number, step: number}> = {};
    Object.keys(enabledParameters).forEach(paramName => {
      if (enabledParameters[paramName]) {
        enabledRanges[paramName] = parameterRanges[paramName];
      }
    });
    
    // Check if at least one parameter is enabled
    if (Object.keys(enabledRanges).length === 0) {
      toast({
        variant: "destructive",
        title: "Optimization Error",
        description: "Please enable at least one parameter to optimize",
      });
      return;
    }
    
    setIsRunning(true);
    setOptimizationResults(null);
    
    try {
      // Determine date range
      let startDate: Date;
      const endDate = new Date();
      
      switch (timeframe) {
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
          startDate = subDays(endDate, 90);
      }
      
      // Run optimization
      const results = await optimizeStrategy(
        strategy.id,
        selectedCoin,
        startDate,
        endDate,
        initialCapital,
        enabledRanges
      );
      
      // Sort results based on selected criteria
      results.sort((a, b) => {
        if (sortBy === 'maxDrawdown') {
          // For drawdown, lower is better
          return a.performance[sortBy] - b.performance[sortBy];
        } else {
          // For all other metrics, higher is better
          return b.performance[sortBy] - a.performance[sortBy];
        }
      });
      
      setOptimizationResults(results);
      
      toast({
        title: "Optimization complete",
        description: `${results.length} parameter combinations analyzed`,
      });
    } catch (error) {
      console.error("Optimization error:", error);
      toast({
        variant: "destructive",
        title: "Optimization failed",
        description: "There was an error running the optimization",
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleParameterRangeChange = (paramName: string, field: 'min' | 'max' | 'step', value: number) => {
    setParameterRanges(prev => ({
      ...prev,
      [paramName]: {
        ...prev[paramName],
        [field]: value
      }
    }));
  };
  
  const handleToggleParameter = (paramName: string) => {
    setEnabledParameters(prev => ({
      ...prev,
      [paramName]: !prev[paramName]
    }));
  };
  
  // Show a message if no strategy is selected
  if (!strategy) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-md border-dashed p-6">
        <Info size={32} className="text-muted-foreground mb-2" />
        <h3 className="text-xl font-medium">No Strategy Selected</h3>
        <p className="text-muted-foreground text-center mt-2">
          Please select a strategy from the Strategies tab to start optimizing.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="sortBy">Sort Results By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sortBy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Strategy Parameters */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="font-medium text-lg">Parameters to Optimize</h3>
          <div className="space-y-6">
            {strategy.parameters.map((param) => {
              if (param.type !== 'number' || param.min === undefined || param.max === undefined) {
                return null;
              }
              
              return (
                <div key={param.name} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`toggle-${param.name}`}>{param.label}</Label>
                    <Switch 
                      id={`toggle-${param.name}`}
                      checked={!!enabledParameters[param.name]}
                      onCheckedChange={() => handleToggleParameter(param.name)}
                    />
                  </div>
                  
                  <div className={enabledParameters[param.name] ? '' : 'opacity-50'}>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div>
                        <Label htmlFor={`min-${param.name}`} className="text-xs">Min</Label>
                        <Input
                          id={`min-${param.name}`}
                          type="number"
                          value={parameterRanges[param.name]?.min}
                          onChange={(e) => handleParameterRangeChange(param.name, 'min', Number(e.target.value))}
                          disabled={!enabledParameters[param.name]}
                          className="text-sm h-8"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`max-${param.name}`} className="text-xs">Max</Label>
                        <Input
                          id={`max-${param.name}`}
                          type="number"
                          value={parameterRanges[param.name]?.max}
                          onChange={(e) => handleParameterRangeChange(param.name, 'max', Number(e.target.value))}
                          disabled={!enabledParameters[param.name]}
                          className="text-sm h-8"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`step-${param.name}`} className="text-xs">Step</Label>
                        <Input
                          id={`step-${param.name}`}
                          type="number"
                          value={parameterRanges[param.name]?.step}
                          onChange={(e) => handleParameterRangeChange(param.name, 'step', Number(e.target.value))}
                          disabled={!enabledParameters[param.name]}
                          className="text-sm h-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Button 
            className="w-full mt-4" 
            onClick={handleRunOptimization}
            disabled={isRunning}
          >
            {isRunning ? "Optimizing..." : "Run Optimization"}
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Note: Optimization tests multiple parameter combinations to find the best performing settings.
            This process may take several minutes.
          </p>
        </div>
        
        {/* Optimization Results */}
        <div className="md:col-span-3 border rounded-lg p-4">
          {isRunning ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
                <Settings2 className="w-6 h-6 animate-pulse text-primary" />
              </div>
              <p className="mt-4 text-sm text-center text-muted-foreground">
                Optimizing {strategy.name} parameters.<br />
                Testing multiple parameter combinations...
              </p>
            </div>
          ) : optimizationResults ? (
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="results" className="flex items-center">
                    <BarChart2 className="w-4 h-4 mr-1" />
                    <span>Results Table</span>
                  </TabsTrigger>
                  <TabsTrigger value="chart" className="flex items-center">
                    <LineChart className="w-4 h-4 mr-1" />
                    <span>Performance Chart</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="results" className="pt-4">
                  {/* Results Table */}
                  <div className="border rounded overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-2 px-3 text-left">Rank</th>
                          <th className="py-2 px-3 text-left">Parameters</th>
                          <th className="py-2 px-3 text-right">Return</th>
                          <th className="py-2 px-3 text-right">Win Rate</th>
                          <th className="py-2 px-3 text-right">Drawdown</th>
                          <th className="py-2 px-3 text-right">Sharpe</th>
                        </tr>
                      </thead>
                      <tbody>
                        {optimizationResults.map((result, index) => (
                          <tr key={index} className={`border-b ${index === 0 ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                            <td className="py-2 px-3">
                              {index === 0 ? (
                                <span className="flex items-center">
                                  <TrendingUp className="text-green-500 w-4 h-4 mr-1" />
                                  Best
                                </span>
                              ) : (
                                `#${index + 1}`
                              )}
                            </td>
                            <td className="py-2 px-3">
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(result.parameters).map(([name, value]) => (
                                  <span key={name} className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs">
                                    {name}: {value}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className={`py-2 px-3 text-right ${result.performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {result.performance.totalReturn.toFixed(2)}%
                            </td>
                            <td className="py-2 px-3 text-right">
                              {result.performance.winRate.toFixed(2)}%
                            </td>
                            <td className="py-2 px-3 text-right">
                              {result.performance.maxDrawdown.toFixed(2)}%
                            </td>
                            <td className="py-2 px-3 text-right">
                              {result.performance.sharpeRatio.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="chart" className="pt-4">
                  <div className="h-[350px] flex items-center justify-center border rounded">
                    <div className="text-center p-4">
                      <LineChart className="h-10 w-10 mb-2 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-medium">Parameter Sensitivity Chart</h3>
                      <p className="text-muted-foreground">
                        This would show how each parameter affects performance.
                      </p>
                      <p className="text-sm mt-2">
                        {Object.keys(enabledParameters).filter(k => enabledParameters[k]).join(", ")}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <Calendar className="h-12 w-12 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Optimization Results</h3>
              <p className="text-muted-foreground text-center mt-2 max-w-md">
                Select parameters to optimize and run the optimization to find the best parameters for your strategy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrategyOptimization;
