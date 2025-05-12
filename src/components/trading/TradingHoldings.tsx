import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useTradingContext } from "@/contexts/TradingContext";
import { CoinOption, SupportedCurrency } from '@/types/trading';
import { formatCurrency } from '@/lib/utils';

interface TradingHoldingsProps {
  isLoading: boolean;
}

interface Holding {
  coinId: string;
  amount: number;
  coin?: CoinOption;
}

const TradingHoldings: React.FC<TradingHoldingsProps> = ({ isLoading }) => {
  const { account, coins, activeCurrency } = useTradingContext();

  // Calculate holdings
  const holdings: Holding[] = React.useMemo(() => {
    if (!account) return [];

    const coinHoldings: { [coinId: string]: number } = {};

    account.trades.forEach(trade => {
      if (!coinHoldings[trade.coinId]) {
        coinHoldings[trade.coinId] = 0;
      }
      coinHoldings[trade.coinId] += trade.type === 'buy' ? trade.amount : -trade.amount;
    });

    return Object.entries(coinHoldings)
      .filter(([, amount]) => amount > 0)
      .map(([coinId, amount]) => ({
        coinId,
        amount,
        coin: coins?.find(coin => coin.id === coinId)
      }));
  }, [account, coins]);

  // Add price conversion helper function
  const getCoinPrice = (coin: CoinOption, currency: SupportedCurrency): number => {
    switch (currency) {
      case 'AUD':
        return coin.price * 1.5; // Apply conversion rate
      case 'EUR':
        return coin.price * 0.9; // Apply conversion rate
      case 'GBP':
        return coin.price * 0.8; // Apply conversion rate
      case 'USD':
      default:
        return coin.price;
    }
  };

  const renderHoldingValue = (holding: Holding, activeCurrency: SupportedCurrency): string => {
    if (!holding.coin) return '-';
    
    const price = getCoinPrice(holding.coin, activeCurrency);
    const value = holding.amount * price;
    
    return formatCurrency(value, activeCurrency);
  };

  const totalPortfolioValue = React.useMemo(() => {
    return holdings.reduce((total, holding) => {
      if (!holding.coin) return total;
      const price = getCoinPrice(holding.coin, activeCurrency);
      return total + holding.amount * price;
    }, 0);
  }, [holdings, activeCurrency]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
        <CardDescription>Your current cryptocurrency holdings</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y divide-border">
            {isLoading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </>
            ) : holdings.length > 0 ? (
              holdings.map(holding => (
                <div key={holding.coinId} className="flex items-center space-x-4 p-4">
                  <Avatar>
                    {holding.coin?.image ? (
                      <AvatarImage src={holding.coin.image} alt={holding.coin.name} />
                    ) : (
                      <AvatarFallback>{holding.coin?.symbol}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{holding.coin?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {holding.amount.toFixed(2)} {holding.coin?.symbol}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {renderHoldingValue(holding, activeCurrency)}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No holdings yet. Start trading to build your portfolio!
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 font-bold">
        Total Portfolio Value: {formatCurrency(totalPortfolioValue, activeCurrency)}
      </div>
    </Card>
  );
};

export default TradingHoldings;
