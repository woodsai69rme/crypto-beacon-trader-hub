
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FibonacciLevels } from '@/types/trading';
import { ChevronRight, LineChart, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for Fibonacci Analysis
const mockFibonacciData: FibonacciLevels[] = [
  {
    coin: "bitcoin",
    timeframe: "1d",
    levels: [
      { extension: 0, price: 93000, significance: 'strong' },
      { extension: 0.236, price: 89500, significance: 'medium' },
      { extension: 0.382, price: 87200, significance: 'medium' },
      { extension: 0.5, price: 85500, significance: 'strong' },
      { extension: 0.618, price: 84100, significance: 'strong' },
      { extension: 0.786, price: 82300, significance: 'medium' },
      { extension: 1, price: 80000, significance: 'strong' },
      { extension: 1.618, price: 75000, significance: 'medium' },
      { extension: 2.618, price: 68000, significance: 'weak' },
    ],
    lastCalculated: "2023-04-26T14:00:00Z"
  },
  {
    coin: "ethereum",
    timeframe: "1d",
    levels: [
      { extension: 0, price: 3800, significance: 'strong' },
      { extension: 0.236, price: 3650, significance: 'medium' },
      { extension: 0.382, price: 3550, significance: 'medium' },
      { extension: 0.5, price: 3480, significance: 'strong' },
      { extension: 0.618, price: 3410, significance: 'strong' },
      { extension: 0.786, price: 3320, significance: 'medium' },
      { extension: 1, price: 3200, significance: 'strong' },
      { extension: 1.618, price: 2950, significance: 'medium' },
      { extension: 2.618, price: 2600, significance: 'weak' },
    ],
    lastCalculated: "2023-04-26T14:00:00Z"
  },
  {
    coin: "solana",
    timeframe: "1d",
    levels: [
      { extension: 0, price: 185, significance: 'strong' },
      { extension: 0.236, price: 172, significance: 'medium' },
      { extension: 0.382, price: 165, significance: 'medium' },
      { extension: 0.5, price: 159, significance: 'strong' },
      { extension: 0.618, price: 154, significance: 'strong' },
      { extension: 0.786, price: 148, significance: 'medium' },
      { extension: 1, price: 140, significance: 'strong' },
      { extension: 1.618, price: 124, significance: 'medium' },
      { extension: 2.618, price: 98, significance: 'weak' },
    ],
    lastCalculated: "2023-04-26T14:00:00Z"
  }
];

const FibonacciAnalysis: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1d");
  const [activeTab, setActiveTab] = useState<string>("retracement");
  
  const selectedData = mockFibonacciData.find(data => data.coin === selectedCoin);
  
  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'strong': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'weak': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return '';
    }
  };
  
  // Current market price
  const getCurrentPrice = () => {
    switch (selectedCoin) {
      case 'bitcoin': return 86500;
      case 'ethereum': return 3450;
      case 'solana': return 156;
      default: return 0;
    }
  };
  
  // Find the nearest levels
  const getNearestLevels = () => {
    if (!selectedData) return { support: null, resistance: null };
    
    const currentPrice = getCurrentPrice();
    const sortedLevels = [...selectedData.levels].sort((a, b) => a.price - b.price);
    
    let support = null;
    let resistance = null;
    
    for (let i = 0; i < sortedLevels.length; i++) {
      if (sortedLevels[i].price < currentPrice) {
        support = sortedLevels[i];
      } else if (sortedLevels[i].price > currentPrice && !resistance) {
        resistance = sortedLevels[i];
        break;
      }
    }
    
    return { support, resistance };
  };
  
  const { support, resistance } = getNearestLevels();
  const currentPrice = getCurrentPrice();
  
  // Calculate percentage from current price to nearest levels
  const getPercentToLevel = (level: number) => {
    const diff = ((level - currentPrice) / currentPrice) * 100;
    return diff > 0 ? `+${diff.toFixed(2)}%` : `${diff.toFixed(2)}%`;
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              Fibonacci Analysis
            </CardTitle>
            <CardDescription>
              Automatic Fibonacci retracement and extension levels for price action analysis
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="cardano">Cardano</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15m">15 Minutes</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="retracement">Retracement Levels</TabsTrigger>
            <TabsTrigger value="extension">Extension Levels</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-muted-foreground text-sm">Current Price:</span>
            <span className="font-bold text-lg ml-2">${currentPrice.toLocaleString()}</span>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline">Auto-calculated</Badge>
            <Badge variant="secondary">Last swing: High to Low</Badge>
          </div>
        </div>
        
        {selectedData ? (
          <div className="relative">
            {/* Visual representation of levels */}
            <div className="relative h-[400px] mb-6 border rounded-md overflow-hidden">
              {/* Price line */}
              <div className="absolute left-0 w-full border-t border-dashed border-blue-500 flex justify-between items-center py-1 px-2" style={{ top: '50%' }}>
                <Badge className="bg-blue-500">${currentPrice.toLocaleString()}</Badge>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Current Price</Badge>
              </div>
              
              {/* Fibonacci levels - visually positioned */}
              {selectedData.levels.map((level, index) => {
                // Calculate position based on price relative to min/max
                const maxPrice = Math.max(...selectedData.levels.map(l => l.price));
                const minPrice = Math.min(...selectedData.levels.map(l => l.price));
                const range = maxPrice - minPrice;
                const position = ((maxPrice - level.price) / range) * 100;
                
                // Skip extremes for visual clarity
                if (position < 5 || position > 95) return null;
                
                const isCurrentLevelNearPrice = Math.abs(level.price - currentPrice) / currentPrice < 0.02;
                
                return (
                  <div
                    key={index}
                    className={`absolute left-0 w-full border-t ${isCurrentLevelNearPrice ? 'border-yellow-500 border-dashed' : 'border-muted-foreground/30'} flex justify-between items-center py-1 px-2`}
                    style={{ top: `${position}%` }}
                  >
                    <Badge 
                      className={`${isCurrentLevelNearPrice ? 'bg-yellow-500' : 'bg-muted/70'} ${getSignificanceColor(level.significance)}`}
                    >
                      {level.extension} ({level.significance})
                    </Badge>
                    <Badge variant="outline">${level.price.toLocaleString()}</Badge>
                  </div>
                );
              })}
            </div>
            
            <div className="grid grid-cols-3 font-medium text-sm border-b pb-2">
              <div>Fibonacci Level</div>
              <div>Price</div>
              <div>Significance</div>
            </div>
            
            <div className="space-y-0 mt-2">
              {selectedData.levels.map((level, index) => (
                <div 
                  key={index} 
                  className={`grid grid-cols-3 items-center py-2 border-b border-border/30 last:border-0 ${level.price === currentPrice ? 'bg-muted/50' : ''}`}
                >
                  <div>{level.extension}</div>
                  <div className="flex items-center">
                    ${level.price.toLocaleString()}
                    {level.price !== currentPrice && (
                      <span className={`text-xs ml-2 ${level.price > currentPrice ? 'text-green-500' : 'text-red-500'}`}>
                        {getPercentToLevel(level.price)}
                      </span>
                    )}
                  </div>
                  <div>
                    <Badge variant="secondary" className={`${getSignificanceColor(level.significance)}`}>
                      {level.significance.charAt(0).toUpperCase() + level.significance.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-2">Analyzing {selectedCoin.charAt(0).toUpperCase() + selectedCoin.slice(1)}</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="flex items-start">
                  <ChevronRight className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                  <span>
                    Current price at ${currentPrice.toLocaleString()} is 
                    {support && resistance ? 
                      ` between the ${support.extension} (${support.price.toLocaleString()}) and ${resistance.extension} (${resistance.price.toLocaleString()}) levels` :
                      ' outside the calculated Fibonacci range'
                    }
                  </span>
                </p>
                
                {support && (
                  <p className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                    <span>Strong support identified at ${support.price.toLocaleString()} ({support.extension} Fibonacci level)</span>
                  </p>
                )}
                
                {resistance && (
                  <p className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                    <span>Key resistance at ${resistance.price.toLocaleString()} ({resistance.extension} Fibonacci level)</span>
                  </p>
                )}
                
                <p className="flex items-start">
                  <ChevronRight className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                  <span>
                    If price breaks above ${selectedData.levels.find(l => l.extension === 0)?.price.toLocaleString()}, 
                    potential target is ${selectedData.levels.find(l => l.extension === 1.618)?.price.toLocaleString()}
                  </span>
                </p>
                
                <p className="flex items-start">
                  <ChevronRight className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                  <span>The 0.618 level at ${selectedData.levels.find(l => l.extension === 0.618)?.price.toLocaleString()} is historically the most reliable support/resistance</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No Fibonacci data available for the selected cryptocurrency and timeframe
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FibonacciAnalysis;
