
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowDown, ArrowUp } from "lucide-react";

const OrderBookVisualizer: React.FC = () => {
  const [pair, setPair] = useState<string>("BTC-USD");
  const [depth, setDepth] = useState<string>("10");
  
  const currentPrice = 61745.32;
  
  const generateMockOrderbook = () => {
    const bids = [];
    const asks = [];
    
    for (let i = 0; i < parseInt(depth); i++) {
      const bidPrice = currentPrice - (i * 10) - Math.random() * 5;
      const askPrice = currentPrice + (i * 10) + Math.random() * 5;
      
      const bidSize = Math.random() * 2 + 0.1;
      const askSize = Math.random() * 2 + 0.1;
      
      bids.push({ price: bidPrice, size: bidSize, total: 0 });
      asks.push({ price: askPrice, size: askSize, total: 0 });
    }
    
    // Calculate cumulative totals
    let bidTotal = 0;
    let askTotal = 0;
    
    bids.forEach((bid, index) => {
      bidTotal += bid.size;
      bids[index].total = bidTotal;
    });
    
    asks.forEach((ask, index) => {
      askTotal += ask.size;
      asks[index].total = askTotal;
    });
    
    return { bids, asks };
  };
  
  const { bids, asks } = generateMockOrderbook();
  
  const maxTotal = Math.max(
    bids.length > 0 ? bids[bids.length - 1].total : 0,
    asks.length > 0 ? asks[asks.length - 1].total : 0
  );
  
  return (
    <Card className="border border-border shadow-lg">
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">Order Book</h2>
            <p className="text-sm text-muted-foreground">Market depth visualization</p>
          </div>
          <div className="flex gap-2">
            <Select value={pair} onValueChange={setPair}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Trading Pair" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC-USD">BTC-USD</SelectItem>
                <SelectItem value="ETH-USD">ETH-USD</SelectItem>
                <SelectItem value="SOL-USD">SOL-USD</SelectItem>
                <SelectItem value="ADA-USD">ADA-USD</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={depth} onValueChange={setDepth}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Depth" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="px-4 py-2 bg-muted/20 rounded-md">
            <div className="text-sm text-muted-foreground">Current Price</div>
            <div className="text-xl font-bold">${currentPrice.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-1">
          <div className="col-span-3 p-2 bg-muted/20 grid grid-cols-3 text-xs font-medium text-center rounded-t-md">
            <div>Price (USD)</div>
            <div>Amount (BTC)</div>
            <div>Total (BTC)</div>
          </div>
          
          <div className="col-span-3 bg-muted/20 rounded-b-md overflow-hidden">
            {/* Asks (Sell Orders) - Displayed in reverse order */}
            <div>
              {asks.map((ask, index) => (
                <div key={`ask-${index}`} className="grid grid-cols-3 text-xs text-right p-1 relative">
                  <div className="absolute top-0 right-0 h-full bg-red-500/10" style={{ width: `${(ask.total / maxTotal) * 100}%` }}></div>
                  <div className="text-red-500 z-10">${ask.price.toFixed(2)}</div>
                  <div className="z-10">{ask.size.toFixed(6)}</div>
                  <div className="z-10">{ask.total.toFixed(6)}</div>
                </div>
              ))}
            </div>
            
            {/* Spread indicator */}
            <div className="grid grid-cols-3 text-xs text-center py-2 px-1 bg-muted/40">
              <div>Spread: ${(asks[0].price - bids[0].price).toFixed(2)}</div>
              <div>{((asks[0].price - bids[0].price) / currentPrice * 100).toFixed(2)}%</div>
              <div></div>
            </div>
            
            {/* Bids (Buy Orders) */}
            <div>
              {bids.map((bid, index) => (
                <div key={`bid-${index}`} className="grid grid-cols-3 text-xs text-right p-1 relative">
                  <div className="absolute top-0 right-0 h-full bg-green-500/10" style={{ width: `${(bid.total / maxTotal) * 100}%` }}></div>
                  <div className="text-green-500 z-10">${bid.price.toFixed(2)}</div>
                  <div className="z-10">{bid.size.toFixed(6)}</div>
                  <div className="z-10">{bid.total.toFixed(6)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500/20 mr-1"></div>
            <span className="text-xs text-muted-foreground">Buy orders</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500/20 mr-1"></div>
            <span className="text-xs text-muted-foreground">Sell orders</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 px-4 py-3 bg-muted/20 rounded-md">
          <div className="flex flex-col items-center">
            <div className="text-xs text-muted-foreground">Bid Volume</div>
            <div className="text-sm font-medium text-green-500">{bids[bids.length-1].total.toFixed(2)} BTC</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-xs text-muted-foreground">Buy/Sell Ratio</div>
            <div className="text-sm font-medium">
              {(bids[bids.length-1].total / asks[asks.length-1].total).toFixed(2)}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-xs text-muted-foreground">Ask Volume</div>
            <div className="text-sm font-medium text-red-500">{asks[asks.length-1].total.toFixed(2)} BTC</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBookVisualizer;
