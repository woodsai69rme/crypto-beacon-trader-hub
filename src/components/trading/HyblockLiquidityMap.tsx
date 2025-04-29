
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Layers, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { HyblockLiquidityMapProps, HyblockLiquidityZone } from '@/types/trading';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const HyblockLiquidityMap: React.FC<HyblockLiquidityMapProps> = ({ currentPrice, symbol }) => {
  // Generate mock liquidity zones
  const generateLiquidityZones = (): HyblockLiquidityZone[] => {
    const basePrice = currentPrice;
    
    return [
      {
        id: 'zone-1',
        priceRange: { min: basePrice * 1.12, max: basePrice * 1.15 },
        volumeProfile: 8500000,
        strength: 'strong',
        type: 'resistance',
        timeframe: '1d',
        lastTested: '2023-04-12T14:28:00Z',
        breachCount: 0
      },
      {
        id: 'zone-2',
        priceRange: { min: basePrice * 1.05, max: basePrice * 1.07 },
        volumeProfile: 5200000,
        strength: 'medium',
        type: 'resistance',
        timeframe: '1d',
        lastTested: '2023-04-18T09:15:00Z',
        breachCount: 1
      },
      {
        id: 'zone-3',
        priceRange: { min: basePrice * 0.98, max: basePrice * 1.02 },
        volumeProfile: 12000000,
        strength: 'strong',
        type: 'neutral',
        timeframe: '1h',
        lastTested: '2023-04-22T16:45:00Z',
        breachCount: 8
      },
      {
        id: 'zone-4',
        priceRange: { min: basePrice * 0.94, max: basePrice * 0.96 },
        volumeProfile: 7800000,
        strength: 'medium',
        type: 'support',
        timeframe: '4h',
        lastTested: '2023-04-16T22:30:00Z',
        breachCount: 2
      },
      {
        id: 'zone-5',
        priceRange: { min: basePrice * 0.88, max: basePrice * 0.92 },
        volumeProfile: 9500000,
        strength: 'strong',
        type: 'support',
        timeframe: '1d',
        lastTested: '2023-04-08T10:15:00Z',
        breachCount: 0
      }
    ];
  };
  
  const liquidityZones = generateLiquidityZones();
  
  const formatPrice = (price: number) => {
    return price > 100 ? price.toFixed(2) : price.toFixed(price > 1 ? 2 : 6);
  };
  
  const getZoneColor = (zone: HyblockLiquidityZone) => {
    const type = zone.type;
    const strength = zone.strength;
    
    if (type === 'resistance') {
      if (strength === 'strong') return 'bg-red-500/20 border-red-500/30';
      return 'bg-red-400/10 border-red-400/20';
    }
    else if (type === 'support') {
      if (strength === 'strong') return 'bg-green-500/20 border-green-500/30';
      return 'bg-green-400/10 border-green-400/20';
    }
    return 'bg-blue-500/10 border-blue-500/20';
  };
  
  const getZoneTypeIcon = (type: string) => {
    if (type === 'resistance') return <ArrowUp className="h-4 w-4 text-red-500" />;
    if (type === 'support') return <ArrowDown className="h-4 w-4 text-green-500" />;
    return <TrendingUp className="h-4 w-4 text-blue-500" />;
  };
  
  const getZoneHeight = (zone: HyblockLiquidityZone) => {
    const volumeProfile = zone.volumeProfile;
    // Calculate height based on volume profile
    return Math.max(40, Math.min(80, 30 + volumeProfile / 200000));
  };

  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Hyblock Liquidity Map
            <span className="text-sm text-muted-foreground ml-1">{symbol}</span>
          </CardTitle>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Liquidity map shows areas of high trading activity and potential price reversal zones. Red areas are resistance, green are support.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="bg-muted/20 p-3 rounded-md mb-4">
          <div className="text-sm font-medium mb-1">Current Price</div>
          <div className="text-2xl font-bold">${formatPrice(currentPrice)}</div>
        </div>
          
        <div className="relative h-96 mt-6 border-l border-t border-border">
          {/* Y-axis price labels */}
          <div className="absolute -left-16 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
            {liquidityZones.map((zone, index) => (
              <div key={`price-${index}`} className="flex flex-col">
                <span>${formatPrice(zone.priceRange.max)}</span>
                <span>${formatPrice(zone.priceRange.min)}</span>
              </div>
            ))}
          </div>
          
          {/* Price line */}
          <div 
            className="absolute w-full border-t border-dashed border-primary z-10 flex justify-end"
            style={{ 
              top: `${liquidityZones.findIndex(z => 
                z.priceRange.min < currentPrice && z.priceRange.max > currentPrice
              ) * 20 + 10}%`
            }}
          >
            <div className="bg-primary px-2 py-1 rounded-sm text-xs -translate-y-1/2 mr-1">
              ${formatPrice(currentPrice)}
            </div>
          </div>
          
          {/* Liquidity zones */}
          {liquidityZones.map((zone, index) => {
            const top = index * 20;
            const height = getZoneHeight(zone);
            
            return (
              <div 
                key={zone.id}
                className={`absolute w-full left-0 ${getZoneColor(zone)} border rounded-sm p-2`}
                style={{ 
                  top: `${top}%`, 
                  height: `${height}px`
                }}
              >
                <div className="flex justify-between">
                  <div className="flex items-center space-x-1">
                    {getZoneTypeIcon(zone.type)}
                    <span className="text-xs font-medium">
                      {zone.type.charAt(0).toUpperCase() + zone.type.slice(1)}
                    </span>
                  </div>
                  <div className="text-xs opacity-70">
                    {zone.timeframe} | {zone.breachCount} tests
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
          <Layers className="h-3 w-3" />
          <span>Liquidity zones represent areas with high volume and potential price reversal points</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default HyblockLiquidityMap;
