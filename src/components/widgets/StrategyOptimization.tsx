
import React, { useState } from 'react';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { 
  AITradingStrategy, 
  OptimizationResult, 
  StrategyParameter 
} from '@/types/trading';
import { sampleStrategies } from '@/utils/aiTradingStrategies';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const OPTIMIZATION_METHODS = [
  { value: 'grid', label: 'Grid Search' },
  { value: 'random', label: 'Random Search' },
  { value: 'bayesian', label: 'Bayesian Optimization' },
  { value: 'genetic', label: 'Genetic Algorithm' },
];

const OPTIMIZATION_METRICS = [
  { value: 'profit', label: 'Total Profit' },
  { value: 'sharpe', label: 'Sharpe Ratio' },
  { value: 'drawdown', label: 'Minimize Drawdown' },
  { value: 'winRate', label: 'Win Rate' },
];

// Generate mock optimization results
const generateOptimizationResults = (strategy: AITradingStrategy, iterations: number): OptimizationResult[] => {
  const results: OptimizationResult[] = [];
  
  for (let i = 0; i < iterations; i++) {
    // Create a random variation of the parameters
    const parameterValues: Record<string, any> = {};
    const parameters: StrategyParameter[] = [];
    
    strategy.parameters.forEach(param => {
      if (param.type === 'number' && param.min !== undefined && param.max !== undefined) {
        const value = param.min + Math.random() * (param.max - param.min);
        parameterValues[param.name] = Math.round(value * 100) / 100;
      } else if (param.type === 'boolean') {
        parameterValues[param.name] = Math.random() > 0.5;
      } else if (param.type === 'select' && param.options) {
        const randomIndex = Math.floor(Math.random() * param.options.length);
        parameterValues[param.name] = param.options[randomIndex];
      } else {
        parameterValues[param.name] = param.value;
      }
      
      parameters.push({
        ...param,
        value: parameterValues[param.name],
      });
    });
    
    // Random performance metrics
    const profit = Math.random() * 5000 - 1000;
    const profitPercentage = profit / 10000 * 100;
    const winRate = 0.4 + Math.random() * 0.4;
    const maxDrawdown = 5 + Math.random() * 15;
    
    results.push({
      strategyId: strategy.id,
      parameterValues,
      parameters,
      performance: {
        profit,
        profitPercentage,
        winRate,
        maxDrawdown,
        sharpeRatio: 0.8 + Math.random() * 1.2,
        profitFactor: 1 + Math.random() * 1.5,
        totalReturn: profitPercentage,
      },
      improvement: Math.random() * 30,
    });
  }
  
  // Sort by profit (or other performance metric)
  results.sort((a, b) => b.performance.profit - a.performance.profit);
  
  return results;
};

