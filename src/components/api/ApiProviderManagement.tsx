
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ApiProvider, ApiEndpoint } from '@/types/trading';
import { Edit, ExternalLink, Key, Lock, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ApiProviderManagement: React.FC = () => {
  // Mock API providers data
  const [apiProviders, setApiProviders] = useState<ApiProvider[]>([
    {
      id: "coingecko",
      name: "CoinGecko",
      baseUrl: "https://api.coingecko.com/api/v3",
      description: "Cryptocurrency data provider with free tier.",
      endpoints: [
        {
          id: "coingecko-markets",
          name: "Coin Markets",
          url: "/coins/markets",
          path: "/coins/markets",
          method: "GET",
          description: "Get list of coins with market data",
          responseTime: 450,
          lastUsed: new Date().toISOString(),
          requiresAuth: true,
        },
        {
          id: "coingecko-coins",
          name: "Coin Details",
          url: "/coins/{id}",
          path: "/coins/{id}",
          method: "GET",
          description: "Get current data for a coin",
          responseTime: 380,
          lastUsed: new Date().toISOString(),
          requiresAuth: true,
        },
        {
          id: "coingecko-trending",
          name: "Trending Coins",
          url: "/search/trending",
          path: "/search/trending",
          method: "GET",
          description: "Get trending search coins on CoinGecko in the last 24 hours",
          responseTime: 290,
          lastUsed: new Date().toISOString(),
          requiresAuth: true,
        }
      ],
      isActive: true,
      apiKey: "ck_xxxxxxxxxxx",
      website: "https://www.coingecko.com",
      docs: "https://www.coingecko.com/api/documentation",
      enabled: true,
      requiresAuth: true,
      authRequired: true,
      authMethod: "bearer",
    },
    {
      id: "cryptocompare",
      name: "CryptoCompare",
      baseUrl: "https://min-api.cryptocompare.com/data",
      description: "Real-time crypto data API with advanced features.",
      endpoints: [
        {
          id: "cryptocompare-price",
          name: "Price Multi",
          url: "/pricemulti",
          path: "/pricemulti",
          method: "GET",
          description: "Get multiple prices at once",
          responseTime: 320,
          lastUsed: new Date().toISOString(),
          requiresAuth: true,
        },
        {
          id: "cryptocompare-historical",
          name: "Historical Data",
          url: "/histoday",
          path: "/histoday",
          method: "GET",
          description: "Get historical daily OHLCV data",
          responseTime: 540,
          lastUsed: new Date().toISOString(),
          requiresAuth: true,
        },
        {
          id: "cryptocompare-news",
          name: "News Articles",
          url: "/v2/news",
          path: "/v2/news",
          method: "GET",
          description: "Get latest crypto news articles",
          responseTime: 410,
          lastUsed: new Date().toISOString(),
          requiresAuth: true,
        }
      ],
      isActive: true,
      apiKey: "cc_xxxxxxxxxxx",
      website: "https://www.cryptocompare.com",
      docs: "https://min-api.cryptocompare.com/documentation",
      enabled: true,
      requiresAuth: true,
      authRequired: true,
      authMethod: "api_key",
      apiKeyName: "api_key",
    },
    {
      id: "coinmarketcap",
      name: "CoinMarketCap",
      baseUrl: "https://pro-api.coinmarketcap.com/v1",
      description: "Professional crypto market data API.",
      endpoints: [
        {
          id: "coinmarketcap-listings",
          name: "Listings Latest",
          url: "/cryptocurrency/listings/latest",
          path: "/cryptocurrency/listings/latest",
          method: "GET",
          description: "Get latest listings with market data",
          responseTime: 620,
          lastUsed: new Date().toISOString(),
          requiresAuth: true,
        },
        {
          id: "coinmarketcap-quotes",
          name: "Quote Latest",
          url: "/cryptocurrency/quotes/latest",
          path: "/cryptocurrency/quotes/latest",
          method: "GET",
          description: "Get latest quotes for one or more cryptocurrencies",
          responseTime: 480,
          lastUsed: new Date().toISOString(),
          requiresAuth: true,
        },
        {
          id: "coinmarketcap-metadata",
          name: "Metadata",
          url: "/cryptocurrency/info",
          path: "/cryptocurrency/info",
          method: "GET",
          description: "Get metadata for one or more cryptocurrencies",
          responseTime: 390,
          lastUsed: new Date().toISOString(),
          requiresAuth: true,
        }
      ],
      isActive: false,
      apiKey: "cmc_xxxxxxxxxxx",
      website: "https://coinmarketcap.com",
      docs: "https://coinmarketcap.com/api/documentation/v1/",
      enabled: false,
      requiresAuth: true,
      authRequired: true,
      authMethod: "api_key",
      apiKeyName: "X-CMC_PRO_API_KEY",
    }
  ]);

  const toggleProviderActive = (providerId: string) => {
    setApiProviders(providers => 
      providers.map(provider => 
        provider.id === providerId 
          ? { ...provider, isActive: !provider.isActive, enabled: !provider.enabled } 
          : provider
      )
    );
    
    const provider = apiProviders.find(p => p.id === providerId);
    if (provider) {
      toast({
        title: `${provider.name} ${provider.isActive ? 'Disabled' : 'Enabled'}`,
        description: `API provider has been ${provider.isActive ? 'disabled' : 'enabled'}.`,
        duration: 3000,
      });
    }
  };
  
  const handleAddEndpoint = (providerId: string) => {
    // Create a new endpoint
    const newEndpoint: ApiEndpoint = {
      id: `new-endpoint-${Date.now()}`,
      name: "New Endpoint",
      url: "/new-endpoint",
      path: "/new-endpoint", // Add path property
      method: "GET",
      description: "New API endpoint",
      responseTime: 0,
      lastUsed: new Date().toISOString(),
      requiresAuth: false,
    };
    
    // Add to provider
    setApiProviders(providers =>
      providers.map(provider => 
        provider.id === providerId
          ? { ...provider, endpoints: [...provider.endpoints, newEndpoint] }
          : provider
      )
    );
    
    toast({
      title: "Endpoint Added",
      description: "New API endpoint has been added.",
      duration: 3000,
    });
  };
  
  const handleAddProvider = () => {
    // Create a new provider with required properties
    const newProvider: ApiProvider = {
      id: `new-provider-${Date.now()}`,
      name: "New API Provider",
      baseUrl: "https://api.example.com",
      description: "Configure this new API provider.",
      endpoints: [], // Empty endpoints array
      isActive: true,
      apiKey: "",
      enabled: true,
    };
    
    setApiProviders([...apiProviders, newProvider]);
    
    toast({
      title: "Provider Added",
      description: "New API provider has been added.",
      duration: 3000,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">API Providers</h2>
        <Button onClick={handleAddProvider} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Provider
        </Button>
      </div>
      
      <Tabs defaultValue={apiProviders[0]?.id || "coingecko"}>
        <TabsList className="mb-4 overflow-auto">
          {apiProviders.map(provider => (
            <TabsTrigger key={provider.id} value={provider.id} className="flex items-center">
              {provider.name}
              {!provider.isActive && <Badge variant="outline" className="ml-2 text-xs">Inactive</Badge>}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {apiProviders.map(provider => (
          <TabsContent key={provider.id} value={provider.id} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      {provider.name}
                      {provider.requiresAuth || provider.authRequired ? (
                        <Lock className="h-4 w-4 ml-2 text-yellow-500" />
                      ) : null}
                    </CardTitle>
                    <CardDescription className="mt-1">{provider.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Enabled</span>
                      <Switch 
                        checked={provider.isActive} 
                        onCheckedChange={() => toggleProviderActive(provider.id)} 
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">API Base URL</h3>
                    <div className="font-mono text-sm bg-muted p-2 rounded-md">
                      {provider.baseUrl}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">API Key {provider.apiKey ? '(Saved)' : '(Not Set)'}</h3>
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-sm bg-muted p-2 rounded-md flex-1">
                        {provider.apiKey ? '••••••••••••••••' : 'No API key set'}
                      </div>
                      <Button variant="outline" size="sm">
                        <Key className="h-4 w-4 mr-1" />
                        {provider.apiKey ? 'Update' : 'Add'}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {(provider.website || provider.docs) && (
                  <div className="flex gap-4 text-sm">
                    {provider.website && (
                      <a 
                        href={provider.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary flex items-center hover:underline"
                      >
                        Website <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                    
                    {provider.docs && (
                      <a 
                        href={provider.docs} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary flex items-center hover:underline"
                      >
                        Documentation <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Endpoints ({provider.endpoints.length})</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddEndpoint(provider.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Endpoint
                    </Button>
                  </div>
                  
                  <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold">Endpoint</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold">Method</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold hidden md:table-cell">Description</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold hidden md:table-cell">Last Used</th>
                          <th className="relative px-3 py-3.5">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {provider.endpoints.map((endpoint) => (
                          <tr key={endpoint.id}>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <div className="font-medium">{endpoint.name}</div>
                              <div className="text-muted-foreground font-mono text-xs">{endpoint.path}</div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <Badge variant={endpoint.method === "GET" ? "secondary" : "default"}>
                                {endpoint.method}
                              </Badge>
                            </td>
                            <td className="px-3 py-4 text-sm hidden md:table-cell">
                              <div className="truncate max-w-xs">{endpoint.description}</div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm hidden md:table-cell">
                              <div className="text-muted-foreground">
                                {new Date(endpoint.lastUsed).toLocaleString()}
                              </div>
                            </td>
                            <td className="relative whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        
                        {provider.endpoints.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">
                              No endpoints configured. Add an endpoint to get started.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ApiProviderManagement;
