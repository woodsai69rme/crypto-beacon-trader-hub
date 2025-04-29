
import React, { useState } from 'react';
import { FibonacciLevels } from '@/types/trading';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { ChevronDown, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface FibonacciAnalysisProps {
  priceData: { time: string; price: number }[];
  symbol: string;
}

const FibonacciAnalysis: React.FC<FibonacciAnalysisProps> = ({ priceData, symbol }) => {
  const [timeRange, setTimeRange] = useState<string>("1d");
  const [reverseMode, setReverseMode] = useState<boolean>(false);
  const [showAllLevels, setShowAllLevels] = useState<boolean>(false);
  const [levelsVisibility, setLevelsVisibility] = useState<Record<string, boolean>>({
    level0: true,
    level236: true,
    level382: true,
    level500: true,
    level618: true,
    level786: true,
    level1000: true,
    level1618: false,
    level2618: false,
    level4236: false,
  });

  // Calculate Fibonacci levels
  const calculateFibonacciLevels = (): FibonacciLevels => {
    if (!priceData || priceData.length < 2) {
      return {
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
      };
    }

    let prices = priceData.map(d => d.price);
    let min = Math.min(...prices);
    let max = Math.max(...prices);
    
    // If reverse mode is enabled, flip the direction
    let startPrice = reverseMode ? max : min;
    let endPrice = reverseMode ? min : max;
    let range = endPrice - startPrice;

    return {
      level0: startPrice,
      level236: startPrice + range * 0.236,
      level382: startPrice + range * 0.382,
      level500: startPrice + range * 0.5,
      level618: startPrice + range * 0.618,
      level786: startPrice + range * 0.786,
      level1000: endPrice,
      level1618: startPrice + range * 1.618,
      level2618: startPrice + range * 2.618,
      level4236: startPrice + range * 4.236
    };
  };

  const levels = calculateFibonacciLevels();

  const toggleLevelVisibility = (level: string) => {
    setLevelsVisibility(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  const levelColors: Record<string, string> = {
    level0: "#FF0000",    // Red
    level236: "#FF7F00",  // Orange
    level382: "#FFFF00",  // Yellow
    level500: "#00FF00",  // Green
    level618: "#0000FF",  // Blue
    level786: "#4B0082",  // Indigo
    level1000: "#8B00FF", // Violet
    level1618: "#FFC0CB", // Pink
    level2618: "#800080", // Purple
    level4236: "#A52A2A"  // Brown
  };

  const levelLabels: Record<string, string> = {
    level0: "0%",
    level236: "23.6%",
    level382: "38.2%",
    level500: "50.0%",
    level618: "61.8%",
    level786: "78.6%",
    level1000: "100%",
    level1618: "161.8%",
    level2618: "261.8%",
    level4236: "423.6%"
  };

  const formatPrice = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Fibonacci Analysis - {symbol}</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="4h">4 Hours</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="1w">1 Week</SelectItem>
              <SelectItem value="1m">1 Month</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Sliders className="h-4 w-4 mr-1" />
                Settings
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px]">
              <div className="space-y-2">
                <div className="font-medium">Fibonacci Options</div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="reverseMode"
                    checked={reverseMode} 
                    onChange={() => setReverseMode(!reverseMode)} 
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="reverseMode" className="text-sm">Reverse Mode (Top to Bottom)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="showAllLevels"
                    checked={showAllLevels} 
                    onChange={() => {
                      setShowAllLevels(!showAllLevels);
                      if (!showAllLevels) {
                        setLevelsVisibility({
                          level0: true,
                          level236: true,
                          level382: true,
                          level500: true,
                          level618: true,
                          level786: true,
                          level1000: true,
                          level1618: true,
                          level2618: true,
                          level4236: true,
                        });
                      } else {
                        setLevelsVisibility({
                          level0: true,
                          level236: true,
                          level382: true,
                          level500: true,
                          level618: true,
                          level786: true,
                          level1000: true,
                          level1618: false,
                          level2618: false,
                          level4236: false,
                        });
                      }
                    }} 
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="showAllLevels" className="text-sm">Show Extension Levels</label>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="font-medium mb-1">Toggle Levels</div>
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(levelLabels).map(([level, label]) => (
                      <div key={level} className="flex items-center space-x-1">
                        <input 
                          type="checkbox" 
                          id={level}
                          checked={levelsVisibility[level]} 
                          onChange={() => toggleLevelVisibility(level)} 
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={level} className="text-xs">{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={priceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return timeRange === '1d' ? 
                    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                    date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis 
                domain={['dataMin', 'dataMax']} 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => formatPrice(value)}
              />
              <Tooltip 
                formatter={(value: number) => [`$${formatPrice(value)}`, 'Price']}
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#8884d8" 
                dot={false} 
                animationDuration={500}
              />
              
              {/* Fibonacci Levels */}
              {Object.entries(levels).map(([levelKey, value]) => {
                if (levelsVisibility[levelKey]) {
                  return (
                    <ReferenceLine 
                      key={levelKey}
                      y={value} 
                      stroke={levelColors[levelKey]} 
                      strokeDasharray="3 3"
                      label={{ 
                        value: `${levelLabels[levelKey]} - $${formatPrice(value)}`, 
                        fill: levelColors[levelKey],
                        fontSize: 10,
                        position: 'right'
                      }} 
                    />
                  );
                }
                return null;
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FibonacciAnalysis;
