
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { BacktestResult } from "@/types/trading";

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
    <div>
      {backtestResults ? (
        <div className="space-y-6">
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-4">Backtest Results</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 border rounded-md">
                <div className="text-xs text-muted-foreground">Total Return</div>
                <div className={`text-lg font-semibold ${backtestResults.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {backtestResults.returns >= 0 ? '+' : ''}{backtestResults.returns.toFixed(2)}%
                </div>
              </div>
              
              <div className="p-3 border rounded-md">
                <div className="text-xs text-muted-foreground">Win Rate</div>
                <div className="text-lg font-semibold">
                  {backtestResults.winRate.toFixed(1)}%
                </div>
              </div>
              
              <div className="p-3 border rounded-md">
                <div className="text-xs text-muted-foreground">Total Trades</div>
                <div className="text-lg font-semibold">
                  {backtestResults.trades}
                </div>
              </div>
              
              <div className="p-3 border rounded-md">
                <div className="text-xs text-muted-foreground">Max Drawdown</div>
                <div className="text-lg font-semibold text-red-600">
                  -{backtestResults.maxDrawdown.toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button variant="outline" onClick={onResetBacktest}>
                Run New Backtest
              </Button>
            </div>
          </div>
          
          {backtestResults.tradeHistory && (
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-4">Trade History</h3>
              <div className="max-h-64 overflow-y-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Price</th>
                      <th className="text-left py-2">Amount</th>
                      <th className="text-right py-2">P/L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backtestResults.tradeHistory.slice(0, 10).map((trade) => (
                      <tr key={trade.id} className="border-b">
                        <td className="py-2">{new Date(trade.timestamp).toLocaleDateString()}</td>
                        <td className="py-2 capitalize">{trade.type}</td>
                        <td className="py-2">${trade.price.toFixed(2)}</td>
                        <td className="py-2">{trade.amount.toFixed(4)}</td>
                        <td className={`py-2 text-right ${trade.profitLoss && trade.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.profitLoss && trade.profitLoss >= 0 ? '+' : ''}
                          ${trade.profitLoss?.toFixed(2) || '0.00'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-6">
            Run a backtest to see how your strategy would have performed on historical data
          </p>
          <Button onClick={onBacktest} disabled={isBacktesting}>
            <Play className="h-4 w-4 mr-2" />
            {isBacktesting ? 'Running Backtest...' : 'Run Backtest'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default StrategyBacktest;
