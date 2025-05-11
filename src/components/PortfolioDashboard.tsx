
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const PortfolioDashboard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Portfolio Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <p>Portfolio dashboard content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioDashboard;
