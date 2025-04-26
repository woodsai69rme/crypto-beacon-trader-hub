
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";

interface PortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
  className?: string;
}

const PortfolioBenchmarking = ({ 
  portfolioPerformance, 
  portfolioDates,
  className 
}: PortfolioBenchmarkingProps) => {
  const [selectedBenchmarks, setSelectedBenchmarks] = React.useState<string[]>(["btc"]);
  const { formatValue } = useCurrencyConverter();

  // Demo benchmark data - in a real app, this would come from an API
  const benchmarkData = {
    btc: [0, 3.2, 5.1, 2.3, 8.7, 15.2, 12.1, 9.8, 14.3, 18.7, 22.1, 19.8],
    eth: [0, 2.7, 4.3, 7.8, 12.3, 9.8, 5.6, 8.9, 13.4, 15.8, 14.3, 18.9],
    sp500: [0, 1.2, 2.4, 3.1, 2.8, 3.5, 4.2, 3.8, 4.5, 5.2, 6.1, 7.3]
  };

  const benchmarkColors = {
    btc: "#F7931A",
    eth: "#627EEA",
    sp500: "#0077B5"
  };

  const benchmarkNames = {
    btc: "Bitcoin",
    eth: "Ethereum",
    sp500: "S&P 500"
  };

  const data = portfolioDates.map((date, index) => {
    const point: any = { date };
    point.portfolio = portfolioPerformance[index];
    
    selectedBenchmarks.forEach(benchmark => {
      point[benchmark] = benchmarkData[benchmark as keyof typeof benchmarkData][index];
    });
    
    return point;
  });

  const toggleBenchmark = (benchmark: string) => {
    if (selectedBenchmarks.includes(benchmark)) {
      setSelectedBenchmarks(selectedBenchmarks.filter(b => b !== benchmark));
    } else {
      setSelectedBenchmarks([...selectedBenchmarks, benchmark]);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Portfolio vs. Benchmarks</CardTitle>
        <CardDescription>
          Compare your portfolio performance against major market benchmarks
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={() => toggleBenchmark("btc")}
            className={`px-3 py-1 rounded-full text-xs font-medium ${selectedBenchmarks.includes("btc") 
              ? "bg-amber-500 text-white" 
              : "bg-muted text-muted-foreground"}`}
          >
            Bitcoin
          </button>
          <button 
            onClick={() => toggleBenchmark("eth")}
            className={`px-3 py-1 rounded-full text-xs font-medium ${selectedBenchmarks.includes("eth") 
              ? "bg-blue-600 text-white" 
              : "bg-muted text-muted-foreground"}`}
          >
            Ethereum
          </button>
          <button 
            onClick={() => toggleBenchmark("sp500")}
            className={`px-3 py-1 rounded-full text-xs font-medium ${selectedBenchmarks.includes("sp500") 
              ? "bg-blue-800 text-white" 
              : "bg-muted text-muted-foreground"}`}
          >
            S&P 500
          </button>
        </div>
        
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
                activeDot={{ r: 8 }} 
                strokeWidth={2} 
              />
              {selectedBenchmarks.includes("btc") && (
                <Line 
                  type="monotone" 
                  dataKey="btc" 
                  name="Bitcoin" 
                  stroke="#F7931A" 
                  strokeWidth={1.5} 
                />
              )}
              {selectedBenchmarks.includes("eth") && (
                <Line 
                  type="monotone" 
                  dataKey="eth" 
                  name="Ethereum" 
                  stroke="#627EEA" 
                  strokeWidth={1.5} 
                />
              )}
              {selectedBenchmarks.includes("sp500") && (
                <Line 
                  type="monotone" 
                  dataKey="sp500" 
                  name="S&P 500" 
                  stroke="#0077B5" 
                  strokeWidth={1.5} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioBenchmarking;
