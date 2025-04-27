
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Wallet } from "lucide-react";
import { startPriceMonitoring } from "@/services/priceMonitoringService";
import { useTradingAccounts } from "@/hooks/use-trading-accounts";
import { CoinOption } from "@/types/trading";

interface PieChartData {
  name: string;
  symbol: string;
  value: number;
  color: string;
}

// Predefined colors for the pie chart
const CHART_COLORS = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
  "#FF9F40", "#8AC926", "#1982C4", "#6A4C93", "#F72585"
];

const RealTimePortfolio: React.FC = () => {
  const { getActiveAccount } = useTradingAccounts();
  const [pieData, setPieData] = useState<PieChartData[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [coins, setCoins] = useState<CoinOption[]>([]);
  
  // Initial coins data
  const initialCoins: CoinOption[] = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 61245.32 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3010.45 },
    { id: "solana", name: "Solana", symbol: "SOL", price: 142.87 },
    { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45 },
    { id: "ripple", name: "XRP", symbol: "XRP", price: 0.57 },
    { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.14 },
  ];
  
  // Set up real-time price monitoring
  useEffect(() => {
    setCoins(initialCoins);
    
    const stopMonitoring = startPriceMonitoring(
      initialCoins.map(coin => coin.id),
      (updatedCoins) => {
        setCoins(updatedCoins);
      },
      10000 // Update every 10 seconds
    );
    
    return () => stopMonitoring();
  }, []);
  
  // Calculate holdings and update pie chart data
  useEffect(() => {
    const activeAccount = getActiveAccount();
    if (!activeAccount || coins.length === 0) return;
    
    // Group holdings by coin
    const holdings: Record<string, number> = {};
    
    activeAccount.trades.forEach(trade => {
      if (!holdings[trade.coinId]) {
        holdings[trade.coinId] = 0;
      }
      
      holdings[trade.coinId] += trade.type === 'buy' ? trade.amount : -trade.amount;
    });
    
    // Calculate value of each holding
    const chartData: PieChartData[] = [];
    let portfolioTotal = activeAccount.balance; // Start with cash balance
    let colorIndex = 0;
    
    // Add cash to chart data
    if (activeAccount.balance > 0) {
      chartData.push({
        name: "Cash",
        symbol: "USD",
        value: activeAccount.balance,
        color: "#22c55e" // Green color for cash
      });
    }
    
    // Add coin holdings to chart data
    Object.entries(holdings).forEach(([coinId, amount]) => {
      if (amount <= 0) return; // Skip zero or negative holdings
      
      const coin = coins.find(c => c.id === coinId);
      if (!coin) return;
      
      const value = amount * coin.price;
      portfolioTotal += value;
      
      chartData.push({
        name: coin.name,
        symbol: coin.symbol,
        value,
        color: CHART_COLORS[colorIndex % CHART_COLORS.length]
      });
      
      colorIndex++;
    });
    
    // Sort by value (descending)
    chartData.sort((a, b) => b.value - a.value);
    
    setPieData(chartData);
    setTotalValue(portfolioTotal);
  }, [coins, getActiveAccount]);
  
  // Format currency for display
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format percentage for display
  const formatPercentage = (value: number, total: number): string => {
    return `${((value / total) * 100).toFixed(1)}%`;
  };
  
  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 rounded-md border shadow-md">
          <p className="font-medium">{data.name} ({data.symbol})</p>
          <p className="text-sm">{formatCurrency(data.value)}</p>
          <p className="text-sm text-muted-foreground">{formatPercentage(data.value, totalValue)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Portfolio Allocation
          </CardTitle>
          <Badge variant="outline" className="animate-pulse">LIVE</Badge>
        </div>
        <CardDescription>
          Current portfolio value: {formatCurrency(totalValue)}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="h-[250px]">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${formatPercentage(value, totalValue)})`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No portfolio data available</p>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Asset</th>
                <th className="text-right py-2">Value</th>
                <th className="text-right py-2">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {pieData.map((asset, index) => (
                <tr key={`asset-${index}`} className="border-b">
                  <td className="py-2 flex items-center">
                    <span 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: asset.color }} 
                    />
                    {asset.name}
                  </td>
                  <td className="text-right py-2">
                    {formatCurrency(asset.value)}
                  </td>
                  <td className="text-right py-2">
                    {formatPercentage(asset.value, totalValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePortfolio;
