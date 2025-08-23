
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const MarketOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Market Overview
        </CardTitle>
        <CardDescription>Real-time cryptocurrency market data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Market overview content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
