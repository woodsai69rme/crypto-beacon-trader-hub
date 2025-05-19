import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';
import { Brain, ChevronDown, Eye, AlertTriangle, BarChart3 } from "lucide-react";

interface AnalyticsProps {
  refreshInterval?: number;
}

// Mock data for analytics
const generateMockData = () => {
  const basePrice = 40000 + Math.random() * 5000;
  const points = 24;
  const data = [];
  
  let price = basePrice;
  let volume = 10000000;
  
  for (let i = 0; i < points; i++) {
    // Simulate price movement
    const change = (Math.random() - 0.5) * 500;
    price += change;
    // Simulate volume movement
    const volumeChange = (Math.random() - 0.4) * 5000000;
    volume = Math.max(1000000, volume + volumeChange);
    
    // Generate RSI and MACD
    const rsi = 30 + Math.random() * 40;
    const macd = (Math.random() - 0.5) * 100;
    const signal = macd + (Math.random() - 0.5) * 30;
    
    data.push({
      time: `${i}:00`,
      price,
      volume,
      rsi,
      macd,
      signal,
      histogram: macd - signal,
      ai_prediction: price + (Math.random() - 0.3) * 800,
      ai_confidence: 40 + Math.random() * 50,
      sentiment: -100 + Math.random() * 200,
    });
  }
  
  return data;
};

// Market sentiment thresholds
const getSentimentLevel = (value: number) => {
  if (value > 60) return { level: 'Bullish', color: 'text-green-500' };
  if (value > 20) return { level: 'Mildly Bullish', color: 'text-green-400' };
  if (value > -20) return { level: 'Neutral', color: 'text-gray-500' };
  if (value > -60) return { level: 'Mildly Bearish', color: 'text-red-400' };
  return { level: 'Bearish', color: 'text-red-500' };
};

