
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiProvider, ApiEndpoint } from "@/types/trading";

const ApiProviderManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("coinGecko");
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [providers, setProviders] = useState<ApiProvider[]>([
    {
      id: "coingecko",
      name: "CoinGecko",
      baseUrl: "https://api.coingecko.com/api/v3",
      description: "Comprehensive cryptocurrency data API",
      endpoints: [
        {
          id: "coins_markets",
          name: "Coins Markets",
          url: "/coins/markets",
          path: "/coins/markets",
          method: "GET",
          description: "List all supported coins price, market cap, volume, and market related data",
          responseTime: 250,
          lastUsed: "2023-05-15T10:30:00Z",
          requiresAuth: true
        },
        {
          id: "coins_id",
          name: "Coin Data",
          url: "/coins/{id}",
          path: "/coins/{id}",
          method: "GET",
          description: "Get current data for a coin",
          responseTime: 180,
          lastUsed: "2023-05-15T11:45:00Z",
          requiresAuth: true
        },
        {
          id: "coins_id_market_chart",
          name: "Market Chart",
          url: "/coins/{id}/market_chart",
          path: "/coins/{id}/market_chart",
          method: "GET",
          description: "Get historical market data include price, market cap, and 24h volume",
          responseTime: 320,
          lastUsed: "2023-05-15T09:15:00Z",
          requiresAuth: true
        }
      ],
      isActive: true,
      apiKey: "",
      usageLimit: 50,
      currentUsage: 12
    },
    {
      id: "cryptoCompare",
      name: "CryptoCompare",
      baseUrl: "https://min-api.cryptocompare.com/data",
      description: "Real-time and historical cryptocurrency data",
      endpoints: [
        {
          id: "price",
          name: "Price",
          url: "/price",
          path: "/price",
          method: "GET",
          description: "Get the current price of any cryptocurrency in any other currency",
          responseTime: 150,
          lastUsed: "2023-05-15T12:10:00Z",
          requiresAuth: true
        },
        {
          id: "histoday",
          name: "Historical Daily",
          url: "/histoday",
          path: "/histoday",
          method: "GET",
          description: "Get historical daily OHLCV data for any cryptocurrency",
          responseTime: 280,
          lastUsed: "2023-05-14T15:30:00Z",
          requiresAuth: true
        },
        {
          id: "top_exchanges",
          name: "Top Exchanges",
          url: "/top/exchanges",
          path: "/top/exchanges",
          method: "GET",
          description: "Get top exchanges by volume for a currency pair",
          responseTime: 210,
          lastUsed: "2023-05-13T08:45:00Z",
          requiresAuth: true
        }
      ],
      isActive: true,
      apiKey: "",
      usageLimit: 100,
      currentUsage: 37
    },
    {
      id: "coinMarketCap",
      name: "CoinMarketCap",
      baseUrl: "https://pro-api.coinmarketcap.com/v1",
      description: "Professional-grade cryptocurrency data API",
      endpoints: [
        {
          id: "cryptocurrency_listings_latest",
          name: "Latest Listings",
          url: "/cryptocurrency/listings/latest",
          path: "/cryptocurrency/listings/latest",
          method: "GET",
          description: "Get a paginated list of all cryptocurrencies with latest market data",
          responseTime: 350,
          lastUsed: "2023-05-15T14:20:00Z",
          requiresAuth: true
        },
        {
          id: "cryptocurrency_quotes_latest",
          name: "Latest Quotes",
          url: "/cryptocurrency/quotes/latest",
          path: "/cryptocurrency/quotes/latest",
          method: "GET",
          description: "Get the latest market quotes for specific cryptocurrencies",
          responseTime: 290,
          lastUsed: "2023-05-15T10:15:00Z",
          requiresAuth: true
        },
        {
          id: "cryptocurrency_info",
          name: "Cryptocurrency Info",
          url: "/cryptocurrency/info",
          path: "/cryptocurrency/info",
          method: "GET",
          description: "Get metadata for one or more cryptocurrencies",
          responseTime: 200,
          lastUsed: "2023-05-14T09:30:00Z",
          requiresAuth: true
        }
      ],
      isActive: false,
      apiKey: "",
      usageLimit: 333,
      currentUsage: 89
    }
  ]);

  const handleSaveApiKey = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedProviders = providers.map(provider => {
        if (provider.id === activeTab) {
          return {
            ...provider,
            apiKey
          };
        }
        return provider;
      });
      
      setProviders(updatedProviders);
      setSavedApiKey(apiKey);
      setIsSaving(false);
    }, 1000);
  };

  const handleAddEndpoint = () => {
    const newEndpoint: ApiEndpoint = {
      id: `new-endpoint-${Date.now()}`,
      name: "New Endpoint",
      url: "/new-endpoint",
      path: "/new-endpoint",
      method: "GET",
      description: "Description of the new endpoint",
      responseTime: 200,
      lastUsed: new Date().toISOString(),
      requiresAuth: false
    };
    
    const updatedProviders = providers.map(provider => {
      if (provider.id === activeTab) {
        return {
          ...provider,
          endpoints: [...provider.endpoints, newEndpoint]
        };
      }
      return provider;
    });
    
    setProviders(updatedProviders);
  };

  const handleAddProvider = () => {
    const newProvider: ApiProvider = {
      id: `new-provider-${Date.now()}`,
      name: "New API Provider",
      baseUrl: "https://api.example.com",
      description: "Description of the new API provider",
      endpoints: [],
      isActive: true,
      apiKey: "",
      usageLimit: 100,
      currentUsage: 0
    };
    
    setProviders([...providers, newProvider]);
  };

  const activeProvider = providers.find(provider => provider.id === activeTab);

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Provider Management</CardTitle>
        <CardDescription>
          Configure and manage your cryptocurrency API providers
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList className="flex-grow max-w-md">
              {providers.map(provider => (
                <TabsTrigger key={provider.id} value={provider.id} className="flex-1">
                  {provider.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <Button variant="outline" size="sm" onClick={handleAddProvider}>
              Add Provider
            </Button>
          </div>
          
          {providers.map(provider => (
            <TabsContent key={provider.id} value={provider.id} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${provider.id}-apikey`}>API Key</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id={`${provider.id}-apikey`}
                      type="text"
                      value={provider.id === activeTab ? apiKey : ''}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={provider.apiKey ? '••••••••••••••••' : 'Enter API Key'}
                    />
                    <Button onClick={handleSaveApiKey} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Endpoints</h3>
                    <Button variant="outline" size="sm" onClick={handleAddEndpoint}>
                      Add Endpoint
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-3 bg-muted p-2 text-sm font-medium">
                      <div>Name</div>
                      <div>Path</div>
                      <div>Method</div>
                    </div>
                    
                    {provider.endpoints.map(endpoint => (
                      <div key={endpoint.id} className="grid grid-cols-3 p-2 border-t hover:bg-accent/50">
                        <div>{endpoint.name}</div>
                        <div className="font-mono text-sm">{endpoint.path}</div>
                        <div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {endpoint.method}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {provider.endpoints.length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">
                        No endpoints configured
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Base URL</Label>
                    <Input 
                      type="text" 
                      value={provider.baseUrl}
                      readOnly
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Usage</Label>
                    <div className="h-8 bg-muted rounded-md overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(provider.currentUsage / provider.usageLimit) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {provider.currentUsage} / {provider.usageLimit} requests
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiProviderManagement;
