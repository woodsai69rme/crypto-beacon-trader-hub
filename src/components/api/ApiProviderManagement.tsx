
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ApiProvider, ApiEndpoint } from "@/types/trading";
import { apiProviderManager } from "@/services/api/apiProviderConfig";
import { Check, Edit, Plus, Trash } from "lucide-react";

const ApiProviderManagement = () => {
  const [providers, setProviders] = useState<ApiProvider[]>(apiProviderManager.getAllProviders());
  const [editingProvider, setEditingProvider] = useState<ApiProvider | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProvider, setNewProvider] = useState<Partial<ApiProvider>>({
    id: "",
    name: "",
    description: "",
    baseUrl: "",
    website: "",
    docs: "",
    authRequired: false,
    apiKey: "",
    enabled: true,
    requiresAuth: false,
    apiKeyName: "",
    authMethod: "",
    priority: 10,
    endpoints: [],
    defaultHeaders: {}
  });

  const handleAddProvider = () => {
    try {
      const completeProvider: ApiProvider = {
        id: newProvider.id || `provider-${Date.now()}`,
        name: newProvider.name || "New Provider",
        description: newProvider.description || "",
        baseUrl: newProvider.baseUrl || "",
        website: newProvider.website,
        docs: newProvider.docs,
        authRequired: newProvider.authRequired,
        apiKey: newProvider.apiKey || "",
        enabled: newProvider.enabled !== undefined ? newProvider.enabled : true,
        requiresAuth: newProvider.requiresAuth,
        apiKeyName: newProvider.apiKeyName,
        authMethod: newProvider.authMethod,
        priority: newProvider.priority,
        endpoints: newProvider.endpoints || [],
        defaultHeaders: newProvider.defaultHeaders
      };

      apiProviderManager.addProvider(completeProvider);
      setProviders(apiProviderManager.getAllProviders());
      setIsAddingNew(false);
      setNewProvider({
        id: "",
        name: "",
        description: "",
        baseUrl: "",
        website: "",
        docs: "",
        authRequired: false,
        apiKey: "",
        enabled: true,
        requiresAuth: false,
        apiKeyName: "",
        authMethod: "",
        priority: 10,
        endpoints: [],
        defaultHeaders: {}
      });
    } catch (error) {
      console.error("Error adding provider:", error);
    }
  };

  const handleDeleteProvider = (id: string) => {
    try {
      apiProviderManager.deleteProvider(id);
      setProviders(apiProviderManager.getAllProviders());
      if (editingProvider?.id === id) {
        setEditingProvider(null);
      }
    } catch (error) {
      console.error("Error deleting provider:", error);
    }
  };

  const handleToggleProvider = (id: string) => {
    try {
      apiProviderManager.toggleProviderEnabled(id);
      setProviders(apiProviderManager.getAllProviders());
      
      if (editingProvider?.id === id) {
        const updatedProvider = apiProviderManager.getProviderById(id);
        if (updatedProvider) {
          setEditingProvider(updatedProvider);
        }
      }
    } catch (error) {
      console.error("Error toggling provider:", error);
    }
  };

  const handleUpdateApiKey = (id: string, apiKey: string) => {
    try {
      apiProviderManager.setProviderApiKey(id, apiKey);
      setProviders(apiProviderManager.getAllProviders());
      
      if (editingProvider?.id === id) {
        const updatedProvider = apiProviderManager.getProviderById(id);
        if (updatedProvider) {
          setEditingProvider(updatedProvider);
        }
      }
    } catch (error) {
      console.error("Error updating API key:", error);
    }
  };

  const handleResetProviders = () => {
    if (confirm("This will reset all providers to default settings. Continue?")) {
      apiProviderManager.resetToDefaults();
      setProviders(apiProviderManager.getAllProviders());
      setEditingProvider(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>API Provider Management</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddingNew(!isAddingNew)}
          >
            {isAddingNew ? <Check className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
            {isAddingNew ? "Done" : "Add Provider"}
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleResetProviders}
          >
            Reset to Defaults
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isAddingNew && (
          <Card className="mb-4 border-dashed">
            <CardHeader>
              <CardTitle>Add New Provider</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-id">ID</Label>
                  <Input 
                    id="new-id" 
                    value={newProvider.id} 
                    onChange={(e) => setNewProvider({...newProvider, id: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-name">Name</Label>
                  <Input 
                    id="new-name" 
                    value={newProvider.name} 
                    onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-description">Description</Label>
                <Input 
                  id="new-description" 
                  value={newProvider.description} 
                  onChange={(e) => setNewProvider({...newProvider, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-baseUrl">Base URL</Label>
                <Input 
                  id="new-baseUrl" 
                  value={newProvider.baseUrl} 
                  onChange={(e) => setNewProvider({...newProvider, baseUrl: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-website">Website</Label>
                  <Input 
                    id="new-website" 
                    value={newProvider.website} 
                    onChange={(e) => setNewProvider({...newProvider, website: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-docs">Documentation URL</Label>
                  <Input 
                    id="new-docs" 
                    value={newProvider.docs} 
                    onChange={(e) => setNewProvider({...newProvider, docs: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="new-requiresAuth">Authentication</Label>
                  <Switch 
                    id="new-requiresAuth" 
                    checked={newProvider.requiresAuth}
                    onCheckedChange={(checked) => 
                      setNewProvider({...newProvider, requiresAuth: checked, authRequired: checked})
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-authMethod">Auth Method</Label>
                  <Select 
                    value={newProvider.authMethod} 
                    onValueChange={(value) => setNewProvider({...newProvider, authMethod: value})}
                    disabled={!newProvider.requiresAuth}
                  >
                    <SelectTrigger id="new-authMethod">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="query">Query Parameter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-apiKeyName">API Key Name</Label>
                  <Input 
                    id="new-apiKeyName" 
                    value={newProvider.apiKeyName} 
                    onChange={(e) => setNewProvider({...newProvider, apiKeyName: e.target.value})}
                    disabled={!newProvider.requiresAuth}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-priority">Priority (lower is higher)</Label>
                  <Input 
                    id="new-priority" 
                    type="number" 
                    value={newProvider.priority} 
                    onChange={(e) => setNewProvider({...newProvider, priority: parseInt(e.target.value)})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="new-enabled">Enabled</Label>
                  <Switch 
                    id="new-enabled" 
                    checked={newProvider.enabled}
                    onCheckedChange={(checked) => setNewProvider({...newProvider, enabled: checked})}
                  />
                </div>
              </div>
              
              <Button onClick={handleAddProvider}>
                Add Provider
              </Button>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-4">
          {providers.map((provider) => (
            <Card key={provider.id} className={!provider.enabled ? "opacity-60" : ""}>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <div className="flex items-center">
                  <Switch 
                    checked={provider.enabled}
                    onCheckedChange={() => handleToggleProvider(provider.id)}
                    className="mr-2"
                  />
                  <div>
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{provider.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setEditingProvider(editingProvider?.id === provider.id ? null : provider)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {provider.id !== "coingecko" && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteProvider(provider.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              {editingProvider?.id === provider.id && (
                <CardContent className="border-t pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${provider.id}-description`}>Description</Label>
                    <Input 
                      id={`${provider.id}-description`} 
                      value={editingProvider.description}
                      onChange={(e) => setEditingProvider({...editingProvider, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`${provider.id}-baseUrl`}>Base URL</Label>
                    <Input 
                      id={`${provider.id}-baseUrl`} 
                      value={editingProvider.baseUrl}
                      onChange={(e) => setEditingProvider({...editingProvider, baseUrl: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${provider.id}-website`}>Website</Label>
                      <Input 
                        id={`${provider.id}-website`} 
                        value={editingProvider.website}
                        onChange={(e) => setEditingProvider({...editingProvider, website: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${provider.id}-docs`}>Documentation URL</Label>
                      <Input 
                        id={`${provider.id}-docs`} 
                        value={editingProvider.docs}
                        onChange={(e) => setEditingProvider({...editingProvider, docs: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${provider.id}-priority`}>Priority (lower is higher)</Label>
                      <Input 
                        id={`${provider.id}-priority`} 
                        type="number" 
                        value={editingProvider.priority || 10}
                        onChange={(e) => setEditingProvider({
                          ...editingProvider, 
                          priority: parseInt(e.target.value)
                        })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`${provider.id}-requiresAuth`}>Authentication Required</Label>
                      <Switch 
                        id={`${provider.id}-requiresAuth`} 
                        checked={editingProvider.requiresAuth || editingProvider.authRequired}
                        onCheckedChange={(checked) => setEditingProvider({
                          ...editingProvider, 
                          requiresAuth: checked,
                          authRequired: checked
                        })}
                      />
                    </div>
                  </div>
                  
                  {(editingProvider.requiresAuth || editingProvider.authRequired) && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${provider.id}-authMethod`}>Auth Method</Label>
                          <Select 
                            value={editingProvider.authMethod || "header"} 
                            onValueChange={(value) => setEditingProvider({
                              ...editingProvider, 
                              authMethod: value
                            })}
                          >
                            <SelectTrigger id={`${provider.id}-authMethod`}>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="header">Header</SelectItem>
                              <SelectItem value="query">Query Parameter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${provider.id}-apiKeyName`}>API Key Name</Label>
                          <Input 
                            id={`${provider.id}-apiKeyName`} 
                            value={editingProvider.apiKeyName || ""}
                            onChange={(e) => setEditingProvider({
                              ...editingProvider, 
                              apiKeyName: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`${provider.id}-apiKey`}>API Key</Label>
                        <div className="flex gap-2">
                          <Input 
                            id={`${provider.id}-apiKey`} 
                            type="password" 
                            value={editingProvider.apiKey || ""}
                            onChange={(e) => setEditingProvider({...editingProvider, apiKey: e.target.value})}
                            className="flex-1"
                          />
                          <Button 
                            onClick={() => handleUpdateApiKey(provider.id, editingProvider.apiKey || "")}
                          >
                            Save Key
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">API keys are stored locally in your browser.</p>
                      </div>
                    </>
                  )}
                  
                  <Button 
                    onClick={() => {
                      apiProviderManager.updateProvider(provider.id, editingProvider);
                      setProviders(apiProviderManager.getAllProviders());
                      setEditingProvider(null);
                    }}
                  >
                    Save Changes
                  </Button>
                </CardContent>
              )}
              
              {editingProvider?.id !== provider.id && (
                <CardContent className="py-2">
                  <p className="text-sm">{provider.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{provider.baseUrl}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiProviderManagement;
