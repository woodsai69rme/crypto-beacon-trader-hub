
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";

const ExchangeIntegration: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Exchange Integration
        </CardTitle>
        <CardDescription>Connect and trade across multiple exchanges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Exchange Integration content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExchangeIntegration;
