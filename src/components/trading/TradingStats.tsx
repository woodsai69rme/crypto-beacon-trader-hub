
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import PriceDisplay from "./PriceDisplay";

interface TradingStatsProps {
  balance: number;
  portfolioValue: number;
  performance: number;
  formatValue: (value: number) => string;
  currency: 'USD' | 'AUD';
}

const TradingStats = ({ 
  balance, 
  portfolioValue, 
  performance,
  formatValue,
  currency
}: TradingStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <PriceDisplay
        price={balance}
        symbol="Balance"
        currency={currency}
        formatValue={formatValue}
        isCompact
      />
      
      <PriceDisplay
        price={portfolioValue}
        symbol="Portfolio Value"
        currency={currency}
        formatValue={formatValue}
        isCompact
      />
      
      <PriceDisplay
        price={portfolioValue}
        change={performance}
        symbol="Performance"
        currency={currency}
        formatValue={formatValue}
        isCompact
      />
    </div>
  );
};

export default TradingStats;
