
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTradingContext } from '@/contexts/TradingContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

const TradingHoldings: React.FC = () => {
  const { activeAccount } = useTradingContext();
  const { formatCurrency } = useCurrency();

  if (!activeAccount) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No active trading account</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate holdings from trades
  const holdings = activeAccount.trades.reduce((acc, trade) => {
    const symbol = trade.symbol;
    if (!acc[symbol]) {
      acc[symbol] = {
        symbol,
        quantity: 0,
        averagePrice: 0,
        totalValue: 0,
        pnl: 0
      };
    }

    if (trade.type === 'buy') {
      const newQuantity = acc[symbol].quantity + trade.quantity;
      acc[symbol].averagePrice = (acc[symbol].averagePrice * acc[symbol].quantity + trade.price * trade.quantity) / newQuantity;
      acc[symbol].quantity = newQuantity;
    } else {
      acc[symbol].quantity -= trade.quantity;
    }

    return acc;
  }, {} as Record<string, any>);

  const holdingsArray = Object.values(holdings).filter((holding: any) => holding.quantity > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        {holdingsArray.length === 0 ? (
          <p className="text-muted-foreground">No holdings yet. Start trading to see your positions here.</p>
        ) : (
          <div className="space-y-4">
            {holdingsArray.map((holding: any) => {
              const currentPrice = 50000 + Math.random() * 10000; // Mock current price
              const currentValue = holding.quantity * currentPrice;
              const pnl = currentValue - (holding.quantity * holding.averagePrice);
              const pnlPercentage = (pnl / (holding.quantity * holding.averagePrice)) * 100;

              return (
                <div key={holding.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{holding.symbol}</h3>
                    <p className="text-sm text-muted-foreground">
                      {holding.quantity.toFixed(6)} units
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Avg: {formatCurrency(holding.averagePrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(currentValue)}</p>
                    <div className="flex items-center gap-1">
                      {pnl >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <Badge variant={pnl >= 0 ? "default" : "destructive"}>
                        {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)} ({pnlPercentage.toFixed(2)}%)
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingHoldings;
