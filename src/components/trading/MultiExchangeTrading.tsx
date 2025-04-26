
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Plus,
  CircleDollarSign,
  Trash2,
  KeyRound,
  Globe,
  ArrowLeftRight,
  BarChart
} from "lucide-react";

interface ApiKey {
  id: string;
  exchange: string;
  name: string;
  status: "active" | "inactive";
  addedOn: string;
  lastUsed?: string;
}

const MultiExchangeTrading = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "key1",
      exchange: "Binance",
      name: "Main Trading Account",
      status: "active",
      addedOn: "2025-03-15",
      lastUsed: "2025-04-25"
    },
    {
      id: "key2",
      exchange: "Coinbase",
      name: "DCA Account",
      status: "active",
      addedOn: "2025-02-10",
      lastUsed: "2025-04-24"
    },
    {
      id: "key3",
      exchange: "Kraken",
      name: "Altcoin Trading",
      status: "inactive",
      addedOn: "2025-01-05",
      lastUsed: "2025-03-20"
    }
  ]);

  const [newApiKey, setNewApiKey] = useState({
    exchange: "Binance",
    name: "",
    key: "",
    secret: ""
  });

  const handleAddApiKey = () => {
    if (!newApiKey.name || !newApiKey.key || !newApiKey.secret) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newKey: ApiKey = {
      id: `key${Date.now()}`,
      exchange: newApiKey.exchange,
      name: newApiKey.name,
      status: "active",
      addedOn: new Date().toISOString().split('T')[0]
    };

    setApiKeys([...apiKeys, newKey]);
    setNewApiKey({
      exchange: "Binance",
      name: "",
      key: "",
      secret: ""
    });

    toast({
      title: "API Key Added",
      description: `${newApiKey.exchange} API key has been successfully added`,
    });
  };

  const toggleKeyStatus = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id 
        ? { ...key, status: key.status === "active" ? "inactive" : "active" } 
        : key
    ));

    const key = apiKeys.find(key => key.id === id);
    toast({
      title: `API Key ${key?.status === "active" ? "Deactivated" : "Activated"}`,
      description: `${key?.exchange} API key status updated`,
    });
  };

  const deleteKey = (id: string) => {
    const key = apiKeys.find(key => key.id === id);
    setApiKeys(apiKeys.filter(key => key.id !== id));
    
    toast({
      title: "API Key Deleted",
      description: `${key?.exchange} API key has been removed`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Multi-Exchange Trading</CardTitle>
        <CardDescription>
          Connect and trade across multiple exchanges from one interface
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="accounts">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              <span>Exchange Accounts</span>
            </TabsTrigger>
            <TabsTrigger value="trading" className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              <span>Cross-Exchange Trading</span>
            </TabsTrigger>
            <TabsTrigger value="arbitrage" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Arbitrage Scanner</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts">
            <div className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4">Add New Exchange API Key</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Exchange</label>
                    <Select
                      value={newApiKey.exchange}
                      onValueChange={(value) => setNewApiKey({...newApiKey, exchange: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Binance">Binance</SelectItem>
                        <SelectItem value="Coinbase">Coinbase</SelectItem>
                        <SelectItem value="Kraken">Kraken</SelectItem>
                        <SelectItem value="KuCoin">KuCoin</SelectItem>
                        <SelectItem value="Bybit">Bybit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Key Name</label>
                    <Input 
                      placeholder="Main Trading Account" 
                      value={newApiKey.name}
                      onChange={(e) => setNewApiKey({...newApiKey, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">API Key</label>
                    <Input 
                      type="password" 
                      placeholder="Enter API key" 
                      value={newApiKey.key}
                      onChange={(e) => setNewApiKey({...newApiKey, key: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">API Secret</label>
                    <Input 
                      type="password" 
                      placeholder="Enter API secret"
                      value={newApiKey.secret}
                      onChange={(e) => setNewApiKey({...newApiKey, secret: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleAddApiKey}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add API Key
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Connected Exchanges</h3>
                
                {apiKeys.length === 0 ? (
                  <div className="text-center p-8 border rounded-md">
                    <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No exchange API keys added yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add an API key to start trading across exchanges
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map(key => (
                      <div key={key.id} className="flex justify-between items-center p-4 border rounded-md">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                            <CircleDollarSign className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{key.name}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">{key.exchange}</span>
                              <Badge variant={key.status === "active" ? "default" : "secondary"}>
                                {key.status === "active" ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <div>
                            Added: {key.addedOn}
                          </div>
                          {key.lastUsed && (
                            <div>
                              Last used: {key.lastUsed}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => toggleKeyStatus(key.id)}
                          >
                            {key.status === "active" ? "Deactivate" : "Activate"}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => deleteKey(key.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trading">
            <div className="text-center p-8">
              <ArrowLeftRight className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Cross-Exchange Trading</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                Trade seamlessly across multiple exchanges. Connect at least one exchange API to get started.
              </p>
              <Button className="mt-4" disabled={apiKeys.length === 0}>
                Set Up Cross-Exchange Trading
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="arbitrage">
            <div className="text-center p-8">
              <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Arbitrage Scanner</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                Automatically scan for price differences between exchanges to find profitable arbitrage opportunities.
              </p>
              <Button className="mt-4" disabled={apiKeys.length === 0}>
                Launch Arbitrage Scanner
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MultiExchangeTrading;
