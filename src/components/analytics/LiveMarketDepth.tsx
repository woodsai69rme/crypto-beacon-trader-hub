
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface LiveMarketDepthProps {
  coinId: string;
  symbol: string;
}

const LiveMarketDepth: React.FC<LiveMarketDepthProps> = ({ coinId, symbol }) => {
  // Mock data for visualization
  const depthData = [
    { price: 60800, bid: 15, ask: 0 },
    { price: 60850, bid: 12, ask: 0 },
    { price: 60900, bid: 10, ask: 0 },
    { price: 60950, bid: 8, ask: 0 },
    { price: 61000, bid: 5, ask: 0 },
    { price: 61050, bid: 3, ask: 0 },
    { price: 61100, bid: 1, ask: 0 },
    { price: 61150, bid: 0, ask: 0 },
    { price: 61200, bid: 0, ask: 1 },
    { price: 61250, bid: 0, ask: 3 },
    { price: 61300, bid: 0, ask: 5 },
    { price: 61350, bid: 0, ask: 8 },
    { price: 61400, bid: 0, ask: 10 },
    { price: 61450, bid: 0, ask: 12 },
    { price: 61500, bid: 0, ask: 15 },
  ];

  const priceData = [
    { time: '12:00', price: 61150 },
    { time: '12:05', price: 61200 },
    { time: '12:10', price: 61180 },
    { time: '12:15', price: 61220 },
    { time: '12:20', price: 61250 },
    { time: '12:25', price: 61230 },
    { time: '12:30', price: 61260 },
    { time: '12:35', price: 61300 },
    { time: '12:40', price: 61280 },
    { time: '12:45', price: 61320 },
    { time: '12:50', price: 61350 },
    { time: '12:55', price: 61330 },
    { time: '13:00', price: 61380 },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Market Depth & Price Action</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={depthData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="price" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value} ${symbol}`, 'Volume']}
                  labelFormatter={(label) => `Price: $${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="bid" 
                  stackId="1"
                  stroke="#4ADE80" 
                  fill="#4ADE80" 
                  fillOpacity={0.6} 
                />
                <Area 
                  type="monotone" 
                  dataKey="ask" 
                  stackId="1"
                  stroke="#F87171" 
                  fill="#F87171" 
                  fillOpacity={0.6} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={priceData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 border-t">
          <div className="space-y-2">
            <div className="text-sm font-medium">Bid Summary</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground">Price</div>
                <div className="font-medium">$61,100.00</div>
              </div>
              <div>
                <div className="text-muted-foreground">Sum (BTC)</div>
                <div className="font-medium">54.00</div>
              </div>
              <div>
                <div className="text-muted-foreground">Sum (USD)</div>
                <div className="font-medium">$3.3M</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Ask Summary</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground">Price</div>
                <div className="font-medium">$61,200.00</div>
              </div>
              <div>
                <div className="text-muted-foreground">Sum (BTC)</div>
                <div className="font-medium">54.00</div>
              </div>
              <div>
                <div className="text-muted-foreground">Sum (USD)</div>
                <div className="font-medium">$3.3M</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveMarketDepth;
