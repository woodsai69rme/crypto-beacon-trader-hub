import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface ApiStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  latency: number;
  lastChecked: string;
}

const ApiStatusIndicator = () => {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    {
      name: "Binance",
      status: "operational",
      latency: 124,
      lastChecked: new Date().toISOString()
    },
    {
      name: "Coinbase",
      status: "operational",
      latency: 156,
      lastChecked: new Date().toISOString()
    },
    {
      name: "CoinGecko",
      status: "degraded",
      latency: 452,
      lastChecked: new Date().toISOString()
    },
    {
      name: "CryptoCompare",
      status: "operational",
      latency: 189,
      lastChecked: new Date().toISOString()
    },
    {
      name: "Kraken",
      status: "operational",
      latency: 143,
      lastChecked: new Date().toISOString()
    },
    {
      name: "FTX",
      status: "outage",
      latency: 0,
      lastChecked: new Date().toISOString()
    }
  ]);

  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    // Simulate periodic refreshes
    const interval = setInterval(() => {
      simulateStatusUpdates();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const simulateStatusUpdates = () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const updatedStatuses = apiStatuses.map(api => {
        // Randomize latency with some variation but keep status mostly the same
        const latencyVariation = Math.floor(Math.random() * 50) - 25; // -25 to +25 ms
        let newLatency = api.latency + latencyVariation;
        if (newLatency < 0) newLatency = 10;
        
        // Small chance to change status
        let newStatus = api.status;
        const changeStatusChance = Math.random();
        if (changeStatusChance > 0.92) {
          const statuses: ApiStatus['status'][] = ['operational', 'degraded', 'outage', 'maintenance'];
          newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        }

        return {
          ...api,
          status: newStatus,
          latency: newLatency,
          lastChecked: new Date().toISOString()
        };
      });

      setApiStatuses(updatedStatuses);
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    }, 800);
  };

  const getStatusBadge = (status: ApiStatus['status']) => {
    switch (status) {
      case 'operational':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500">Operational</Badge>;
      case 'degraded':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Degraded</Badge>;
      case 'outage':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500">Outage</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Maintenance</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getLatencyIndicator = (latency: number) => {
    if (latency === 0) return null;
    
    if (latency < 150) {
      return <span className="text-green-500">{latency}ms</span>;
    } else if (latency < 300) {
      return <span className="text-yellow-500">{latency}ms</span>;
    } else {
      return <span className="text-red-500">{latency}ms</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">API Service Status</h3>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={simulateStatusUpdates}
          disabled={isRefreshing}
          className="text-sm flex items-center text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <Clock className="h-4 w-4 mr-1" />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Service Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center rounded-md border p-3">
              <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
              <div className="text-lg font-medium">
                {apiStatuses.filter(api => api.status === 'operational').length}
              </div>
              <div className="text-xs text-muted-foreground">Operational</div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-md border p-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mb-1" />
              <div className="text-lg font-medium">
                {apiStatuses.filter(api => api.status === 'degraded').length}
              </div>
              <div className="text-xs text-muted-foreground">Degraded</div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-md border p-3">
              <AlertCircle className="h-5 w-5 text-red-500 mb-1" />
              <div className="text-lg font-medium">
                {apiStatuses.filter(api => ['outage', 'maintenance'].includes(api.status)).length}
              </div>
              <div className="text-xs text-muted-foreground">Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="rounded-md border">
        <div className="bg-muted/50 p-2 grid grid-cols-4 text-sm font-medium">
          <div>Service</div>
          <div>Status</div>
          <div>Latency</div>
          <div>Last Checked</div>
        </div>

        {apiStatuses.map((api) => (
          <div key={api.name} className="grid grid-cols-4 p-2 border-t items-center">
            <div className="font-medium">{api.name}</div>
            <div>{getStatusBadge(api.status)}</div>
            <div>{getLatencyIndicator(api.latency)}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(api.lastChecked).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiStatusIndicator;
