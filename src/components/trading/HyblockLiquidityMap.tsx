
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HyblockMarketData } from '@/types/trading';
import { LineChart, ChevronRight, Layers, AlertTriangle } from 'lucide-react';

// Mock data for Hyblock Liquidity Map
const mockLiquidityData: HyblockMarketData[] = [
  {
    symbol: "BTCUSD",
    liquidityZones: [
      { price: 91500, volume: 124500000, type: 'sell', strength: 0.9, exchanges: ['Binance', 'OKX', 'Bybit'] },
      { price: 90800, volume: 98600000, type: 'sell', strength: 0.75, exchanges: ['Binance', 'OKX'] },
      { price: 89500, volume: 156000000, type: 'sell', strength: 0.85, exchanges: ['Binance', 'OKX', 'Coinbase'] },
      { price: 87500, volume: 245800000, type: 'buy', strength: 0.7, exchanges: ['Binance'] },
      { price: 86200, volume: 378500000, type: 'buy', strength: 0.95, exchanges: ['Binance', 'OKX', 'Bybit', 'Coinbase'] },
      { price: 85000, volume: 287400000, type: 'buy', strength: 0.88, exchanges: ['Binance', 'Bybit'] },
    ],
    largeOrders: [
      { price: 91500, size: 45000000, side: 'sell', exchange: 'Binance', timestamp: Date.now() - 1000 * 60 * 15 },
      { price: 86200, size: 78000000, side: 'buy', exchange: 'Coinbase', timestamp: Date.now() - 1000 * 60 * 8 },
      { price: 90800, size: 32500000, side: 'sell', exchange: 'OKX', timestamp: Date.now() - 1000 * 60 * 5 },
    ],
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "ETHUSD",
    liquidityZones: [
      { price: 3450, volume: 45800000, type: 'sell', strength: 0.8, exchanges: ['Binance', 'OKX'] },
      { price: 3380, volume: 32600000, type: 'sell', strength: 0.65, exchanges: ['Binance'] },
      { price: 3250, volume: 54900000, type: 'sell', strength: 0.75, exchanges: ['Binance', 'OKX', 'Coinbase'] },
      { price: 3100, volume: 78500000, type: 'buy', strength: 0.85, exchanges: ['Binance', 'OKX'] },
      { price: 3050, volume: 105800000, type: 'buy', strength: 0.92, exchanges: ['Binance', 'OKX', 'Bybit'] },
      { price: 2950, volume: 89700000, type: 'buy', strength: 0.78, exchanges: ['Binance', 'Coinbase'] },
    ],
    largeOrders: [
      { price: 3450, size: 12500000, side: 'sell', exchange: 'Binance', timestamp: Date.now() - 1000 * 60 * 22 },
      { price: 3050, size: 28900000, side: 'buy', exchange: 'OKX', timestamp: Date.now() - 1000 * 60 * 12 },
    ],
    lastUpdated: new Date().toISOString(),
  }
];

