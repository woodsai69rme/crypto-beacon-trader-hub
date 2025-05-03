
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { ApiProvider, ApiEndpoint } from "@/types/trading";
import { Key, MoreHorizontal, Plus, Power, PowerOff, RefreshCcw, Star, Trash } from "lucide-react";

const ApiProviderManagement = () => {
  // Mock API provider data
  const [apiProviders, setApiProviders] = useState<ApiProvider[]>([
    {
      id: "1",
      name: "CoinGecko",
      description: "Cryptocurrency market data API",
      endpoints: [
        {
          id: "cg-1",
          name: "Get Coin Markets",
          url: "/api/v3/coins/markets",
          method: "GET",
          description: "List all supported coins with price, volume, and market data",
          responseTime: 245,
          lastUsed: "2023-08-30T14:22:00Z",
          requiresAuth: true
        },
        {
          id: "cg-2",
          name: "Get Coin by ID",
          url: "/api/v3/coins/{id}",
          method: "GET",
          description: "Get current data for a coin by ID",
          responseTime: 185,
          lastUsed: "2023-08-30T15:10:00Z",
          requiresAuth: true
        },
        {
          id: "cg-3",
          name: "Get Price History",
          url: "/api/v3/coins/{id}/market_chart",
          method: "GET",
          description: "Get historical market data for a coin",
          responseTime: 320,
          lastUsed: "2023-08-30T12:45:00Z",
          requiresAuth: true
        }
      ],
      isActive: true,
      apiKey: "1x2y3z4a5b6c7d8e9f",
      usageLimit: 10000,
      currentUsage: 4230
    },
    {
      id: "2",
      name: "Hyblock",
      description: "Market liquidity and order book data provider",
      endpoints: [
        {
          id: "hb-1",
          name: "Get Liquidity Map",
          url: "/api/v2/liquidity/{exchange}/{pair}",
          method: "GET",
          description: "Get real-time liquidity map for a trading pair on specified exchange",
          responseTime: 210,
          lastUsed: "2023-08-30T13:15:00Z",
          requiresAuth: true
        },
        {
          id: "hb-2",
          name: "Get Order Book",
          url: "/api/v2/orderbook/{exchange}/{pair}",
          method: "GET",
          description: "Get current order book for a trading pair",
          responseTime: 150,
          lastUsed: "2023-08-30T14:05:00Z",
          requiresAuth: true
        },
        {
          id: "hb-3",
          name: "Get Large Orders",
          url: "/api/v2/whale-orders/{exchange}",
          method: "GET",
          description: "Track large orders across exchanges",
          responseTime: 275,
          lastUsed: "2023-08-30T11:30:00Z",
          requiresAuth: true
        }
      ],
      isActive: true,
      apiKey: "hyblock-9a8b7c6d5e4f",
      usageLimit: 1000,
      currentUsage: 175
    },
    {
      id: "3",
      name: "Alchemy",
      description: "Blockchain data and node infrastructure",
      endpoints: [
        {
          id: "al-1",
          name: "Get Transaction",
          url: "/api/v1/transaction/{txhash}",
          method: "GET",
          description: "Get transaction details by hash",
          responseTime: 120,
          lastUsed: "2023-08-30T15:45:00Z",
          requiresAuth: true
        },
        {
          id: "al-2",
          name: "Get Token Balances",
          url: "/api/v1/token-balances/{address}",
          method: "GET",
          description: "Get all token balances for an address",
          responseTime: 310,
          lastUsed: "2023-08-30T16:20:00Z",
          requiresAuth: true
        },
        {
          id: "al-3",
          name: "Get NFT Metadata",
          url: "/api/v1/nft/{contract}/{tokenId}",
          method: "GET",
          description: "Get metadata for an NFT",
          responseTime: 180,
          lastUsed: "2023-08-30T13:10:00Z",
          requiresAuth: true
        }
      ],
      isActive: false,
      apiKey: "alchemy-x9y8z7a6b5c4",
      usageLimit: 100000,
      currentUsage: 56000
    }
  ]);

  const [newEndpoint, setNewEndpoint] = useState<Partial<ApiEndpoint>>({
    name: "",
    url: "",
    method: "GET",
    description: "",
    requiresAuth: false
  });
  
  const [newProvider, setNewProvider] = useState<Partial<ApiProvider>>({
    name: "",
    description: "",
    endpoints: [],
    isActive: true,
    apiKey: "",
    usageLimit: 1000,
    currentUsage: 0
  });
  
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [isAddingEndpoint, setIsAddingEndpoint] = useState(false);
  const [isAddingProvider, setIsAddingProvider] = useState(false);

  const handleToggleProviderStatus = (id: string) => {
    setApiProviders(providers =>
      providers.map(provider =>
        provider.id === id
          ? { ...provider, isActive: !provider.isActive }
          : provider
      )
    );
    
    const provider = apiProviders.find(p => p.id === id);
    if (provider) {
      toast({
        title: `${provider.name} ${provider.isActive ? 'Disabled' : 'Enabled'}`,
        description: `API provider has been ${provider.isActive ? 'disabled' : 'enabled'}.`,
        duration: 3000,
      });
    }
  };

  const handleSaveApiKey = (id: string, apiKey: string) => {
    setApiProviders(providers =>
      providers.map(provider =>
        provider.id === id ? { ...provider, apiKey } : provider
      )
    );
    
    toast({
      title: "API Key Saved",
      description: "Your API key has been securely updated.",
      duration: 3000,
    });
  };

  const handleAddEndpoint = (providerId: string) => {
    if (!newEndpoint.name || !newEndpoint.url) {
      toast({
        title: "Missing Required Fields",
        description: "Please provide a name and URL for the endpoint.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const endpoint: ApiEndpoint = {
      id: `new-${Date.now()}`,
      name: newEndpoint.name || "",
      url: newEndpoint.url || "",
      method: newEndpoint.method as "GET" | "POST" | "PUT" | "DELETE" || "GET",
      description: newEndpoint.description || "",
      responseTime: 0,
      lastUsed: new Date().toISOString(),
      requiresAuth: newEndpoint.requiresAuth || false
    };
    
    setApiProviders(providers =>
      providers.map(provider =>
        provider.id === providerId
          ? { ...provider, endpoints: [...provider.endpoints, endpoint] }
          : provider
      )
    );
    
    setNewEndpoint({
      name: "",
      url: "",
      method: "GET",
      description: "",
      requiresAuth: false
    });
    
    setIsAddingEndpoint(false);
    
    toast({
      title: "Endpoint Added",
      description: `${endpoint.name} has been added successfully.`,
      duration: 3000,
    });
  };

  const handleAddProvider = () => {
    if (!newProvider.name) {
      toast({
        title: "Missing Required Fields",
        description: "Please provide a name for the API provider.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const provider: ApiProvider = {
      id: `new-${Date.now()}`,
      name: newProvider.name || "",
      description: newProvider.description || "",
      endpoints: [],
      isActive: newProvider.isActive || true,
      apiKey: newProvider.apiKey || "",
      usageLimit: newProvider.usageLimit || 1000,
      currentUsage: 0
    };
    
    setApiProviders([...apiProviders, provider]);
    
    setNewProvider({
      name: "",
      description: "",
      endpoints: [],
      isActive: true,
      apiKey: "",
      usageLimit: 1000,
      currentUsage: 0
    });
    
    setIsAddingProvider(false);
    
    toast({
      title: "API Provider Added",
      description: `${provider.name} has been added successfully.`,
      duration: 3000,
    });
  };

  const handleDeleteEndpoint = (providerId: string, endpointId: string) => {
    setApiProviders(providers =>
      providers.map(provider => {
        if (provider.id === providerId) {
          return {
            ...provider,
            endpoints: provider.endpoints.filter(endpoint => endpoint.id !== endpointId)
          };
        }
        return provider;
      })
    );
    
    toast({
      title: "Endpoint Removed",
      description: "The endpoint has been removed successfully.",
      duration: 3000,
    });
  };

  const handleDeleteProvider = (id: string) => {
    setApiProviders(providers => providers.filter(provider => provider.id !== id));
    
    toast({
      title: "API Provider Removed",
      description: "The API provider has been removed successfully.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">API Providers</h3>
        <Dialog open={isAddingProvider} onOpenChange={setIsAddingProvider}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add API Provider</DialogTitle>
              <DialogDescription>
                Add a new API provider to integrate with the platform.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Name</label>
                <Input
                  className="col-span-3"
                  value={newProvider.name}
                  onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Description</label>
                <Input
                  className="col-span-3"
                  value={newProvider.description}
                  onChange={(e) => setNewProvider({...newProvider, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">API Key</label>
                <Input
                  className="col-span-3"
                  type="password"
                  value={newProvider.apiKey}
                  onChange={(e) => setNewProvider({...newProvider, apiKey: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Usage Limit</label>
                <Input
                  className="col-span-3"
                  type="number"
                  value={newProvider.usageLimit}
                  onChange={(e) => setNewProvider({...newProvider, usageLimit: parseInt(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Status</label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox 
                    id="isActive"
                    checked={newProvider.isActive}
                    onCheckedChange={(checked) => setNewProvider({...newProvider, isActive: !!checked})} 
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Enabled
                  </label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddProvider}>Add Provider</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue={apiProviders[0]?.id}>
        <TabsList className="mb-4 flex-wrap">
          {apiProviders.map((provider) => (
            <TabsTrigger key={provider.id} value={provider.id} className="flex items-center">
              <span>{provider.name}</span>
              <div className={`ml-2 h-2 w-2 rounded-full ${provider.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            </TabsTrigger>
          ))}
        </TabsList>
        
        {apiProviders.map((provider) => (
          <TabsContent key={provider.id} value={provider.id}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{provider.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{provider.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant={provider.isActive ? "outline" : "default"} 
                      size="sm"
                      onClick={() => handleToggleProviderStatus(provider.id)}
                    >
                      {provider.isActive ? (
                        <PowerOff className="h-4 w-4 mr-2" />
                      ) : (
                        <Power className="h-4 w-4 mr-2" />
                      )}
                      {provider.isActive ? 'Disable' : 'Enable'}
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem>
                              <Key className="h-4 w-4 mr-2" />
                              Update API Key
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update API Key</DialogTitle>
                              <DialogDescription>
                                Enter your new API key for {provider.name}.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Input
                                type="password"
                                defaultValue={provider.apiKey}
                                id="apiKey"
                              />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button onClick={() => {
                                const inputElement = document.getElementById('apiKey') as HTMLInputElement;
                                handleSaveApiKey(provider.id, inputElement?.value || '');
                              }}>
                                Save Key
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem onClick={() => {}}>
                          <Star className="h-4 w-4 mr-2" />
                          Mark as Favorite
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {}}>
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          Reset Usage Stats
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem className="text-red-500">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete Provider
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete {provider.name}? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button 
                                variant="destructive"
                                onClick={() => handleDeleteProvider(provider.id)}
                              >
                                Delete Provider
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-1">API Key</div>
                    <div className="flex items-center">
                      <div className="font-mono bg-secondary p-2 rounded text-xs w-full overflow-hidden">
                        {provider.apiKey ? '•'.repeat(16) : 'No API key set'}
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-1">Usage</div>
                    <div className="flex justify-between">
                      <span>{provider.currentUsage} / {provider.usageLimit}</span>
                      <span>{((provider.currentUsage / provider.usageLimit) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          provider.currentUsage / provider.usageLimit > 0.8 
                            ? 'bg-red-500'
                            : provider.currentUsage / provider.usageLimit > 0.5
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${(provider.currentUsage / provider.usageLimit) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-medium">Available Endpoints</h4>
                  <Dialog open={isAddingEndpoint && selectedProviderId === provider.id} 
                    onOpenChange={(open) => {
                      setIsAddingEndpoint(open);
                      if (open) setSelectedProviderId(provider.id);
                    }}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Endpoint
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add API Endpoint</DialogTitle>
                        <DialogDescription>
                          Add a new API endpoint for {provider.name}.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right text-sm font-medium">Name</label>
                          <Input
                            className="col-span-3"
                            value={newEndpoint.name}
                            onChange={(e) => setNewEndpoint({...newEndpoint, name: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right text-sm font-medium">URL</label>
                          <Input
                            className="col-span-3"
                            value={newEndpoint.url}
                            onChange={(e) => setNewEndpoint({...newEndpoint, url: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right text-sm font-medium">Method</label>
                          <Select
                            value={newEndpoint.method}
                            onValueChange={(value) => setNewEndpoint({
                              ...newEndpoint, 
                              method: value as "GET" | "POST" | "PUT" | "DELETE"
                            })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GET">GET</SelectItem>
                              <SelectItem value="POST">POST</SelectItem>
                              <SelectItem value="PUT">PUT</SelectItem>
                              <SelectItem value="DELETE">DELETE</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right text-sm font-medium">Description</label>
                          <Input
                            className="col-span-3"
                            value={newEndpoint.description}
                            onChange={(e) => setNewEndpoint({...newEndpoint, description: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right text-sm font-medium">Requires Auth</label>
                          <div className="col-span-3 flex items-center space-x-2">
                            <Checkbox 
                              id="requiresAuth"
                              checked={newEndpoint.requiresAuth}
                              onCheckedChange={(checked) => setNewEndpoint({...newEndpoint, requiresAuth: !!checked})} 
                            />
                            <label htmlFor="requiresAuth" className="text-sm font-medium">
                              Authentication Required
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={() => handleAddEndpoint(provider.id)}>
                          Add Endpoint
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="hidden md:table-cell">URL</TableHead>
                      <TableHead className="hidden lg:table-cell">Last Used</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {provider.endpoints.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No endpoints available for this provider
                        </TableCell>
                      </TableRow>
                    ) : (
                      provider.endpoints.map((endpoint) => (
                        <TableRow key={endpoint.id}>
                          <TableCell className="font-medium">
                            {endpoint.name}
                            {endpoint.requiresAuth && (
                              <span className="ml-2 text-xs py-0.5 px-1.5 bg-yellow-500/10 text-yellow-500 rounded">
                                Auth
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={`text-xs py-0.5 px-1.5 rounded 
                              ${endpoint.method === 'GET' ? 'bg-green-500/10 text-green-500' : 
                                endpoint.method === 'POST' ? 'bg-blue-500/10 text-blue-500' : 
                                endpoint.method === 'PUT' ? 'bg-yellow-500/10 text-yellow-500' : 
                                'bg-red-500/10 text-red-500'}`}
                            >
                              {endpoint.method}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-xs hidden md:table-cell">
                            {endpoint.url}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                            {new Date(endpoint.lastUsed).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {}}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {}}>
                                  Test Endpoint
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteEndpoint(provider.id, endpoint.id)}
                                  className="text-red-500"
                                >
                                  Delete Endpoint
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ApiProviderManagement;
