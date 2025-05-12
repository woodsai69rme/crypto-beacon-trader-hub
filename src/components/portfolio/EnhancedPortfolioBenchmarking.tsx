
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EnhancedPortfolioBenchmarkingProps } from '@/types/trading';

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({
  portfolio,
  benchmarks,
  timeRange,
  onTimeRangeChange
}) => {
  const [activeLines, setActiveLines] = useState<string[]>(
    benchmarks.map(benchmark => benchmark.id)
  );

  const handleToggleBenchmark = (id: string) => {
    if (activeLines.includes(id)) {
      setActiveLines(activeLines.filter(lineId => lineId !== id));
    } else {
      setActiveLines([...activeLines, id]);
    }
  };

  // Calculate portfolio performance data (this would typically come from the backend)
  const portfolioPerformanceData = benchmarks[0]?.data || [];

  // Find the best and worst performing benchmarks
  const getBestWorstPerformers = () => {
    if (benchmarks.length < 2) return { best: null, worst: null };
    
    const latestDataPoints = benchmarks.map(benchmark => {
      const lastPoint = benchmark.data[benchmark.data.length - 1];
      const firstPoint = benchmark.data[0];
      return {
        id: benchmark.id,
        name: benchmark.name,
        performance: (lastPoint.value - firstPoint.value) / firstPoint.value * 100
      };
    });
    
    const sorted = [...latestDataPoints].sort((a, b) => b.performance - a.performance);
    return {
      best: sorted[0],
      worst: sorted[sorted.length - 1]
    };
  };
  
  const { best, worst } = getBestWorstPerformers();

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Portfolio Benchmarking</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            size="sm"
            variant={timeRange === '1w' ? 'default' : 'outline'}
            onClick={() => onTimeRangeChange('1w')}
          >
            1W
          </Button>
          <Button
            size="sm"
            variant={timeRange === '1m' ? 'default' : 'outline'}
            onClick={() => onTimeRangeChange('1m')}
          >
            1M
          </Button>
          <Button
            size="sm"
            variant={timeRange === '3m' ? 'default' : 'outline'}
            onClick={() => onTimeRangeChange('3m')}
          >
            3M
          </Button>
          <Button
            size="sm"
            variant={timeRange === '6m' ? 'default' : 'outline'}
            onClick={() => onTimeRangeChange('6m')}
          >
            6M
          </Button>
          <Button
            size="sm"
            variant={timeRange === '1y' ? 'default' : 'outline'}
            onClick={() => onTimeRangeChange('1y')}
          >
            1Y
          </Button>
          <Button
            size="sm"
            variant={timeRange === 'all' ? 'default' : 'outline'}
            onClick={() => onTimeRangeChange('all')}
          >
            All
          </Button>
        </div>
        
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={portfolioPerformanceData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']}
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
              />
              <Legend />
              
              {benchmarks.map((benchmark) => (
                activeLines.includes(benchmark.id) && (
                  <Line
                    key={benchmark.id}
                    type="monotone"
                    dataKey="value"
                    data={benchmark.data}
                    name={benchmark.name}
                    stroke={benchmark.color}
                    dot={false}
                    strokeWidth={benchmark.id === 'portfolio' ? 2.5 : 1.5}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Performance Comparison</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {benchmarks.map((benchmark) => (
              <Button
                key={benchmark.id}
                variant={activeLines.includes(benchmark.id) ? 'default' : 'outline'}
                className="justify-start h-auto py-2"
                onClick={() => handleToggleBenchmark(benchmark.id)}
              >
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: benchmark.color }} 
                />
                <span className="text-left">{benchmark.name}</span>
              </Button>
            ))}
          </div>
        </div>
        
        {best && worst && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted rounded-md p-3">
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <span className="text-green-500">▲</span> Best Performer
              </h4>
              <p className="font-bold text-lg">{best.name}</p>
              <p className="text-green-500">+{best.performance.toFixed(2)}%</p>
            </div>
            
            <div className="bg-muted rounded-md p-3">
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <span className="text-red-500">▼</span> Worst Performer
              </h4>
              <p className="font-bold text-lg">{worst.name}</p>
              <p className="text-red-500">{worst.performance.toFixed(2)}%</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
