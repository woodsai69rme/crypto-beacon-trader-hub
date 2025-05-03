
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ApiUsageStats } from '@/types/trading';

const RealTimeApiUsage: React.FC = () => {
  const [apiUsage, setApiUsage] = useState<ApiUsageStats[]>([
    {
      serviceId: "coingecko-1",
      serviceName: "CoinGecko",
      totalRequests: 5243,
      periodRequests: 243,
      requestsLimit: 10000,
      averageResponseTime: 247,
      errorRate: 0.5,
      lastRequested: "2023-05-01T12:34:56Z",
      id: "1",
      currentUsage: 243,
      maxUsage: 10000
    },
    {
      serviceId: "binance-1",
      serviceName: "Binance",
      totalRequests: 8754,
      periodRequests: 754,
      requestsLimit: 20000,
      averageResponseTime: 124,
      errorRate: 0.2,
      lastRequested: "2023-05-01T13:45:12Z",
      id: "2",
      currentUsage: 754,
      maxUsage: 20000
    },
    {
      serviceId: "kraken-1",
      serviceName: "Kraken",
      totalRequests: 2134,
      periodRequests: 134,
      requestsLimit: 5000,
      averageResponseTime: 189,
      errorRate: 1.2,
      lastRequested: "2023-05-01T11:22:33Z",
      id: "3",
      currentUsage: 134,
      maxUsage: 5000
    }
  ]);
  
  // Simulate real-time API usage updates
  useEffect(() => {
    const interval = setInterval(() => {
      setApiUsage(prev => prev.map(api => ({
        ...api,
        periodRequests: api.periodRequests + Math.floor(Math.random() * 5),
        totalRequests: api.totalRequests + Math.floor(Math.random() * 5),
        currentUsage: (api.currentUsage || 0) + Math.floor(Math.random() * 5),
        averageResponseTime: api.averageResponseTime + (Math.random() * 10 - 5),
        lastRequested: new Date().toISOString()
      })));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusBadge = (api: ApiUsageStats) => {
    const usage = (api.currentUsage || api.periodRequests) / (api.maxUsage || api.requestsLimit) * 100;
    
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
            <div key={api.serviceId} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium flex items-center">
                    {api.serviceName} 
                    <span className="ml-2">{getStatusBadge(api)}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Last request: {new Date(api.lastRequested).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {(api.currentUsage || api.periodRequests)} / {(api.maxUsage || api.requestsLimit)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {api.errorRate.toFixed(1)}% error rate
                  </p>
                </div>
              </div>
              
              <Progress 
                value={(api.currentUsage || api.periodRequests) / (api.maxUsage || api.requestsLimit) * 100} 
                className="h-2" 
              />
              
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Total: {api.totalRequests.toLocaleString()} requests</span>
                <span>Avg: {api.averageResponseTime.toFixed(0)}ms</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeApiUsage;
