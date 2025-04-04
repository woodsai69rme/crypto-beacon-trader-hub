
import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MarketDepthChartProps {
  coinId: string;
  symbol: string;
}

interface OrderData {
  price: number;
  bidVolume: number;
  askVolume: number;
  totalBid: number;
  totalAsk: number;
}

const MarketDepthChart = ({ coinId, symbol }: MarketDepthChartProps) => {
  const [exchange, setExchange] = useState("binance");
  
  // Mock order book data - in a real app you would fetch this from an API
  const mockOrderBookData: OrderData[] = generateMockOrderBookData();
  
  // Current market price (middle point)
  const currentPrice = mockOrderBookData[Math.floor(mockOrderBookData.length / 2)].price;
  
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatVolume = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border p-2 rounded shadow-md">
          <p className="font-medium">{formatPrice(data.price)}</p>
          {data.bidVolume > 0 && (
            <p className="text-green-500">Bid: {formatVolume(data.totalBid)}</p>
          )}
          {data.askVolume > 0 && (
            <p className="text-red-500">Ask: {formatVolume(data.totalAsk)}</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Market Depth</CardTitle>
            <CardDescription>Order book visualization for {symbol}</CardDescription>
          </div>
          <Select value={exchange} onValueChange={setExchange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select exchange" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="binance">Binance</SelectItem>
              <SelectItem value="coinbase">Coinbase</SelectItem>
              <SelectItem value="kraken">Kraken</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockOrderBookData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <XAxis 
                dataKey="price" 
                type="number"
                domain={['dataMin', 'dataMax']} 
                tickFormatter={formatPrice}
                stroke="#888"
                fontSize={12}
              />
              <YAxis 
                dataKey="totalAsk" 
                tickFormatter={formatVolume}
                orientation="right" 
                stroke="#888"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                x={currentPrice}
                stroke="#888"
                strokeDasharray="3 3"
                label={{ value: "Market Price", position: "top", fill: "#888" }}
              />
              <defs>
                <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="totalBid"
                stroke="#22c55e"
                fill="url(#bidGradient)"
                animationDuration={750}
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="totalAsk"
                stroke="#ef4444"
                fill="url(#askGradient)"
                animationDuration={750}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-xs text-muted-foreground flex justify-between">
          <div>
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
            Bids (Buy Orders)
          </div>
          <div>
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
            Asks (Sell Orders)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Generate mock order book data
function generateMockOrderBookData(): OrderData[] {
  const basePrice = 40000; // Base price for BTC example
  const data: OrderData[] = [];
  
  // Generate bid data (buyers)
  let bidTotal = 0;
  for (let i = 0; i < 50; i++) {
    const price = basePrice - (i * 100);
    const volume = Math.random() * 10 + 1;
    bidTotal += volume;
    
    data.unshift({
      price,
      bidVolume: volume,
      askVolume: 0,
      totalBid: bidTotal,
      totalAsk: 0
    });
  }
  
  // Generate ask data (sellers)
  let askTotal = 0;
  for (let i = 0; i < 50; i++) {
    const price = basePrice + (i * 100);
    const volume = Math.random() * 10 + 1;
    askTotal += volume;
    
    data.push({
      price,
      bidVolume: 0,
      askVolume: volume,
      totalBid: 0,
      totalAsk: askTotal
    });
  }
  
  return data;
}

export default MarketDepthChart;
