
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

const PortfolioAnalytics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          Portfolio Analytics
        </CardTitle>
        <CardDescription>Detailed analysis of your portfolio performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Portfolio Analytics content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioAnalytics;
