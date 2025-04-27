
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, BarChart3, PieChart as PieChartIcon, TrendingUp, TrendingDown, RefreshCw, Search, Activity } from "lucide-react";

// Demo data for market sentiment
const MARKET_SENTIMENT_DATA = [
  { date: "Apr 01", fearGreedIndex: 25, btcPrice: 57000, sentiment: "Fear" },
  { date: "Apr 08", fearGreedIndex: 32, btcPrice: 58200, sentiment: "Fear" },
  { date: "Apr 15", fearGreedIndex: 44, btcPrice: 61000, sentiment: "Neutral" },
  { date: "Apr 22", fearGreedIndex: 53, btcPrice: 64500, sentiment: "Neutral" },
  { date: "Apr 29", fearGreedIndex: 68, btcPrice: 68000, sentiment: "Greed" },
  { date: "May 06", fearGreedIndex: 75, btcPrice: 71000, sentiment: "Extreme Greed" },
  { date: "May 13", fearGreedIndex: 60, btcPrice: 69000, sentiment: "Greed" },
  { date: "May 20", fearGreedIndex: 42, btcPrice: 65000, sentiment: "Neutral" },
  { date: "May 27", fearGreedIndex: 28, btcPrice: 59000, sentiment: "Fear" },
  { date: "Jun 03", fearGreedIndex: 20, btcPrice: 55000, sentiment: "Extreme Fear" },
  { date: "Jun 10", fearGreedIndex: 15, btcPrice: 48000, sentiment: "Extreme Fear" },
  { date: "Jun 17", fearGreedIndex: 22, btcPrice: 51000, sentiment: "Extreme Fear" },
  { date: "Jun 24", fearGreedIndex: 35, btcPrice: 54000, sentiment: "Fear" },
  { date: "Jul 01", fearGreedIndex: 48, btcPrice: 58000, sentiment: "Neutral" },
  { date: "Jul 08", fearGreedIndex: 55, btcPrice: 62000, sentiment: "Greed" },
  { date: "Jul 15", fearGreedIndex: 62, btcPrice: 66000, sentiment: "Greed" },
  { date: "Jul 22", fearGreedIndex: 72, btcPrice: 69000, sentiment: "Greed" },
  { date: "Jul 29", fearGreedIndex: 78, btcPrice: 72000, sentiment: "Extreme Greed" },
  { date: "Aug 05", fearGreedIndex: 75, btcPrice: 70000, sentiment: "Extreme Greed" },
  { date: "Aug 12", fearGreedIndex: 66, btcPrice: 68000, sentiment: "Greed" },
  { date: "Aug 19", fearGreedIndex: 58, btcPrice: 66000, sentiment: "Greed" },
  { date: "Aug 26", fearGreedIndex: 52, btcPrice: 64500, sentiment: "Neutral" },
  { date: "Sep 02", fearGreedIndex: 45, btcPrice: 62000, sentiment: "Neutral" },
  { date: "Sep 09", fearGreedIndex: 55, btcPrice: 65000, sentiment: "Greed" },
  { date: "Sep 16", fearGreedIndex: 60, btcPrice: 67000, sentiment: "Greed" },
  { date: "Sep 23", fearGreedIndex: 48, btcPrice: 65000, sentiment: "Neutral" },
  { date: "Sep 30", fearGreedIndex: 42, btcPrice: 63000, sentiment: "Neutral" },
  { date: "Oct 07", fearGreedIndex: 38, btcPrice: 61500, sentiment: "Fear" },
  { date: "Oct 14", fearGreedIndex: 45, btcPrice: 63000, sentiment: "Neutral" },
  { date: "Oct 21", fearGreedIndex: 55, btcPrice: 66000, sentiment: "Greed" },
  { date: "Oct 28", fearGreedIndex: 65, btcPrice: 68000, sentiment: "Greed" },
];

// Social media sentiment data
const SOCIAL_SENTIMENT_DATA = {
  twitter: { positive: 35, neutral: 40, negative: 25 },
  reddit: { positive: 42, neutral: 31, negative: 27 },
  youtube: { positive: 38, neutral: 45, negative: 17 },
  discord: { positive: 45, neutral: 40, negative: 15 }
};

