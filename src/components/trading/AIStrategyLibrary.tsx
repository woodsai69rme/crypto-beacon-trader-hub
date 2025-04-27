
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, BookOpen, Clock, TrendingUp, Star, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Strategy {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: "beginner" | "intermediate" | "advanced";
  timeframe: string[];
  performance: {
    winRate: number;
    maxDrawdown: number;
    sharpeRatio: number;
    annualizedReturn: number;
  };
  tags: string[];
  popularity: number;
  creator: string;
  dateCreated: string;
}

const predefinedStrategies: Strategy[] = [
  {
    id: "mean-reversion-1h",
    name: "Mean Reversion AI",
    description: "Uses machine learning to identify overbought and oversold conditions based on statistical deviations from moving averages.",
    category: "mean-reversion",
    complexity: "intermediate",
    timeframe: ["1h", "4h"],
    performance: {
      winRate: 65.8,
      maxDrawdown: 12.4,
      sharpeRatio: 1.8,
      annualizedReturn: 42.5
    },
    tags: ["mean-reversion", "ml-powered", "volatility"],
    popularity: 4.8,
    creator: "CryptoAI Labs",
    dateCreated: "2024-03-15"
  },
  {
    id: "trend-following-daily",
    name: "Smart Trend Follower",
    description: "Uses transformers to identify trend direction and strength across multiple timeframes with adaptive position sizing.",
    category: "trend-following",
    complexity: "advanced",
    timeframe: ["1d", "3d"],
    performance: {
      winRate: 58.2,
      maxDrawdown: 18.6,
      sharpeRatio: 1.6,
      annualizedReturn: 37.2
    },
    tags: ["trend-following", "multi-timeframe", "position-sizing"],
    popularity: 4.6,
    creator: "TradingBrain Inc",
    dateCreated: "2024-02-28"
  },
  {
    id: "breakout-detection-4h",
    name: "ML Breakout Detector",
    description: "Identifies potential breakouts using pattern recognition algorithms and volume analysis.",
    category: "breakout",
    complexity: "intermediate",
    timeframe: ["4h", "1d"],
    performance: {
      winRate: 52.4,
      maxDrawdown: 14.8,
      sharpeRatio: 1.4,
      annualizedReturn: 32.8
    },
    tags: ["breakout", "pattern-recognition", "volume-analysis"],
    popularity: 4.2,
    creator: "QuantX Research",
    dateCreated: "2024-01-18"
  },
  {
    id: "volatility-ml-15m",
    name: "Volatility ML Trader",
    description: "Exploits short-term volatility using machine learning predictions and adaptive stop losses.",
    category: "volatility",
    complexity: "advanced",
    timeframe: ["15m", "1h"],
    performance: {
      winRate: 69.3,
      maxDrawdown: 22.1,
      sharpeRatio: 1.9,
      annualizedReturn: 51.6
    },
    tags: ["volatility", "ml-powered", "short-term"],
    popularity: 4.7,
    creator: "AI Trading Systems",
    dateCreated: "2024-03-05"
  },
  {
    id: "sentiment-analyzer-daily",
    name: "Market Sentiment Analyzer",
    description: "Analyzes news, social media sentiment, and on-chain metrics to predict price movements.",
    category: "sentiment",
    complexity: "advanced",
    timeframe: ["4h", "1d"],
    performance: {
      winRate: 61.2,
      maxDrawdown: 16.9,
      sharpeRatio: 1.7,
      annualizedReturn: 39.4
    },
    tags: ["sentiment", "news-analysis", "social-media"],
    popularity: 4.5,
    creator: "SentiBot AI",
    dateCreated: "2024-02-12"
  },
  {
    id: "multi-factor-weekly",
    name: "Multi-Factor Weekly",
    description: "Combines technical, fundamental, and sentiment factors for weekly trading decisions.",
    category: "multi-factor",
    complexity: "advanced",
    timeframe: ["1w"],
    performance: {
      winRate: 72.1,
      maxDrawdown: 19.2,
      sharpeRatio: 2.1,
      annualizedReturn: 46.8
    },
    tags: ["multi-factor", "technical-fundamental", "medium-term"],
    popularity: 4.9,
    creator: "Quantum Trading Labs",
    dateCreated: "2024-01-05"
  }
];

const AIStrategyLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popularity");
  
  const filteredStrategies = predefinedStrategies.filter(strategy => {
    const matchesSearch = 
      strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = selectedCategory === "all" || strategy.category === selectedCategory;
    const matchesComplexity = selectedComplexity === "all" || strategy.complexity === selectedComplexity;
    const matchesTimeframe = selectedTimeframe === "all" || strategy.timeframe.includes(selectedTimeframe);
    
    return matchesSearch && matchesCategory && matchesComplexity && matchesTimeframe;
  }).sort((a, b) => {
    if (sortBy === "popularity") return b.popularity - a.popularity;
    if (sortBy === "winRate") return b.performance.winRate - a.performance.winRate;
    if (sortBy === "return") return b.performance.annualizedReturn - a.performance.annualizedReturn;
    if (sortBy === "newest") return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
    return 0;
  });
  
  const categories = ["all", ...Array.from(new Set(predefinedStrategies.map(s => s.category)))];
  const timeframes = ["all", ...Array.from(new Set(predefinedStrategies.flatMap(s => s.timeframe)))];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          AI Strategy Library
        </CardTitle>
        <CardDescription>
          Browse and select from our collection of AI-powered trading strategies
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="library">Strategy Library</TabsTrigger>
            <TabsTrigger value="custom">Custom Strategies</TabsTrigger>
            <TabsTrigger value="community">Community Strategies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="library" className="space-y-5">
            {/* Search and filters */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search strategies..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Complexity</label>
                  <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Timeframe</label>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeframes.map(timeframe => (
                        <SelectItem key={timeframe} value={timeframe}>
                          {timeframe === "all" ? "All timeframes" : timeframe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Sort by</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="winRate">Win Rate</SelectItem>
                      <SelectItem value="return">Annual Return</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Strategy cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredStrategies.length === 0 ? (
                <div className="lg:col-span-2 text-center py-10 text-muted-foreground">
                  No strategies match your filters. Try adjusting your search criteria.
                </div>
              ) : (
                filteredStrategies.map(strategy => (
                  <Card key={strategy.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{strategy.name}</CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {strategy.category.charAt(0).toUpperCase() + strategy.category.slice(1)}
                            </Badge>
                            <Badge variant="outline" className={
                              strategy.complexity === "beginner" ? "bg-green-50 text-green-700 border-green-200" :
                              strategy.complexity === "intermediate" ? "bg-amber-50 text-amber-700 border-amber-200" :
                              "bg-red-50 text-red-700 border-red-200"
                            }>
                              {strategy.complexity.charAt(0).toUpperCase() + strategy.complexity.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="ml-1 text-sm">{strategy.popularity.toFixed(1)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{strategy.description}</p>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <div className="text-muted-foreground">Win Rate</div>
                          <div className="font-medium">{strategy.performance.winRate.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Max Drawdown</div>
                          <div className="font-medium">{strategy.performance.maxDrawdown.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Sharpe Ratio</div>
                          <div className="font-medium">{strategy.performance.sharpeRatio.toFixed(1)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Annual Return</div>
                          <div className="font-medium">{strategy.performance.annualizedReturn.toFixed(1)}%</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {strategy.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>Timeframes: {strategy.timeframe.join(", ")}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Backtest
                        </Button>
                        <Button size="sm">
                          <ArrowUpDown className="h-4 w-4 mr-1" />
                          Use Strategy
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="text-center py-16 space-y-4">
              <h3 className="text-lg font-medium">Create Your Own AI Strategy</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Build custom AI-powered trading strategies with our intuitive strategy builder.
                Combine indicators, timeframes, and machine learning models.
              </p>
              <Button>Create Custom Strategy</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="community">
            <div className="text-center py-16 space-y-4">
              <h3 className="text-lg font-medium">Community Strategies</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Browse and use strategies created by our community of traders.
                Filter by performance metrics and user ratings.
              </p>
              <Button>Browse Community Strategies</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIStrategyLibrary;
