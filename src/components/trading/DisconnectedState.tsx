
import React from "react";
import { AlertCircle } from "lucide-react";

const DisconnectedState = () => {
  return (
    <div className="text-center py-8 space-y-2">
      <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
      <div className="font-medium text-lg">No MCP Server Connected</div>
      <div className="text-muted-foreground max-w-md mx-auto">
        Please connect to an MCP server to start using AI trading features. Make sure your network connection is stable.
      </div>
    </div>
  );
};

export default DisconnectedState;
