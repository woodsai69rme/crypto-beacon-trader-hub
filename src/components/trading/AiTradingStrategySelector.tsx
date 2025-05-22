
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AITradingStrategy } from "@/types/trading";
import { ChevronRight, BarChart, TrendingUp, AlignJustify, MessageCircle, BrainCircuit, Clock } from "lucide-react";

// Mock strategies
const strategies: AITradingStrategy[] = [
  {
    id: "trend-1",
    name: "MACD Trend Follower",
    description: "Uses MACD to identify and follow market trends",
    type: "trend-following",
    timeframe: "1h",
    parameters: {
      rsiPeriod: 14,
      macdFastPeriod: 12,
      macdSlowPeriod: 26,
      macdSignalPeriod: 9,
      stopLossPercentage: 2,
      takeProfitPercentage: 4
    },
    riskLevel: "medium",
    creator: "system",
    tags: ["macd", "trend", "momentum"]
  },
  {
    id: "mean-1",
    name: "Bollinger Mean Reversion",
    description: "Identifies overbought and oversold conditions using Bollinger Bands",
    type: "mean-reversion",
    timeframe: "4h",
    parameters: {
      bbPeriod: 20,
      bbDeviation: 2,
      rsiPeriod: 14,
      rsiOverbought: 70,
      rsiOversold: 30,
      stopLossPercentage: 1.5,
      takeProfitPercentage: 3
    },
    riskLevel: "low",
    creator: "system",
    tags: ["bollinger", "rsi", "mean-reversion"]
  },
  {
    id: "breakout-1",
    name: "Volume Breakout Detector",
    description: "Detects price breakouts confirmed by volume spikes",
    type: "breakout",
    timeframe: "1d",
    parameters: {
      lookbackPeriod: 20,
      volumeThreshold: 2,
      priceDeviation: 3,
      stopLossPercentage: 4,
      takeProfitPercentage: 8
    },
    riskLevel: "high",
    creator: "system",
    tags: ["breakout", "volume", "momentum"]
  },
  {
    id: "sentiment-1",
    name: "News Sentiment Analyzer",
    description: "Trades based on sentiment analysis of news and social media",
    type: "sentiment",
    timeframe: "1d",
    parameters: {
      sentimentThreshold: 0.7,
      newsSourceCount: 5,
      sentimentPeriod: 24,
      stopLossPercentage: 3,
      takeProfitPercentage: 6
    },
    riskLevel: "medium",
    creator: "system",
    tags: ["sentiment", "news", "social"]
  },
  {
    id: "ml-1",
    name: "ML Price Predictor",
    description: "Uses machine learning to predict price movements",
    type: "machine-learning",
    timeframe: "1d",
    parameters: {
      features: ["price", "volume", "rsi", "macd", "sentiment"],
      lookbackPeriods: 30,
      predictionHorizon: 5,
      confidenceThreshold: 0.75,
      stopLossPercentage: 3,
      takeProfitPercentage: 6
    },
    riskLevel: "high",
    creator: "system",
    tags: ["machine-learning", "ai", "prediction"]
  },
  {
    id: "mtf-1",
    name: "Multi-Timeframe Momentum",
    description: "Analyzes market momentum across multiple timeframes",
    type: "multi-timeframe",
    timeframe: "4h",
    parameters: {
      timeframes: ["1h", "4h", "1d"],
      indicators: ["rsi", "macd", "adx"],
      minConfirmations: 2,
      stopLossPercentage: 2.5,
      takeProfitPercentage: 5
    },
    riskLevel: "medium",
    creator: "system",
    tags: ["multi-timeframe", "momentum", "confluence"]
  }
];

type StrategyType = "all" | "trend-following" | "mean-reversion" | "breakout" | "sentiment" | "machine-learning" | "multi-timeframe";

const AiTradingStrategySelector: React.FC = () => {
  const [selectedType, setSelectedType] = useState<StrategyType>("all");
  
  const filteredStrategies = selectedType === "all" 
    ? strategies 
    : strategies.filter(strategy => strategy.type === selectedType);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Trading Strategies</CardTitle>
        <CardDescription>
          Select an AI-powered trading strategy to deploy
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" onValueChange={(value) => setSelectedType(value as StrategyType)}>
          <TabsList className="mb-6 grid grid-cols-3 md:grid-cols-7">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <AlignJustify className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">All</span>
            </TabsTrigger>
            <TabsTrigger value="trend-following" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Trend</span>
            </TabsTrigger>
            <TabsTrigger value="mean-reversion" className="flex items-center gap-1">
              <BarChart className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Mean</span>
            </TabsTrigger>
            <TabsTrigger value="breakout" className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Breakout</span>
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Sentiment</span>
            </TabsTrigger>
            <TabsTrigger value="machine-learning" className="flex items-center gap-1">
              <BrainCircuit className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">ML</span>
            </TabsTrigger>
            <TabsTrigger value="multi-timeframe" className="flex items-center gap-1">
              <Clock className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">MTF</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStrategies.map((strategy) => (
              <Card key={strategy.id} className="bg-card">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{strategy.name}</CardTitle>
                      <CardDescription>{strategy.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{strategy.riskLevel}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {strategy.type}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {strategy.timeframe}
                    </Badge>
                    {strategy.tags.slice(0, 2).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="w-full">
                    Select Strategy
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AiTradingStrategySelector;
