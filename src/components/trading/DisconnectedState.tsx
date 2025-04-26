
import React from "react";
import { AlertCircle } from "lucide-react";

const DisconnectedState = () => {
  return (
    <div className="text-center py-8">
      <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
      <div className="font-medium text-lg mb-1">No MCP Server Connected</div>
      <div className="text-muted-foreground mb-4">
        Please connect to an MCP server to start using AI trading features
      </div>
    </div>
  );
};

export default DisconnectedState;
