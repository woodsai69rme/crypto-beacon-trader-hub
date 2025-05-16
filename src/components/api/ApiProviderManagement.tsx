
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ApiProvider, ApiEndpoint } from '@/types/trading';
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, Clock, Eye, Key, RefreshCw, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from '@/hooks/use-toast';

const ApiProviderManagement = () => {
  const [activeTab, setActiveTab] = useState("coingecko");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mockApiProviders: ApiProvider[] = [
    {
      id: "coingecko",
      name: "CoinGecko",
      enabled: true,
      baseUrl: "https://api.coingecko.com/api/v3",
      description: "Market data, prices, and coin information",
      endpoints: {
        "coins": "/coins",
        "markets": "/coins/markets",
        "ping": "/ping"
      },
      requiresAuth: true,
      apiKey: "xxxxxxxxxxxxxxxxxxxxxxxx",
      apiKeyName: "x_cg_pro_api_key",
      authMethod: "header",
      defaultHeaders: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    },
    {
      id: "binance",
      name: "Binance",
      enabled: true,
      baseUrl: "https://api.binance.com/api/v3",
      description: "Real-time trading data and order management",
      endpoints: {
        "ticker": "/ticker/24hr",
        "depth": "/depth",
        "trades": "/trades"
      },
      requiresAuth: false,
      defaultHeaders: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    },
    {
      id: "kraken",
      name: "Kraken",
      enabled: false,
      baseUrl: "https://api.kraken.com/0/public",
      description: "Price data and trading information",
      endpoints: {
        "ticker": "/Ticker",
        "ohlc": "/OHLC",
        "depth": "/Depth"
      },
      requiresAuth: true,
      apiKey: "",
      apiKeyName: "API-Key",
      authMethod: "header",
      defaultHeaders: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    }
  ];

  const mockApiEndpoints: Record<string, ApiEndpoint[]> = {
    coingecko: [
      {
        id: "coins",
        name: "Coin List",
        path: "/coins/list",
        method: "GET",
        description: "Get list of all coins with id, name, symbol",
        url: "https://api.coingecko.com/api/v3/coins/list",
        responseTime: 235,
        lastUsed: "2023-06-15T14:34:21Z",
        requiresAuth: true
      },
      {
        id: "markets",
        name: "Coin Markets",
        path: "/coins/markets",
        method: "GET",
        description: "Get list of all supported coins price, market cap, volume, and market related data",
        url: "https://api.coingecko.com/api/v3/coins/markets",
        responseTime: 312,
        lastUsed: "2023-06-15T15:12:45Z",
        requiresAuth: true
      },
      {
        id: "ping",
        name: "Ping",
        path: "/ping",
        method: "GET",
        description: "Check API server status",
        url: "https://api.coingecko.com/api/v3/ping",
        responseTime: 87,
        lastUsed: "2023-06-15T15:30:12Z",
        requiresAuth: true
      }
    ],
    binance: [
      {
        id: "ticker",
        name: "24hr Ticker Price Change",
        path: "/ticker/24hr",
        method: "GET",
        description: "24 hour rolling window price change statistics",
        url: "https://api.binance.com/api/v3/ticker/24hr",
        responseTime: 145,
        lastUsed: "2023-06-15T16:22:09Z",
        requiresAuth: true
      },
      {
        id: "depth",
        name: "Order Book",
        path: "/depth",
        method: "GET",
        description: "Get order book depth data",
        url: "https://api.binance.com/api/v3/depth",
        responseTime: 187,
        lastUsed: "2023-06-15T16:45:33Z",
        requiresAuth: true
      },
      {
        id: "trades",
        name: "Recent Trades List",
        path: "/trades",
        method: "GET",
        description: "Get recent trades",
        url: "https://api.binance.com/api/v3/trades",
        responseTime: 124,
        lastUsed: "2023-06-15T17:01:18Z",
        requiresAuth: true
      }
    ],
    kraken: [
      {
        id: "ticker",
        name: "Ticker Information",
        path: "/Ticker",
        method: "GET",
        description: "Get ticker information",
        url: "https://api.kraken.com/0/public/Ticker",
        responseTime: 198,
        lastUsed: "2023-06-10T09:45:12Z",
        requiresAuth: true
      },
      {
        id: "ohlc",
        name: "OHLC Data",
        path: "/OHLC",
        method: "GET",
        description: "Get OHLC data",
        url: "https://api.kraken.com/0/public/OHLC",
        responseTime: 267,
        lastUsed: "2023-06-09T14:23:05Z",
        requiresAuth: true
      },
      {
        id: "depth",
        name: "Order Book",
        path: "/Depth",
        method: "GET",
        description: "Get order book",
        url: "https://api.kraken.com/0/public/Depth",
        responseTime: 212,
        lastUsed: "2023-06-08T17:51:44Z",
        requiresAuth: true
      }
    ]
  };

  const [providers, setProviders] = useState<ApiProvider[]>(mockApiProviders);
  const [endpoints, setEndpoints] = useState<Record<string, ApiEndpoint[]>>(mockApiEndpoints);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    coingecko: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    binance: '',
    kraken: ''
  });
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({
    coingecko: false,
    binance: false,
    kraken: false
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "API Status Refreshed",
        description: "API provider status has been updated."
      });
    }, 1000);
  };

  const handleToggleProvider = (id: string, enabled: boolean) => {
    setProviders(providers.map(provider => 
      provider.id === id ? { ...provider, enabled } : provider
    ));
    
    toast({
      title: `API ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `${providers.find(p => p.id === id)?.name} API has been ${enabled ? 'enabled' : 'disabled'}.`
    });
  };

  const handleApiKeyChange = (id: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveApiKey = (id: string) => {
    const provider = providers.find(p => p.id === id);
    if (!provider) return;
    
    toast({
      title: "API Key Saved",
      description: `${provider.name} API key has been updated.`
    });
  };

  const handleToggleShowApiKey = (id: string) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeProvider = providers.find(p => p.id === activeTab) || providers[0];
  const activeEndpoints = endpoints[activeTab] || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">API Providers</h2>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm" 
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex border-b">
              <TabsList className="h-14">
                {providers.map(provider => (
                  <TabsTrigger 
                    key={provider.id} 
                    value={provider.id}
                    className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    {provider.name}
                    <Badge 
                      variant={provider.enabled ? "default" : "secondary"}
                      className={`${provider.enabled ? 'bg-green-500' : 'bg-slate-400'} rounded-full h-2 w-2 p-0`}
                    />
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {providers.map(provider => (
              <TabsContent key={provider.id} value={provider.id} className="p-6 space-y-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{provider.name} API</h3>
                    <p className="text-muted-foreground">{provider.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Enabled</span>
                    <Switch 
                      checked={provider.enabled} 
                      onCheckedChange={(checked) => handleToggleProvider(provider.id, checked)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">API Configuration</h4>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Base URL</div>
                      <div className="font-mono text-sm bg-muted p-2 rounded">{provider.baseUrl}</div>
                    </div>
                  </div>
                  
                  {provider.requiresAuth && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Authentication</h4>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">API Key</div>
                          <div className="flex">
                            <Input 
                              type={showApiKey[provider.id] ? "text" : "password"} 
                              value={apiKeys[provider.id]} 
                              onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                              placeholder="Enter API key"
                              className="font-mono"
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleToggleShowApiKey(provider.id)}
                              className="ml-2"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleSaveApiKey(provider.id)} 
                          disabled={!apiKeys[provider.id]}
                        >
                          Save Key
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Available Endpoints</h4>
                      <Badge variant="outline">
                        {activeEndpoints.length} endpoints
                      </Badge>
                    </div>
                    
                    <div className="border rounded-md">
                      {activeEndpoints.map((endpoint, index) => (
                        <div key={endpoint.id}>
                          <div className="flex justify-between items-center p-3 hover:bg-muted/50">
                            <div>
                              <div className="font-medium">{endpoint.name}</div>
                              <div className="text-sm text-muted-foreground">{endpoint.description}</div>
                              <div className="flex items-center mt-1 space-x-2">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {endpoint.method}
                                </Badge>
                                <span className="text-xs font-mono text-muted-foreground">
                                  {endpoint.path}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-sm">{endpoint.responseTime}ms</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Last used: {new Date(endpoint.lastUsed).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          {index < activeEndpoints.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiProviderManagement;
