
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ApiUsageStats } from "@/types/trading";
import { Activity, Server, RefreshCw, AlertTriangle, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface RealTimeApiUsageProps {
  selectedService?: string;
  onServiceSelect?: (service: string) => void;
}

const RealTimeApiUsage: React.FC<RealTimeApiUsageProps> = ({
  selectedService = 'coingecko',
  onServiceSelect
}) => {
  const [apiServices] = useState<string[]>(['coingecko', 'binance', 'kraken', 'coinbase']);
  const [currentUsage, setCurrentUsage] = useState<ApiUsageStats[]>([]);
  const [usageHistory, setUsageHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateInterval, setUpdateInterval] = useState<number>(60); // seconds
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Generate mock API usage data
  const generateApiUsage = () => {
    const mockStats: ApiUsageStats[] = [
      { 
        service: 'coingecko',
        currentUsage: Math.floor(Math.random() * 30) + 60,
        maxUsage: 100,
        resetTime: new Date(Date.now() + 3600000).toISOString(),
        endpoint: '/coins/markets'
      },
      { 
        service: 'binance',
        currentUsage: Math.floor(Math.random() * 400) + 800,
        maxUsage: 1200,
        resetTime: new Date(Date.now() + 60000).toISOString(),
        endpoint: 'ticker/price'
      },
      { 
        service: 'kraken',
        currentUsage: Math.floor(Math.random() * 5) + 10,
        maxUsage: 15,
        resetTime: new Date(Date.now() + 1000).toISOString(),
        endpoint: 'Ticker'
      },
      { 
        service: 'coinbase',
        currentUsage: Math.floor(Math.random() * 50) + 70,
        maxUsage: 180,
        resetTime: new Date(Date.now() + 60000).toISOString(),
        endpoint: 'products/{id}/ticker'
      }
    ];
    
    return mockStats;
  };
  
  // Generate usage history data
  const generateUsageHistory = () => {
    const now = Date.now();
    const history = [];
    
    for (let i = 30; i >= 0; i--) {
      const timestamp = new Date(now - (i * 60 * 1000));
      const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const dataPoint: any = {
        time: timeString
      };
      
      apiServices.forEach(service => {
        // Random usage value that increases over time with some fluctuation
        const baseValue = service === 'coingecko' ? 50 : 
                          service === 'binance' ? 700 : 
                          service === 'kraken' ? 8 : 60;
        
        const trend = i / 30; // Trending upward as i decreases
        const fluctuation = Math.random() * 10 - 5;
        
        dataPoint[service] = Math.round(baseValue + (baseValue * 0.5 * (1 - trend)) + fluctuation);
      });
      
      history.push(dataPoint);
    }
    
    return history;
  };
  
  // Simulate fetching API usage data
  const fetchApiUsage = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newUsage = generateApiUsage();
      setCurrentUsage(newUsage);
      setLastUpdated(new Date());
      setIsLoading(false);
      
      // Check for any services approaching their limit
      const nearLimit = newUsage.find(stat => (stat.currentUsage / stat.maxUsage) > 0.8);
      if (nearLimit) {
        toast({
          title: "API Rate Limit Warning",
          description: `${nearLimit.service.charAt(0).toUpperCase() + nearLimit.service.slice(1)} API is at ${Math.round((nearLimit.currentUsage / nearLimit.maxUsage) * 100)}% of its limit`,
          variant: "destructive"
        });
      }
    }, 800);
  };
  
  // Initialize data
  useEffect(() => {
    fetchApiUsage();
    setUsageHistory(generateUsageHistory());
    
    // Set up interval for real-time updates
    const intervalId = setInterval(() => {
      fetchApiUsage();
      // Update history with new data point
      setUsageHistory(prev => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const newDataPoint: any = { time: timeString };
        
        apiServices.forEach(service => {
          const serviceStat = currentUsage.find(stat => stat.service === service);
          if (serviceStat) {
            newDataPoint[service] = serviceStat.currentUsage;
          } else {
            newDataPoint[service] = 0;
          }
        });
        
        const newHistory = [...prev.slice(1), newDataPoint];
        return newHistory;
      });
    }, updateInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [updateInterval]);
  
  // Calculate time remaining until reset
  const getTimeRemaining = (resetTimeStr: string | undefined) => {
    if (!resetTimeStr) return "Unknown";
    
    const resetTime = new Date(resetTimeStr).getTime();
    const now = Date.now();
    const diffMs = resetTime - now;
    
    if (diffMs <= 0) return "Resetting...";
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    
    return diffMins > 0 ? `${diffMins}m ${diffSecs}s` : `${diffSecs}s`;
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchApiUsage();
    toast({
      title: "API Usage Refreshed",
      description: "Latest API usage statistics loaded"
    });
  };
  
  // Handle interval change
  const handleIntervalChange = (value: string) => {
    setUpdateInterval(parseInt(value));
    toast({
      title: "Update Interval Changed",
      description: `API usage will now refresh every ${value} seconds`
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Real-time API Usage</h2>
          <p className="text-muted-foreground">
            Monitor your API consumption across different services
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs 
            defaultValue="60"
            value={updateInterval.toString()} 
            onValueChange={handleIntervalChange}
          >
            <TabsList>
              <TabsTrigger value="15">15s</TabsTrigger>
              <TabsTrigger value="30">30s</TabsTrigger>
              <TabsTrigger value="60">60s</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleRefresh} size="icon" variant="outline" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {currentUsage.map((stat) => {
          const usagePercent = (stat.currentUsage / stat.maxUsage) * 100;
          let statusColor = "bg-green-500";
          let textColor = "text-green-500";
          
          if (usagePercent > 90) {
            statusColor = "bg-red-500";
            textColor = "text-red-500";
          } else if (usagePercent > 70) {
            statusColor = "bg-yellow-500";
            textColor = "text-yellow-500";
          }
          
          return (
            <Card 
              key={stat.service}
              className={`border-l-4 ${
                selectedService === stat.service ? 'border-l-primary' : `border-l-transparent`
              } cursor-pointer hover:border-l-primary/50 transition-colors`}
              onClick={() => onServiceSelect && onServiceSelect(stat.service)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${statusColor}`}></div>
                    <CardTitle className="text-sm font-medium capitalize">
                      {stat.service}
                    </CardTitle>
                  </div>
                  <Badge variant={usagePercent > 90 ? "destructive" : "outline"}>
                    {Math.round(usagePercent)}%
                  </Badge>
                </div>
                <CardDescription className="flex justify-between">
                  <span>{stat.endpoint}</span>
                  <span>{getTimeRemaining(stat.resetTime)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-sm font-medium flex justify-between mb-1.5">
                  <span>Usage</span>
                  <span className={textColor}>
                    {stat.currentUsage} / {stat.maxUsage}
                  </span>
                </div>
                <Progress value={usagePercent} className="h-2" />
                
                {usagePercent > 80 && (
                  <div className="mt-2 text-xs flex items-center text-red-500">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Approaching rate limit
                  </div>
                )}
                
                {usagePercent <= 50 && (
                  <div className="mt-2 text-xs flex items-center text-green-500">
                    <Check className="h-3 w-3 mr-1" />
                    Usage within safe limits
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            API Usage Over Time
          </CardTitle>
          <CardDescription>
            Tracking consumption trends across all connected services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={usageHistory}
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
                  dataKey="coingecko" 
                  name="CoinGecko" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="binance" 
                  name="Binance" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="kraken" 
                  name="Kraken" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="coinbase" 
                  name="Coinbase" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 border rounded-md p-4">
            <h4 className="font-medium mb-2 flex items-center">
              <Server className="h-4 w-4 mr-2" />
              API Usage Optimization Tips
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex">
                <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">1</span>
                <span>Implement caching to reduce redundant API calls for frequently accessed data</span>
              </li>
              <li className="flex">
                <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">2</span>
                <span>Use WebSocket connections instead of polling for real-time data</span>
              </li>
              <li className="flex">
                <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">3</span>
                <span>Batch related API requests to minimize the number of separate calls</span>
              </li>
              <li className="flex">
                <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">4</span>
                <span>Implement exponential backoff for retries when approaching rate limits</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-sm text-muted-foreground text-center">
        {lastUpdated && (
          <>Last updated: {lastUpdated.toLocaleTimeString()} • Next update in {updateInterval} seconds</>
        )}
      </div>
    </div>
  );
};

export default RealTimeApiUsage;
