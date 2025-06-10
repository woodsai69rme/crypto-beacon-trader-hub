
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Target, Clock } from 'lucide-react';
import { advancedOpenRouterService } from '@/services/ai/advancedOpenRouterService';
import { useToast } from '@/hooks/use-toast';

const BacktestingEngine: React.FC = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [config, setConfig] = useState({
    strategy: 'trend-following',
    timeframe: '1M',
    initialCapital: 10000,
    startDate: '2023-01-01',
    endDate: '2024-01-01'
  });

  const strategies = [
    { id: 'trend-following', name: 'Trend Following' },
    { id: 'mean-reversion', name: 'Mean Reversion' },
    { id: 'breakout', name: 'Breakout' },
    { id: 'momentum', name: 'Momentum' }
  ];

  const runBacktest = async () => {
    setIsRunning(true);
    setProgress(0);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const backtestResults = await advancedOpenRouterService.performBacktest(
        config.strategy,
        config,
        config.timeframe
      );

      clearInterval(interval);
      setProgress(100);

      // Generate mock performance data
      const performanceData = Array.from({ length: 12 }, (_, i) => ({
        month: `Month ${i + 1}`,
        portfolio: 10000 + (backtestResults.totalReturn / 12) * (i + 1) * 100,
        benchmark: 10000 + (5 / 12) * (i + 1) * 100
      }));

      setResults({
        ...backtestResults,
        performanceData,
        totalReturn: backtestResults.totalReturn.toFixed(2),
        winRate: backtestResults.winRate.toFixed(1),
        maxDrawdown: backtestResults.maxDrawdown.toFixed(2),
        sharpeRatio: backtestResults.sharpeRatio.toFixed(2)
      });

      toast({
        title: 'Backtest Complete',
        description: `Strategy returned ${backtestResults.totalReturn.toFixed(2)}% over the test period`
      });
    } catch (error) {
      toast({
        title: 'Backtest Failed',
        description: 'Error running backtest. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Strategy Backtesting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <Label>Strategy</Label>
              <Select value={config.strategy} onValueChange={(value) => setConfig(prev => ({ ...prev, strategy: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {strategies.map(strategy => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Timeframe</Label>
              <Select value={config.timeframe} onValueChange={(value) => setConfig(prev => ({ ...prev, timeframe: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1W">1 Week</SelectItem>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="3M">3 Months</SelectItem>
                  <SelectItem value="6M">6 Months</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Initial Capital (AUD)</Label>
              <Input
                type="number"
                value={config.initialCapital}
                onChange={(e) => setConfig(prev => ({ ...prev, initialCapital: Number(e.target.value) }))}
              />
            </div>
          </div>

          {isRunning && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Running Backtest</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <Button onClick={runBacktest} disabled={isRunning} className="w-full">
            {isRunning ? 'Running Backtest...' : 'Run Backtest'}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-green-500">{results.totalReturn}%</div>
                  <div className="text-sm text-muted-foreground">Total Return</div>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold">{results.winRate}%</div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="text-2xl font-bold text-red-500">{results.maxDrawdown}%</div>
                  <div className="text-sm text-muted-foreground">Max Drawdown</div>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold">{results.trades}</div>
                  <div className="text-sm text-muted-foreground">Total Trades</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                  <Line type="monotone" dataKey="portfolio" stroke="#3b82f6" strokeWidth={2} name="Strategy" />
                  <Line type="monotone" dataKey="benchmark" stroke="#6b7280" strokeWidth={2} name="Benchmark" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BacktestingEngine;
