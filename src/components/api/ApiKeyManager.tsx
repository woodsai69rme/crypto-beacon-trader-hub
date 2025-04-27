
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiKeyInfo } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";
import { Shield, Eye, EyeOff, Plus, Trash2 } from "lucide-react";

const ApiKeyManager = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([
    {
      id: "1",
      name: "Binance Main",
      exchange: "binance",
      key: "aFx92jKlp0QmZsFdR3gT5vH7",
      secret: "••••••••••••••••••••••••••",
      createdAt: "2023-12-01T10:30:00Z",
      lastUsed: "2024-04-25T08:45:12Z",
      permissions: ["read", "trade"],
      isActive: true
    },
    {
      id: "2",
      name: "Coinbase Pro",
      exchange: "coinbase",
      key: "bXq45lKrT8sMnGhJ2pL9zV6d",
      secret: "••••••••••••••••••••••••••",
      createdAt: "2024-01-15T14:20:00Z",
      lastUsed: "2024-04-26T16:10:33Z",
      permissions: ["read"],
      isActive: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newApiKey, setNewApiKey] = useState<Partial<ApiKeyInfo>>({
    name: "",
    exchange: "binance",
    key: "",
    secret: "",
    permissions: ["read"],
    isActive: true
  });

  const handleAddKey = () => {
    if (!newApiKey.name || !newApiKey.key || !newApiKey.secret) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newKey: ApiKeyInfo = {
      id: Date.now().toString(),
      name: newApiKey.name,
      exchange: newApiKey.exchange || "binance",
      key: newApiKey.key,
      secret: newApiKey.secret,
      createdAt: new Date().toISOString(),
      permissions: newApiKey.permissions || ["read"],
      isActive: true
    };

    setApiKeys([...apiKeys, newKey]);
    setNewApiKey({
      name: "",
      exchange: "binance",
      key: "",
      secret: "",
      permissions: ["read"],
      isActive: true
    });
    setShowAddForm(false);

    toast({
      title: "API Key Added",
      description: `${newKey.name} has been added successfully`
    });
  };

  const deleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast({
      title: "API Key Removed",
      description: "The API key has been removed successfully"
    });
  };

  const toggleKeyStatus = (id: string) => {
    setApiKeys(apiKeys.map(key => {
      if (key.id === id) {
        return { ...key, isActive: !key.isActive };
      }
      return key;
    }));
  };

  const getExchangeIcon = (exchange: string) => {
    switch (exchange.toLowerCase()) {
      case "binance":
        return "🟡";
      case "coinbase":
        return "🔵";
      case "kraken":
        return "🟣";
      default:
        return "🔑";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">API Key Management</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add API Key
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-dashed">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Key Name</Label>
                <Input 
                  id="name" 
                  placeholder="My Exchange API" 
                  value={newApiKey.name} 
                  onChange={e => setNewApiKey({...newApiKey, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exchange">Exchange</Label>
                <Select 
                  value={newApiKey.exchange} 
                  onValueChange={value => setNewApiKey({...newApiKey, exchange: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="binance">Binance</SelectItem>
                    <SelectItem value="coinbase">Coinbase</SelectItem>
                    <SelectItem value="kraken">Kraken</SelectItem>
                    <SelectItem value="kucoin">KuCoin</SelectItem>
                    <SelectItem value="ftx">FTX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apikey">API Key</Label>
              <Input 
                id="apikey" 
                placeholder="Enter API Key" 
                value={newApiKey.key} 
                onChange={e => setNewApiKey({...newApiKey, key: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret">API Secret</Label>
              <Input 
                id="secret" 
                type="password" 
                placeholder="Enter API Secret" 
                value={newApiKey.secret} 
                onChange={e => setNewApiKey({...newApiKey, secret: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={newApiKey.permissions?.includes("read") ? "default" : "outline"}
                  size="sm" 
                  onClick={() => {
                    const permissions = newApiKey.permissions || [];
                    if (permissions.includes("read")) {
                      setNewApiKey({
                        ...newApiKey, 
                        permissions: permissions.filter(p => p !== "read")
                      });
                    } else {
                      setNewApiKey({
                        ...newApiKey, 
                        permissions: [...permissions, "read"]
                      });
                    }
                  }}
                >
                  Read
                </Button>
                <Button 
                  variant={newApiKey.permissions?.includes("trade") ? "default" : "outline"} 
                  size="sm"
                  onClick={() => {
                    const permissions = newApiKey.permissions || [];
                    if (permissions.includes("trade")) {
                      setNewApiKey({
                        ...newApiKey, 
                        permissions: permissions.filter(p => p !== "trade")
                      });
                    } else {
                      setNewApiKey({
                        ...newApiKey, 
                        permissions: [...permissions, "trade"]
                      });
                    }
                  }}
                >
                  Trade
                </Button>
                <Button 
                  variant={newApiKey.permissions?.includes("withdraw") ? "default" : "outline"} 
                  size="sm"
                  onClick={() => {
                    const permissions = newApiKey.permissions || [];
                    if (permissions.includes("withdraw")) {
                      setNewApiKey({
                        ...newApiKey, 
                        permissions: permissions.filter(p => p !== "withdraw")
                      });
                    } else {
                      setNewApiKey({
                        ...newApiKey, 
                        permissions: [...permissions, "withdraw"]
                      });
                    }
                  }}
                >
                  Withdraw
                </Button>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button onClick={handleAddKey}>Save API Key</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="rounded-md border">
        <div className="bg-muted/50 p-2 grid grid-cols-5 font-medium text-sm">
          <div>Exchange</div>
          <div>Name</div>
          <div>API Key</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        <div>
          {apiKeys.length > 0 ? (
            apiKeys.map((key) => (
              <div key={key.id} className="border-t p-2 grid grid-cols-5 items-center">
                <div className="flex items-center">
                  <span className="mr-2">{getExchangeIcon(key.exchange)}</span>
                  <span className="capitalize">{key.exchange}</span>
                </div>
                <div>{key.name}</div>
                <div className="flex items-center">
                  <code className="bg-muted p-1 rounded text-xs">{key.key.substring(0, 8)}…</code>
                </div>
                <div>
                  <Button
                    variant={key.isActive ? "outline" : "ghost"}
                    size="sm"
                    className={`${key.isActive ? "text-green-500 border-green-200" : "text-muted-foreground"}`}
                    onClick={() => toggleKeyStatus(key.id)}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    {key.isActive ? "Active" : "Disabled"}
                  </Button>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteKey(key.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No API keys added. Add your first exchange API key to start trading.
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground mt-2">
        <span className="flex items-center"><Shield className="h-4 w-4 mr-1 inline" /> Your API keys are stored securely and never shared with third parties.</span>
      </div>
    </div>
  );
};

export default ApiKeyManager;
