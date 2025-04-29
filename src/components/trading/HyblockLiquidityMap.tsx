
import React, { useState, useMemo } from 'react';
import { HyblockLiquidityZone } from '@/types/trading';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface HyblockLiquidityMapProps {
  currentPrice: number;
  symbol: string;
  timeframe?: string;
}

const HyblockLiquidityMap: React.FC<HyblockLiquidityMapProps> = ({ 
  currentPrice, 
  symbol,
  timeframe = '1d'
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe);
  const [zoneTypes, setZoneTypes] = useState<string[]>(['support', 'resistance']);
  const [zoneStrengths, setZoneStrengths] = useState<string[]>(['weak', 'medium', 'strong']);
  
  // Generate mock liquidity zones
  const liquidityZones: HyblockLiquidityZone[] = useMemo(() => {
    const zones: HyblockLiquidityZone[] = [];
    
    // Support zones (below current price)
    for (let i = 0; i < 4; i++) {
      const minPrice = currentPrice * (0.85 - i * 0.05);
      const maxPrice = minPrice * 1.02;
      
      zones.push({
        id: `support-${i}`,
        priceRange: {
          min: minPrice,
          max: maxPrice
        },
        volumeProfile: 100 + Math.random() * 500,
        strength: ['weak', 'medium', 'strong'][Math.floor(Math.random() * 3)] as 'weak' | 'medium' | 'strong',
        type: 'support',
        timeframe: selectedTimeframe,
        lastTested: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
        breachCount: Math.floor(Math.random() * 5)
      });
    }
    
    // Resistance zones (above current price)
    for (let i = 0; i < 4; i++) {
      const minPrice = currentPrice * (1.05 + i * 0.05);
      const maxPrice = minPrice * 1.02;
      
      zones.push({
        id: `resistance-${i}`,
        priceRange: {
          min: minPrice,
          max: maxPrice
        },
        volumeProfile: 100 + Math.random() * 500,
        strength: ['weak', 'medium', 'strong'][Math.floor(Math.random() * 3)] as 'weak' | 'medium' | 'strong',
        type: 'resistance',
        timeframe: selectedTimeframe,
        lastTested: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
        breachCount: Math.floor(Math.random() * 5)
      });
    }
    
    return zones;
  }, [currentPrice, selectedTimeframe]);
  
  const filteredZones = liquidityZones.filter(zone => 
    zoneTypes.includes(zone.type) && 
    zoneStrengths.includes(zone.strength)
  );
  
  // Sort zones by distance from current price
  const sortedZones = [...filteredZones].sort((a, b) => {
    const aDist = Math.abs(currentPrice - (a.priceRange.min + a.priceRange.max) / 2);
    const bDist = Math.abs(currentPrice - (b.priceRange.min + b.priceRange.max) / 2);
    return aDist - bDist;
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  const getZoneColor = (zone: HyblockLiquidityZone) => {
    const strengthMultiplier = zone.strength === 'strong' ? 1 : zone.strength === 'medium' ? 0.7 : 0.4;
    
    if (zone.type === 'support') {
      return `rgba(0, 255, 0, ${strengthMultiplier * 0.3})`;
    } else {
      return `rgba(255, 0, 0, ${strengthMultiplier * 0.3})`;
    }
  };
  
  const getZoneStrength = (zone: HyblockLiquidityZone) => {
    const base = zone.volumeProfile * (
      zone.strength === 'strong' ? 1 : 
      zone.strength === 'medium' ? 0.7 : 
      0.4
    );
    
    const recencyFactor = zone.lastTested ? 
      Math.max(0.5, 1 - (Date.now() - new Date(zone.lastTested).getTime()) / (30 * 86400000)) : 
      0.5;
    
    const breachPenalty = zone.breachCount ? Math.max(0.5, 1 - zone.breachCount * 0.1) : 1;
    
    return base * recencyFactor * breachPenalty;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Liquidity Heatmap - {symbol}</CardTitle>
          <CardDescription>Visualizing key support and resistance zones</CardDescription>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15m">15 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="4h">4 Hours</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="1w">1 Week</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Understanding Liquidity Heatmaps</h4>
                <p className="text-sm text-muted-foreground">
                  Hyblock Liquidity Zones analyze historical price action and volume to identify areas where significant buying or selling pressure may exist.
                </p>
                <ul className="text-sm list-disc pl-4 space-y-1">
                  <li><span className="text-green-500 font-medium">Green zones</span> represent support areas</li>
                  <li><span className="text-red-500 font-medium">Red zones</span> represent resistance areas</li>
                  <li>Darker intensity indicates stronger zones</li>
                  <li>Strength is calculated based on volume profile, recency, and breach history</li>
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Zone Types</span>
            <ToggleGroup type="multiple" value={zoneTypes} onValueChange={v => v.length && setZoneTypes(v)}>
              <ToggleGroupItem value="support" className="text-xs">Support</ToggleGroupItem>
              <ToggleGroupItem value="resistance" className="text-xs">Resistance</ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Strength</span>
            <ToggleGroup type="multiple" value={zoneStrengths} onValueChange={v => v.length && setZoneStrengths(v)}>
              <ToggleGroupItem value="weak" className="text-xs">Weak</ToggleGroupItem>
              <ToggleGroupItem value="medium" className="text-xs">Medium</ToggleGroupItem>
              <ToggleGroupItem value="strong" className="text-xs">Strong</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        
        <div className="relative h-60 border border-border rounded-md overflow-hidden bg-muted/20">
          {/* Scale indicators */}
          <div className="absolute top-0 right-0 bottom-0 border-l border-border px-1 text-xs flex flex-col justify-between py-2">
            <div>{formatPrice(currentPrice * 1.25)}</div>
            <div>{formatPrice(currentPrice * 1.125)}</div>
            <div>{formatPrice(currentPrice)}</div>
            <div>{formatPrice(currentPrice * 0.875)}</div>
            <div>{formatPrice(currentPrice * 0.75)}</div>
          </div>
          
          {/* Current price indicator */}
          <div 
            className="absolute left-0 right-8 border-t border-dashed border-primary/70 z-20"
            style={{
              top: '50%',
            }}
          >
            <div className="absolute right-0 -top-3 bg-primary text-primary-foreground text-xs px-1 rounded">
              {formatPrice(currentPrice)}
            </div>
          </div>
          
          {/* Liquidity zones */}
          {sortedZones.map(zone => {
            const midPrice = (zone.priceRange.min + zone.priceRange.max) / 2;
            const positionPercent = 50 - ((midPrice - currentPrice) / (currentPrice * 0.5)) * 100;
            const height = ((zone.priceRange.max - zone.priceRange.min) / (currentPrice * 0.5)) * 100;
            const strengthWidth = Math.min(95, Math.max(20, getZoneStrength(zone) / 20));
            
            return (
              <div 
                key={zone.id}
                className="absolute left-0 border-l-4 pl-2 flex items-center"
                style={{
                  top: `${Math.max(0, Math.min(100, positionPercent - height/2))}%`,
                  height: `${Math.min(height, 100 - Math.max(0, positionPercent - height/2))}%`,
                  width: `${strengthWidth}%`,
                  backgroundColor: getZoneColor(zone),
                  borderLeftColor: zone.type === 'support' ? 'green' : 'red',
                }}
              >
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs">
                  <div className="font-medium">{formatPrice(midPrice)}</div>
                  <div className="text-[10px] opacity-80">{zone.strength}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Nearby Liquidity Zones</h4>
          <div className="space-y-1 text-sm">
            {sortedZones.slice(0, 4).map(zone => (
              <div key={zone.id} className="flex justify-between items-center border-b border-border pb-1">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${zone.type === 'support' ? 'bg-green-500' : 'bg-red-500'} opacity-${zone.strength === 'strong' ? '90' : zone.strength === 'medium' ? '60' : '30'} mr-2`}></div>
                  <div>
                    <span className={`font-medium ${zone.type === 'support' ? 'text-green-400' : 'text-red-400'}`}>
                      {zone.type.charAt(0).toUpperCase() + zone.type.slice(1)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">({zone.strength})</span>
                  </div>
                </div>
                <div>
                  ${formatPrice(zone.priceRange.min)} - ${formatPrice(zone.priceRange.max)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HyblockLiquidityMap;
