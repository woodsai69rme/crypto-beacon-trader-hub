
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  ArrowUp, 
  ArrowDown,
  Clock,
  TrendingUp,
  RefreshCw,
  Cpu
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useOpenRouterApiKey } from '@/services/openRouterService';

interface TradeRecommendation {
  id: string;
  symbol: string;
  type: 'buy' | 'sell' | 'hold';
  confidence: number;
  price: number;
  targetPrice?: number;
  stopLoss?: number;
  timeframe: string;
  reasoning: string;
  tags: string[];
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: string;
}

const mockRecommendations: TradeRecommendation[] = [
  {
    id: '1',
    symbol: 'BTC/USD',
    type: 'buy',
    confidence: 87,
    price: 61500,
    targetPrice: 65000,
    stopLoss: 59000,
    timeframe: '1-2 weeks',
    reasoning: 'Technical breakout from cup and handle pattern with strong volume confirmation. Institutional buying pressure continues to increase while on-chain metrics show accumulation by long-term holders.',
    tags: ['technical breakout', 'accumulation', 'institutional'],
    riskLevel: 'medium',
    createdAt: '2025-05-12T08:30:00Z'
  },
  {
    id: '2',
    symbol: 'ETH/USD',
    type: 'buy',
    confidence: 82,
    price: 3480,
    targetPrice: 3800,
    stopLoss: 3250,
    timeframe: '1-3 weeks',
    reasoning: 'ETH continues to show strength with upcoming protocol upgrades. Decreasing exchange reserves combined with increasing staking rate reducing available supply. Key resistance level broken with strong volume.',
    tags: ['protocol upgrade', 'supply shock', 'resistance break'],
    riskLevel: 'medium',
    createdAt: '2025-05-12T08:25:00Z'
  },
  {
    id: '3',
    symbol: 'SOL/USD',
    type: 'hold',
    confidence: 65,
    price: 142.50,
    targetPrice: 160,
    stopLoss: 125,
    timeframe: '1-2 weeks',
    reasoning: 'Consolidating after recent rally. Network metrics remain strong with growing developer activity. Wait for clear break above $145 resistance for confirmation of next leg up.',
    tags: ['consolidation', 'network growth', 'resistance test'],
    riskLevel: 'medium',
    createdAt: '2025-05-12T08:15:00Z'
  },
  {
    id: '4',
    symbol: 'LINK/USD',
    type: 'buy',
    confidence: 78,
    price: 17.25,
    targetPrice: 19.50,
    stopLoss: 16.00,
    timeframe: '1-3 weeks',
    reasoning: 'Breaking out of long-term accumulation zone with increasing volume. Oracle adoption metrics showing strong growth. Relative strength vs. BTC improving over past 3 weeks.',
    tags: ['accumulation', 'enterprise adoption', 'relative strength'],
    riskLevel: 'low',
    createdAt: '2025-05-11T22:45:00Z'
  },
  {
    id: '5',
    symbol: 'ADA/USD',
    type: 'sell',
    confidence: 72,
    price: 0.58,
    targetPrice: 0.48,
    stopLoss: 0.64,
    timeframe: '1-2 weeks',
    reasoning: 'Showing weakness at critical resistance level with declining volume. Network metrics showing reduced activity. Technical indicators signaling bearish divergence on multiple timeframes.',
    tags: ['resistance rejection', 'bearish divergence', 'decreasing activity'],
    riskLevel: 'medium',
    createdAt: '2025-05-11T16:30:00Z'
  }
];

const AiTradeRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<TradeRecommendation[]>(mockRecommendations);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'buy' | 'sell' | 'hold'>('all');
  const { isConfigured } = useOpenRouterApiKey();
  
  const handleGenerateRecommendations = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      // In a real app, we would call an API to generate new recommendations
    }, 2000);
  };
  
  const filteredRecommendations = activeFilter === 'all' 
    ? recommendations
    : recommendations.filter(rec => rec.type === activeFilter);
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'buy': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'sell': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 65) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const formatTimeDifference = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
      }
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          AI Trade Recommendations
        </CardTitle>
        <CardDescription>
          Smart trade insights powered by machine learning and market analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm"
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('all')}
            >
              All
            </Button>
            <Button 
              size="sm"
              variant={activeFilter === 'buy' ? 'default' : 'outline'}
              className={activeFilter === 'buy' ? '' : 'text-green-600'}
              onClick={() => setActiveFilter('buy')}
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              Buy
            </Button>
            <Button 
              size="sm"
              variant={activeFilter === 'sell' ? 'default' : 'outline'}
              className={activeFilter === 'sell' ? '' : 'text-red-600'}
              onClick={() => setActiveFilter('sell')}
            >
              <ArrowDown className="h-4 w-4 mr-1" />
              Sell
            </Button>
            <Button 
              size="sm"
              variant={activeFilter === 'hold' ? 'default' : 'outline'}
              className={activeFilter === 'hold' ? '' : 'text-blue-600'}
              onClick={() => setActiveFilter('hold')}
            >
              Hold
            </Button>
          </div>
          
          <Button
            onClick={handleGenerateRecommendations}
            disabled={isGenerating || !isConfigured}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate New Insights
              </>
            )}
          </Button>
        </div>
        
        {!isConfigured && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              OpenRouter API key not configured. Please set up your API key to generate trade recommendations.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <h3 className="text-sm font-medium">Latest Recommendations</h3>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Updated 12 minutes ago</span>
            </div>
          </div>
          
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map((recommendation) => (
              <Card key={recommendation.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 space-y-4">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="flex gap-2 items-center">
                        <Badge className={getTypeColor(recommendation.type)}>
                          {recommendation.type.toUpperCase()}
                        </Badge>
                        <h4 className="text-lg font-semibold">{recommendation.symbol}</h4>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className={`text-sm font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                          Confidence: {recommendation.confidence}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeDifference(recommendation.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="border rounded-md p-2">
                        <div className="text-xs text-muted-foreground">Entry Price</div>
                        <div className="text-base font-medium">${recommendation.price.toLocaleString()}</div>
                      </div>
                      
                      {recommendation.targetPrice && (
                        <div className="border rounded-md p-2">
                          <div className="text-xs text-muted-foreground">Target Price</div>
                          <div className={`text-base font-medium ${
                            recommendation.targetPrice > recommendation.price ? 'text-green-600' : 'text-red-600'
                          }`}>${recommendation.targetPrice.toLocaleString()}</div>
                        </div>
                      )}
                      
                      {recommendation.stopLoss && (
                        <div className="border rounded-md p-2">
                          <div className="text-xs text-muted-foreground">Stop Loss</div>
                          <div className="text-base font-medium text-red-600">${recommendation.stopLoss.toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="text-xs font-medium mb-1">Analysis</div>
                      <p className="text-sm">{recommendation.reasoning}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {recommendation.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <span className="text-muted-foreground">Timeframe:</span>{' '}
                          <span className="font-medium">{recommendation.timeframe}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Risk:</span>{' '}
                          <span className={`font-medium ${
                            recommendation.riskLevel === 'low' ? 'text-green-600' :
                            recommendation.riskLevel === 'medium' ? 'text-amber-600' :
                            'text-red-600'
                          }`}>
                            {recommendation.riskLevel.charAt(0).toUpperCase() + recommendation.riskLevel.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No {activeFilter !== 'all' ? activeFilter : ''} recommendations available at this time.
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col text-xs text-muted-foreground border-t pt-4">
        <p>AI recommendations are based on technical analysis, on-chain metrics, and market sentiment. Always conduct your own research and manage risk appropriately.</p>
      </CardFooter>
    </Card>
  );
};

export default AiTradeRecommendations;