const StrategyOptimization = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>(sampleStrategies[0]?.id || '');
  const [selectedMethod, setSelectedMethod] = useState<string>('grid');
  const [selectedMetric, setSelectedMetric] = useState<string>('profit');
  const [iterations, setIterations] = useState<number>(50);
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<OptimizationResult[] | null>(null);

  const handleRunOptimization = () => {
    setIsLoading(true);
    
    // Find the selected strategy
    const strategyToOptimize = sampleStrategies.find(s => s.id === selectedStrategy);
    
    if (!strategyToOptimize) {
      toast({
        title: "Error",
        description: "Strategy not found",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResults = generateOptimizationResults(strategyToOptimize, iterations);
      setResults(mockResults);
      setIsLoading(false);
      
      toast({
        title: "Optimization completed",
        description: `Found ${mockResults.length} parameter combinations.`,
      });
    }, 3000);
  };

  // Format number as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Format number as percentage
  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  
  // Get the currently selected strategy
  const selectedStrategyObj = sampleStrategies.find(s => s.id === selectedStrategy);
  
  // Prepare chart data from optimization results
  const prepareChartData = (optimizationResults: OptimizationResult[] | null) => {
    if (!optimizationResults) return [];
    
    // Return top 10 results for the chart
    return optimizationResults.slice(0, 10).map((result, index) => ({
      name: `Run ${index + 1}`,
      profit: result.performance.profit,
      profitPercentage: result.performance.profitPercentage,
      winRate: result.performance.winRate * 100,
      maxDrawdown: result.performance.maxDrawdown,
    }));
  };
  
  const chartData = prepareChartData(results);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Strategy Optimization</CardTitle>
        <CardDescription>
          Fine-tune strategy parameters for optimal performance
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="strategy">Trading Strategy</Label>
              <Select
                value={selectedStrategy}
                onValueChange={setSelectedStrategy}
              >
                <SelectTrigger id="strategy">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {sampleStrategies.map(strategy => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="metric">Optimization Goal</Label>
              <Select
                value={selectedMetric}
                onValueChange={setSelectedMetric}
              >
                <SelectTrigger id="metric">
                  <SelectValue placeholder="Select optimization metric" />
                </SelectTrigger>
                <SelectContent>
                  {OPTIMIZATION_METRICS.map(metric => (
                    <SelectItem key={metric.value} value={metric.value}>
                      {metric.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="method">Optimization Method</Label>
              <Select
                value={selectedMethod}
                onValueChange={setSelectedMethod}
              >
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select optimization method" />
                </SelectTrigger>
                <SelectContent>
                  {OPTIMIZATION_METHODS.map(method => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="iterations">Number of Iterations</Label>
              <Input
                id="iterations"
                type="number"
                value={iterations}
                onChange={(e) => setIterations(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-6">
          <Switch
            checked={isAdvanced}
            onCheckedChange={setIsAdvanced}
            id="advanced-mode"
          />
          <Label htmlFor="advanced-mode">Advanced Optimization Settings</Label>
        </div>
        
        {isAdvanced && (
          <div className="p-4 border rounded-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max-drawdown">Maximum Allowed Drawdown (%)</Label>
              <Input
                id="max-drawdown"
                type="number"
                placeholder="25"
              />
            </div>
            
            <div>
              <Label htmlFor="min-win-rate">Minimum Win Rate (%)</Label>
              <Input
                id="min-win-rate"
                type="number"
                placeholder="50"
              />
            </div>
            
            <div>
              <Label htmlFor="min-trades">Minimum Number of Trades</Label>
              <Input
                id="min-trades"
                type="number"
                placeholder="20"
              />
            </div>
            
            <div>
              <Label htmlFor="time-period">Optimization Period</Label>
              <Select defaultValue="6m">
                <SelectTrigger id="time-period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="2y">2 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {selectedStrategyObj && (
          <div className="p-4 border rounded-md mb-6">
            <h3 className="font-medium text-sm mb-2">Parameters to Optimize: {selectedStrategyObj.name}</h3>
            
            {selectedStrategyObj.parameters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedStrategyObj.parameters.map(param => (
                  <div key={param.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <span className="font-medium">{param.label || param.name}</span>
                      <p className="text-xs text-gray-500">{param.description}</p>
                    </div>
                    <div className="flex items-center">
                      <Switch defaultChecked id={`optimize-${param.id}`} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No parameters available for optimization</div>
            )}
          </div>
        )}
        
        <div className="flex justify-center mb-6">
          <Button onClick={handleRunOptimization} disabled={isLoading}>
            {isLoading ? 'Optimizing...' : 'Run Optimization'}
          </Button>
        </div>
        
        {results && results.length > 0 && (
          <>
            <h3 className="font-medium mb-3">Top Optimization Results</h3>
            
            <div className="w-full h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => 
                    selectedMetric === 'profit' ? formatCurrency(Number(value)) : 
                    `${Number(value).toFixed(2)}`
                  } />
                  <Bar 
                    dataKey={selectedMetric === 'profit' ? 'profit' : 
                            selectedMetric === 'sharpe' ? 'sharpeRatio' :
                            selectedMetric === 'drawdown' ? 'maxDrawdown' : 'winRate'}
                    name={OPTIMIZATION_METRICS.find(m => m.value === selectedMetric)?.label}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`#${(index * 500 + 2000).toString(16)}`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Best Parameter Combination</h3>
              <div className="p-4 bg-muted/30 border rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  {results[0].parameters && results[0].parameters.map((param) => (
                    <div key={param.id} className="space-y-1">
                      <div className="text-sm font-medium">{param.label || param.name}</div>
                      <div className="text-lg">{
                        typeof param.value === 'number' ? 
                          Number(param.value).toFixed(2) : 
                          String(param.value)
                      }</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Performance Metrics</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <div className="text-xs text-gray-500">Profit</div>
                      <div className={`${results[0].performance.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(results[0].performance.profit)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Win Rate</div>
                      <div>{formatPercent(results[0].performance.winRate * 100)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Max Drawdown</div>
                      <div className="text-red-600">{formatPercent(results[0].performance.maxDrawdown)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Improvement</div>
                      <div className="text-green-600">+{formatPercent(results[0].improvement)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button>Apply Parameters</Button>
                <Button variant="outline">Export Results</Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StrategyOptimization;
