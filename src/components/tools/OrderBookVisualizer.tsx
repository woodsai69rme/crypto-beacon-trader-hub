
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart } from "lucide-react";

const OrderBookVisualizer: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Order Book Visualizer
        </CardTitle>
        <CardDescription>Visualize market depth and liquidity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Order Book Visualizer content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBookVisualizer;
