
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PortfolioBenchmark, EnhancedPortfolioBenchmarkingProps } from "@/types/trading";

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({
  portfolioPerformance,
  portfolioDates
}) => {
  const [benchmarks, setBenchmarks] = useState<PortfolioBenchmark[]>([
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      type: "crypto",
      data: portfolioDates.map((date, index) => ({
        date,
        value: 0,
        performance: index * 0.8
      })),
      color: "#F7931A",
      performance: portfolioDates.map((_, index) => index * 0.8),
      lastUpdated: new Date().toISOString()
    },
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      type: "crypto",
      data: portfolioDates.map((date, index) => ({
        date,
        value: 0,
        performance: index * 0.6
      })),
      color: "#627EEA",
      performance: portfolioDates.map((_, index) => index * 0.6),
      lastUpdated: new Date().toISOString()
    },
    {
      id: "nasdaq",
      name: "NASDAQ",
      symbol: "^IXIC",
      type: "index",
      data: portfolioDates.map((date, index) => ({
        date,
        value: 0,
        performance: index * 0.3
      })),
      color: "#145369",
      performance: portfolioDates.map((_, index) => index * 0.3),
      lastUpdated: new Date().toISOString()
    }
  ]);
  
  const [activeBenchmarks, setActiveBenchmarks] = useState<string[]>(["btc"]);
  const [periodFilter, setPeriodFilter] = useState<string>("3m");

  const toggleBenchmark = (id: string) => {
    setActiveBenchmarks(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const chartData = portfolioDates.map((date, index) => {
    const dataPoint: { [key: string]: any } = { date };
    
    dataPoint.portfolio = portfolioPerformance[index];
    
    benchmarks.forEach(benchmark => {
      if (activeBenchmarks.includes(benchmark.id)) {
        dataPoint[benchmark.id] = benchmark.performance[index];
      }
    });
    
    return dataPoint;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Portfolio Benchmarking</CardTitle>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label className="mb-2 block">Compare with:</Label>
          <div className="flex flex-wrap gap-2">
            {benchmarks.map((benchmark) => (
              <Button 
                key={benchmark.id}
                variant={activeBenchmarks.includes(benchmark.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleBenchmark(benchmark.id)}
              >
                {benchmark.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                padding={{ left: 0, right: 0 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => [`${value}%`, ""]} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="portfolio" 
                name="Your Portfolio" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
              {benchmarks.map((benchmark) => 
                activeBenchmarks.includes(benchmark.id) && (
                  <Line 
                    key={benchmark.id}
                    type="monotone" 
                    dataKey={benchmark.id} 
                    name={benchmark.name} 
                    stroke={benchmark.color} 
                  />
                )
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
