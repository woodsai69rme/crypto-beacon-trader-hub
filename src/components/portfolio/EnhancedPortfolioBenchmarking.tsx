
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";
import { EnhancedPortfolioBenchmarkingProps } from "@/types/trading";

const EnhancedPortfolioBenchmarking = ({ 
  portfolioPerformance, 
  portfolioDates,
}: EnhancedPortfolioBenchmarkingProps) => {
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<string[]>(["btc", "eth"]);
  const [timeframe, setTimeframe] = useState("1y");
  const [showRelative, setShowRelative] = useState(true);
  const { formatValue } = useCurrencyConverter();

  // Demo benchmark data - in a real app, this would come from an API
  const benchmarkData = {
    btc: [0, 3.2, 5.1, 2.3, 8.7, 15.2, 12.1, 9.8, 14.3, 18.7, 22.1, 19.8],
    eth: [0, 2.7, 4.3, 7.8, 12.3, 9.8, 5.6, 8.9, 13.4, 15.8, 14.3, 18.9],
    sol: [-2.1, 5.8, 9.3, 15.8, 21.3, 18.6, 12.4, 7.5, 10.8, 19.2, 23.5, 17.3],
    defi: [-1.5, 3.1, 7.2, 9.8, 14.2, 10.6, 6.5, 12.3, 18.7, 22.5, 19.8, 16.5],
    metaverse: [-3.2, 1.8, 8.5, 12.9, 18.7, 22.5, 17.8, 11.3, 13.9, 20.1, 24.5, 21.2],
    sp500: [0, 1.2, 2.4, 3.1, 2.8, 3.5, 4.2, 3.8, 4.5, 5.2, 6.1, 7.3],
    gold: [0, 0.8, 1.5, 2.1, 1.9, 2.3, 1.8, 2.5, 3.2, 3.7, 4.1, 3.9]
  };

  const benchmarkColors = {
    btc: "#F7931A",
    eth: "#627EEA",
    sol: "#00FFA3",
    defi: "#9945FF",
    metaverse: "#FF8A65",
    sp500: "#0077B5",
    gold: "#FFD700"
  };

  const benchmarkNames = {
    btc: "Bitcoin",
    eth: "Ethereum",
    sol: "Solana",
    defi: "DeFi Index",
    metaverse: "Metaverse Index",
    sp500: "S&P 500",
    gold: "Gold"
  };

  const data = portfolioDates.map((date, index) => {
    const point: any = { date };
    point.portfolio = portfolioPerformance[index];
    
    selectedBenchmarks.forEach(benchmark => {
      point[benchmark] = benchmarkData[benchmark as keyof typeof benchmarkData][index];
    });
    
    return point;
  });

  const toggleBenchmark = (benchmark: string) => {
    if (selectedBenchmarks.includes(benchmark)) {
      setSelectedBenchmarks(selectedBenchmarks.filter(b => b !== benchmark));
    } else {
      setSelectedBenchmarks([...selectedBenchmarks, benchmark]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Enhanced Portfolio Benchmarking</CardTitle>
            <CardDescription>
              Compare your performance against multiple market indices and assets
            </CardDescription>
          </div>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(benchmarkData).map(benchmark => (
            <Badge 
              key={benchmark}
              variant="outline"
              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                selectedBenchmarks.includes(benchmark) 
                  ? `bg-opacity-20 bg-[${benchmarkColors[benchmark as keyof typeof benchmarkColors]}] text-[${benchmarkColors[benchmark as keyof typeof benchmarkColors]}]` 
                  : "bg-muted text-muted-foreground"
              }`}
              onClick={() => toggleBenchmark(benchmark)}
            >
              {benchmarkNames[benchmark as keyof typeof benchmarkNames]}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-end mb-4">
          <Toggle 
            pressed={showRelative} 
            onPressedChange={setShowRelative}
          >
            Show relative performance
          </Toggle>
        </div>
        
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)}%`, ""]} 
                labelFormatter={(value) => `Date: ${value}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="portfolio" 
                name="Your Portfolio" 
                stroke="#10b981" 
                activeDot={{ r: 8 }} 
                strokeWidth={2.5} 
              />
              {selectedBenchmarks.includes("btc") && (
                <Line 
                  type="monotone" 
                  dataKey="btc" 
                  name="Bitcoin" 
                  stroke="#F7931A" 
                  strokeWidth={1.5} 
                />
              )}
              {selectedBenchmarks.includes("eth") && (
                <Line 
                  type="monotone" 
                  dataKey="eth" 
                  name="Ethereum" 
                  stroke="#627EEA" 
                  strokeWidth={1.5} 
                />
              )}
              {selectedBenchmarks.includes("sol") && (
                <Line 
                  type="monotone" 
                  dataKey="sol" 
                  name="Solana" 
                  stroke="#00FFA3" 
                  strokeWidth={1.5} 
                />
              )}
              {selectedBenchmarks.includes("defi") && (
                <Line 
                  type="monotone" 
                  dataKey="defi" 
                  name="DeFi Index" 
                  stroke="#9945FF" 
                  strokeWidth={1.5} 
                />
              )}
              {selectedBenchmarks.includes("metaverse") && (
                <Line 
                  type="monotone" 
                  dataKey="metaverse" 
                  name="Metaverse Index" 
                  stroke="#FF8A65" 
                  strokeWidth={1.5} 
                />
              )}
              {selectedBenchmarks.includes("sp500") && (
                <Line 
                  type="monotone" 
                  dataKey="sp500" 
                  name="S&P 500" 
                  stroke="#0077B5" 
                  strokeWidth={1.5} 
                />
              )}
              {selectedBenchmarks.includes("gold") && (
                <Line 
                  type="monotone" 
                  dataKey="gold" 
                  name="Gold" 
                  stroke="#FFD700" 
                  strokeWidth={1.5} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-muted/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Performance Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Portfolio:</span>
                <span className="font-medium text-green-500">+{portfolioPerformance[portfolioPerformance.length - 1].toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best Performer:</span>
                <span className="font-medium text-green-500">+{Math.max(...Object.values(benchmarkData).map(arr => arr[arr.length - 1])).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Worst Performer:</span>
                <span className="font-medium text-amber-500">+{Math.min(...Object.values(benchmarkData).map(arr => arr[arr.length - 1])).toFixed(2)}%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Volatility Analysis</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Portfolio:</span>
                <span className="font-medium">Medium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Crypto Assets:</span>
                <span className="font-medium">Very High</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Traditional Assets:</span>
                <span className="font-medium">Low</span>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Risk-Adjusted Returns</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sharpe Ratio:</span>
                <span className="font-medium">1.42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sortino Ratio:</span>
                <span className="font-medium">1.86</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Drawdown:</span>
                <span className="font-medium">-18.2%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button>Export Benchmark Analysis</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
