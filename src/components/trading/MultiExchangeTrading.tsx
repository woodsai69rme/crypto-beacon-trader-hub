
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";

const MultiExchangeTrading: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Multi-Exchange Trading
        </CardTitle>
        <CardDescription>Trade across multiple exchanges from a single interface</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Multi-Exchange Trading content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiExchangeTrading;
