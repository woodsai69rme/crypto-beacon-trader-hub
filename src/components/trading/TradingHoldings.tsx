
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Wallet } from "lucide-react";
import type { CoinOption } from "@/types/trading";

interface TradingHoldingsProps {
  availableCoins: CoinOption[];
  getOwnedCoinAmount: (coinId: string) => number;
  onReset: () => void;
  formatCurrency: (value: number) => string;
}

const TradingHoldings = ({ availableCoins, getOwnedCoinAmount, onReset, formatCurrency }: TradingHoldingsProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Your Holdings</h3>
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>
      
      <div className="space-y-2">
        {availableCoins.map(coin => {
          const ownedAmount = getOwnedCoinAmount(coin.id);
          if (ownedAmount <= 0) return null;
          
          const value = ownedAmount * coin.price;
          
          // Calculate profit/loss (simplified for this component)
          const profitLoss = 0; // This would be calculated based on purchase history
          const profitLossPercentage = 0; // This would be calculated based on purchase history
          
          return (
            <div key={coin.id} className="flex justify-between items-center p-3 border rounded-md">
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
        
        {!availableCoins.some(coin => getOwnedCoinAmount(coin.id) > 0) && (
          <div className="text-center py-8 text-muted-foreground">
            <p>You don't have any holdings yet.</p>
            <p className="text-sm">Start buying some crypto to build your portfolio.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingHoldings;
