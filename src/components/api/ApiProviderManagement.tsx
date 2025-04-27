
import React, { useState } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { apiProviderManager, defaultApiProviders } from "@/services/api/apiProviderConfig";
import type { ApiProvider } from "@/types/trading";
import { Settings, Pencil, Trash, Plus, Unlock, Lock } from "lucide-react";

const ApiProviderManagement: React.FC = () => {
  const [providers, setProviders] = useState<ApiProvider[]>(apiProviderManager.getAllProviders);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<ApiProvider | null>(null);
  
  const [newProvider, setNewProvider] = useState<Partial<ApiProvider>>({
    id: '',
    name: '',
    baseUrl: '',
    authMethod: 'header',
    requiresAuth: true,
    endpoints: {},
    enabled: true,
    priority: 10
  });
  
  const refreshProviders = () => {
    setProviders(apiProviderManager.getAllProviders());
  };
  
  const handleToggleProvider = (id: string) => {
    apiProviderManager.toggleProviderEnabled(id);
    refreshProviders();
  };
  
  const handleEditProvider = (provider: ApiProvider) => {
    setCurrentProvider(provider);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateProvider = () => {
    if (!currentProvider) return;
    
    try {
      apiProviderManager.updateProvider(currentProvider.id, currentProvider);
      setIsEditDialogOpen(false);
      refreshProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteProvider = (id: string) => {
    if (confirm('Are you sure you want to delete this API provider?')) {
      apiProviderManager.removeProvider(id);
      refreshProviders();
    }
  };
  
  const handleAddProvider = () => {
    try {
      if (!newProvider.id || !newProvider.name || !newProvider.baseUrl) {
        throw new Error('ID, name and base URL are required');
      }
      
      apiProviderManager.addProvider(newProvider as ApiProvider);
      setIsAddDialogOpen(false);
      setNewProvider({
        id: '',
        name: '',
        baseUrl: '',
        authMethod: 'header',
        requiresAuth: true,
        endpoints: {},
        enabled: true,
        priority: 10
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
  
  const isDefaultProvider = (id: string) => {
    return defaultApiProviders.some(p => p.id === id);
  };
  
  const handleSaveApiKey = (id: string, apiKey: string) => {
    try {
      apiProviderManager.setProviderApiKey(id, apiKey);
      refreshProviders();
      
      toast({
        title: "API Key Saved",
        description: "Your API key has been saved securely.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            API Provider Management
          </CardTitle>
          <CardDescription>
            Configure and manage your cryptocurrency data API providers
          </CardDescription>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Authentication</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-xs text-muted-foreground">{provider.baseUrl}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={provider.enabled}
                    onCheckedChange={() => handleToggleProvider(provider.id)}
                    aria-label={`${provider.name} enabled`}
                  />
                </TableCell>
                <TableCell>
                  {provider.requiresAuth ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {provider.apiKey ? (
                            <Lock className="h-4 w-4 mr-2" />
                          ) : (
                            <Unlock className="h-4 w-4 mr-2" />
                          )}
                          {provider.apiKey ? "API Key Set" : "Set API Key"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>API Key for {provider.name}</DialogTitle>
                          <DialogDescription>
                            Enter your API key to authenticate with {provider.name}. This will be stored locally in your browser.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor={`apiKey-${provider.id}`}>API Key</Label>
                            <Input
                              id={`apiKey-${provider.id}`}
                              type="password"
                              placeholder="Enter your API key"
                              defaultValue={provider.apiKey || ""}
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button
                            onClick={() => {
                              const input = document.getElementById(`apiKey-${provider.id}`) as HTMLInputElement;
                              handleSaveApiKey(provider.id, input.value);
                            }}
                          >
                            Save API Key
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <span className="text-muted-foreground text-sm">Not required</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditProvider(provider)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isDefaultProvider(provider.id)}
                      onClick={() => handleDeleteProvider(provider.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      
      {/* Add Provider Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New API Provider</DialogTitle>
            <DialogDescription>
              Add details for a new cryptocurrency data API provider.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider-id" className="text-right">ID</Label>
              <Input
                id="provider-id"
                value={newProvider.id}
                onChange={(e) => setNewProvider({ ...newProvider, id: e.target.value })}
                className="col-span-3"
                placeholder="unique-provider-id"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider-name" className="text-right">Name</Label>
              <Input
                id="provider-name"
                value={newProvider.name}
                onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                className="col-span-3"
                placeholder="Provider Name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider-url" className="text-right">Base URL</Label>
              <Input
                id="provider-url"
                value={newProvider.baseUrl}
                onChange={(e) => setNewProvider({ ...newProvider, baseUrl: e.target.value })}
                className="col-span-3"
                placeholder="https://api.example.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Requires Auth</Label>
              <div className="col-span-3">
                <Switch
                  checked={newProvider.requiresAuth}
                  onCheckedChange={(checked) => setNewProvider({ ...newProvider, requiresAuth: checked })}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProvider}>Add Provider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Provider Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit API Provider</DialogTitle>
            <DialogDescription>
              Update the details for this API provider.
            </DialogDescription>
          </DialogHeader>
          
          {currentProvider && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-provider-name" className="text-right">Name</Label>
                <Input
                  id="edit-provider-name"
                  value={currentProvider.name}
                  onChange={(e) => setCurrentProvider({ ...currentProvider, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-provider-url" className="text-right">Base URL</Label>
                <Input
                  id="edit-provider-url"
                  value={currentProvider.baseUrl}
                  onChange={(e) => setCurrentProvider({ ...currentProvider, baseUrl: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-provider-priority" className="text-right">Priority</Label>
                <Input
                  id="edit-provider-priority"
                  type="number"
                  value={currentProvider.priority}
                  onChange={(e) => setCurrentProvider({ 
                    ...currentProvider, 
                    priority: parseInt(e.target.value) || 10 
                  })}
                  className="col-span-3"
                />
                <div className="col-span-3 col-start-2 text-xs text-muted-foreground">
                  Lower number = higher priority when choosing a provider
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProvider}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ApiProviderManagement;
