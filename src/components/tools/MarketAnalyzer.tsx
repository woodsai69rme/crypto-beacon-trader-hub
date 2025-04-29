
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, TrendingUp, TrendingDown, AlertCircle, Activity, Share2 } from "lucide-react";
import { ResponsiveLine } from "@nivo/line";

const MarketAnalyzer = () => {
  const [activeTab, setActiveTab] = useState("sentiment");
  const [timeframe, setTimeframe] = useState("1d");
  const [coin, setCoin] = useState("btc");
  
  const marketSentiment = {
    overall: 65, // on a scale of 0-100
    change: 3.2,
    socialMedia: 72,
    news: 58,
    technicalSignals: 62,
    volumeTrend: "increasing",
  };
  
  const marketSignals = [
    { name: "RSI (14)", value: 62, interpretation: "Neutral", bullish: true },
    { name: "MACD", value: "Bullish Crossover", interpretation: "Strong Buy", bullish: true },
    { name: "Moving Avg (50/200)", value: "Golden Cross", interpretation: "Strong Buy", bullish: true },
    { name: "Bollinger Bands", value: "Upper Band Test", interpretation: "Sell", bullish: false },
    { name: "Stochastic", value: 78, interpretation: "Overbought", bullish: false },
    { name: "Volume", value: "+28%", interpretation: "Strong Buy", bullish: true },
    { name: "OBV", value: "Rising", interpretation: "Buy", bullish: true },
    { name: "ADX", value: 24, interpretation: "Neutral Trend", bullish: true },
  ];
  
  const sentimentData = [
    {
      id: "sentiment",
      color: "hsl(210, 70%, 50%)",
      data: Array.from({ length: 30 }, (_, i) => ({
        x: i,
        y: 50 + Math.sin(i / 2) * 25 + Math.random() * 10,
      })),
    },
  ];
  
  const marketCorrelations = [
    { asset1: "BTC", asset2: "ETH", correlation: 0.86, trend: "Increasing" },
    { asset1: "BTC", asset2: "Gold", correlation: 0.24, trend: "Decreasing" },
    { asset1: "BTC", asset2: "S&P 500", correlation: 0.38, trend: "Stable" },
    { asset1: "ETH", asset2: "BNB", correlation: 0.72, trend: "Increasing" },
    { asset1: "BTC", asset2: "USD", correlation: -0.65, trend: "Stable" },
  ];
  
  const getSentimentColor = (sentiment) => {
    if (sentiment > 70) return "text-green-500";
    if (sentiment > 50) return "text-green-400";
    if (sentiment > 40) return "text-amber-400";
    return "text-red-500";
  };
  
  const getCorrelationColor = (correlation) => {
    const absCorrelation = Math.abs(correlation);
    if (absCorrelation > 0.7) return "text-green-500";
    if (absCorrelation > 0.4) return "text-amber-400";
    return "text-muted-foreground";
  };

  return (
    <Card className="shadow-lg border border-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Market Analyzer
            </CardTitle>
            <CardDescription>
              Advanced market sentiment and correlation analysis
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Select value={coin} onValueChange={setCoin}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Coin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="btc">Bitcoin</SelectItem>
                <SelectItem value="eth">Ethereum</SelectItem>
                <SelectItem value="sol">Solana</SelectItem>
                <SelectItem value="xrp">XRP</SelectItem>
                <SelectItem value="ada">Cardano</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1H</SelectItem>
                <SelectItem value="4h">4H</SelectItem>
                <SelectItem value="1d">1D</SelectItem>
                <SelectItem value="1w">1W</SelectItem>
                <SelectItem value="1m">1M</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="signals">Technical Signals</TabsTrigger>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sentiment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1 md:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    {marketSentiment.overall > 50 ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                    Overall Market Sentiment
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Based on social signals, news, and technical analysis
                  </p>
                </div>
                
                <div className="flex items-center justify-center mb-6">
                  <div className="w-48 h-48 rounded-full bg-muted relative flex items-center justify-center">
                    <div
                      className={`text-4xl font-bold ${getSentimentColor(
                        marketSentiment.overall
                      )}`}
                    >
                      {marketSentiment.overall}
                    </div>
                    <div className="text-muted-foreground text-sm mt-2">/ 100</div>
                    
                    <div
                      className="absolute h-1 bg-primary"
                      style={{
                        width: "50%",
                        transformOrigin: "left center",
                        transform: `rotate(${
                          marketSentiment.overall * 1.8 - 90
                        }deg)`,
                        left: "50%",
                        top: "50%",
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <Badge
                    variant={marketSentiment.change >= 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {marketSentiment.change >= 0 ? "+" : ""}
                    {marketSentiment.change}% past 24 hours
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted/20 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Sentiment Sources</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Social Media</span>
                        <span className={getSentimentColor(marketSentiment.socialMedia)}>
                          {marketSentiment.socialMedia}%
                        </span>
                      </div>
                      <div className="w-full bg-muted h-1 mt-1">
                        <div
                          className="bg-primary h-1"
                          style={{ width: `${marketSentiment.socialMedia}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>News Analysis</span>
                        <span className={getSentimentColor(marketSentiment.news)}>
                          {marketSentiment.news}%
                        </span>
                      </div>
                      <div className="w-full bg-muted h-1 mt-1">
                        <div
                          className="bg-primary h-1"
                          style={{ width: `${marketSentiment.news}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Technical</span>
                        <span className={getSentimentColor(marketSentiment.technicalSignals)}>
                          {marketSentiment.technicalSignals}%
                        </span>
                      </div>
                      <div className="w-full bg-muted h-1 mt-1">
                        <div
                          className="bg-primary h-1"
                          style={{ width: `${marketSentiment.technicalSignals}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/20 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-1">Volume Analysis</h4>
                  <div className="flex items-center gap-1">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">{marketSentiment.volumeTrend}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Share2 className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                  <Button variant="default" size="sm" className="w-full">
                    Full Analysis
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="h-64 w-full mt-4">
              <h4 className="text-sm font-medium mb-2">Sentiment Trend (30 days)</h4>
              <ResponsiveLine
                data={sentimentData}
                margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                }}
                curve="monotoneX"
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  tickValues: [0, 7, 14, 21, 29],
                  format: (value) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (29 - value));
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  },
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  tickValues: [0, 25, 50, 75, 100],
                }}
                enableGridX={false}
                colors={{ scheme: "category10" }}
                lineWidth={3}
                pointSize={4}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                enableArea={true}
                areaOpacity={0.15}
                useMesh={true}
                theme={{
                  textColor: "#888",
                  fontSize: 11,
                  axis: {
                    domain: {
                      line: {
                        stroke: "#555",
                      },
                    },
                    ticks: {
                      line: {
                        stroke: "#555",
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: "#333",
                      strokeWidth: 0.5,
                    },
                  },
                  tooltip: {
                    container: {
                      background: "#222",
                      color: "#eee",
                      boxShadow: "0 3px 9px rgba(0, 0, 0, 0.5)",
                      borderRadius: "4px",
                    },
                  },
                }}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="signals" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-muted/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Technical Analysis Signals</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {marketSignals.map((signal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-md bg-muted/10"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{signal.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {signal.interpretation}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Badge
                          variant={signal.bullish ? "default" : "destructive"}
                          className={`mr-2 ${
                            signal.bullish ? "bg-green-500/20" : "bg-red-500/20"
                          }`}
                        >
                          {signal.value}
                        </Badge>
                        {signal.bullish ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-500">Conflicting Signals</h4>
                  <p className="text-sm mt-1">
                    Bollinger Bands and Stochastic indicators suggest potential overbought
                    conditions, while most trend indicators remain bullish. Consider reduced
                    position sizes or tighter stop losses.
                  </p>
                </div>
              </div>
              
              <Button className="ml-auto">
                Detailed Technical Analysis
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="correlations" className="space-y-6">
            <div className="bg-muted/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Asset Correlations</h3>
              
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="uppercase bg-muted/30 text-xs">
                    <tr>
                      <th scope="col" className="px-4 py-3">Asset Pair</th>
                      <th scope="col" className="px-4 py-3">Correlation</th>
                      <th scope="col" className="px-4 py-3">Trend</th>
                      <th scope="col" className="px-4 py-3">Strength</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketCorrelations.map((correlation, index) => (
                      <tr key={index} className="border-b border-muted">
                        <td className="px-4 py-3">
                          {correlation.asset1}/{correlation.asset2}
                        </td>
                        <td className={`px-4 py-3 ${getCorrelationColor(correlation.correlation)}`}>
                          {correlation.correlation.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="font-normal">
                            {correlation.trend}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-full bg-muted h-2 rounded-full">
                            <div
                              className={`h-2 rounded-full ${
                                correlation.correlation > 0
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${Math.abs(correlation.correlation) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="text-xs text-muted-foreground mt-4">
                Correlation scale: -1.0 (perfect negative) to 1.0 (perfect positive)
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">What This Means</h3>
              <p className="text-sm">
                BTC and ETH show strong positive correlation (0.86), suggesting these assets
                move together. BTC and Gold show weak positive correlation (0.24),
                indicating Gold could provide some portfolio diversification. BTC and USD
                show moderate negative correlation (-0.65), suggesting BTC often moves
                opposite to USD strength.
              </p>
            </div>
            
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-indigo-400">Portfolio Insight</h4>
                <p className="text-sm mt-1">
                  High correlation between crypto assets may increase portfolio risk during
                  market downturns. Consider adding assets with lower correlation for better
                  diversification.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketAnalyzer;
