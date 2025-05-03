
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RealTimeApiUsageProps {
  selectedService: string;
  onServiceSelect: (service: string) => void;
}

// Mock data for demo purposes
const mockApiUsageHistory: Record<string, {time: string, usage: number}[]> = {
  "CoinGecko": [
    { time: "09:00", usage: 10 },
    { time: "10:00", usage: 15 },
    { time: "11:00", usage: 25 },
    { time: "12:00", usage: 30 },
    { time: "13:00", usage: 28 },
    { time: "14:00", usage: 35 },
  ],
  "CryptoCompare": [
    { time: "09:00", usage: 5 },
    { time: "10:00", usage: 12 },
    { time: "11:00", usage: 18 },
    { time: "12:00", usage: 15 },
    { time: "13:00", usage: 22 },
    { time: "14:00", usage: 28 },
  ],
  "CoinMarketCap": [
    { time: "09:00", usage: 2 },
    { time: "10:00", usage: 8 },
    { time: "11:00", usage: 12 },
    { time: "12:00", usage: 10 },
    { time: "13:00", usage: 15 },
    { time: "14:00", usage: 18 },
  ]
};

const availableServices = ["CoinGecko", "CryptoCompare", "CoinMarketCap"];

const RealTimeApiUsage: React.FC<RealTimeApiUsageProps> = ({ selectedService, onServiceSelect }) => {
  const [usageData, setUsageData] = useState<{time: string, usage: number}[]>([]);

  useEffect(() => {
    // Update with mock data when selected service changes
    const data = mockApiUsageHistory[selectedService] || [];
    setUsageData(data);
  }, [selectedService]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle>Real-Time API Usage</CardTitle>
            <CardDescription>Track API requests over time</CardDescription>
          </div>
          
          <Select value={selectedService} onValueChange={onServiceSelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {availableServices.map(service => (
                <SelectItem key={service} value={service}>{service}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={usageData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="usage"
                name="API Calls"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {usageData.length === 0 && (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No usage data available for this service</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeApiUsage;
