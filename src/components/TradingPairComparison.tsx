
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRightLeft } from "lucide-react";

const TradingPairComparison: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Trading Pair Comparison
        </CardTitle>
        <CardDescription>Compare different trading pairs side by side</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Trading Pair Comparison content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingPairComparison;
