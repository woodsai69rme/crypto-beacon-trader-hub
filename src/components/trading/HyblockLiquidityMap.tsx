
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from "recharts";
import { RefreshCw, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { HyblockMarketData } from "@/types/trading";

interface HyblockLiquidityMapProps {
  className?: string;
}

const HyblockLiquidityMap: React.FC<HyblockLiquidityMapProps> = ({ className }) => {
  const [symbol, setSymbol] = useState<string>("BTCUSD");
  const [loading, setLoading] = useState<boolean>(false);
  const [marketData, setMarketData] = useState<HyblockMarketData | null>(null);
  
  useEffect(() => {
    fetchLiquidityData();
  }, [symbol]);
  
  const fetchLiquidityData = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would fetch from Hyblock API
      // Using mock data for demonstration
      const mockData = generateMockHyblockData(symbol);
      setMarketData(mockData);
      
      toast({
        title: "Liquidity Data Updated",
        description: `${symbol} liquidity map refreshed`
      });
    } catch (error) {
      console.error("Error fetching liquidity data:", error);
      toast({
        title: "API Error",
        description: "Failed to fetch Hyblock liquidity data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const generateMockHyblockData = (symbol: string): HyblockMarketData => {
    const basePrice = symbol.startsWith("BTC") ? 60000 : 
                     symbol.startsWith("ETH") ? 3000 : 
                     symbol.startsWith("SOL") ? 150 : 100;
    
    // Generate liquidity zones
    const liquidityZones = [];
    for (let i = 0; i < 15; i++) {
      const isBuy = Math.random() > 0.5;
      const priceDeviation = (Math.random() * 0.1) * basePrice * (isBuy ? -1 : 1);
      const volume = Math.random() * 50 + 10;
      const strength = Math.random() * 0.9 + 0.1;
      
      liquidityZones.push({
        price: basePrice + priceDeviation,
        volume,
        type: isBuy ? 'buy' : 'sell',
        strength,
        exchanges: ['Binance', 'Coinbase', 'Kraken'].filter(() => Math.random() > 0.5)
      });
    }
    
    // Generate large orders
    const largeOrders = [];
    for (let i = 0; i < 5; i++) {
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      const priceDeviation = (Math.random() * 0.05) * basePrice * (side === 'buy' ? -1 : 1);
      
      largeOrders.push({
        price: basePrice + priceDeviation,
        size: Math.random() * 100 + 50,
        side,
        exchange: ['Binance', 'Coinbase', 'Kraken'][Math.floor(Math.random() * 3)],
        timestamp: Date.now() - Math.floor(Math.random() * 3600000)
      });
    }
    
    // Generate heatmap data
    const priceRanges = [];
    const volumeIntensity = [];
    const rangeStep = basePrice * 0.01;
    
    for (let i = 0; i < 10; i++) {
      const rangeStart = basePrice - (5 * rangeStep) + (i * rangeStep);
      priceRanges.push([rangeStart, rangeStart + rangeStep]);
      volumeIntensity.push(Math.random());
    }
    
    return {
      symbol,
      liquidityZones,
      largeOrders,
      heatmapData: {
        priceRanges,
        volumeIntensity
      }
    };
  };
  
  const formatScatterData = () => {
    if (!marketData) return [];
    
    return marketData.liquidityZones.map(zone => ({
      price: zone.price,
      volume: zone.volume,
      type: zone.type,
      strength: zone.strength,
      size: zone.volume * 2 // For visual sizing in the chart
    }));
  };
  
  const getZoneColor = (type: 'buy' | 'sell', strength: number) => {
    if (type === 'buy') {
      const intensity = Math.floor(strength * 255);
      return `rgba(0, ${intensity}, 0, ${0.3 + (strength * 0.7)})`;
    } else {
      const intensity = Math.floor(strength * 255);
      return `rgba(${intensity}, 0, 0, ${0.3 + (strength * 0.7)})`;
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border p-3 rounded shadow-md">
          <p className="font-medium mb-1">{data.type === 'buy' ? 'Buy Zone' : 'Sell Zone'}</p>
          <p className="text-sm">Price: {formatCurrency(data.price)}</p>
          <p className="text-sm">Volume: {data.volume.toFixed(2)}</p>
          <p className="text-sm">Strength: {(data.strength * 100).toFixed(1)}%</p>
        </div>
      );
    }
    
    return null;
  };
  
  const handleRefresh = () => {
    fetchLiquidityData();
  };
  
  const openHyblockWebsite = () => {
    window.open('https://hyblock.co/liquiditymap', '_blank');
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <CardTitle className="flex items-center">
              Hyblock Liquidity Map
              <Button variant="link" className="p-0 h-auto ml-1" onClick={openHyblockWebsite}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>Visualization of market liquidity zones</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select pair" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTCUSD">BTC/USD</SelectItem>
                <SelectItem value="ETHUSD">ETH/USD</SelectItem>
                <SelectItem value="SOLUSD">SOL/USD</SelectItem>
                <SelectItem value="ADAUSD">ADA/USD</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={loading}
              className={loading ? "animate-spin" : ""}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis 
                type="number" 
                dataKey="price" 
                name="Price" 
                domain={['auto', 'auto']}
                tickFormatter={(value) => formatCurrency(value)}
                label={{ value: 'Price', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="volume" 
                name="Volume" 
                label={{ value: 'Volume', angle: -90, position: 'insideLeft' }}
              />
              <ZAxis type="number" dataKey="size" range={[50, 500]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter name="Liquidity Zones" data={formatScatterData()}>
                {formatScatterData().map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getZoneColor(entry.type, entry.strength)}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Large Orders</div>
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted/50 p-2 text-xs font-medium grid grid-cols-4">
              <div>Type</div>
              <div>Price</div>
              <div>Size</div>
              <div>Exchange</div>
            </div>
            <div className="max-h-[150px] overflow-y-auto">
              {marketData?.largeOrders.map((order, idx) => (
                <div 
                  key={idx} 
                  className="p-2 border-t grid grid-cols-4 text-xs"
                >
                  <div className={order.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                    {order.side.toUpperCase()}
                  </div>
                  <div>{formatCurrency(order.price)}</div>
                  <div>{order.size.toFixed(2)}</div>
                  <div>{order.exchange}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-green-500 opacity-60"></div>
              <span className="text-xs">Buy Zones</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500 opacity-60"></div>
              <span className="text-xs">Sell Zones</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Size represents volume
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HyblockLiquidityMap;
