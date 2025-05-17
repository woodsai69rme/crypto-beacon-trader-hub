import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Wallet, ExternalLink, MoreHorizontal, RefreshCw } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trade, CoinOption, SupportedCurrency } from '@/types/trading';
import { Skeleton } from "@/components/ui/skeleton";

interface TradingHoldingsProps {
  trades?: Trade[];
  isLoading?: boolean;
  onRefresh?: () => void;
  availableCoins?: CoinOption[];
  currency?: string;
}

const TradingHoldings: React.FC<TradingHoldingsProps> = ({ 
  trades = [], 
  isLoading = false,
  onRefresh,
  availableCoins = [],
  currency = 'USD'
}) => {
  // Helper function to ensure string is a valid SupportedCurrency
  const ensureValidCurrency = (currency: string): SupportedCurrency => {
    const validCurrencies = ['AUD', 'USD', 'EUR', 'GBP'];
    return validCurrencies.includes(currency.toUpperCase()) 
      ? currency.toUpperCase() as SupportedCurrency
      : 'AUD'; // Default to AUD
  };

  // Group trades by coin
  const holdingsByAsset = React.useMemo(() => {
    const holdings: Record<string, {
      coinId: string;
      coinName: string;
      coinSymbol: string;
      totalQuantity: number;
      averagePrice: number;
      totalValue: number;
      currentValue: number;
      profitLoss: number;
      profitLossPercent: number;
    }> = {};

    trades.forEach(trade => {
      const { coinId, coinName, coinSymbol, price, amount = 0, type } = trade;
      
      if (!holdings[coinId]) {
        holdings[coinId] = {
          coinId,
          coinName,
          coinSymbol,
          totalQuantity: 0,
          averagePrice: 0,
          totalValue: 0,
          currentValue: 0,
          profitLoss: 0,
          profitLossPercent: 0
        };
      }
      
      const currentHolding = holdings[coinId];
      
      if (type === 'buy') {
        const newTotalQuantity = currentHolding.totalQuantity + amount;
        const newTotalValue = currentHolding.totalValue + (price * amount);
        
        currentHolding.totalQuantity = newTotalQuantity;
        currentHolding.totalValue = newTotalValue;
        currentHolding.averagePrice = newTotalValue / newTotalQuantity;
      } else {
        // Sell
        currentHolding.totalQuantity -= amount;
        // We don't adjust average price on sells
      }
    });
    
    // Calculate current values and profit/loss
    Object.values(holdings).forEach(holding => {
      const coin = availableCoins.find(c => c.id === holding.coinId);
      const currentPrice = coin?.price || 0;
      
      holding.currentValue = holding.totalQuantity * currentPrice;
      holding.profitLoss = holding.currentValue - holding.totalValue;
      holding.profitLossPercent = holding.totalValue > 0 
        ? (holding.profitLoss / holding.totalValue) * 100 
        : 0;
    });
    
    // Filter out assets with zero quantity
    return Object.values(holdings).filter(h => h.totalQuantity > 0);
  }, [trades, availableCoins]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    const validCurrency = ensureValidCurrency(currency);
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: validCurrency 
    }).format(value);
  };
  
  // Calculate total portfolio value
  const totalPortfolioValue = React.useMemo(() => {
    return holdingsByAsset.reduce((sum, holding) => sum + holding.currentValue, 0);
  }, [holdingsByAsset]);
  
  // Calculate total profit/loss
  const totalProfitLoss = React.useMemo(() => {
    return holdingsByAsset.reduce((sum, holding) => sum + holding.profitLoss, 0);
  }, [holdingsByAsset]);
  
  const totalProfitLossPercent = totalPortfolioValue > 0 
    ? (totalProfitLoss / (totalPortfolioValue - totalProfitLoss)) * 100 
    : 0;
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-60" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-12 mt-1" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Portfolio Holdings
            </CardTitle>
            <CardDescription>
              Your current crypto assets and their performance
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="bg-muted/50 p-3 rounded-md flex-1">
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</div>
            </div>
            
            <div className={`p-3 rounded-md flex-1 ${
              totalProfitLoss >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
            }`}>
              <div className="text-sm text-muted-foreground">Total Profit/Loss</div>
              <div className={`text-2xl font-bold flex items-center gap-1 ${
                totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {totalProfitLoss >= 0 ? (
                  <ArrowUpRight className="h-5 w-5" />
                ) : (
                  <ArrowDownRight className="h-5 w-5" />
                )}
                {formatCurrency(Math.abs(totalProfitLoss))}
                <span className="text-sm">
                  ({totalProfitLoss >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
          
          {holdingsByAsset.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No holdings found. Start trading to build your portfolio.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {holdingsByAsset.map(holding => {
                const coin = availableCoins.find(c => c.id === holding.coinId);
                const coinImage = coin?.image || '';
                
                return (
                  <div key={holding.coinId} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {coinImage ? (
                        <img src={coinImage} alt={holding.coinSymbol} className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {holding.coinSymbol.substring(0, 1)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{holding.coinName}</div>
                        <div className="text-sm text-muted-foreground">
                          {holding.totalQuantity.toFixed(6)} {holding.coinSymbol}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(holding.currentValue)}</div>
                      <div className={`text-sm flex items-center justify-end gap-1 ${
                        holding.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {holding.profitLoss >= 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {holding.profitLossPercent.toFixed(2)}%
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Buy More</DropdownMenuItem>
                        <DropdownMenuItem>Sell Position</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Set Price Alert</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingHoldings;
