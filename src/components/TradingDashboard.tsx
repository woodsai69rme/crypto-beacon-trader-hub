
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";
import RealTimeTrading from './trading/RealTimeTrading';

const TradingDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <RealTimeTrading />
    </div>
  );
};

export default TradingDashboard;
