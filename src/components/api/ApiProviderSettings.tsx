
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import ApiStatusIndicator from "./ApiStatusIndicator";
import { Settings, RefreshCw, ExternalLink } from "lucide-react";
import { apiProviderManager } from "@/services/api/apiProviderConfig";

const ApiProviderSettings = () => {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState({
    name: "CoinGecko API",
    status: "operational" as const,
    requestsRemaining: 45,
    requestLimit: 50,
    resetTime: "60 minutes",
    isEnabled: true
  });

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive"
      });
      return;
    }

    // Simulate saving the API key
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved successfully."
    });

    // In a real app, you would store this in secure storage and
    // update the apiProviderManager configuration
  };

  const handleToggleProvider = () => {
    const newStatus = !provider.isEnabled;
    
    setProvider({
      ...provider,
      isEnabled: newStatus
    });

    toast({
      title: `API ${newStatus ? "Enabled" : "Disabled"}`,
      description: `CoinGecko API has been ${newStatus ? "enabled" : "disabled"}.`
    });

    // In a real app, you would update the apiProviderManager configuration
  };

  const handleRefreshStatus = () => {
    toast({
      title: "Status Refreshed",
      description: "API status has been refreshed."
    });

    // In a real app, you would fetch the latest status from the provider
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            API Provider Settings
          </CardTitle>
          <ApiStatusIndicator status={provider.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-base">{provider.name}</h3>
            <p className="text-sm text-muted-foreground">
              Usage: {provider.requestsRemaining}/{provider.requestLimit} requests (Resets in {provider.resetTime})
            </p>
          </div>
          <Switch 
            checked={provider.isEnabled}
            onCheckedChange={handleToggleProvider}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="flex gap-2">
            <Input 
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your CoinGecko API key"
              className="flex-1"
            />
            <Button onClick={handleSaveApiKey}>Save</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Optional. Enter your API key to increase rate limits.
          </p>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={handleRefreshStatus}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
            
            <Button variant="ghost" size="sm" asChild>
              <a 
                href="https://www.coingecko.com/api/documentation" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                API Documentation
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiProviderSettings;
