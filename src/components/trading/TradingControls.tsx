
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface TradingControlsProps {
  isTradingActive: boolean;
  toggleTrading: () => void;
  activeServerId: string | null;
}

const TradingControls = ({ isTradingActive, toggleTrading, activeServerId }: TradingControlsProps) => {
  const handleToggleTrading = () => {
    if (!activeServerId) {
      toast({
        title: "No Server Connected",
        description: "Please connect to an MCP server before activating trading",
        variant: "destructive",
      });
      return;
    }
    toggleTrading();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Trading Status</span>
            <span className={`text-sm ${isTradingActive ? 'text-green-500' : 'text-amber-500'}`}>
              {isTradingActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <Button 
            onClick={handleToggleTrading}
            className="w-full"
            variant={isTradingActive ? "destructive" : "default"}
          >
            {isTradingActive ? 'Stop Trading' : 'Start Trading'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingControls;
