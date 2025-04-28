
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ApiUsageStats, CoinOption } from '@/types/trading';
import { BarChart, RefreshCw } from 'lucide-react';

interface ApiUsageMetricsProps {
  apiUsage: ApiUsageStats[];
  onRefresh: () => void;
}

const ApiUsageMetrics: React.FC<ApiUsageMetricsProps> = ({ apiUsage, onRefresh }) => {
  const [timeRange, setTimeRange] = useState<string>("daily");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const sampleCoinData: CoinOption[] = [
    { 
      id: "bitcoin", 
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 61245.32,
      priceChange: 1200,
      changePercent: 2.3,
      marketCap: 1180000000000
    },
    { 
      id: "ethereum", 
      name: "Ethereum", 
      symbol: "ETH", 
      price: 3010.45,
      priceChange: -120,
      changePercent: -1.5,
      marketCap: 360000000000
    }
  ];
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onRefresh();
      setIsRefreshing(false);
    }, 1000);
  };
  
  const getUsagePercentage = (current: number, max: number): number => {
    return Math.min((current / max) * 100, 100);
  };
  
  const getTimeUntilReset = (resetTime: string): string => {
    const resetDate = new Date(resetTime);
    const now = new Date();
    
    // Calculate difference in hours
    const diffMs = resetDate.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs <= 0 && diffMins <= 0) {
      return "Resetting soon";
    }
    
    return `${diffHrs}h ${diffMins}m`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-medium mb-1">API Usage Metrics</h2>
          <p className="text-sm text-muted-foreground">
            Monitor your API calls and limits across different services
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Last Hour</SelectItem>
              <SelectItem value="daily">Last 24 Hours</SelectItem>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            disabled={isRefreshing}
            onClick={handleRefresh}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {apiUsage.map(usage => (
          <Card key={usage.service}>
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-between items-start">
                <div>
                  <h3 className="font-medium mb-1">{usage.service}</h3>
                  <p className="text-xs text-muted-foreground">
                    {usage.endpoint || "All endpoints"}
                  </p>
                </div>
                <Badge 
                  variant={usage.currentUsage > usage.maxUsage * 0.8 ? "destructive" : "outline"}
                >
                  {getUsagePercentage(usage.currentUsage, usage.maxUsage).toFixed(0)}% Used
                </Badge>
              </div>
              
              <Progress 
                value={getUsagePercentage(usage.currentUsage, usage.maxUsage)} 
                className="h-2"
              />
              
              <div className="mt-2 grid grid-cols-2 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">{usage.currentUsage}</span> / {usage.maxUsage} calls
                </div>
                {usage.resetTime && (
                  <div className="text-right">
                    Resets in: <span className="font-medium">{getTimeUntilReset(usage.resetTime)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Sample usage chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Usage Over Time</h3>
              <div className="h-72 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <BarChart className="h-10 w-10" />
                  <p>API usage charts would be displayed here</p>
                  <p className="text-sm">Time-series data of API calls by service</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sample impact on market data */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Market Data Freshness</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-2">
                  The freshness of your market data depends on your API call frequency:
                </p>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-4 bg-muted/50 p-2 text-xs font-medium">
                    <div>Asset</div>
                    <div>Price</div>
                    <div className="text-right">24h Change</div>
                    <div className="text-right">Last Updated</div>
                  </div>
                  
                  <div className="divide-y">
                    {sampleCoinData.map(coin => {
                      const isPositive = (coin.priceChange || 0) >= 0;
                      return (
                        <div key={coin.id} className="grid grid-cols-4 p-2 text-sm">
                          <div>{coin.name}</div>
                          <div>${coin.price.toLocaleString()}</div>
                          <div className={`text-right ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? '+' : ''}{coin.changePercent?.toFixed(2)}%
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            {coin.changePercent && coin.changePercent > 0 ? '2 mins ago' : '5 mins ago'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  💡 Pro tip: Balance your API call frequency to stay within limits while keeping data fresh.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApiUsageMetrics;
