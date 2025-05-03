
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ApiUsageStats } from '@/types/trading';

interface ApiUsageMetricsProps {
  stats: ApiUsageStats[];
}

const ApiUsageMetrics: React.FC<ApiUsageMetricsProps> = ({ stats }) => {
  if (!stats || stats.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <p className="text-muted-foreground">No API usage data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Usage Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stats.map((stat) => (
            <div key={stat.serviceId} className="space-y-2">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{stat.serviceName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {stat.endpoint || 'All endpoints'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {stat.currentUsage !== undefined && stat.maxUsage !== undefined ? 
                      `${stat.currentUsage} / ${stat.maxUsage}` : 
                      `${stat.periodRequests} / ${stat.requestsLimit}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.resetTime ? `Resets: ${new Date(stat.resetTime).toLocaleString()}` : 'Current period'}
                  </p>
                </div>
              </div>

              <Progress 
                value={
                  stat.currentUsage !== undefined && stat.maxUsage !== undefined ? 
                    (stat.currentUsage / stat.maxUsage * 100) : 
                    (stat.periodRequests / stat.requestsLimit * 100)
                } 
                className="h-2"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Response: {stat.averageResponseTime}ms</span>
                <span>Error Rate: {stat.errorRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiUsageMetrics;
