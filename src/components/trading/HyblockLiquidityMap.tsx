
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, BarChart3, AlertCircle, RefreshCw, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HyblockLiquidityMapProps } from "./types";

interface LiquidityZone {
  min: number;
  max: number;
  strength: number;
  type: 'buy' | 'sell';
}

const HyblockLiquidityMap: React.FC<HyblockLiquidityMapProps> = ({
  coinId = "bitcoin",
  timeframe = "1D",
  symbol = "BTC/USD"
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(symbol);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [isLoading, setIsLoading] = useState(false);
  
  const liquidityZones: LiquidityZone[] = [
    { min: 67000, max: 68500, strength: 85, type: 'sell' },
    { min: 64200, max: 65000, strength: 65, type: 'sell' },
    { min: 62000, max: 62800, strength: 45, type: 'buy' },
    { min: 58500, max: 60000, strength: 90, type: 'buy' },
    { min: 55000, max: 56000, strength: 70, type: 'buy' },
  ];
  
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  const currentPrice = 61800;
  const nearestBuyZone = liquidityZones.filter(zone => zone.type === 'buy')
    .sort((a, b) => Math.abs(currentPrice - (a.min + a.max)/2) - Math.abs(currentPrice - (b.min + b.max)/2))[0];
  
  const nearestSellZone = liquidityZones.filter(zone => zone.type === 'sell')
    .sort((a, b) => Math.abs(currentPrice - (a.min + a.max)/2) - Math.abs(currentPrice - (b.min + b.max)/2))[0];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Hyblock Liquidity Map
            </CardTitle>
            <CardDescription>
              Visualize buy and sell liquidity zones to identify key market levels
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Liquidity maps show where significant buy and sell orders are clustered.
                  These are potential support and resistance zones where price may react.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm font-medium mb-2">Symbol</div>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                <SelectItem value="SOL/USD">SOL/USD</SelectItem>
                <SelectItem value="ADA/USD">ADA/USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm font-medium mb-2">Timeframe</div>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1H">1 Hour</SelectItem>
                <SelectItem value="4H">4 Hours</SelectItem>
                <SelectItem value="1D">1 Day</SelectItem>
                <SelectItem value="1W">1 Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm font-medium mb-2">Actions</div>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={isLoading}
              onClick={handleRefresh}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh Map'}
            </Button>
          </div>
        </div>
        
        <div className="h-80 border rounded-lg p-4 relative">
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            {liquidityZones.map((zone, index) => {
              const topPosition = 100 - (((zone.max - 55000) / (68500 - 55000)) * 100);
              const height = ((zone.max - zone.min) / (68500 - 55000)) * 100;
              
              return (
                <div 
                  key={index}
                  className={`absolute left-0 right-[20%] rounded-r-md ${
                    zone.type === 'buy' ? 'bg-green-500/20 border-l-4 border-green-500' : 
                    'bg-red-500/20 border-l-4 border-red-500'
                  }`}
                  style={{
                    top: `${topPosition}%`, 
                    height: `${height}%`,
                    opacity: zone.strength / 100
                  }}
                >
                  <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 -translate-x-full text-xs">
                    ${zone.max.toLocaleString()}
                  </div>
                  <div className="h-full flex items-center px-2">
                    <div className="text-xs font-medium">
                      {zone.type === 'buy' ? 'BUY' : 'SELL'} Zone ({zone.strength}% strength)
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Current price marker */}
            <div 
              className="absolute left-0 right-0 border-t-2 border-blue-500 border-dashed flex items-center justify-end"
              style={{
                top: `${100 - (((currentPrice - 55000) / (68500 - 55000)) * 100)}%`,
              }}
            >
              <div className="bg-blue-500 text-white text-xs py-1 px-2 rounded-md">
                Current: ${currentPrice.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="absolute right-0 top-0 bottom-0 w-[20%] flex flex-col justify-between p-4">
            <div className="bg-red-500/20 rounded-md p-2 text-center text-xs font-medium">
              High Sell Pressure
            </div>
            <div className="bg-gradient-to-b from-red-500/20 to-green-500/20 h-3/5 rounded-md"></div>
            <div className="bg-green-500/20 rounded-md p-2 text-center text-xs font-medium">
              High Buy Support
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-md border overflow-hidden">
            <div className="bg-muted/50 p-2 text-xs font-medium">Buy Liquidity Zones</div>
            <div className="divide-y">
              {liquidityZones.filter(zone => zone.type === 'buy').map((zone, index) => (
                <div key={`buy-${index}`} className="p-2 grid grid-cols-3 text-sm">
                  <div>${zone.min.toLocaleString()} - ${zone.max.toLocaleString()}</div>
                  <div className="flex items-center gap-1">
                    <span className={`inline-block w-3 h-3 rounded-full ${
                      zone.strength > 80 ? 'bg-green-500' : 
                      zone.strength > 50 ? 'bg-green-400' : 'bg-green-300'
                    }`}></span>
                    <span>{zone.strength}%</span>
                  </div>
                  <div className="text-right">
                    {currentPrice > zone.max 
                      ? `${(currentPrice - zone.max).toLocaleString()} below` 
                      : currentPrice < zone.min
                      ? `${(zone.min - currentPrice).toLocaleString()} above`
                      : 'CURRENT'
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <div className="bg-muted/50 p-2 text-xs font-medium">Sell Liquidity Zones</div>
            <div className="divide-y">
              {liquidityZones.filter(zone => zone.type === 'sell').map((zone, index) => (
                <div key={`sell-${index}`} className="p-2 grid grid-cols-3 text-sm">
                  <div>${zone.min.toLocaleString()} - ${zone.max.toLocaleString()}</div>
                  <div className="flex items-center gap-1">
                    <span className={`inline-block w-3 h-3 rounded-full ${
                      zone.strength > 80 ? 'bg-red-500' : 
                      zone.strength > 50 ? 'bg-red-400' : 'bg-red-300'
                    }`}></span>
                    <span>{zone.strength}%</span>
                  </div>
                  <div className="text-right">
                    {currentPrice > zone.max 
                      ? `${(currentPrice - zone.max).toLocaleString()} below` 
                      : currentPrice < zone.min
                      ? `${(zone.min - currentPrice).toLocaleString()} above`
                      : 'CURRENT'
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Price is approaching a {nearestBuyZone.strength}% strength buy zone at ${nearestBuyZone.min.toLocaleString()}-${nearestBuyZone.max.toLocaleString()}. 
            Next significant sell zone at ${nearestSellZone.min.toLocaleString()}-${nearestSellZone.max.toLocaleString()}.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default HyblockLiquidityMap;
