import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PortfolioBenchmark } from "@/types/trading";
import { generateHistoricalData } from "@/utils/mockDataGenerators";

const EnhancedPortfolioBenchmarking = () => {
  const [timeRange, setTimeRange] = useState<"1w" | "1m" | "3m" | "6m" | "1y" | "all">("3m");
  const [benchmarks, setBenchmarks] = useState<PortfolioBenchmark[]>([]);
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<string[]>(["portfolio", "btc"]);
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would fetch actual data from an API
    const fetchData = async () => {
      setIsLoading(true);
      
      // Generate mock data for demonstration
      const portfolioPoints = generateHistoricalData(timeRange, 10000, 0.05);
      const bitcoinData = generateHistoricalData(timeRange, 50000, 0.08);
      const ethereumData = generateHistoricalData(timeRange, 3000, 0.1);
      const sp500Data = generateHistoricalData(timeRange, 4000, 0.03);
      const nasdaqData = generateHistoricalData(timeRange, 12000, 0.04);
      const goldData = generateHistoricalData(timeRange, 1800, 0.02);
      
      // Create benchmark objects
      const benchmarkData: PortfolioBenchmark[] = [
        {
          id: "btc",
          name: "Bitcoin",
          symbol: "BTC",
          type: "crypto",
          performance: [5, 8, 12, 9, 15, 20, 18],
          lastUpdated: new Date().toISOString(),
          data: bitcoinData,
          color: "#F7931A"
        },
        {
          id: "eth",
          name: "Ethereum",
          symbol: "ETH",
          type: "crypto",
          performance: [3, 7, 10, 8, 12, 15, 14],
          lastUpdated: new Date().toISOString(),
          data: ethereumData,
          color: "#627EEA"
        },
        {
          id: "sp500",
          name: "S&P 500",
          symbol: "SPX",
          type: "index",
          performance: [2, 4, 6, 5, 7, 8, 9],
          lastUpdated: new Date().toISOString(),
          data: sp500Data,
          color: "#8A2BE2"
        },
        {
          id: "nasdaq",
          name: "NASDAQ",
          symbol: "IXIC",
          type: "index",
          performance: [3, 5, 7, 6, 8, 9, 10],
          lastUpdated: new Date().toISOString(),
          data: nasdaqData,
          color: "#E6007A"
        },
        {
          id: "gold",
          name: "Gold",
          symbol: "XAU",
          type: "index",
          performance: [1, 2, 1, 3, 2, 4, 3],
          lastUpdated: new Date().toISOString(),
          data: goldData,
          color: "#FFD700"
        }
      ];
      
      // Add portfolio as a benchmark
      const portfolioBenchmark: PortfolioBenchmark = {
        id: "portfolio",
        name: "Your Portfolio",
        symbol: "PORT",
        type: "custom",
        performance: [4, 6, 9, 7, 10, 12, 11],
        lastUpdated: new Date().toISOString(),
        data: portfolioPoints,
        color: "#10B981"
      };
      
      setBenchmarks([portfolioBenchmark, ...benchmarkData]);
      setPortfolioData(portfolioPoints);
      setIsLoading(false);
    };
    
    fetchData();
  }, [timeRange]);
  
  const handleBenchmarkToggle = (benchmarkId: string) => {
    setSelectedBenchmarks(prev => {
      if (prev.includes(benchmarkId)) {
        return prev.filter(id => id !== benchmarkId);
      } else {
        return [...prev, benchmarkId];
      }
    });
  };
  
  const getPerformanceText = (benchmarkId: string) => {
    const benchmark = benchmarks.find(b => b.id === benchmarkId);
    if (!benchmark) return "0%";
    
    const data = benchmark.data;
    if (!data || data.length < 2) return "0%";
    
    if (Array.isArray(data) && typeof data[0] === 'object') {
      const firstValue = (data[0] as any).value;
      const lastValue = (data[data.length - 1] as any).value;
      const percentChange = ((lastValue - firstValue) / firstValue) * 100;
      return `${percentChange.toFixed(2)}%`;
    }
    
    return "0%";
  };
  
  const getChartData = () => {
    if (benchmarks.length === 0) return [];
    
    // Find the benchmark with the most data points to use as base
    const baseData = benchmarks.find(b => b.id === "portfolio")?.data || [];
    if (!baseData.length) return [];
    
    // Create a merged dataset for the chart
    return (baseData as any[]).map((point, index) => {
      const dataPoint: any = {
        date: point.date,
      };
      
      // Add data for each selected benchmark
      selectedBenchmarks.forEach(benchmarkId => {
        const benchmark = benchmarks.find(b => b.id === benchmarkId);
        if (benchmark && benchmark.data && benchmark.data[index]) {
          if (typeof benchmark.data[index] === 'object') {
            dataPoint[benchmark.id] = (benchmark.data[index] as any).value;
          } else {
            dataPoint[benchmark.id] = benchmark.data[index];
          }
        }
      });
      
      return dataPoint;
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Portfolio Benchmarking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <Tabs defaultValue="performance" className="w-full max-w-md">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="correlation">Correlation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    variant={timeRange === "1w" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("1w")}
                  >
                    1W
                  </Button>
                  <Button
                    variant={timeRange === "1m" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("1m")}
                  >
                    1M
                  </Button>
                  <Button
                    variant={timeRange === "3m" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("3m")}
                  >
                    3M
                  </Button>
                  <Button
                    variant={timeRange === "6m" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("6m")}
                  >
                    6M
                  </Button>
                  <Button
                    variant={timeRange === "1y" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("1y")}
                  >
                    1Y
                  </Button>
                  <Button
                    variant={timeRange === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("all")}
                  >
                    All
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Add Benchmark" />
                    </SelectTrigger>
                    <SelectContent>
                      {benchmarks
                        .filter(b => !selectedBenchmarks.includes(b.id))
                        .map(benchmark => (
                          <SelectItem 
                            key={benchmark.id} 
                            value={benchmark.id}
                            onClick={() => handleBenchmarkToggle(benchmark.id)}
                          >
                            {benchmark.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedBenchmarks.map(benchmarkId => {
                    const benchmark = benchmarks.find(b => b.id === benchmarkId);
                    if (!benchmark) return null;
                    
                    return (
                      <div 
                        key={benchmark.id}
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-sm border"
                        style={{ borderColor: benchmark.color }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: benchmark.color }}
                        />
                        <span>{benchmark.name}</span>
                        <span className="text-xs">
                          ({getPerformanceText(benchmark.id)})
                        </span>
                        <button 
                          className="ml-1 text-muted-foreground hover:text-foreground"
                          onClick={() => handleBenchmarkToggle(benchmark.id)}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <div className="h-[300px] mt-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <p>Loading chart data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            if (value >= 1000) {
                              return `$${(value / 1000).toFixed(1)}k`;
                            }
                            return `$${value}`;
                          }}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Legend />
                        {selectedBenchmarks.map(benchmarkId => {
                          const benchmark = benchmarks.find(b => b.id === benchmarkId);
                          if (!benchmark) return null;
                          
                          return (
                            <Line
                              key={benchmark.id}
                              type="monotone"
                              dataKey={benchmark.id}
                              name={benchmark.name}
                              stroke={benchmark.color}
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="correlation">
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Correlation analysis will be available in a future update.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
