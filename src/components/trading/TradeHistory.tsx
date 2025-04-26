
import React from "react";
import { Trade } from "@/types/trading";
import { Badge } from "@/components/ui/badge";
import { Bot, ArrowUpDown } from "lucide-react";

interface TradeHistoryProps {
  trades: Trade[];
  formatCurrency: (value: number) => string;
  activeCurrency: 'USD' | 'AUD';
}

const TradeHistory = ({ trades, formatCurrency, activeCurrency }: TradeHistoryProps) => {
  if (trades.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No trading history found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Trading History</h3>
      <div className="overflow-auto max-h-[400px]">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Type</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Coin</th>
              <th className="py-2 px-3 text-right text-xs font-medium text-muted-foreground">Amount</th>
              <th className="py-2 px-3 text-right text-xs font-medium text-muted-foreground">Price</th>
              <th className="py-2 px-3 text-right text-xs font-medium text-muted-foreground">Total</th>
              <th className="py-2 px-3 text-right text-xs font-medium text-muted-foreground">Date</th>
              <th className="py-2 px-3 text-center text-xs font-medium text-muted-foreground">Source</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => {
              const date = new Date(trade.timestamp);
              return (
                <tr key={trade.id} className="border-b">
                  <td className="py-2 px-3">
                    <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'} className="font-normal">
                      {trade.type === 'buy' ? 'Buy' : 'Sell'}
                    </Badge>
                  </td>
                  <td className="py-2 px-3">
                    <span className="font-medium">{trade.coinSymbol}</span>
                    <span className="text-xs text-muted-foreground ml-1">{trade.coinName}</span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    {trade.amount.toFixed(6)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {formatCurrency(trade.price)}
                  </td>
                  <td className="py-2 px-3 text-right font-medium">
                    {formatCurrency(trade.totalValue)}
                  </td>
                  <td className="py-2 px-3 text-right text-xs">
                    <div>{date.toLocaleDateString()}</div>
                    <div className="text-muted-foreground">{date.toLocaleTimeString()}</div>
                  </td>
                  <td className="py-2 px-3 text-center">
                    {trade.botGenerated ? (
                      <div className="flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-500" title="AI Bot Trade" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <ArrowUpDown className="h-4 w-4 text-gray-500" title="Manual Trade" />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeHistory;
