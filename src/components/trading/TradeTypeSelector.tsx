
import React from "react";
import { Button } from "@/components/ui/button";

interface TradeSelectorProps {
  tradeType: 'buy' | 'sell';
  onTypeChange: (type: 'buy' | 'sell') => void;
}

const TradeTypeSelector = ({ tradeType, onTypeChange }: TradeSelectorProps) => {
  return (
    <div>
      <label className="text-sm text-muted-foreground block mb-1.5">Trade Type</label>
      <div className="flex gap-2">
        <Button 
          variant={tradeType === 'buy' ? 'default' : 'outline'}
          className={tradeType === 'buy' ? 'flex-1 bg-green-600 hover:bg-green-700' : 'flex-1'}
          onClick={() => onTypeChange('buy')}
        >
          Buy
        </Button>
        <Button 
          variant={tradeType === 'sell' ? 'default' : 'outline'}
          className={tradeType === 'sell' ? 'flex-1 bg-red-600 hover:bg-red-700' : 'flex-1'}
          onClick={() => onTypeChange('sell')}
        >
          Sell
        </Button>
      </div>
    </div>
  );
};

export default TradeTypeSelector;
