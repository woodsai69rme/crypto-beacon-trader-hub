
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SupportedCurrency } from "@/types/trading";
import { CoinOption } from "@/types/trading";

interface TradingHoldingsProps {
  availableCoins: CoinOption[];
  getOwnedCoinAmount: (coinId: string) => number;
  onReset: () => void;
  formatCurrency: (value: number) => string;
  activeCurrency: SupportedCurrency;
  conversionRate?: number;
}

const TradingHoldings: React.FC<TradingHoldingsProps> = ({
  availableCoins,
  getOwnedCoinAmount,
  onReset,
  formatCurrency,
  activeCurrency,
  conversionRate = 1
}) => {
  // Get coins that the user owns
  const ownedCoins = availableCoins.filter(
    coin => getOwnedCoinAmount(coin.id) > 0
  );
  
  // Calculate the total value of all holdings
  const calculateTotalValue = () => {
    return ownedCoins.reduce((total, coin) => {
      let price = coin.price;
      
      // Safely check for currency-specific prices or use conversion rate
      if (activeCurrency === 'AUD') {
        price = (coin as any).priceAUD || coin.price * conversionRate;
      } else if (activeCurrency === 'EUR') {
        price = (coin as any).priceEUR || coin.price * 0.92; // Default EUR conversion
      } else if (activeCurrency === 'GBP') {
        price = (coin as any).priceGBP || coin.price * 0.8; // Default GBP conversion
      }
      
      return total + (getOwnedCoinAmount(coin.id) * price);
    }, 0);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">My Holdings</CardTitle>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onReset}
            className="h-8 px-3"
          >
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {ownedCoins.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            You don't own any coins yet
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {ownedCoins.map(coin => {
                const amount = getOwnedCoinAmount(coin.id);
                let coinPrice = coin.price;
                
                if (activeCurrency === 'AUD') {
                  coinPrice = (coin as any).priceAUD || coin.price * conversionRate;
                } else if (activeCurrency === 'EUR') {
                  coinPrice = (coin as any).priceEUR || coin.price * 0.92;
                } else if (activeCurrency === 'GBP') {
                  coinPrice = (coin as any).priceGBP || coin.price * 0.8;
                }
                      
                const value = amount * coinPrice;
                
                return (
                  <div key={coin.id} className="bg-muted/50 p-4 rounded-md">
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">{coin.name}</div>
                      <div className="font-medium">{formatCurrency(value)}</div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div>{amount} {coin.symbol}</div>
                      <div>{formatCurrency(coinPrice)} / {coin.symbol}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-between mt-6 pt-4 border-t">
              <div className="font-medium">Total Value:</div>
              <div className="font-bold">{formatCurrency(calculateTotalValue())}</div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingHoldings;