const HyblockLiquidityMap: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("BTCUSD");
  
  const currentData = mockLiquidityData.find(data => data.symbol === selectedSymbol);
  
  const getLiquidityZoneColor = (type: 'buy' | 'sell', strength: number) => {
    if (type === 'buy') {
      if (strength > 0.8) return 'bg-green-600/20 border-green-600 text-green-600';
      if (strength > 0.6) return 'bg-green-500/20 border-green-500 text-green-500';
      return 'bg-green-400/20 border-green-400 text-green-400';
    } else {
      if (strength > 0.8) return 'bg-red-600/20 border-red-600 text-red-600';
      if (strength > 0.6) return 'bg-red-500/20 border-red-500 text-red-500';
      return 'bg-red-400/20 border-red-400 text-red-400';
    }
  };
  
  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) return `$${(volume / 1000000000).toFixed(1)}B`;
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`;
    return `$${volume}`;
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Layers className="mr-2 h-5 w-5" />
              Hyblock Liquidity Map
            </CardTitle>
            <CardDescription>
              Real-time visualization of market liquidity zones and whale orders
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTCUSD">BTC/USD</SelectItem>
                <SelectItem value="ETHUSD">ETH/USD</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <LineChart className="h-4 w-4 mr-1" /> Compare
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">Last updated: {new Date(currentData?.lastUpdated || Date.now()).toLocaleTimeString()}</Badge>
          <Badge variant="secondary" className="bg-green-500/10 text-green-500">Buy Zones: {currentData?.liquidityZones.filter(zone => zone.type === 'buy').length || 0}</Badge>
          <Badge variant="secondary" className="bg-red-500/10 text-red-500">Sell Zones: {currentData?.liquidityZones.filter(zone => zone.type === 'sell').length || 0}</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="relative mb-6">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-muted"></div>
          
          <div className="relative flex flex-col h-[300px] justify-center">
            {/* Current price indicator */}
            <div className="absolute left-0 w-full py-1 border-y border-muted-foreground/30 flex justify-between">
              <Badge className="bg-blue-500/10 text-blue-500 ml-1">Current Price</Badge>
              <span className="font-medium text-sm mr-2">
                {selectedSymbol === "BTCUSD" ? "$87,950" : "$3,195"}
              </span>
            </div>
            
            {/* Liquidity zones */}
            {currentData?.liquidityZones
              .sort((a, b) => b.price - a.price)
              .map((zone, index) => {
                const position = zone.type === 'sell' ? 
                  `top: ${20 + (index * 15)}%` : 
                  `bottom: ${20 + ((currentData.liquidityZones.filter(z => z.type === 'buy').indexOf(zone)) * 15)}%`;
                
                const width = `${Math.min(100, Math.max(40, (zone.volume / 1000000)))}%`;
                const zoneColor = getLiquidityZoneColor(zone.type, zone.strength);
                
                return (
                  <div 
                    key={`${zone.price}-${index}`}
                    className={`absolute left-0 ${zone.type === 'buy' ? 'flex-row-reverse' : 'flex'} flex items-center w-full`}
                    style={{ [zone.type === 'sell' ? 'top' : 'bottom']: `${(index % 5) * 15 + 15}%` }}
                  >
                    <div className={`flex-1 ${zone.type === 'sell' ? 'text-right' : 'text-left'} px-2`}>
                      <div className="font-medium">${zone.price.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{formatVolume(zone.volume)}</div>
                    </div>
                    
                    <div 
                      className={`h-8 border rounded-md flex items-center justify-center relative ${zoneColor}`}
                      style={{ width }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                        {zone.type === 'buy' ? 'BUY' : 'SELL'} ZONE
                      </div>
                      {zone.strength > 0.85 && (
                        <AlertTriangle className="absolute right-2 h-3 w-3" />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Large Orders (Whales)</h3>
          
          <div className="space-y-2">
            {currentData?.largeOrders.map((order, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <div className="font-medium">
                    <span className={order.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                      {order.side.toUpperCase()}
                    </span>
                    {' '}${order.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatVolume(order.size)} on {order.exchange}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(order.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-muted/30 p-3 rounded-md mt-4">
            <h4 className="font-medium mb-1">Market Analysis</h4>
            <div className="text-sm space-y-2">
              <p className="flex items-start">
                <ChevronRight className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                <span>Strong buy wall detected at ${selectedSymbol === "BTCUSD" ? "86,200" : "3,050"} with high volume support</span>
              </p>
              <p className="flex items-start">
                <ChevronRight className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                <span>Multiple exchange participation indicates institutional interest</span>
              </p>
              <p className="flex items-start">
                <ChevronRight className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                <span>Market likely to test ${selectedSymbol === "BTCUSD" ? "91,500" : "3,450"} resistance before potential breakout</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HyblockLiquidityMap;
