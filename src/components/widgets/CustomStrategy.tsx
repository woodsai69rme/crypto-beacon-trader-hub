
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Code, Play, Save } from 'lucide-react';

const CustomStrategy: React.FC = () => {
  const [strategyCode, setStrategyCode] = useState(`
// Custom Trading Strategy
function tradingStrategy(marketData, portfolio) {
  const { price, volume, rsi, macd } = marketData;
  
  // Buy signal: RSI < 30 and MACD crosses above signal
  if (rsi < 30 && macd.histogram > 0) {
    return {
      action: 'buy',
      amount: portfolio.balance * 0.1,
      reason: 'Oversold condition with bullish momentum'
    };
  }
  
  // Sell signal: RSI > 70 and MACD crosses below signal
  if (rsi > 70 && macd.histogram < 0) {
    return {
      action: 'sell',
      amount: portfolio.positions.length > 0 ? portfolio.positions[0].amount * 0.5 : 0,
      reason: 'Overbought condition with bearish momentum'
    };
  }
  
  return { action: 'hold', reason: 'No clear signal' };
}
  `.trim());

  const [backtestResults, setBacktestResults] = useState({
    totalTrades: 45,
    winRate: 68,
    profitFactor: 1.8,
    sharpeRatio: 1.4,
    maxDrawdown: 12,
    returns: 24.5
  });

  const runBacktest = () => {
    console.log('Running backtest...');
    // Simulate backtest with random results
    setBacktestResults({
      totalTrades: Math.floor(Math.random() * 100) + 20,
      winRate: Math.floor(Math.random() * 40) + 50,
      profitFactor: Number((Math.random() * 2 + 1).toFixed(1)),
      sharpeRatio: Number((Math.random() * 2 + 0.5).toFixed(1)),
      maxDrawdown: Math.floor(Math.random() * 20) + 5,
      returns: Number((Math.random() * 50 + 10).toFixed(1))
    });
  };

  const saveStrategy = () => {
    console.log('Saving custom strategy...');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Custom Strategy Builder
          </CardTitle>
          <CardDescription>
            Write your own trading strategy using JavaScript
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Textarea
            value={strategyCode}
            onChange={(e) => setStrategyCode(e.target.value)}
            className="font-mono text-sm min-h-[300px]"
            placeholder="Write your trading strategy here..."
          />
          
          <div className="flex gap-2">
            <Button onClick={runBacktest} className="gap-2">
              <Play className="h-4 w-4" />
              Run Backtest
            </Button>
            <Button variant="outline" onClick={saveStrategy} className="gap-2">
              <Save className="h-4 w-4" />
              Save Strategy
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backtest Results</CardTitle>
          <CardDescription>
            Performance metrics for your custom strategy
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{backtestResults.totalTrades}</div>
              <div className="text-sm text-muted-foreground">Total Trades</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{backtestResults.winRate}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{backtestResults.profitFactor}</div>
              <div className="text-sm text-muted-foreground">Profit Factor</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{backtestResults.sharpeRatio}</div>
              <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">-{backtestResults.maxDrawdown}%</div>
              <div className="text-sm text-muted-foreground">Max Drawdown</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">+{backtestResults.returns}%</div>
              <div className="text-sm text-muted-foreground">Total Returns</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomStrategy;
