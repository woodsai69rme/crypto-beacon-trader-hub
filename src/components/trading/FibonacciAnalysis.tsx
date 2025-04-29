
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FibonacciLevels, FibonacciAnalysisProps } from "@/types/trading";

// Sample price data for demonstration purposes
const samplePriceData = [
  { time: "2023-01-01", price: 16500 },
  { time: "2023-01-15", price: 17200 },
  { time: "2023-02-01", price: 19800 },
  { time: "2023-02-15", price: 24500 },
  { time: "2023-03-01", price: 23400 },
  { time: "2023-03-15", price: 25100 },
  { time: "2023-04-01", price: 28200 },
  { time: "2023-04-15", price: 30100 },
  { time: "2023-05-01", price: 29400 },
  { time: "2023-05-15", price: 27800 },
  { time: "2023-06-01", price: 30500 },
  { time: "2023-06-15", price: 29900 },
  { time: "2023-07-01", price: 31200 },
  { time: "2023-07-15", price: 34500 },
  { time: "2023-08-01", price: 43000 },
];

const FibonacciAnalysis: React.FC<FibonacciAnalysisProps> = ({
  priceData = samplePriceData,
  symbol = "BTC"
}) => {
  const [timeframe, setTimeframe] = useState<string>("1d");
  const [fibLevels, setFibLevels] = useState<FibonacciLevels>({
    level0: 0,
    level236: 0,
    level382: 0,
    level500: 0,
    level618: 0,
    level786: 0,
    level1000: 0, 
    level1618: 0,
    level2618: 0,
    level4236: 0
  });
  
  const [highPrice, setHighPrice] = useState<number>(0);
  const [lowPrice, setLowPrice] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [trend, setTrend] = useState<"uptrend" | "downtrend">("uptrend");
  
  useEffect(() => {
    if (priceData && priceData.length > 0) {
      // Find high and low in the price range
      let high = -Infinity;
      let low = Infinity;
      
      priceData.forEach(data => {
        const price = typeof data === 'object' && 'price' in data ? data.price : +data;
        high = Math.max(high, price);
        low = Math.min(low, price);
      });
      
      // Set current price to the most recent price
      const lastDataPoint = priceData[priceData.length - 1];
      const lastPrice = typeof lastDataPoint === 'object' && 'price' in lastDataPoint 
        ? lastDataPoint.price 
        : +lastDataPoint;
        
      setHighPrice(high);
      setLowPrice(low);
      setCurrentPrice(lastPrice);
      
      // Determine trend (simplified)
      const midPoint = priceData.length / 2;
      const firstHalfAvg = priceData.slice(0, midPoint).reduce((sum, data) => {
        const price = typeof data === 'object' && 'price' in data ? data.price : +data;
        return sum + price;
      }, 0) / midPoint;
      
      const secondHalfAvg = priceData.slice(midPoint).reduce((sum, data) => {
        const price = typeof data === 'object' && 'price' in data ? data.price : +data;
        return sum + price;
      }, 0) / (priceData.length - midPoint);
      
      setTrend(secondHalfAvg > firstHalfAvg ? "uptrend" : "downtrend");
      
      // Calculate Fibonacci levels
      const diff = high - low;
      setFibLevels({
        level0: trend === "uptrend" ? low : high,
        level236: trend === "uptrend" ? low + (diff * 0.236) : high - (diff * 0.236),
        level382: trend === "uptrend" ? low + (diff * 0.382) : high - (diff * 0.382),
        level500: trend === "uptrend" ? low + (diff * 0.5) : high - (diff * 0.5),
        level618: trend === "uptrend" ? low + (diff * 0.618) : high - (diff * 0.618),
        level786: trend === "uptrend" ? low + (diff * 0.786) : high - (diff * 0.786),
        level1000: trend === "uptrend" ? high : low,
        level1618: trend === "uptrend" ? low + (diff * 1.618) : high - (diff * 1.618),
        level2618: trend === "uptrend" ? low + (diff * 2.618) : high - (diff * 2.618),
        level4236: trend === "uptrend" ? low + (diff * 4.236) : high - (diff * 4.236)
      });
    }
  }, [priceData, trend]);
  
  // Find closest Fibonacci level to current price
  const getClosestLevel = () => {
    const levels = [
      { name: "0.0", value: fibLevels.level0 },
      { name: "0.236", value: fibLevels.level236 },
      { name: "0.382", value: fibLevels.level382 },
      { name: "0.5", value: fibLevels.level500 },
      { name: "0.618", value: fibLevels.level618 },
      { name: "0.786", value: fibLevels.level786 },
      { name: "1.0", value: fibLevels.level1000 },
      { name: "1.618", value: fibLevels.level1618 },
      { name: "2.618", value: fibLevels.level2618 },
      { name: "4.236", value: fibLevels.level4236 }
    ];
    
    let closest = levels[0];
    let minDiff = Math.abs(currentPrice - closest.value);
    
    levels.slice(1).forEach(level => {
      const diff = Math.abs(currentPrice - level.value);
      if (diff < minDiff) {
        minDiff = diff;
        closest = level;
      }
    });
    
    return closest;
  };
  
  const closestLevel = getClosestLevel();

  return (
    <Card className="shadow-lg border border-border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{symbol} Fibonacci Analysis</CardTitle>
            <CardDescription>
              Price analysis using Fibonacci retracement levels
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
            <div className="text-xs text-muted-foreground">Trend</div>
            <div className={`font-medium ${trend === "uptrend" ? "text-green-500" : "text-red-500"}`}>
              {trend === "uptrend" ? "Uptrend" : "Downtrend"}
            </div>
          </div>
          <div className="bg-muted/20 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Closest Fib Level</div>
            <div className="font-medium">{closestLevel.name}</div>
          </div>
        </div>
        
        <div className="h-60 relative border border-border rounded-md overflow-hidden">
          {/* Simplified Fibonacci visualization */}
          <div className="absolute inset-0">
            {/* Price chart line (simplified) */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M0,80 L10,75 L20,60 L30,40 L40,45 L50,35 L60,30 L70,25 L80,20 L90,15 L100,10"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                className="text-primary"
              />
            </svg>
            
            {/* Fibonacci levels */}
            <div className="absolute inset-x-0 bottom-0 h-full">
              {/* Visualize the levels as horizontal lines */}
              {Object.entries(fibLevels).map(([level, price], index) => {
                const levelHeight = `${100 - ((price - lowPrice) / (highPrice - lowPrice)) * 100}%`;
                const isClosest = closestLevel.value === price;
                
                return (
                  <div 
                    key={level} 
                    className={`absolute left-0 right-0 border-t ${
                      isClosest ? 'border-primary border-dashed border-t-2' : 'border-border/50'
                    }`}
                    style={{ top: levelHeight }}
                  >
                    <div className={`absolute -top-3 right-1 text-xs px-1 rounded ${
                      isClosest ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
                    }`}>
                      {level.replace('level', '')} - ${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                );
              })}
              
              {/* Current price indicator */}
              <div 
                className="absolute left-0 right-0 border-t border-dashed border-orange-500" 
                style={{
                  top: `${100 - ((currentPrice - lowPrice) / (highPrice - lowPrice)) * 100}%`
                }}
              >
                <div className="absolute -top-3 left-1 text-xs bg-orange-500/20 text-orange-500 px-1 rounded">
                  Current: ${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Key Support Levels</h3>
            <div className="space-y-1.5">
              {trend === "uptrend" ? (
                <>
                  <div className="flex justify-between text-xs">
                    <span>Strong Support</span>
                    <span>${fibLevels.level618.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Moderate Support</span>
                    <span>${fibLevels.level500.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Weak Support</span>
                    <span>${fibLevels.level382.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-xs">
                    <span>Strong Support</span>
                    <span>${fibLevels.level0.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Moderate Support</span>
                    <span>${fibLevels.level236.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Weak Support</span>
                    <span>${fibLevels.level382.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Key Resistance Levels</h3>
            <div className="space-y-1.5">
              {trend === "uptrend" ? (
                <>
                  <div className="flex justify-between text-xs">
                    <span>Weak Resistance</span>
                    <span>${fibLevels.level1000.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Moderate Resistance</span>
                    <span>${fibLevels.level1618.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Strong Resistance</span>
                    <span>${fibLevels.level2618.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-xs">
                    <span>Weak Resistance</span>
                    <span>${fibLevels.level618.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Moderate Resistance</span>
                    <span>${fibLevels.level786.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Strong Resistance</span>
                    <span>${fibLevels.level1000.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-muted/20 rounded-md">
          <h3 className="text-sm font-medium mb-1">Analysis</h3>
          <p className="text-xs">
            {trend === "uptrend" ? 
              `${symbol} is in an uptrend with strong support at the 0.618 Fibonacci level ($${fibLevels.level618.toLocaleString()}). 
              The price is currently ${currentPrice > fibLevels.level618 ? "above" : "below"} this key support level. 
              Watch for resistance at the 1.618 extension ($${fibLevels.level1618.toLocaleString()}).` :
              
              `${symbol} is in a downtrend with strong support at the 0 Fibonacci level ($${fibLevels.level0.toLocaleString()}). 
              The price is currently ${currentPrice > fibLevels.level618 ? "above" : "below"} the 0.618 retracement level.
              Watch for resistance at the 0.786 level ($${fibLevels.level786.toLocaleString()}).`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FibonacciAnalysis;
