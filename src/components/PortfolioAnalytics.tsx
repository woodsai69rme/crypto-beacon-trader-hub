
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";

interface AssetDistribution {
  name: string;
  value: number;
  color: string;
}

interface PerformanceData {
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  profitLossPercentage: number;
  bestPerformer: {
    name: string;
    percentage: number;
  };
  worstPerformer: {
    name: string;
    percentage: number;
  };
  distribution: AssetDistribution[];
}

const PortfolioAnalytics = () => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, we would calculate this from actual portfolio data
    // For demo purposes, we'll use mock data
    const mockData: PerformanceData = {
      totalValue: 12580.42,
      totalInvested: 10000,
      totalProfitLoss: 2580.42,
      profitLossPercentage: 25.8,
      bestPerformer: {
        name: "Ethereum",
        percentage: 42.5
      },
      worstPerformer: {
        name: "Cardano",
        percentage: -8.3
      },
      distribution: [
        { name: "Bitcoin", value: 45, color: "#F7931A" },
        { name: "Ethereum", value: 30, color: "#627EEA" },
        { name: "Solana", value: 15, color: "#00FFA3" },
        { name: "Cardano", value: 7, color: "#0033AD" },
        { name: "XRP", value: 3, color: "#23292F" }
      ]
    };
    
    // Simulate loading
    setTimeout(() => {
      setData(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  if (isLoading) {
    return (
      <div className="crypto-card">
        <div className="crypto-card-header">
          <h2 className="text-lg font-bold">Portfolio Analytics</h2>
        </div>
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="crypto-card">
        <div className="crypto-card-header">
          <h2 className="text-lg font-bold">Portfolio Analytics</h2>
        </div>
        <div className="py-8 text-center text-muted-foreground">
          <p>No portfolio data available.</p>
          <p className="mt-1 text-sm">Add assets to your portfolio to see analytics.</p>
        </div>
      </div>
    );
  }
  
  const isProfitPositive = data.totalProfitLoss >= 0;
  
  return (
    <div className="crypto-card">
      <div className="crypto-card-header">
        <h2 className="text-lg font-bold">Portfolio Analytics</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-4 rounded-md border border-border bg-crypto-dark-hover p-4">
            <h3 className="text-sm font-medium">Performance Summary</h3>
            
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total Value</span>
                <span className="font-medium">${data.totalValue.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total Invested</span>
                <span className="font-medium">${data.totalInvested.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Profit/Loss</span>
                <span className={`flex items-center font-medium ${isProfitPositive ? "text-crypto-green" : "text-crypto-red"}`}>
                  {isProfitPositive ? (
                    <ArrowUp className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3" />
                  )}
                  ${Math.abs(data.totalProfitLoss).toLocaleString()} ({Math.abs(data.profitLossPercentage).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
          
          <div className="rounded-md border border-border bg-crypto-dark-hover p-4">
            <h3 className="text-sm font-medium">Top Performers</h3>
            
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-xs text-muted-foreground">
                  Best
                  <ArrowUp className="ml-1 h-3 w-3 text-crypto-green" />
                </span>
                <span className="flex items-center font-medium text-crypto-green">
                  {data.bestPerformer.name} (+{data.bestPerformer.percentage.toFixed(1)}%)
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="flex items-center text-xs text-muted-foreground">
                  Worst
                  <ArrowDown className="ml-1 h-3 w-3 text-crypto-red" />
                </span>
                <span className="flex items-center font-medium text-crypto-red">
                  {data.worstPerformer.name} ({data.worstPerformer.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="rounded-md border border-border bg-crypto-dark-hover p-4">
            <h3 className="mb-2 text-sm font-medium">Asset Distribution</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ 
                      background: '#1E1E1E', 
                      border: '1px solid #333333',
                      borderRadius: '4px' 
                    }} 
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{ fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;
