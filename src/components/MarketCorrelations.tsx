
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CryptoData } from '@/types/trading';
import { Loader2 } from 'lucide-react';

// Mock data - in a real app, fetch from API
const mockCryptoData: CryptoData[] = [
  {
    id: "bitcoin", 
    name: "Bitcoin", 
    symbol: "BTC", 
    price: 68500, 
    price_change_24h: 1250, 
    price_change_percentage_24h: 1.8, 
    market_cap: 1334000000000, 
    volume_24h: 28500000000, 
    circulating_supply: 19520000
  },
  {
    id: "ethereum", 
    name: "Ethereum", 
    symbol: "ETH", 
    price: 3280, 
    price_change_24h: -120, 
    price_change_percentage_24h: -3.5, 
    market_cap: 394000000000, 
    volume_24h: 12800000000, 
    circulating_supply: 120250000
  },
  {
    id: "binancecoin", 
    name: "BNB", 
    symbol: "BNB", 
    price: 580, 
    price_change_24h: 15, 
    price_change_percentage_24h: 2.7, 
    market_cap: 89500000000, 
    volume_24h: 3200000000, 
    circulating_supply: 154533650
  },
  {
    id: "solana", 
    name: "Solana", 
    symbol: "SOL", 
    price: 148, 
    price_change_24h: 8.5, 
    price_change_percentage_24h: 6.1, 
    market_cap: 63400000000, 
    volume_24h: 2900000000, 
    circulating_supply: 428500000
  },
  {
    id: "cardano", 
    name: "Cardano", 
    symbol: "ADA", 
    price: 0.58, 
    price_change_24h: 0.03, 
    price_change_percentage_24h: 5.4, 
    market_cap: 20300000000, 
    volume_24h: 850000000, 
    circulating_supply: 35000000000
  },
  {
    id: "ripple", 
    name: "XRP", 
    symbol: "XRP", 
    price: 0.61, 
    price_change_24h: -0.02, 
    price_change_percentage_24h: -3.1, 
    market_cap: 32500000000, 
    volume_24h: 1350000000, 
    circulating_supply: 53200000000
  }
];

const MarketCorrelations: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [xMetric, setXMetric] = useState<string>("market_cap");
  const [yMetric, setYMetric] = useState<string>("volume_24h");
  const [timeframe, setTimeframe] = useState<string>("24h");
  const [correlationView, setCorrelationView] = useState<string>("scatter");

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const getMetricValue = (coin: CryptoData, metric: string) => {
    switch (metric) {
      case "market_cap":
        return coin.market_cap;
      case "volume_24h":
        return coin.volume_24h;
      case "price_change_24h":
        return coin.price_change_24h;
      case "price_change_percentage_24h":
        return coin.price_change_percentage_24h;
      case "price":
        return coin.price;
      default:
        return 0;
    }
  };

  const formatMetricLabel = (metric: string): string => {
    switch (metric) {
      case "market_cap":
        return "Market Cap (USD)";
      case "volume_24h":
        return "24h Volume (USD)";
      case "price_change_24h":
        return "24h Price Change (USD)";
      case "price_change_percentage_24h":
        return "24h Price Change (%)";
      case "price":
        return "Price (USD)";
      default:
        return metric;
    }
  };

  const correlationData = mockCryptoData.map(coin => ({
    name: coin.name,
    symbol: coin.symbol,
    x: getMetricValue(coin, xMetric),
    y: getMetricValue(coin, yMetric),
    color: getColorForCoin(coin.symbol)
  }));

  function getColorForCoin(symbol: string): string {
    const colorMap: Record<string, string> = {
      BTC: "#F7931A",
      ETH: "#627EEA",
      BNB: "#F3BA2F",
      SOL: "#00FFA3",
      ADA: "#0033AD",
      XRP: "#23292F",
    };
    return colorMap[symbol] || "#888888";
  }

  const correlationMetrics = [
    { value: "market_cap", label: "Market Cap" },
    { value: "volume_24h", label: "24h Volume" },
    { value: "price_change_24h", label: "24h Price Change ($)" },
    { value: "price_change_percentage_24h", label: "24h Price Change (%)" },
    { value: "price", label: "Price" }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Market Correlations</CardTitle>
        <CardDescription>
          Analyze relationships between different market metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={correlationView} onValueChange={setCorrelationView} className="mb-6">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="scatter">Scatter Plot</TabsTrigger>
            <TabsTrigger value="matrix">Correlation Matrix</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium block mb-2">X-Axis Metric</label>
            <Select value={xMetric} onValueChange={setXMetric}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {correlationMetrics.map(metric => (
                  <SelectItem key={metric.value} value={metric.value}>
                    {metric.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-2">Y-Axis Metric</label>
            <Select value={yMetric} onValueChange={setYMetric}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {correlationMetrics.map(metric => (
                  <SelectItem key={metric.value} value={metric.value}>
                    {metric.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-2">Timeframe</label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading correlation data...</p>
            </div>
          </div>
        ) : (
          <TabsContent value="scatter" className="mt-0">
            <div className="h-[400px] w-full bg-card/50 rounded-lg border p-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name={formatMetricLabel(xMetric)}
                    label={{ 
                      value: formatMetricLabel(xMetric), 
                      position: 'bottom',
                      offset: 0
                    }} 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                      return value.toFixed(1);
                    }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name={formatMetricLabel(yMetric)}
                    label={{ 
                      value: formatMetricLabel(yMetric), 
                      angle: -90, 
                      position: 'left',
                      offset: 10
                    }}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                      return value.toFixed(1);
                    }}
                  />
                  <Tooltip 
                    formatter={(value) => [
                      `${typeof value === 'number' ? 
                        value >= 1000000000 ? 
                          `$${(value / 1000000000).toFixed(2)}B` : 
                        value >= 1000000 ? 
                          `$${(value / 1000000).toFixed(2)}M` : 
                        value >= 1000 ? 
                          `$${(value / 1000).toFixed(2)}K` : 
                          `$${value}` 
                        : value}`, 
                      ""
                    ]}
                    labelFormatter={(_, data) => {
                      const point = data[0]?.payload;
                      return point ? `${point.name} (${point.symbol})` : "";
                    }}
                    contentStyle={{ 
                      backgroundColor: 'var(--background)', 
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Scatter name="Cryptocurrencies" data={correlationData} fill="#8884d8">
                    {correlationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="matrix" className="mt-0">
          <div className="text-center p-8 border rounded-lg bg-card/50">
            <p className="text-muted-foreground">
              Correlation matrix view will be implemented in a future update.
            </p>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default MarketCorrelations;
