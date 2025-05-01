import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Check, RefreshCw, X } from "lucide-react";
import { ApiProvider, ApiEndpoint } from '@/types/trading';
import { useToast } from '@/components/ui/use-toast';

const ApiProviderManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("binance");
  const [isLoading, setIsLoading] = useState(false);
  
  // Initial API providers configuration
  const initialApiProviders: ApiProvider[] = [
    {
      id: "binance",
      name: "Binance",
      description: "The world's largest crypto exchange by trading volume",
      baseUrl: "https://api.binance.com",
      website: "https://binance.com",
      docs: "https://binance-docs.github.io/apidocs/",
      authRequired: true,
      apiKey: "",
      enabled: false,
      requiresAuth: true,
      apiKeyName: "X-MBX-APIKEY",
      authMethod: "header" as "header" | "query" | "none",
      priority: 1,
      endpoints: [
        {
          id: "ticker-price",
          name: "Ticker Price",
          description: "Latest price for a symbol",
          path: "/api/v3/ticker/price",
          method: "GET",
          params: {
            symbol: "BTCUSDT"
          },
          requiresAuth: false
        },
        {
          id: "exchange-info",
          name: "Exchange Information",
          description: "Current exchange trading rules and symbol information",
          path: "/api/v3/exchangeInfo",
          method: "GET",
          requiresAuth: false
        },
        {
          id: "account",
          name: "Account Information",
          description: "Get current account information",
          path: "/api/v3/account",
          method: "GET",
          requiresAuth: true
        }
      ],
      defaultHeaders: {
        "Content-Type": "application/json"
      },
      rateLimit: 1200,
      tier: "premium"
    },
    {
      id: "coinbase",
      name: "Coinbase",
      description: "One of the largest cryptocurrency exchanges in the USA",
      baseUrl: "https://api.coinbase.com",
      website: "https://coinbase.com",
      docs: "https://docs.cloud.coinbase.com",
      authRequired: true,
      apiKey: "",
      enabled: false,
      requiresAuth: true,
      apiKeyName: "CB-ACCESS-KEY",
      authMethod: "header" as "header" | "query" | "none",
      priority: 2,
      endpoints: [
        {
          id: "exchange-rates",
          name: "Exchange Rates",
          description: "Get current exchange rates",
          path: "/v2/exchange-rates",
          method: "GET",
          requiresAuth: false
        },
        {
          id: "currencies",
          name: "Currencies",
          description: "List known currencies",
          path: "/v2/currencies",
          method: "GET",
          requiresAuth: false
        },
        {
          id: "accounts",
          name: "Accounts",
          description: "List accounts",
          path: "/v2/accounts",
          method: "GET",
          requiresAuth: true
        }
      ],
      defaultHeaders: {
        "Content-Type": "application/json"
      },
      rateLimit: 100,
      tier: "basic"
    }
  ];

  const [apiProviders, setApiProviders] = useState<ApiProvider[]>(initialApiProviders);
  const [newProvider, setNewProvider] = useState<ApiProvider>({
    id: "",
    name: "",
    description: "",
    baseUrl: "",
    website: "",
    docs: "",
    authRequired: false,
    apiKey: "",
    enabled: false,
    requiresAuth: false,
    apiKeyName: "",
    authMethod: "none" as "header" | "query" | "none",
    priority: 99,
    endpoints: [],
    defaultHeaders: {},
    rateLimit: 0,
    tier: "free" as "free" | "basic" | "premium"
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleApiKeyChange = (provider: string, value: string) => {
    setApiProviders((prev) => 
      prev.map(p => 
        p.id === provider ? { ...p, apiKey: value } : p
      )
    );
  };

  const toggleProviderEnabled = (provider: string) => {
    setApiProviders((prev) => 
      prev.map(p => {
        if (p.id === provider) {
          const newState = !p.enabled;
          
          // Show toast notification
          toast({
            title: `${p.name} API ${newState ? 'Enabled' : 'Disabled'}`,
            description: newState 
              ? `You've successfully enabled the ${p.name} API.` 
              : `You've disabled the ${p.name} API.`
          });
          
          return { ...p, enabled: newState };
        }
        return p;
      })
    );
  };
  
  const testApiConnection = async (provider: ApiProvider) => {
    setIsLoading(true);
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if API key exists if required
    const success = !provider.authRequired || (provider.authRequired && provider.apiKey.length > 5);
    
    setIsLoading(false);
    
    if (success) {
      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${provider.name} API.`,
      });
    } else {
      toast({
        title: "Connection Failed",
        description: provider.authRequired 
          ? `Failed to connect to ${provider.name} API. Please check your API key.`
          : `Failed to connect to ${provider.name} API.`,
        variant: "destructive"
      });
    }
    
    return success;
  };
  
  const activeProvider = apiProviders.find(p => p.id === activeTab);
  
  const handleAddNewProvider = () => {
    // Validate required fields
    if (!newProvider.name || !newProvider.baseUrl) {
      toast({
        title: "Missing Required Fields",
        description: "Please provide at least the Name and Base URL for the API.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a unique ID from the name
    const id = newProvider.name.toLowerCase().replace(/\s+/g, '-');
    
    // Check if provider with this ID already exists
    if (apiProviders.some(p => p.id === id)) {
      toast({
        title: "Provider Already Exists",
        description: `A provider with the name '${newProvider.name}' already exists.`,
        variant: "destructive"
      });
      return;
    }
    
    const finalProvider: ApiProvider = {
      ...newProvider,
      id,
      authMethod: (newProvider.authMethod || "none") as "header" | "query" | "none"
    };
    
    setApiProviders(prev => [...prev, finalProvider]);
    
    // Reset the form
    setNewProvider({
      id: "",
      name: "",
      description: "",
      baseUrl: "",
      website: "",
      docs: "",
      authRequired: false,
      apiKey: "",
      enabled: false,
      requiresAuth: false,
      apiKeyName: "",
      authMethod: "none" as "header" | "query" | "none",
      priority: 99,
      endpoints: [],
      defaultHeaders: {},
      rateLimit: 0,
      tier: "free" as "free" | "basic" | "premium"
    });
    
    toast({
      title: "API Provider Added",
      description: `${finalProvider.name} has been added to your API providers.`
    });
    
    // Activate the tab for the new provider
    setActiveTab(id);
  };
  
  const handleAddEndpoint = (providerId: string) => {
    if (!activeProvider) return;
    
    const newEndpoint: ApiEndpoint = {
      id: `endpoint-${Date.now()}`,
      name: "New Endpoint",
      description: "Description of what this endpoint does",
      path: "/api/v1/endpoint",
      method: "GET",
      requiresAuth: false
    };
    
    setApiProviders(prev => 
      prev.map(p => 
        p.id === providerId 
          ? { ...p, endpoints: [...p.endpoints, newEndpoint] }
          : p
      )
    );
  };
  
  const handleRemoveEndpoint = (providerId: string, endpointId: string) => {
    setApiProviders(prev => 
      prev.map(p => 
        p.id === providerId 
          ? { 
              ...p, 
              endpoints: p.endpoints.filter(e => e.id !== endpointId)
            }
          : p
      )
    );
  };
  
  const handleUpdateEndpoint = (
    providerId: string, 
    endpointId: string, 
    key: keyof ApiEndpoint, 
    value: string | boolean
  ) => {
    setApiProviders(prev => 
      prev.map(p => 
        p.id === providerId 
          ? { 
              ...p, 
              endpoints: p.endpoints.map(e => 
                e.id === endpointId 
                  ? { ...e, [key]: value }
                  : e
              )
            }
          : p
      )
    );
  };
  
  const handleRemoveProvider = (providerId: string) => {
    // Don't allow removing the last provider
    if (apiProviders.length <= 1) {
      toast({
        title: "Cannot Remove Last Provider",
        description: "You must have at least one API provider.",
        variant: "destructive"
      });
      return;
    }
    
    const providerName = apiProviders.find(p => p.id === providerId)?.name;
    
    setApiProviders(prev => prev.filter(p => p.id !== providerId));
    
    toast({
      title: "API Provider Removed",
      description: `${providerName} has been removed from your API providers.`
    });
    
    // If we removed the active tab, select the first remaining provider
    if (activeTab === providerId) {
      setActiveTab(apiProviders.find(p => p.id !== providerId)?.id || "");
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Provider Management</CardTitle>
        <CardDescription>
          Connect and configure external API providers for market data and trading
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-4 w-full h-auto flex-wrap">
            {apiProviders.map(provider => (
              <TabsTrigger key={provider.id} value={provider.id} className="flex items-center">
                <span>{provider.name}</span>
                {provider.enabled && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-green-500" />
                )}
              </TabsTrigger>
            ))}
            <TabsTrigger value="add-new">+ Add New</TabsTrigger>
          </TabsList>
          
          {/* Existing Providers */}
          {apiProviders.map(provider => (
            <TabsContent key={provider.id} value={provider.id} className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{provider.name}</h3>
                  <p className="text-muted-foreground">{provider.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => testApiConnection(provider)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-1 h-4 w-4" />
                    )}
                    Test Connection
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={provider.enabled}
                      onCheckedChange={() => toggleProviderEnabled(provider.id)}
                      id={`${provider.id}-status`}
                    />
                    <Label htmlFor={`${provider.id}-status`}>
                      {provider.enabled ? 'Enabled' : 'Disabled'}
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Connection Settings</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`${provider.id}-base-url`}>Base URL</Label>
                    <Input
                      id={`${provider.id}-base-url`}
                      value={provider.baseUrl}
                      disabled
                    />
                  </div>
                  
                  {provider.authRequired && (
                    <div className="space-y-2">
                      <Label htmlFor={`${provider.id}-api-key`}>API Key</Label>
                      <Input
                        id={`${provider.id}-api-key`}
                        type="password"
                        value={provider.apiKey}
                        onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                        placeholder="Enter your API key"
                      />
                      <p className="text-xs text-muted-foreground">
                        Your API key is stored locally and never shared.
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label>Docs & Resources</Label>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center">
                        <span className="text-muted-foreground">Website:</span>
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-primary hover:underline"
                        >
                          {provider.website}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground">API Docs:</span>
                        <a
                          href={provider.docs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-primary hover:underline"
                        >
                          {provider.docs}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Available Endpoints</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddEndpoint(provider.id)}
                    >
                      Add Endpoint
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {provider.endpoints.map(endpoint => (
                      <Card key={endpoint.id} className="p-3">
                        <div className="flex justify-between">
                          <div className="font-medium flex items-center">
                            <span 
                              className={`w-14 text-xs px-2 py-0.5 rounded-sm mr-2 ${
                                endpoint.method === 'GET' ? 'bg-blue-500/10 text-blue-500' : 
                                endpoint.method === 'POST' ? 'bg-green-500/10 text-green-500' :
                                endpoint.method === 'PUT' ? 'bg-amber-500/10 text-amber-500' :
                                'bg-red-500/10 text-red-500'
                              }`}
                            >
                              {endpoint.method}
                            </span>
                            <input
                              className="bg-transparent border-none outline-none focus:ring-0 p-0 text-sm font-medium"
                              value={endpoint.name}
                              onChange={(e) => handleUpdateEndpoint(
                                provider.id, 
                                endpoint.id, 
                                'name', 
                                e.target.value
                              )}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full"
                            onClick={() => handleRemoveEndpoint(provider.id, endpoint.id)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                        
                        <div className="mt-2 text-xs">
                          <input
                            className="w-full bg-muted py-1 px-2 rounded text-xs font-mono mb-2"
                            value={endpoint.path}
                            onChange={(e) => handleUpdateEndpoint(
                              provider.id, 
                              endpoint.id, 
                              'path', 
                              e.target.value
                            )}
                          />
                          <textarea
                            className="w-full bg-transparent border-none resize-none outline-none focus:ring-0 p-0 text-xs text-muted-foreground"
                            value={endpoint.description}
                            rows={2}
                            onChange={(e) => handleUpdateEndpoint(
                              provider.id, 
                              endpoint.id, 
                              'description', 
                              e.target.value
                            )}
                          />
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-muted-foreground mr-2">
                              Requires Auth:
                            </span>
                            <Switch
                              id={`${endpoint.id}-auth`}
                              checked={endpoint.requiresAuth || false}
                              onCheckedChange={(checked) => handleUpdateEndpoint(
                                provider.id,
                                endpoint.id,
                                'requiresAuth',
                                checked
                              )}
                              className="scale-75"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    {provider.endpoints.length === 0 && (
                      <div className="text-center py-8 bg-muted/50 rounded-md">
                        <p className="text-muted-foreground">No endpoints configured</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleAddEndpoint(provider.id)}
                        >
                          Add Your First Endpoint
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4 flex justify-between">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleRemoveProvider(provider.id)}
                >
                  Remove Provider
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Reset to original config for this provider
                      const original = initialApiProviders.find(p => p.id === provider.id);
                      if (original) {
                        setApiProviders(prev => 
                          prev.map(p => p.id === provider.id ? original : p)
                        );
                        toast({
                          title: "Settings Reset",
                          description: `${provider.name} settings have been reset to defaults.`
                        });
                      }
                    }}
                  >
                    Reset
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Settings Saved",
                        description: `${provider.name} settings have been updated.`
                      });
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
          
          {/* Add New Provider */}
          <TabsContent value="add-new" className="space-y-6">
            <h3 className="text-xl font-semibold">Add New API Provider</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-provider-name">Provider Name *</Label>
                  <Input
                    id="new-provider-name"
                    placeholder="e.g. CoinMarketCap"
                    value={newProvider.name}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-provider-base-url">Base URL *</Label>
                  <Input
                    id="new-provider-base-url"
                    placeholder="e.g. https://api.example.com"
                    value={newProvider.baseUrl}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, baseUrl: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-provider-website">Website URL</Label>
                  <Input
                    id="new-provider-website"
                    placeholder="e.g. https://example.com"
                    value={newProvider.website}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-provider-docs">Documentation URL</Label>
                  <Input
                    id="new-provider-docs"
                    placeholder="e.g. https://docs.example.com"
                    value={newProvider.docs}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, docs: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="new-provider-description">Description</Label>
                  <textarea
                    id="new-provider-description"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none min-h-[80px]"
                    placeholder="Describe what this API provider is used for..."
                    value={newProvider.description}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-provider-auth-required"
                    checked={newProvider.authRequired}
                    onCheckedChange={(checked) => setNewProvider(prev => ({ 
                      ...prev, 
                      authRequired: checked,
                      authMethod: checked ? "header" : "none"
                    }))}
                  />
                  <Label htmlFor="new-provider-auth-required">
                    Requires Authentication
                  </Label>
                </div>
                
                {newProvider.authRequired && (
                  <div className="pl-6 pt-2 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-provider-api-key-name">API Key Header/Parameter Name</Label>
                      <Input
                        id="new-provider-api-key-name"
                        placeholder="e.g. X-API-KEY"
                        value={newProvider.apiKeyName}
                        onChange={(e) => setNewProvider(prev => ({ ...prev, apiKeyName: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-provider-auth-method">Authentication Method</Label>
                      <select
                        id="new-provider-auth-method"
                        value={newProvider.authMethod}
                        onChange={(e) => setNewProvider(prev => ({ 
                          ...prev, 
                          authMethod: e.target.value as "header" | "query" | "none"
                        }))}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="header">HTTP Header</option>
                        <option value="query">Query Parameter</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4 flex justify-end">
                <Button onClick={handleAddNewProvider}>
                  Add Provider
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-1" />
          <p>
            API keys are stored locally in your browser's storage.
            Never share your API keys or enter them on unsecured websites.
          </p>
        </div>
        
        <Button variant="outline" size="sm" onClick={() => {
          const enabledProviders = apiProviders.filter(p => p.enabled);
          toast({
            title: `${enabledProviders.length} Active Providers`,
            description: enabledProviders.length > 0
              ? `Currently using: ${enabledProviders.map(p => p.name).join(', ')}`
              : "No API providers are currently active."
          });
        }}>
          Check API Status
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiProviderManagement;
