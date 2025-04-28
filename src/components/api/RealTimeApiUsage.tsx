
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ApiUsageStats } from "@/types/trading";

interface RealTimeApiUsageProps {
  className?: string;
}

const RealTimeApiUsage: React.FC<RealTimeApiUsageProps> = ({ className }) => {
  const [selectedService, setSelectedService] = useState<string>("coingecko");
  const [apiStats, setApiStats] = useState<ApiUsageStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    fetchApiUsage();
    
    // Set up auto-refresh every minute
    const intervalId = setInterval(fetchApiUsage, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const fetchApiUsage = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would fetch from an API usage endpoint
      // Using mock data for demonstration
      const mockStats = generateMockApiStats();
      setApiStats(mockStats);
      
      // Check for warnings
      const warnings = mockStats.filter(stat => stat.currentUsage > stat.maxUsage * 0.8);
      if (warnings.length > 0) {
        toast({
          title: "API Usage Warning",
          description: `${warnings.length} API services are approaching their rate limits`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching API usage:", error);
      toast({
        title: "API Error",
        description: "Failed to fetch API usage statistics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateMockApiStats = (): ApiUsageStats[] => {
    return [
      {
        service: "coingecko",
        currentUsage: Math.floor(Math.random() * 40) + 10,
        maxUsage: 50,
        resetTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        endpoint: "/coins/markets"
      },
      {
        service: "coinmarketcap",
        currentUsage: Math.floor(Math.random() * 8000) + 1000,
        maxUsage: 10000,
        resetTime: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
        endpoint: "/cryptocurrency/listings/latest"
      },
      {
        service: "cryptocompare",
        currentUsage: Math.floor(Math.random() * 90) + 10,
        maxUsage: 100,
        resetTime: new Date(Date.now() + 60000).toISOString(), // 1 minute from now
        endpoint: "/data/price"
      },
      {
        service: "hyblock",
        currentUsage: Math.floor(Math.random() * 45) + 5,
        maxUsage: 100,
        resetTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        endpoint: "/liquidity/heatmap"
      },
      {
        service: "tradingview",
        currentUsage: Math.floor(Math.random() * 200) + 50,
        maxUsage: 300,
        resetTime: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
        endpoint: "/chart"
      }
    ];
  };
  
  const getUsagePercentage = (stat: ApiUsageStats): number => {
    return (stat.currentUsage / stat.maxUsage) * 100;
  };
  
  const getProgressColor = (percentage: number): string => {
    if (percentage > 90) return "bg-red-500";
    if (percentage > 75) return "bg-amber-500";
    if (percentage > 50) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const formatResetTime = (resetTime: string): string => {
    const resetDate = new Date(resetTime);
    const now = new Date();
    const diffMs = resetDate.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };
  
  const getSelectedServiceStats = (): ApiUsageStats | undefined => {
    return apiStats.find(stat => stat.service === selectedService);
  };
  
  const handleRefresh = () => {
    fetchApiUsage();
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <CardTitle>API Usage Monitor</CardTitle>
            <CardDescription>Real-time API rate limit tracking</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select API" />
              </SelectTrigger>
              <SelectContent>
                {apiStats.map(stat => (
                  <SelectItem key={stat.service} value={stat.service}>
                    {stat.service.charAt(0).toUpperCase() + stat.service.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              className={isLoading ? "animate-spin" : ""}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Selected Service Detail */}
          {getSelectedServiceStats() && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">
                    {getSelectedServiceStats()?.service.charAt(0).toUpperCase() + getSelectedServiceStats()?.service.slice(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Endpoint: {getSelectedServiceStats()?.endpoint}
                  </div>
                </div>
                
                <Badge variant={
                  getUsagePercentage(getSelectedServiceStats()!) > 75 ? "destructive" : "outline"
                }>
                  {getSelectedServiceStats()?.currentUsage} / {getSelectedServiceStats()?.maxUsage} requests
                </Badge>
              </div>
              
              <Progress
                value={getUsagePercentage(getSelectedServiceStats()!)}
                className={getProgressColor(getUsagePercentage(getSelectedServiceStats()!))}
              />
              
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-muted-foreground">Usage: </span>
                  <span className="font-medium">{getUsagePercentage(getSelectedServiceStats()!).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Resets in: </span>
                  <span className="font-medium">{formatResetTime(getSelectedServiceStats()!.resetTime!)}</span>
                </div>
              </div>
              
              {getUsagePercentage(getSelectedServiceStats()!) > 75 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    High API usage detected. Consider reducing request frequency or upgrading your plan.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          {/* All Services Summary */}
          <div>
            <div className="text-sm font-medium mb-3">All API Services</div>
            <div className="space-y-3">
              {apiStats.map(stat => (
                <div
                  key={stat.service}
                  className={`p-3 rounded-md border ${
                    selectedService === stat.service ? 'border-primary' : ''
                  } cursor-pointer`}
                  onClick={() => setSelectedService(stat.service)}
                >
                  <div className="flex justify-between mb-1">
                    <div className="font-medium">{stat.service.charAt(0).toUpperCase() + stat.service.slice(1)}</div>
                    <div className="text-sm">
                      {stat.currentUsage} / {stat.maxUsage}
                    </div>
                  </div>
                  
                  <Progress
                    value={getUsagePercentage(stat)}
                    className={`h-1.5 ${getProgressColor(getUsagePercentage(stat))}`}
                  />
                  
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <div>Resets in {formatResetTime(stat.resetTime!)}</div>
                    {getUsagePercentage(stat) > 75 && (
                      <div className="flex items-center text-amber-500">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        <span>Warning</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Rate Limiting Tips */}
          <div className="border rounded-md p-3 text-sm">
            <div className="font-medium mb-2">Rate Limiting Tips</div>
            <ul className="space-y-1 list-disc pl-5 text-muted-foreground text-xs">
              <li>Cache API responses when possible</li>
              <li>Implement exponential backoff for retries</li>
              <li>Use fallback data providers when limits are reached</li>
              <li>Consider upgrading to paid API plans for higher limits</li>
              <li>Batch requests where supported by the API</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeApiUsage;
