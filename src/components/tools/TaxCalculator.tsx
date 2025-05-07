
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

const TaxCalculator: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Tax Calculator
        </CardTitle>
        <CardDescription>Calculate capital gains tax on your trades</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Tax Calculator content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;
