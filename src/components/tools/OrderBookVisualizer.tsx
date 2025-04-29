
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
  depth: number;
}

const OrderBookVisualizer = () => {
  const [pair, setPair] = useState("BTC/USDT");
  const [depth, setDepth] = useState("20");
  const [activeTab, setActiveTab] = useState("order-book");
  const [isLoading, setIsLoading] = useState(false);
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookEntry[], asks: OrderBookEntry[] }>({
    bids: [],
    asks: []
  });
  
  // Generate random order book data
  const generateOrderBookData = (basePrice: number, depth: number) => {
    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];
    
    let bidTotal = 0;
    let askTotal = 0;
    const maxDepth = 5000; // Max for visualization scaling
    
    // Generate bids (buy orders)
    for (let i = 0; i < depth; i++) {
      const priceOffset = basePrice * (1 - (Math.random() * 0.02 + (i * 0.001)));
      const price = parseFloat(priceOffset.toFixed(2));
      const size = parseFloat((Math.random() * 2 + 0.1).toFixed(3));
      bidTotal += size;
      
      bids.push({
        price,
        size,
        total: bidTotal,
        depth: Math.min((bidTotal / maxDepth) * 100, 100)
      });
    }
    
    // Generate asks (sell orders)
    for (let i = 0; i < depth; i++) {
      const priceOffset = basePrice * (1 + (Math.random() * 0.02 + (i * 0.001)));
      const price = parseFloat(priceOffset.toFixed(2));
      const size = parseFloat((Math.random() * 2 + 0.1).toFixed(3));
      askTotal += size;
      
      asks.push({
        price,
        size,
        total: askTotal,
        depth: Math.min((askTotal / maxDepth) * 100, 100)
      });
    }
    
    // Sort bids in descending order (highest price first)
    bids.sort((a, b) => b.price - a.price);
    
    // Sort asks in ascending order (lowest price first)
    asks.sort((a, b) => a.price - b.price);
    
    return { bids, asks };
  };
  
  // Simulate loading order book data
  const fetchOrderBook = () => {
    setIsLoading(true);
    
    // Determine base price based on the selected pair
    let basePrice;
    switch (pair) {
      case "BTC/USDT":
        basePrice = 61245.75;
        break;
      case "ETH/USDT":
        basePrice = 3021.45;
        break;
      case "SOL/USDT":
        basePrice = 142.87;
        break;
      default:
        basePrice = 61245.75;
    }
    
    // Simulate API call delay
    setTimeout(() => {
      const newData = generateOrderBookData(basePrice, parseInt(depth));
      setOrderBook(newData);
      setIsLoading(false);
    }, 500);
  };
  
  // Initialize data
  useEffect(() => {
    fetchOrderBook();
    
    // Set up interval to simulate real-time updates
    const interval = setInterval(() => {
      fetchOrderBook();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [pair, depth]);
  
  // Calculate order book stats
  const calculateStats = () => {
    if (!orderBook.bids.length || !orderBook.asks.length) return null;
    
    const highestBid = orderBook.bids[0].price;
    const lowestAsk = orderBook.asks[0].price;
    const spread = lowestAsk - highestBid;
    const spreadPercentage = (spread / highestBid) * 100;
    
    // Calculate cumulative totals
    const bidVolume = orderBook.bids.reduce((total, bid) => total + bid.size, 0);
    const askVolume = orderBook.asks.reduce((total, ask) => total + ask.size, 0);
    
    // Calculate bid/ask ratio
    const bidAskRatio = bidVolume / askVolume;
    
    return {
      highestBid,
      lowestAsk,
      spread,
      spreadPercentage,
      bidVolume,
      askVolume,
      bidAskRatio
    };
  };
  
  const stats = calculateStats();
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              Order Book Visualizer
            </CardTitle>
            <CardDescription>
              Analyze market depth and trading liquidity
            </CardDescription>
          </div>
          
          <div className="flex gap-2 items-center">
            <Select value={pair} onValueChange={setPair}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Trading pair" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={depth} onValueChange={setDepth}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Depth" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            
            <button 
              className="rounded-full p-1.5 hover:bg-muted/50"
              onClick={fetchOrderBook}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4 pt-1 border-t border-border">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="order-book">Order Book</TabsTrigger>
              <TabsTrigger value="depth-chart">Depth Chart</TabsTrigger>
            </TabsList>
          </div>
          
          {stats && (
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Highest Bid</div>
                <div className="text-lg font-bold text-green-500">${stats.highestBid.toFixed(2)}</div>
              </div>
              
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Lowest Ask</div>
                <div className="text-lg font-bold text-red-500">${stats.lowestAsk.toFixed(2)}</div>
              </div>
              
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Spread</div>
                <div className="text-lg font-bold">
                  ${stats.spread.toFixed(2)} ({stats.spreadPercentage.toFixed(3)}%)
                </div>
              </div>
              
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Bid/Ask Ratio</div>
                <div className={`text-lg font-bold ${
                  stats.bidAskRatio > 1.2 ? 'text-green-500' : 
                  stats.bidAskRatio < 0.8 ? 'text-red-500' : ''
                }`}>
                  {stats.bidAskRatio.toFixed(2)}
                </div>
              </div>
            </div>
          )}
          
          <TabsContent value="order-book" className="m-0">
            <div className="flex flex-col md:flex-row p-0">
              {/* Asks (Sell Orders) - displayed in reverse order (highest to lowest) */}
              <div className="flex-1 border-r border-border">
                <div className="px-4 py-2 border-y border-border bg-muted/20">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Price</span>
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-muted-foreground">Total</span>
                  </div>
                </div>
                
                <div className="overflow-y-auto h-[400px]">
                  {orderBook.asks.slice().reverse().map((ask, index) => (
                    <div 
                      key={`ask-${index}`} 
                      className="px-4 py-1.5 border-b border-border/50 relative hover:bg-red-500/5"
                    >
                      <div
                        className="absolute top-0 right-0 h-full bg-red-500/20 z-0"
                        style={{ width: `${ask.depth}%` }}
                      ></div>
                      
                      <div className="flex justify-between relative z-10">
                        <div className="text-sm font-medium text-red-500">{ask.price.toFixed(2)}</div>
                        <div className="text-sm">{ask.size.toFixed(3)}</div>
                        <div className="text-sm text-muted-foreground">{ask.total.toFixed(3)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Bids (Buy Orders) */}
              <div className="flex-1">
                <div className="px-4 py-2 border-y border-border bg-muted/20">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Price</span>
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-muted-foreground">Total</span>
                  </div>
                </div>
                
                <div className="overflow-y-auto h-[400px]">
                  {orderBook.bids.map((bid, index) => (
                    <div 
                      key={`bid-${index}`} 
                      className="px-4 py-1.5 border-b border-border/50 relative hover:bg-green-500/5"
                    >
                      <div
                        className="absolute top-0 left-0 h-full bg-green-500/20 z-0"
                        style={{ width: `${bid.depth}%` }}
                      ></div>
                      
                      <div className="flex justify-between relative z-10">
                        <div className="text-sm font-medium text-green-500">{bid.price.toFixed(2)}</div>
                        <div className="text-sm">{bid.size.toFixed(3)}</div>
                        <div className="text-sm text-muted-foreground">{bid.total.toFixed(3)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="depth-chart" className="m-0 p-4">
            <div className="h-[500px] bg-muted/20 rounded-md p-4 flex flex-col">
              <div className="text-center mb-4">
                <div className="text-sm font-medium">{pair} Depth Chart</div>
                <div className="text-xs text-muted-foreground">Showing market liquidity visualization</div>
              </div>
              
              <div className="flex-1 relative">
                {/* Y-axis - Price labels */}
                <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-muted-foreground px-2">
                  {stats && (
                    <>
                      <div>{(stats.lowestAsk * 1.02).toFixed(2)}</div>
                      <div>{stats.lowestAsk.toFixed(2)}</div>
                      <div>{stats.highestBid.toFixed(2)}</div>
                      <div>{(stats.highestBid * 0.98).toFixed(2)}</div>
                    </>
                  )}
                </div>
                
                {/* X-axis - Total amount labels */}
                <div className="absolute left-16 right-0 bottom-0 h-6 flex justify-between text-xs text-muted-foreground">
                  {stats && (
                    <>
                      <div>0</div>
                      <div>{(stats.bidVolume / 2).toFixed(1)}</div>
                      <div>{stats.bidVolume.toFixed(1)}</div>
                      <div>{(stats.askVolume / 2).toFixed(1)}</div>
                      <div>{stats.askVolume.toFixed(1)}</div>
                    </>
                  )}
                </div>
                
                {/* Depth chart visualization (simplified representation) */}
                <div className="absolute left-16 right-0 top-0 bottom-6 flex">
                  {/* Bids (green) */}
                  <div className="flex-1 relative">
                    <div 
                      className="absolute inset-0 bg-gradient-to-l from-green-500/20 to-green-500/5"
                      style={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 0%)" }}
                    ></div>
                  </div>
                  
                  {/* Asks (red) */}
                  <div className="flex-1 relative">
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-500/5"
                      style={{ clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)" }}
                    ></div>
                  </div>
                </div>
                
                {/* Mid-market line */}
                {stats && (
                  <div className="absolute left-16 right-0 border-l border-dashed border-primary/50" style={{ 
                    height: "50%", 
                    top: "25%" 
                  }}></div>
                )}
              </div>
              
              <div className="mt-4 flex justify-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500/50 rounded-sm"></div>
                  <span className="text-xs">Bids</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500/50 rounded-sm"></div>
                  <span className="text-xs">Asks</span>
                </div>
              </div>
              
              <div className="mt-6 text-center text-xs text-muted-foreground">
                Note: This is a simplified visual representation. For precise data, refer to the Order Book tab.
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <div className="flex items-start gap-1">
              <Badge variant="outline" className="px-1.5 text-[10px]">PRO TIP</Badge>
              <span>
                The bid-ask spread indicates market liquidity. A narrow spread typically means high
                liquidity, while a wide spread may indicate lower liquidity or higher volatility.
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBookVisualizer;
