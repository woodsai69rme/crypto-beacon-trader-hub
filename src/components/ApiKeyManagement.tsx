
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Plus, Trash, Key } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export const ApiKeyManagement: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 'key-1',
      name: 'Development API Key',
      key: 'sk_test_abcdefghijklmnopqrstuvwxyz123456',
      createdAt: '2023-05-10T12:00:00Z',
      lastUsed: '2023-05-15T09:30:00Z',
      isActive: true
    },
    {
      id: 'key-2',
      name: 'Production API Key',
      key: 'sk_live_abcdefghijklmnopqrstuvwxyz123456',
      createdAt: '2023-04-20T14:30:00Z',
      isActive: false
    }
  ]);
  
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };
  
  const toggleKeyStatus = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, isActive: !key.isActive } : key
    ));
  };
  
  const deleteKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
  };
  
  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: `sk_test_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    setIsCreating(false);
    // Automatically show the newly created key
    setShowKeys(prev => ({
      ...prev,
      [newKey.id]: true
    }));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">API Keys</h2>
        <Button 
          size="sm" 
          onClick={() => setIsCreating(!isCreating)}
          variant={isCreating ? "outline" : "default"}
        >
          <Plus className="h-4 w-4 mr-1" />
          New API Key
        </Button>
      </div>
      
      {isCreating && (
        <div className="border rounded-md p-4 space-y-4 bg-muted/30">
          <h3 className="text-sm font-medium">Create New API Key</h3>
          
          <div className="space-y-2">
            <Label htmlFor="key-name">Key Name</Label>
            <Input
              id="key-name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g., Development Key"
            />
            <p className="text-xs text-muted-foreground">
              Give your API key a descriptive name to remember what it's used for.
            </p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateKey} disabled={!newKeyName.trim()}>
              Create Key
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{apiKey.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="font-mono text-sm bg-muted p-1 rounded">
                    {showKeys[apiKey.id] ? apiKey.key : apiKey.key.substring(0, 10) + '••••••••••••••••'}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2" 
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {showKeys[apiKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-destructive hover:text-destructive" 
                    onClick={() => deleteKey(apiKey.id)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-xs ${apiKey.isActive ? 'text-green-500' : 'text-gray-400'}`}>
                  {apiKey.isActive ? 'Active' : 'Disabled'}
                </span>
                <Switch 
                  checked={apiKey.isActive} 
                  onCheckedChange={() => toggleKeyStatus(apiKey.id)}
                />
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground mt-3 space-y-1">
              <div>Created: {formatDate(apiKey.createdAt)}</div>
              {apiKey.lastUsed && <div>Last used: {formatDate(apiKey.lastUsed)}</div>}
            </div>
          </Card>
        ))}
        
        {apiKeys.length === 0 && (
          <div className="border rounded-md p-8 text-center text-muted-foreground">
            <Key className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No API keys created yet</p>
            <p className="text-sm">Create an API key to integrate with our services</p>
          </div>
        )}
      </div>
      
      <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
        <p>
          <span className="font-medium">Security Notice:</span> API keys provide full access to your account.
          Never share your keys and always use environment variables in production.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyManagement;
