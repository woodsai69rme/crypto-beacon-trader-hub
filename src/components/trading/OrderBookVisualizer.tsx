
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
  depth: number; // Percentage of total depth (for visualization)
}

interface OrderBookVisualizerProps {
  symbol: string;
  initialPrice: number;
  depth: number; // Number of levels to show on each side
  refreshInterval?: number; // In milliseconds
}

const OrderBookVisualizer: React.FC<OrderBookVisualizerProps> = ({
  symbol,
  initialPrice,
  depth = 10,
  refreshInterval = 2000
}) => {
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [spread, setSpread] = useState<number>(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  
  // Generate mock order book data
  const generateOrderBook = () => {
    const currentPrice = initialPrice * (0.995 + Math.random() * 0.01); // Small random fluctuation
    const newAsks: OrderBookEntry[] = [];
    const newBids: OrderBookEntry[] = [];
    
    let askTotal = 0;
    let bidTotal = 0;
    
    // Generate asks (sell orders) - higher than current price
    for (let i = 0; i < depth; i++) {
      const price = currentPrice * (1 + (i + 1) * 0.0005);
      const amount = 0.1 + Math.random() * 2;
      askTotal += amount;
      
      newAsks.push({
        price,
        amount,
        total: askTotal,
        depth: 0 // Will calculate after generating all entries
      });
    }
    
    // Generate bids (buy orders) - lower than current price
    for (let i = 0; i < depth; i++) {
      const price = currentPrice * (1 - (i + 1) * 0.0005);
      const amount = 0.1 + Math.random() * 2;
      bidTotal += amount;
      
      newBids.push({
        price,
        amount,
        total: bidTotal,
        depth: 0 // Will calculate after generating all entries
      });
    }
    
    // Calculate depth percentage for visualization
    const maxTotal = Math.max(askTotal, bidTotal);
    newAsks.forEach(ask => {
      ask.depth = (ask.total / maxTotal) * 100;
    });
    
    newBids.forEach(bid => {
      bid.depth = (bid.total / maxTotal) * 100;
    });
    
    // Calculate spread
    const lowestAsk = newAsks[0].price;
    const highestBid = newBids[0].price;
    const spreadValue = lowestAsk - highestBid;
    const spreadPercentage = (spreadValue / lowestAsk) * 100;
    
    setAsks(newAsks);
    setBids(newBids);
    setSpread(spreadPercentage);
    setLastUpdateTime(new Date());
  };
  
  useEffect(() => {
    // Initial generation
    generateOrderBook();
    
    // Set up interval for updates
    const intervalId = setInterval(generateOrderBook, refreshInterval);
    
    // Clean up
    return () => clearInterval(intervalId);
  }, [refreshInterval]);
  
  // Format price with appropriate precision
  const formatPrice = (price: number) => {
    return price > 100 ? price.toFixed(2) : price.toFixed(4);
  };
  
  // Format amount with appropriate precision
  const formatAmount = (amount: number) => {
    return amount >= 1 ? amount.toFixed(3) : amount.toFixed(6);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {symbol} Order Book
          </CardTitle>
          <Badge variant="outline" className="animate-pulse">LIVE</Badge>
        </div>
        <CardDescription className="flex justify-between items-center mt-1">
          <span>Spread: {spread.toFixed(4)}%</span>
          <span className="text-xs text-muted-foreground">
            Last update: {lastUpdateTime.toLocaleTimeString()}
          </span>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 text-sm font-medium bg-muted/50 p-2 rounded-t-md border-b">
          <div>Price</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Total</div>
        </div>
        
        {/* Asks (Sell Orders) - Displayed in reverse order (highest to lowest) */}
        <div className="border-x">
          {asks.map((ask, index) => (
            <div key={`ask-${index}`} className="grid grid-cols-3 text-sm p-2 relative overflow-hidden">
              <div 
                className="absolute top-0 right-0 bottom-0 bg-red-500/10 z-0" 
                style={{ width: `${ask.depth}%` }}
              />
              <div className="z-10 text-red-500 font-medium">
                {formatPrice(ask.price)}
              </div>
              <div className="text-right z-10">
                {formatAmount(ask.amount)}
              </div>
              <div className="text-right z-10">
                {formatAmount(ask.total)}
              </div>
            </div>
          ))}
        </div>
        
        {/* Spread indicator */}
        <div className="bg-muted/30 border-x border-t border-b p-2 text-center text-sm font-medium">
          Spread: {spread.toFixed(4)}%
        </div>
        
        {/* Bids (Buy Orders) */}
        <div className="border-x border-b rounded-b-md">
          {bids.map((bid, index) => (
            <div key={`bid-${index}`} className="grid grid-cols-3 text-sm p-2 relative overflow-hidden">
              <div 
                className="absolute top-0 right-0 bottom-0 bg-green-500/10 z-0" 
                style={{ width: `${bid.depth}%` }}
              />
              <div className="z-10 text-green-500 font-medium">
                {formatPrice(bid.price)}
              </div>
              <div className="text-right z-10">
                {formatAmount(bid.amount)}
              </div>
              <div className="text-right z-10">
                {formatAmount(bid.total)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBookVisualizer;
