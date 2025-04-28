
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApiProvider, ApiEndpoint, ApiParameter } from '@/types/trading';
import { ApiStatusIndicator } from './ApiStatusIndicator';
import { toast } from '@/components/ui/use-toast';

interface ApiProviderSettingsProps {
  provider: ApiProvider;
  onSave: (provider: ApiProvider) => void;
  onTest: (provider: ApiProvider) => Promise<boolean>;
  onDelete: (providerId: string) => void;
}

export const ApiProviderSettings: React.FC<ApiProviderSettingsProps> = ({ 
  provider,
  onSave,
  onTest,
  onDelete
}) => {
  const [editedProvider, setEditedProvider] = useState<ApiProvider>({ ...provider });
  const [activeTab, setActiveTab] = useState('general');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleChange = (field: keyof ApiProvider, value: any) => {
    setEditedProvider(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEndpointChange = (index: number, field: keyof ApiEndpoint, value: any) => {
    if (!editedProvider.endpoints) return;
    
    const updatedEndpoints = [...editedProvider.endpoints];
    updatedEndpoints[index] = {
      ...updatedEndpoints[index],
      [field]: value
    };
    
    setEditedProvider(prev => ({
      ...prev,
      endpoints: updatedEndpoints
    }));
  };

  const handleEndpointParameterChange = (
    endpointIndex: number, 
    paramType: 'params' | 'headers' | 'body',
    paramIndex: number,
    field: keyof ApiParameter,
    value: any
  ) => {
    if (!editedProvider.endpoints) return;
    
    const updatedEndpoints = [...editedProvider.endpoints];
    const params = updatedEndpoints[endpointIndex][paramType];
    
    if (!params) return;
    
    const updatedParams = [...params] as ApiParameter[];
    updatedParams[paramIndex] = {
      ...updatedParams[paramIndex],
      [field]: value
    };
    
    updatedEndpoints[endpointIndex] = {
      ...updatedEndpoints[endpointIndex],
      [paramType]: updatedParams
    };
    
    setEditedProvider(prev => ({
      ...prev,
      endpoints: updatedEndpoints
    }));
  };

  const handleAddEndpoint = () => {
    const newEndpoint: ApiEndpoint = {
      id: `endpoint-${Date.now()}`,
      path: '/new-endpoint',
      method: 'GET',
      description: 'New endpoint',
      requiresAuth: true,
      params: [],
      headers: [],
      body: []
    };
    
    setEditedProvider(prev => ({
      ...prev,
      endpoints: [...(prev.endpoints || []), newEndpoint]
    }));
  };

  const handleAddParameter = (endpointIndex: number, paramType: 'params' | 'headers' | 'body') => {
    if (!editedProvider.endpoints) return;
    
    const updatedEndpoints = [...editedProvider.endpoints];
    const params = updatedEndpoints[endpointIndex][paramType] || [];
    
    const newParam: ApiParameter = {
      name: 'new-param',
      type: 'string',
      required: false,
      description: 'New parameter'
    };
    
    updatedEndpoints[endpointIndex] = {
      ...updatedEndpoints[endpointIndex],
      [paramType]: [...params, newParam]
    };
    
    setEditedProvider(prev => ({
      ...prev,
      endpoints: updatedEndpoints
    }));
  };

  const handleDeleteEndpoint = (index: number) => {
    if (!editedProvider.endpoints) return;
    
    const updatedEndpoints = [...editedProvider.endpoints];
    updatedEndpoints.splice(index, 1);
    
    setEditedProvider(prev => ({
      ...prev,
      endpoints: updatedEndpoints
    }));
  };

  const handleDeleteParameter = (
    endpointIndex: number,
    paramType: 'params' | 'headers' | 'body',
    paramIndex: number
  ) => {
    if (!editedProvider.endpoints) return;
    
    const updatedEndpoints = [...editedProvider.endpoints];
    const params = updatedEndpoints[endpointIndex][paramType];
    
    if (!params) return;
    
    const updatedParams = [...params];
    updatedParams.splice(paramIndex, 1);
    
    updatedEndpoints[endpointIndex] = {
      ...updatedEndpoints[endpointIndex],
      [paramType]: updatedParams
    };
    
    setEditedProvider(prev => ({
      ...prev,
      endpoints: updatedEndpoints
    }));
  };

  const handleSave = () => {
    onSave(editedProvider);
    toast({
      title: 'API Provider Saved',
      description: `${editedProvider.name} settings have been updated.`
    });
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await onTest(editedProvider);
      setTestResult(result);
      
      if (result) {
        toast({
          title: 'Connection Test Successful',
          description: `Successfully connected to ${editedProvider.name} API.`
        });
      } else {
        toast({
          title: 'Connection Test Failed',
          description: `Failed to connect to ${editedProvider.name} API.`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      setTestResult(false);
      toast({
        title: 'Connection Test Error',
        description: `Error testing connection: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDelete = () => {
    if (showConfirmDelete) {
      onDelete(provider.id);
      toast({
        title: 'API Provider Deleted',
        description: `${provider.name} has been removed.`
      });
    } else {
      setShowConfirmDelete(true);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{provider.name}</CardTitle>
            <CardDescription>{provider.description || 'API Provider Configuration'}</CardDescription>
          </div>
          <ApiStatusIndicator enabled={provider.enabled || false} />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="rate-limits">Rate Limits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Provider Name</label>
                <Input
                  value={editedProvider.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Base URL</label>
                <Input
                  value={editedProvider.baseUrl}
                  onChange={(e) => handleChange('baseUrl', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={editedProvider.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">API Version</label>
                <Input
                  value={editedProvider.version || ''}
                  onChange={(e) => handleChange('version', e.target.value)}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={editedProvider.enabled || false}
                  onChange={(e) => handleChange('enabled', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="enabled" className="text-sm">Enable API Provider</label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="authentication">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Authentication Method</label>
                <select
                  value={editedProvider.authMethod || 'none'}
                  onChange={(e) => handleChange('authMethod', e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="none">None</option>
                  <option value="header">Header</option>
                  <option value="query">Query Parameter</option>
                </select>
              </div>
              
              {editedProvider.authMethod && editedProvider.authMethod !== 'none' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">API Key Name</label>
                    <Input
                      value={editedProvider.apiKeyName || ''}
                      onChange={(e) => handleChange('apiKeyName', e.target.value)}
                      placeholder={editedProvider.authMethod === 'header' ? 'X-API-Key' : 'api_key'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">API Key</label>
                    <Input
                      type="password"
                      value={editedProvider.apiKey || ''}
                      onChange={(e) => handleChange('apiKey', e.target.value)}
                      placeholder="Enter your API key"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">API Secret (if required)</label>
                    <Input
                      type="password"
                      value={editedProvider.apiSecret || ''}
                      onChange={(e) => handleChange('apiSecret', e.target.value)}
                      placeholder="Enter your API secret"
                    />
                  </div>
                </>
              )}
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requiresAuth"
                  checked={editedProvider.requiresAuth || false}
                  onChange={(e) => handleChange('requiresAuth', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="requiresAuth" className="text-sm">API Requires Authentication</label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="endpoints">
            <div className="space-y-6">
              {editedProvider.endpoints?.map((endpoint, index) => (
                <div key={endpoint.id} className="border p-4 rounded">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-medium">{endpoint.path}</h3>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteEndpoint(index)}
                    >
                      Delete
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Path</label>
                      <Input
                        value={endpoint.path}
                        onChange={(e) => handleEndpointChange(index, 'path', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Method</label>
                      <select
                        value={endpoint.method}
                        onChange={(e) => handleEndpointChange(index, 'method', e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH')}
                        className="w-full border rounded p-2"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Input
                      value={endpoint.description || ''}
                      onChange={(e) => handleEndpointChange(index, 'description', e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-4">
                      <h4 className="font-medium">Query Parameters</h4>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="ml-auto"
                        onClick={() => handleAddParameter(index, 'params')}
                      >
                        Add Parameter
                      </Button>
                    </div>
                    
                    {endpoint.params?.map((param, paramIndex) => (
                      <div key={`param-${paramIndex}`} className="grid grid-cols-3 gap-2 mb-2">
                        <Input
                          value={param.name}
                          onChange={(e) => handleEndpointParameterChange(index, 'params', paramIndex, 'name', e.target.value)}
                          placeholder="Name"
                        />
                        <select
                          value={param.type}
                          onChange={(e) => handleEndpointParameterChange(index, 'params', paramIndex, 'type', e.target.value as 'string' | 'number' | 'boolean' | 'array' | 'object')}
                          className="border rounded p-2"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="array">Array</option>
                          <option value="object">Object</option>
                        </select>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteParameter(index, 'params', paramIndex)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    
                    {(!endpoint.params || endpoint.params.length === 0) && (
                      <div className="text-sm text-muted-foreground">No parameters defined</div>
                    )}
                  </div>
                </div>
              ))}
              
              <Button onClick={handleAddEndpoint}>Add Endpoint</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="rate-limits">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rate Limit Per Minute</label>
                <Input
                  type="number"
                  value={editedProvider.rateLimitPerMinute?.toString() || ''}
                  onChange={(e) => handleChange('rateLimitPerMinute', parseInt(e.target.value || '0'))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Rate Limit Per Day</label>
                <Input
                  type="number"
                  value={editedProvider.rateLimitPerDay?.toString() || ''}
                  onChange={(e) => handleChange('rateLimitPerDay', parseInt(e.target.value || '0'))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Rate Limit Per Month</label>
                <Input
                  type="number"
                  value={editedProvider.rateLimitPerMonth?.toString() || ''}
                  onChange={(e) => handleChange('rateLimitPerMonth', parseInt(e.target.value || '0'))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <Input
                  type="number"
                  value={editedProvider.priority?.toString() || ''}
                  onChange={(e) => handleChange('priority', parseInt(e.target.value || '0'))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Higher priority providers will be used first when multiple providers offer the same endpoint
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="outline" onClick={handleTest} disabled={isTesting}>
            {isTesting ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button 
            variant={showConfirmDelete ? "destructive" : "outline"} 
            onClick={handleDelete}
            className="ml-auto"
          >
            {showConfirmDelete ? 'Confirm Delete' : 'Delete Provider'}
          </Button>
        </div>
        
        {testResult !== null && (
          <div className={`mt-4 p-2 rounded ${testResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {testResult 
              ? `Successfully connected to ${editedProvider.name} API` 
              : `Failed to connect to ${editedProvider.name} API`
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiProviderSettings;
