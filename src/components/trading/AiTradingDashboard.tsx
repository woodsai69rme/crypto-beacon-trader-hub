
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Bot } from 'lucide-react';
import AdvancedAiTradingDashboard from './AdvancedAiTradingDashboard';
import DetachedAiTradingDashboard from './DetachedAiTradingDashboard';

const AiTradingDashboard: React.FC = () => {
  const [isDetached, setIsDetached] = useState<boolean>(false);

  const toggleDetachedMode = () => {
    setIsDetached(!isDetached);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Trading Dashboard
              </CardTitle>
              <CardDescription>
                Advanced AI-powered trading analysis and execution
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={toggleDetachedMode} className="h-8 w-8">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <AdvancedAiTradingDashboard />
        </CardContent>
      </Card>

      <DetachedAiTradingDashboard 
        title="AI Trading Dashboard"
        isDetached={isDetached}
        onDetach={toggleDetachedMode}
      >
        <AdvancedAiTradingDashboard />
      </DetachedAiTradingDashboard>
    </>
  );
};

export default AiTradingDashboard;
