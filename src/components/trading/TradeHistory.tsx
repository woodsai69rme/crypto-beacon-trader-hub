
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { Trade } from "@/types/trading";

interface TradeHistoryProps {
  trades: Trade[];
  title?: string;
  description?: string;
  limit?: number;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ 
  trades, 
  title = "Trade History", 
  description = "Recent trading activity",
  limit = 10
}) => {
  // Sort by most recent and limit
  const sortedTrades = [...trades]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {sortedTrades.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No trades yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>
                    <div className="font-medium">{trade.coinSymbol}</div>
                  </TableCell>
                  <TableCell>
                    {trade.type === "buy" ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <ArrowUp className="h-3 w-3 mr-1 text-green-600" />
                        Buy
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <ArrowDown className="h-3 w-3 mr-1 text-red-600" />
                        Sell
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {trade.amount.toFixed(6)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${trade.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${trade.totalValue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {new Date(trade.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TradeHistory;
