
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ApiUsageStats } from "@/types/trading";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface RealTimeApiUsageProps {
  usageStats: ApiUsageStats[];
}

const RealTimeApiUsage: React.FC<RealTimeApiUsageProps> = ({ usageStats }) => {
  // Mock real-time API call data
  const [apiCalls, setApiCalls] = useState([
    {
      id: "1",
      service: "CoinGecko API",
      endpoint: "/api/v3/coins/markets",
      status: 200,
      responseTime: 245,
      timestamp: new Date(Date.now() - 5000).toISOString(),
    },
    {
      id: "2",
      service: "Hyblock API",
      endpoint: "/api/v2/liquidity/binance/btcusdt",
      status: 200,
      responseTime: 210,
      timestamp: new Date(Date.now() - 10000).toISOString(),
    },
    {
      id: "3",
      service: "CoinGecko API",
      endpoint: "/api/v3/coins/bitcoin",
      status: 200,
      responseTime: 185,
      timestamp: new Date(Date.now() - 15000).toISOString(),
    },
  ]);

  // Mock chart data for response times
  const [responseTimeData, setResponseTimeData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock data for response time chart
    const now = Date.now();
    const mockData = [];
    
    for (let i = 20; i >= 0; i--) {
      mockData.push({
        time: new Date(now - i * 10000).toLocaleTimeString(),
        'CoinGecko API': Math.random() * 300 + 100,
        'Hyblock API': Math.random() * 200 + 50,
        'Alchemy API': Math.random() * 150 + 75,
      });
    }
    
    setResponseTimeData(mockData);
    
    // Set up interval to add new data points
    const interval = setInterval(() => {
      const newCall = {
        id: Date.now().toString(),
        service: ['CoinGecko API', 'Hyblock API', 'Alchemy API'][Math.floor(Math.random() * 3)],
        endpoint: ['/markets', '/prices', '/coins/bitcoin', '/orderbook'][Math.floor(Math.random() * 4)],
        status: Math.random() > 0.9 ? 429 : 200, // Occasionally simulate rate limiting
        responseTime: Math.random() * 300 + 50,
        timestamp: new Date().toISOString(),
      };
      
      // Add new API call
      setApiCalls(prev => [newCall, ...prev.slice(0, 14)]);
      
      // Update chart data
      setResponseTimeData(prev => {
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString(),
          'CoinGecko API': Math.random() * 300 + 100,
          'Hyblock API': Math.random() * 200 + 50,
          'Alchemy API': Math.random() * 150 + 75,
        }];
        return newData;
      });
      
      // Show toast for rate limiting
      if (newCall.status === 429) {
        toast({
          title: "API Rate Limit Reached",
          description: `${newCall.service} returned a 429 status code. Consider reducing request frequency.`,
          variant: "destructive",
        });
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-500';
    if (status >= 400 && status < 500) return 'text-yellow-500';
    if (status >= 500) return 'text-red-500';
    return '';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const handleRefresh = () => {
    toast({
      title: "Refreshed",
      description: "Real-time API usage data has been refreshed.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Response Time Monitoring</CardTitle>
            <CardDescription>Real-time API response times</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData}>
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="CoinGecko API" 
                  stroke="#8884d8" 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Hyblock API" 
                  stroke="#82ca9d" 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Alchemy API" 
                  stroke="#ffc658" 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API Call History</CardTitle>
          <CardDescription>Recent API calls and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="hidden md:table-cell">Endpoint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Response Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-mono text-sm">
                    {formatTime(call.timestamp)}
                  </TableCell>
                  <TableCell>{call.service}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs">
                    {call.endpoint}
                  </TableCell>
                  <TableCell className={getStatusColor(call.status)}>
                    {call.status}
                  </TableCell>
                  <TableCell className="text-right">
                    {call.responseTime.toFixed(0)} ms
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeApiUsage;
