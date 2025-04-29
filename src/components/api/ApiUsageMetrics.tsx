
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ApiUsageStats } from '@/types/trading';

interface ApiUsageMetricsProps {
  apiUsage: ApiUsageStats[];
  onRefresh: () => void;
}

const ApiUsageMetrics: React.FC<ApiUsageMetricsProps> = ({ apiUsage, onRefresh }) => {
  // Format time remaining until reset
  const formatTimeRemaining = (resetTime: string): string => {
    if (!resetTime) return 'Unknown';
    
    const now = new Date();
    const reset = new Date(resetTime);
    const diffMs = reset.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Resetting soon';
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 24) {
      const days = Math.floor(diffHrs / 24);
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
    
    return `${diffHrs}h ${diffMins}m`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Usage Metrics</CardTitle>
            <CardDescription>Monitor your API consumption and rate limits</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {apiUsage && apiUsage.length > 0 ? (
          <div className="space-y-6">
            {apiUsage.map((api) => (
              <div key={api.service} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-semibold">{api.service}</h4>
                    <p className="text-xs text-muted-foreground">
                      {api.endpoint || 'All endpoints'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {api.currentUsage} / {api.maxUsage} calls
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Resets in: {formatTimeRemaining(api.resetTime || '')}
                    </p>
                  </div>
                </div>
                
                <Progress 
                  value={(api.currentUsage / api.maxUsage) * 100} 
                  className={`h-2 ${api.currentUsage / api.maxUsage > 0.8 ? 'bg-red-100' : 'bg-primary/20'}`}
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {Math.round((api.currentUsage / api.maxUsage) * 100)}% used
                  </span>
                  <span>
                    {api.maxUsage - api.currentUsage} calls remaining
                  </span>
                </div>
                
                {(api.currentUsage / api.maxUsage) > 0.8 && (
                  <div className="text-xs text-amber-500 flex items-center gap-1 mt-1">
                    <span className="rounded-full bg-amber-500/20 p-0.5 w-4 h-4 flex items-center justify-center text-amber-500 font-bold">!</span>
                    <span>Approaching rate limit, consider reducing request frequency</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No API usage data available</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Metrics
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiUsageMetrics;
