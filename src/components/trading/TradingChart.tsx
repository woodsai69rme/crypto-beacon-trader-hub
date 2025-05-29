
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface TradingChartProps {
  coinId: string;
  showVolume?: boolean;
  showControls?: boolean;
}

const TradingChart: React.FC<TradingChartProps> = ({ 
  coinId, 
  showVolume = false, 
  showControls = false 
}) => {
  const [priceData, setPriceData] = useState({
    current: 45000,
    change: 1200,
    changePercent: 2.74
  });
  const [timeframe, setTimeframe] = useState('1D');
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 1000;
      setPriceData(prev => ({
        current: prev.current + variation,
        change: prev.change + variation,
        changePercent: ((prev.current + variation - 45000) / 45000) * 100
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const timeframes = ['1H', '4H', '1D', '1W', '1M'];

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Price Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{formatCurrency(priceData.current)}</h3>
              <div className="flex items-center gap-2">
                {priceData.changePercent >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  priceData.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {priceData.changePercent >= 0 ? '+' : ''}{priceData.changePercent.toFixed(2)}%
                </span>
                <span className="text-sm text-muted-foreground">
                  ({priceData.changePercent >= 0 ? '+' : ''}{formatCurrency(priceData.change)})
                </span>
              </div>
            </div>
            {showControls && (
              <div className="flex items-center gap-1">
                {timeframes.map((tf) => (
                  <Button
                    key={tf}
                    variant={timeframe === tf ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeframe(tf)}
                  >
                    {tf}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Chart Area */}
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Chart visualization</p>
              <p className="text-sm text-muted-foreground">
                {coinId.toUpperCase()} / AUD - {timeframe}
              </p>
            </div>
          </div>

          {/* Volume Bar */}
          {showVolume && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">24h Volume</span>
                <Badge variant="secondary">
                  {formatCurrency(1250000)}
                </Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: '65%' }}
                />
              </div>
            </div>
          )}

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">24h High</p>
              <p className="font-medium">{formatCurrency(priceData.current * 1.05)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">24h Low</p>
              <p className="font-medium">{formatCurrency(priceData.current * 0.95)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Market Cap</p>
              <p className="font-medium">{formatCurrency(priceData.current * 19700000)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Circulating Supply</p>
              <p className="font-medium">19.7M BTC</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingChart;
