
import React from 'react';

interface PortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
}

const PortfolioBenchmarking: React.FC<PortfolioBenchmarkingProps> = ({ 
  portfolioPerformance, 
  portfolioDates 
}) => {
  // Sample benchmarks data
  const benchmarks = [
    {
      name: "Bitcoin",
      performance: [1.2, 2.1, 0.8, -0.5, 1.7, 3.2, 2.8, -1.2, -0.9, 1.5],
      color: "#F7931A"
    },
    {
      name: "S&P 500",
      performance: [0.5, 0.7, 0.2, 0.3, -0.1, 0.4, 0.6, 0.8, 0.3, 0.5],
      color: "#0F6FFF"
    },
    {
      name: "Gold",
      performance: [0.3, -0.2, 0.5, 0.4, 0.6, 0.2, -0.3, 0.1, 0.4, 0.2],
      color: "#FFD700"
    }
  ];

  // Calculate cumulative returns for prettier visualization
  const calculateCumulativeReturns = (returns: number[]) => {
    let cumulative = 100; // Start with base 100
    return returns.map(ret => {
      cumulative = cumulative * (1 + ret/100);
      return cumulative;
    });
  };

  // Portfolio cumulative performance
  const portfolioCumulative = calculateCumulativeReturns(portfolioPerformance);
  
  // Benchmark cumulative performances
  const benchmarksCumulative = benchmarks.map(benchmark => ({
    ...benchmark,
    cumulativePerformance: calculateCumulativeReturns(benchmark.performance)
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Portfolio vs Market Benchmarks</h3>
      </div>
      
      <div className="bg-muted h-64 rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">Performance comparison chart would render here</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span className="text-sm">Your Portfolio</span>
            </div>
            {benchmarks.map((benchmark, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: benchmark.color }}
                ></div>
                <span className="text-sm">{benchmark.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Performance (Last 30 Days)</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Your Portfolio</span>
              <span className={`text-sm font-medium ${
                portfolioPerformance.reduce((a, b) => a + b, 0) > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {portfolioPerformance.reduce((a, b) => a + b, 0).toFixed(2)}%
              </span>
            </div>
            {benchmarks.map((benchmark, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm">{benchmark.name}</span>
                <span className={`text-sm font-medium ${
                  benchmark.performance.reduce((a, b) => a + b, 0) > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {benchmark.performance.reduce((a, b) => a + b, 0).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="pt-4 text-xs text-muted-foreground">
        <p>Past performance is not indicative of future results. This comparison is for informational purposes only.</p>
      </div>
    </div>
  );
};

export default PortfolioBenchmarking;
