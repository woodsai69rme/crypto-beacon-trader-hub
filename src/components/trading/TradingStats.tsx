
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export type SupportedCurrency = 'USD' | 'AUD' | 'EUR' | 'GBP';

interface TradingStatsProps {
  balance: number;
  portfolioValue: number;
  performance: number;
  formatValue: (value: number) => string;
  currency: SupportedCurrency;
}

const TradingStats: React.FC<TradingStatsProps> = ({ 
  balance, 
  portfolioValue, 
  performance,
  formatValue,
  currency
}) => {
  // Performance is positive when > 0, negative when < 0
  const isPositive = performance >= 0;
  
  return (
    <div className="grid grid-cols-3 gap-4 mb-6 mt-4">
      <div className="bg-muted/60 p-4 rounded-lg">
        <div className="text-sm text-muted-foreground mb-1">Balance</div>
        <div className="text-lg font-medium">{formatValue(balance)}</div>
      </div>
      
      <div className="bg-muted/60 p-4 rounded-lg">
        <div className="text-sm text-muted-foreground mb-1">Portfolio Value</div>
        <div className="text-lg font-medium">{formatValue(portfolioValue)}</div>
      </div>
      
      <div className={`p-4 rounded-lg ${isPositive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
        <div className="text-sm text-muted-foreground mb-1">Performance</div>
        <div className={`text-lg font-medium flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? (
            <ArrowUp className="mr-1 h-4 w-4" />
          ) : (
            <ArrowDown className="mr-1 h-4 w-4" />
          )}
          {performance.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default TradingStats;
