
import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CoinData {
  name: string;
  marketCap: number;
  volume: number;
  supply: number;
  allTimeHigh: number;
  color: string;
}

const CoinComparison = () => {
  const [metric, setMetric] = useState<string>("marketCap");
  
  // Mock data - in a real app, this would come from an API
  const coinData: Record<string, CoinData> = {
    "Bitcoin": {
      name: "Bitcoin",
      marketCap: 562.7,
      volume: 18.5,
      supply: 19.5,
      allTimeHigh: 69000,
      color: "#F7931A"
    },
    "Ethereum": {
      name: "Ethereum",
      marketCap: 191.2,
      volume: 9.7,
      supply: 120.2,
      allTimeHigh: 4878,
      color: "#627EEA"
    },
    "Solana": {
      name: "Solana",
      marketCap: 42.8,
      volume: 2.1,
      supply: 429.7,
      allTimeHigh: 260,
      color: "#9945FF"
    },
    "Cardano": {
      name: "Cardano",
      marketCap: 13.1,
      volume: 0.5,
      supply: 35.4,
      allTimeHigh: 3.10,
      color: "#0033AD"
    },
    "Ripple": {
      name: "Ripple",
      marketCap: 29.2,
      volume: 1.3,
      supply: 53.2,
      allTimeHigh: 3.40,
      color: "#00B0FF"
    }
  };

  // Format data for the chart
  const getChartData = () => {
    const data = [];
    
    for (const [name, coin] of Object.entries(coinData)) {
      const item: Record<string, any> = { name };
      
      switch (metric) {
        case "marketCap":
          item.value = coin.marketCap;
          item.unit = "Billion USD";
          break;
        case "volume":
          item.value = coin.volume;
          item.unit = "Billion USD";
          break;
        case "supply":
          item.value = coin.supply;
          item.unit = "Million Coins";
          break;
        case "allTimeHigh":
          item.value = coin.allTimeHigh;
          item.unit = "USD";
          break;
      }
      
      item.color = coin.color;
      data.push(item);
    }
    
    return data;
  };
  
  const chartData = getChartData();
  
  const metrics = [
    { value: "marketCap", label: "Market Cap" },
    { value: "volume", label: "24h Trading Volume" },
    { value: "supply", label: "Circulating Supply" },
    { value: "allTimeHigh", label: "All-Time High" }
  ];

  return (
    <div className="crypto-card">
      <div className="crypto-card-header">
        <h2 className="text-lg font-bold">Coin Comparison</h2>
        <div className="w-48">
          <Select
            value={metric}
            onValueChange={setMetric}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" tick={{ fill: '#999' }} />
            <YAxis tick={{ fill: '#999' }} />
            <Tooltip
              formatter={(value, name, props) => {
                return [`${value} ${props.payload.unit}`, props.payload.name];
              }}
              contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
              labelStyle={{ color: '#ccc' }}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              name={metrics.find(m => m.value === metric)?.label}
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CoinComparison;
