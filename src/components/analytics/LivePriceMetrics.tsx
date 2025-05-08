
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { CoinOption } from '../trading/types';

interface LivePriceMetricsProps {
  coin: CoinOption;
  lastUpdated: Date;
}

const LivePriceMetrics: React.FC<LivePriceMetricsProps> = ({ coin, lastUpdated }) => {
  const isPositive = coin.changePercent >= 0;
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Price</div>
            <div className="text-2xl font-bold">${coin.price.toLocaleString()}</div>
            <div className={`text-sm flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              ${Math.abs(coin.priceChange).toLocaleString()} ({coin.changePercent.toFixed(2)}%)
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">24h Volume</div>
            <div className="text-2xl font-bold">${(coin.volume / 1000000).toFixed(1)}M</div>
            <div className={`text-sm flex items-center`}>
              {coin.volume > 10000000000 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-amber-500" />
              )}
              {coin.volume > 10000000000 ? 'High' : 'Moderate'} volume
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Market Cap</div>
            <div className="text-2xl font-bold">${(coin.marketCap / 1000000000).toFixed(1)}B</div>
            <div className="text-sm text-muted-foreground">
              Rank #{coin.symbol === 'BTC' ? '1' : coin.symbol === 'ETH' ? '2' : '3'}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Signals</div>
            <div className="text-2xl font-bold flex items-center">
              <Sparkles className={`h-5 w-5 mr-2 ${isPositive ? 'text-green-500' : 'text-amber-500'}`} />
              {isPositive ? 'Bullish' : 'Neutral'}
            </div>
            <div className="text-sm text-muted-foreground">
              {isPositive ? '3/4 indicators positive' : '2/4 indicators positive'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePriceMetrics;
