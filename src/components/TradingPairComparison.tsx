
import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, Minus } from "lucide-react";

interface TradingPairComparisonProps {
  className?: string;
}

// Interface for each coin selection
interface CoinSelection {
  id: string;
  name: string;
  symbol: string;
  color: string;
}

const TradingPairComparison = ({ className }: TradingPairComparisonProps) => {
  const [timeframe, setTimeframe] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);
  
  // Available coins for selection
  const availableCoins = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", color: "#F7931A" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "#627EEA" },
    { id: "solana", name: "Solana", symbol: "SOL", color: "#00FFA3" },
    { id: "cardano", name: "Cardano", symbol: "ADA", color: "#0033AD" },
    { id: "ripple", name: "XRP", symbol: "XRP", color: "#23292F" },
    { id: "polkadot", name: "Polkadot", symbol: "DOT", color: "#E6007A" }
  ];
  
  // Selected coins for comparison
  const [selectedCoins, setSelectedCoins] = useState<CoinSelection[]>([
    availableCoins[0],
    availableCoins[1]
  ]);
  
  // Generate mock price history data
  const comparativeData = generateMockComparativeData(selectedCoins, timeframe);
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const handleAddCoin = () => {
    if (selectedCoins.length < 4) {
      // Find a coin that's not already selected
      const availableCoin = availableCoins.find(
        coin => !selectedCoins.some(selected => selected.id === coin.id)
      );
      
      if (availableCoin) {
        setSelectedCoins([...selectedCoins, availableCoin]);
      }
    }
  };
  
  const handleRemoveCoin = (index: number) => {
    if (selectedCoins.length > 2) {
      const newSelectedCoins = [...selectedCoins];
      newSelectedCoins.splice(index, 1);
      setSelectedCoins(newSelectedCoins);
    }
  };
  
  const handleChangeCoin = (index: number, coinId: string) => {
    const newCoin = availableCoins.find(coin => coin.id === coinId);
    if (newCoin) {
      const newSelectedCoins = [...selectedCoins];
      newSelectedCoins[index] = newCoin;
      setSelectedCoins(newSelectedCoins);
    }
  };
  
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  const formatChange = (pctChange: number) => {
    return `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(2)}%`;
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded shadow-md">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}: </span>
              <span>{formatValue(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <CardTitle>Trading Pair Comparison</CardTitle>
            <CardDescription>Compare price performance</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              className={isLoading ? "animate-spin" : ""}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedCoins.map((coin, index) => (
            <div key={index} className="flex items-center gap-2 bg-card shadow-sm border rounded-md p-1 px-2">
              <Select 
                value={coin.id} 
                onValueChange={(value) => handleChangeCoin(index, value)}
              >
                <SelectTrigger className="border-none h-7 w-[120px] p-0 pl-1">
                  <SelectValue placeholder="Select coin" />
                </SelectTrigger>
                <SelectContent>
                  {availableCoins
                    .filter(c => !selectedCoins.some((sc, i) => i !== index && sc.id === c.id))
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: c.color }}
                          />
                          <span>{c.symbol}</span>
                        </div>
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              
              {selectedCoins.length > 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRemoveCoin(index)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          
          {selectedCoins.length < 4 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={handleAddCoin}
            >
              + Add Coin
            </Button>
          )}
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={comparativeData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="date" 
                scale="time" 
                stroke="#888" 
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`} 
                stroke="#888" 
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {selectedCoins.map((coin) => (
                <Line
                  key={coin.id}
                  type="monotone"
                  dataKey={coin.id}
                  stroke={coin.color}
                  name={coin.symbol}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {selectedCoins.map((coin) => (
            <div key={coin.id} className="flex flex-col">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: coin.color }}
                />
                <span className="font-medium">{coin.symbol}</span>
              </div>
              <div className="text-sm">
                {formatValue(getLatestPrice(coin.id, comparativeData))}
              </div>
              <div 
                className={
                  getPercentageChange(coin.id, comparativeData) >= 0 
                    ? "text-xs text-green-500" 
                    : "text-xs text-red-500"
                }
              >
                {formatChange(getPercentageChange(coin.id, comparativeData))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Generate mock comparative price data
function generateMockComparativeData(coins: CoinSelection[], timeframe: string) {
  const days = timeframeToPoints(timeframe);
  const data = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    const dataPoint: any = {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    
    coins.forEach(coin => {
      // Generate base price based on coin
      let basePrice = 0;
      if (coin.id === "bitcoin") basePrice = 40000;
      else if (coin.id === "ethereum") basePrice = 2000;
      else if (coin.id === "solana") basePrice = 100;
      else if (coin.id === "cardano") basePrice = 0.4;
      else if (coin.id === "ripple") basePrice = 0.5;
      else if (coin.id === "polkadot") basePrice = 5;
      
      // Add randomness to create price movement
      const volatilityFactor = 0.02; // 2% volatility
      const trendFactor = 0.001; // Slight upward trend
      const randomFactor = (Math.random() - 0.5) * 2 * volatilityFactor * basePrice;
      const trendValue = i * trendFactor * basePrice;
      
      dataPoint[coin.id] = basePrice + randomFactor + trendValue;
    });
    
    data.push(dataPoint);
  }
  
  return data;
}

function timeframeToPoints(timeframe: string): number {
  switch (timeframe) {
    case "24h": return 24;
    case "7d": return 7;
    case "30d": return 30;
    case "90d": return 90;
    case "1y": return 52; // Weekly data points for a year
    default: return 7;
  }
}

function getLatestPrice(coinId: string, data: any[]): number {
  if (data.length === 0) return 0;
  return data[data.length - 1][coinId] || 0;
}

function getPercentageChange(coinId: string, data: any[]): number {
  if (data.length < 2) return 0;
  
  const latestPrice = data[data.length - 1][coinId] || 0;
  const firstPrice = data[0][coinId] || 0;
  
  if (firstPrice === 0) return 0;
  return ((latestPrice - firstPrice) / firstPrice) * 100;
}

export default TradingPairComparison;
