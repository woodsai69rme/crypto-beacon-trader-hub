
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ApiProvider } from '@/types/trading';
import { CheckCircle2, ExternalLink, Info, Key, Lock, Shield, XCircle } from 'lucide-react';

interface MobileOptimizedApiProviderProps {
  provider: ApiProvider;
  onToggle: (id: string, enabled: boolean) => void;
}

const MobileOptimizedApiProvider: React.FC<MobileOptimizedApiProviderProps> = ({
  provider,
  onToggle
}) => {
  const handleToggle = () => {
    onToggle(provider.id, !(provider.enabled ?? false));
  };
  
  // Calculate appropriate badge color based on provider status
  const getBadgeVariant = () => {
    if (provider.enabled) return "default";
    return "secondary";
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{provider.name}</CardTitle>
          </div>
          <Badge variant={getBadgeVariant()}>
            {provider.enabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {provider.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Authentication</span>
            </div>
            {provider.requiresAuth || provider.authRequired ? (
              <div className="flex items-center text-amber-500">
                <Lock className="h-4 w-4 mr-1" />
                <span>Required</span>
              </div>
            ) : (
              <div className="flex items-center text-green-500">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                <span>Optional</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Key className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>API Key Status</span>
            </div>
            {provider.apiKey ? (
              <div className="flex items-center text-green-500">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                <span>Configured</span>
              </div>
            ) : (
              <div className="flex items-center text-amber-500">
                <Info className="h-4 w-4 mr-1" />
                <span>Not Set</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Endpoints</span>
            </div>
            <span>{provider.endpoints?.length || 0} available</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center space-x-2 text-sm">
          <Switch 
            checked={provider.enabled ?? false}
            onCheckedChange={handleToggle}
            aria-label={`${provider.enabled ? 'Disable' : 'Enable'} ${provider.name}`}
          />
          <span>Enable API</span>
        </div>
        
        <div className="flex space-x-2">
          {provider.website && (
            <Button variant="outline" size="sm" asChild className="h-8">
              <a href={provider.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Site
              </a>
            </Button>
          )}
          
          {provider.docs && (
            <Button variant="outline" size="sm" asChild className="h-8">
              <a href={provider.docs} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Docs
              </a>
            </Button>
          )}
          
          <Button variant="default" size="sm" className="h-8">
            Configure
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MobileOptimizedApiProvider;
