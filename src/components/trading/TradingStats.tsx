
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-6">
      <div className="p-4 border rounded-md">
        <p className="text-sm text-muted-foreground mb-1">Cash Balance</p>
        <p className="text-xl font-medium">{formatValue(balance)}</p>
      </div>
      <div className="p-4 border rounded-md">
        <p className="text-sm text-muted-foreground mb-1">Portfolio Value</p>
        <p className="text-xl font-medium">{formatValue(portfolioValue)}</p>
      </div>
      <div className="p-4 border rounded-md">
        <p className="text-sm text-muted-foreground mb-1">Performance</p>
        <div className={`text-xl font-medium flex items-center ${performance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {performance >= 0 ? (
            <ArrowUp className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 mr-1" />
          )}
          {Math.abs(performance).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default TradingStats;
