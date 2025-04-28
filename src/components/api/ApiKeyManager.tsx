
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { ApiKeyInfo } from '@/types/trading';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Plus, Trash, Check, AlertTriangle } from 'lucide-react';

const ApiKeyManager = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([
    { 
      service: "CoinGecko", 
      key: "cg_api_key_123456789abcdef", 
      isActive: true,
      lastTested: new Date().toISOString(),
      testResult: 'success'
    },
    { 
      service: "CryptoCompare", 
      key: "cc_api_key_abcdef123456789", 
      isActive: true,
      lastTested: new Date().toISOString(),
      testResult: 'success'
    }
  ]);
  
  const [newService, setNewService] = useState<string>("");
  const [newKey, setNewKey] = useState<string>("");
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  
  const handleAddKey = () => {
    if (!newService || !newKey) {
      toast({
        title: "Error",
        description: "Please enter both service and API key",
        variant: "destructive"
      });
      return;
    }
    
    const newKeyInfo: ApiKeyInfo = {
      service: newService,
      key: newKey,
      isActive: true
    };
    
    setApiKeys([...apiKeys, newKeyInfo]);
    setNewService("");
    setNewKey("");
    
    toast({
      title: "API Key Added",
      description: `API key for ${newService} has been added`
    });
  };
  
  const handleRemoveKey = (index: number) => {
    const updatedKeys = [...apiKeys];
    const removedKey = updatedKeys[index];
    updatedKeys.splice(index, 1);
    setApiKeys(updatedKeys);
    
    toast({
      title: "API Key Removed",
      description: `API key for ${removedKey.service} has been removed`
    });
  };
  
  const toggleKeyVisibility = (index: number) => {
    setShowKey({
      ...showKey,
      [index]: !showKey[index]
    });
  };
  
  const toggleKeyActive = (index: number) => {
    const updatedKeys = [...apiKeys];
    updatedKeys[index].isActive = !updatedKeys[index].isActive;
    setApiKeys(updatedKeys);
    
    toast({
      title: updatedKeys[index].isActive ? "API Key Activated" : "API Key Deactivated",
      description: `API key for ${updatedKeys[index].service} has been ${updatedKeys[index].isActive ? 'activated' : 'deactivated'}`
    });
  };
  
  const testApiKey = (index: number) => {
    // Simulate API key testing
    const updatedKeys = [...apiKeys];
    
    // For demonstration, we'll randomly determine if the test is successful
    const isSuccessful = Math.random() > 0.2;
    
    updatedKeys[index] = {
      ...updatedKeys[index],
      lastTested: new Date().toISOString(),
      testResult: isSuccessful ? 'success' : 'failed'
    };
    
    setApiKeys(updatedKeys);
    
    toast({
      title: isSuccessful ? "API Key Valid" : "API Key Invalid",
      description: isSuccessful 
        ? `API key for ${updatedKeys[index].service} is valid and working` 
        : `API key for ${updatedKeys[index].service} failed verification`,
      variant: isSuccessful ? "default" : "destructive"
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="service">Service</Label>
            <Input
              id="service"
              placeholder="e.g. CoinGecko, Binance"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setShowKey({...showKey, new: !showKey.new})}
              >
                {showKey.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        <Button onClick={handleAddKey} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add API Key
        </Button>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Saved API Keys</h3>
        
        {apiKeys.length > 0 ? (
          <div className="space-y-3">
            {apiKeys.map((apiKey, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="font-medium">{apiKey.service}</span>
                    {apiKey.testResult && (
                      <span className="ml-2">
                        {apiKey.testResult === 'success' ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-muted-foreground font-mono">
                      {showKey[index] ? apiKey.key : apiKey.key.substring(0, 3) + '•'.repeat(apiKey.key.length - 6) + apiKey.key.substring(apiKey.key.length - 3)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleKeyVisibility(index)}
                    >
                      {showKey[index] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                  {apiKey.lastTested && (
                    <div className="text-xs text-muted-foreground">
                      Last tested: {new Date(apiKey.lastTested).toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Toggle
                    pressed={apiKey.isActive}
                    onPressedChange={() => toggleKeyActive(index)}
                    aria-label="Toggle API key active state"
                  >
                    {apiKey.isActive ? "Active" : "Inactive"}
                  </Toggle>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testApiKey(index)}
                  >
                    Test
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => handleRemoveKey(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No API keys added yet. Add your first API key above.
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeyManager;
