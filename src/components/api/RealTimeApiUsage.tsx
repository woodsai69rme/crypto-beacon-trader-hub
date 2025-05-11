
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ApiUsageStats } from '@/types/trading';

const RealTimeApiUsage: React.FC = () => {
  const [apiUsage, setApiUsage] = useState<ApiUsageStats[]>([
    {
      provider: "CoinGecko",
      service: "CoinGecko",
      serviceId: "coingecko-1",
      serviceName: "CoinGecko",
      totalRequests: 5243,
      periodRequests: 243,
      requestsLimit: 10000,
      averageResponseTime: 247,
      errorRate: 0.5,
      lastRequested: "2023-05-01T12:34:56Z",
      currentUsage: 243,
      maxUsage: 10000,
      endpoint: "coins/markets",
      requestCount: 5243,
      successCount: 5200,
      errorCount: 43,
      avgResponseTime: 247,
      lastUsed: "2023-05-01T12:34:56Z"
    },
    {
      provider: "Binance",
      service: "Binance",
      serviceId: "binance-1",
      serviceName: "Binance",
      totalRequests: 8754,
      periodRequests: 754,
      requestsLimit: 20000,
      averageResponseTime: 124,
      errorRate: 0.2,
      lastRequested: "2023-05-01T13:45:12Z",
      currentUsage: 754,
      maxUsage: 20000,
      endpoint: "ticker/24hr",
      requestCount: 8754,
      successCount: 8720,
      errorCount: 34,
      avgResponseTime: 124,
      lastUsed: "2023-05-01T13:45:12Z"
    },
    {
      provider: "Kraken",
      service: "Kraken",
      serviceId: "kraken-1",
      serviceName: "Kraken",
      totalRequests: 2134,
      periodRequests: 134,
      requestsLimit: 5000,
      averageResponseTime: 189,
      errorRate: 1.2,
      lastRequested: "2023-05-01T11:22:33Z",
      currentUsage: 134,
      maxUsage: 5000,
      endpoint: "public/Ticker",
      requestCount: 2134,
      successCount: 2110,
      errorCount: 24,
      avgResponseTime: 189,
      lastUsed: "2023-05-01T11:22:33Z"
    }
  ]);
  
  // Simulate real-time API usage updates
  useEffect(() => {
    const interval = setInterval(() => {
      setApiUsage(prev => prev.map(api => ({
        ...api,
        periodRequests: (api.periodRequests || 0) + Math.floor(Math.random() * 5),
        totalRequests: (api.totalRequests || 0) + Math.floor(Math.random() * 5),
        requestCount: (api.requestCount || 0) + Math.floor(Math.random() * 5),
        currentUsage: api.currentUsage + Math.floor(Math.random() * 5),
        averageResponseTime: (api.averageResponseTime || 0) + (Math.random() * 10 - 5),
        avgResponseTime: (api.avgResponseTime || 0) + (Math.random() * 10 - 5),
        lastRequested: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      })));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusBadge = (api: ApiUsageStats) => {
    const usage = api.currentUsage / api.maxUsage * 100;
    
    if (usage > 90) return <Badge variant="destructive">Critical</Badge>;
    if (usage > 75) return <Badge variant="warning">Warning</Badge>;
    return <Badge variant="outline">Healthy</Badge>;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time API Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {apiUsage.map((api) => (
            <div key={api.service} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium flex items-center">
                    {api.serviceName || api.service} 
                    <span className="ml-2">{getStatusBadge(api)}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Last request: {new Date(api.lastRequested || api.lastUsed || new Date()).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {api.currentUsage} / {api.maxUsage}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(api.errorRate || 0).toFixed(1)}% error rate
                  </p>
                </div>
              </div>
              
              <Progress 
                value={api.currentUsage / api.maxUsage * 100} 
                className="h-2" 
              />
              
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Total: {(api.totalRequests || api.requestCount || 0).toLocaleString()} requests</span>
                <span>Avg: {(api.averageResponseTime || api.avgResponseTime || 0).toFixed(0)}ms</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeApiUsage;
