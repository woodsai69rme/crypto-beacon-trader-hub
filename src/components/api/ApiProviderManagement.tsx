
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Settings, Trash2, CheckCircle, XCircle, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiProvider, ApiEndpoint } from '@/types/trading';

const ApiProviderManagement: React.FC = () => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<ApiProvider[]>([
    {
      id: "coingecko",
      name: "CoinGecko",
      type: "free",
      url: "https://api.coingecko.com/api/v3",
      baseUrl: "https://api.coingecko.com/api/v3",
      description: "Free crypto data API",
      documentation: "https://www.coingecko.com/en/api/documentation",
      usageLimit: 1000,
      rateLimit: {
        requestsPerMinute: 10,
        requestsPerDay: 1000
      },
      endpoints: {
        price: "/simple/price",
        markets: "/coins/markets",
        assets: "/coins/list",
        news: "/news"
      },
      isActive: true
    },
    {
      id: "cryptocompare",
      name: "CryptoCompare",
      type: "free",
      url: "https://min-api.cryptocompare.com/data",
      baseUrl: "https://min-api.cryptocompare.com/data",
      description: "Real-time and historical crypto data",
      documentation: "https://min-api.cryptocompare.com/documentation",
      usageLimit: 100000,
      rateLimit: {
        requestsPerMinute: 100,
        requestsPerDay: 100000
      },
      endpoints: {
        price: "/price",
        markets: "/top/mktcapfull",
        assets: "/all/coinlist",
        news: "/v2/news/"
      },
      isActive: true
    },
    {
      id: "newsapi",
      name: "NewsAPI",
      type: "paid",
      url: "https://newsapi.org/v2",
      baseUrl: "https://newsapi.org/v2",
      description: "News aggregation API",
      documentation: "https://newsapi.org/docs",
      usageLimit: 1000,
      rateLimit: {
        requestsPerMinute: 500,
        requestsPerDay: 1000
      },
      endpoints: {
        price: "",
        markets: "",
        assets: "",
        news: "/everything"
      },
      isActive: false
    }
  ]);

  const [newProvider, setNewProvider] = useState<Partial<ApiProvider>>({
    name: "",
    type: "free",
    url: "",
    baseUrl: "",
    description: "",
    documentation: "",
    usageLimit: 1000,
    rateLimit: {
      requestsPerMinute: 10,
      requestsPerDay: 1000
    },
    endpoints: {
      price: "",
      markets: "",
      assets: "",
      news: ""
    },
    isActive: true
  });

  const [isAddingProvider, setIsAddingProvider] = useState(false);

  const handleAddProvider = () => {
    if (!newProvider.name || !newProvider.url) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    const provider: ApiProvider = {
      id: newProvider.name!.toLowerCase().replace(/\s+/g, '-'),
      name: newProvider.name!,
      type: newProvider.type as 'free' | 'paid',
      url: newProvider.url!,
      baseUrl: newProvider.baseUrl || newProvider.url!,
      description: newProvider.description || "",
      documentation: newProvider.documentation!,
      usageLimit: newProvider.usageLimit || 1000,
      rateLimit: newProvider.rateLimit!,
      endpoints: newProvider.endpoints!,
      isActive: newProvider.isActive ?? true
    };

    setProviders([...providers, provider]);
    setNewProvider({
      name: "",
      type: "free",
      url: "",
      baseUrl: "",
      description: "",
      documentation: "",
      usageLimit: 1000,
      rateLimit: {
        requestsPerMinute: 10,
        requestsPerDay: 1000
      },
      endpoints: {
        price: "",
        markets: "",
        assets: "",
        news: ""
      },
      isActive: true
    });
    setIsAddingProvider(false);

    toast({
      title: "Success",
      description: "API provider added successfully"
    });
  };

  const handleToggleProvider = (id: string) => {
    setProviders(providers.map(provider => 
      provider.id === id 
        ? { ...provider, isActive: !provider.isActive }
        : provider
    ));
  };

  const handleDeleteProvider = (id: string) => {
    setProviders(providers.filter(provider => provider.id !== id));
    toast({
      title: "Provider Deleted",
      description: "API provider has been removed"
    });
  };

  const handleTestProvider = async (provider: ApiProvider) => {
    toast({
      title: "Testing Connection",
      description: `Testing connection to ${provider.name}...`
    });

    // Simulate API test
    setTimeout(() => {
      toast({
        title: "Connection Test",
        description: `${provider.name} is ${provider.isActive ? 'responding' : 'unavailable'}`,
        variant: provider.isActive ? "default" : "destructive"
      });
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          API Provider Management
        </CardTitle>
        <CardDescription>
          Manage and configure your cryptocurrency data API providers
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="providers">
          <TabsList className="mb-6">
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="add">Add Provider</TabsTrigger>
            <TabsTrigger value="usage">Usage Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="providers" className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-medium">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">{provider.description}</p>
                    </div>
                    <Badge variant={provider.type === 'free' ? 'secondary' : 'default'}>
                      {provider.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={provider.isActive}
                      onCheckedChange={() => handleToggleProvider(provider.id)}
                    />
                    {provider.isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">URL:</span>
                    <div className="font-mono truncate">{provider.url}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rate Limit:</span>
                    <div>{provider.rateLimit.requestsPerMinute}/min</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Daily Limit:</span>
                    <div>{provider.rateLimit.requestsPerDay}/day</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Usage Limit:</span>
                    <div>{provider.usageLimit}</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestProvider(provider)}
                  >
                    <Activity className="h-4 w-4 mr-1" />
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProvider(provider.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="add" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider-name">Provider Name</Label>
                <Input
                  id="provider-name"
                  placeholder="e.g., Binance API"
                  value={newProvider.name || ""}
                  onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="provider-type">Type</Label>
                <Select 
                  value={newProvider.type || "free"} 
                  onValueChange={(value: 'free' | 'paid') => setNewProvider({ ...newProvider, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="provider-url">Base URL</Label>
                <Input
                  id="provider-url"
                  placeholder="https://api.example.com"
                  value={newProvider.baseUrl || ""}
                  onChange={(e) => setNewProvider({ ...newProvider, baseUrl: e.target.value, url: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="provider-docs">Documentation URL</Label>
                <Input
                  id="provider-docs"
                  placeholder="https://docs.example.com"
                  value={newProvider.documentation || ""}
                  onChange={(e) => setNewProvider({ ...newProvider, documentation: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="usage-limit">Usage Limit</Label>
                <Input
                  id="usage-limit"
                  type="number"
                  placeholder="1000"
                  value={newProvider.usageLimit || ""}
                  onChange={(e) => setNewProvider({ ...newProvider, usageLimit: parseInt(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="provider-description">Description</Label>
              <Input
                id="provider-description"
                placeholder="Brief description of the API provider"
                value={newProvider.description || ""}
                onChange={(e) => setNewProvider({ ...newProvider, description: e.target.value })}
              />
            </div>
            
            <Button onClick={handleAddProvider} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Provider
            </Button>
          </TabsContent>
          
          <TabsContent value="usage" className="space-y-4">
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Usage statistics will appear here when providers are actively being used.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiProviderManagement;
