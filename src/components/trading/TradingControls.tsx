
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, StopCircle, Bot } from "lucide-react";

interface TradingControlsProps {
  isTradingActive: boolean;
  toggleTrading: () => void;
  activeServerId: string;
}

const TradingControls: React.FC<TradingControlsProps> = ({ 
  isTradingActive, 
  toggleTrading,
  activeServerId
}) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Trading Controls</h3>
          <Badge variant={isTradingActive ? "default" : "outline"}>
            {isTradingActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        
        <Button 
          onClick={toggleTrading}
          variant={isTradingActive ? "destructive" : "default"}
          className="w-full"
        >
          {isTradingActive ? (
            <>
              <StopCircle className="h-4 w-4 mr-2" />
              Stop Trading
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start Trading
            </>
          )}
        </Button>
        
        {isTradingActive && (
          <div className="p-3 border rounded-md bg-muted">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <div className="text-sm font-medium">Trading active on server {activeServerId}</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              The AI model is actively monitoring market conditions and executing trades based on your strategy
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingControls;
