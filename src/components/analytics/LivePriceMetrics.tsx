
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { CoinOption } from '@/types/trading';
import { useCurrency } from '@/contexts/CurrencyContext';

interface LivePriceMetricsProps {
  coin: CoinOption;
  lastUpdated: Date;
}

const LivePriceMetrics: React.FC<LivePriceMetricsProps> = ({ coin, lastUpdated }) => {
  const { formatCurrency } = useCurrency();
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  useEffect(() => {
    // Update price history for trend calculation
    setPriceHistory(prev => [...prev.slice(-9), coin.price].slice(-10));
  }, [coin.price]);

  const calculateTrend = () => {
    if (priceHistory.length < 2) return 'neutral';
    const recent = priceHistory.slice(-3);
    const isUptrend = recent.every((price, index) => index === 0 || price >= recent[index - 1]);
    const isDowntrend = recent.every((price, index) => index === 0 || price <= recent[index - 1]);
    
    if (isUptrend) return 'up';
    if (isDowntrend) return 'down';
    return 'neutral';
  };

  const trend = calculateTrend();
  const volatility = priceHistory.length > 1 
    ? Math.abs(coin.changePercent || 0) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Price</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(coin.price)}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Change</CardTitle>
          {(coin.changePercent || 0) >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            (coin.changePercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {(coin.changePercent || 0) >= 0 ? '+' : ''}{(coin.changePercent || 0).toFixed(2)}%
          </div>
          <div className="text-xs text-muted-foreground">
            {formatCurrency(coin.priceChange || 0)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Volume (24h)</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {coin.volume ? `$${(coin.volume / 1e9).toFixed(2)}B` : 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground">
            Trading volume
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Trend</CardTitle>
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : trend === 'down' ? (
            <TrendingDown className="h-4 w-4 text-red-600" />
          ) : (
            <Activity className="h-4 w-4 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant={
              trend === 'up' ? 'default' : 
              trend === 'down' ? 'destructive' : 
              'secondary'
            }>
              {trend === 'up' ? 'Uptrend' : trend === 'down' ? 'Downtrend' : 'Sideways'}
            </Badge>
            <div className="text-xs text-muted-foreground">
              Volatility: {volatility.toFixed(2)}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LivePriceMetrics;
