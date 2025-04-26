
import React, { useState, useEffect, useMemo } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { startSimulatedOrderBookUpdates } from "@/services/websocketService";
import { Zap, BookOpen } from "lucide-react";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";

interface OrderBookVisualizerProps {
  symbol: string;
  initialPrice: number;
  depth?: number;
}

const OrderBookVisualizer: React.FC<OrderBookVisualizerProps> = ({ 
  symbol, 
  initialPrice, 
  depth = 10 
}) => {
  const [orderBook, setOrderBook] = useState<{
    symbol: string;
    timestamp: number;
    asks: [number, number][];  // [price, quantity]
    bids: [number, number][];  // [price, quantity]
  } | null>(null);
  
  const [depthView, setDepthView] = useState<number>(depth);
  const { formatValue } = useCurrencyConverter();
  
  // Start simulated order book updates
  useEffect(() => {
    const stopSimulation = startSimulatedOrderBookUpdates(symbol, initialPrice, (data) => {
      setOrderBook(data);
    });
    
    return () => {
      stopSimulation();
    };
  }, [symbol, initialPrice]);
  
  // Calculate max volume for visualization
  const maxVolume = useMemo(() => {
    if (!orderBook) return 1;
    
    const allVolumes = [
      ...orderBook.asks.map(ask => ask[1]),
      ...orderBook.bids.map(bid => bid[1])
    ];
    
    return Math.max(...allVolumes, 1);
  }, [orderBook]);
  
  // Filter order book data based on depth view
  const filteredOrderBook = useMemo(() => {
    if (!orderBook) return null;
    
    return {
      ...orderBook,
      asks: orderBook.asks.slice(0, depthView),
      bids: orderBook.bids.slice(0, depthView)
    };
  }, [orderBook, depthView]);
  
  // Calculate spread
  const spreadInfo = useMemo(() => {
    if (!orderBook || orderBook.asks.length === 0 || orderBook.bids.length === 0) return null;
    
    const lowestAsk = orderBook.asks[0][0];
    const highestBid = orderBook.bids[0][0];
    const spread = lowestAsk - highestBid;
    const spreadPercentage = (spread / lowestAsk) * 100;
    
    return {
      spread,
      spreadPercentage,
      midPrice: (lowestAsk + highestBid) / 2
    };
  }, [orderBook]);

  if (!filteredOrderBook) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Book</CardTitle>
          <CardDescription>Loading order book data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {symbol} Order Book
            </CardTitle>
            <CardDescription>Real-time market depth visualization</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>Live</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Last Update: </span>
            {new Date(filteredOrderBook.timestamp).toLocaleTimeString()}
          </div>
          <Select value={String(depthView)} onValueChange={(value) => setDepthView(Number(value))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Depth" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 Levels</SelectItem>
              <SelectItem value="10">10 Levels</SelectItem>
              <SelectItem value="15">15 Levels</SelectItem>
              <SelectItem value="20">20 Levels</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {spreadInfo && (
          <div className="flex justify-between items-center py-2 px-4 mb-2 bg-muted/50 rounded-md">
            <div className="text-sm">
              <span className="text-muted-foreground">Mid Price: </span>
              <span className="font-medium">{formatValue(spreadInfo.midPrice)}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Spread: </span>
              <span className="font-medium">{formatValue(spreadInfo.spread)} ({spreadInfo.spreadPercentage.toFixed(4)}%)</span>
            </div>
          </div>
        )}
        
        {/* Ask (Sell) Orders */}
        <div className="space-y-1 mb-2">
          {filteredOrderBook.asks.map((ask, index) => {
            const [price, quantity] = ask;
            const volumePercentage = (quantity / maxVolume) * 100;
            
            return (
              <div key={`ask-${index}`} className="flex items-center h-6 relative">
                <div 
                  className="absolute right-0 h-full bg-red-100 dark:bg-red-950/30" 
                  style={{ width: `${volumePercentage}%` }}
                />
                <div className="flex justify-between items-center w-full px-2 z-10">
                  <div className="text-sm font-mono text-red-600">{price.toFixed(2)}</div>
                  <div className="text-sm font-mono">{quantity.toFixed(6)}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Spread visualization */}
        <div className="h-px bg-border my-2" />
        
        {/* Bid (Buy) Orders */}
        <div className="space-y-1">
          {filteredOrderBook.bids.map((bid, index) => {
            const [price, quantity] = bid;
            const volumePercentage = (quantity / maxVolume) * 100;
            
            return (
              <div key={`bid-${index}`} className="flex items-center h-6 relative">
                <div 
                  className="absolute right-0 h-full bg-green-100 dark:bg-green-950/30" 
                  style={{ width: `${volumePercentage}%` }}
                />
                <div className="flex justify-between items-center w-full px-2 z-10">
                  <div className="text-sm font-mono text-green-600">{price.toFixed(2)}</div>
                  <div className="text-sm font-mono">{quantity.toFixed(6)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBookVisualizer;
