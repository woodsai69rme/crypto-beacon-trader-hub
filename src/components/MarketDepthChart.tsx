
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

interface MarketDepthChartProps {
  coinId: string;
  symbol: string;
}

const MarketDepthChart: React.FC<MarketDepthChartProps> = ({ coinId, symbol }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          Market Depth for {symbol}
        </CardTitle>
        <CardDescription>Visualizing buy and sell orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Market Depth chart for {coinId} will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketDepthChart;
