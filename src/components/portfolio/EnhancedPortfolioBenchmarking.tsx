
import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, Bar } from "recharts";
import { BarChart4, ArrowUp, ArrowDown, Download, Share2, Calendar } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { PortfolioBenchmark } from "@/types/trading";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";

interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
  className?: string;
}

const EnhancedPortfolioBenchmarking = ({ 
  portfolioPerformance, 
  portfolioDates,
  className 
}: EnhancedPortfolioBenchmarkingProps) => {
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<string[]>(["btc", "eth"]);
  const [timeframe, setTimeframe] = useState<string>("1M");
  const [chartType, setChartType] = useState<string>("line");
  const { formatValue, activeCurrency } = useCurrencyConverter();

  // Demo benchmark data - in a real app, this would come from an API
  const benchmarks: PortfolioBenchmark[] = [
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      type: "crypto",
      data: portfolioDates.map((date, i) => ({
        date,
        value: 0,
        performance: [0, 3.2, 5.1, 2.3, 8.7, 15.2, 12.1, 9.8, 14.3, 18.7, 22.1, 19.8][i] || 0
      })),
      color: "#F7931A"
    },
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      type: "crypto",
      data: portfolioDates.map((date, i) => ({
        date,
        value: 0,
        performance: [0, 2.7, 4.3, 7.8, 12.3, 9.8, 5.6, 8.9, 13.4, 15.8, 14.3, 18.9][i] || 0
      })),
      color: "#627EEA"
    },
    {
      id: "sp500",
      name: "S&P 500",
      symbol: "SPX",
      type: "index",
      data: portfolioDates.map((date, i) => ({
        date,
        value: 0,
        performance: [0, 1.2, 2.4, 3.1, 2.8, 3.5, 4.2, 3.8, 4.5, 5.2, 6.1, 7.3][i] || 0
      })),
      color: "#0077B5"
    },
    {
      id: "gold",
      name: "Gold",
      symbol: "XAU",
      type: "index",
      data: portfolioDates.map((date, i) => ({
        date,
        value: 0,
        performance: [0, 0.8, 1.5, 2.1, 1.9, 2.5, 3.2, 4.1, 3.5, 2.8, 3.9, 4.7][i] || 0
      })),
      color: "#D4AF37"
    },
    {
      id: "nasdaq",
      name: "NASDAQ",
      symbol: "NDX",
      type: "index",
      data: portfolioDates.map((date, i) => ({
        date,
        value: 0,
        performance: [0, 1.5, 3.2, 2.8, 5.6, 7.8, 6.9, 8.1, 10.2, 9.5, 11.3, 13.7][i] || 0
      })),
      color: "#C71585"
    }
  ];

  const chartData = useMemo(() => {
    return portfolioDates.map((date, i) => {
      const point: any = { date };
      point.portfolio = portfolioPerformance[i];
      
      selectedBenchmarks.forEach(benchmarkId => {
        const benchmark = benchmarks.find(b => b.id === benchmarkId);
        if (benchmark) {
          point[benchmarkId] = benchmark.data[i]?.performance || 0;
        }
      });
      
      return point;
    });
  }, [portfolioDates, portfolioPerformance, selectedBenchmarks, benchmarks]);

  const toggleBenchmark = (benchmarkId: string) => {
    if (selectedBenchmarks.includes(benchmarkId)) {
      setSelectedBenchmarks(selectedBenchmarks.filter(id => id !== benchmarkId));
    } else {
      setSelectedBenchmarks([...selectedBenchmarks, benchmarkId]);
    }
  };
  
  const performanceMetrics = useMemo(() => {
    // In a real app, these metrics would be calculated based on actual data
    // This is just for demonstration purposes
    
    const lastIndex = portfolioPerformance.length - 1;
    const currentPerformance = portfolioPerformance[lastIndex] || 0;
    
    const benchmarkData = benchmarks.reduce((acc, benchmark) => {
      const lastDataPoint = benchmark.data[lastIndex];
      acc[benchmark.id] = lastDataPoint?.performance || 0;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      currentPerformance,
      vsStart: currentPerformance,
      vsBtc: currentPerformance - (benchmarkData.btc || 0),
      vsEth: currentPerformance - (benchmarkData.eth || 0),
      vsSP500: currentPerformance - (benchmarkData.sp500 || 0),
      vsGold: currentPerformance - (benchmarkData.gold || 0)
    };
  }, [portfolioPerformance, benchmarks]);
  
  // Generate timeframe options
  const timeframeOptions = [
    { value: "1W", label: "1 Week" },
    { value: "1M", label: "1 Month" },
    { value: "3M", label: "3 Months" },
    { value: "6M", label: "6 Months" },
    { value: "1Y", label: "1 Year" },
    { value: "MAX", label: "All Time" }
  ];
  
  const exportChartData = () => {
    // Create CSV data
    const headers = ['Date', 'Portfolio', ...selectedBenchmarks.map(id => {
      const benchmark = benchmarks.find(b => b.id === id);
      return benchmark ? benchmark.name : id;
    })];
    
    const rows = chartData.map(point => {
      return [
        point.date,
        point.portfolio.toFixed(2),
        ...selectedBenchmarks.map(id => (point[id] || 0).toFixed(2))
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `portfolio-benchmarking-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Data Exported",
      description: "Portfolio benchmarking data has been downloaded as CSV"
    });
  };
  
  const shareBenchmarkResults = () => {
    // Generate a shareable message
    const message = `My portfolio is outperforming Bitcoin by ${performanceMetrics.vsBtc.toFixed(2)}% and the S&P 500 by ${performanceMetrics.vsSP500.toFixed(2)}%! 📈 #CryptoTrading`;
    
    // In a real app, this would open a sharing dialog
    toast({
      title: "Share Results",
      description: "Social sharing feature not yet implemented. Message copied to clipboard."
    });
    
    // Copy to clipboard as fallback
    navigator.clipboard.writeText(message).then(() => {
      console.log('Message copied to clipboard');
    });
  };

  const renderPerformanceValueWithColor = (value: number) => {
    const textColor = value >= 0 ? "text-green-600" : "text-red-600";
    const Icon = value >= 0 ? ArrowUp : ArrowDown;
    
    return (
      <div className={`flex items-center ${textColor}`}>
        <Icon className="h-4 w-4 mr-1" />
        <span className="font-medium">{value.toFixed(2)}%</span>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart4 className="h-5 w-5" />
              Portfolio Benchmarking
            </CardTitle>
            <CardDescription>
              Compare your portfolio performance against major market benchmarks
            </CardDescription>
          </div>
          
          <div className="flex space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[120px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                {timeframeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/40 p-3 rounded-md border">
              <div className="text-sm text-muted-foreground">Performance</div>
              {renderPerformanceValueWithColor(performanceMetrics.currentPerformance)}
            </div>
            <div className="bg-muted/40 p-3 rounded-md border">
              <div className="text-sm text-muted-foreground">vs Bitcoin</div>
              {renderPerformanceValueWithColor(performanceMetrics.vsBtc)}
            </div>
            <div className="bg-muted/40 p-3 rounded-md border">
              <div className="text-sm text-muted-foreground">vs S&P 500</div>
              {renderPerformanceValueWithColor(performanceMetrics.vsSP500)}
            </div>
            <div className="bg-muted/40 p-3 rounded-md border">
              <div className="text-sm text-muted-foreground">vs Gold</div>
              {renderPerformanceValueWithColor(performanceMetrics.vsGold)}
            </div>
          </div>
          
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  variant={chartType === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("line")}
                >
                  Line
                </Button>
                <Button
                  variant={chartType === "area" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("area")}
                >
                  Area
                </Button>
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("bar")}
                >
                  Bar
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {benchmarks.map((benchmark) => (
                  <button
                    key={benchmark.id}
                    onClick={() => toggleBenchmark(benchmark.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${selectedBenchmarks.includes(benchmark.id)
                      ? `bg-[${benchmark.color}] text-white`
                      : "bg-muted text-muted-foreground"}`}
                    style={{ backgroundColor: selectedBenchmarks.includes(benchmark.id) ? benchmark.color : undefined }}
                  >
                    {benchmark.name}
                  </button>
                ))}
              </div>
              
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "bar" ? (
                    <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(2)}%`, ""]} 
                        labelFormatter={(value) => `Date: ${value}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="portfolio" 
                        name="Your Portfolio" 
                        fill="#10b981" 
                        barSize={20} 
                      />
                      {selectedBenchmarks.map((benchmarkId) => {
                        const benchmark = benchmarks.find(b => b.id === benchmarkId);
                        return benchmark ? (
                          <Bar 
                            key={benchmark.id}
                            dataKey={benchmark.id} 
                            name={benchmark.name} 
                            fill={benchmark.color} 
                            barSize={20} 
                          />
                        ) : null;
                      })}
                    </ComposedChart>
                  ) : chartType === "area" ? (
                    <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(2)}%`, ""]} 
                        labelFormatter={(value) => `Date: ${value}`}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="portfolio" 
                        name="Your Portfolio" 
                        fill="#10b981" 
                        stroke="#10b981"
                        fillOpacity={0.3}
                      />
                      {selectedBenchmarks.map((benchmarkId) => {
                        const benchmark = benchmarks.find(b => b.id === benchmarkId);
                        return benchmark ? (
                          <Area 
                            key={benchmark.id}
                            type="monotone" 
                            dataKey={benchmark.id} 
                            name={benchmark.name} 
                            fill={benchmark.color} 
                            stroke={benchmark.color}
                            fillOpacity={0.3}
                          />
                        ) : null;
                      })}
                    </ComposedChart>
                  ) : (
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
                        strokeWidth={3}
                        activeDot={{ r: 8 }} 
                      />
                      {selectedBenchmarks.map((benchmarkId) => {
                        const benchmark = benchmarks.find(b => b.id === benchmarkId);
                        return benchmark ? (
                          <Line 
                            key={benchmark.id}
                            type="monotone" 
                            dataKey={benchmark.id} 
                            name={benchmark.name} 
                            stroke={benchmark.color} 
                            strokeWidth={2}
                          />
                        ) : null;
                      })}
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="compare">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Performance Leaders</h3>
                    <div className="space-y-3">
                      {[...benchmarks, { id: 'portfolio', name: 'Your Portfolio', color: '#10b981', type: 'custom' } as PortfolioBenchmark]
                        .sort((a, b) => {
                          const aVal = a.id === 'portfolio' 
                            ? performanceMetrics.currentPerformance 
                            : (a.data[a.data.length - 1]?.performance || 0);
                          
                          const bVal = b.id === 'portfolio' 
                            ? performanceMetrics.currentPerformance 
                            : (b.data[b.data.length - 1]?.performance || 0);
                            
                          return bVal - aVal;
                        })
                        .slice(0, 5)
                        .map((item, index) => {
                          const performance = item.id === 'portfolio' 
                            ? performanceMetrics.currentPerformance 
                            : (item.data[item.data.length - 1]?.performance || 0);
                            
                          return (
                            <div key={item.id} className="flex items-center justify-between p-2 border-b last:border-0">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-muted text-xs">
                                  {index + 1}
                                </div>
                                <span>{item.name}</span>
                              </div>
                              {renderPerformanceValueWithColor(performance)}
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Asset Class Performance</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Cryptocurrencies</div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <div>+15.4%</div>
                          <div className="text-muted-foreground">YTD</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Stock Market</div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <div>+7.3%</div>
                          <div className="text-muted-foreground">YTD</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Precious Metals</div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '20%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <div>+4.7%</div>
                          <div className="text-muted-foreground">YTD</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Your Portfolio</div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ 
                            width: `${Math.min(100, Math.max(1, performanceMetrics.currentPerformance * 2))}%` 
                          }}></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <div>{performanceMetrics.currentPerformance.toFixed(2)}%</div>
                          <div className="text-muted-foreground">YTD</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analysis">
              <div className="space-y-4">
                <div className="bg-muted/40 p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-2">Performance Analysis</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      Your portfolio has {performanceMetrics.currentPerformance > 0 ? "outperformed" : "underperformed"} the market
                      average by {Math.abs(performanceMetrics.vsSP500).toFixed(2)}% during this period.
                    </p>
                    <p>
                      Compared to Bitcoin, you are {performanceMetrics.vsBtc > 0 ? "ahead" : "behind"} by
                      {Math.abs(performanceMetrics.vsBtc).toFixed(2)}%.
                    </p>
                    <p>
                      Your risk-adjusted return (Sharpe ratio) is estimated at 1.45, which is 
                      {performanceMetrics.currentPerformance > performanceMetrics.vsBtc ? "better" : "worse"} than 
                      most benchmark cryptocurrencies.
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-2">Correlation Analysis</h3>
                  <div className="text-sm space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">Portfolio to Bitcoin</div>
                        <div className="text-muted-foreground">Strong positive correlation</div>
                      </div>
                      <div className="text-lg font-bold">0.82</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">Portfolio to S&P 500</div>
                        <div className="text-muted-foreground">Moderate positive correlation</div>
                      </div>
                      <div className="text-lg font-bold">0.45</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">Portfolio to Gold</div>
                        <div className="text-muted-foreground">Low correlation</div>
                      </div>
                      <div className="text-lg font-bold">0.12</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" onClick={exportChartData}>
          <Download className="h-4 w-4 mr-2" /> Export Data
        </Button>
        <Button variant="outline" size="sm" onClick={shareBenchmarkResults}>
          <Share2 className="h-4 w-4 mr-2" /> Share Results
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
