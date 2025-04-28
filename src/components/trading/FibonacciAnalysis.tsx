
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine, Tooltip, CartesianGrid } from "recharts";
import { RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { FibonacciLevels } from "@/types/trading";

interface FibonacciAnalysisProps {
  className?: string;
}

// Fibonacci levels
const FIB_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.272, 1.618, 2.618];

const FibonacciAnalysis: React.FC<FibonacciAnalysisProps> = ({ className }) => {
  const [coin, setCoin] = useState<string>("bitcoin");
  const [timeframe, setTimeframe] = useState<string>("1d");
  const [loading, setLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [fibLevels, setFibLevels] = useState<FibonacciLevels | null>(null);

  useEffect(() => {
    generateFibonacciLevels();
  }, [coin, timeframe]);

  const generateFibonacciLevels = async () => {
    setLoading(true);
    
    try {
      // Generate mock price data for demo
      const mockPriceData = generateMockPriceData(coin, 30);
      setChartData(mockPriceData);
      
      // Find swing high and low for Fibonacci calculation
      const prices = mockPriceData.map(point => point.price);
      const highPrice = Math.max(...prices);
      const lowPrice = Math.min(...prices);
      const priceDiff = highPrice - lowPrice;
      
      // Calculate Fibonacci levels
      const levels = FIB_LEVELS.map(level => ({
        extension: level,
        price: lowPrice + (priceDiff * level),
        significance: getSignificance(level)
      }));
      
      setFibLevels({
        coin,
        timeframe,
        levels,
        lastCalculated: new Date().toISOString()
      });
      
      toast({
        title: "Fibonacci Analysis Updated",
        description: `${coin.toUpperCase()} levels calculated for ${timeframe} timeframe`
      });
    } catch (error) {
      console.error("Error generating Fibonacci levels:", error);
      toast({
        title: "Analysis Error",
        description: "Failed to generate Fibonacci levels",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getSignificance = (level: number): 'weak' | 'medium' | 'strong' => {
    // Key Fibonacci levels are considered stronger
    if ([0, 0.382, 0.618, 1, 1.618].includes(level)) {
      return 'strong';
    } else if ([0.236, 0.5, 0.786, 2.618].includes(level)) {
      return 'medium';
    } else {
      return 'weak';
    }
  };
  
  const generateMockPriceData = (coinId: string, days: number) => {
    const data = [];
    let basePrice = coinId === 'bitcoin' ? 50000 : coinId === 'ethereum' ? 3000 : 100;
    const volatility = coinId === 'bitcoin' ? 0.05 : coinId === 'ethereum' ? 0.07 : 0.09;
    
    for (let i = 0; i < days; i++) {
      const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
      basePrice += change;
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: parseFloat(basePrice.toFixed(2))
      });
    }
    
    return data;
  };
  
  const getLevelColor = (significance: 'weak' | 'medium' | 'strong') => {
    switch (significance) {
      case 'strong': return '#FF4560';
      case 'medium': return '#FEB019';
      case 'weak': return '#00E396';
      default: return '#00E396';
    }
  };
  
  const handleRefresh = () => {
    generateFibonacciLevels();
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <CardTitle>Fibonacci Analysis</CardTitle>
            <CardDescription>Auto-calculated extension and retracement levels</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={coin} onValueChange={setCoin}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="cardano">Cardano</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={loading}
              className={loading ? "animate-spin" : ""}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => value.substring(5)}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10 }} 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3F83F8" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4 }}
              />
              
              {fibLevels && fibLevels.levels.map((level, idx) => (
                <ReferenceLine 
                  key={idx} 
                  y={level.price} 
                  stroke={getLevelColor(level.significance)} 
                  strokeWidth={level.significance === 'strong' ? 1.5 : 1}
                  strokeDasharray={level.significance === 'weak' ? "3 3" : undefined}
                  label={{
                    value: `${level.extension} - $${level.price.toLocaleString(undefined, {maximumFractionDigits: 2})}`,
                    fill: getLevelColor(level.significance),
                    fontSize: 10,
                    position: 'right'
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {fibLevels && fibLevels.levels.map((level, idx) => (
            <div 
              key={idx} 
              className="border rounded-md p-2 text-center"
              style={{ borderColor: getLevelColor(level.significance), borderWidth: level.significance === 'strong' ? 2 : 1 }}
            >
              <div className="text-xs font-medium">Level {level.extension}</div>
              <div className="text-sm">${level.price.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FibonacciAnalysis;
