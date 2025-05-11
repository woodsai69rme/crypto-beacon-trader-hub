import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Power, PowerOff } from "lucide-react";
import { LocalModel, ModelListProps } from '@/types/trading';

const ModelList: React.FC<ModelListProps> = ({
  models,
  onSelect,
  onConnect,
  onDisconnect
}) => {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id}>
              <TableCell className="font-medium">{model.name}</TableCell>
              <TableCell>{model.type}</TableCell>
              <TableCell>{model.endpoint}</TableCell>
              <TableCell>
                {model.isConnected ? (
                  <Badge variant="outline">
                    <Power className="h-4 w-4 mr-2" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <PowerOff className="h-4 w-4 mr-2" />
                    Disconnected
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="secondary" size="sm" onClick={() => onSelect?.(model)}>
                  View
                </Button>
                {!model.isConnected ? (
                  <Button variant="ghost" size="sm" onClick={() => onConnect?.(model)}>
                    <Zap className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => onDisconnect?.(model.id)}>
                    <PowerOff className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          
          {models.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No models found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ModelList;
