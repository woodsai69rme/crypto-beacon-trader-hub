
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiProvider } from "@/types/trading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Check, X, ArrowUpDown } from "lucide-react";

const ApiProviderSettings = () => {
  const [providers, setProviders] = useState<ApiProvider[]>([
    {
      id: "coingecko",
      name: "CoinGecko",
      baseUrl: "https://api.coingecko.com/api/v3",
      apiKeyName: "x_cg_api_key",
      authMethod: "header",
      requiresAuth: true,
      enabled: true,
      priority: 1,
      rateLimit: 50,
      endpoints: {
        coins: "/coins/markets",
        coin: "/coins/{id}",
        history: "/coins/{id}/market_chart"
      }
    },
    {
      id: "cryptocompare",
      name: "CryptoCompare",
      baseUrl: "https://min-api.cryptocompare.com/data",
      apiKeyName: "authorization",
      authMethod: "header",
      requiresAuth: true,
      enabled: true,
      priority: 2,
      rateLimit: 100,
      endpoints: {
        price: "/price",
        histoday: "/histoday",
        histohour: "/histohour"
      }
    },
    {
      id: "messari",
      name: "Messari",
      baseUrl: "https://data.messari.io/api/v1",
      apiKeyName: "x-messari-api-key",
      authMethod: "header",
      requiresAuth: true,
      enabled: false,
      priority: 3,
      rateLimit: 20,
      endpoints: {
        assets: "/assets",
        asset: "/assets/{id}",
        metrics: "/assets/{id}/metrics"
      }
    }
  ]);

  const [editingProvider, setEditingProvider] = useState<ApiProvider | null>(null);

  const toggleProviderEnabled = (id: string) => {
    setProviders(
      providers.map(provider =>
        provider.id === id ? { ...provider, enabled: !provider.enabled } : provider
      )
    );
    
    toast({
      title: "Provider Updated",
      description: `${providers.find(p => p.id === id)?.name} is now ${providers.find(p => p.id === id)?.enabled ? 'disabled' : 'enabled'}`
    });
  };

  const handleSaveProvider = () => {
    if (!editingProvider) return;
    
    setProviders(
      providers.map(provider =>
        provider.id === editingProvider.id ? editingProvider : provider
      )
    );
    
    setEditingProvider(null);
    
    toast({
      title: "Provider Settings Saved",
      description: `${editingProvider.name} settings have been updated`
    });
  };

  const changePriority = (id: string, direction: 'up' | 'down') => {
    const currentIndex = providers.findIndex(p => p.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === providers.length - 1)
    ) {
      return;
    }

    const newProviders = [...providers];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap priorities
    const currentPriority = newProviders[currentIndex].priority;
    newProviders[currentIndex].priority = newProviders[targetIndex].priority;
    newProviders[targetIndex].priority = currentPriority;
    
    // Sort by priority
    newProviders.sort((a, b) => a.priority - b.priority);
    
    setProviders(newProviders);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">API Providers Configuration</h3>
      </div>
      
      <div className="rounded-md border">
        <div className="bg-muted/50 p-2 grid grid-cols-5 font-medium text-sm">
          <div className="col-span-2">Provider</div>
          <div>Status</div>
          <div>Priority</div>
          <div className="text-right">Actions</div>
        </div>
        
        {providers.map((provider) => (
          <div key={provider.id} className="grid grid-cols-5 p-2 border-t items-center">
            <div className="col-span-2">
              <div className="font-medium">{provider.name}</div>
              <div className="text-xs text-muted-foreground">{provider.baseUrl}</div>
            </div>
            <div>
              <Switch
                checked={provider.enabled}
                onCheckedChange={() => toggleProviderEnabled(provider.id)}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => changePriority(provider.id, 'up')}
                disabled={provider.priority === 1}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              <span>{provider.priority}</span>
            </div>
            <div className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingProvider(provider)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {editingProvider && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Edit {editingProvider.name} Settings</CardTitle>
            <CardDescription>Configure API connection parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="authentication">Authentication</TabsTrigger>
                <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Provider Name</Label>
                  <Input
                    id="name"
                    value={editingProvider.name}
                    onChange={(e) => 
                      setEditingProvider({...editingProvider, name: e.target.value})
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="baseUrl">Base URL</Label>
                  <Input
                    id="baseUrl"
                    value={editingProvider.baseUrl}
                    onChange={(e) => 
                      setEditingProvider({...editingProvider, baseUrl: e.target.value})
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    min={1}
                    value={editingProvider.priority}
                    onChange={(e) => 
                      setEditingProvider({
                        ...editingProvider, 
                        priority: parseInt(e.target.value) || 1
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower numbers have higher priority
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rateLimit">Rate Limit (calls/minute)</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    min={1}
                    value={editingProvider.rateLimit}
                    onChange={(e) => 
                      setEditingProvider({
                        ...editingProvider, 
                        rateLimit: parseInt(e.target.value) || 1
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="enabled">Enabled</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable or disable this provider
                    </p>
                  </div>
                  <Switch
                    id="enabled"
                    checked={editingProvider.enabled}
                    onCheckedChange={(checked) =>
                      setEditingProvider({...editingProvider, enabled: checked})
                    }
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="authentication" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Requires Authentication</Label>
                    <p className="text-xs text-muted-foreground">
                      This API requires an API key
                    </p>
                  </div>
                  <Switch
                    checked={editingProvider.requiresAuth}
                    onCheckedChange={(checked) =>
                      setEditingProvider({...editingProvider, requiresAuth: checked})
                    }
                  />
                </div>
                
                {editingProvider.requiresAuth && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="apiKeyName">API Key Parameter Name</Label>
                      <Input
                        id="apiKeyName"
                        value={editingProvider.apiKeyName}
                        onChange={(e) => 
                          setEditingProvider({...editingProvider, apiKeyName: e.target.value})
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Authentication Method</Label>
                      <div className="flex gap-4 pt-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="auth-header"
                            checked={editingProvider.authMethod === "header"}
                            onChange={() =>
                              setEditingProvider({...editingProvider, authMethod: "header"})
                            }
                          />
                          <Label htmlFor="auth-header">Header</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="auth-query"
                            checked={editingProvider.authMethod === "query"}
                            onChange={() =>
                              setEditingProvider({...editingProvider, authMethod: "query"})
                            }
                          />
                          <Label htmlFor="auth-query">Query Parameter</Label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="endpoints" className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure endpoint paths for this provider
                </p>
                
                {Object.entries(editingProvider.endpoints).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`endpoint-${key}`}>{key}</Label>
                    <Input
                      id={`endpoint-${key}`}
                      value={value}
                      onChange={(e) => {
                        const updatedEndpoints = {
                          ...editingProvider.endpoints,
                          [key]: e.target.value
                        };
                        setEditingProvider({
                          ...editingProvider,
                          endpoints: updatedEndpoints
                        });
                      }}
                    />
                  </div>
                ))}
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditingProvider(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProvider}>
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Failover Configuration</CardTitle>
          <CardDescription>Configure how the system handles API failures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Failover</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically switch to next provider on failure
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Retry Failed Requests</Label>
                <p className="text-xs text-muted-foreground">
                  Retry failed requests before failover
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cache Fallback</Label>
                <p className="text-xs text-muted-foreground">
                  Use cached data when all providers fail
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retry-attempts">Retry Attempts</Label>
              <Input
                id="retry-attempts"
                type="number"
                min={0}
                max={5}
                defaultValue={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retry-delay">Retry Delay (ms)</Label>
              <Input
                id="retry-delay"
                type="number"
                min={100}
                step={100}
                defaultValue={1000}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiProviderSettings;
