
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AITradingStrategy } from "@/types/trading";
import { Bot, Brain, LineChart, Layers, TrendingUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AiTradingStrategySelectorProps {
  botId: string;
  onSelectStrategy: (strategy: AITradingStrategy) => void;
}

const AiTradingStrategySelector: React.FC<AiTradingStrategySelectorProps> = ({ 
  botId, 
  onSelectStrategy 
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("trending");
  
  const strategyCategories = [
    { id: "trending", name: "Trend Following", icon: <TrendingUp className="h-5 w-5" /> },
    { id: "patterns", name: "Pattern Recognition", icon: <LineChart className="h-5 w-5" /> },
    { id: "sentiment", name: "Sentiment Analysis", icon: <Brain className="h-5 w-5" /> },
    { id: "multi", name: "Multi-Timeframe", icon: <Layers className="h-5 w-5" /> },
  ];
  
  const strategyItems: Record<string, AITradingStrategy[]> = {
    trending: [
      {
        id: "trend-following-1",
        name: "Dynamic Trend Follower",
        description: "Tracks moving averages and price momentum for major trend identification",
        type: "trend-following",
        timeframe: "1h",
        parameters: {
          lookbackPeriod: 14,
          riskLevel: "medium",
          winRate: 0.68,
          profitFactor: 1.85
        }
      },
      {
        id: "trend-following-2",
        name: "Adaptive Trend Scanner",
        description: "Adjusts to changing market conditions using multiple indicators",
        type: "trend-following",
        timeframe: "4h",
        parameters: {
          adaptiveMode: true,
          riskLevel: "medium",
          winRate: 0.65,
          profitFactor: 1.92
        }
      },
      {
        id: "trend-following-3",
        name: "Volatility Trend Rider",
        description: "Focuses on trend strength during high volatility periods",
        type: "trend-following",
        timeframe: "1d",
        parameters: {
          volatilityFactor: 1.5,
          riskLevel: "high",
          winRate: 0.62,
          profitFactor: 2.1
        }
      }
    ],
    patterns: [
      {
        id: "pattern-1",
        name: "Chart Pattern Finder",
        description: "Identifies classic chart patterns including head & shoulders and triangles",
        type: "pattern-recognition",
        timeframe: "15m",
        parameters: {
          patternTypes: ["headAndShoulders", "triangles", "doubleTop"],
          riskLevel: "medium",
          winRate: 0.64,
          profitFactor: 1.78
        }
      },
      {
        id: "pattern-2",
        name: "Fractal Pattern Scanner",
        description: "Detects recurring fractal patterns across multiple timeframes",
        type: "pattern-recognition",
        timeframe: "1h",
        parameters: {
          fractalDepth: 3,
          riskLevel: "medium",
          winRate: 0.67,
          profitFactor: 1.82
        }
      }
    ],
    sentiment: [
      {
        id: "sentiment-1",
        name: "News Sentiment Trader",
        description: "Analyzes market news sentiment for trading signals",
        type: "sentiment-analysis",
        timeframe: "4h",
        parameters: {
          sentimentThreshold: 0.75,
          riskLevel: "high",
          winRate: 0.61,
          profitFactor: 2.05
        }
      },
      {
        id: "sentiment-2",
        name: "Social Media Sentiment",
        description: "Tracks social media sentiment and trading volume correlation",
        type: "sentiment-analysis",
        timeframe: "1d",
        parameters: {
          platforms: ["twitter", "reddit", "telegram"],
          riskLevel: "high",
          winRate: 0.59,
          profitFactor: 2.15
        }
      }
    ],
    multi: [
      {
        id: "multi-1",
        name: "Triple Timeframe Analyzer",
        description: "Combines analysis from 3 timeframes for robust signals",
        type: "multi-timeframe",
        timeframe: "multiple",
        parameters: {
          timeframes: ["15m", "1h", "4h"],
          riskLevel: "medium",
          winRate: 0.72,
          profitFactor: 1.94
        }
      },
      {
        id: "multi-2",
        name: "Nested Strategy Combiner",
        description: "Combines multiple strategy types across timeframes",
        type: "multi-timeframe",
        timeframe: "multiple",
        parameters: {
          strategies: ["trend", "momentum", "pattern"],
          riskLevel: "high",
          winRate: 0.70,
          profitFactor: 2.10
        }
      }
    ]
  };
  
  const handleSelectStrategy = (strategy: AITradingStrategy) => {
    onSelectStrategy(strategy);
    
    toast({
      title: "Strategy Selected",
      description: `${strategy.name} has been selected for analysis`
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-2">
        {strategyCategories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategoryId === category.id ? "default" : "outline"}
            className="flex flex-col h-auto py-3 px-2 justify-center"
            onClick={() => setSelectedCategoryId(category.id)}
          >
            <div>{category.icon}</div>
            <div className="text-xs mt-2">{category.name}</div>
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategyItems[selectedCategoryId]?.map(strategy => (
          <Card key={strategy.id}>
            <CardContent className="p-4">
              <div>
                <div className="flex justify-between items-start">
                  <div className="font-medium">{strategy.name}</div>
                  <Badge variant="outline">
                    {strategy.timeframe}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {strategy.description}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Win Rate: {(strategy.parameters.winRate * 100).toFixed(0)}%
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Profit Factor: {strategy.parameters.profitFactor}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      strategy.parameters.riskLevel === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : strategy.parameters.riskLevel === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {strategy.parameters.riskLevel} risk
                  </Badge>
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleSelectStrategy(strategy)}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Select Strategy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AiTradingStrategySelector;
