
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, Plus, Code, LineChart, TrendingUp, RefreshCw, FileText } from 'lucide-react';
import { AITradingStrategy } from '@/types/trading';
import { toast } from '@/components/ui/use-toast';

interface AiTradingStrategySelectorProps {
  botId: string;
  onSelectStrategy: (strategy: AITradingStrategy) => void;
}

const AiTradingStrategySelector: React.FC<AiTradingStrategySelectorProps> = ({ 
  botId, 
  onSelectStrategy 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock strategies
  const mockStrategies: AITradingStrategy[] = [
    {
      id: "trend-following-1",
      name: "Momentum Trend Follower",
      description: "Follows established market trends using momentum indicators",
      type: "trend-following",
      timeframe: "4h",
      parameters: {
        rsiPeriod: 14,
        macdFastPeriod: 12,
        macdSlowPeriod: 26,
        macdSignalPeriod: 9,
        stopLossPercentage: 2.5,
        takeProfitPercentage: 4.5
      }
    },
    {
      id: "mean-reversion-1",
      name: "Bollinger Band Reversal",
      description: "Trades mean reversion using Bollinger Bands and RSI",
      type: "mean-reversion",
      timeframe: "1h",
      parameters: {
        bbPeriod: 20,
        bbDeviation: 2,
        rsiPeriod: 14,
        rsiOverbought: 70,
        rsiOversold: 30,
        stopLossPercentage: 2.0,
        takeProfitPercentage: 3.5
      }
    },
    {
      id: "breakout-1",
      name: "Volume Breakout Detector",
      description: "Identifies and trades breakouts with volume confirmation",
      type: "breakout",
      timeframe: "1h",
      parameters: {
        lookbackPeriod: 24,
        volumeThreshold: 2.5,
        priceDeviation: 1.5,
        stopLossPercentage: 3.0,
        takeProfitPercentage: 6.0
      }
    },
    {
      id: "sentiment-1",
      name: "News Sentiment Analyzer",
      description: "Trades based on market sentiment from news sources",
      type: "sentiment",
      timeframe: "1d",
      parameters: {
        sentimentThreshold: 0.7,
        newsSourceCount: 5,
        sentimentPeriod: 24,
        stopLossPercentage: 2.5,
        takeProfitPercentage: 5.0
      }
    },
    {
      id: "machine-learning-1",
      name: "ML Price Predictor",
      description: "Uses machine learning to predict price movements",
      type: "machine-learning",
      timeframe: "4h",
      parameters: {
        features: ["price", "volume", "rsi", "macd", "bb"],
        lookbackPeriods: 50,
        predictionHorizon: 12,
        confidenceThreshold: 0.65,
        stopLossPercentage: 3.5,
        takeProfitPercentage: 7.0
      }
    },
    {
      id: "multi-timeframe-1",
      name: "Multi-Timeframe Confluence",
      description: "Analyzes multiple timeframes for trade confirmation",
      type: "multi-timeframe",
      timeframe: "1h",
      parameters: {
        timeframes: ["15m", "1h", "4h", "1d"],
        indicators: ["trend", "momentum", "volatility"],
        minConfirmations: 3,
        stopLossPercentage: 2.0,
        takeProfitPercentage: 4.0
      }
    }
  ];
  
  const filteredStrategies = mockStrategies.filter(strategy => {
    // Filter by search query
    const matchesQuery = searchQuery === '' || 
      strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || strategy.type === selectedCategory;
    
    return matchesQuery && matchesCategory;
  });
  
  const handleStrategySelect = (strategy: AITradingStrategy) => {
    onSelectStrategy(strategy);
    
    toast({
      title: "Strategy Selected",
      description: `${strategy.name} has been selected for the bot`
    });
  };
  
  const getStrategyTypeIcon = (type: string) => {
    switch (type) {
      case 'trend-following': return <TrendingUp className="h-4 w-4" />;
      case 'mean-reversion': return <RefreshCw className="h-4 w-4" />;
      case 'breakout': return <LineChart className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>AI Trading Strategies</CardTitle>
            <CardDescription>
              Select a strategy for your trading bot
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Strategy
            </Button>
            <Button variant="outline" size="sm">
              <Code className="h-4 w-4 mr-1" />
              Import
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search strategies..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Strategy Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="trend-following">Trend Following</SelectItem>
                <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                <SelectItem value="breakout">Breakout</SelectItem>
                <SelectItem value="sentiment">Sentiment</SelectItem>
                <SelectItem value="machine-learning">Machine Learning</SelectItem>
                <SelectItem value="multi-timeframe">Multi-Timeframe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {filteredStrategies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStrategies.map((strategy) => (
                <Card key={strategy.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{strategy.name}</CardTitle>
                      <Badge variant="outline" className="capitalize">
                        {strategy.type.replace('-', ' ')}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {strategy.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                      <div>
                        <span className="text-muted-foreground">Timeframe:</span> {strategy.timeframe}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Parameters:</span> {Object.keys(strategy.parameters).length}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stop Loss:</span> {strategy.parameters.stopLossPercentage}%
                      </div>
                      <div>
                        <span className="text-muted-foreground">Take Profit:</span> {strategy.parameters.takeProfitPercentage}%
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id={`activate-${strategy.id}`} />
                      <Label htmlFor={`activate-${strategy.id}`}>Auto-optimize</Label>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleStrategySelect(strategy)}
                    >
                      Select
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <LineChart className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No strategies found matching your criteria</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AiTradingStrategySelector;
