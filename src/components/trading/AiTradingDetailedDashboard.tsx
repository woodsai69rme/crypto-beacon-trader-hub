
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import AdvancedAiTradingDashboard from './AdvancedAiTradingDashboard';

const AiTradingDetailedDashboard: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Advanced AI Trading Dashboard</CardTitle>
        <CardDescription>
          Comprehensive AI-powered trading platform with real-time monitoring, analytics and automated execution
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="h-[800px]">
          <AdvancedAiTradingDashboard />
        </div>
      </CardContent>
    </Card>
  );
};

export default AiTradingDetailedDashboard;
