
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AITradingStrategy, OptimizationResult } from '@/types/trading';
import { Wand2, TrendingUp, Check, RefreshCw, LineChart } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdvancedParameterOptimizationProps {
  strategy: AITradingStrategy;
  onApplyParameters: (parameters: Record<string, any>) => void;
}

const AdvancedParameterOptimization: React.FC<AdvancedParameterOptimizationProps> = ({ 
  strategy,
  onApplyParameters
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationMethod, setOptimizationMethod] = useState('genetic');
  const [optimizationTarget, setOptimizationTarget] = useState('returns');
  const [timeframe, setTimeframe] = useState('1d');
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);
  
  const handleStartOptimization = async () => {
    setIsOptimizing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate mock optimization results
      const results: OptimizationResult[] = [];
      
      for (let i = 0; i < 3; i++) {
        const baseReturn = 20 + (i * 10) + (Math.random() * 15);
        const improvement = 5 + (i * 5) + (Math.random() * 10);
        
        results.push({
          id: `opt-${i+1}`,
          strategyId: strategy.id,
          parameters: {
            ...strategy.parameters,
            period: 10 + i * 4,
            threshold: 60 + i * 5,
            stopLoss: 3 + i * 0.5,
            takeProfit: 8 + i * 1.5,
            riskFactor: 1.5 + i * 0.5,
          },
          parameterValues: {
            period: 10 + i * 4,
            threshold: 60 + i * 5,
            stopLoss: 3 + i * 0.5,
            takeProfit: 8 + i * 1.5,
            riskFactor: 1.5 + i * 0.5,
          },
          performance: {
            returns: baseReturn,
            winRate: 55 + i * 5,
            profitFactor: 1.5 + i * 0.4,
            sharpeRatio: 1.2 + i * 0.3,
            maxDrawdown: 15 - i * 1.5,
          },
          trades: 120 + i * 40,
          timeframe: timeframe,
          optimizationDate: new Date().toISOString(),
          improvement: improvement
        });
      }
      
      setOptimizationResults(results.sort((a, b) => b.performance.returns - a.performance.returns));
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const handleApply = (result: OptimizationResult) => {
    onApplyParameters(result.parameters);
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="h-5 w-5 mr-2" />
          Advanced Parameter Optimization
        </CardTitle>
        <CardDescription>
          Optimize your strategy parameters for maximum performance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {optimizationResults.length === 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Optimization Method</Label>
                <Select value={optimizationMethod} onValueChange={setOptimizationMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                    <SelectItem value="grid">Grid Search</SelectItem>
                    <SelectItem value="bayesian">Bayesian Optimization</SelectItem>
                    <SelectItem value="monte-carlo">Monte Carlo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Optimization Target</Label>
                <Select value={optimizationTarget} onValueChange={setOptimizationTarget}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="returns">Total Returns</SelectItem>
                    <SelectItem value="sharpe">Sharpe Ratio</SelectItem>
                    <SelectItem value="win-rate">Win Rate</SelectItem>
                    <SelectItem value="drawdown">Minimize Drawdown</SelectItem>
                    <SelectItem value="profit-factor">Profit Factor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Timeframe</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15m">15 Minutes</SelectItem>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="4h">4 Hours</SelectItem>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="1w">1 Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Data Range</Label>
                <Select defaultValue="1y">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3m">3 Months</SelectItem>
                    <SelectItem value="6m">6 Months</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                    <SelectItem value="2y">2 Years</SelectItem>
                    <SelectItem value="max">Maximum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium">Out-of-sample Testing</span>
                <Switch defaultChecked />
              </label>
              <p className="text-xs text-muted-foreground">
                Use part of historical data for validation to prevent overfitting
              </p>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleStartOptimization}
              disabled={isOptimizing}
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <LineChart className="h-4 w-4 mr-2" />
                  Start Advanced Optimization
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Optimization Results</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setOptimizationResults([])}
              >
                New Optimization
              </Button>
            </div>
            
            <div className="space-y-5">
              {optimizationResults.map((result, index) => (
                <Card key={result.id} className="border-2 border-muted relative overflow-hidden">
                  {index === 0 && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1">
                      Best
                    </div>
                  )}
                  
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/20">
                          Set #{index + 1}
                        </Badge>
                        <Badge className="bg-green-500">
                          +{result.improvement.toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <Button size="sm" onClick={() => handleApply(result)}>
                        <Check className="h-3 w-3 mr-1" />
                        Apply
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Returns</div>
                        <div className="font-medium">{result.performance.returns.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                        <div className="font-medium">{result.performance.winRate}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Trades</div>
                        <div className="font-medium">{result.trades}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs border-t pt-3">
                      {Object.entries(result.parameterValues).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedParameterOptimization;
