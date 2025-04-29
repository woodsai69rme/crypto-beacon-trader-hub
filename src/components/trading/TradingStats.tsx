
import React from "react";
import { SupportedCurrency } from "@/types/trading";

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
  return (
    <div className="grid grid-cols-3 gap-4 my-6">
      <div className="bg-muted p-4 rounded-lg">
        <div className="text-sm text-muted-foreground">Available Balance</div>
        <div className="text-2xl font-semibold mt-1">{formatValue(balance)}</div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <div className="text-sm text-muted-foreground">Portfolio Value</div>
        <div className="text-2xl font-semibold mt-1">{formatValue(portfolioValue)}</div>
      </div>
      
      <div className={`p-4 rounded-lg ${performance >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
        <div className="text-sm text-muted-foreground">Performance</div>
        <div className={`text-2xl font-semibold mt-1 ${performance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {performance >= 0 ? '+' : ''}{performance.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default TradingStats;
