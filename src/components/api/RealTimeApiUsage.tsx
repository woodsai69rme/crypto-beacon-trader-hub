
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiUsageStats } from '@/types/trading';
import { Activity, AlertTriangle } from 'lucide-react';

interface RealTimeApiUsageProps {
  selectedService: string;
  onServiceSelect: (service: string) => void;
}

const RealTimeApiUsage: React.FC<RealTimeApiUsageProps> = ({ selectedService, onServiceSelect }) => {
  const [apiUsageStats, setApiUsageStats] = useState<ApiUsageStats[]>([]);
  const [recentCalls, setRecentCalls] = useState<{
    endpoint: string;
    timestamp: number;
    responseTime: number;
    success: boolean;
  }[]>([]);
  
  // Simulate real-time API monitoring
  useEffect(() => {
    // Initial data
    setApiUsageStats([
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
      }
    ]);
    
    // Random call generator
    const interval = setInterval(() => {
      const endpoints = [
        "/api/v3/ticker", 
        "/api/v3/depth", 
        "/api/v3/trades", 
        "/coins/markets",
        "/coins/bitcoin/market_chart"
      ];
      const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      const responseTime = Math.floor(Math.random() * 500 + 50);
      const success = Math.random() > 0.1;
      
      setRecentCalls(prev => {
        const newCalls = [
          {
            endpoint: randomEndpoint,
            timestamp: Date.now(),
            responseTime,
            success
          },
          ...prev.slice(0, 9) // Keep only last 10
        ];
        return newCalls;
      });
      
      // Randomly increment usage stats
      if (Math.random() > 0.5) {
        setApiUsageStats(prev => 
          prev.map(stat => ({
            ...stat,
            currentUsage: stat.currentUsage + (Math.random() > 0.7 ? 1 : 0)
          }))
        );
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getResponseTimeClass = (time: number) => {
    if (time < 100) return "text-green-500";
    if (time < 300) return "text-yellow-500";
    return "text-red-500";
  };
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium mb-1">Real-Time API Monitoring</h2>
          <p className="text-sm text-muted-foreground">
            Monitor live API usage and performance metrics
          </p>
        </div>
        
        <Select value={selectedService} onValueChange={onServiceSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CoinGecko">CoinGecko</SelectItem>
            <SelectItem value="Binance">Binance</SelectItem>
            <SelectItem value="All">All Services</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex justify-between items-start">
              <h3 className="font-medium">Current Rate</h3>
              <Badge>Last Minute</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{recentCalls.length}</span>
              <span className="text-muted-foreground">requests/min</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex justify-between items-start">
              <h3 className="font-medium">Avg Response Time</h3>
              <Badge>Last Minute</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {recentCalls.length > 0 
                  ? Math.round(recentCalls.reduce((acc, call) => acc + call.responseTime, 0) / recentCalls.length)
                  : 0}
              </span>
              <span className="text-muted-foreground">ms</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex justify-between items-start">
              <h3 className="font-medium">Error Rate</h3>
              <Badge variant={recentCalls.some(call => !call.success) ? "destructive" : "outline"}>
                Last Minute
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${
                recentCalls.some(call => !call.success) ? 'text-red-500' : 'text-green-500'
              }`} />
              <span className="text-2xl font-bold">
                {recentCalls.length > 0 
                  ? (recentCalls.filter(call => !call.success).length / recentCalls.length * 100).toFixed(1)
                  : '0.0'}%
              </span>
              <span className="text-muted-foreground">error rate</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Live API Calls</h3>
          
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-4 bg-muted/50 p-2 text-xs font-medium">
              <div>Endpoint</div>
              <div>Time</div>
              <div className="text-right">Response Time</div>
              <div className="text-right">Status</div>
            </div>
            
            <div className="divide-y max-h-[400px] overflow-auto">
              {recentCalls.length > 0 ? (
                recentCalls.map((call, index) => (
                  <div key={index} className="grid grid-cols-4 p-2 text-sm animate-fade-in">
                    <div className="text-xs truncate">{call.endpoint}</div>
                    <div className="text-xs text-muted-foreground">{formatTimestamp(call.timestamp)}</div>
                    <div className={`text-right ${getResponseTimeClass(call.responseTime)}`}>
                      {call.responseTime} ms
                    </div>
                    <div className="text-right">
                      <Badge variant={call.success ? "outline" : "destructive"} className="text-xs">
                        {call.success ? '200 OK' : '429 Error'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No API calls detected yet
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeApiUsage;
