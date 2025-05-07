
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Key } from "lucide-react";

const ApiManagementDashboard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Management
        </CardTitle>
        <CardDescription>Manage your API keys and connections</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>API Management dashboard content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiManagementDashboard;
