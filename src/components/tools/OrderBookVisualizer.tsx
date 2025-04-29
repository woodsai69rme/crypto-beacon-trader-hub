
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const OrderBookVisualizer: React.FC = () => {
  const [tradingPair, setTradingPair] = useState("BTC/USD");
  const [depth, setDepth] = useState("20");
  
  // Mock order book data
  const bids = [
    { price: 61250.00, size: 2.547, total: 2.547 },
    { price: 61245.35, size: 0.831, total: 3.378 },
    { price: 61240.10, size: 1.425, total: 4.803 },
    { price: 61225.50, size: 3.200, total: 8.003 },
    { price: 61200.00, size: 5.100, total: 13.103 },
    { price: 61195.40, size: 2.340, total: 15.443 },
    { price: 61180.20, size: 4.120, total: 19.563 },
    { price: 61175.00, size: 2.780, total: 22.343 },
    { price: 61150.00, size: 6.500, total: 28.843 },
    { price: 61125.50, size: 3.310, total: 32.153 }
  ];
  
  const asks = [
    { price: 61255.00, size: 1.825, total: 1.825 },
    { price: 61260.50, size: 2.450, total: 4.275 },
    { price: 61271.30, size: 1.120, total: 5.395 },
    { price: 61280.00, size: 3.650, total: 9.045 },
    { price: 61300.50, size: 4.230, total: 13.275 },
    { price: 61312.40, size: 2.100, total: 15.375 },
    { price: 61325.00, size: 5.250, total: 20.625 },
    { price: 61350.75, size: 3.480, total: 24.105 },
    { price: 61375.00, size: 6.120, total: 30.225 },
    { price: 61400.00, size: 4.360, total: 34.585 }
  ];
  
  // Find the maximum total for visualization scaling
  const maxTotal = Math.max(
    ...bids.map(b => b.total),
    ...asks.map(a => a.total)
  );
  
  // Calculate spread
  const spread = asks[0].price - bids[0].price;
  const spreadPercentage = (spread / asks[0].price) * 100;

  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="bg-card text-card-foreground">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Order Book Visualizer
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Visualize market depth and order distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Trading Pair</label>
            <Select value={tradingPair} onValueChange={setTradingPair}>
              <SelectTrigger>
                <SelectValue placeholder="Select trading pair" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                <SelectItem value="SOL/USD">SOL/USD</SelectItem>
                <SelectItem value="BTC/EUR">BTC/EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Depth</label>
            <Select value={depth} onValueChange={setDepth}>
              <SelectTrigger>
                <SelectValue placeholder="Select depth" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 Levels</SelectItem>
                <SelectItem value="20">20 Levels</SelectItem>
                <SelectItem value="50">50 Levels</SelectItem>
                <SelectItem value="100">100 Levels</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">Order Book ({tradingPair})</h3>
            <div className="text-sm">
              <span className="text-muted-foreground">Spread: </span>
              <span className="font-medium">{spread.toFixed(2)} ({spreadPercentage.toFixed(3)}%)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="grid grid-cols-3 p-2 bg-secondary/20 rounded-t-md">
                <div className="text-sm font-medium text-left">Price</div>
                <div className="text-sm font-medium text-right">Size</div>
                <div className="text-sm font-medium text-right">Total</div>
              </div>
              <div className="h-64 overflow-y-auto rounded-b-md border border-border">
                {bids.map((bid, idx) => (
                  <div key={idx} className="grid grid-cols-3 p-2 border-b border-border hover:bg-secondary/10 relative">
                    <div className="text-green-500">{bid.price.toFixed(2)}</div>
                    <div className="text-right">{bid.size.toFixed(3)}</div>
                    <div className="text-right">{bid.total.toFixed(3)}</div>
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-green-500/10" 
                      style={{ width: `${(bid.total / maxTotal) * 100}%`, zIndex: -1 }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-3 p-2 bg-secondary/20 rounded-t-md">
                <div className="text-sm font-medium text-left">Price</div>
                <div className="text-sm font-medium text-right">Size</div>
                <div className="text-sm font-medium text-right">Total</div>
              </div>
              <div className="h-64 overflow-y-auto rounded-b-md border border-border">
                {asks.map((ask, idx) => (
                  <div key={idx} className="grid grid-cols-3 p-2 border-b border-border hover:bg-secondary/10 relative">
                    <div className="text-red-500">{ask.price.toFixed(2)}</div>
                    <div className="text-right">{ask.size.toFixed(3)}</div>
                    <div className="text-right">{ask.total.toFixed(3)}</div>
                    <div 
                      className="absolute right-0 top-0 bottom-0 bg-red-500/10" 
                      style={{ width: `${(ask.total / maxTotal) * 100}%`, zIndex: -1 }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <h4 className="font-medium mb-3">Recent Trades</h4>
          <div className="rounded-md border border-border overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-secondary/20">
                <tr>
                  <th className="py-2 px-3 text-left text-sm font-medium">Time</th>
                  <th className="py-2 px-3 text-left text-sm font-medium">Price</th>
                  <th className="py-2 px-3 text-right text-sm font-medium">Amount</th>
                  <th className="py-2 px-3 text-right text-sm font-medium">Side</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-secondary/10">
                  <td className="py-2 px-3 text-sm">12:34:56</td>
                  <td className="py-2 px-3 text-sm text-green-500">61250.00</td>
                  <td className="py-2 px-3 text-sm text-right">0.125</td>
                  <td className="py-2 px-3 text-sm text-right text-green-500">Buy</td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/10">
                  <td className="py-2 px-3 text-sm">12:34:52</td>
                  <td className="py-2 px-3 text-sm text-red-500">61255.00</td>
                  <td className="py-2 px-3 text-sm text-right">0.212</td>
                  <td className="py-2 px-3 text-sm text-right text-red-500">Sell</td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/10">
                  <td className="py-2 px-3 text-sm">12:34:48</td>
                  <td className="py-2 px-3 text-sm text-red-500">61255.00</td>
                  <td className="py-2 px-3 text-sm text-right">0.345</td>
                  <td className="py-2 px-3 text-sm text-right text-red-500">Sell</td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/10">
                  <td className="py-2 px-3 text-sm">12:34:45</td>
                  <td className="py-2 px-3 text-sm text-green-500">61250.00</td>
                  <td className="py-2 px-3 text-sm text-right">0.510</td>
                  <td className="py-2 px-3 text-sm text-right text-green-500">Buy</td>
                </tr>
                <tr className="hover:bg-secondary/10">
                  <td className="py-2 px-3 text-sm">12:34:40</td>
                  <td className="py-2 px-3 text-sm text-green-500">61245.50</td>
                  <td className="py-2 px-3 text-sm text-right">0.175</td>
                  <td className="py-2 px-3 text-sm text-right text-green-500">Buy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBookVisualizer;
