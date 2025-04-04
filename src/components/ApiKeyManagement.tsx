
import { useState } from "react";
import { Key, MoreVertical, Plus, Trash2, Check, Copy, Eye, EyeOff, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApiKey {
  id: string;
  name: string;
  exchange: string;
  key: string;
  secret: string;
  createdAt: Date;
  lastUsed: Date | null;
  permissions: string[];
  active: boolean;
}

interface ApiKeyManagementProps {
  className?: string;
}

const ApiKeyManagement = ({ className }: ApiKeyManagementProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(generateMockApiKeys());
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [newKeyData, setNewKeyData] = useState({
    name: "",
    exchange: "binance",
    key: "",
    secret: "",
    permissions: ["read", "trade"]
  });
  
  const selectedKey = apiKeys.find(key => key.id === selectedKeyId);
  
  function generateMockApiKeys(): ApiKey[] {
    return [
      {
        id: "key1",
        name: "Binance Trading Bot",
        exchange: "binance",
        key: "3f7d85a921c94e72b1c53a58d2e42",
        secret: "98f6b7cae9f0ae9c3733fe28bcfe",
        createdAt: new Date(2025, 0, 15),
        lastUsed: new Date(2025, 3, 1),
        permissions: ["read", "trade"],
        active: true
      },
      {
        id: "key2",
        name: "Coinbase Portfolio Tracker",
        exchange: "coinbase",
        key: "6ad9f5b87c2e4193a8c5f7e962de",
        secret: "0d3e7c8a9b5f4d2c1e6a7b8c9d0e",
        createdAt: new Date(2025, 1, 20),
        lastUsed: new Date(2025, 2, 25),
        permissions: ["read"],
        active: true
      },
      {
        id: "key3",
        name: "Kraken Analytics",
        exchange: "kraken",
        key: "91a8c5f7e962de6ad9f5b87c2e41",
        secret: "e7c8a9b5f4d2c1e6a7b8c9d0e0d3",
        createdAt: new Date(2025, 2, 10),
        lastUsed: null,
        permissions: ["read", "trade", "withdraw"],
        active: false
      }
    ];
  }
  
  const toggleKeyActive = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, active: !key.active } : key
    ));
    
    const key = apiKeys.find(key => key.id === id);
    if (key) {
      toast({
        title: key.active ? "API Key Disabled" : "API Key Enabled",
        description: `${key.name} has been ${key.active ? "disabled" : "enabled"}.`
      });
    }
  };
  
  const handleCreateKey = () => {
    const newKey: ApiKey = {
      id: `key${Date.now()}`,
      name: newKeyData.name,
      exchange: newKeyData.exchange,
      key: newKeyData.key,
      secret: newKeyData.secret,
      createdAt: new Date(),
      lastUsed: null,
      permissions: newKeyData.permissions,
      active: true
    };
    
    setApiKeys([...apiKeys, newKey]);
    setIsCreateDialogOpen(false);
    setShowSecrets({ ...showSecrets, [newKey.id]: false });
    
    toast({
      title: "API Key Created",
      description: `${newKey.name} has been successfully created.`
    });
    
    // Reset form
    setNewKeyData({
      name: "",
      exchange: "binance",
      key: "",
      secret: "",
      permissions: ["read", "trade"]
    });
  };
  
  const handleDeleteKey = () => {
    if (selectedKeyId) {
      const keyToDelete = apiKeys.find(key => key.id === selectedKeyId);
      setApiKeys(apiKeys.filter(key => key.id !== selectedKeyId));
      setIsDeleteDialogOpen(false);
      setSelectedKeyId(null);
      
      if (keyToDelete) {
        toast({
          title: "API Key Deleted",
          description: `${keyToDelete.name} has been removed.`,
        });
      }
    }
  };
  
  const toggleSecretVisibility = (id: string) => {
    setShowSecrets({
      ...showSecrets,
      [id]: !showSecrets[id]
    });
  };
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `The ${type} has been copied to your clipboard.`,
    });
  };
  
  const getExchangeIcon = (exchange: string) => {
    switch (exchange) {
      case "binance":
        return "🟡"; // Yellow circle for Binance
      case "coinbase":
        return "🔵"; // Blue circle for Coinbase
      case "kraken":
        return "🟣"; // Purple circle for Kraken
      case "kucoin":
        return "🟢"; // Green circle for KuCoin
      default:
        return "⚪"; // Default
    }
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Check/uncheck permission
  const togglePermission = (permission: string) => {
    if (newKeyData.permissions.includes(permission)) {
      setNewKeyData({
        ...newKeyData,
        permissions: newKeyData.permissions.filter(p => p !== permission)
      });
    } else {
      setNewKeyData({
        ...newKeyData,
        permissions: [...newKeyData.permissions, permission]
      });
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2" />
              API Key Management
            </CardTitle>
            <CardDescription>Connect exchanges for automated trading</CardDescription>
          </div>
          
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add API Key
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="keys">
          <TabsList className="mb-4">
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="keys">
            <div className="space-y-4">
              {apiKeys.length > 0 ? (
                apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className={`p-4 border rounded-md ${!apiKey.active ? "bg-secondary/10" : ""}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <span className="text-xl mr-2" role="img" aria-label={apiKey.exchange}>
                          {getExchangeIcon(apiKey.exchange)}
                        </span>
                        <div>
                          <h3 className="font-medium">
                            {apiKey.name}
                            {!apiKey.active && (
                              <Badge variant="outline" className="ml-2 text-muted-foreground">
                                Disabled
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {apiKey.exchange.charAt(0).toUpperCase() + apiKey.exchange.slice(1)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={apiKey.active}
                          onCheckedChange={() => toggleKeyActive(apiKey.id)}
                        />
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => copyToClipboard(apiKey.key, "API key")}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy API Key
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyToClipboard(apiKey.secret, "API secret")}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy API Secret
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedKeyId(apiKey.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Key
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-2">API Key:</span>
                        <code className="text-xs bg-secondary p-1 rounded">
                          {apiKey.key.substring(0, 8)}...{apiKey.key.substring(apiKey.key.length - 4)}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(apiKey.key, "API key")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-2">Secret:</span>
                        <code className="text-xs bg-secondary p-1 rounded">
                          {showSecrets[apiKey.id]
                            ? apiKey.secret
                            : "••••••••••••••••••••••••"
                          }
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleSecretVisibility(apiKey.id)}
                        >
                          {showSecrets[apiKey.id] ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-2">Permissions:</span>
                        <div className="flex gap-1">
                          {apiKey.permissions.includes("read") && (
                            <Badge variant="outline">Read</Badge>
                          )}
                          {apiKey.permissions.includes("trade") && (
                            <Badge variant="outline">Trade</Badge>
                          )}
                          {apiKey.permissions.includes("withdraw") && (
                            <Badge variant="destructive">Withdraw</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <div className="flex items-center mr-4">
                          <History className="h-3 w-3 mr-1" />
                          Created: {formatDate(apiKey.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <History className="h-3 w-3 mr-1" />
                          Last used: {formatDate(apiKey.lastUsed)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border rounded-md">
                  <Key className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium text-lg">No API Keys</h3>
                  <p className="text-muted-foreground mb-4">
                    Add API keys to connect your exchange accounts
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add API Key
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="usage">
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Rate Limits</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  API usage and rate limits for connected exchanges
                </p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Binance</span>
                      <span className="text-xs text-muted-foreground">
                        1,200 / 1,500 requests (per minute)
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Coinbase</span>
                      <span className="text-xs text-muted-foreground">
                        45 / 100 requests (per second)
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Kraken</span>
                      <span className="text-xs text-muted-foreground">
                        10 / 15 requests (per second)
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "67%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-4">Security Recommendations</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <div className="bg-green-500 rounded-full p-0.5 mr-2 mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <p>Enable IP restrictions on your exchange API keys</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-500 rounded-full p-0.5 mr-2 mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <p>Only grant required permissions (avoid withdraw permission if not needed)</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-500 rounded-full p-0.5 mr-2 mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <p>Use 2FA on all exchange accounts</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-500 rounded-full p-0.5 mr-2 mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <p>Regularly rotate your API keys (every 90 days recommended)</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Create API Key Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add API Key</DialogTitle>
            <DialogDescription>
              Connect to an exchange by adding API credentials
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="key-name">Key Name</Label>
              <Input
                id="key-name"
                value={newKeyData.name}
                onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                placeholder="Trading Bot, Portfolio Tracker, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="exchange">Exchange</Label>
              <Select
                value={newKeyData.exchange}
                onValueChange={(value) => setNewKeyData({ ...newKeyData, exchange: value })}
              >
                <SelectTrigger id="exchange">
                  <SelectValue placeholder="Select exchange" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="binance">Binance</SelectItem>
                  <SelectItem value="coinbase">Coinbase</SelectItem>
                  <SelectItem value="kraken">Kraken</SelectItem>
                  <SelectItem value="kucoin">KuCoin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                value={newKeyData.key}
                onChange={(e) => setNewKeyData({ ...newKeyData, key: e.target.value })}
                placeholder="Enter your API key"
              />
            </div>
            
            <div>
              <Label htmlFor="api-secret">API Secret</Label>
              <Input
                id="api-secret"
                type="password"
                value={newKeyData.secret}
                onChange={(e) => setNewKeyData({ ...newKeyData, secret: e.target.value })}
                placeholder="Enter your API secret"
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Permissions</Label>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permission-read"
                    checked={newKeyData.permissions.includes("read")}
                    onChange={() => togglePermission("read")}
                    className="mr-2"
                  />
                  <Label htmlFor="permission-read" className="text-sm">Read</Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permission-trade"
                    checked={newKeyData.permissions.includes("trade")}
                    onChange={() => togglePermission("trade")}
                    className="mr-2"
                  />
                  <Label htmlFor="permission-trade" className="text-sm">Trade</Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permission-withdraw"
                    checked={newKeyData.permissions.includes("withdraw")}
                    onChange={() => togglePermission("withdraw")}
                    className="mr-2"
                  />
                  <Label htmlFor="permission-withdraw" className="text-sm text-red-500">Withdraw</Label>
                </div>
              </div>
              {newKeyData.permissions.includes("withdraw") && (
                <p className="text-xs text-red-500 mt-2">
                  Warning: Withdraw permission allows funds to be moved out of your exchange account.
                  Only enable if necessary.
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateKey}
              disabled={!newKeyData.name || !newKeyData.key || !newKeyData.secret || newKeyData.permissions.length === 0}
            >
              Add API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this API key? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedKey && (
            <div className="py-4">
              <div className="flex items-center">
                <span className="text-xl mr-2" role="img" aria-label={selectedKey.exchange}>
                  {getExchangeIcon(selectedKey.exchange)}
                </span>
                <div>
                  <h3 className="font-medium">{selectedKey.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedKey.exchange.charAt(0).toUpperCase() + selectedKey.exchange.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteKey}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ApiKeyManagement;
