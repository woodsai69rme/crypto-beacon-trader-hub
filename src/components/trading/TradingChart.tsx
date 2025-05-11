
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface TradingChartProps {
  coinId: string;
  showVolume?: boolean;
  showControls?: boolean;
  height?: number | string;
}

const TradingChart: React.FC<TradingChartProps> = ({
  coinId,
  showVolume = false,
  showControls = true,
  height = 300
}) => {
  const [timeframe, setTimeframe] = useState<string>("1d");
  const [chartType, setChartType] = useState<string>("line");

  // Mock data for demonstration
  const generateMockData = () => {
    const data = [];
    const now = new Date();
    const basePrice = coinId === "bitcoin" ? 61200 : coinId === "ethereum" ? 3100 : 300;
    const volatility = coinId === "bitcoin" ? 500 : coinId === "ethereum" ? 100 : 20;
    
    for (let i = 30; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(now.getHours() - i);
      
      const randomChange = (Math.random() - 0.5) * volatility;
      const price = basePrice + randomChange;
      const volume = Math.random() * 1000000;
      
      data.push({
        time: time.toLocaleTimeString(),
        value: price,
        volume: volume
      });
    }
    
    return data;
  };
  
  const mockData = generateMockData();

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {showControls && (
          <div className="flex justify-between items-center mb-4">
            <Tabs value={chartType} onValueChange={setChartType} className="space-y-0">
              <TabsList>
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="candle">Area</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1H</SelectItem>
                <SelectItem value="4h">4H</SelectItem>
                <SelectItem value="1d">1D</SelectItem>
                <SelectItem value="1w">1W</SelectItem>
                <SelectItem value="1m">1M</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <ResponsiveContainer width="100%" height={height}>
          {chartType === "line" ? (
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" strokeOpacity={0.2} />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={false} 
              />
            </LineChart>
          ) : (
            <AreaChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" strokeOpacity={0.2} />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                fill="#8b5cf680" 
                stroke="#8b5cf6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
        
        {showVolume && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Volume</h4>
            <ResponsiveContainer width="100%" height={50}>
              <AreaChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" strokeOpacity={0.1} />
                <XAxis dataKey="time" tick={false} />
                <YAxis domain={['auto', 'auto']} hide={true} />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  fill="#22c55e80" 
                  stroke="#22c55e" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingChart;
