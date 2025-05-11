import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiProvider } from '@/types/trading';

interface MobileOptimizedApiProviderProps {
  provider: ApiProvider;
  onToggle: (providerId: string, isActive: boolean) => void;
  onEdit: (providerId: string) => void;
}

const MobileOptimizedApiProvider: React.FC<MobileOptimizedApiProviderProps> = ({
  provider,
  onToggle,
  onEdit
}) => {
  const usagePercentage = (provider.currentUsage / provider.maxUsage) * 100;
  const usageStatus = usagePercentage > 90 
    ? 'danger' 
    : usagePercentage > 70 
      ? 'warning' 
      : 'success';
  
  // Formats reset time to be more readable
  const formatResetTime = (resetTime: string) => {
    try {
      const date = new Date(resetTime);
      const now = new Date();
      
      // If it's today, just show the time
      if (date.toDateString() === now.toDateString()) {
        return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      
      // If it's tomorrow
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (date.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      
      // Otherwise show date and time
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return resetTime;
    }
  };
  
  const isAuthenticated = provider.requiresAuth;
  
  return (
    <Card className={`border-l-4 ${
      !provider.isActive ? 'border-l-gray-300' : 
      provider.status === 'online' ? 'border-l-green-500' : 
      provider.status === 'degraded' ? 'border-l-yellow-500' : 
      'border-l-red-500'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium flex items-center">
            {provider.name}
            <Badge 
              variant={provider.status === 'online' ? 'outline' : 'destructive'} 
              className="ml-2 text-xs"
            >
              {provider.status}
            </Badge>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onToggle(provider.id, !provider.isActive)}
            className={provider.isActive ? "text-green-600" : "text-gray-400"}
          >
            {provider.isActive ? "Enabled" : "Disabled"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div>
            <span>Endpoint: </span>
            <code className="bg-muted px-1 rounded text-xs">{provider.endpoint}</code>
          </div>
          
          {isAuthenticated && (
            <Badge variant="secondary" className="text-xs">
              Auth Required
            </Badge>
          )}
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>API Usage</span>
            <span className={`
              ${usageStatus === 'danger' ? 'text-red-600' : 
                usageStatus === 'warning' ? 'text-yellow-600' : 
                'text-green-600'}
            `}>
              {provider.currentUsage}/{provider.maxUsage} requests
            </span>
          </div>
          
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                usageStatus === 'danger' ? 'bg-red-600' : 
                usageStatus === 'warning' ? 'bg-yellow-500' : 
                'bg-green-600'
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          
          <div className="text-xs text-muted-foreground mt-1">
            Resets: {formatResetTime(provider.resetTime)}
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => onEdit(provider.id)}
          >
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileOptimizedApiProvider;
