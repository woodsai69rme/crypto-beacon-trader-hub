
import React from "react";
import { EnhancedPortfolioBenchmarkingProps } from "@/types/trading";

const PortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({
  portfolioPerformance,
  portfolioDates
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Portfolio Performance vs. Benchmarks</h3>
        <div className="bg-muted rounded-lg p-4 h-64 flex items-center justify-center">
          <p className="text-muted-foreground">
            Portfolio benchmark chart would render here
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Your Performance</div>
          <div className="text-2xl font-semibold">
            +{(portfolioPerformance.reduce((a, b) => a + b, 0) / portfolioPerformance.length).toFixed(2)}%
          </div>
          <div className="text-sm text-muted-foreground">Overall</div>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">vs. S&P 500</div>
          <div className="text-2xl font-semibold text-green-500">
            +1.23%
          </div>
          <div className="text-sm text-muted-foreground">Outperforming</div>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">vs. BTC</div>
          <div className="text-2xl font-semibold text-red-500">
            -2.45%
          </div>
          <div className="text-sm text-muted-foreground">Underperforming</div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBenchmarking;
