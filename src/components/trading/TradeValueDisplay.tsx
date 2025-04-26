
import React from "react";

interface TradeValueDisplayProps {
  label: string;
  value: string;
}

const TradeValueDisplay = ({ label, value }: TradeValueDisplayProps) => {
  return (
    <div>
      <label className="text-sm text-muted-foreground block mb-1.5">{label}</label>
      <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground flex items-center font-medium">
        {value}
      </div>
    </div>
  );
};

export default TradeValueDisplay;
