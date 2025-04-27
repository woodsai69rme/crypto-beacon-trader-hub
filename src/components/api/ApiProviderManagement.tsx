
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { apiProviderManager } from "@/services/api/apiProviderConfig";
import { ApiProvider } from "@/types/trading";
import { Settings, Pencil, Trash, Plus } from "lucide-react";

const ApiProviderManagement: React.FC = () => {
  const [providers, setProviders] = useState<ApiProvider[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<ApiProvider | null>(null);
  const [newProvider, setNewProvider] = useState<Partial<ApiProvider>>({
    name: "",
    baseUrl: "",
    authMethod: "header",
    requiresAuth: false,
    enabled: true,
    priority: 10,
    endpoints: {}
  });
  
  useEffect(() => {
    refreshProviders();
  }, []);
  
  const refreshProviders = () => {
    try {
      const allProviders = apiProviderManager.getAllProviders();
      setProviders(allProviders);
    } catch (error) {
      console.error("Error loading API providers:", error);
      toast({
        title: "Error Loading Providers",
        description: "Failed to load API providers. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleToggleProvider = (id: string) => {
    try {
      apiProviderManager.toggleProviderEnabled(id);
      refreshProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateApiKey = (id: string, apiKey: string) => {
    try {
      apiProviderManager.setProviderApiKey(id, apiKey);
      refreshProviders();
      
      toast({
        title: "API Key Updated",
        description: "Your API key has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };
  
  const handleEditProvider = (provider: ApiProvider) => {
    setCurrentProvider(provider);
    setIsEditOpen(true);
  };
  
  const handleDeleteProvider = (id: string) => {
    if (confirm("Are you sure you want to delete this API provider?")) {
      try {
        apiProviderManager.deleteProvider(id);
        refreshProviders();
      } catch (error) {
        toast({
          title: "Error",
          description: (error as Error).message,
          variant: "destructive"
        });
      }
    }
  };
  
  const handleSaveEdit = () => {
    if (!currentProvider) return;
    
    try {
      apiProviderManager.updateProvider(currentProvider.id, currentProvider);
      setIsEditOpen(false);
      refreshProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };
  
  const handleAddProvider = () => {
    if (!newProvider.name || !newProvider.baseUrl) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and base URL",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const provider: ApiProvider = {
        id: newProvider.name?.toLowerCase().replace(/\s+/g, '-') || Date.now().toString(),
        name: newProvider.name || "New Provider",
        baseUrl: newProvider.baseUrl || "",
        authMethod: newProvider.authMethod as "header" | "query" | "none" || "header",
        apiKeyName: newProvider.apiKeyName,
        requiresAuth: newProvider.requiresAuth || false,
        enabled: newProvider.enabled || true,
        priority: newProvider.priority || 10,
        endpoints: newProvider.endpoints || {},
        defaultHeaders: newProvider.defaultHeaders
      };
      
      apiProviderManager.addProvider(provider);
      setIsAddOpen(false);
      setNewProvider({
        name: "",
        baseUrl: "",
        authMethod: "header",
        requiresAuth: false,
        enabled: true,
        priority: 10,
        endpoints: {}
      });
      refreshProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };
  
  const renderEndpoints = (endpoints: Record<string, string>) => {
    return Object.entries(endpoints).map(([key, value]) => (
      <div key={key} className="flex justify-between text-xs py-1 border-t">
        <span className="font-medium">{key}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
    ));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          API Provider Management
        </CardTitle>
        <CardDescription>
          Configure and manage API providers for cryptocurrency data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {providers.map(provider => (
            <Card key={provider.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{provider.name}</CardTitle>
                  <Switch
                    checked={provider.enabled}
                    onCheckedChange={() => handleToggleProvider(provider.id)}
                    aria-label={`${provider.name} enabled`}
                  />
                </div>
                <CardDescription className="text-xs truncate">
                  {provider.baseUrl}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  {provider.requiresAuth && (
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`api-key-${provider.id}`} className="text-sm">
                        API Key:
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`api-key-${provider.id}`}
                          type="password"
                          placeholder="••••••••"
                          value={provider.apiKey || ""}
                          onChange={(e) => handleUpdateApiKey(provider.id, e.target.value)}
                          className="w-40 h-8 text-xs"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Priority:</span>
                    <span className="text-sm">{provider.priority}</span>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm font-medium mb-1">Endpoints:</div>
                    <div className="bg-muted/40 rounded p-2 text-xs max-h-24 overflow-y-auto">
                      {renderEndpoints(provider.endpoints)}
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="px-6 py-2 bg-muted/20 flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEditProvider(provider)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                {provider.id !== "coingecko" && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteProvider(provider.id)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </Card>
          ))}
          
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit API Provider</DialogTitle>
                <DialogDescription>
                  Update the settings for this API provider
                </DialogDescription>
              </DialogHeader>
              {currentProvider && (
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="edit-name">Name</Label>
                    <Input 
                      id="edit-name"
                      value={currentProvider.name}
                      onChange={(e) => setCurrentProvider({
                        ...currentProvider,
                        name: e.target.value
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-url">Base URL</Label>
                    <Input 
                      id="edit-url"
                      value={currentProvider.baseUrl}
                      onChange={(e) => setCurrentProvider({
                        ...currentProvider,
                        baseUrl: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-priority">Priority (lower = higher priority)</Label>
                    <Input 
                      id="edit-priority"
                      type="number"
                      className="w-20"
                      value={currentProvider.priority}
                      onChange={(e) => setCurrentProvider({
                        ...currentProvider,
                        priority: parseInt(e.target.value) || 10
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-auth-required"
                      checked={currentProvider.requiresAuth}
                      onCheckedChange={(checked) => setCurrentProvider({
                        ...currentProvider,
                        requiresAuth: checked
                      })}
                    />
                    <Label htmlFor="edit-auth-required">Requires Authentication</Label>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" onClick={() => setIsAddOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New API Provider
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add API Provider</DialogTitle>
                <DialogDescription>
                  Add a new API provider for cryptocurrency data
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="add-name">Name</Label>
                  <Input 
                    id="add-name"
                    value={newProvider.name || ''}
                    onChange={(e) => setNewProvider({
                      ...newProvider,
                      name: e.target.value
                    })}
                    placeholder="e.g., Binance API"
                  />
                </div>
                
                <div>
                  <Label htmlFor="add-url">Base URL</Label>
                  <Input 
                    id="add-url"
                    value={newProvider.baseUrl || ''}
                    onChange={(e) => setNewProvider({
                      ...newProvider,
                      baseUrl: e.target.value
                    })}
                    placeholder="e.g., https://api.binance.com"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="add-priority">Priority</Label>
                  <Input 
                    id="add-priority"
                    type="number"
                    className="w-20"
                    value={newProvider.priority || 10}
                    onChange={(e) => setNewProvider({
                      ...newProvider,
                      priority: parseInt(e.target.value) || 10
                    })}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="add-auth-required"
                    checked={newProvider.requiresAuth || false}
                    onCheckedChange={(checked) => setNewProvider({
                      ...newProvider,
                      requiresAuth: checked
                    })}
                  />
                  <Label htmlFor="add-auth-required">Requires Authentication</Label>
                </div>
                
                {newProvider.requiresAuth && (
                  <div>
                    <Label htmlFor="add-key-name">API Key Name</Label>
                    <Input 
                      id="add-key-name"
                      value={newProvider.apiKeyName || ''}
                      onChange={(e) => setNewProvider({
                        ...newProvider,
                        apiKeyName: e.target.value
                      })}
                      placeholder="e.g., X-API-KEY"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProvider}>Add Provider</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              apiProviderManager.resetToDefaults();
              refreshProviders();
            }}
          >
            Reset to Default Providers
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiProviderManagement;
