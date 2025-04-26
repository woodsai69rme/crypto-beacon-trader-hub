
import React from "react";
import { Check, AlertCircle } from "lucide-react";

interface ServerStatusProps {
  activeServerId: string | null;
}

const ServerStatus = ({ activeServerId }: ServerStatusProps) => {
  return (
    <div className="border-t flex justify-between pt-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        {activeServerId ? (
          <>
            <Check className="h-3 w-3 text-green-500" />
            <span>Connected to MCP network</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-3 w-3 text-amber-500" />
            <span>No MCP connection</span>
          </>
        )}
      </div>
      <div>
        MCP Protocol v2.1
      </div>
    </div>
  );
};

export default ServerStatus;
