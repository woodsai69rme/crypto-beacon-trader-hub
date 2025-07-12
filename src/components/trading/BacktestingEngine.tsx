
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Download, BarChart } from 'lucide-react';

interface BacktestResult {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
}

export const BacktestingEngine: React.FC = () => {
  const [symbol, setSymbol] = useState('BTC-USD');
  const [strategy, setStrategy] = useState('grid');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-01');
  const [initialCapital, setInitialCapital] = useState('10000');
  const [results, setResults] = useState<BacktestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runBacktest = async () => {
    setIsRunning(true);
    
    // Simulate backtesting delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock results
    const mockResults: BacktestResult = {
      totalReturn: Math.random() * 50 + 10,
      sharpeRatio: Math.random() * 2 + 0.5,
      maxDrawdown: Math.random() * 20 + 5,
      winRate: Math.random() * 40 + 50,
      totalTrades: Math.floor(Math.random() * 200 + 50),
      profitFactor: Math.random() * 2 + 1
    };
    
    setResults(mockResults);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Backtesting Engine</CardTitle>
          <CardDescription>
            Test your trading strategies against historical data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Trading Pair</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC-USD">BTC-USD</SelectItem>
                  <SelectItem value="ETH-USD">ETH-USD</SelectItem>
                  <SelectItem value="SOL-USD">SOL-USD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid Trading</SelectItem>
                  <SelectItem value="trend-following">Trend Following</SelectItem>
                  <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capital">Initial Capital ($)</Label>
              <Input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={runBacktest} disabled={isRunning} className="w-full">
            <Play className="mr-2 h-4 w-4" />
            {isRunning ? 'Running Backtest...' : 'Run Backtest'}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Backtest Results</CardTitle>
            <CardDescription>
              Performance metrics for {strategy} strategy on {symbol}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {results.totalReturn.toFixed(2)}%
                </div>
                <div className="text-sm text-muted-foreground">Total Return</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold">
                  {results.sharpeRatio.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {results.maxDrawdown.toFixed(2)}%
                </div>
                <div className="text-sm text-muted-foreground">Max Drawdown</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold">
                  {results.winRate.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold">
                  {results.totalTrades}
                </div>
                <div className="text-sm text-muted-foreground">Total Trades</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold">
                  {results.profitFactor.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Profit Factor</div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                View Details
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Results
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BacktestingEngine;
