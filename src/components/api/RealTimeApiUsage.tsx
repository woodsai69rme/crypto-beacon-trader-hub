
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ApiUsageStats } from '@/types/trading';

interface RealTimeApiUsageProps {
  selectedService: string;
  onServiceSelect: (service: string) => void;
}

const RealTimeApiUsage: React.FC<RealTimeApiUsageProps> = ({ 
  selectedService,
  onServiceSelect
}) => {
  const [usageData, setUsageData] = useState<any[]>([]);
  const [currentUsage, setCurrentUsage] = useState<ApiUsageStats[]>([
    {
      service: "CoinGecko",
      currentUsage: 45,
      maxUsage: 100,
      resetTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      endpoint: "/coins/markets"
    },
    {
      service: "Binance",
      currentUsage: 120,
      maxUsage: 1200,
      resetTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      endpoint: "/api/v3/ticker"
    }
  ]);
  
  useEffect(() => {
    // Generate mock data for selected service
    const generateMockData = () => {
      const lastHour = Array.from({ length: 60 }, (_, i) => {
        const minutes = 59 - i;
        const time = new Date();
        time.setMinutes(time.getMinutes() - minutes);
        
        // Generate a somewhat realistic usage pattern
        const baseUsage = selectedService === "CoinGecko" ? 35 : 100;
        const variation = selectedService === "CoinGecko" ? 15 : 30;
        const spikeChance = Math.random() < 0.1; // 10% chance of a usage spike
        
        return {
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          usage: baseUsage + Math.round(Math.random() * variation) + (spikeChance ? variation * 2 : 0),
          limit: selectedService === "CoinGecko" ? 100 : 1200
        };
      });
      
      setUsageData(lastHour);
    };
    
    generateMockData();
    
    // Set up interval for live updates
    const interval = setInterval(() => {
      setUsageData(prevData => {
        const newData = [...prevData];
        
        // Remove oldest data point
        newData.shift();
        
        // Add new data point
        const now = new Date();
        const baseUsage = selectedService === "CoinGecko" ? 35 : 100;
        const variation = selectedService === "CoinGecko" ? 15 : 30;
        const spikeChance = Math.random() < 0.1;
        
        newData.push({
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          usage: baseUsage + Math.round(Math.random() * variation) + (spikeChance ? variation * 2 : 0),
          limit: selectedService === "CoinGecko" ? 100 : 1200
        });
        
        return newData;
      });
      
      // Update current usage
      setCurrentUsage(prev => 
        prev.map(api => 
          api.service === selectedService 
            ? { 
                ...api, 
                currentUsage: Math.min(
                  api.maxUsage, 
                  api.currentUsage + Math.floor(Math.random() * 3)
                ) 
              } 
            : api
        )
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [selectedService]);
  
  const selectedServiceData = currentUsage.find(api => api.service === selectedService);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Real-Time API Usage</CardTitle>
          </div>
          <Tabs defaultValue={selectedService} onValueChange={onServiceSelect}>
            <TabsList>
              <TabsTrigger value="CoinGecko">CoinGecko</TabsTrigger>
              <TabsTrigger value="Binance">Binance</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-xs text-muted-foreground">Current Rate</div>
              <div className="text-2xl font-bold">{selectedServiceData?.currentUsage || 0}</div>
              <div className="text-xs text-muted-foreground">requests</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-xs text-muted-foreground">Limit</div>
              <div className="text-2xl font-bold">{selectedServiceData?.maxUsage || 0}</div>
              <div className="text-xs text-muted-foreground">requests</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-xs text-muted-foreground">Usage</div>
              <div className="text-2xl font-bold">{selectedServiceData 
                ? Math.round((selectedServiceData.currentUsage / selectedServiceData.maxUsage) * 100) 
                : 0}%</div>
              <div className="text-xs text-muted-foreground">of limit</div>
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={usageData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  tickFormatter={(value) => value}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  domain={[0, selectedService === "CoinGecko" ? 100 : 1200]}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  name="Request Rate"
                />
                <Line
                  type="monotone"
                  dataKey="limit"
                  stroke="#ff7300"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Rate Limit"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">API Rate Limit Information</h4>
            <div className="text-sm space-y-2">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Endpoint:</span>
                <span className="font-mono text-xs">{selectedServiceData?.endpoint || 'All endpoints'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Reset Time:</span>
                <span>{selectedServiceData?.resetTime 
                  ? new Date(selectedServiceData.resetTime).toLocaleTimeString() 
                  : 'Unknown'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Recommendations:</span>
                {selectedServiceData && selectedServiceData.currentUsage / selectedServiceData.maxUsage > 0.7 ? (
                  <span className="text-amber-500">Consider implementing rate limiting or caching to reduce API calls</span>
                ) : (
                  <span className="text-green-500">API usage is within acceptable limits</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeApiUsage;
