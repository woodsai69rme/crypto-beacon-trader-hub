
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, Percent, TrendingUp } from 'lucide-react';

const RealTimePortfolioPerformance: React.FC = () => {
  const [portfolioValue, setPortfolioValue] = useState<number>(10000);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<string>("1D");
  
  useEffect(() => {
    // Generate initial historical data based on selected timeframe
    generateHistoricalData(timeframe);
    
    // Set up interval for real-time updates
    const intervalId = setInterval(() => {
      // Generate a small random price change (-0.5% to +0.5%)
      const change = (Math.random() * 1 - 0.5) / 100;
      
      setPortfolioValue(prev => {
        const newValue = prev * (1 + change);
        return newValue;
      });
      
      // Add new data point
      setPerformanceData(prev => {
        const lastPoint = prev[prev.length - 1];
        if (!lastPoint) return prev;
        
        const now = new Date();
        const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        // Add new point and keep last 60 points
        return [
          ...prev,
          {
            time: timeString,
            value: portfolioValue
          }
        ].slice(-60);
      });
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [timeframe]);
  
  // Generate historical performance data based on timeframe
  const generateHistoricalData = (tf: string) => {
    const data: any[] = [];
    const now = new Date();
    const startValue = 10000; // Starting portfolio value
    
    let totalPoints: number;
    let interval: number;
    
    switch (tf) {
      case '1H':
        totalPoints = 60; // One point per minute
        interval = 60 * 1000; // 1 minute in milliseconds
        break;
      case '1D':
        totalPoints = 24; // One point per hour
        interval = 60 * 60 * 1000; // 1 hour in milliseconds
        break;
      case '1W':
        totalPoints = 7; // One point per day
        interval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        break;
      case '1M':
        totalPoints = 30; // One point per day
        interval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        break;
      default:
        totalPoints = 24;
        interval = 60 * 60 * 1000;
    }
    
    let currentValue = startValue;
    
    for (let i = totalPoints - 1; i >= 0; i--) {
      const pointTime = new Date(now.getTime() - (i * interval));
      let timeString: string;
      
      if (tf === '1H') {
        timeString = `${pointTime.getHours()}:${String(pointTime.getMinutes()).padStart(2, '0')}`;
      } else if (tf === '1D') {
        timeString = `${pointTime.getHours()}:00`;
      } else {
        timeString = pointTime.toLocaleDateString();
      }
      
      // Generate a small random change for each interval
      const change = (Math.random() * 0.04 - 0.02); // -2% to 2%
      currentValue = currentValue * (1 + change);
      
      data.push({
        time: timeString,
        value: currentValue
      });
    }
    
    setPerformanceData(data);
    setPortfolioValue(currentValue);
  };
  
  // Calculate performance metrics
  const calculateMetrics = () => {
    if (performanceData.length < 2) return { change: 0, changePercent: 0 };
    
    const startValue = performanceData[0].value;
    const currentValue = performanceData[performanceData.length - 1].value;
    const change = currentValue - startValue;
    const changePercent = (change / startValue) * 100;
    
    return {
      change,
      changePercent
    };
  };
  
  const metrics = calculateMetrics();
  const isPositive = metrics.change >= 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Portfolio Performance
          </CardTitle>
          <Tabs value={timeframe} onValueChange={(value) => {
            setTimeframe(value);
            generateHistoricalData(value);
          }}>
            <TabsList>
              <TabsTrigger value="1H">1H</TabsTrigger>
              <TabsTrigger value="1D">1D</TabsTrigger>
              <TabsTrigger value="1W">1W</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <div className="text-sm text-muted-foreground">Current Value</div>
              <div className="text-2xl font-bold">${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            
            <div className="p-4 border rounded-md">
              <div className="text-sm text-muted-foreground">Performance</div>
              <div className={`text-xl font-bold flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                ${Math.abs(metrics.change).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                <span className="text-sm ml-1 flex items-center">
                  <Percent className="h-3 w-3" />
                  {Math.abs(metrics.changePercent).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isPositive ? "#10b981" : "#ef4444"} 
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePortfolioPerformance;
