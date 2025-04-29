
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TechnicalIndicatorChartProps {
  coinId: string;
  timeframe?: string;
}

const TechnicalIndicatorChart: React.FC<TechnicalIndicatorChartProps> = ({ 
  coinId, 
  timeframe = "1d" 
}) => {
  const [indicator, setIndicator] = useState('RSI');
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch data from API
        // For now, generate mock data
        const mockData = generateMockData(parseInt(timeframe, 10) || 7);
        setChartData(mockData);
      } catch (error) {
        console.error("Error fetching technical data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [coinId, timeframe]);
  
  const renderChart = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-64">Loading...</div>;
    }
    
    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
      return <div className="flex items-center justify-center h-64">No data available</div>;
    }
    
    switch (indicator) {
      case 'RSI':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="RSI" stroke="#8884d8" dot={false} />
              <Line type="monotone" dataKey="OverBought" stroke="#ff0000" strokeDasharray="3 3" dot={false} />
              <Line type="monotone" dataKey="OverSold" stroke="#00ff00" strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'MACD':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="MACD" stroke="#8884d8" dot={false} />
              <Line type="monotone" dataKey="Signal" stroke="#82ca9d" dot={false} />
              <Area type="monotone" dataKey="Histogram" fill="#ffc658" stroke="#ffc658" fillOpacity={0.3} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'MovingAverage':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Price" stroke="#000000" dot={false} />
              <Line type="monotone" dataKey="MovingAverage7" stroke="#8884d8" dot={false} />
              <Line type="monotone" dataKey="MovingAverage25" stroke="#82ca9d" dot={false} />
              <Line type="monotone" dataKey="MovingAverage99" stroke="#ffc658" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'BollingerBands':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Price" stroke="#000000" dot={false} />
              <Line type="monotone" dataKey="UpperBand" stroke="#ff0000" strokeDasharray="3 3" dot={false} />
              <Line type="monotone" dataKey="MiddleBand" stroke="#0000ff" dot={false} />
              <Line type="monotone" dataKey="LowerBand" stroke="#00ff00" strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle>Technical Analysis</CardTitle>
          <div className="flex space-x-2 items-center">
            <Tabs defaultValue={timeframe} onValueChange={(value) => console.log("Timeframe changed:", value)}>
              <TabsList className="h-8">
                <TabsTrigger value="1d" className="text-xs px-2">1D</TabsTrigger>
                <TabsTrigger value="7d" className="text-xs px-2">1W</TabsTrigger>
                <TabsTrigger value="30d" className="text-xs px-2">1M</TabsTrigger>
                <TabsTrigger value="90d" className="text-xs px-2">3M</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select value={indicator} onValueChange={setIndicator}>
              <SelectTrigger className="w-[130px] h-8">
                <SelectValue placeholder="Select Indicator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RSI">RSI</SelectItem>
                <SelectItem value="MACD">MACD</SelectItem>
                <SelectItem value="MovingAverage">Moving Avg</SelectItem>
                <SelectItem value="BollingerBands">Bollinger</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

// Mock data generation
const generateMockData = (days: number): any[] => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  let price = 30000 + Math.random() * 10000;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Random price change (-3% to +3%)
    const change = (Math.random() * 0.06) - 0.03;
    price = price * (1 + change);
    
    // Calculate RSI (simplified mock)
    const rsi = Math.min(100, Math.max(0, 50 + (change * 1000)));
    
    // Calculate MACD (simplified mock)
    const macd = change * 200;
    const signal = macd * (1 - Math.random() * 0.2);
    const histogram = macd - signal;
    
    // Moving averages (simplified mock)
    const ma7 = price * (1 - Math.random() * 0.02);
    const ma25 = price * (1 - Math.random() * 0.04);
    const ma99 = price * (1 - Math.random() * 0.06);
    
    // Bollinger bands (simplified mock)
    const middleBand = ma25;
    const upperBand = middleBand * 1.02;
    const lowerBand = middleBand * 0.98;
    
    data.push({
      time: date.toLocaleDateString(),
      Price: price,
      RSI: rsi,
      OverBought: 70,
      OverSold: 30,
      MACD: macd,
      Signal: signal,
      Histogram: histogram,
      MovingAverage7: ma7,
      MovingAverage25: ma25,
      MovingAverage99: ma99,
      UpperBand: upperBand,
      MiddleBand: middleBand,
      LowerBand: lowerBand,
    });
  }
  
  return data;
};

export default TechnicalIndicatorChart;
