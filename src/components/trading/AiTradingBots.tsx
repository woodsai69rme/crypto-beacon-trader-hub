
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bot, ChevronRight, Clock, Filter, MoreHorizontal, PlusCircle, Search, Settings, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AITradingStrategy } from "@/types/trading";
import { Progress } from "@/components/ui/progress";

const mockBots: AITradingStrategy[] = [
  {
    id: "bot-1",
    name: "Mean Reversion ETH",
    description: "Trades ETH based on mean reversion strategy with Bollinger Bands",
    type: "mean-reversion",
    timeframe: "4h",
    parameters: {
      bbPeriod: 20,
      bbDeviation: 2,
      rsiPeriod: 14,
      rsiOverbought: 70,
      rsiOversold: 30,
      stopLossPercentage: 2.5,
      takeProfitPercentage: 4.0
    },
    creator: "system",
    tags: ["ethereum", "mean-reversion", "oscillator"],
    riskLevel: "medium",
    performance: {
      totalReturn: 8.4,
      winRate: 68,
      sharpeRatio: 1.2
    }
  },
  {
    id: "bot-2",
    name: "BTC MACD Trend",
    description: "Bitcoin trend following strategy based on MACD crosses",
    type: "trend-following",
    timeframe: "1d",
    parameters: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      stopLossPercentage: 5,
      takeProfitPercentage: 15
    },
    creator: "system",
    tags: ["bitcoin", "trend", "macd"],
    riskLevel: "medium",
    performance: {
      totalReturn: 12.7,
      winRate: 59,
      sharpeRatio: 1.4
    }
  },
  {
    id: "bot-3",
    name: "Sentiment Analyzer",
    description: "Uses news and social media sentiment to predict market movements",
    type: "sentiment",
    timeframe: "1d",
    parameters: {
      newsWeight: 0.6,
      socialMediaWeight: 0.4,
      sentimentThreshold: 0.65,
      minConfidence: 70
    },
    creator: "system",
    tags: ["market-wide", "sentiment", "news"],
    riskLevel: "high",
  }
];

const strategyTypes = [
  { value: "trend-following", label: "Trend Following" },
  { value: "mean-reversion", label: "Mean Reversion" },
  { value: "breakout", label: "Breakout" },
  { value: "sentiment", label: "Sentiment" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "multi-timeframe", label: "Multi-Timeframe" }
];

const timeframes = [
  { value: "5m", label: "5 minutes" },
  { value: "15m", label: "15 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "4h", label: "4 hours" },
  { value: "1d", label: "1 day" }
];

const AiTradingBots: React.FC = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBots, setFilteredBots] = useState<AITradingStrategy[]>(mockBots);
  const [selectedStrategyType, setSelectedStrategyType] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string | null>(null);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedStrategyType, selectedTimeframe);
  };
  
  const handleStrategyTypeChange = (type: string) => {
    setSelectedStrategyType(type === "all" ? null : type);
    applyFilters(searchQuery, type === "all" ? null : type, selectedTimeframe);
  };
  
  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe === "all" ? null : timeframe);
    applyFilters(searchQuery, selectedStrategyType, timeframe === "all" ? null : timeframe);
  };
  
  const applyFilters = (query: string, strategyType: string | null, timeframe: string | null) => {
    let filtered = [...mockBots];
    
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(bot => 
        bot.name.toLowerCase().includes(lowercaseQuery) || 
        bot.description.toLowerCase().includes(lowercaseQuery) ||
        bot.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    if (strategyType) {
      filtered = filtered.filter(bot => bot.type === strategyType);
    }
    
    if (timeframe) {
      filtered = filtered.filter(bot => bot.timeframe === timeframe);
    }
    
    setFilteredBots(filtered);
  };
  
  const renderBotCard = (bot: AITradingStrategy) => {
    return (
      <Card key={bot.id} className="w-full mb-4 hover:bg-accent/5 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-4 w-4" />
                {bot.name}
              </CardTitle>
              <CardDescription>{bot.description}</CardDescription>
            </div>
            <Badge variant="secondary">{bot.type}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Timeframe</span>
              <span className="font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1" />{bot.timeframe}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Risk Level</span>
              <span className="font-medium">{bot.riskLevel}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Creator</span>
              <span className="font-medium">{bot.creator}</span>
            </div>
          </div>
          
          {bot.performance && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Performance</span>
                <span className={bot.performance.totalReturn >= 0 ? "text-crypto-green" : "text-crypto-red"}>
                  {bot.performance.totalReturn >= 0 ? "+" : ""}{bot.performance.totalReturn}%
                </span>
              </div>
              <Progress value={bot.performance.winRate} className="h-1 w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Win Rate: {bot.performance.winRate}%</span>
                <span>Sharpe: {bot.performance.sharpeRatio}</span>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-1 mt-4">
            {bot.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <div className="flex justify-end px-6 pb-4 pt-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-3 w-3" />
            Configure
          </Button>
          <Button size="sm" className="ml-2 gap-2">
            Activate
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Trading Bots
            </CardTitle>
            <CardDescription>
              Automated trading strategies powered by artificial intelligence
            </CardDescription>
          </div>
          <Button className="gap-2 whitespace-nowrap">
            <PlusCircle className="h-4 w-4" />
            Create New Bot
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="available">Available Bots</TabsTrigger>
            <TabsTrigger value="active">Active Bots (2)</TabsTrigger>
            <TabsTrigger value="my-bots">My Bots (1)</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search bots..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <div className="w-40">
                  <Select onValueChange={handleStrategyTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Strategy Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {strategyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-40">
                  <Select onValueChange={handleTimeframeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Timeframes</SelectItem>
                      {timeframes.map((tf) => (
                        <SelectItem key={tf.value} value={tf.value}>
                          {tf.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="available" className="space-y-4 mt-0">
              {filteredBots.length > 0 ? (
                filteredBots.map(renderBotCard)
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bot className="h-12 w-12 mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-1">No bots found</h3>
                  <p className="text-muted-foreground max-w-md">
                    No AI trading bots match your search criteria. Try adjusting your filters or create a new bot.
                  </p>
                  <Button className="mt-4 gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create New Bot
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="active" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <TrendingUp className="h-12 w-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">Active Bots Dashboard Coming Soon</h3>
                <p className="text-muted-foreground max-w-md">
                  This section will show your currently active trading bots and their performance metrics in real-time.
                </p>
                <Button className="mt-4">View Demo</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="my-bots" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Settings className="h-12 w-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">My Custom Bots Coming Soon</h3>
                <p className="text-muted-foreground max-w-md">
                  This section will show your custom created bots and allow you to modify their parameters.
                </p>
                <Button className="mt-4">View Demo</Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <Separator />
        
        <div className="bg-primary/5 rounded-lg p-4 text-sm">
          <p className="font-medium mb-2">AI Trading Bot Performance Disclaimer</p>
          <p className="text-muted-foreground">
            Past performance is not indicative of future results. AI trading bots involve substantial risk and are not suitable for all investors. 
            Please ensure you understand the risks involved before activating any automated trading strategies.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiTradingBots;
