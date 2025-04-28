import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ApiUsageStats } from '@/types/trading';
import { ArrowUpRight } from 'lucide-react';
import { Bell, RefreshCw, AlertTriangle } from "lucide-react";
import { ApiUsageStats, CoinOption } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

interface ApiUsageMetricsProps {
  apiUsage: ApiUsageStats[];
  onRefresh: () => void;
}

const ApiUsageMetrics: React.FC<ApiUsageMetricsProps> = ({ apiUsage, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState<string | null>(null);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
    
    toast({
      title: "API metrics refreshed",
      description: "API usage data has been updated"
    });
  };
  
  const getResetTimeFormatted = (resetTime?: string) => {
    if (!resetTime) return "Unknown";
    return formatDistanceToNow(new Date(resetTime), { addSuffix: true });
  };
  
  // Mock data for the usage trend chart
  const mockUsageTrendData = [
    {
      name: "CoinGecko",
      data: [10, 15, 18, 25, 28, 32, 40, 45],
      limit: 100,
      color: "#10b981" // green
    },
    {
      name: "Binance",
      data: [30, 45, 60, 75, 90, 105, 110, 120],
      limit: 1200,
      color: "#f59e0b" // amber
    }
  ];
  
  // Mock history data for timeline view
  const mockUsageHistory = [
    {
      service: "CoinGecko",
      endpoint: "/coins/markets",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      usage: 1,
      success: true
    },
    {
      service: "Binance",
      endpoint: "/api/v3/ticker",
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      usage: 1,
      success: true
    },
    {
      service: "CoinGecko",
      endpoint: "/coins/bitcoin/market_chart",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      usage: 1,
      success: true
    },
    {
      service: "CoinGecko",
      endpoint: "/coins/ethereum/market_chart",
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      usage: 1,
      success: false
    }
  ];
  
  // Sample data for affected coin prices
  const affectedCoins: CoinOption[] = [
    { 
      id: "bitcoin",
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 56000,
      priceChange: 1200,
      changePercent: 2.2,
      volume: 40000000000
    },
    { 
      id: "ethereum",
      name: "Ethereum", 
      symbol: "ETH", 
      price: 2900,
      priceChange: -50,
      changePercent: -1.7,
      volume: 15000000000
    }
  ];
  
  const getUsageColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage < 50) return "bg-green-600";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">API Usage Metrics</h2>
        <Button 
          onClick={handleRefresh} 
          size="sm" 
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="current">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="current">Current Usage</TabsTrigger>
          <TabsTrigger value="trend">Usage Trend</TabsTrigger>
          <TabsTrigger value="history">API Calls</TabsTrigger>
          <TabsTrigger value="impact">Market Impact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Current API Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {apiUsage.map((api) => {
                  const usagePercentage = (api.currentUsage / api.maxUsage) * 100;
                  const isNearLimit = usagePercentage > 80;
                  
                  return (
                    <div key={api.service} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">
                          {api.service}
                          {isNearLimit && (
                            <AlertTriangle className="h-4 w-4 inline-block ml-2 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-sm">
                          {api.currentUsage} / {api.maxUsage} calls
                          <span className="text-xs text-muted-foreground ml-2">
                            Reset: {getResetTimeFormatted(api.resetTime)}
                          </span>
                        </div>
                      </div>
                      
                      <Progress 
                        value={usagePercentage} 
                        className={`h-2 ${usagePercentage > 80 ? 'bg-red-200' : 'bg-muted'}`}
                      />
                      
                      {api.endpoint && (
                        <div className="text-xs text-muted-foreground">
                          Last endpoint: {api.endpoint}
                        </div>
                      )}
                      
                      {isNearLimit && (
                        <div className="text-xs text-yellow-500 flex gap-1 items-center">
                          <AlertTriangle className="h-3 w-3" />
                          <span>
                            {api.service} API is near its limit. Consider slowing down requests.
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>Usage Trend (Last 24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                {/* Basic chart example - in a real app, use a real charting library */}
                <div className="h-full w-full flex items-end justify-around">
                  {mockUsageTrendData.map((service, index) => (
                    <div key={service.name} className="w-full h-full relative flex flex-col justify-end">
                      <div className="text-sm font-medium mb-2">{service.name}</div>
                      <div className="flex h-[70%] items-end space-x-2 mb-6">
                        {service.data.map((value, i) => {
                          const height = (value / service.limit) * 100;
                          const isHighUsage = value / service.limit > 0.8;
                          
                          return (
                            <div
                              key={i}
                              style={{ height: `${height}%`, backgroundColor: isHighUsage ? "#ef4444" : service.color }}
                              className="w-full rounded-t-sm relative group"
                            >
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-background text-xs px-1 py-0.5 rounded border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {value} / {service.limit} ({Math.round(value / service.limit * 100)}%)
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="absolute bottom-0 w-full border-t flex justify-between text-xs text-muted-foreground">
                        <span>-24h</span>
                        <span>Now</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <h4 className="font-medium text-foreground mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Implement rate limiting for the CoinGecko API</li>
                  <li>Consider using local caching for frequently accessed data</li>
                  <li>Schedule non-critical API calls during off-peak hours</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent API Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsageHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{entry.service}</div>
                      <div className="text-sm text-muted-foreground">{entry.endpoint}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant={entry.success ? "outline" : "destructive"}>
                        {entry.success ? "Success" : "Failed"}
                      </Badge>
                      <span className="text-xs text-muted-foreground mt-1">
                        +{entry.usage} call
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="impact">
          <Card>
            <CardHeader>
              <CardTitle>Market Data Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm mb-4">
                  When API rate limits are reached, market data for these assets may be affected:
                </div>
                
                {affectedCoins.map((coin) => (
                  <div key={coin.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-xs ml-2 bg-muted px-2 py-0.5 rounded">
                        {coin.symbol}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${coin.price.toLocaleString()}</div>
                      <div className={`text-sm ${coin.changePercent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.changePercent > 0 ? '+' : ''}{coin.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="bg-muted/50 p-3 rounded-lg text-sm mt-6">
                  <h4 className="font-medium mb-2">Mitigation Strategies</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use websocket connections for real-time data where possible</li>
                    <li>Implement smart caching strategies for price data</li>
                    <li>Reduce polling frequency during periods of low activity</li>
                    <li>Consider premium API tiers for critical trading functionality</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiUsageMetrics;
