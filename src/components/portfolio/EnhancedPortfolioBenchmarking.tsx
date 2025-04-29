
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EnhancedPortfolioBenchmarkingProps } from '@/types/trading';

const benchmarkIndices = {
  "BTC": {
    color: "#F7931A",
    data: [10, 12, 15, 14, 20, 18, 17, 22, 24, 23, 21, 25]
  },
  "ETH": {
    color: "#62688F",
    data: [5, 7, 6, 8, 10, 11, 15, 18, 16, 19, 17, 20]
  },
  "S&P500": {
    color: "#0066CC",
    data: [5, 5.2, 5.5, 5.7, 6, 6.1, 6.3, 6.2, 6.5, 6.8, 7, 7.2]
  },
  "Gold": {
    color: "#FFD700",
    data: [8, 8.2, 8.1, 8.3, 8.5, 8.4, 8.6, 8.7, 8.9, 9.0, 9.1, 9.2]
  }
};

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({ 
  portfolioPerformance,
  portfolioDates
}) => {
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<string[]>(["BTC", "S&P500"]);
  const [timerange, setTimerange] = useState<string>("6m");

  // If no portfolio data is provided, use sample data
  const defaultPortfolioPerformance = [5, 8, 7, 10, 12, 15, 13, 18, 20, 19, 21, 22];
  const defaultDates = [
    "2023-01-01", "2023-02-01", "2023-03-01", "2023-04-01", "2023-05-01", "2023-06-01",
    "2023-07-01", "2023-08-01", "2023-09-01", "2023-10-01", "2023-11-01", "2023-12-01"
  ];

  const performance = portfolioPerformance || defaultPortfolioPerformance;
  const dates = portfolioDates || defaultDates;

  // Generate chart data
  const chartData = dates.map((date, index) => {
    const dataPoint: any = { date };
    dataPoint.Portfolio = performance[index];

    // Add selected benchmarks
    selectedBenchmarks.forEach(benchmark => {
      dataPoint[benchmark] = benchmarkIndices[benchmark as keyof typeof benchmarkIndices].data[index];
    });

    return dataPoint;
  });

  // Filter chart data based on timerange
  const filterChartDataByTimerange = (data: any[]) => {
    switch (timerange) {
      case "1m":
        return data.slice(-1);
      case "3m":
        return data.slice(-3);
      case "6m":
        return data.slice(-6);
      case "1y":
        return data;
      default:
        return data;
    }
  };

  const filteredChartData = filterChartDataByTimerange(chartData);

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
            <CardTitle className="text-lg">Performance Benchmarking</CardTitle>
            <CardDescription>Compare your portfolio against market benchmarks</CardDescription>
          </div>
          <Select value={timerange} onValueChange={setTimerange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timerange" />
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
        <div className="space-y-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
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
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, '']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Portfolio" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                {selectedBenchmarks.map(benchmark => (
                  <Line 
                    key={benchmark}
                    type="monotone" 
                    dataKey={benchmark}
                    stroke={benchmarkIndices[benchmark as keyof typeof benchmarkIndices].color} 
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(benchmarkIndices).map(([name, { color }]) => (
              <button
                key={name}
                className={`text-xs py-1 px-3 rounded-full border transition-colors ${
                  selectedBenchmarks.includes(name) 
                    ? 'bg-primary text-primary-foreground border-transparent' 
                    : 'bg-transparent border-border text-muted-foreground hover:border-primary'
                }`}
                onClick={() => toggleBenchmark(name)}
              >
                <div className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-1.5" 
                    style={{ backgroundColor: color }} 
                  />
                  {name}
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground">Current Return</div>
              <div className="text-lg font-medium text-green-500">
                +{performance[performance.length - 1]}%
              </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground">vs. BTC</div>
              <div className={`text-lg font-medium ${
                performance[performance.length - 1] >= benchmarkIndices.BTC.data[benchmarkIndices.BTC.data.length - 1] 
                  ? 'text-green-500' : 'text-red-500'
              }`}>
                {(performance[performance.length - 1] - benchmarkIndices.BTC.data[benchmarkIndices.BTC.data.length - 1]).toFixed(2)}%
              </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground">vs. S&P500</div>
              <div className={`text-lg font-medium ${
                performance[performance.length - 1] >= benchmarkIndices["S&P500"].data[benchmarkIndices["S&P500"].data.length - 1] 
                  ? 'text-green-500' : 'text-red-500'
              }`}>
                {(performance[performance.length - 1] - benchmarkIndices["S&P500"].data[benchmarkIndices["S&P500"].data.length - 1]).toFixed(2)}%
              </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground">Outperforming</div>
              <div className="text-lg font-medium">
                {Object.keys(benchmarkIndices).filter(
                  key => performance[performance.length - 1] > benchmarkIndices[key as keyof typeof benchmarkIndices].data[benchmarkIndices[key as keyof typeof benchmarkIndices].data.length - 1]
                ).length} / {Object.keys(benchmarkIndices).length}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
