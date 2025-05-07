
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plug, PowerOff, Plus } from "lucide-react";

export interface McpServerConfig {
  id: string;
  name: string;
  endpoint: string;
  status: 'online' | 'offline' | 'connecting';
  type: 'prediction' | 'inference';
  lastSync?: string;
}

interface McpServerListProps {
  servers: McpServerConfig[];
  onConnectServer: (serverId: string) => void;
  onDisconnectServer: (serverId: string) => void;
  onAddServer: () => void;
}

const McpServerList: React.FC<McpServerListProps> = ({ 
  servers, 
  onConnectServer, 
  onDisconnectServer,
  onAddServer 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">MCP Servers</h3>
        <Button variant="outline" size="sm" onClick={onAddServer}>
          <Plus className="h-4 w-4 mr-2" />
          Add Server
        </Button>
      </div>
      
      <div className="space-y-2">
        {servers.length === 0 ? (
          <div className="text-center p-6 border rounded-md">
            <p className="text-muted-foreground">No MCP servers configured</p>
            <Button className="mt-4" onClick={onAddServer}>Add Your First Server</Button>
          </div>
        ) : (
          servers.map((server) => (
            <Card key={server.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        server.status === 'online' ? 'bg-green-500' : 
                        server.status === 'connecting' ? 'bg-yellow-500' : 'bg-gray-300'
                      }`}></div>
                      <div className="font-medium">{server.name}</div>
                      <Badge variant="outline">{server.type}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {server.endpoint}
                    </div>
                    {server.lastSync && server.status === 'online' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Last synced: {new Date(server.lastSync).toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    {server.status === 'online' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onDisconnectServer(server.id)}
                      >
                        <PowerOff className="h-4 w-4 mr-2" />
                        Disconnect
                      </Button>
                    ) : server.status === 'connecting' ? (
                      <Button variant="outline" size="sm" disabled>
                        <div className="h-4 w-4 mr-2 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
                        Connecting...
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => onConnectServer(server.id)}
                      >
                        <Plug className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default McpServerList;
