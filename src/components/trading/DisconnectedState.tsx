
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const DisconnectedState: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Connected</AlertTitle>
          <AlertDescription>
            Please connect to an MCP server to use the trading features.
          </AlertDescription>
        </Alert>
        
        <div className="mt-4 text-sm">
          <p>MCP servers enable:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Training AI models on your local machine</li>
            <li>Private inference without sending data to external services</li>
            <li>Custom trading strategy generation</li>
            <li>Real-time market predictions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisconnectedState;
