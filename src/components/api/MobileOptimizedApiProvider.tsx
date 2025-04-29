
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { apiProviderManager } from "@/services/api/apiProviderConfig";
import type { ApiProvider } from "@/types/trading";
import { useIsMobile } from "@/hooks/use-mobile";
import { Settings, Pencil, Trash, Plus, Lock } from "lucide-react";

const MobileOptimizedApiProvider: React.FC = () => {
  const [providers, setProviders] = useState<ApiProvider[]>(apiProviderManager.getAllProviders());
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<ApiProvider | null>(null);
  const isMobile = useIsMobile();
  
  const refreshProviders = () => {
    setProviders(apiProviderManager.getAllProviders());
  };
  
  const handleToggleProvider = (id: string) => {
    apiProviderManager.toggleProviderEnabled(id);
    refreshProviders();
  };
  
  const handleUpdateApiKey = (id: string, apiKey: string) => {
    try {
      apiProviderManager.setProviderApiKey(id, apiKey);
      refreshProviders();
      
      toast({
        title: "API Key Updated",
        description: "Your API key has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };
  
  const renderProviderItem = (provider: ApiProvider) => (
    <div key={provider.id} className="flex items-center justify-between p-3 border-b last:border-0">
      <div className="flex-1">
        <div className="font-medium">{provider.name}</div>
        <div className="text-xs text-muted-foreground">{provider.baseUrl}</div>
      </div>
      
      <div className="flex items-center gap-2">
        <Switch
          checked={provider.enabled}
          onCheckedChange={() => handleToggleProvider(provider.id)}
          aria-label={`${provider.name} enabled`}
        />
        
        {(provider.authRequired || provider.requiresAuth) && (
          isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Lock className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>Set API Key for {provider.name}</SheetTitle>
                  <SheetDescription>
                    Enter your API key to authenticate with this provider.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <Label htmlFor={`mobile-api-key-${provider.id}`}>API Key</Label>
                  <Input 
                    id={`mobile-api-key-${provider.id}`} 
                    placeholder="Enter API key"
                    type="password"
                    defaultValue={provider.apiKey || ""}
                    className="mt-2"
                  />
                </div>
                <SheetFooter>
                  <Button
                    onClick={() => {
                      const input = document.getElementById(`mobile-api-key-${provider.id}`) as HTMLInputElement;
                      handleUpdateApiKey(provider.id, input.value);
                    }}
                  >
                    Save Key
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Lock className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>API Key for {provider.name}</DialogTitle>
                  <DialogDescription>
                    Enter your API key to authenticate with {provider.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor={`api-key-${provider.id}`}>API Key</Label>
                  <Input 
                    id={`api-key-${provider.id}`} 
                    placeholder="Enter API key"
                    type="password"
                    defaultValue={provider.apiKey || ""}
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      const input = document.getElementById(`api-key-${provider.id}`) as HTMLInputElement;
                      handleUpdateApiKey(provider.id, input.value);
                    }}
                  >
                    Save Key
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        )}
      </div>
    </div>
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          API Providers
        </CardTitle>
        <CardDescription>
          Configure data providers for crypto price data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {providers.map(renderProviderItem)}
        </div>
        
        <div className="mt-6">
          <Button variant="outline" size="sm" className="w-full" onClick={() => refreshProviders()}>
            <Plus className="h-4 w-4 mr-2" />
            Refresh Providers
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileOptimizedApiProvider;
