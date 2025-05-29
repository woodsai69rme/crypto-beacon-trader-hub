
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Zap } from "lucide-react";

interface ApiCall {
  id: string;
  service: string;
  endpoint: string;
  status: 'success' | 'error' | 'pending';
  responseTime: number;
  timestamp: Date;
}

const RealTimeApiUsage: React.FC = () => {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);

  useEffect(() => {
    // Simulate real-time API calls
    const interval = setInterval(() => {
      const newCall: ApiCall = {
        id: Math.random().toString(36).substr(2, 9),
        service: ['CoinGecko', 'Binance', 'OpenRouter'][Math.floor(Math.random() * 3)],
        endpoint: ['/coins/markets', '/ticker/24hr', '/chat/completions'][Math.floor(Math.random() * 3)],
        status: Math.random() > 0.1 ? 'success' : 'error',
        responseTime: Math.floor(Math.random() * 500) + 100,
        timestamp: new Date()
      };

      setApiCalls(prev => [newCall, ...prev].slice(0, 20));
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 200) return 'text-green-600';
    if (time < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Real-Time API Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {apiCalls.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Waiting for API calls...</p>
            </div>
          ) : (
            apiCalls.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(call.status)}`} />
                  <div>
                    <div className="font-medium">{call.service}</div>
                    <div className="text-sm text-muted-foreground">{call.endpoint}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    <span className={getResponseTimeColor(call.responseTime)}>
                      {call.responseTime}ms
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{call.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <Badge variant={call.status === 'success' ? 'default' : 'destructive'}>
                    {call.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeApiUsage;
