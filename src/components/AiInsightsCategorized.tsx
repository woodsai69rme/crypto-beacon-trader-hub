
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Lightbulb, TrendingUp, AlertTriangle, LineChart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type InsightType = "trend" | "signal" | "alert" | "prediction";

interface MarketInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  coins: string[];
  confidence: number;
  impact: "high" | "medium" | "low";
  timestamp: string;
  tags: string[];
}

const mockInsights: MarketInsight[] = [
  {
    id: "1",
    type: "trend",
    title: "DeFi Sector Growth Acceleration",
    description: "The DeFi sector is showing signs of accelerated growth with increasing Total Value Locked (TVL) across major protocols. This trend appears sustainable based on institutional adoption metrics.",
    coins: ["ethereum", "solana", "avalanche"],
    confidence: 82,
    impact: "high",
    timestamp: "2025-04-25T12:30:00Z",
    tags: ["defi", "institutional", "trend"]
  },
  {
    id: "2",
    type: "signal",
    title: "BTC/ETH Correlation Weakening",
    description: "The historically strong correlation between Bitcoin and Ethereum prices is showing signs of weakening, suggesting possible divergence in price movements in the coming weeks.",
    coins: ["bitcoin", "ethereum"],
    confidence: 75,
    impact: "medium",
    timestamp: "2025-04-26T09:15:00Z",
    tags: ["correlation", "trading", "bitcoin", "ethereum"]
  },
  {
    id: "3",
    type: "alert",
    title: "Unusual Volume in Layer-2 Tokens",
    description: "Several Layer-2 scaling solution tokens are experiencing abnormally high trading volumes in the past 24 hours, potentially indicating coordinated buying activity.",
    coins: ["polygon", "arbitrum", "optimism"],
    confidence: 68,
    impact: "medium",
    timestamp: "2025-04-26T14:45:00Z",
    tags: ["volume", "layer2", "scaling"]
  },
  {
    id: "4",
    type: "prediction",
    title: "BTC Price Support Level",
    description: "Based on technical indicators and on-chain data, Bitcoin is likely to maintain support above $48,000 through the next market cycle.",
    coins: ["bitcoin"],
    confidence: 71,
    impact: "high",
    timestamp: "2025-04-25T18:20:00Z",
    tags: ["bitcoin", "price", "support", "technical"]
  },
  {
    id: "5",
    type: "trend",
    title: "Gaming Token Momentum",
    description: "Blockchain gaming tokens have shown consistent upward momentum over the past month, outperforming the broader market by approximately 12%.",
    coins: ["sandbox", "axie-infinity", "decentraland"],
    confidence: 79,
    impact: "medium",
    timestamp: "2025-04-24T10:00:00Z",
    tags: ["gaming", "metaverse", "nft"]
  },
  {
    id: "6",
    type: "signal",
    title: "Exchange Outflows Increasing",
    description: "Major cryptocurrency exchanges are experiencing significant outflows, typically a bullish indicator as assets move to long-term storage.",
    coins: ["bitcoin", "ethereum", "solana"],
    confidence: 84,
    impact: "high",
    timestamp: "2025-04-26T11:30:00Z",
    tags: ["exchanges", "outflows", "bullish"]
  },
  {
    id: "7",
    type: "alert",
    title: "Unusual Smart Contract Activity",
    description: "A major DeFi protocol is showing unusual smart contract activity in the past 12 hours. Monitor for potential protocol changes or security concerns.",
    coins: ["aave", "compound", "uniswap"],
    confidence: 63,
    impact: "high",
    timestamp: "2025-04-26T13:15:00Z",
    tags: ["defi", "security", "smart-contracts"]
  },
  {
    id: "8",
    type: "prediction",
    title: "ETH Gas Fee Reduction",
    description: "Ethereum gas fees are likely to decrease by 15-20% in the coming weeks as layer-2 adoption accelerates and network upgrades are implemented.",
    coins: ["ethereum"],
    confidence: 77,
    impact: "medium",
    timestamp: "2025-04-25T16:40:00Z",
    tags: ["ethereum", "gas-fees", "scaling"]
  }
];

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "high":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "medium":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "low":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    default:
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  }
};

const getTypeIcon = (type: InsightType) => {
  switch (type) {
    case "trend":
      return <TrendingUp className="w-4 h-4 mr-1" />;
    case "signal":
      return <Lightbulb className="w-4 h-4 mr-1" />;
    case "alert":
      return <AlertTriangle className="w-4 h-4 mr-1" />;
    case "prediction":
      return <LineChart className="w-4 h-4 mr-1" />;
    default:
      return null;
  }
};

const AiInsightsCategorized = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Insights refreshed",
        description: "AI market insights have been updated with the latest data",
      });
    }, 2000);
  };
  
  const filteredInsights = activeTab === "all" 
    ? mockInsights 
    : mockInsights.filter(insight => insight.type === activeTab);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">AI Market Insights</CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Analyzing Market..." : "Refresh Analysis"}
          </Button>
        </div>
        <CardDescription>
          AI-powered analysis of market trends, signals, and predictions
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full flex justify-between">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="trend">Trends</TabsTrigger>
            <TabsTrigger value="signal">Signals</TabsTrigger>
            <TabsTrigger value="alert">Alerts</TabsTrigger>
            <TabsTrigger value="prediction">Predictions</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="pt-2">
            <div className="space-y-4">
              {filteredInsights.map((insight) => (
                <div key={insight.id} className="border rounded-lg p-4 hover:bg-secondary/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      {getTypeIcon(insight.type)}
                      <h3 className="font-semibold">{insight.title}</h3>
                    </div>
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact} impact
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {insight.coins.map((coin) => (
                      <Badge key={coin} variant="outline" className="bg-secondary/20">
                        {coin}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground">
                        Confidence: {insight.confidence}%
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(insight.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
        <span>Powered by market data analysis</span>
        <span>Updated: {new Date().toLocaleString()}</span>
      </CardFooter>
    </Card>
  );
};

export default AiInsightsCategorized;
