
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock data for indicators
const generateMockData = (days = 30) => {
  const data = [];
  let price = 45000 + Math.random() * 5000;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random price movement
    price = price + (Math.random() - 0.49) * 1000;
    
    // Calculate indicators
    const rsi = 30 + Math.random() * 40; // RSI between 30 and 70
    const macd = -50 + Math.random() * 100; // MACD between -50 and 50
    const signal = macd + (Math.random() - 0.5) * 20; // Signal line close to MACD
    const histogram = macd - signal;
    
    // Calculate moving averages
    const sma20 = price * (0.95 + Math.random() * 0.1);
    const sma50 = price * (0.9 + Math.random() * 0.15);
    const sma200 = price * (0.85 + Math.random() * 0.2);
    
    // Calculate Bollinger Bands
    const upperBand = price * 1.05;
    const lowerBand = price * 0.95;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price,
      rsi,
      macd,
      signal,
      histogram,
      sma20,
      sma50,
      sma200,
      upperBand,
      lowerBand
    });
  }
  
  return data;
};

type TimeframeOption = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

const timeframeOptions: { value: TimeframeOption; label: string; days: number }[] = [
  { value: "1D", label: "1 Day", days: 1 },
  { value: "1W", label: "1 Week", days: 7 },
  { value: "1M", label: "1 Month", days: 30 },
  { value: "3M", label: "3 Months", days: 90 },
  { value: "6M", label: "6 Months", days: 180 },
  { value: "1Y", label: "1 Year", days: 365 }
];

const coinOptions = [
  { value: "bitcoin", label: "Bitcoin (BTC)" },
  { value: "ethereum", label: "Ethereum (ETH)" },
  { value: "solana", label: "Solana (SOL)" },
  { value: "cardano", label: "Cardano (ADA)" },
  { value: "ripple", label: "XRP" },
  { value: "polkadot", label: "Polkadot (DOT)" },
  { value: "chainlink", label: "Chainlink (LINK)" },
  { value: "avalanche", label: "Avalanche (AVAX)" },
  { value: "polygon", label: "Polygon (MATIC)" }
];

const indicatorDescriptions = {
  "movingAverages": "Moving averages smooth price data to form a trend-following indicator. They do not predict price direction, but rather define the current direction with a lag.",
  "rsi": "Relative Strength Index (RSI) measures the speed and change of price movements. RSI oscillates between 0 and 100. Traditionally, RSI is considered overbought when above 70 and oversold when below 30.",
  "macd": "Moving Average Convergence Divergence (MACD) is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price.",
  "bollingerBands": "Bollinger Bands consist of a middle band (SMA) with two outer bands. The outer bands are typically set 2 standard deviations above and below the middle band."
};

const TechnicalIndicators = () => {
  const [activeTab, setActiveTab] = useState("movingAverages");
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [timeframe, setTimeframe] = useState<TimeframeOption>("1M");
  const [isLoading, setIsLoading] = useState(false);
  const [indicatorData, setIndicatorData] = useState(generateMockData(30));
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Find selected timeframe days
    const selectedTimeframe = timeframeOptions.find(option => option.value === timeframe);
    const days = selectedTimeframe ? selectedTimeframe.days : 30;
    
    // Simulate API call
    setTimeout(() => {
      setIndicatorData(generateMockData(days));
      setIsLoading(false);
      toast({
        title: "Indicators refreshed",
        description: `Updated ${selectedCoin} data for ${selectedTimeframe?.label} timeframe`,
      });
    }, 1500);
  };
  
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-2 rounded shadow-lg">
          <p className="font-medium text-xs">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'price' ? formatPrice(entry.value) : entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Technical Indicators</CardTitle>
          <div className="flex gap-2">
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Coin" />
              </SelectTrigger>
              <SelectContent>
                {coinOptions.map(coin => (
                  <SelectItem key={coin.value} value={coin.value}>{coin.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeframe} onValueChange={(value) => setTimeframe(value as TimeframeOption)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                {timeframeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </div>
        <CardDescription>
          Advanced technical analysis indicators for {coinOptions.find(c => c.value === selectedCoin)?.label}
        </CardDescription>
        <div className="mt-2 p-2 bg-secondary/20 rounded text-xs flex items-start">
          <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <p>{indicatorDescriptions[activeTab as keyof typeof indicatorDescriptions]}</p>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="movingAverages" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full grid grid-cols-4">
            <TabsTrigger value="movingAverages">Moving Averages</TabsTrigger>
            <TabsTrigger value="rsi">RSI</TabsTrigger>
            <TabsTrigger value="macd">MACD</TabsTrigger>
            <TabsTrigger value="bollingerBands">Bollinger Bands</TabsTrigger>
          </TabsList>
          
          <TabsContent value="movingAverages" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={indicatorData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" minTickGap={30} />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} name="Price" />
                <Line type="monotone" dataKey="sma20" stroke="#82ca9d" dot={false} strokeWidth={1.5} name="SMA 20" />
                <Line type="monotone" dataKey="sma50" stroke="#ffc658" dot={false} strokeWidth={1.5} name="SMA 50" />
                <Line type="monotone" dataKey="sma200" stroke="#ff7300" dot={false} strokeWidth={1.5} name="SMA 200" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="rsi" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={indicatorData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" minTickGap={30} />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="rsi" stroke="#8884d8" strokeWidth={1.5} name="RSI" />
                <Line type="monotone" y="30" stroke="#ff0000" strokeDasharray="3 3" dot={false} strokeWidth={1} name="Oversold (30)" />
                <Line type="monotone" y="70" stroke="#ff0000" strokeDasharray="3 3" dot={false} strokeWidth={1} name="Overbought (70)" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="macd" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={indicatorData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" minTickGap={30} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="macd" stroke="#8884d8" strokeWidth={1.5} name="MACD" />
                <Line type="monotone" dataKey="signal" stroke="#82ca9d" strokeWidth={1.5} name="Signal" />
                <Line type="monotone" dataKey="histogram" stroke="#ffc658" strokeWidth={1.5} name="Histogram" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="bollingerBands" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={indicatorData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" minTickGap={30} />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} name="Price" />
                <Line type="monotone" dataKey="sma20" stroke="#82ca9d" dot={false} strokeDasharray="3 3" name="SMA (20)" />
                <Line type="monotone" dataKey="upperBand" stroke="#ff7300" strokeWidth={1} dot={false} name="Upper Band" />
                <Line type="monotone" dataKey="lowerBand" stroke="#ff7300" strokeWidth={1} dot={false} name="Lower Band" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
        <span>Past performance is not indicative of future results</span>
        <span>Updated: {new Date().toLocaleString()}</span>
      </CardFooter>
    </Card>
  );
};

export default TechnicalIndicators;
