
import React from "react";
import type { Trade } from "@/types/trading";

interface TradeHistoryProps {
  trades: Trade[];
  formatCurrency: (value: number) => string;
  activeCurrency: 'USD' | 'AUD';
}

const TradeHistory = ({ trades, formatCurrency, activeCurrency }: TradeHistoryProps) => {
  return (
    <div>
      <h3 className="font-medium mb-3">Recent Trades</h3>
      {trades.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b">
              <tr>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Coin</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-right">Current</th>
                <th className="px-4 py-2 text-right">P/L</th>
              </tr>
            </thead>
            <tbody>
              {trades
                .filter(trade => trade.currency === activeCurrency)
                .slice(0, 10)
                .map((trade) => {
                  const date = new Date(trade.timestamp);
                  const isProfitable = trade.profitLoss ? trade.profitLoss > 0 : false;
                  
                  return (
                    <tr key={trade.id} className="border-b">
                      <td className="px-4 py-2">
                        {date.toLocaleDateString()} {date.toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`font-medium ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.type === 'buy' ? 'BUY' : 'SELL'}
                        </span>
                      </td>
                      <td className="px-4 py-2">{trade.coinSymbol}</td>
                      <td className="px-4 py-2 text-right">{trade.amount.toFixed(6)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(trade.price)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(trade.totalValue)}</td>
                      <td className="px-4 py-2 text-right">
                        {formatCurrency(trade.currentValue || trade.totalValue)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {trade.profitLoss && (
                          <span className={isProfitable ? 'text-green-500' : 'text-red-500'}>
                            {formatCurrency(Math.abs(trade.profitLoss))}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No trade history yet.</p>
          <p className="text-sm">Execute your first trade to see the history.</p>
        </div>
      )}
    </div>
  );
};

export default TradeHistory;
