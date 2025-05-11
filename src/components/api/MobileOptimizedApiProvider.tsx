
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, AlertTriangle, Server, X } from 'lucide-react';

interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
  enabled: boolean;
  requiresAuth: boolean; // Use this property instead of authRequired
  apiKey?: string;
  status?: 'online' | 'offline' | 'degraded';
  currentUsage?: number;
  maxUsage?: number;
  resetTime?: string;
}

interface MobileOptimizedApiProviderProps {
  provider: ApiProvider;
  onToggle: (id: string, enabled: boolean) => void;
  onConfigure: (id: string) => void;
}

const MobileOptimizedApiProvider: React.FC<MobileOptimizedApiProviderProps> = ({ 
  provider, 
  onToggle, 
  onConfigure 
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'degraded': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };
  
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'online': return <Check className="h-4 w-4" />;
      case 'offline': return <X className="h-4 w-4" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center">
            <Server className="h-4 w-4 mr-2" /> {provider.name}
          </CardTitle>
          <Switch checked={provider.enabled} onCheckedChange={(checked) => onToggle(provider.id, checked)} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col space-y-2 text-sm">
          {provider.description && (
            <p className="text-muted-foreground">{provider.description}</p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Authentication:</span>
            <span>{provider.requiresAuth ? 'Required' : 'Not Required'}</span>
          </div>
          
          {provider.status && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge className={getStatusColor(provider.status)}>
                <span className="flex items-center">
                  {getStatusIcon(provider.status)} <span className="ml-1">{provider.status}</span>
                </span>
              </Badge>
            </div>
          )}
          
          {provider.currentUsage !== undefined && provider.maxUsage !== undefined && (
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">API Usage:</span>
                <span>{provider.currentUsage}/{provider.maxUsage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                <div 
                  className={`h-1.5 rounded-full ${
                    (provider.currentUsage / provider.maxUsage) > 0.8 
                      ? 'bg-red-500' 
                      : (provider.currentUsage / provider.maxUsage) > 0.6 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                  }`} 
                  style={{ width: `${(provider.currentUsage / provider.maxUsage) * 100}%` }}
                />
              </div>
              {provider.resetTime && (
                <div className="text-xs text-right text-muted-foreground">
                  Reset: {provider.resetTime}
                </div>
              )}
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 w-full" 
            onClick={() => onConfigure(provider.id)}
            disabled={!provider.enabled}
          >
            {provider.apiKey ? 'Configure API Key' : 'Add API Key'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileOptimizedApiProvider;
