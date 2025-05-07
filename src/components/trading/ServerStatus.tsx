
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Server } from "lucide-react";

interface ServerStatusProps {
  activeServerId: string | null;
}

const ServerStatus: React.FC<ServerStatusProps> = ({ activeServerId }) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Server className="h-4 w-4" />
      <span>Server Status:</span>
      {activeServerId ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          Connected
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
          Disconnected
        </Badge>
      )}
    </div>
  );
};

export default ServerStatus;
