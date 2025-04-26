
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { formatMarketCap, getGlobalMetrics, type GlobalMetrics } from "@/services/marketDataService";
import { ArrowUp, ArrowDown, Activity, DollarSign, Percent, LineChart as LineChartIcon } from "lucide-react";

interface MarketMetricsProps {
  className?: string;
}

const MarketMetrics = ({ className }: MarketMetricsProps) => {
  const [metrics, setMetrics] = useState<GlobalMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getGlobalMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch market metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock data for charts
  const marketCapDistribution = [
    { name: "Bitcoin", value: 42.5 },
    { name: "Ethereum", value: 18.3 },
    { name: "Stablecoins", value: 12.7 },
    { name: "BNB", value: 3.4 },
    { name: "XRP", value: 1.8 },
    { name: "Other", value: 21.3 }
  ];

  const volumeByExchange = [
    { name: "Binance", value: 28.5 },
    { name: "Coinbase", value: 14.2 },
    { name: "FTX", value: 9.7 },
    { name: "Kraken", value: 6.3 },
    { name: "KuCoin", value: 5.8 },
    { name: "Other", value: 35.5 }
  ];

  const historicalMarketCap = [
    { date: "Jan", value: 1.8 },
    { date: "Feb", value: 2.1 },
    { date: "Mar", value: 2.0 },
    { date: "Apr", value: 2.3 },
    { date: "May", value: 1.9 },
    { date: "Jun", value: 1.7 },
    { date: "Jul", value: 2.2 },
    { date: "Aug", value: 2.4 },
    { date: "Sep", value: 2.3 },
    { date: "Oct", value: 2.1 },
    { date: "Nov", value: 2.5 },
    { date: "Dec", value: 2.7 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Market Metrics</CardTitle>
          <CardDescription>Loading market data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" /> Market Metrics
        </CardTitle>
        <CardDescription>
          Comprehensive analysis of global cryptocurrency markets
        </CardDescription>
      </CardHeader>

      <CardContent>
        {metrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Market Cap</div>
                    <div className="text-2xl font-bold">{formatMarketCap(metrics.data.totalMarketCap)}</div>
                  </div>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-muted-foreground">24h Volume</div>
                    <div className="text-2xl font-bold">{formatMarketCap(metrics.data.totalVolume24h)}</div>
                  </div>
                  <LineChartIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-muted-foreground">BTC Dominance</div>
                    <div className="text-2xl font-bold">{metrics.data.btcDominance.toFixed(1)}%</div>
                  </div>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {metrics.trends.map((trend, idx) => (
                <Badge 
                  key={idx} 
                  variant={trend.direction === "up" ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {trend.direction === "up" ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {trend.percentage.toFixed(1)}% ({trend.timeframe})
                </Badge>
              ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="overview">Market Cap</TabsTrigger>
                <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="pt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketCapDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {marketCapDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="exchanges" className="pt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={volumeByExchange}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Volume Share']} />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Trading Volume" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="trends" className="pt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historicalMarketCap}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `$${value}T`} />
                      <Tooltip formatter={(value) => [`$${value}T`, 'Market Cap']} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        name="Total Market Cap (in trillions)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {!metrics && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Failed to load market metrics</p>
            <p className="text-sm">Please try again later</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketMetrics;
