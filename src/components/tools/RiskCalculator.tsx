
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

const RiskCalculator: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Risk Calculator
        </CardTitle>
        <CardDescription>Calculate position sizes and risk metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Risk Calculator content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskCalculator;
