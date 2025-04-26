
import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface TradingStatsProps {
  balance: number;
  portfolioValue: number;
  performance: number;
  formatValue: (value: number) => string;
}

const TradingStats = ({ 
  balance, 
  portfolioValue, 
  performance, 
  formatValue 
}: TradingStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-card rounded-lg border p-4">
        <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
        <div className="text-2xl font-bold">{formatValue(balance)}</div>
      </div>
      
      <div className="bg-card rounded-lg border p-4">
        <div className="text-sm text-muted-foreground mb-1">Portfolio Value</div>
        <div className="text-2xl font-bold">{formatValue(portfolioValue)}</div>
      </div>
      
      <div className="bg-card rounded-lg border p-4">
        <div className="text-sm text-muted-foreground mb-1">Performance</div>
        <div className={`text-2xl font-bold flex items-center ${performance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {performance >= 0 ? (
            <ArrowUp className="mr-1 h-5 w-5" />
          ) : (
            <ArrowDown className="mr-1 h-5 w-5" />
          )}
          {Math.abs(performance).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default TradingStats;
