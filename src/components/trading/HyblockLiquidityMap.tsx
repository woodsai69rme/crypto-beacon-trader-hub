
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HyblockMarketData } from '@/types/trading';
import { TrendingUp, TrendingDown } from 'lucide-react';

const mockHyblockData: HyblockMarketData[] = [
  {
    symbol: "BTC-USD",
    liquidityZones: [
      { price: 91500, volume: 120000000, type: 'sell', strength: 0.8, exchanges: ['Binance', 'Coinbase', 'Kraken'] },
      { price: 90200, volume: 95000000, type: 'sell', strength: 0.7, exchanges: ['Binance', 'Coinbase'] },
      { price: 88700, volume: 78000000, type: 'buy', strength: 0.6, exchanges: ['Binance', 'OKX'] },
      { price: 87300, volume: 110000000, type: 'buy', strength: 0.85, exchanges: ['Binance', 'Coinbase', 'Kraken', 'OKX'] },
      { price: 85000, volume: 180000000, type: 'buy', strength: 0.9, exchanges: ['Binance', 'Coinbase', 'Kraken', 'Bybit'] },
    ],
    largeOrders: [
      { price: 91500, size: 25000000, side: 'sell', exchange: 'Binance', timestamp: 1650984000000 },
      { price: 87200, size: 18000000, side: 'buy', exchange: 'Coinbase', timestamp: 1650987600000 },
      { price: 85100, size: 35000000, side: 'buy', exchange: 'OKX', timestamp: 1650991200000 },
    ],
    lastUpdated: "2023-04-26T15:00:00Z"
  },
  {
    symbol: "ETH-USD",
    liquidityZones: [
      { price: 3750, volume: 45000000, type: 'sell', strength: 0.75, exchanges: ['Binance', 'Coinbase'] },
      { price: 3650, volume: 32000000, type: 'sell', strength: 0.6, exchanges: ['Binance'] },
      { price: 3500, volume: 28000000, type: 'buy', strength: 0.65, exchanges: ['Binance', 'Kraken'] },
      { price: 3350, volume: 42000000, type: 'buy', strength: 0.8, exchanges: ['Binance', 'Coinbase', 'OKX'] },
      { price: 3200, volume: 65000000, type: 'buy', strength: 0.9, exchanges: ['Binance', 'Coinbase', 'Kraken', 'Bybit'] },
    ],
    largeOrders: [
      { price: 3740, size: 9000000, side: 'sell', exchange: 'Binance', timestamp: 1650984000000 },
      { price: 3510, size: 7500000, side: 'buy', exchange: 'Coinbase', timestamp: 1650987600000 },
      { price: 3200, size: 12000000, side: 'buy', exchange: 'OKX', timestamp: 1650991200000 },
    ],
    lastUpdated: "2023-04-26T15:00:00Z"
  }
];

const HyblockLiquidityMap: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("BTC-USD");
  const [viewMode, setViewMode] = useState<string>("heatmap");
  
  const selectedData = mockHyblockData.find(data => data.symbol === selectedSymbol);
  
  const getStrengthOpacity = (strength: number) => {
    return Math.max(0.3, strength);
  };
  
  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(1)}B`;
    } else if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    } else {
      return `$${volume.toFixed(0)}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hyblock Liquidity Map</CardTitle>
        <CardDescription>
          Visualize market depth and liquidity zones across major exchanges
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-48">
            <label className="text-sm font-medium mb-1 block">Symbol</label>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger>
                <SelectValue placeholder="Select pair" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC-USD">BTC/USD</SelectItem>
                <SelectItem value="ETH-USD">ETH/USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-48">
            <label className="text-sm font-medium mb-1 block">View</label>
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                <TabsTrigger value="largeOrders">Large Orders</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {selectedData ? (
          <div>
            <TabsContent value="heatmap" className="mt-0">
              <div className="space-y-4">
                {selectedData.liquidityZones
                  .sort((a, b) => b.price - a.price)
                  .map((zone, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-md flex items-center justify-between ${
                        zone.type === 'sell' 
                          ? `bg-red-500/10 border border-red-500/20` 
                          : `bg-green-500/10 border border-green-500/20`
                      }`}
                      style={{
                        opacity: getStrengthOpacity(zone.strength)
                      }}
                    >
                      <div className="flex items-center">
                        {zone.type === 'sell' ? (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                        )}
                        
                        <div>
                          <div className="font-medium">${zone.price.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {zone.exchanges.join(', ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium">{formatVolume(zone.volume)}</div>
                        <div className="text-xs">
                          Strength: {(zone.strength * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="largeOrders" className="mt-0">
              <div>
                <div className="grid grid-cols-5 font-medium text-sm border-b pb-2">
                  <div className="col-span-2">Price</div>
                  <div>Side</div>
                  <div>Size</div>
                  <div>Exchange</div>
                </div>
                
                <div className="space-y-2 mt-2">
                  {selectedData.largeOrders.map((order, index) => (
                    <div key={index} className="grid grid-cols-5 py-3 border-b border-border/30 last:border-0">
                      <div className="col-span-2 font-medium">${order.price.toLocaleString()}</div>
                      <div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          order.side === 'buy' 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {order.side.toUpperCase()}
                        </span>
                      </div>
                      <div>{formatVolume(order.size)}</div>
                      <div>{order.exchange}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-2">Liquidity Analysis</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  • Major support level at ${selectedData.liquidityZones.filter(z => z.type === 'buy')
                    .reduce((prev, current) => (prev.volume > current.volume) ? prev : current).price.toLocaleString()}
                </p>
                <p>
                  • Key resistance at ${selectedData.liquidityZones.filter(z => z.type === 'sell')
                    .reduce((prev, current) => (prev.volume > current.volume) ? prev : current).price.toLocaleString()}
                </p>
                <p>
                  • {selectedData.liquidityZones.filter(z => z.type === 'buy').length > 
                    selectedData.liquidityZones.filter(z => z.type === 'sell').length ? 
                    'Buy liquidity dominates the market' : 'Sell liquidity dominates the market'
                  }
                </p>
                <p>
                  • Total buy volume: {formatVolume(selectedData.liquidityZones
                    .filter(z => z.type === 'buy')
                    .reduce((sum, z) => sum + z.volume, 0))}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No liquidity data available for the selected symbol
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HyblockLiquidityMap;
