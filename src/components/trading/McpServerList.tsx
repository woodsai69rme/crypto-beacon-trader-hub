
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server } from "lucide-react";

export interface McpServerConfig {
  id: string;
  name: string;
  endpoint: string;
  status: "online" | "offline" | "connecting";
  type: "prediction" | "inference" | "optimization";
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
    <div>
      <h3 className="font-medium mb-3">MCP Server Network</h3>
      <div className="space-y-3">
        {servers.map(server => (
          <div key={server.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{server.name}</span>
                <Badge 
                  variant={
                    server.status === "online" ? "default" : 
                    server.status === "connecting" ? "outline" : "secondary"
                  }
                  className={
                    server.status === "online" ? "bg-green-500" :
                    server.status === "connecting" ? "border-amber-500 text-amber-500" : ""
                  }
                >
                  {server.status}
                </Badge>
              </div>
              
              {server.status === "offline" ? (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onConnectServer(server.id)}
                >
                  Connect
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onDisconnectServer(server.id)}
                >
                  Disconnect
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 text-sm text-muted-foreground">
              <div>Endpoint: {server.endpoint}</div>
              <div>Type: {server.type}</div>
              {server.lastSync && (
                <div className="col-span-2 mt-1">
                  Last sync: {new Date(server.lastSync).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
        
        <Button variant="outline" onClick={onAddServer} className="w-full">
          Add MCP Server
        </Button>
      </div>
    </div>
  );
};

export default McpServerList;
