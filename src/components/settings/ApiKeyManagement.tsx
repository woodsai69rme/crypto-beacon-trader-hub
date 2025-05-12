
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Key, 
  Plus, 
  Eye, 
  EyeOff, 
  Trash2, 
  ChevronRight, 
  Shield 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed?: string;
  permissions: string[];
  active: boolean;
  provider: string;
}

const ApiKeyManagement: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "key-1",
      name: "Trading Bot API Key",
      key: "sk-1234567890abcdef1234567890abcdef",
      created: "2023-06-15T10:30:00Z",
      lastUsed: "2023-10-12T14:22:15Z",
      permissions: ["read", "trade"],
      active: true,
      provider: "binance"
    },
    {
      id: "key-2",
      name: "Analytics Tool",
      key: "sk-abcdef1234567890abcdef1234567890",
      created: "2023-08-22T15:45:00Z",
      lastUsed: "2023-10-10T09:12:30Z",
      permissions: ["read"],
      active: true,
      provider: "kraken"
    }
  ]);
  
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeySecret, setNewKeySecret] = useState("");
  const [newKeyProvider, setNewKeyProvider] = useState("binance");
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(["read"]);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  
  const toggleKeyVisibility = (keyId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };
  
  const handleAddKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) return;
    
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: newKeyValue,
      created: new Date().toISOString(),
      permissions: newKeyPermissions,
      active: true,
      provider: newKeyProvider
    };
    
    setApiKeys(prev => [...prev, newKey]);
    setIsAddingKey(false);
    setNewKeyName("");
    setNewKeyValue("");
    setNewKeySecret("");
    setNewKeyProvider("binance");
    setNewKeyPermissions(["read"]);
  };
  
  const handleDeleteKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
  };
  
  const toggleKeyPermission = (permission: string) => {
    if (newKeyPermissions.includes(permission)) {
      setNewKeyPermissions(prev => prev.filter(p => p !== permission));
    } else {
      setNewKeyPermissions(prev => [...prev, permission]);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Keys
        </CardTitle>
        
        <Dialog open={isAddingKey} onOpenChange={setIsAddingKey}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New API Key</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="Trading Bot Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="key-provider">Exchange/Provider</Label>
                <Select value={newKeyProvider} onValueChange={setNewKeyProvider}>
                  <SelectTrigger id="key-provider">
                    <SelectValue placeholder="Select provider" />
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
              
              <div className="space-y-2">
                <Label htmlFor="key-value">API Key</Label>
                <Input
                  id="key-value"
                  placeholder="Enter API key"
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="key-secret">API Secret</Label>
                <Input
                  id="key-secret"
                  type="password"
                  placeholder="Enter API secret"
                  value={newKeySecret}
                  onChange={(e) => setNewKeySecret(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={newKeyPermissions.includes('read') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleKeyPermission('read')}
                  >
                    Read
                  </Button>
                  <Button
                    variant={newKeyPermissions.includes('trade') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleKeyPermission('trade')}
                  >
                    Trade
                  </Button>
                  <Button
                    variant={newKeyPermissions.includes('withdraw') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleKeyPermission('withdraw')}
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingKey(false)}>Cancel</Button>
              <Button onClick={handleAddKey}>Add Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {apiKeys.length === 0 ? (
            <div className="text-center py-6">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">No API keys added yet</p>
              <Button onClick={() => setIsAddingKey(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Your First API Key
              </Button>
            </div>
          ) : (
            apiKeys.map(key => (
              <div key={key.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium flex items-center gap-1">
                      {key.name}
                      {key.active ? (
                        <Badge variant="outline" className="text-green-500 bg-green-50">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-500 bg-red-50">Inactive</Badge>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {key.provider.charAt(0).toUpperCase() + key.provider.slice(1)} •{' '}
                      {new Date(key.created).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDeleteKey(key.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <code className="bg-muted text-xs p-1 rounded font-mono">
                    {showSecrets[key.id] ? key.key : key.key.substring(0, 8) + "•".repeat(16)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleKeyVisibility(key.id)}
                    className="h-6 w-6 p-0"
                  >
                    {showSecrets[key.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showSecrets[key.id] ? "Hide" : "Show"}
                    </span>
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {key.permissions.map(permission => (
                      <Badge key={permission} variant="secondary" className="text-xs capitalize">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <span>Details</span>
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManagement;
