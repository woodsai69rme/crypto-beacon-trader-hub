import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { HyblockLiquidityZone } from '@/components/trading/types';

const mockLiquidityZones: HyblockLiquidityZone[] = [
  { min: 57000, max: 58000, strength: 0.8, type: 'buy' },
  { min: 56200, max: 56800, strength: 0.6, type: 'buy' },
  { min: 54500, max: 55500, strength: 0.9, type: 'buy' },
  { min: 59000, max: 59800, strength: 0.7, type: 'sell' },
  { min: 60500, max: 61500, strength: 0.85, type: 'sell' },
  { min: 62000, max: 63000, strength: 0.95, type: 'sell' },
];

interface HyblockLiquidityMapProps {
  symbol?: string;
  timeframe?: string;
}

const HyblockLiquidityMap: React.FC<HyblockLiquidityMapProps> = ({
  symbol = "BTC/USD",
  timeframe = "1h"
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(symbol);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [liquidityZones, setLiquidityZones] = useState(mockLiquidityZones);
  const [currentPrice] = useState(58200);
  
  const getStrengthClass = (strength: number) => {
    if (strength >= 0.9) return 'bg-opacity-90';
    if (strength >= 0.7) return 'bg-opacity-70';
    if (strength >= 0.5) return 'bg-opacity-50';
    if (strength >= 0.3) return 'bg-opacity-30';
    return 'bg-opacity-20';
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Hyblock Liquidity Map</CardTitle>
        <CardDescription>
          Visualize high liquidity zones where large orders may impact price movement
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                <SelectItem value="SOL/USD">SOL/USD</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15m">15m</SelectItem>
                <SelectItem value="1h">1h</SelectItem>
                <SelectItem value="4h">4h</SelectItem>
                <SelectItem value="1d">1d</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium">Current Price</h3>
              <span className="font-mono">${currentPrice.toLocaleString()}</span>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="all">All Zones</TabsTrigger>
                <TabsTrigger value="buy">Buy Zones</TabsTrigger>
                <TabsTrigger value="sell">Sell Zones</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className="space-y-3">
                  {liquidityZones
                    .sort((a, b) => b.max - a.max)
                    .map((zone, index) => (
                      <div key={index} className="relative h-12">
                        <div 
                          className={`
                            absolute h-full rounded-md
                            ${zone.type === 'buy' ? 'bg-green-500' : 'bg-red-500'}
                            ${getStrengthClass(zone.strength)}
                          `}
                          style={{
                            left: '0',
                            right: '0',
                          }}
                        >
                          <div className="flex justify-between items-center h-full px-3">
                            <div className="flex items-center">
                              <Badge 
                                variant={zone.type === 'buy' ? 'outline' : 'destructive'}
                                className="mr-2 capitalize"
                              >
                                {zone.type}
                              </Badge>
                              <span className="text-xs">
                                Strength: {Math.round(zone.strength * 100)}%
                              </span>
                            </div>
                            <span className="font-mono text-xs">
                              ${zone.min.toLocaleString()} - ${zone.max.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </TabsContent>
              
              <TabsContent value="buy" className="mt-4">
                <div className="space-y-3">
                  {liquidityZones
                    .filter(zone => zone.type === 'buy')
                    .sort((a, b) => b.max - a.max)
                    .map((zone, index) => (
                      <div key={index} className="relative h-12">
                        <div
                          className={`absolute h-full rounded-md bg-green-500 ${getStrengthClass(zone.strength)}`}
                          style={{
                            left: '0',
                            right: '0',
                          }}
                        >
                          <div className="flex justify-between items-center h-full px-3">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2 capitalize">
                                {zone.type}
                              </Badge>
                              <span className="text-xs">
                                Strength: {Math.round(zone.strength * 100)}%
                              </span>
                            </div>
                            <span className="font-mono text-xs">
                              ${zone.min.toLocaleString()} - ${zone.max.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="sell" className="mt-4">
                <div className="space-y-3">
                  {liquidityZones
                    .filter(zone => zone.type === 'sell')
                    .sort((a, b) => b.max - a.max)
                    .map((zone, index) => (
                      <div key={index} className="relative h-12">
                        <div
                          className={`absolute h-full rounded-md bg-red-500 ${getStrengthClass(zone.strength)}`}
                          style={{
                            left: '0',
                            right: '0',
                          }}
                        >
                          <div className="flex justify-between items-center h-full px-3">
                            <div className="flex items-center">
                              <Badge variant="destructive" className="mr-2 capitalize">
                                {zone.type}
                              </Badge>
                              <span className="text-xs">
                                Strength: {Math.round(zone.strength * 100)}%
                              </span>
                            </div>
                            <span className="font-mono text-xs">
                              ${zone.min.toLocaleString()} - ${zone.max.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HyblockLiquidityMap;
