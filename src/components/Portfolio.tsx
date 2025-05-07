
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

const Portfolio: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Portfolio
        </CardTitle>
        <CardDescription>Overview of your cryptocurrency holdings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Portfolio content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Portfolio;
