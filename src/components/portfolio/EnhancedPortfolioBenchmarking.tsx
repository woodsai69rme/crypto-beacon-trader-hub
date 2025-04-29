
import React from 'react';
import { EnhancedPortfolioBenchmarkingProps } from '@/types/trading';

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({
  portfolioPerformance,
  portfolioDates
}) => {
  // Sample benchmark data for comparison
  const benchmarks = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      performance: [1.2, 2.1, 0.8, -0.5, 1.7, 3.2, 2.8, -1.2, -0.9, 1.5],
      color: "#F7931A"
    },
    {
      name: "S&P 500",
      symbol: "SPX",
      performance: [0.5, 0.7, 0.2, 0.3, -0.1, 0.4, 0.6, 0.8, 0.3, 0.5],
      color: "#0F6FFF"
    },
    {
      name: "Gold",
      symbol: "XAU",
      performance: [0.3, -0.2, 0.5, 0.4, 0.6, 0.2, -0.3, 0.1, 0.4, 0.2],
      color: "#FFD700"
    }
  ];

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Portfolio Performance vs Benchmarks</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          {benchmarks.map((benchmark) => (
            <div key={benchmark.symbol} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: benchmark.color }}></div>
              <span className="text-sm">{benchmark.name}</span>
            </div>
          ))}
        </div>
        <div className="bg-muted rounded-lg h-64 w-full flex items-center justify-center">
          <p className="text-muted-foreground">Performance chart visualization would render here</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPortfolioBenchmarking;
