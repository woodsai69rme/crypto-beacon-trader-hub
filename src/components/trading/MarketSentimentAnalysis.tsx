
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MarketSentimentAnalysisProps {
  className?: string;
}

interface SentimentData {
  date: string;
  social: number;
  news: number;
  onchain: number;
  technical: number;
  overall: number;
  twitterVolume?: number;
  redditPosts?: number;
  newsArticles?: number;
  addressActivity?: number;
  whale?: number;
}

interface SentimentInsight {
  type: 'positive' | 'negative' | 'neutral';
  source: 'social' | 'news' | 'onchain' | 'technical';
  text: string;
  strength: number; // 0-100
}

const MarketSentimentAnalysis: React.FC<MarketSentimentAnalysisProps> = ({ className }) => {
  const [coin, setCoin] = useState<string>("bitcoin");
  const [timeframe, setTimeframe] = useState<string>("7d");
  const [loading, setLoading] = useState<boolean>(false);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [insights, setInsights] = useState<SentimentInsight[]>([]);
  const [overallScore, setOverallScore] = useState<number>(50);
  
  useEffect(() => {
    fetchSentimentData();
  }, [coin, timeframe]);
  
  const fetchSentimentData = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would fetch from an API
      // Using mock data for demonstration
      const mockData = generateMockSentimentData(coin, timeframe);
      setSentimentData(mockData.data);
      setInsights(mockData.insights);
      setOverallScore(mockData.overallScore);
      
      toast({
        title: "Sentiment Analysis Updated",
        description: `${coin.toUpperCase()} sentiment data for ${timeframe} timeframe`
      });
    } catch (error) {
      console.error("Error fetching sentiment data:", error);
      toast({
        title: "Analysis Error",
        description: "Failed to fetch market sentiment data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const generateMockSentimentData = (coin: string, timeframe: string) => {
    const days = timeframe === "1d" ? 24 : 
               timeframe === "7d" ? 7 : 
               timeframe === "30d" ? 30 : 14;
               
    const interval = timeframe === "1d" ? "hour" : "day";
    const data: SentimentData[] = [];
    
    // Base sentiment values (slightly different for each coin)
    const baseSentiment = {
      bitcoin: { social: 65, news: 60, onchain: 70, technical: 55 },
      ethereum: { social: 70, news: 65, onchain: 60, technical: 65 },
      solana: { social: 75, news: 60, onchain: 55, technical: 70 },
      cardano: { social: 60, news: 55, onchain: 50, technical: 60 },
    };
    
    const base = (baseSentiment as any)[coin] || { social: 60, news: 60, onchain: 60, technical: 60 };
    
    // Generate time series data
    for (let i = 0; i < days; i++) {
      const date = new Date();
      if (interval === "hour") {
        date.setHours(date.getHours() - (days - i - 1));
      } else {
        date.setDate(date.getDate() - (days - i - 1));
      }
      
      // Add some randomness to sentiment values
      const random = () => Math.random() * 20 - 10; // -10 to +10
      const social = Math.max(0, Math.min(100, base.social + random()));
      const news = Math.max(0, Math.min(100, base.news + random()));
      const onchain = Math.max(0, Math.min(100, base.onchain + random()));
      const technical = Math.max(0, Math.min(100, base.technical + random()));
      
      // Overall is a weighted average
      const overall = (social * 0.3) + (news * 0.2) + (onchain * 0.25) + (technical * 0.25);
      
      data.push({
        date: interval === "hour" ? 
          `${date.getHours()}:00` : 
          date.toISOString().split('T')[0],
        social,
        news,
        onchain,
        technical,
        overall,
        twitterVolume: Math.floor(Math.random() * 10000 + 5000),
        redditPosts: Math.floor(Math.random() * 500 + 100),
        newsArticles: Math.floor(Math.random() * 50 + 10),
        addressActivity: Math.floor(Math.random() * 1000 + 500),
        whale: Math.floor(Math.random() * 10 + 1)
      });
    }
    
    // Generate insights
    const insights: SentimentInsight[] = [];
    const insightTemplates = [
      { type: 'positive', source: 'social', text: 'Positive social media sentiment with increasing mentions' },
      { type: 'positive', source: 'news', text: 'Recent news coverage highlights bullish developments' },
      { type: 'positive', source: 'onchain', text: 'Whale accumulation detected in the last 24 hours' },
      { type: 'positive', source: 'technical', text: 'Strong buy signals from multiple technical indicators' },
      { type: 'negative', source: 'social', text: 'Declining social sentiment with bearish sentiment shift' },
      { type: 'negative', source: 'news', text: 'Regulatory concerns highlighted in recent news' },
      { type: 'negative', source: 'onchain', text: 'Exchange inflows increasing, potential selling pressure' },
      { type: 'negative', source: 'technical', text: 'Multiple resistance levels likely to cap upside' },
      { type: 'neutral', source: 'social', text: 'Mixed signals on social media, no clear sentiment' },
      { type: 'neutral', source: 'news', text: 'Balanced news coverage with no dominant narrative' },
      { type: 'neutral', source: 'onchain', text: 'Normal network activity with no significant changes' },
      { type: 'neutral', source: 'technical', text: 'Rangebound trading likely to continue' }
    ];
    
    // Get the latest sentiment values
    const latest = data[data.length - 1];
    
    // Generate 4-6 insights based on latest sentiment values
    const numInsights = Math.floor(Math.random() * 3) + 4; // 4-6 insights
    
    for (let i = 0; i < numInsights; i++) {
      const sourceTypes = ['social', 'news', 'onchain', 'technical'];
      const source = sourceTypes[i % sourceTypes.length] as 'social' | 'news' | 'onchain' | 'technical';
      
      // Determine sentiment type based on the score
      let type: 'positive' | 'negative' | 'neutral';
      const score = latest[source];
      
      if (score > 65) type = 'positive';
      else if (score < 45) type = 'negative';
      else type = 'neutral';
      
      // Find a matching template
      const matchingTemplates = insightTemplates.filter(
        template => template.source === source && template.type === type
      );
      
      if (matchingTemplates.length > 0) {
        const template = matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)];
        insights.push({
          type: template.type as 'positive' | 'negative' | 'neutral',
          source: template.source as 'social' | 'news' | 'onchain' | 'technical',
          text: template.text,
          strength: score
        });
      }
    }
    
    // Calculate overall score as average of latest sentiment values
    const overallScore = Math.round(latest.overall);
    
    return {
      data,
      insights,
      overallScore
    };
  };
  
  const getSentimentScoreColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 55) return "bg-lime-500";
    if (score >= 45) return "bg-amber-500";
    if (score >= 30) return "bg-orange-500";
    return "bg-red-500";
  };
  
  const getSentimentLabel = (score: number) => {
    if (score >= 70) return "Very Bullish";
    if (score >= 55) return "Bullish";
    if (score >= 45) return "Neutral";
    if (score >= 30) return "Bearish";
    return "Very Bearish";
  };
  
  const getInsightBadgeColor = (type: string) => {
    if (type === 'positive') return "bg-green-500";
    if (type === 'negative') return "bg-red-500";
    return "bg-amber-500";
  };
  
  const handleRefresh = () => {
    fetchSentimentData();
  };
  
  const formatTooltipValue = (value: number) => {
    return `${Math.round(value)}%`;
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <CardTitle>Market Sentiment Analysis</CardTitle>
            <CardDescription>Multi-source sentiment for market prediction</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={coin} onValueChange={setCoin}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="cardano">Cardano</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="14d">14 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={loading}
              className={loading ? "animate-spin" : ""}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sentimentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4285f4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4285f4" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorNews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea4335" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ea4335" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorOnchain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbc05" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#fbbc05" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorTechnical" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34a853" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#34a853" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={formatTooltipValue} />
                  <Legend />
                  <Area type="monotone" dataKey="social" stroke="#4285f4" fillOpacity={1} fill="url(#colorSocial)" />
                  <Area type="monotone" dataKey="news" stroke="#ea4335" fillOpacity={1} fill="url(#colorNews)" />
                  <Area type="monotone" dataKey="onchain" stroke="#fbbc05" fillOpacity={1} fill="url(#colorOnchain)" />
                  <Area type="monotone" dataKey="technical" stroke="#34a853" fillOpacity={1} fill="url(#colorTechnical)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              {sentimentData.length > 0 && (
                <>
                  <div className="p-3 border rounded">
                    <div className="text-xs font-medium mb-1">Social</div>
                    <Progress value={sentimentData[sentimentData.length - 1].social} className="bg-muted h-2" />
                    <div className="text-sm mt-1">{Math.round(sentimentData[sentimentData.length - 1].social)}%</div>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <div className="text-xs font-medium mb-1">News</div>
                    <Progress value={sentimentData[sentimentData.length - 1].news} className="bg-muted h-2" />
                    <div className="text-sm mt-1">{Math.round(sentimentData[sentimentData.length - 1].news)}%</div>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <div className="text-xs font-medium mb-1">On-chain</div>
                    <Progress value={sentimentData[sentimentData.length - 1].onchain} className="bg-muted h-2" />
                    <div className="text-sm mt-1">{Math.round(sentimentData[sentimentData.length - 1].onchain)}%</div>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <div className="text-xs font-medium mb-1">Technical</div>
                    <Progress value={sentimentData[sentimentData.length - 1].technical} className="bg-muted h-2" />
                    <div className="text-sm mt-1">{Math.round(sentimentData[sentimentData.length - 1].technical)}%</div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Overall Sentiment</div>
              <div className="flex items-center gap-3">
                <Progress value={overallScore} className={`${getSentimentScoreColor(overallScore)} h-3`} />
                <span className="text-sm font-medium">{overallScore}%</span>
              </div>
              <div className="text-sm mt-1">{getSentimentLabel(overallScore)}</div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="text-sm font-medium mb-2">Sentiment Insights</div>
              <div className="space-y-3">
                {insights.map((insight, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Badge className={getInsightBadgeColor(insight.type)} variant="secondary">
                      {insight.source}
                    </Badge>
                    <div className="text-sm">{insight.text}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {sentimentData.length > 0 && sentimentData[sentimentData.length - 1].twitterVolume && (
              <div className="border rounded-md p-3 mt-4">
                <div className="text-sm font-medium mb-2">Social Activity</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs">
                    <div className="text-muted-foreground">Twitter Volume</div>
                    <div className="font-medium">{sentimentData[sentimentData.length - 1].twitterVolume?.toLocaleString()}</div>
                  </div>
                  <div className="text-xs">
                    <div className="text-muted-foreground">Reddit Posts</div>
                    <div className="font-medium">{sentimentData[sentimentData.length - 1].redditPosts?.toLocaleString()}</div>
                  </div>
                  <div className="text-xs">
                    <div className="text-muted-foreground">News Articles</div>
                    <div className="font-medium">{sentimentData[sentimentData.length - 1].newsArticles?.toLocaleString()}</div>
                  </div>
                  <div className="text-xs">
                    <div className="text-muted-foreground">Whale Transactions</div>
                    <div className="font-medium">{sentimentData[sentimentData.length - 1].whale?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketSentimentAnalysis;
