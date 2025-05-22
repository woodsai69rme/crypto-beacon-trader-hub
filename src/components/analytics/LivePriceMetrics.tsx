
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CoinOption } from '@/types/trading';
import { ArrowUpRight, ArrowDownRight, TrendingUp, ArrowRight } from 'lucide-react';

interface LivePriceMetricsProps {
  coin: CoinOption;
  lastUpdated: Date;
}

const LivePriceMetrics: React.FC<LivePriceMetricsProps> = ({ coin, lastUpdated }) => {
  // Generate mock price data for the chart
  const generatePriceData = () => {
    const data = [];
    const now = new Date();
    const hours = 24;
    const basePrice = coin.price;
    const volatility = 0.02; // 2% volatility
    
    for (let i = hours; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const randomFactor = Math.random() * volatility - volatility / 2;
      const price = basePrice * (1 + (i / hours) * coin.changePercent / 100 + randomFactor);
      
      data.push({
        time: `${time.getHours()}:00`,
        price: parseFloat(price.toFixed(2))
      });
    }
    
    return data;
  };
  
  const priceData = generatePriceData();
  const isPriceUp = coin.priceChange > 0;
  const formattedPrice = coin.price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  const formattedPriceChange = coin.priceChange.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  // Trading metrics for this coin (mock data)
  const tradingMetrics = {
    volume24h: (coin.volume).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }),
    marketCap: (coin.marketCap).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }),
    weekChange: (Math.random() * (isPriceUp ? 10 : -5) + (isPriceUp ? 5 : -10)).toFixed(2)
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* Price info */}
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-semibold mr-2">{coin.name}</h3>
                <span className="text-sm text-muted-foreground uppercase">{coin.symbol}</span>
              </div>
              
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{formattedPrice}</span>
                <div className={`flex items-center text-sm ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
                  {isPriceUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  <span>{formattedPriceChange} ({coin.changePercent.toFixed(2)}%)</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="font-medium">{tradingMetrics.volume24h}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <p className="font-medium">{tradingMetrics.marketCap}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">7d Change</p>
                <p className={`font-medium flex items-center ${parseFloat(tradingMetrics.weekChange) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {parseFloat(tradingMetrics.weekChange) > 0 ? 
                    <TrendingUp className="h-3 w-3 mr-1" /> : 
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  }
                  {tradingMetrics.weekChange}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price Alert</p>
                <div className="flex items-center text-sm text-blue-500">
                  <ArrowRight className="h-3 w-3 mr-1" />
                  <span>Set Alert</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Price chart */}
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={30}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Price']}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke={isPriceUp ? "#10b981" : "#ef4444"} 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LivePriceMetrics;
