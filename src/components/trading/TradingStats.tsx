
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CoinOption, SupportedCurrency } from '@/types/trading';
import { ChartBarIcon } from 'lucide-react';

interface TradingStatsProps {
  balance: number;
  portfolioValue: number;
  holdings?: { [key: string]: number };
  coins?: CoinOption[];
  performance?: number;
  formatValue?: (value: number) => string;
  currency?: SupportedCurrency;
}

const TradingStats: React.FC<TradingStatsProps> = ({ 
  balance, 
  portfolioValue,
  holdings = {},
  coins = [],
  performance,
  formatValue,
  currency = "USD"
}) => {
  const formatCurrency = formatValue || ((value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
  
  // Calculate total holding value (excluding balance)
  const holdingsValue = Object.entries(holdings).reduce((total, [coinId, amount]) => {
    const coin = coins.find(c => c.id === coinId);
    return total + (coin ? coin.price * amount : 0);
  }, 0);
  
  // Calculate performance if not provided
  const calculatedPerformance = performance !== undefined 
    ? performance 
    : portfolioValue > 10000 
      ? (portfolioValue / 10000 - 1) * 100 
      : (portfolioValue / 10000 - 1) * 100;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ChartBarIcon className="h-4 w-4" />
          Portfolio Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Total Value</div>
          <div className="text-2xl font-bold">{formatCurrency(portfolioValue)}</div>
          <div className={`text-sm ${calculatedPerformance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {calculatedPerformance >= 0 ? '▲' : '▼'} {Math.abs(calculatedPerformance).toFixed(2)}%
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/50 rounded-md">
            <div className="text-sm text-muted-foreground">Cash Balance</div>
            <div className="font-medium">{formatCurrency(balance)}</div>
            <div className="text-xs text-muted-foreground">
              {((balance / portfolioValue) * 100).toFixed(1)}% of portfolio
            </div>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-md">
            <div className="text-sm text-muted-foreground">Assets Value</div>
            <div className="font-medium">{formatCurrency(holdingsValue)}</div>
            <div className="text-xs text-muted-foreground">
              {((holdingsValue / portfolioValue) * 100).toFixed(1)}% of portfolio
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Holdings</div>
          <div className="divide-y divide-border">
            {Object.entries(holdings)
              .filter(([_, amount]) => amount > 0)
              .map(([coinId, amount]) => {
                const coin = coins.find(c => c.id === coinId);
                if (!coin || amount <= 0) return null;
                
                const value = coin.price * amount;
                const percentage = (value / portfolioValue) * 100;
                
                return (
                  <div key={coinId} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">{coin.symbol}</div>
                      <div className="text-xs text-muted-foreground">{amount.toFixed(amount < 1 ? 8 : 2)} coins</div>
                    </div>
                    <div className="text-right">
                      <div>{formatCurrency(value)}</div>
                      <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                );
              })}
              
            {Object.values(holdings).filter(amount => amount > 0).length === 0 && (
              <div className="py-2 text-center text-sm text-muted-foreground">
                No holdings yet
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingStats;
