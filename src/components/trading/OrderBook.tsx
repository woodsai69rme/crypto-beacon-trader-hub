
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/contexts/CurrencyContext';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

const OrderBook: React.FC = () => {
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    // Generate mock order book data
    const generateOrders = (basePrice: number, isAsk: boolean): OrderBookEntry[] => {
      const orders: OrderBookEntry[] = [];
      let runningTotal = 0;
      
      for (let i = 0; i < 10; i++) {
        const priceVariation = isAsk ? i * 50 : -i * 50;
        const price = basePrice + priceVariation;
        const amount = Math.random() * 2 + 0.1;
        runningTotal += amount;
        
        orders.push({
          price,
          amount,
          total: runningTotal
        });
      }
      
      return orders;
    };

    const updateOrderBook = () => {
      const currentPrice = 45000 + (Math.random() - 0.5) * 1000;
      setAsks(generateOrders(currentPrice, true));
      setBids(generateOrders(currentPrice, false));
    };

    updateOrderBook();
    const interval = setInterval(updateOrderBook, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const formatAmount = (amount: number) => amount.toFixed(6);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Order Book
          <Badge variant="secondary">BTC/AUD</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Asks (Sell Orders) */}
        <div>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-2">
            <span>Price (AUD)</span>
            <span className="text-right">Amount (BTC)</span>
            <span className="text-right">Total</span>
          </div>
          <div className="space-y-1">
            {asks.slice(0, 5).reverse().map((ask, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 text-xs py-1">
                <span className="text-red-500 font-mono">
                  {formatCurrency(ask.price)}
                </span>
                <span className="text-right font-mono">
                  {formatAmount(ask.amount)}
                </span>
                <span className="text-right font-mono text-muted-foreground">
                  {formatAmount(ask.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spread */}
        <div className="text-center py-2 border-y">
          <span className="text-sm font-medium">
            Spread: {formatCurrency(Math.abs(asks[0]?.price - bids[0]?.price) || 0)}
          </span>
        </div>

        {/* Bids (Buy Orders) */}
        <div>
          <div className="space-y-1">
            {bids.slice(0, 5).map((bid, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 text-xs py-1">
                <span className="text-green-500 font-mono">
                  {formatCurrency(bid.price)}
                </span>
                <span className="text-right font-mono">
                  {formatAmount(bid.amount)}
                </span>
                <span className="text-right font-mono text-muted-foreground">
                  {formatAmount(bid.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Market Summary */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Price</span>
            <span className="font-medium">{formatCurrency(bids[0]?.price || 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">24h Volume</span>
            <span className="font-medium">1,247.58 BTC</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBook;
