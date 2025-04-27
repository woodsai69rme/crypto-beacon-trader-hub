
import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

export type SupportedCurrency = 'USD' | 'AUD' | 'EUR' | 'GBP';

interface TradingStatsProps {
  balance: number;
  portfolioValue: number;
  performance: number;
  currency: SupportedCurrency;
  formatValue: (value: number) => string;
}

const TradingStats: React.FC<TradingStatsProps> = ({
  balance,
  portfolioValue,
  performance,
  formatValue,
  currency
}) => {
  const isPositivePerformance = performance > 0;
  const perfAbsolute = Math.abs(performance);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      <Card className="p-4 flex flex-col">
        <span className="text-sm text-muted-foreground mb-1">Account Balance</span>
        <span className="text-2xl font-bold">{formatValue(balance)}</span>
      </Card>
      
      <Card className="p-4 flex flex-col">
        <span className="text-sm text-muted-foreground mb-1">Portfolio Value</span>
        <span className="text-2xl font-bold">{formatValue(portfolioValue)}</span>
      </Card>
      
      <Card className="p-4 flex flex-col">
        <span className="text-sm text-muted-foreground mb-1">Performance</span>
        <div className="flex items-center">
          {isPositivePerformance ? (
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span 
            className={`text-2xl font-bold ${
              isPositivePerformance ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {perfAbsolute.toFixed(2)}%
          </span>
        </div>
      </Card>
    </div>
  );
};

export default TradingStats;
