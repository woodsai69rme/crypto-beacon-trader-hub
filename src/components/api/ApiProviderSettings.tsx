
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ApiStatusIndicator from "./ApiStatusIndicator";
import { toast } from "@/components/ui/use-toast";
import { ApiEndpoint } from "@/types/trading";

interface ApiProviderSettingsProps {
  id: string;
  name: string;
  description: string;
  status: "operational" | "degraded" | "down";
  apiEndpoints: ApiEndpoint[];
  credentials: {
    apiKey?: string;
    username?: string;
    password?: string;
  };
  onSave: (id: string, settings: any) => void;
}

const ApiProviderSettings: React.FC<ApiProviderSettingsProps> = ({
  id,
  name,
  description,
  status,
  apiEndpoints,
  credentials,
  onSave
}) => {
  const [apiKey, setApiKey] = useState(credentials.apiKey || "");
  const [username, setUsername] = useState(credentials.username || "");
  const [password, setPassword] = useState(credentials.password || "");
  const [enableRateLimiting, setEnableRateLimiting] = useState(true);
  const [enableCaching, setEnableCaching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(id, {
      apiKey,
      username,
      password,
      settings: {
        enableRateLimiting,
        enableCaching
      }
    });
    
    toast({
      title: "Settings Saved",
      description: `Configuration for ${name} has been updated.`
    });
    
    setIsSaving(false);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <ApiStatusIndicator status={status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* API Credentials */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">API Credentials</h3>
          
          <div className="space-y-2">
            <Label htmlFor={`${id}-api-key`}>API Key</Label>
            <Input
              id={`${id}-api-key`}
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key"
            />
          </div>
          
          {(credentials.username !== undefined || credentials.password !== undefined) && (
            <>
              <div className="space-y-2">
                <Label htmlFor={`${id}-username`}>Username</Label>
                <Input
                  id={`${id}-username`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`${id}-password`}>Password</Label>
                <Input
                  id={`${id}-password`}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
            </>
          )}
        </div>
        
        {/* API Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">API Settings</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor={`${id}-rate-limiting`}>Rate Limiting</Label>
              <p className="text-sm text-muted-foreground">
                Limit API requests to prevent hitting rate limits
              </p>
            </div>
            <Switch
              id={`${id}-rate-limiting`}
              checked={enableRateLimiting}
              onCheckedChange={setEnableRateLimiting}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor={`${id}-caching`}>Response Caching</Label>
              <p className="text-sm text-muted-foreground">
                Cache API responses to reduce requests and improve performance
              </p>
            </div>
            <Switch
              id={`${id}-caching`}
              checked={enableCaching}
              onCheckedChange={setEnableCaching}
            />
          </div>
        </div>
        
        {/* Available Endpoints */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available Endpoints</h3>
          
          <div className="overflow-auto max-h-60 rounded-md border">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Path
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Rate Limit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {apiEndpoints.map((endpoint, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <code className="bg-muted/30 px-1 py-0.5 rounded text-xs">
                        {endpoint.path}
                      </code>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span className={`
                        px-2 py-0.5 rounded text-xs font-medium
                        ${endpoint.method === 'GET' ? 'bg-green-500/20 text-green-500' : ''}
                        ${endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-500' : ''}
                        ${endpoint.method === 'PUT' ? 'bg-amber-500/20 text-amber-500' : ''}
                        ${endpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-500' : ''}
                      `}>
                        {endpoint.method}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {endpoint.description}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {endpoint.rateLimit || 'N/A'}
                    </td>
                  </tr>
                ))}
                {apiEndpoints.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-sm text-muted-foreground">
                      No endpoints available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset</Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiProviderSettings;
