
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "@/components/ui/use-toast";
import { Key, EyeOff, Eye, Check, X, AlertTriangle } from "lucide-react";
import { setCoinGeckoApiKey } from "@/services/api/coinGeckoService";
import { setCryptoCompareApiKey } from "@/services/api/cryptoCompareService";
import { setCoinMarketCapApiKey } from "@/services/api/coinMarketCapService";
import { setMessariApiKey } from "@/services/api/messariService";
import { clearApiCache } from "@/services/enhancedCryptoApi";

interface ApiKey {
  service: string;
  key: string;
  isActive: boolean;
  lastTested?: string;
  testResult?: 'success' | 'failed';
}

const ApiKeyManagement: React.FC = () => {
  const [apiKeys, setApiKeys] = useLocalStorage<ApiKey[]>("api-keys", []);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [newApiKey, setNewApiKey] = useState<ApiKey>({
    service: "coingecko",
    key: "",
    isActive: true
  });
  
  const toggleShowSecret = (service: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };
  
  const handleSaveKey = () => {
    if (!newApiKey.key.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key",
        variant: "destructive"
      });
      return;
    }
    
    // Check if this service already has a key
    const existingKeyIndex = apiKeys.findIndex(k => k.service === newApiKey.service);
    
    if (existingKeyIndex >= 0) {
      // Update existing key
      const updatedKeys = [...apiKeys];
      updatedKeys[existingKeyIndex] = {
        ...updatedKeys[existingKeyIndex],
        key: newApiKey.key,
        isActive: true
      };
      
      setApiKeys(updatedKeys);
      
      toast({
        title: "API Key Updated",
        description: `Your ${getServiceName(newApiKey.service)} API key has been updated`
      });
    } else {
      // Add new key
      setApiKeys([...apiKeys, newApiKey]);
      
      toast({
        title: "API Key Added",
        description: `Your ${getServiceName(newApiKey.service)} API key has been saved`
      });
    }
    
    // Apply the key to the appropriate service
    applyApiKey(newApiKey.service, newApiKey.key);
    
    // Reset the form
    setNewApiKey({
      service: "coingecko",
      key: "",
      isActive: true
    });
  };
  
  const toggleKeyStatus = (service: string, isActive: boolean) => {
    const updatedKeys = apiKeys.map(key => {
      if (key.service === service) {
        return { ...key, isActive };
      }
      return key;
    });
    
    setApiKeys(updatedKeys);
    
    // If deactivating, remove the key from the service
    if (!isActive) {
      applyApiKey(service, null);
      
      toast({
        title: "API Key Deactivated",
        description: `Your ${getServiceName(service)} API key has been deactivated`
      });
    } else {
      // If activating, apply the key to the service
      const key = updatedKeys.find(k => k.service === service);
      if (key) {
        applyApiKey(service, key.key);
        
        toast({
          title: "API Key Activated",
          description: `Your ${getServiceName(service)} API key has been activated`
        });
      }
    }
  };
  
  const deleteKey = (service: string) => {
    const updatedKeys = apiKeys.filter(key => key.service !== service);
    setApiKeys(updatedKeys);
    
    // Remove the key from the service
    applyApiKey(service, null);
    
    toast({
      title: "API Key Removed",
      description: `Your ${getServiceName(service)} API key has been removed`
    });
  };
  
  const applyApiKey = (service: string, key: string | null) => {
    switch (service) {
      case "coingecko":
        setCoinGeckoApiKey(key);
        break;
      case "cryptocompare":
        setCryptoCompareApiKey(key);
        break;
      case "coinmarketcap":
        setCoinMarketCapApiKey(key);
        break;
      case "messari":
        setMessariApiKey(key);
        break;
      default:
        console.warn(`Unknown API service: ${service}`);
    }
    
    // Clear API cache to ensure fresh data with new credentials
    clearApiCache();
  };
  
  // Initialize API keys from localStorage on first load
  React.useEffect(() => {
    apiKeys.forEach(key => {
      if (key.isActive) {
        applyApiKey(key.service, key.key);
      }
    });
  }, []);
  
  const getServiceName = (serviceId: string): string => {
    switch (serviceId) {
      case "coingecko":
        return "CoinGecko";
      case "cryptocompare":
        return "CryptoCompare";
      case "coinmarketcap":
        return "CoinMarketCap";
      case "messari":
        return "Messari";
      default:
        return serviceId.charAt(0).toUpperCase() + serviceId.slice(1);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            API Key Management
          </CardTitle>
          <CardDescription>
            Manage your API keys for various cryptocurrency data providers
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="keys">
            <TabsList className="mb-4">
              <TabsTrigger value="keys">My API Keys</TabsTrigger>
              <TabsTrigger value="add">Add New Key</TabsTrigger>
            </TabsList>
            
            <TabsContent value="keys">
              {apiKeys.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border rounded-md">
                  <p>No API keys added yet.</p>
                  <p className="text-sm mt-2">Add keys to access premium data features.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.service} className="border p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{getServiceName(apiKey.service)}</h3>
                          <div className="mt-1 flex items-center text-sm">
                            <span className="text-muted-foreground mr-2">Key:</span>
                            <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">
                              {showSecrets[apiKey.service] ? apiKey.key : `${apiKey.key.substring(0, 4)}•••••••${apiKey.key.substring(apiKey.key.length - 4)}`}
                            </code>
                            <button 
                              onClick={() => toggleShowSecret(apiKey.service)}
                              className="ml-2 text-muted-foreground hover:text-foreground"
                            >
                              {showSecrets[apiKey.service] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {apiKey.testResult === 'success' && (
                            <span className="text-green-500 flex items-center text-sm">
                              <Check className="h-4 w-4 mr-1" />
                              Valid
                            </span>
                          )}
                          
                          {apiKey.testResult === 'failed' && (
                            <span className="text-red-500 flex items-center text-sm">
                              <X className="h-4 w-4 mr-1" />
                              Invalid
                            </span>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={apiKey.isActive}
                              onCheckedChange={(checked) => toggleKeyStatus(apiKey.service, checked)}
                              id={`switch-${apiKey.service}`}
                            />
                            <Label htmlFor={`switch-${apiKey.service}`}>
                              {apiKey.isActive ? 'Active' : 'Inactive'}
                            </Label>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => deleteKey(apiKey.service)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="add">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="service">Data Provider</Label>
                  <select
                    id="service"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newApiKey.service}
                    onChange={(e) => setNewApiKey({ ...newApiKey, service: e.target.value })}
                  >
                    <option value="coingecko">CoinGecko</option>
                    <option value="cryptocompare">CryptoCompare</option>
                    <option value="coinmarketcap">CoinMarketCap</option>
                    <option value="messari">Messari</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={newApiKey.key}
                    onChange={(e) => setNewApiKey({ ...newApiKey, key: e.target.value })}
                    placeholder="Enter your API key"
                  />
                </div>
                
                <div className="bg-muted/40 p-4 rounded-md flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Important Security Notice</p>
                    <p className="text-muted-foreground">
                      API keys are stored locally in your browser. Never share your API keys 
                      or include them in public repositories.
                    </p>
                  </div>
                </div>
                
                <Button onClick={handleSaveKey} className="w-full">
                  Save API Key
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>About API Keys</CardTitle>
          <CardDescription>
            Enhance your trading experience with premium data access
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">CoinGecko Pro</h3>
                <p className="text-sm text-muted-foreground">
                  Access to higher API rate limits, historical data, and premium endpoints.
                </p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open('https://www.coingecko.com/en/api/pricing', '_blank')}>
                  Get API Key
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">CryptoCompare</h3>
                <p className="text-sm text-muted-foreground">
                  Historical OHLCV data, technical indicators, and exchange data.
                </p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open('https://min-api.cryptocompare.com/', '_blank')}>
                  Get API Key
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">CoinMarketCap</h3>
                <p className="text-sm text-muted-foreground">
                  Industry-standard market data, metrics, and comprehensive pricing.
                </p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open('https://coinmarketcap.com/api/', '_blank')}>
                  Get API Key
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Messari</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed asset profiles, on-chain metrics, and market insights.
                </p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open('https://messari.io/api/docs', '_blank')}>
                  Get API Key
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Benefits of API Keys</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Access to more comprehensive historical data</li>
                <li>Higher rate limits for frequent data refreshes</li>
                <li>Premium endpoints not available with free tiers</li>
                <li>More accurate real-time pricing and market data</li>
                <li>Enhanced technical indicators for better analysis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyManagement;
