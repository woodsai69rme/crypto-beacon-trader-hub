
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Timer } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MarketInsight {
  id: string;
  type: 'trend' | 'signal' | 'alert' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
  tags: string[];
  impact: 'high' | 'medium' | 'low';
}

const AiMarketInsights = () => {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = () => {
    setIsLoading(true);
    
    // In a real implementation, this would call an AI-powered API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const mockInsights: MarketInsight[] = [
        {
          id: '1',
          type: 'trend',
          title: 'Bitcoin correlation with tech stocks increasing',
          description: 'Analysis of recent market movements shows increasing correlation between Bitcoin and NASDAQ tech stocks, suggesting stronger institutional influence.',
          confidence: 87,
          timestamp: new Date().toISOString(),
          tags: ['bitcoin', 'correlation', 'institutional'],
          impact: 'medium'
        },
        {
          id: '2',
          type: 'signal',
          title: 'Ethereum approaching resistance level',
          description: 'Technical indicators suggest Ethereum is approaching a key resistance level at $3,200. Watch for potential breakout or rejection.',
          confidence: 76,
          timestamp: new Date().toISOString(),
          tags: ['ethereum', 'technical', 'resistance'],
          impact: 'high'
        },
        {
          id: '3',
          type: 'alert',
          title: 'Unusual volume detected in Solana',
          description: 'Trading volume for Solana has increased by 245% in the last 24 hours, significantly above the 30-day average.',
          confidence: 94,
          timestamp: new Date().toISOString(),
          tags: ['solana', 'volume', 'anomaly'],
          impact: 'high'
        },
        {
          id: '4',
          type: 'prediction',
          title: 'Market volatility expected to decrease',
          description: 'AI models predict reduced market volatility over the next 7 days based on current sentiment and options data.',
          confidence: 63,
          timestamp: new Date().toISOString(),
          tags: ['volatility', 'prediction', 'sentiment'],
          impact: 'low'
        },
        {
          id: '5',
          type: 'trend',
          title: 'DeFi tokens showing momentum divergence',
          description: 'Major DeFi tokens are showing divergent momentum indicators, suggesting sector rotation within the DeFi space.',
          confidence: 71,
          timestamp: new Date().toISOString(),
          tags: ['defi', 'momentum', 'sector'],
          impact: 'medium'
        }
      ];
      
      setInsights(mockInsights);
      setIsLoading(false);
    }, 1500);
  };

  const getInsightIcon = (type: string) => {
    switch(type) {
      case 'trend':
        return <TrendingUp className="h-5 w-5" />;
      case 'signal':
        return <TrendingDown className="h-5 w-5" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5" />;
      case 'prediction':
        return <Timer className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'high':
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case 'medium':
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case 'low':
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    }
  };

  const filteredInsights = activeFilter === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === activeFilter);

  const handleRegenerateInsights = () => {
    toast({
      title: "Generating new insights",
      description: "Analyzing market data for new patterns and trends",
    });
    generateInsights();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Market Insights
            </CardTitle>
            <CardDescription>
              Automated analysis of market trends and patterns
            </CardDescription>
          </div>
          <Button onClick={handleRegenerateInsights} disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Refresh Analysis"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Button 
            variant={activeFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === 'trend' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('trend')}
          >
            Trends
          </Button>
          <Button 
            variant={activeFilter === 'signal' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('signal')}
          >
            Signals
          </Button>
          <Button 
            variant={activeFilter === 'alert' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('alert')}
          >
            Alerts
          </Button>
          <Button 
            variant={activeFilter === 'prediction' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('prediction')}
          >
            Predictions
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Analyzing market data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInsights.length > 0 ? filteredInsights.map((insight) => (
              <div key={insight.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-full ${getImpactColor(insight.impact)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {insight.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                      {insight.confidence}% confidence
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(insight.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No insights match your filter. Try another category.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiMarketInsights;
