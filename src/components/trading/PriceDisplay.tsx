
import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface PriceDisplayProps {
  price: number;
  change?: number;
  symbol: string;
  isCompact?: boolean;
  currency: 'USD' | 'AUD';
  formatValue: (value: number) => string;
}

const PriceDisplay = ({
  price,
  change,
  symbol,
  isCompact = false,
  currency,
  formatValue
}: PriceDisplayProps) => {
  const isPositive = (change ?? 0) >= 0;

  return (
    <Card className={`p-4 ${isCompact ? 'py-2' : ''}`}>
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{symbol}</p>
          <p className="text-2xl font-bold">{formatValue(price)}</p>
        </div>
        {change !== undefined && (
          <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            <span>{Math.abs(change).toFixed(2)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PriceDisplay;
