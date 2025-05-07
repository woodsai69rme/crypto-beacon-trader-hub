
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

const PortfolioOptimizer: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          Portfolio Optimizer
        </CardTitle>
        <CardDescription>Optimize your portfolio for risk and return</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Portfolio Optimizer content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioOptimizer;