// News sentiment data
const NEWS_SENTIMENT_DATA = [
  { source: "CryptoCentral", sentiment: 65, articles: 42, impact: "high" },
  { source: "CoinDesk", sentiment: 55, articles: 38, impact: "high" },
  { source: "Cointelegraph", sentiment: 60, articles: 35, impact: "medium" },
  { source: "Bitcoin Magazine", sentiment: 75, articles: 28, impact: "medium" },
  { source: "Decrypt", sentiment: 58, articles: 30, impact: "medium" },
  { source: "The Block", sentiment: 50, articles: 25, impact: "low" },
  { source: "Bloomberg Crypto", sentiment: 45, articles: 22, impact: "high" },
  { source: "Forbes Crypto", sentiment: 52, articles: 20, impact: "medium" },
];

// Token-specific sentiment data
const TOKEN_SENTIMENT_DATA = [
  { name: "Bitcoin", symbol: "BTC", sentiment: 68, change: 5, price: 61245.32, volume: "High" },
  { name: "Ethereum", symbol: "ETH", sentiment: 72, change: 8, price: 3010.45, volume: "High" },
  { name: "Solana", symbol: "SOL", sentiment: 75, change: 12, price: 142.87, volume: "High" },
  { name: "Cardano", symbol: "ADA", sentiment: 48, change: -5, price: 0.45, volume: "Medium" },
  { name: "XRP", symbol: "XRP", sentiment: 55, change: 2, price: 0.57, volume: "Medium" },
  { name: "Polkadot", symbol: "DOT", sentiment: 62, change: 4, price: 6.85, volume: "Low" },
  { name: "Avalanche", symbol: "AVAX", sentiment: 68, change: 9, price: 28.45, volume: "Medium" },
  { name: "Chainlink", symbol: "LINK", sentiment: 70, change: 7, price: 14.23, volume: "Low" },
];

// Trending topics data
const TRENDING_TOPICS = [
  { topic: "Ethereum scaling", mentions: 3245, sentiment: 72 },
  { topic: "Bitcoin ETF", mentions: 2876, sentiment: 65 },
  { topic: "DeFi yield", mentions: 1932, sentiment: 58 },
  { topic: "NFT market", mentions: 1578, sentiment: 45 },
  { topic: "Regulatory news", mentions: 1432, sentiment: 38 },
  { topic: "Layer 2 solutions", mentions: 1245, sentiment: 70 },
  { topic: "Meme coins", mentions: 1088, sentiment: 62 },
  { topic: "Web3 gaming", mentions: 965, sentiment: 68 },
];

// Colors for sentiment ranges
const sentimentColors = {
  "Extreme Fear": "#ef4444",
  "Fear": "#f97316",
  "Neutral": "#eab308",
  "Greed": "#22c55e",
  "Extreme Greed": "#10b981"
};

// Get color based on sentiment score
const getSentimentColor = (score: number) => {
  if (score < 25) return "#ef4444"; // Extreme Fear - Red
  if (score < 45) return "#f97316"; // Fear - Orange
  if (score < 55) return "#eab308"; // Neutral - Yellow
  if (score < 75) return "#22c55e"; // Greed - Light Green
  return "#10b981"; // Extreme Greed - Green
};

// Get sentiment text based on score
const getSentimentText = (score: number) => {
  if (score < 25) return "Extreme Fear";
  if (score < 45) return "Fear";
  if (score < 55) return "Neutral";
  if (score < 75) return "Greed";
  return "Extreme Greed";
};

