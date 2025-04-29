
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";

const ApiKeyManager: React.FC = () => {
  const apiKeyData = [
    {
      id: "api-key-1",
      provider: "CoinGecko",
      key: "abcdef123456",
      name: "CoinGecko Pro API Key",
      createdAt: "2025-01-15T10:30:00Z",
      lastUsed: "2025-04-28T14:25:00Z",
      isActive: true,
      isValid: true,
      service: "cryptocurrency-data",
      permissions: ["read"]
    },
    {
      id: "api-key-2",
      provider: "CryptoCompare",
      key: "xyz789abc",
      name: "CryptoCompare Standard Key",
      createdAt: "2025-02-20T08:15:00Z",
      lastUsed: "2025-04-27T09:10:00Z",
      isActive: false,
      isValid: true,
      service: "market-data",
      permissions: ["read"]
    },
    {
      id: "api-key-3",
      provider: "CoinMarketCap",
      key: "temp-disabled-key",
      name: "CMC Enterprise API",
      createdAt: "2025-03-05T11:45:00Z",
      lastUsed: "2025-04-20T16:30:00Z",
      isActive: true,
      isValid: false,
      service: "market-data",
      permissions: ["read", "enterprise"]
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          API Key Management
        </CardTitle>
        <CardDescription>
          Manage your API keys for various crypto data providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apiKeyData.map(key => (
            <div key={key.id} className="border rounded-md p-4">
              <div className="font-semibold">{key.name}</div>
              <div className="text-sm text-muted-foreground">Provider: {key.provider}</div>
              <div className="text-sm text-muted-foreground">Service: {key.service}</div>
              <div className="text-sm text-muted-foreground">Created: {new Date(key.createdAt).toLocaleDateString()}</div>
              <div className="text-sm text-muted-foreground">Last Used: {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}</div>
              
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={key.isActive ? "secondary" : "outline"}>
                  {key.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant={key.isValid ? "secondary" : "destructive"}>
                  {key.isValid ? "Valid" : "Invalid"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManager;
