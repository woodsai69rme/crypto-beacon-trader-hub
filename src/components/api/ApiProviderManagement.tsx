import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Key, Plus, Trash2 } from 'lucide-react';
import { ApiProvider, ApiEndpoint } from '@/types/trading';

const ApiProviderManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("market-data");
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [isEditingEndpoint, setIsEditingEndpoint] = useState(false);
  const [newProvider, setNewProvider] = useState<Partial<ApiProvider>>({
    name: '',
    description: '',
    baseUrl: '',
    apiKey: '',
    usageLimit: 1000,
    currentUsage: 0,
    maxUsage: 1000,
    resetTime: new Date().toISOString(),
    endpoint: '',
    status: 'ok',
    isActive: true,
    endpoints: []
  });
  
  // Mock providers for demonstration
  const [providers, setProviders] = useState<ApiProvider[]>([
    {
      id: "coingecko-1",
      name: "CoinGecko",
      baseUrl: "https://api.coingecko.com/api/v3",
      description: "Comprehensive cryptocurrency data API",
      currentUsage: 5243,
      maxUsage: 10000,
      resetTime: "2023-05-02T00:00:00Z",
      endpoint: "coins/markets",
      status: "ok",
      website: "https://www.coingecko.com",
      docs: "https://www.coingecko.com/api/documentation",
      endpoints: [
        {
          id: "cg-markets",
          name: "Markets",
          path: "/coins/markets",
          method: "GET",
          description: "Get cryptocurrency prices, market cap, volume, and market related data",
          url: "/coins/markets",
          responseTime: 245,
          lastUsed: "2023-05-01T12:30:45Z",
          requiresAuth: true
        },
        {
          id: "cg-coin",
          name: "Coin Details",
          path: "/coins/{id}",
          method: "GET",
          description: "Get current data for a coin",
          url: "/coins/{id}",
          responseTime: 187,
          lastUsed: "2023-05-01T11:22:18Z",
          requiresAuth: true
        },
        {
          id: "cg-chart",
          name: "Market Chart",
          path: "/coins/{id}/market_chart",
          method: "GET",
          description: "Get historical market data include price, market cap, and 24h volume",
          url: "/coins/{id}/market_chart",
          responseTime: 320,
          lastUsed: "2023-05-01T10:15:30Z",
          requiresAuth: true
        }
      ],
      isActive: true,
      apiKey: "CG_API_KEY_REDACTED",
      usageLimit: 10000,
      authMethod: "header",
      apiKeyName: "X-CG-API-KEY",
      defaultHeaders: {},
      enabled: true
    },
    {
      id: "binance-1",
      name: "Binance",
      baseUrl: "https://api.binance.com/api/v3",
      description: "Cryptocurrency exchange API",
      currentUsage: 8754,
      maxUsage: 20000,
      resetTime: "2023-05-02T00:00:00Z",
      endpoint: "ticker/24hr",
      status: "ok",
      website: "https://www.binance.com",
      docs: "https://binance-docs.github.io/apidocs/",
      endpoints: [
        {
          id: "bn-ticker",
          name: "Ticker",
          path: "/ticker/24hr",
          method: "GET",
          description: "24 hour rolling window price change statistics",
          url: "/ticker/24hr",
          responseTime: 110,
          lastUsed: "2023-05-01T13:40:22Z",
          requiresAuth: true
        },
        {
          id: "bn-klines",
          name: "Klines",
          path: "/klines",
          method: "GET",
          description: "Kline/candlestick data",
          url: "/klines",
          responseTime: 165,
          lastUsed: "2023-05-01T13:25:40Z",
          requiresAuth: true
        },
        {
          id: "bn-depth",
          name: "Order Book",
          path: "/depth",
          method: "GET",
          description: "Order book depth",
          url: "/depth",
          responseTime: 95,
          lastUsed: "2023-05-01T13:10:05Z",
          requiresAuth: true
        }
      ],
      isActive: true,
      apiKey: "BINANCE_API_KEY_REDACTED",
      usageLimit: 20000,
      authMethod: "query",
      apiKeyName: "api_key",
      defaultHeaders: {},
      enabled: true
    },
    {
      id: "kraken-1",
      name: "Kraken",
      baseUrl: "https://api.kraken.com/0",
      description: "Digital asset exchange API",
      currentUsage: 2134,
      maxUsage: 5000,
      resetTime: "2023-05-02T00:00:00Z",
      endpoint: "public/Ticker",
      status: "ok",
      website: "https://www.kraken.com",
      docs: "https://docs.kraken.com/rest/",
      endpoints: [
        {
          id: "kr-ticker",
          name: "Ticker Information",
          path: "/public/Ticker",
          method: "GET",
          description: "Get ticker information",
          url: "/public/Ticker",
          responseTime: 180,
          lastUsed: "2023-05-01T11:05:15Z",
          requiresAuth: true
        },
        {
          id: "kr-ohlc",
          name: "OHLC Data",
          path: "/public/OHLC",
          method: "GET",
          description: "Open, high, low, close data",
          url: "/public/OHLC",
          responseTime: 210,
          lastUsed: "2023-05-01T10:55:30Z",
          requiresAuth: true
        },
        {
          id: "kr-orderbook",
          name: "Order Book",
          path: "/public/Depth",
          method: "GET",
          description: "Market depth",
          url: "/public/Depth",
          responseTime: 165,
          lastUsed: "2023-05-01T10:30:20Z",
          requiresAuth: true
        }
      ],
      isActive: true,
      apiKey: "KRAKEN_API_KEY_REDACTED",
      usageLimit: 5000,
      authMethod: "header",
      apiKeyName: "API-Key",
      defaultHeaders: {},
      enabled: true
    }
  ]);
  
  const handleAddProvider = () => {
    if (newProvider.name && newProvider.baseUrl) {
      const provider: ApiProvider = {
        id: `provider-${Date.now()}`,
        name: newProvider.name || '',
        baseUrl: newProvider.baseUrl || '',
        description: newProvider.description || '',
        currentUsage: 0, 
        maxUsage: newProvider.usageLimit || 1000,
        resetTime: new Date().toISOString(),
        endpoint: '',
        status: 'ok',
        endpoints: [],
        isActive: true,
        apiKey: newProvider.apiKey || '',
        usageLimit: newProvider.usageLimit || 1000,
        enabled: true
      };
      
      setProviders([...providers, provider]);
      setIsAddingProvider(false);
      setNewProvider({
        name: '',
        description: '',
        baseUrl: '',
        apiKey: ''
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>API Providers</CardTitle>
            <CardDescription>
              Manage your cryptocurrency data providers and endpoints
            </CardDescription>
          </div>
          <Dialog open={isAddingProvider} onOpenChange={setIsAddingProvider}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Provider
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add API Provider</DialogTitle>
                <DialogDescription>
                  Enter the details of the new API provider you want to connect.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Provider Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. CoinGecko"
                    value={newProvider.name}
                    onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baseUrl">Base URL</Label>
                  <Input
                    id="baseUrl"
                    placeholder="e.g. https://api.example.com/v1"
                    value={newProvider.baseUrl}
                    onChange={(e) => setNewProvider({...newProvider, baseUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the API"
                    value={newProvider.description}
                    onChange={(e) => setNewProvider({...newProvider, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="apiKey"
                      placeholder="Your API key"
                      type="password"
                      value={newProvider.apiKey}
                      onChange={(e) => setNewProvider({...newProvider, apiKey: e.target.value})}
                    />
                    <Button variant="outline" size="icon">
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    placeholder="Requests per day"
                    value={newProvider.usageLimit}
                    onChange={(e) => setNewProvider({...newProvider, usageLimit: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingProvider(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProvider}>
                  Add Provider
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="market-data" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="market-data">Market Data</TabsTrigger>
            <TabsTrigger value="trading-apis">Trading APIs</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          
          {/* Market Data Providers */}
          <TabsContent value="market-data">
            {providers.filter(p => p.id.includes("coingecko") || p.id.includes("kraken")).map((provider) => (
              <div key={provider.id} className="mb-6 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">{provider.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Active</span>
                      <Switch 
                        checked={provider.isActive} 
                        onCheckedChange={(checked) => {
                          const updatedProviders = providers.map(p => 
                            p.id === provider.id ? {...p, isActive: checked} : p
                          );
                          setProviders(updatedProviders);
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Endpoints</h4>
                  <div className="space-y-2">
                    {provider.endpoints?.map((endpoint) => (
                      <div key={endpoint.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded-md">
                        <div>
                          <span className="text-sm font-medium">{endpoint.name}</span>
                          <div className="flex items-center mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{endpoint.method}</span>
                            <span className="text-xs ml-2 text-muted-foreground">{endpoint.path}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span>{endpoint.responseTime}ms</span>
                          <span className="mx-2">•</span>
                          <span>Last used: {new Date(endpoint.lastUsed).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingEndpoint(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Endpoint
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    <span>{provider.currentUsage} / {provider.maxUsage} requests used</span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          
          {/* Trading APIs */}
          <TabsContent value="trading-apis">
            {providers.filter(p => p.id.includes("binance")).map((provider) => (
              <div key={provider.id} className="mb-6 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">{provider.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Active</span>
                      <Switch 
                        checked={provider.isActive} 
                        onCheckedChange={(checked) => {
                          const updatedProviders = providers.map(p => 
                            p.id === provider.id ? {...p, isActive: checked} : p
                          );
                          setProviders(updatedProviders);
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Endpoints</h4>
                  <div className="space-y-2">
                    {provider.endpoints?.map((endpoint) => (
                      <div key={endpoint.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded-md">
                        <div>
                          <span className="text-sm font-medium">{endpoint.name}</span>
                          <div className="flex items-center mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{endpoint.method}</span>
                            <span className="text-xs ml-2 text-muted-foreground">{endpoint.path}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span>{endpoint.responseTime}ms</span>
                          <span className="mx-2">•</span>
                          <span>Last used: {new Date(endpoint.lastUsed).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <Button variant="ghost" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Endpoint
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    <span>{provider.currentUsage} / {provider.maxUsage} requests used</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add provider button */}
            <Button variant="outline" className="w-full" onClick={() => setIsAddingProvider(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Trading API
            </Button>
          </TabsContent>
          
          {/* Other APIs */}
          <TabsContent value="other">
            <div className="flex items-center justify-center h-48 border rounded-lg">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">No other APIs configured yet</p>
                <Button onClick={() => setIsAddingProvider(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add API Provider
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiProviderManagement;
