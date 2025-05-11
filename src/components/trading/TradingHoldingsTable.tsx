
import React from "react";
import { ArrowUp, ArrowDown, Wallet } from "lucide-react";
import { SupportedCurrency } from "@/types/trading";
import type { CoinOption } from "@/types/trading";

interface TradingHoldingsTableProps {
  availableCoins: CoinOption[];
  getOwnedCoinAmount: (coinId: string) => number;
  formatCurrency: (value: number) => string;
  activeCurrency: SupportedCurrency;
  conversionRate: number;
}

const TradingHoldingsTable: React.FC<TradingHoldingsTableProps> = ({
  availableCoins,
  getOwnedCoinAmount,
  formatCurrency,
  activeCurrency,
  conversionRate
}) => {
  const hasHoldings = availableCoins.some(coin => getOwnedCoinAmount(coin.id) > 0);
  
  if (!hasHoldings) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>You don't have any holdings yet.</p>
        <p className="text-sm">Start buying some crypto to build your portfolio.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {availableCoins.map(coin => {
        const ownedAmount = getOwnedCoinAmount(coin.id);
        if (ownedAmount <= 0) return null;
        
        // Use the appropriate price based on currency with type safety
        let price = coin.price; // Default is USD
        
        // Use type assertion for the optional properties
        if (activeCurrency === 'AUD') {
          price = (coin as any).priceAUD || coin.price * conversionRate;
        } else if (activeCurrency === 'EUR') {
          price = (coin as any).priceEUR || coin.price * conversionRate;
        } else if (activeCurrency === 'GBP') {
          price = (coin as any).priceGBP || coin.price * conversionRate;
        } else if (activeCurrency !== 'USD') {
          // Fallback to conversion rate if specific currency price not available
          price = coin.price * conversionRate;
        }
            
        const value = ownedAmount * price;
        
        // Calculate profit/loss (simplified for this component)
        const profitLoss = 0; // This would be calculated based on purchase history
        const profitLossPercentage = 0; // This would be calculated based on purchase history
        
        return (
          <div key={coin.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Wallet className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <div className="font-medium">{coin.symbol}</div>
                <div className="text-xs text-muted-foreground">{ownedAmount.toFixed(6)} {coin.symbol}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatCurrency(value)}</div>
              <div className={`text-xs flex items-center justify-end ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {profitLoss >= 0 ? (
                  <ArrowUp className="mr-0.5 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-0.5 h-3 w-3" />
                )}
                {formatCurrency(Math.abs(profitLoss))} ({Math.abs(profitLossPercentage).toFixed(2)}%)
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TradingHoldingsTable;
