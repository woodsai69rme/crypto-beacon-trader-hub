
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

const OrderBook: React.FC = () => {
  // Mock data for the order book
  const bids: OrderBookEntry[] = [
    { price: 61245.32, amount: 0.5, total: 30622.66 },
    { price: 61244.15, amount: 0.75, total: 45933.11 },
    { price: 61242.80, amount: 1.2, total: 73491.36 },
    { price: 61240.65, amount: 0.3, total: 18372.20 },
    { price: 61238.42, amount: 2.0, total: 122476.84 }
  ];

  const asks: OrderBookEntry[] = [
    { price: 61249.75, amount: 0.4, total: 24499.90 },
    { price: 61252.18, amount: 0.85, total: 52064.35 },
    { price: 61254.92, amount: 0.6, total: 36752.95 },
    { price: 61256.33, amount: 1.5, total: 91884.50 },
    { price: 61258.88, amount: 0.25, total: 15314.72 }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Order Book</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-1 px-4 py-2 bg-muted/30 text-xs font-medium">
          <div className="text-left">Price (USD)</div>
          <div className="text-right">Amount (BTC)</div>
        </div>

        <div className="h-[250px] overflow-auto">
          <div className="asks space-y-0.5 mb-2">
            {asks.map((ask, index) => (
              <div key={`ask-${index}`} className="grid grid-cols-2 gap-1 px-4 py-1 text-xs hover:bg-muted/30">
                <div className="text-left text-red-500">{ask.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div className="text-right">{ask.amount.toFixed(4)}</div>
              </div>
            ))}
          </div>
          
          <div className="text-center py-2 font-medium text-sm border-y border-muted">
            61,247.50
          </div>
          
          <div className="bids space-y-0.5 mt-2">
            {bids.map((bid, index) => (
              <div key={`bid-${index}`} className="grid grid-cols-2 gap-1 px-4 py-1 text-xs hover:bg-muted/30">
                <div className="text-left text-green-500">{bid.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div className="text-right">{bid.amount.toFixed(4)}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBook;
