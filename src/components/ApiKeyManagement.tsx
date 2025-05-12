
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Key } from "lucide-react";

const ApiKeyManagement: React.FC = () => {
  return (
    <div className="space-y-4">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Key Management
        </CardTitle>
        <CardDescription>Manage your exchange API keys and connections</CardDescription>
      </CardHeader>
      
      <CardContent className="px-0">
        <div className="text-center py-12">
          <p>API Key Management content will appear here</p>
        </div>
      </CardContent>
    </div>
  );
};

export default ApiKeyManagement;
