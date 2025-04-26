
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

interface TradingActivityPanelProps {
  isTradingActive: boolean;
  toggleTrading: () => void;
}

const TradingActivityPanel: React.FC<TradingActivityPanelProps> = ({
  isTradingActive,
  toggleTrading
}) => {
  return (
    <>
      <div className="mt-4 p-4 border border-dashed rounded flex items-center justify-between">
        <div>
          <div className="font-medium">Automated Trading</div>
          <div className="text-sm text-muted-foreground">
            Let AI execute trades based on market signals
          </div>
        </div>
        <Switch 
          checked={isTradingActive} 
          onCheckedChange={toggleTrading}
          className={isTradingActive ? "bg-green-500" : ""}
        />
      </div>
      
      {isTradingActive && (
        <div className="border rounded-lg p-4 bg-muted/30 mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Live Trading Activity</h3>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm p-2 bg-background rounded">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                <span>BTC/USD</span>
              </div>
              <div className="text-green-500">Buy @ $61,245.32</div>
            </div>
            <div className="flex justify-between text-sm p-2 bg-background rounded">
              <div className="flex items-center">
                <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                <span>ETH/USD</span>
              </div>
              <div className="text-red-500">Sell @ $3,010.45</div>
            </div>
            <div className="text-xs text-muted-foreground text-center mt-3">
              Last signal: 2 minutes ago
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TradingActivityPanel;
