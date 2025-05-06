
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plug, PlugOff, Clock, Server } from "lucide-react";
import { ModelConnectionTabProps } from "./types";

const ModelConnectionTab: React.FC<ModelConnectionTabProps> = ({
  models,
  onConnect,
  onDisconnect,
}) => {
  return (
    <div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <Server className="h-3 w-3 mr-1" />
                      {model.endpoint}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                      {model.type.charAt(0).toUpperCase() + model.type.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${model.isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">{model.isConnected ? 'Connected' : 'Offline'}</span>
                    </div>
                    {model.lastUsed && model.isConnected && (
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Last sync: {new Date(model.lastUsed).toLocaleTimeString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {model.isConnected ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => onDisconnect(model.id)}
                      >
                        <PlugOff className="h-4 w-4" />
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-1"
                        onClick={() => onConnect(model)}
                      >
                        <Plug className="h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Connect to your local MCP (Model Control Protocol) servers to leverage local AI models for trading analysis and predictions, without sending your data to external services.</p>
      </div>
    </div>
  );
};

export default ModelConnectionTab;
