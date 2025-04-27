
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SupportedCurrency } from "./TradingStats";
import { Trade } from "./types";

interface TradeHistoryProps {
  trades: Trade[];
  formatCurrency: (value: number) => string;
  activeCurrency: SupportedCurrency;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades, formatCurrency, activeCurrency }) => {
  if (trades.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>No trade history yet</p>
        <p className="text-sm">Your trades will appear here</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-medium mb-3">Trade History</h3>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Coin</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.slice(0, 10).map((trade) => (
              <TableRow key={trade.id}>
                <TableCell className="text-muted-foreground">
                  {new Date(trade.timestamp).toLocaleDateString()}
                </TableCell>
                <TableCell className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                  {trade.type.charAt(0).toUpperCase() + trade.type.slice(1)}
                </TableCell>
                <TableCell>{trade.coinSymbol}</TableCell>
                <TableCell>{trade.amount.toFixed(6)}</TableCell>
                <TableCell className="text-right">{formatCurrency(trade.price)}</TableCell>
                <TableCell className="text-right">{formatCurrency(trade.totalValue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {trades.length > 10 && (
        <div className="text-center mt-2">
          <p className="text-sm text-muted-foreground">Showing last 10 trades</p>
        </div>
      )}
    </div>
  );
};

export default TradeHistory;
