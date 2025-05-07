
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart } from "lucide-react";

interface EnhancedCryptoChartProps {
  coin: string;
  coinId: string;
  color: string;
}

const EnhancedCryptoChart: React.FC<EnhancedCryptoChartProps> = ({ coin, coinId, color }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          {coin} Chart
        </CardTitle>
        <CardDescription>Price chart with technical indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Price chart for {coinId} will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCryptoChart;
