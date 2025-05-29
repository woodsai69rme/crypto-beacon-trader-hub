
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { ApiUsageStats } from '@/types/trading';

interface ApiUsageMetricsProps {
  data: ApiUsageStats[];
  onRefresh: () => void;
}

const ApiUsageMetrics: React.FC<ApiUsageMetricsProps> = ({ data, onRefresh }) => {
  const getUsagePercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">API Usage Monitoring</h3>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((api) => {
          const usagePercentage = getUsagePercentage(api.currentUsage!, api.maxUsage!);
          
          return (
            <Card key={api.service}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{api.service}</CardTitle>
                  {getStatusIcon(usagePercentage)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Usage</span>
                      <span className={getStatusColor(usagePercentage)}>
                        {api.currentUsage}/{api.maxUsage}
                      </span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">Success Rate</div>
                      <div className="font-medium">
                        {((api.successfulCalls! / api.totalCalls!) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Avg Response</div>
                      <div className="font-medium">{api.avgResponseTime}ms</div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <div>Resets: {api.resetTime}</div>
                    <div>Endpoint: {api.endpoint}</div>
                  </div>

                  {usagePercentage >= 90 && (
                    <Badge variant="destructive" className="text-xs">
                      Near Limit
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ApiUsageMetrics;
