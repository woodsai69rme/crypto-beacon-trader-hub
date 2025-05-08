
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";

interface LiveActivityFeedProps {
  coinId: string;
}

interface TradeActivity {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  value: number;
  time: string;
}

const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ coinId }) => {
  // Mock trade activity data
  const tradeActivity: TradeActivity[] = [
    { id: '1', type: 'buy', amount: 0.75, price: 61250.50, value: 45937.88, time: '12:58:32' },
    { id: '2', type: 'sell', amount: 0.5, price: 61248.20, value: 30624.10, time: '12:58:05' },
    { id: '3', type: 'buy', amount: 1.2, price: 61245.80, value: 73494.96, time: '12:57:45' },
    { id: '4', type: 'buy', amount: 0.3, price: 61243.50, value: 18373.05, time: '12:57:22' },
    { id: '5', type: 'sell', amount: 0.85, price: 61240.75, value: 52054.64, time: '12:57:03' },
    { id: '6', type: 'sell', amount: 1.5, price: 61238.30, value: 91857.45, time: '12:56:48' },
    { id: '7', type: 'buy', amount: 0.25, price: 61236.80, value: 15309.20, time: '12:56:30' },
    { id: '8', type: 'buy', amount: 0.6, price: 61235.45, value: 36741.27, time: '12:56:12' }
  ];

  // Format currency to USD
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const getCoinSymbolFromId = (id: string) => {
    const symbolMap: Record<string, string> = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'solana': 'SOL'
    };
    return symbolMap[id] || 'BTC';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-4 py-2 bg-muted/30 text-xs font-medium grid grid-cols-4">
          <div>Type</div>
          <div>Amount</div>
          <div>Price</div>
          <div>Time</div>
        </div>
        <div className="max-h-[300px] overflow-auto">
          {tradeActivity.map((trade) => (
            <div 
              key={trade.id} 
              className={`px-4 py-2 text-xs border-b grid grid-cols-4 hover:bg-muted/30 transition-colors ${
                trade.type === 'buy' ? 'hover:bg-green-50 dark:hover:bg-green-950/20' : 'hover:bg-red-50 dark:hover:bg-red-950/20'
              }`}
            >
              <div>
                <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'} className="text-[10px] font-normal">
                  {trade.type === 'buy' ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {trade.type.toUpperCase()}
                </Badge>
              </div>
              <div>{trade.amount} {getCoinSymbolFromId(coinId)}</div>
              <div>{formatCurrency(trade.price)}</div>
              <div>{trade.time}</div>
            </div>
          ))}

          {tradeActivity.length === 0 && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No recent trades to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveActivityFeed;