const MarketSentimentAnalysis = () => {
  const [timeframe, setTimeframe] = useState<string>("90d");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [currentFearGreedIndex, setCurrentFearGreedIndex] = useState<number>(55);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Current day's data (last item from the array)
  const currentDayData = MARKET_SENTIMENT_DATA[MARKET_SENTIMENT_DATA.length - 1];
  
  // Calculate average sentiment metrics
  const averageSentiment = TOKEN_SENTIMENT_DATA.reduce((acc, token) => acc + token.sentiment, 0) / TOKEN_SENTIMENT_DATA.length;
  const socialMediaPositive = (SOCIAL_SENTIMENT_DATA.twitter.positive + SOCIAL_SENTIMENT_DATA.reddit.positive + 
                              SOCIAL_SENTIMENT_DATA.youtube.positive + SOCIAL_SENTIMENT_DATA.discord.positive) / 4;
  
  // Filter token data based on search query
  const filteredTokenData = TOKEN_SENTIMENT_DATA.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Simulate data loading on refresh
  const handleRefresh = () => {
    setIsUpdating(true);
    setTimeout(() => {
      // Simulate a slight change in the current fear & greed index
      const newIndex = Math.min(100, Math.max(0, currentFearGreedIndex + Math.floor(Math.random() * 11) - 5));
      setCurrentFearGreedIndex(newIndex);
      setIsUpdating(false);
    }, 1000);
  };
  
  // Format social sentiment data for pie chart
  const formatSocialSentimentData = (platform: keyof typeof SOCIAL_SENTIMENT_DATA) => [
    { name: "Positive", value: SOCIAL_SENTIMENT_DATA[platform].positive },
    { name: "Neutral", value: SOCIAL_SENTIMENT_DATA[platform].neutral },
    { name: "Negative", value: SOCIAL_SENTIMENT_DATA[platform].negative }
  ];
  
  // Colors for sentiment pie chart
  const SENTIMENT_PIE_COLORS = ["#22c55e", "#eab308", "#ef4444"];
  
  useEffect(() => {
    // Set the current fear & greed index from the data when component mounts
    setCurrentFearGreedIndex(currentDayData.fearGreedIndex);
  }, []);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Market Sentiment Analysis
            </CardTitle>
            <CardDescription>
              Comprehensive analysis of market mood and social sentiment
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="180d">180 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className={`h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Fear & Greed Index Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Index */}
          <div className="p-4 border rounded-md">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">Fear & Greed Index</h3>
              <Badge 
                variant="outline" 
                className="text-xs" 
                style={{ backgroundColor: getSentimentColor(currentFearGreedIndex), color: 'white' }}
              >
                {getSentimentText(currentFearGreedIndex)}
              </Badge>
            </div>
            
            <div className="relative h-10 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full transition-all duration-500 ease-in-out"
                style={{ 
                  width: `${currentFearGreedIndex}%`, 
                  backgroundColor: getSentimentColor(currentFearGreedIndex) 
                }}
              />
              <div 
                className="absolute top-0 h-full w-1 bg-white border-l border-r border-gray-300 transition-all duration-500"
                style={{ left: `${currentFearGreedIndex}%`, transform: "translateX(-50%)" }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Extreme Fear</span>
              <span>Extreme Greed</span>
            </div>
          </div>
          
          {/* Social Media Sentiment */}
          <div className="p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Social Media Sentiment</h3>
            <div className="flex items-center">
              <div className="w-full">
                <div className="flex h-4 mb-1">
                  <div 
                    className="bg-green-500 rounded-l"
                    style={{ width: `${socialMediaPositive}%` }}
                  />
                  <div 
                    className="bg-yellow-400" 
                    style={{ 
                      width: `${(SOCIAL_SENTIMENT_DATA.twitter.neutral + 
                              SOCIAL_SENTIMENT_DATA.reddit.neutral + 
                              SOCIAL_SENTIMENT_DATA.youtube.neutral + 
                              SOCIAL_SENTIMENT_DATA.discord.neutral) / 4}%` 
                    }}
                  />
                  <div 
                    className="bg-red-500 rounded-r"
                    style={{ 
                      width: `${(SOCIAL_SENTIMENT_DATA.twitter.negative + 
                              SOCIAL_SENTIMENT_DATA.reddit.negative + 
                              SOCIAL_SENTIMENT_DATA.youtube.negative + 
                              SOCIAL_SENTIMENT_DATA.discord.negative) / 4}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-green-500">{Math.round(socialMediaPositive)}% Positive</span>
                  <span className="text-red-500">
                    {Math.round((SOCIAL_SENTIMENT_DATA.twitter.negative + 
                              SOCIAL_SENTIMENT_DATA.reddit.negative + 
                              SOCIAL_SENTIMENT_DATA.youtube.negative + 
                              SOCIAL_SENTIMENT_DATA.discord.negative) / 4)}% Negative
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Aggregated from Twitter, Reddit, Discord, and Youtube
            </div>
          </div>
          
          {/* Average Token Sentiment */}
          <div className="p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-1">Market Indicators</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">Avg. Token Sentiment</div>
                <div className="text-lg font-medium">
                  {averageSentiment.toFixed(1)}/100
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">News Sentiment</div>
                <div className="text-lg font-medium">
                  {(NEWS_SENTIMENT_DATA.reduce((acc, item) => acc + item.sentiment, 0) / NEWS_SENTIMENT_DATA.length).toFixed(1)}/100
                </div>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">Top Trending Topic</div>
              <div className="text-sm font-medium">{TRENDING_TOPICS[0].topic} <span className="text-green-500">(+{TRENDING_TOPICS[0].sentiment}%)</span></div>
            </div>
          </div>
        </div>
        
        {/* Tab Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4 mr-1 hidden sm:inline" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="social" className="text-xs sm:text-sm">
              <PieChartIcon className="h-4 w-4 mr-1 hidden sm:inline" />
              Social Sentiment
            </TabsTrigger>
            <TabsTrigger value="token" className="text-xs sm:text-sm">
              <TrendingUp className="h-4 w-4 mr-1 hidden sm:inline" />
              Token Analysis
            </TabsTrigger>
            <TabsTrigger value="news" className="text-xs sm:text-sm">
              <TrendingDown className="h-4 w-4 mr-1 hidden sm:inline" />
              News Impact
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Fear & Greed Index vs. BTC Price</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MARKET_SENTIMENT_DATA}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="btcPrice" name="BTC Price (USD)" stroke="#f7931a" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="fearGreedIndex" name="Fear & Greed Index" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Sentiment Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Extreme Fear", value: MARKET_SENTIMENT_DATA.filter(d => d.fearGreedIndex < 25).length },
                            { name: "Fear", value: MARKET_SENTIMENT_DATA.filter(d => d.fearGreedIndex >= 25 && d.fearGreedIndex < 45).length },
                            { name: "Neutral", value: MARKET_SENTIMENT_DATA.filter(d => d.fearGreedIndex >= 45 && d.fearGreedIndex < 55).length },
                            { name: "Greed", value: MARKET_SENTIMENT_DATA.filter(d => d.fearGreedIndex >= 55 && d.fearGreedIndex < 75).length },
                            { name: "Extreme Greed", value: MARKET_SENTIMENT_DATA.filter(d => d.fearGreedIndex >= 75).length }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {Object.keys(sentimentColors).map((key, index) => (
                            <Cell key={`cell-${index}`} fill={sentimentColors[key as keyof typeof sentimentColors]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} days`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Market Cycle Analysis</h3>
                  <div className="flex items-center justify-center h-64">
                    <div className="w-full max-w-md space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Current Market Sentiment</span>
                          <span 
                            className="text-sm font-medium"
                            style={{ color: getSentimentColor(currentDayData.fearGreedIndex) }}
                          >
                            {getSentimentText(currentDayData.fearGreedIndex)}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full"
                            style={{ 
                              width: `${currentDayData.fearGreedIndex}%`,
                              backgroundColor: getSentimentColor(currentDayData.fearGreedIndex)
                            }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">30-Day Average Sentiment</span>
                          <span 
                            className="text-sm font-medium"
                            style={{ 
                              color: getSentimentColor(
                                MARKET_SENTIMENT_DATA.slice(-30).reduce((acc, item) => acc + item.fearGreedIndex, 0) / 30
                              ) 
                            }}
                          >
                            {getSentimentText(
                              MARKET_SENTIMENT_DATA.slice(-30).reduce((acc, item) => acc + item.fearGreedIndex, 0) / 30
                            )}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full"
                            style={{ 
                              width: `${MARKET_SENTIMENT_DATA.slice(-30).reduce((acc, item) => acc + item.fearGreedIndex, 0) / 30}%`,
                              backgroundColor: getSentimentColor(
                                MARKET_SENTIMENT_DATA.slice(-30).reduce((acc, item) => acc + item.fearGreedIndex, 0) / 30
                              )
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-md mt-4">
                        <h4 className="text-sm font-medium">Market Cycle Interpretation</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {currentDayData.fearGreedIndex > 70 ? 
                            "The market is currently in a state of Extreme Greed, which historically suggests a potential correction may be coming. Assets may be overbought." :
                          currentDayData.fearGreedIndex > 55 ?
                            "The market is currently showing Greed, indicating bullish sentiment and potentially strong upward momentum. Be cautious of FOMO-driven decisions." :
                          currentDayData.fearGreedIndex > 45 ?
                            "The market is currently in a Neutral state, showing balanced sentiment. This may indicate a period of consolidation or uncertainty." :
                          currentDayData.fearGreedIndex > 25 ?
                            "The market is currently in a state of Fear, which historically can present buying opportunities as assets may be undervalued." :
                            "The market is currently in Extreme Fear, which often suggests a potential bottom may be forming. Historically, this has presented good long-term buying opportunities."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Top Trending Topics</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Topic</th>
                        <th className="text-right py-2">Mentions</th>
                        <th className="text-right py-2">Sentiment</th>
                        <th className="text-right py-2">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TRENDING_TOPICS.map((topic, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2.5">{topic.topic}</td>
                          <td className="text-right py-2.5">{topic.mentions.toLocaleString()}</td>
                          <td className="text-right py-2.5">
                            <span 
                              className="font-medium"
                              style={{color: getSentimentColor(topic.sentiment)}}
                            >
                              {topic.sentiment}/100
                            </span>
                          </td>
                          <td className="text-right py-2.5">
                            {Math.random() > 0.5 ? (
                              <span className="flex items-center justify-end text-green-500">
                                <ArrowUp className="h-3 w-3 mr-1" />
                                {Math.floor(Math.random() * 20) + 1}%
                              </span>
                            ) : (
                              <span className="flex items-center justify-end text-red-500">
                                <ArrowDown className="h-3 w-3 mr-1" />
                                {Math.floor(Math.random() * 20) + 1}%
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Social Sentiment Tab */}
          <TabsContent value="social">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Twitter Sentiment</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={formatSocialSentimentData('twitter')}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {formatSocialSentimentData('twitter').map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SENTIMENT_PIE_COLORS[index % SENTIMENT_PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-center text-muted-foreground mt-2">
                    Based on analysis of 245,780 tweets
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Reddit Sentiment</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={formatSocialSentimentData('reddit')}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {formatSocialSentimentData('reddit').map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SENTIMENT_PIE_COLORS[index % SENTIMENT_PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-center text-muted-foreground mt-2">
                    Based on analysis of 152,340 posts and comments
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Youtube Sentiment</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={formatSocialSentimentData('youtube')}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {formatSocialSentimentData('youtube').map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SENTIMENT_PIE_COLORS[index % SENTIMENT_PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-center text-muted-foreground mt-2">
                    Based on analysis of 58,920 comments
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Discord Sentiment</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={formatSocialSentimentData('discord')}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {formatSocialSentimentData('discord').map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SENTIMENT_PIE_COLORS[index % SENTIMENT_PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-center text-muted-foreground mt-2">
                    Based on analysis of 78,450 messages
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Sentiment by Platform</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          platform: "Twitter",
                          positive: SOCIAL_SENTIMENT_DATA.twitter.positive,
                          neutral: SOCIAL_SENTIMENT_DATA.twitter.neutral,
                          negative: SOCIAL_SENTIMENT_DATA.twitter.negative
                        },
                        {
                          platform: "Reddit",
                          positive: SOCIAL_SENTIMENT_DATA.reddit.positive,
                          neutral: SOCIAL_SENTIMENT_DATA.reddit.neutral,
                          negative: SOCIAL_SENTIMENT_DATA.reddit.negative
                        },
                        {
                          platform: "Youtube",
                          positive: SOCIAL_SENTIMENT_DATA.youtube.positive,
                          neutral: SOCIAL_SENTIMENT_DATA.youtube.neutral,
                          negative: SOCIAL_SENTIMENT_DATA.youtube.negative
                        },
                        {
                          platform: "Discord",
                          positive: SOCIAL_SENTIMENT_DATA.discord.positive,
                          neutral: SOCIAL_SENTIMENT_DATA.discord.neutral,
                          negative: SOCIAL_SENTIMENT_DATA.discord.negative
                        }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="platform" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Legend />
                      <Bar dataKey="positive" name="Positive" stackId="a" fill="#22c55e" />
                      <Bar dataKey="neutral" name="Neutral" stackId="a" fill="#eab308" />
                      <Bar dataKey="negative" name="Negative" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Token Analysis Tab */}
          <TabsContent value="token">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input 
                  placeholder="Search for a token..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Token</th>
                      <th className="text-right p-3">Price</th>
                      <th className="text-right p-3">Sentiment Score</th>
                      <th className="text-right p-3">24h Change</th>
                      <th className="text-right p-3">Social Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTokenData.map((token, index) => (
                      <tr key={index} className={index < filteredTokenData.length - 1 ? "border-b" : ""}>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                              {token.symbol.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{token.name}</div>
                              <div className="text-xs text-muted-foreground">{token.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right p-3 font-medium">
                          ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="text-right p-3">
                          <div className="inline-block w-32">
                            <div className="flex justify-between mb-1">
                              <span 
                                className="text-xs font-medium"
                                style={{ color: getSentimentColor(token.sentiment) }}
                              >
                                {token.sentiment}/100
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full"
                                style={{ 
                                  width: `${token.sentiment}%`,
                                  backgroundColor: getSentimentColor(token.sentiment)
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="text-right p-3">
                          <span className={token.change >= 0 ? "text-green-500" : "text-red-500"}>
                            {token.change >= 0 ? "+" : ""}{token.change}%
                          </span>
                        </td>
                        <td className="text-right p-3">
                          <Badge variant="outline">{token.volume}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Sentiment vs. Price Correlation</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                          type="number" 
                          dataKey="sentiment" 
                          name="Sentiment" 
                          domain={[0, 100]}
                          label={{ value: "Sentiment Score", position: "bottom", offset: 0 }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="change" 
                          name="Price Change" 
                          domain={[-15, 15]}
                          label={{ value: "24h Change (%)", angle: -90, position: "left" }}
                        />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Legend />
                        {TOKEN_SENTIMENT_DATA.map((token, index) => (
                          <Scatter 
                            key={index} 
                            name={token.symbol} 
                            data={[token]} 
                            fill={getSentimentColor(token.sentiment)} 
                          />
                        ))}
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Token Sentiment Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { day: "Oct 22", BTC: 62, ETH: 65, SOL: 68 },
                          { day: "Oct 23", BTC: 64, ETH: 68, SOL: 72 },
                          { day: "Oct 24", BTC: 65, ETH: 70, SOL: 74 },
                          { day: "Oct 25", BTC: 67, ETH: 71, SOL: 72 },
                          { day: "Oct 26", BTC: 66, ETH: 72, SOL: 73 },
                          { day: "Oct 27", BTC: 68, ETH: 72, SOL: 74 },
                          { day: "Oct 28", BTC: 68, ETH: 72, SOL: 75 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="day" />
                        <YAxis domain={[50, 80]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="BTC" name="Bitcoin" stroke="#f7931a" strokeWidth={2} />
                        <Line type="monotone" dataKey="ETH" name="Ethereum" stroke="#627eea" strokeWidth={2} />
                        <Line type="monotone" dataKey="SOL" name="Solana" stroke="#00ffa3" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* News Impact Tab */}
          <TabsContent value="news">
            <div className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">News Source Sentiment Analysis</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={NEWS_SENTIMENT_DATA}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="source" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value, name) => [name === "sentiment" ? `${value}/100` : value, name === "sentiment" ? "Sentiment Score" : "Articles"]} />
                      <Legend />
                      <Bar 
                        dataKey="sentiment" 
                        name="Sentiment Score" 
                        fill="#10b981"
                      >
                        {NEWS_SENTIMENT_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getSentimentColor(entry.sentiment)} />
                        ))}
                      </Bar>
                      <Bar dataKey="articles" name="Articles Count" fill="#94a3b8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4 col-span-1 md:col-span-2">
                  <h3 className="font-medium mb-4">News Sentiment Impact</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { date: "Oct 22", sentiment: 58, btcPrice: 59000 },
                          { date: "Oct 23", sentiment: 62, btcPrice: 61000 },
                          { date: "Oct 24", sentiment: 60, btcPrice: 60500 },
                          { date: "Oct 25", sentiment: 65, btcPrice: 62800 },
                          { date: "Oct 26", sentiment: 68, btcPrice: 64500 },
                          { date: "Oct 27", sentiment: 72, btcPrice: 67000 },
                          { date: "Oct 28", sentiment: 65, btcPrice: 68000 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Area yAxisId="left" type="monotone" dataKey="btcPrice" name="BTC Price" stroke="#f7931a" fill="#f7931a" fillOpacity={0.1} />
                        <Area yAxisId="right" type="monotone" dataKey="sentiment" name="News Sentiment" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Top News Keywords</h3>
                  <div className="space-y-3">
                    {[
                      { keyword: "regulation", count: 245, sentiment: 42 },
                      { keyword: "Bitcoin ETF", count: 187, sentiment: 75 },
                      { keyword: "adoption", count: 164, sentiment: 82 },
                      { keyword: "inflation", count: 142, sentiment: 48 },
                      { keyword: "upgrade", count: 118, sentiment: 70 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-1 h-8 rounded-full mr-2" style={{ backgroundColor: getSentimentColor(item.sentiment) }} />
                          <div>
                            <div className="font-medium">{item.keyword}</div>
                            <div className="text-xs text-muted-foreground">{item.count} mentions</div>
                          </div>
                        </div>
                        <div 
                          className="text-xs font-medium"
                          style={{ color: getSentimentColor(item.sentiment) }}
                        >
                          {item.sentiment}/100
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Recent Market-Moving News</h3>
                <div className="space-y-3">
                  {[
                    { 
                      headline: "Major Bank Announces Cryptocurrency Custody Services for Institutional Clients", 
                      source: "Bloomberg Crypto",
                      timestamp: "2 hours ago",
                      sentiment: 78,
                      impact: "high"
                    },
                    { 
                      headline: "Regulatory Body Issues New Guidelines for Cryptocurrency Exchanges", 
                      source: "CoinDesk",
                      timestamp: "5 hours ago",
                      sentiment: 45,
                      impact: "high"
                    },
                    { 
                      headline: "Leading Tech Company Adds Bitcoin to Corporate Treasury", 
                      source: "CryptoCentral",
                      timestamp: "8 hours ago",
                      sentiment: 82,
                      impact: "medium"
                    },
                    { 
                      headline: "Major Protocol Upgrade Successfully Implemented for Top Altcoin", 
                      source: "Cointelegraph",
                      timestamp: "12 hours ago",
                      sentiment: 72,
                      impact: "medium"
                    },
                    { 
                      headline: "Central Bank Official Comments on Digital Currency Development", 
                      source: "Forbes Crypto",
                      timestamp: "1 day ago",
                      sentiment: 60,
                      impact: "low"
                    }
                  ].map((item, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.headline}</h4>
                        <Badge 
                          variant="outline" 
                          className="ml-2"
                          style={{
                            backgroundColor: 
                              item.impact === "high" ? "#ef4444" : 
                              item.impact === "medium" ? "#f97316" : 
                              "#eab308",
                            color: "white"
                          }}
                        >
                          {item.impact} impact
                        </Badge>
                      </div>
                      <div className="flex justify-between mt-2">
                        <div className="text-xs text-muted-foreground">
                          {item.source} • {item.timestamp}
                        </div>
                        <div 
                          className="text-xs font-medium"
                          style={{ color: getSentimentColor(item.sentiment) }}
                        >
                          Sentiment: {item.sentiment}/100
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
        Data sources: CryptoFear & Greed Index, Twitter, Reddit, Youtube, Discord, 25+ news outlets
      </CardFooter>
    </Card>
  );
};

interface ScatterChartProps {
  children?: React.ReactNode;
}

// Fake ScatterChart component for TypeScript - will be provided by recharts
const ScatterChart: React.FC<ScatterChartProps> = ({ children }) => {
  return <div>{children}</div>;
};

// Fake Scatter component for TypeScript - will be provided by recharts
const Scatter: React.FC<any> = () => {
  return null;
};

export default MarketSentimentAnalysis;
