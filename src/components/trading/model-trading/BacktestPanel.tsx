
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BacktestResult } from './types';
import { BarChart, TrendingUp, TrendingDown, AlertCircle, LineChart } from 'lucide-react';
import { ResponsiveContainer, LineChart as RechartLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface BacktestPanelProps {
  backtestResults: BacktestResult | null;
  onRunBacktest: (days: number) => Promise<void>;
  isModelRunning: boolean;
}

const BacktestPanel: React.FC<BacktestPanelProps> = ({ 
  backtestResults, 
  onRunBacktest,
  isModelRunning
}) => {
  const [days, setDays] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunBacktest = async () => {
    setIsRunning(true);
    await onRunBacktest(days);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="backtest-days">Backtest Period (Days)</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="backtest-days"
            type="number"
            min={7}
            max={365}
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="w-32"
          />
          <Button 
            onClick={handleRunBacktest} 
            disabled={isRunning || isModelRunning}
            className="flex items-center"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Running...
              </>
            ) : (
              <>
                <BarChart className="mr-2 h-4 w-4" />
                Run Backtest
              </>
            )}
          </Button>
        </div>
      </div>

      {!backtestResults && !isRunning && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 mb-3 text-muted-foreground" />
          <h3 className="text-lg font-medium">No Backtest Results</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Run a backtest to see how the model would have performed over the selected period
          </p>
        </div>
      )}
      
      {backtestResults && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Total Return</span>
                  <span className={`text-2xl font-bold ${
                    backtestResults.finalBalance >= backtestResults.initialBalance 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {backtestResults.finalBalance >= backtestResults.initialBalance ? '+' : ''}
                    {((backtestResults.finalBalance - backtestResults.initialBalance) / 
                      backtestResults.initialBalance * 100).toFixed(2)}%
                  </span>
                  <span className="text-sm">
                    ${backtestResults.initialBalance.toFixed(2)} → ${backtestResults.finalBalance.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Win Rate</span>
                  <span className="text-2xl font-bold">{(backtestResults.winRate * 100).toFixed(1)}%</span>
                  <span className="text-sm">
                    {backtestResults.winningTrades} / {backtestResults.totalTrades} trades
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Max Drawdown</span>
                  <span className="text-2xl font-bold text-red-500">
                    {backtestResults.maxDrawdown.toFixed(2)}%
                  </span>
                  <span className="text-sm">
                    Sharpe Ratio: {backtestResults.sharpeRatio.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-md font-medium">Balance History</h3>
            <Card>
              <CardContent className="p-4 h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartLineChart
                    data={backtestResults.trades.map((trade) => ({
                      date: trade.date,
                      balance: trade.balance
                    }))}
                    margin={{ top: 10, right: 10, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={['dataMin - 500', 'dataMax + 500']}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Balance']}
                      labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </RechartLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">Trade History</h3>
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-5 bg-muted px-4 py-2 text-sm font-medium">
                <div>Date</div>
                <div>Action</div>
                <div className="text-right">Price</div>
                <div className="text-right">Amount</div>
                <div className="text-right">P/L</div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {backtestResults.trades.map((trade, index) => (
                  <div key={`trade-${index}`} className="grid grid-cols-5 px-4 py-2 text-sm border-t">
                    <div>{new Date(trade.date).toLocaleDateString()}</div>
                    <div className="flex items-center">
                      {trade.action === 'buy' ? (
                        <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                      )}
                      <span className="capitalize">{trade.action}</span>
                    </div>
                    <div className="text-right">${trade.price.toFixed(2)}</div>
                    <div className="text-right">{trade.amount.toFixed(4)} BTC</div>
                    <div className={`text-right font-medium ${
                      (trade.profit || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {(trade.profit || 0) >= 0 ? '+' : ''}
                      ${(trade.profit || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BacktestPanel;
