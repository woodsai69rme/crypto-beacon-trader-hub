
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Ruler, TrendingUp } from 'lucide-react';
import { FibonacciAnalysisProps, FibonacciLevels } from '@/types/trading';

const FibonacciAnalysis: React.FC<FibonacciAnalysisProps> = ({ priceData, symbol }) => {
  // Calculate fibonacci levels
  const calculateFibLevels = (): FibonacciLevels => {
    // Find price high and low points
    let high = -Infinity;
    let low = Infinity;
    
    priceData.forEach(data => {
      const price = typeof data.price === 'number' ? data.price : 
                   (data[1] || data.value || data.close || 0);
      
      if (price > high) high = price;
      if (price < low) low = price;
    });
    
    const diff = high - low;
    
    return {
      level0: low,                     // 0%
      level236: low + diff * 0.236,    // 23.6%
      level382: low + diff * 0.382,    // 38.2%
      level500: low + diff * 0.5,      // 50.0%
      level618: low + diff * 0.618,    // 61.8%
      level786: low + diff * 0.786,    // 78.6%
      level1000: high,                 // 100%
      level1618: high + diff * 0.618,  // 161.8%
      level2618: high + diff * 1.618,  // 261.8%
      level4236: high + diff * 3.236   // 423.6%
    };
  };
  
  const fibLevels = calculateFibLevels();
  const currentPrice = priceData.length > 0 ? 
    (priceData[priceData.length - 1].price || priceData[priceData.length - 1][1] || 0) : 0;

  const formatPrice = (price: number) => {
    return price > 100 ? price.toFixed(2) : price.toFixed(price > 1 ? 2 : 6);
  };
  
  const getDirectionalClass = (level: number) => {
    if (level > currentPrice) return "text-green-500";
    if (level < currentPrice) return "text-red-500";
    return "text-blue-500";
  };
  
  const getLevelStatus = (level: number) => {
    if (level > currentPrice) return "↑ Resistance";
    if (level < currentPrice) return "↓ Support";
    return "Current";
  };

  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Ruler className="h-5 w-5 text-primary" />
          Fibonacci Analysis <span className="text-sm text-muted-foreground ml-2">{symbol}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/20 p-3 rounded-md">
            <div className="text-sm font-medium mb-2">Current Price</div>
            <div className="text-2xl font-bold">${formatPrice(currentPrice)}</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Fibonacci Levels</div>
            
            <div className="grid gap-1">
              <div className={`p-2 rounded-md bg-muted/10 flex justify-between ${getDirectionalClass(fibLevels.level0)}`}>
                <div className="font-medium">0%</div>
                <div>${formatPrice(fibLevels.level0)}</div>
                <div className="text-xs opacity-70">{getLevelStatus(fibLevels.level0)}</div>
              </div>
              
              <div className={`p-2 rounded-md bg-muted/10 flex justify-between ${getDirectionalClass(fibLevels.level236)}`}>
                <div className="font-medium">23.6%</div>
                <div>${formatPrice(fibLevels.level236)}</div>
                <div className="text-xs opacity-70">{getLevelStatus(fibLevels.level236)}</div>
              </div>
              
              <div className={`p-2 rounded-md bg-muted/10 flex justify-between ${getDirectionalClass(fibLevels.level382)}`}>
                <div className="font-medium">38.2%</div>
                <div>${formatPrice(fibLevels.level382)}</div>
                <div className="text-xs opacity-70">{getLevelStatus(fibLevels.level382)}</div>
              </div>
              
              <div className={`p-2 rounded-md bg-muted/10 flex justify-between ${getDirectionalClass(fibLevels.level500)}`}>
                <div className="font-medium">50.0%</div>
                <div>${formatPrice(fibLevels.level500)}</div>
                <div className="text-xs opacity-70">{getLevelStatus(fibLevels.level500)}</div>
              </div>
              
              <div className={`p-2 rounded-md bg-muted/10 flex justify-between ${getDirectionalClass(fibLevels.level618)}`}>
                <div className="font-medium">61.8%</div>
                <div>${formatPrice(fibLevels.level618)}</div>
                <div className="text-xs opacity-70">{getLevelStatus(fibLevels.level618)}</div>
              </div>
              
              <div className={`p-2 rounded-md bg-muted/10 flex justify-between ${getDirectionalClass(fibLevels.level1000)}`}>
                <div className="font-medium">100.0%</div>
                <div>${formatPrice(fibLevels.level1000)}</div>
                <div className="text-xs opacity-70">{getLevelStatus(fibLevels.level1000)}</div>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>Fibonacci levels help identify potential support and resistance zones</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FibonacciAnalysis;
