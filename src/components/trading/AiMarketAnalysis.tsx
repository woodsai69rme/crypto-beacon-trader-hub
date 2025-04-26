
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownRight, BarChart, CircleDollarSign } from "lucide-react";

interface MarketInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  sentiment: "bullish" | "bearish" | "neutral";
  timeframe: string;
  source: string;
}

interface PredictedEvent {
  id: string;
  event: string;
  description: string;
  probability: number;
  impact: "low" | "medium" | "high";
  timeframe: string;
}

interface MarketMetric {
  id: string;
  name: string;
  value: string;
  change: number;
  isPositive: boolean;
}

const AiMarketAnalysis = () => {
  const [insights] = useState<MarketInsight[]>([
    {
      id: "insight1",
      title: "Bitcoin Showing Strong Accumulation Pattern",
      description: "On-chain metrics indicate significant accumulation from long-term holders, historically a bullish signal.",
      confidence: 87,
      sentiment: "bullish",
      timeframe: "Medium-term",
      source: "On-chain Analysis"
    },
    {
      id: "insight2",
      title: "Ethereum Facing Resistance at Key Level",
      description: "ETH is approaching strong resistance at $3,400. Multiple rejections suggest possible consolidation before breakout.",
      confidence: 73,
      sentiment: "neutral",
      timeframe: "Short-term",
      source: "Technical Analysis"
    },
    {
      id: "insight3",
      title: "Market Breadth Indicates Potential Correction",
      description: "Altcoin market showing signs of overheating with declining volume. Expect potential short-term correction.",
      confidence: 65,
      sentiment: "bearish",
      timeframe: "Short-term",
      source: "Market Analysis"
    }
  ]);
  
  const [predictions] = useState<PredictedEvent[]>([
    {
      id: "pred1",
      event: "ETF Inflow Surge",
      description: "Prediction of significant capital inflow to crypto ETFs within the next 2 weeks based on institutional movement patterns.",
      probability: 76,
      impact: "high",
      timeframe: "2 weeks"
    },
    {
      id: "pred2",
      event: "Regulatory Announcement",
      description: "Models suggest a favorable regulatory announcement from a major economy within 30 days.",
      probability: 64,
      impact: "high",
      timeframe: "1 month"
    },
    {
      id: "pred3",
      event: "Market Volatility Spike",
      description: "Derivatives market analysis indicates an upcoming period of increased volatility.",
      probability: 82,
      impact: "medium",
      timeframe: "1-2 weeks"
    }
  ]);
  
  const [metrics] = useState<MarketMetric[]>([
    {
      id: "metric1",
      name: "Bitcoin Dominance",
      value: "54.2%",
      change: 1.3,
      isPositive: true
    },
    {
      id: "metric2",
      name: "Market Sentiment",
      value: "Greed",
      change: 8.6,
      isPositive: true
    },
    {
      id: "metric3",
      name: "30-Day Volatility",
      value: "3.2%",
      change: -0.8,
      isPositive: true
    },
    {
      id: "metric4",
      name: "Avg. Transaction Fees",
      value: "$3.42",
      change: 0.54,
      isPositive: false
    }
  ]);
  
  const getSentimentColor = (sentiment: "bullish" | "bearish" | "neutral") => {
    switch (sentiment) {
      case "bullish": return "bg-green-500/10 text-green-500";
      case "bearish": return "bg-red-500/10 text-red-500";
      case "neutral": return "bg-yellow-500/10 text-yellow-500";
      default: return "";
    }
  };
  
  const getImpactColor = (impact: "low" | "medium" | "high") => {
    switch (impact) {
      case "low": return "bg-blue-500/10 text-blue-500";
      case "medium": return "bg-yellow-500/10 text-yellow-500";
      case "high": return "bg-red-500/10 text-red-500";
      default: return "";
    }
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500";
    if (confidence >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>AI Market Analysis</CardTitle>
            <CardDescription>
              Predictive insights and market analysis powered by artificial intelligence
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            PREMIUM
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights">
            <div className="space-y-4">
              {insights.map(insight => (
                <Card key={insight.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge className={getSentimentColor(insight.sentiment)}>
                        {insight.sentiment.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2">
                      {insight.description}
                    </p>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">AI Confidence</span>
                        <div className="flex items-center gap-2">
                          <Progress value={insight.confidence} className={`h-2 w-24 ${getConfidenceColor(insight.confidence)}`} />
                          <span className="text-xs">{insight.confidence}%</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {insight.timeframe} • {insight.source}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex justify-center mt-4">
                <Button>View All AI Insights</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="predictions">
            <div className="space-y-4">
              {predictions.map(prediction => (
                <Card key={prediction.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{prediction.event}</h4>
                        <Badge className={getImpactColor(prediction.impact)}>
                          {prediction.impact.toUpperCase()} IMPACT
                        </Badge>
                      </div>
                      <div className="text-xs font-medium">
                        In {prediction.timeframe}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2">
                      {prediction.description}
                    </p>
                    
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium">Probability</span>
                        <span className="text-xs">{prediction.probability}%</span>
                      </div>
                      <Progress value={prediction.probability} className={`h-2 ${getConfidenceColor(prediction.probability)}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex justify-center mt-4">
                <Button>Generate Custom Prediction</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="metrics">
            <div className="grid grid-cols-2 gap-4">
              {metrics.map(metric => (
                <Card key={metric.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-muted-foreground">{metric.name}</h4>
                      <div className={`flex items-center text-xs ${metric.isPositive ? "text-green-500" : "text-red-500"}`}>
                        {metric.isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                        {metric.change}%
                      </div>
                    </div>
                    <div className="text-2xl font-bold mt-2">{metric.value}</div>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="col-span-2">
                <CardContent className="flex justify-between items-center p-4">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Current AI Market Recommendation</h4>
                      <p className="text-sm text-muted-foreground">Based on 24 analyzed factors</p>
                    </div>
                  </div>
                  
                  <Badge className="bg-green-500/10 text-green-500">
                    ACCUMULATE
                  </Badge>
                </CardContent>
              </Card>
              
              <div className="col-span-2 flex justify-center mt-2">
                <Button variant="outline">
                  <BarChart className="h-4 w-4 mr-2" />
                  View Detailed Analysis
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AiMarketAnalysis;
