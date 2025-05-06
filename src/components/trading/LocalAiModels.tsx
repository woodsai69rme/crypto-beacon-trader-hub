import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocalModel, ModelListProps } from './model-trading/types';
import { Plug, PlugOff } from "lucide-react";

const LocalAiModels: React.FC<ModelListProps> = ({ models, onSelect, onConnect, onDisconnect }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Local AI Models</CardTitle>
        <CardDescription>
          Connect to your locally hosted AI models for trading analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {models.map((model) => (
              <TableRow key={model.id}>
                <TableCell>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm text-muted-foreground">{model.description}</div>
                </TableCell>
                
                <TableCell>
                  <Badge variant="secondary">{model.type}</Badge>
                </TableCell>
                
                <TableCell>
                  {model.isConnected ? (
                    <div className="text-green-500">Connected</div>
                  ) : (
                    <div className="text-red-500">Disconnected</div>
                  )}
                </TableCell>
                
                <TableCell className="text-right">
                  {model.isConnected ? (
                    <Button variant="outline" size="sm" onClick={() => onDisconnect && onDisconnect(model.id)}>
                      <PlugOff className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => onConnect && onConnect(model)}>
                      <Plug className="h-4 w-4 mr-2" />
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
  );
};

export default LocalAiModels;
