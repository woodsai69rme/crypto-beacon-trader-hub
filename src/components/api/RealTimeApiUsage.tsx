
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";

interface ApiUsagePoint {
  timestamp: string;
  requests: number;
  endpoint: string;
}

const RealTimeApiUsage: React.FC = () => {
  const [usageData, setUsageData] = useState<ApiUsagePoint[]>([]);
  
  // Generate mock usage data on component mount and every few seconds
  useEffect(() => {
    // Initial data generation
    generateInitialData();
    
    // Set up interval for real-time updates
    const intervalId = setInterval(() => {
      addDataPoint();
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Generate some initial historical data
  const generateInitialData = () => {
    const initialData: ApiUsagePoint[] = [];
    const now = new Date();
    
    // Generate data points for the past 20 minutes
    for (let i = 20; i > 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60000).toLocaleTimeString();
      const requests = Math.floor(Math.random() * 20) + 5;
      const endpoint = getRandomEndpoint();
      
      initialData.push({
        timestamp,
        requests,
        endpoint
      });
    }
    
    setUsageData(initialData);
  };
  
  // Add a new data point
  const addDataPoint = () => {
    const timestamp = new Date().toLocaleTimeString();
    const requests = Math.floor(Math.random() * 20) + 5;
    const endpoint = getRandomEndpoint();
    
    setUsageData(prevData => {
      // Keep only the last 20 data points
      const newData = [...prevData.slice(-19), { timestamp, requests, endpoint }];
      return newData;
    });
  };
  
  // Helper function to get a random endpoint for mock data
  const getRandomEndpoint = () => {
    const endpoints = [
      '/coins/markets',
      '/market_chart',
      '/exchanges',
      '/coins/list',
      '/simple/price'
    ];
    
    return endpoints[Math.floor(Math.random() * endpoints.length)];
  };
  
  // Calculate current requests per minute
  const calculateRequestsPerMinute = () => {
    if (usageData.length === 0) return 0;
    
    const totalRequests = usageData.reduce((total, point) => total + point.requests, 0);
    return Math.round(totalRequests / usageData.length * 60 / 3); // Adjust for 3-second intervals
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-md font-medium">Real-Time API Usage</CardTitle>
          <div className="flex items-center mt-1">
            <Badge variant="outline" className="mr-2">
              {calculateRequestsPerMinute()} requests/min
            </Badge>
            <span className="text-xs text-muted-foreground">
              Last updated: {usageData.length > 0 ? usageData[usageData.length - 1].timestamp : 'N/A'}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={usageData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 10 }}
              tickLine={false}
              minTickGap={50}
              tick={(props) => {
                const { x, y, payload, index } = props;
                // Only show every 3rd tick to avoid crowding
                if (index % 3 !== 0) return null;
                
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={16}
                      textAnchor="middle"
                      fill="#888"
                      fontSize={10}
                    >
                      {payload.value}
                    </text>
                  </g>
                );
              }}
            />
            <YAxis
              width={30}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value) => [`${value} requests`, 'API Requests']}
              itemStyle={{ fontSize: 12 }}
              labelStyle={{ fontSize: 12, fontWeight: 'bold' }}
              contentStyle={{ border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RealTimeApiUsage;
