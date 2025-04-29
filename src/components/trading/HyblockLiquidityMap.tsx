
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { HyblockLiquidityZone, HyblockLiquidityMapProps } from "@/types/trading";

const HyblockLiquidityMap: React.FC<HyblockLiquidityMapProps> = ({
  currentPrice = 61745,
  symbol = "BTC"
}) => {
  const [timeframe, setTimeframe] = useState<string>("1d");
  const [liquidityZones, setLiquidityZones] = useState<HyblockLiquidityZone[]>([]);
  
  // Generate mock liquidity zones
  useEffect(() => {
    const generateMockZones = () => {
      // Create zones around the current price
      const zones: HyblockLiquidityZone[] = [
        {
          id: "1",
          priceRange: { min: currentPrice * 0.95, max: currentPrice * 0.97 },
          volumeProfile: 5600,
          strength: "strong",
          type: "support",
          timeframe: timeframe,
          lastTested: "2023-04-10T12:00:00Z",
          breachCount: 1
        },
        {
          id: "2",
          priceRange: { min: currentPrice * 0.98, max: currentPrice * 0.99 },
          volumeProfile: 3200,
          strength: "medium",
          type: "support",
          timeframe: timeframe,
          lastTested: "2023-04-15T14:30:00Z",
          breachCount: 0
        },
        {
          id: "3",
          priceRange: { min: currentPrice * 1.01, max: currentPrice * 1.02 },
          volumeProfile: 2800,
          strength: "medium",
          type: "resistance",
          timeframe: timeframe,
          lastTested: "2023-04-12T09:15:00Z",
          breachCount: 2
        },
        {
          id: "4",
          priceRange: { min: currentPrice * 1.04, max: currentPrice * 1.07 },
          volumeProfile: 7200,
          strength: "strong",
          type: "resistance",
          timeframe: timeframe,
          lastTested: "2023-03-28T16:45:00Z",
          breachCount: 0
        },
        {
          id: "5",
          priceRange: { min: currentPrice * 0.92, max: currentPrice * 0.94 },
          volumeProfile: 4100,
          strength: "medium",
          type: "support",
          timeframe: timeframe,
          lastTested: "2023-03-20T11:30:00Z",
          breachCount: 1
        },
        {
          id: "6",
          priceRange: { min: currentPrice * 0.86, max: currentPrice * 0.89 },
          volumeProfile: 8600,
          strength: "strong",
          type: "support",
          timeframe: timeframe,
          lastTested: "2023-02-15T10:20:00Z",
          breachCount: 0
        },
        {
          id: "7",
          priceRange: { min: currentPrice * 1.10, max: currentPrice * 1.15 },
          volumeProfile: 9200,
          strength: "strong",
          type: "resistance",
          timeframe: timeframe,
          lastTested: "2023-01-05T13:45:00Z",
          breachCount: 1
        }
      ];
      
      // Sort by price
      zones.sort((a, b) => a.priceRange.min - b.priceRange.min);
      
      setLiquidityZones(zones);
    };
    
    generateMockZones();
  }, [currentPrice, timeframe]);
  
  const getCurrentZone = () => {
    for (const zone of liquidityZones) {
      if (currentPrice >= zone.priceRange.min && currentPrice <= zone.priceRange.max) {
        return zone;
      }
    }
    return null;
  };
  
  const getNearestSupport = () => {
    // Filter support zones below current price
    const supportZones = liquidityZones
      .filter(zone => zone.type === "support" && zone.priceRange.max < currentPrice)
      .sort((a, b) => b.priceRange.max - a.priceRange.max);
      
    return supportZones.length > 0 ? supportZones[0] : null;
  };
  
  const getNearestResistance = () => {
    // Filter resistance zones above current price
    const resistanceZones = liquidityZones
      .filter(zone => zone.type === "resistance" && zone.priceRange.min > currentPrice)
      .sort((a, b) => a.priceRange.min - b.priceRange.min);
      
    return resistanceZones.length > 0 ? resistanceZones[0] : null;
  };
  
  const currentZone = getCurrentZone();
  const nearestSupport = getNearestSupport();
  const nearestResistance = getNearestResistance();
  
  const strengthColorMap = {
    weak: "bg-yellow-500/30",
    medium: "bg-amber-500/40",
    strong: "bg-red-500/50"
  };
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{symbol} Hyblock Liquidity Map</CardTitle>
            <CardDescription>
              Visualize liquidity zones and order clustering
            </CardDescription>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="4h">4 Hours</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="1w">1 Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/20 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Current Price</div>
            <div className="font-medium">${currentPrice.toLocaleString()}</div>
          </div>
          <div className="bg-muted/20 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Current Zone</div>
            <div className="font-medium">
              {currentZone ? (
                <Badge variant={currentZone.type === "support" ? "default" : "destructive"} className="font-normal">
                  {currentZone.type.charAt(0).toUpperCase() + currentZone.type.slice(1)}
                </Badge>
              ) : "None"}
            </div>
          </div>
          <div className="bg-muted/20 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Zone Strength</div>
            <div className="font-medium">
              {currentZone ? (
                <Badge variant="outline" className="font-normal">
                  {currentZone.strength.charAt(0).toUpperCase() + currentZone.strength.slice(1)}
                </Badge>
              ) : "N/A"}
            </div>
          </div>
        </div>
        
        <div className="h-60 relative border border-border rounded-md">
          {/* Liquidity Heatmap Visualization */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {/* Price Scale */}
            <div className="absolute top-0 right-0 bottom-0 w-12 flex flex-col justify-between py-2 text-xs text-right pr-1">
              {[...Array(6)].map((_, index) => {
                const maxPrice = Math.max(...liquidityZones.map(z => z.priceRange.max));
                const minPrice = Math.min(...liquidityZones.map(z => z.priceRange.min));
                const range = maxPrice - minPrice;
                const price = maxPrice - (range * (index / 5));
                
                return <div key={index}>${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>;
              })}
            </div>
            
            {/* Liquidity Zones */}
            <div className="absolute left-1 right-14 top-0 bottom-0">
              {liquidityZones.map(zone => {
                const maxPrice = Math.max(...liquidityZones.map(z => z.priceRange.max));
                const minPrice = Math.min(...liquidityZones.map(z => z.priceRange.min));
                const range = maxPrice - minPrice;
                
                const topPos = ((maxPrice - zone.priceRange.max) / range) * 100;
                const heightPercentage = ((zone.priceRange.max - zone.priceRange.min) / range) * 100;
                
                const width = Math.min(90, (zone.volumeProfile / 10000) * 100) + 10;
                
                return (
                  <div 
                    key={zone.id}
                    className={`absolute left-0 ${
                      zone.type === "support" ? "bg-green-500/30" : "bg-red-500/30"
                    } ${strengthColorMap[zone.strength]}`}
                    style={{
                      top: `${topPos}%`,
                      height: `${heightPercentage}%`,
                      width: `${width}%`,
                      borderLeft: `3px solid ${zone.type === "support" ? "#10b981" : "#ef4444"}`
                    }}
                  >
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 text-xs">
                      {zone.type === "support" ? "S" : "R"}
                    </div>
                  </div>
                );
              })}
              
              {/* Current Price Line */}
              <div 
                className="absolute left-0 right-0 border-t border-orange-500 z-10"
                style={{
                  top: `${((Math.max(...liquidityZones.map(z => z.priceRange.max)) - currentPrice) / 
                    (Math.max(...liquidityZones.map(z => z.priceRange.max)) - Math.min(...liquidityZones.map(z => z.priceRange.min)))) * 100}%`
                }}
              >
                <div className="absolute -top-3 -right-12 text-xs bg-orange-500/20 text-orange-500 px-1 rounded">
                  Current
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Nearest Support</h3>
            {nearestSupport ? (
              <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-md space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Price Range</span>
                  <span>${nearestSupport.priceRange.min.toLocaleString()} - ${nearestSupport.priceRange.max.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Strength</span>
                  <span className="capitalize">{nearestSupport.strength}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Distance</span>
                  <span>{(((currentPrice - nearestSupport.priceRange.max) / currentPrice) * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Last Tested</span>
                  <span>{new Date(nearestSupport.lastTested || '').toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              <div className="bg-muted/20 p-3 rounded-md text-sm">No support zones found below current price.</div>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Nearest Resistance</h3>
            {nearestResistance ? (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-md space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Price Range</span>
                  <span>${nearestResistance.priceRange.min.toLocaleString()} - ${nearestResistance.priceRange.max.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Strength</span>
                  <span className="capitalize">{nearestResistance.strength}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Distance</span>
                  <span>{(((nearestResistance.priceRange.min - currentPrice) / currentPrice) * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Breach Count</span>
                  <span>{nearestResistance.breachCount}</span>
                </div>
              </div>
            ) : (
              <div className="bg-muted/20 p-3 rounded-md text-sm">No resistance zones found above current price.</div>
            )}
          </div>
        </div>
        
        <div className="p-3 bg-muted/20 rounded-md">
          <h3 className="text-sm font-medium mb-1">Analysis</h3>
          <p className="text-xs">
            {currentZone ? (
              currentZone.type === "support" ? 
                `${symbol} is currently trading within a ${currentZone.strength} support zone. This suggests potential accumulation before the next move. 
                Watch for a break below $${currentZone.priceRange.min.toLocaleString()} which could trigger a move down to the next support at 
                $${nearestSupport ? nearestSupport.priceRange.max.toLocaleString() : 'unknown'}.` :
                
                `${symbol} is currently trading within a ${currentZone.strength} resistance zone. This suggests potential distribution and selling pressure. 
                Watch for a break above $${currentZone.priceRange.max.toLocaleString()} which could trigger a move up to the next resistance at 
                $${nearestResistance ? nearestResistance.priceRange.min.toLocaleString() : 'unknown'}.`
            ) : (
              `${symbol} is currently trading between liquidity zones. The nearest support is at 
              $${nearestSupport ? nearestSupport.priceRange.max.toLocaleString() : 'unknown'} and the nearest resistance is at 
              $${nearestResistance ? nearestResistance.priceRange.min.toLocaleString() : 'unknown'}. Watch these levels for potential reactions.`
            )}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500/30 mr-1"></div>
            <span className="text-xs">Support</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500/30 mr-1"></div>
            <span className="text-xs">Resistance</span>
          </div>
          <div className="flex items-center ml-2">
            <span className="text-xs">Darker color = Stronger zone</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HyblockLiquidityMap;
