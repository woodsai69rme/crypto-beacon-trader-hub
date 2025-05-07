
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeftRight } from "lucide-react";

const CoinComparison: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5" />
          Coin Comparison
        </CardTitle>
        <CardDescription>Compare performance of different cryptocurrencies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Coin comparison content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinComparison;