// Format large numbers
const formatNumber = (num: number) => {
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)}B`;
  }
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
};

export const RealTimeMarketAnalytics: React.FC<AnalyticsProps> = ({ refreshInterval = 30000 }) => {
  const [analyticsData, setAnalyticsData] = useState(generateMockData());
  const [activeCoin, setActiveCoin] = useState('BTC');
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('price');
  const [aiModelSource, setAiModelSource] = useState('cloud');
  
  // Get the latest data point
  const latestData = analyticsData[analyticsData.length - 1];
  const previousData = analyticsData[analyticsData.length - 2];
  
  // Calculate change
  const priceChange = latestData.price - previousData.price;
  const priceChangePercent = (priceChange / previousData.price) * 100;
  
  // Average AI confidence
  const avgAiConfidence = analyticsData.reduce((acc, data) => acc + data.ai_confidence, 0) / analyticsData.length;
  
  // Sentiment score
  const sentimentScore = analyticsData.reduce((acc, data) => acc + data.sentiment, 0) / analyticsData.length;
  const sentiment = getSentimentLevel(sentimentScore);
  
  // Simulate real-time data update
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(generateMockData());
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Real-Time Market Analytics</CardTitle>
            <CardDescription>
              Live metrics powered by AI analysis
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={activeCoin} onValueChange={setActiveCoin}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">Bitcoin</SelectItem>
                <SelectItem value="ETH">Ethereum</SelectItem>
                <SelectItem value="SOL">Solana</SelectItem>
                <SelectItem value="BNB">Binance Coin</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1H</SelectItem>
                <SelectItem value="6h">6H</SelectItem>
                <SelectItem value="24h">24H</SelectItem>
                <SelectItem value="7d">7D</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            {/* Price overview */}
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Current Price</div>
              <div className="text-3xl font-bold">${latestData.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              <div className={`flex items-center ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <span className="text-sm font-medium">
                  {priceChange >= 0 ? '↑' : '↓'} ${Math.abs(priceChange).toLocaleString(undefined, { maximumFractionDigits: 2 })} ({priceChangePercent.toFixed(2)}%)
                </span>
                <span className="text-xs text-muted-foreground ml-2">24h</span>
              </div>
            </div>
            
            {/* AI Prediction */}
            <div className="border-l pl-6 space-y-1 hidden md:block">
              <div className="flex items-center text-sm text-muted-foreground">
                <Brain className="h-4 w-4 mr-1" />
                AI Price Prediction
                <div className="relative group ml-1">
                  <ChevronDown className="h-3 w-3" />
                  <div className="absolute bottom-full mb-2 right-0 bg-popover text-popover-foreground p-2 rounded-md shadow-md w-64 opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-10">
                    <div className="text-xs">
                      Prediction based on real-time data analysis using a hybrid AI model with local and cloud processing.
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs">Model source:</span>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant={aiModelSource === 'local' ? 'default' : 'outline'}
                          className="h-6 text-xs"
                          onClick={() => setAiModelSource('local')}
                        >
                          Local
                        </Button>
                        <Button
                          size="sm"
                          variant={aiModelSource === 'cloud' ? 'default' : 'outline'}
                          className="h-6 text-xs"
                          onClick={() => setAiModelSource('cloud')}
                        >
                          Cloud
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xl font-medium">${latestData.ai_prediction.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              <div className="flex items-center">
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full" 
                    style={{ width: `${avgAiConfidence}%` }}
                  ></div>
                </div>
                <span className="text-xs ml-2">{Math.round(avgAiConfidence)}% confident</span>
              </div>
            </div>
            
            {/* Market Sentiment */}
            <div className="border-l pl-6 space-y-1 hidden lg:block">
              <div className="flex items-center text-sm text-muted-foreground">
                <Eye className="h-4 w-4 mr-1" />
                Market Sentiment
              </div>
              <div className={`text-xl font-medium ${sentiment.color}`}>
                {sentiment.level}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                Based on news, social media, and trading patterns
              </div>
            </div>
            
            {/* Risk Analysis */}
            <div className="border-l pl-6 space-y-1 hidden lg:block">
              <div className="flex items-center text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Volatility Index
              </div>
              <div className="text-xl font-medium">
                52
                <span className="text-sm text-muted-foreground ml-2">Moderate</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                4% lower than yesterday
              </div>
            </div>
            
            {/* Volume */}
            <div className="border-l pl-6 space-y-1 hidden lg:block">
              <div className="flex items-center text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4 mr-1" />
                24h Volume
              </div>
              <div className="text-xl font-medium">
                {formatNumber(latestData.volume)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                12% higher than average
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="price">Price Chart</TabsTrigger>
              <TabsTrigger value="indicators">Indicators</TabsTrigger>
              <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="price" className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3b82f6" 
                      name="Price" 
                      dot={false} 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ai_prediction" 
                      stroke="#10b981" 
                      name="AI Prediction" 
                      dot={false} 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Badge variant="outline">MA(50)</Badge>
                <Badge variant="outline">MA(200)</Badge>
                <Badge variant="outline">Bollinger Bands</Badge>
                <Badge variant="outline">Support/Resistance</Badge>
                <Badge variant="outline">+ Add Indicator</Badge>
              </div>
            </TabsContent>
            
            <TabsContent value="indicators" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-72">
                  <h4 className="text-sm font-medium mb-2">RSI (Relative Strength Index)</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="rsi" 
                        stroke="#8884d8" 
                        dot={false} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="x" 
                        stroke="#ff0000" 
                        strokeDasharray="3 3" 
                        dot={false}
                        isAnimationActive={false}
                        legendType="none"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-72">
                  <h4 className="text-sm font-medium mb-2">MACD (Moving Average Convergence Divergence)</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="macd" 
                        stroke="#8884d8" 
                        dot={false} 
                        name="MACD"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="signal" 
                        stroke="#82ca9d" 
                        dot={false} 
                        name="Signal"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="h-72 mt-6">
                <h4 className="text-sm font-medium mb-2">MACD Histogram</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="histogram" 
                      fill="#10b981"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="volume" className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${formatNumber(Number(value))}`} />
                    <Area 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-muted p-4 rounded-md mt-4">
                <h4 className="font-medium mb-2">Volume Analysis</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>24h Volume:</span>
                    <span className="font-medium">{formatNumber(latestData.volume)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>7-day Average Volume:</span>
                    <span className="font-medium">{formatNumber(latestData.volume * 0.9)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Volume Trend:</span>
                    <span className="text-green-500 font-medium">Increasing (+12%)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Buy/Sell Ratio:</span>
                    <span className="font-medium">1.3 (Bullish)</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="sentiment" className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" />
                    <YAxis domain={[-100, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="sentiment" 
                      stroke="#8884d8" 
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">News Sentiment</h4>
                  <div className={`text-xl font-bold ${sentiment.color}`}>
                    {sentiment.level}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on analysis of 100+ news sources
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Social Media Pulse</h4>
                  <div className="text-xl font-bold text-yellow-500">
                    Neutral
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mixed signals from Twitter, Reddit, Discord
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">AI Sentiment Analysis</h4>
                  <div className="text-xl font-bold text-green-500">
                    65% Bullish
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pattern recognition suggests upward momentum
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeMarketAnalytics;
