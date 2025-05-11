
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedPortfolioBenchmarkingProps } from "@/types/trading";

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({
  portfolioPerformance,
  portfolioDates,
  daily = 0,
  weekly = 0,
  monthly = 0,
  yearly = 0,
  allTime = 0
}) => {
  // This function safely gets a metric value regardless of whether portfolioPerformance
  // is an object or we're using the direct props
  const getMetric = (metric: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'allTime'): number => {
    if (!portfolioPerformance || Array.isArray(portfolioPerformance)) {
      // If no portfolio performance data or it's an array, use the direct props
      switch (metric) {
        case 'daily': return daily;
        case 'weekly': return weekly;
        case 'monthly': return monthly;
        case 'yearly': return yearly;
        case 'allTime': return allTime;
        default: return 0;
      }
    } else {
      // Handle object case
      return portfolioPerformance[metric] || 0;
    }
  };

  // Get performance metrics safely
  const dailyPerformance = getMetric('daily');
  const weeklyPerformance = getMetric('weekly');
  const monthlyPerformance = getMetric('monthly');
  const yearlyPerformance = getMetric('yearly');
  const allTimePerformance = getMetric('allTime');
  
  // Helper function to add +/- sign and color
  const formatPerformance = (value: number): { text: string, color: string } => {
    const text = value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
    const color = value >= 0 ? 'text-green-600' : 'text-red-600';
    return { text, color };
  };
  
  // Format all performance metrics
  const dailyFormatted = formatPerformance(dailyPerformance);
  const weeklyFormatted = formatPerformance(weeklyPerformance);
  const monthlyFormatted = formatPerformance(monthlyPerformance);
  const yearlyFormatted = formatPerformance(yearlyPerformance);
  const allTimeFormatted = formatPerformance(allTimePerformance);
  
  // Mock data for benchmarks - these would normally come from API/props
  const benchmarks = [
    { name: 'S&P 500', daily: -0.2, weekly: 0.8, monthly: 2.5, yearly: 15.6, allTime: 210.5 },
    { name: 'Nasdaq', daily: -0.4, weekly: 1.2, monthly: 3.1, yearly: 18.9, allTime: 285.2 },
    { name: 'Bitcoin', daily: 1.5, weekly: -3.2, monthly: 12.8, yearly: 45.7, allTime: 540.3 }
  ];
  
  return (
    <Card className="w-full">
      <CardContent className="p-5">
        <h3 className="text-lg font-medium mb-4">Portfolio Benchmarking</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Daily</div>
            <div className={`text-lg font-semibold ${dailyFormatted.color}`}>
              {dailyFormatted.text}
            </div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Weekly</div>
            <div className={`text-lg font-semibold ${weeklyFormatted.color}`}>
              {weeklyFormatted.text}
            </div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Monthly</div>
            <div className={`text-lg font-semibold ${monthlyFormatted.color}`}>
              {monthlyFormatted.text}
            </div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Yearly</div>
            <div className={`text-lg font-semibold ${yearlyFormatted.color}`}>
              {yearlyFormatted.text}
            </div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">All Time</div>
            <div className={`text-lg font-semibold ${allTimeFormatted.color}`}>
              {allTimeFormatted.text}
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="comparison">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="comparison">Benchmark Comparison</TabsTrigger>
            <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comparison" className="mt-4">
            <div className="space-y-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Benchmark</th>
                    <th className="text-right pb-2">Daily</th>
                    <th className="text-right pb-2">Monthly</th>
                    <th className="text-right pb-2">Yearly</th>
                    <th className="text-right pb-2">Relative Performance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 font-medium">Your Portfolio</td>
                    <td className={`text-right ${dailyFormatted.color}`}>
                      {dailyFormatted.text}
                    </td>
                    <td className={`text-right ${monthlyFormatted.color}`}>
                      {monthlyFormatted.text}
                    </td>
                    <td className={`text-right ${yearlyFormatted.color}`}>
                      {yearlyFormatted.text}
                    </td>
                    <td className="text-right">—</td>
                  </tr>
                  
                  {benchmarks.map((benchmark) => {
                    const dailyDiff = dailyPerformance - benchmark.daily;
                    const monthlyDiff = monthlyPerformance - benchmark.monthly;
                    const yearlyDiff = yearlyPerformance - benchmark.yearly;
                    
                    const dailyDiffFormatted = formatPerformance(dailyDiff);
                    const monthlyDiffFormatted = formatPerformance(monthlyDiff);
                    const yearlyDiffFormatted = formatPerformance(yearlyDiff);
                    
                    return (
                      <tr key={benchmark.name} className="border-b">
                        <td className="py-3">{benchmark.name}</td>
                        <td className={`text-right ${formatPerformance(benchmark.daily).color}`}>
                          {formatPerformance(benchmark.daily).text}
                        </td>
                        <td className={`text-right ${formatPerformance(benchmark.monthly).color}`}>
                          {formatPerformance(benchmark.monthly).text}
                        </td>
                        <td className={`text-right ${formatPerformance(benchmark.yearly).color}`}>
                          {formatPerformance(benchmark.yearly).text}
                        </td>
                        <td className={`text-right ${yearlyDiffFormatted.color}`}>
                          {yearlyDiffFormatted.text}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium mb-2">Portfolio Alpha</h4>
                  <div className="flex justify-between">
                    <span>vs. S&P 500</span>
                    <span className={formatPerformance(yearlyPerformance - benchmarks[0].yearly).color}>
                      {formatPerformance(yearlyPerformance - benchmarks[0].yearly).text}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>vs. Crypto Index</span>
                    <span className={formatPerformance(yearlyPerformance - benchmarks[2].yearly).color}>
                      {formatPerformance(yearlyPerformance - benchmarks[2].yearly).text}
                    </span>
                  </div>
                </div>
                
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium mb-2">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                      <div className="font-medium">1.2</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Max Drawdown</div>
                      <div className="font-medium">-15.4%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Sortino Ratio</div>
                      <div className="font-medium">1.5</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Volatility</div>
                      <div className="font-medium">22.8%</div>
                    </div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium mb-2">Correlation Analysis</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm text-muted-foreground">S&P 500 Correlation</div>
                      <div className="font-medium">0.45</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Bitcoin Correlation</div>
                      <div className="font-medium">0.78</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
