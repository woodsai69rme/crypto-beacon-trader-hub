
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Database, RefreshCw } from "lucide-react";
import { ApiUsageStats } from "@/types/trading";

export interface RealTimeApiUsageProps {
  selectedService: string;
  onServiceSelect: (service: string) => void;
}

const RealTimeApiUsage: React.FC<RealTimeApiUsageProps> = ({ selectedService, onServiceSelect }) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiStats, setApiStats] = useState<ApiUsageStats[]>([
    {
      service: "CoinGecko",
      currentUsage: 45,
      maxUsage: 100,
      resetTime: "2023-04-27T00:00:00Z",
      endpoint: "/coins/markets"
    },
    {
      service: "Binance",
      currentUsage: 120,
      maxUsage: 1200,
      resetTime: "2023-04-26T12:00:00Z",
      endpoint: "/api/v3/ticker"
    },
    {
      service: "CryptoCompare",
      currentUsage: 35,
      maxUsage: 50,
      resetTime: "2023-04-26T16:00:00Z",
      endpoint: "/data/price"
    }
  ]);
  
  const [realtimeData, setRealtimeData] = useState<{
    timestamp: string;
    endpoint: string;
    status: number;
    service: string;
    responseTime: number;
  }[]>([]);
  
  useEffect(() => {
    // Simulate real-time API calls
    const interval = setInterval(() => {
      const services = ["CoinGecko", "Binance", "CryptoCompare"];
      const endpoints = [
        "/coins/markets", 
        "/coins/bitcoin", 
        "/api/v3/ticker", 
        "/api/v3/depth",
        "/data/price",
        "/data/historicaldata"
      ];
      
      const randomStatus = Math.random() > 0.9 ? 429 : 200;
      const newCall = {
        timestamp: new Date().toISOString(),
        endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
        status: randomStatus,
        service: services[Math.floor(Math.random() * services.length)],
        responseTime: Math.floor(Math.random() * 300 + 50) // 50-350ms
      };
      
      if (randomStatus === 429) {
        // Rate limit hit, increase current usage to max
        setApiStats(current => 
          current.map(stat => 
            stat.service === newCall.service 
              ? { ...stat, currentUsage: stat.maxUsage } 
              : stat
          )
        );
      } else {
        // Increase usage slightly
        setApiStats(current => 
          current.map(stat => 
            stat.service === newCall.service 
              ? { 
                  ...stat, 
                  currentUsage: Math.min(
                    stat.maxUsage, 
                    stat.currentUsage + Math.floor(Math.random() * 3) + 1
                  ) 
                } 
              : stat
          )
        );
      }
      
      setRealtimeData(current => [...current, newCall].slice(-10));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setApiStats(current => 
        current.map(stat => ({
          ...stat,
          currentUsage: Math.floor(Math.random() * stat.maxUsage * 0.7)
        }))
      );
      setIsRefreshing(false);
    }, 1000);
  };
  
  const selectedStat = apiStats.find(stat => stat.service === selectedService);
  const usagePercent = selectedStat 
    ? (selectedStat.currentUsage / selectedStat.maxUsage) * 100 
    : 0;
  
  const getUsageSeverity = (percent: number) => {
    if (percent > 90) return "destructive";
    if (percent > 70) return "warning";
    return "default";
  };
  
  const filteredCalls = selectedService 
    ? realtimeData.filter(call => call.service === selectedService)
    : realtimeData;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end justify-between">
        <div className="space-y-2 flex-grow">
          <div>
            <h3 className="font-medium">Service</h3>
            <Select value={selectedService} onValueChange={onServiceSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select API service" />
              </SelectTrigger>
              <SelectContent>
                {apiStats.map(stat => (
                  <SelectItem key={stat.service} value={stat.service}>
                    {stat.service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedStat && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">API Usage</span>
                <span className="text-sm">{selectedStat.currentUsage} / {selectedStat.maxUsage} requests</span>
              </div>
              <Progress value={usagePercent} className="h-2" variant={getUsageSeverity(usagePercent)} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Resets: {new Date(selectedStat.resetTime).toLocaleTimeString()}</span>
                <span>{usagePercent.toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="whitespace-nowrap"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="rounded-md border">
        <div className="bg-muted/50 p-2 grid grid-cols-5 text-sm font-medium">
          <div>Time</div>
          <div className="col-span-2">Endpoint</div>
          <div>Service</div>
          <div className="text-right">Status</div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {filteredCalls.length > 0 ? (
            filteredCalls.map((call, index) => (
              <div key={index} className="grid grid-cols-5 p-2 border-t">
                <div className="text-xs">{new Date(call.timestamp).toLocaleTimeString()}</div>
                <div className="col-span-2 text-xs font-mono">{call.endpoint}</div>
                <div className="text-xs">{call.service}</div>
                <div className="text-right">
                  <Badge variant={call.status === 200 ? "outline" : "destructive"} className="text-xs">
                    {call.status} {call.status === 200 ? `(${call.responseTime}ms)` : ''}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No API calls recorded yet
            </div>
          )}
        </div>
      </div>
      
      <Card className="shadow-none border-dashed">
        <CardHeader className="py-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="h-4 w-4" />
            Real-Time API Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 text-sm">
          <p>
            This component monitors real-time API usage across all services. It helps track rate limits 
            and identify potential issues with API providers.
          </p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <ul className="list-disc list-inside space-y-1">
            <li>Green: Healthy API usage</li>
            <li>Yellow: Approaching rate limit (70-90%)</li>
            <li>Red: Rate limit exceeded or error response</li>
          </ul>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RealTimeApiUsage;
