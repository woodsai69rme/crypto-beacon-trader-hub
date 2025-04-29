
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Key, EyeOff, Eye, Check, X, AlertTriangle } from "lucide-react";
import { ApiKeyInfo } from "@/types/trading";
import { getCoinGeckoApiKey, setCoinGeckoApiKey } from "@/services/api/coinGeckoService";
import { getCryptoCompareApiKey, setCryptoCompareApiKey } from "@/services/api/cryptoCompareService";
import { getCoinMarketCapApiKey, setCoinMarketCapApiKey } from "@/services/api/coinMarketCapService";

const ApiKeyManager = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([
    {
      id: "coingecko",
      provider: "CoinGecko",
      key: "",
      name: "CoinGecko API Key",
      created: new Date().toISOString(),
      isActive: false
    },
    {
      id: "cryptocompare",
      provider: "CryptoCompare",
      key: "",
      name: "CryptoCompare API Key",
      created: new Date().toISOString(),
      isActive: false
    },
    {
      id: "coinmarketcap",
      provider: "CoinMarketCap",
      key: "",
      name: "CoinMarketCap API Key",
      created: new Date().toISOString(),
      isActive: false
    }
  ]);
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [editedKey, setEditedKey] = useState("");
  
  // Load saved API keys on component mount
  useEffect(() => {
    const loadApiKeys = () => {
      const updatedKeys = [...apiKeys];
      
      // Load CoinGecko API key
      const coinGeckoKey = getCoinGeckoApiKey();
      if (coinGeckoKey) {
        const index = updatedKeys.findIndex(k => k.id === "coingecko");
        if (index !== -1) {
          updatedKeys[index] = {
            ...updatedKeys[index],
            key: coinGeckoKey,
            isActive: true
          };
        }
      }
      
      // Load CryptoCompare API key
      const cryptoCompareKey = getCryptoCompareApiKey();
      if (cryptoCompareKey) {
        const index = updatedKeys.findIndex(k => k.id === "cryptocompare");
        if (index !== -1) {
          updatedKeys[index] = {
            ...updatedKeys[index],
            key: cryptoCompareKey,
            isActive: true
          };
        }
      }
      
      // Load CoinMarketCap API key
      const coinMarketCapKey = getCoinMarketCapApiKey();
      if (coinMarketCapKey) {
        const index = updatedKeys.findIndex(k => k.id === "coinmarketcap");
        if (index !== -1) {
          updatedKeys[index] = {
            ...updatedKeys[index],
            key: coinMarketCapKey,
            isActive: true
          };
        }
      }
      
      setApiKeys(updatedKeys);
    };
    
    loadApiKeys();
  }, []);
  
  const startEdit = (id: string, currentKey: string) => {
    setIsEditing(id);
    setEditedKey(currentKey);
  };
  
  const cancelEdit = () => {
    setIsEditing(null);
    setEditedKey("");
  };
  
  const saveKey = (id: string) => {
    const keyIndex = apiKeys.findIndex(k => k.id === id);
    if (keyIndex === -1) return;
    
    let success = false;
    
    // Save key to the appropriate service
    if (id === "coingecko") {
      success = setCoinGeckoApiKey(editedKey);
    } else if (id === "cryptocompare") {
      success = setCryptoCompareApiKey(editedKey);
    } else if (id === "coinmarketcap") {
      success = setCoinMarketCapApiKey(editedKey);
    }
    
    if (success) {
      const updatedKeys = [...apiKeys];
      updatedKeys[keyIndex] = {
        ...updatedKeys[keyIndex],
        key: editedKey,
        isActive: !!editedKey,
        lastUsed: editedKey ? new Date().toISOString() : undefined
      };
      
      setApiKeys(updatedKeys);
      setIsEditing(null);
      setEditedKey("");
      
      toast({
        title: "API Key Saved",
        description: `The ${updatedKeys[keyIndex].provider} API key has been updated.`
      });
    } else {
      toast({
        title: "Error",
        description: "Could not save the API key.",
        variant: "destructive"
      });
    }
  };
  
  const toggleKeyVisibility = (id: string) => {
    setShowKey(showKey === id ? null : id);
  };
  
  const toggleActive = (id: string, active: boolean) => {
    const keyIndex = apiKeys.findIndex(k => k.id === id);
    if (keyIndex === -1) return;
    
    const updatedKeys = [...apiKeys];
    
    if (!active) {
      // If deactivating, clear the key
      if (id === "coingecko") {
        setCoinGeckoApiKey("");
      } else if (id === "cryptocompare") {
        setCryptoCompareApiKey("");
      } else if (id === "coinmarketcap") {
        setCoinMarketCapApiKey("");
      }
      
      updatedKeys[keyIndex] = {
        ...updatedKeys[keyIndex],
        key: "",
        isActive: false
      };
    } else {
      // If activating without a key, start editing
      if (!updatedKeys[keyIndex].key) {
        startEdit(id, "");
        return;
      } else {
        // If key exists, just activate
        updatedKeys[keyIndex] = {
          ...updatedKeys[keyIndex],
          isActive: true
        };
      }
    }
    
    setApiKeys(updatedKeys);
    
    if (!active) {
      toast({
        title: "API Key Deactivated",
        description: `The ${updatedKeys[keyIndex].provider} API key has been removed.`
      });
    }
  };
  
  const maskKey = (key: string) => {
    if (!key) return "Not set";
    if (key.length <= 8) return "●".repeat(key.length);
    return key.substring(0, 4) + "●".repeat(key.length - 8) + key.substring(key.length - 4);
  };
  
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  {apiKey.provider}
                </h3>
                <p className="text-sm text-muted-foreground">{apiKey.name}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor={`activate-${apiKey.id}`} className="sr-only">Activate</Label>
                <Switch
                  id={`activate-${apiKey.id}`}
                  checked={apiKey.isActive}
                  onCheckedChange={(checked) => toggleActive(apiKey.id, checked)}
                />
              </div>
            </div>
            
            {isEditing === apiKey.id ? (
              <div className="space-y-2">
                <Label htmlFor={`key-input-${apiKey.id}`} className="sr-only">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id={`key-input-${apiKey.id}`}
                    value={editedKey}
                    onChange={(e) => setEditedKey(e.target.value)}
                    placeholder="Enter API key"
                    type="text"
                    autoFocus
                  />
                  <Button size="icon" onClick={() => saveKey(apiKey.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={cancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your {apiKey.provider} API key. This will be stored in your browser's local storage.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="font-mono text-sm">
                    {showKey === apiKey.id ? apiKey.key : maskKey(apiKey.key)}
                  </div>
                  
                  {apiKey.key && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {showKey === apiKey.id ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                
                {apiKey.isActive && apiKey.key ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(apiKey.id, apiKey.key)}
                  >
                    Change
                  </Button>
                ) : apiKey.isActive ? (
                  <div className="flex items-center text-amber-500">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-xs">Key required</span>
                  </div>
                ) : null}
              </div>
            )}
            
            {apiKey.isActive && apiKey.lastUsed && (
              <p className="text-xs text-muted-foreground">
                Last used: {new Date(apiKey.lastUsed).toLocaleString()}
              </p>
            )}
          </div>
        ))}
        
        <div className="text-xs text-muted-foreground">
          <p>Note: API keys are stored in your browser's local storage and are not sent to our servers.</p>
          <p className="mt-1">When using public API keys, you may encounter rate limits. Consider signing up for official API access.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManager;
