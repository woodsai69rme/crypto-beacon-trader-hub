
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { EnhancedPortfolioBenchmarkingProps } from '@/types/trading';

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({
  portfolioData,
  benchmarks = ["BTC", "ETH", "S&P500", "Gold"],
  timeframe = "30d",
  portfolioPerformance = [],
  portfolioDates = []
}) => {
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<string[]>(["BTC"]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe);
  const [chartData, setChartData] = useState<any[]>([]);

  // Generate mock data for demonstration
  useEffect(() => {
    const dates = portfolioDates.length > 0 ? portfolioDates : generateDates(30);
    const performance = portfolioPerformance.length > 0 ? portfolioPerformance : generatePerformanceData(30, 5, 15);
    
    const data = dates.map((date, index) => {
      const dataPoint: any = {
        date,
        portfolio: performance[index],
      };
      
      // Add data for selected benchmarks
      selectedBenchmarks.forEach(benchmark => {
        dataPoint[benchmark] = generatePerformanceData(1, -10, 20)[0];
      });
      
      return dataPoint;
    });
    
    setChartData(data);
  }, [selectedBenchmarks, selectedTimeframe, portfolioPerformance, portfolioDates]);

  const generateDates = (days: number) => {
    const dates = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const generatePerformanceData = (length: number, min: number, max: number) => {
    return Array(length).fill(0).map(() => Math.random() * (max - min) + min);
  };

  const toggleBenchmark = (benchmark: string) => {
    if (selectedBenchmarks.includes(benchmark)) {
      setSelectedBenchmarks(selectedBenchmarks.filter(b => b !== benchmark));
    } else {
      setSelectedBenchmarks([...selectedBenchmarks, benchmark]);
    }
  };

  const colors = {
    portfolio: "#3b82f6", // blue
    BTC: "#f59e0b", // amber
    ETH: "#10b981", // emerald
    "S&P500": "#6366f1", // indigo
    Gold: "#f97316", // orange
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance Benchmarking</CardTitle>
        <CardDescription>Compare your portfolio performance against major benchmarks</CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Select defaultValue={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="180d">180 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="max">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex flex-wrap gap-1">
            {benchmarks.map(benchmark => (
              <button
                key={benchmark}
                onClick={() => toggleBenchmark(benchmark)}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  selectedBenchmarks.includes(benchmark)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {benchmark}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `${value.toFixed(2)}%`} />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="portfolio"
                name="Your Portfolio"
                stroke={colors.portfolio}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              {selectedBenchmarks.map(benchmark => (
                <Line
                  key={benchmark}
                  type="monotone"
                  dataKey={benchmark}
                  name={benchmark}
                  stroke={colors[benchmark as keyof typeof colors] || "#888888"}
                  strokeWidth={1.5}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-card border rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Your Portfolio</div>
            <div className="text-lg font-semibold text-blue-500">+8.45%</div>
          </div>
          
          {selectedBenchmarks.map(benchmark => {
            // Generate a random percentage between -10 and +30
            const randomPercent = (Math.random() * 40 - 10).toFixed(2);
            const isPositive = parseFloat(randomPercent) > 0;
            
            return (
              <div key={benchmark} className="bg-card border rounded-lg p-3">
                <div className="text-xs text-muted-foreground">{benchmark}</div>
                <div className={`text-lg font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? '+' : ''}{randomPercent}%
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
