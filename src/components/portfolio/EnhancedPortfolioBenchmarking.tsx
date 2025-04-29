
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PortfolioBenchmark } from '@/types/trading';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Settings2 } from 'lucide-react';

// Sample data
const generateHistoricalData = (days: number, volatility: number, trend: number) => {
  const data = [];
  let value = 100;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random walk with trend
    const change = (Math.random() - 0.5) * volatility + trend;
    value = value * (1 + change / 100);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value,
      performance: value - 100,
    });
  }
  
  return data;
};

// Sample benchmarks with historical performance
const benchmarks: PortfolioBenchmark[] = [
  {
    id: "portfolio",
    name: "Your Portfolio",
    symbol: "PORTFOLIO",
    type: "custom",
    color: "#4f46e5",
    performance: 15.3,
    lastUpdated: new Date().toISOString(),
    data: generateHistoricalData(90, 2, 0.2)
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    type: "crypto",
    color: "#f7931a",
    performance: 24.7,
    lastUpdated: new Date().toISOString(),
    data: generateHistoricalData(90, 3, 0.3)
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    type: "crypto",
    color: "#62688f",
    performance: 19.2,
    lastUpdated: new Date().toISOString(),
    data: generateHistoricalData(90, 3.5, 0.25)
  },
  {
    id: "sp500",
    name: "S&P 500",
    symbol: "SPX",
    type: "index",
    color: "#0088cc",
    performance: 8.5,
    lastUpdated: new Date().toISOString(),
    data: generateHistoricalData(90, 1, 0.1)
  },
  {
    id: "nasdaq",
    name: "NASDAQ",
    symbol: "NDAQ",
    type: "index",
    color: "#990000",
    performance: 10.2,
    lastUpdated: new Date().toISOString(),
    data: generateHistoricalData(90, 1.5, 0.15)
  },
  {
    id: "gold",
    name: "Gold",
    symbol: "XAU",
    type: "index",
    color: "#FFD700",
    performance: 5.8,
    lastUpdated: new Date().toISOString(),
    data: generateHistoricalData(90, 0.8, 0.06)
  }
];

const EnhancedPortfolioBenchmarking = () => {
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<string[]>(["portfolio", "bitcoin", "sp500"]);
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [chartData, setChartData] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  
  // Process chart data based on selected benchmarks and time range
  useEffect(() => {
    const daysToShow = timeRange === "7d" ? 7 : 
                       timeRange === "30d" ? 30 : 
                       timeRange === "90d" ? 90 : 
                       365;
    
    const filteredBenchmarks = benchmarks.filter(b => selectedBenchmarks.includes(b.id));
    
    // Get data points for the selected time range
    const allDates = new Set<string>();
    filteredBenchmarks.forEach(benchmark => {
      const recentData = benchmark.data.slice(-daysToShow);
      recentData.forEach(d => allDates.add(d.date));
    });
    
    const dates = Array.from(allDates).sort();
    
    const processedData = dates.map(date => {
      const dataPoint: any = { date };
      
      filteredBenchmarks.forEach(benchmark => {
        const matchingDataPoint = benchmark.data.find(d => d.date === date);
        if (matchingDataPoint) {
          dataPoint[benchmark.id] = matchingDataPoint.performance;
        }
      });
      
      return dataPoint;
    });
    
    setChartData(processedData);
  }, [selectedBenchmarks, timeRange]);
  
  const toggleBenchmark = (id: string) => {
    if (selectedBenchmarks.includes(id)) {
      setSelectedBenchmarks(selectedBenchmarks.filter(b => b !== id));
    } else {
      if (selectedBenchmarks.length < 5) { // Limit to 5 benchmarks for readability
        setSelectedBenchmarks([...selectedBenchmarks, id]);
      }
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Portfolio Benchmarking</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className={showSettings ? "bg-secondary" : ""}
          >
            <Settings2 className="h-4 w-4" />
          </Button>
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList className="grid grid-cols-4 h-8">
              <TabsTrigger value="7d" className="text-xs">7D</TabsTrigger>
              <TabsTrigger value="30d" className="text-xs">30D</TabsTrigger>
              <TabsTrigger value="90d" className="text-xs">90D</TabsTrigger>
              <TabsTrigger value="1y" className="text-xs">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        {showSettings && (
          <div className="mb-4 p-3 border rounded-md bg-muted/40">
            <p className="text-sm font-medium mb-2">Select Benchmarks (max 5)</p>
            <div className="flex flex-wrap gap-2">
              {benchmarks.map((benchmark) => (
                <Button
                  key={benchmark.id}
                  variant={selectedBenchmarks.includes(benchmark.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleBenchmark(benchmark.id)}
                  className="text-xs"
                  style={{
                    borderColor: selectedBenchmarks.includes(benchmark.id) ? benchmark.color : undefined,
                    background: selectedBenchmarks.includes(benchmark.id) ? benchmark.color : undefined,
                    opacity: selectedBenchmarks.includes(benchmark.id) ? 1 : 0.7
                  }}
                >
                  {benchmark.symbol}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickMargin={10}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                }}
                minTickGap={30}
              />
              <YAxis 
                tickFormatter={(value) => `${value.toFixed(1)}%`}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip 
                formatter={(value) => [`${parseFloat(value as string).toFixed(2)}%`, ""]}
                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
              />
              <Legend />
              {benchmarks
                .filter(benchmark => selectedBenchmarks.includes(benchmark.id))
                .map((benchmark) => (
                  <Line
                    key={benchmark.id}
                    type="monotone"
                    dataKey={benchmark.id}
                    name={benchmark.name}
                    stroke={benchmark.color}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
          {benchmarks
            .filter(benchmark => selectedBenchmarks.includes(benchmark.id))
            .map((benchmark) => (
              <div 
                key={benchmark.id} 
                className="border rounded-md p-2 text-sm flex flex-col"
                style={{ borderLeftColor: benchmark.color, borderLeftWidth: 3 }}
              >
                <div className="font-medium">{benchmark.name}</div>
                <div className={benchmark.performance >= 0 ? "text-green-500" : "text-red-500"}>
                  {benchmark.performance >= 0 ? "+" : ""}
                  {benchmark.performance.toFixed(2)}%
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
