
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChevronUp, ChevronDown, BarChart2, PieChart } from "lucide-react";

interface PerformanceData {
  date: string;
  value: number;
  btcValue: number;
  ethValue: number;
}

const mockPerformanceData: PerformanceData[] = [
  { date: "Jan", value: 10000, btcValue: 10000, ethValue: 10000 },
  { date: "Feb", value: 11200, btcValue: 12000, ethValue: 10800 },
  { date: "Mar", value: 10800, btcValue: 11500, ethValue: 10200 },
  { date: "Apr", value: 12500, btcValue: 13000, ethValue: 11500 },
  { date: "May", value: 14000, btcValue: 12000, ethValue: 13000 },
  { date: "Jun", value: 13500, btcValue: 12800, ethValue: 13500 },
  { date: "Jul", value: 15000, btcValue: 14000, ethValue: 14800 },
];

interface PortfolioHolding {
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
  value: number;
  allocation: number;
  performance: number;
}

const mockHoldings: PortfolioHolding[] = [
  { coinId: "bitcoin", symbol: "BTC", name: "Bitcoin", amount: 0.05, value: 4500, allocation: 30, performance: 5.2 },
  { coinId: "ethereum", symbol: "ETH", name: "Ethereum", amount: 1.2, value: 3600, allocation: 24, performance: -2.1 },
  { coinId: "solana", symbol: "SOL", name: "Solana", amount: 15, value: 1950, allocation: 13, performance: 12.4 },
  { coinId: "cardano", symbol: "ADA", name: "Cardano", amount: 2000, value: 1200, allocation: 8, performance: 0.5 },
  { coinId: "ripple", symbol: "XRP", name: "XRP", amount: 2500, value: 1500, allocation: 10, performance: -1.8 },
  { coinId: "polkadot", symbol: "DOT", name: "Polkadot", amount: 75, value: 1200, allocation: 8, performance: 3.2 },
  { coinId: "dogecoin", symbol: "DOGE", name: "Dogecoin", amount: 5000, value: 690, allocation: 4.6, performance: 2.5 },
];

const RealTimePortfolioPerformance: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>("7d");
  const [portfolioValue, setPortfolioValue] = useState<number>(15000);
  const [initialValue, setInitialValue] = useState<number>(10000);
  const [portfolioPerformance, setPortfolioPerformance] = useState<number>(50);
  const [performanceType, setPerformanceType] = useState<string>("percent");
  
  const portfolioChange = portfolioValue - initialValue;
  const portfolioChangePercent = (portfolioChange / initialValue) * 100;
  const displayPerformance = performanceType === "currency" 
    ? `$${portfolioChange.toFixed(2)}` 
    : `${portfolioChangePercent.toFixed(2)}%`;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>
              Real-time tracking of your portfolio performance
            </CardDescription>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
              <SelectItem value="90d">90d</SelectItem>
              <SelectItem value="1y">1y</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-muted-foreground">Portfolio Value</div>
            <div className="text-2xl font-bold">${portfolioValue.toFixed(2)}</div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Performance ({timeframe})</div>
            <div className={`text-xl font-bold flex items-center justify-end ${portfolioChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolioChange >= 0 ? (
                <ChevronUp className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1" />
              )}
              {displayPerformance}
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="chart">
              <BarChart2 className="h-4 w-4 mr-2" />
              Chart
            </TabsTrigger>
            <TabsTrigger value="holdings">
              <PieChart className="h-4 w-4 mr-2" />
              Holdings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPerformanceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Portfolio" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={false} 
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="btcValue" 
                    name="Bitcoin" 
                    stroke="#ff8c00" 
                    strokeWidth={1.5}
                    strokeDasharray="5 5" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ethValue" 
                    name="Ethereum" 
                    stroke="#82ca9d" 
                    strokeWidth={1.5}
                    strokeDasharray="3 3" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="holdings" className="pt-4">
            <div className="space-y-2">
              {mockHoldings.map((holding) => (
                <div key={holding.coinId} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{holding.symbol}</div>
                    <div className="text-sm text-muted-foreground">{holding.name}</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="font-medium">${holding.value.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{holding.amount} {holding.symbol}</div>
                    <div className={`text-xs ${holding.performance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {holding.performance >= 0 ? '↑' : '↓'} {Math.abs(holding.performance)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RealTimePortfolioPerformance;
