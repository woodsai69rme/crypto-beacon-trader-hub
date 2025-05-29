
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Info,
  Target,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { MarketInsight, TradingSignal, TradingAccount, MarketInsightsResponse } from '@/types/trading';

// Mock service function
const getPersonalizedMarketInsights = async (account: TradingAccount): Promise<MarketInsightsResponse> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    insights: [
      {
        id: '1',
        type: 'opportunity',
        title: 'Bitcoin Oversold Condition',
        summary: 'BTC is showing oversold conditions on multiple timeframes',
        relevance: 0.85,
        confidence: 0.78,
        timestamp: new Date().toISOString(),
        assets: ['BTC'],
        details: 'Technical analysis suggests a potential bounce'
      }
    ],
    signals: [
      {
        id: '1',
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        type: 'buy',
        price: 45000,
        strength: 0.8,
        timestamp: new Date().toISOString(),
        reason: 'Oversold RSI with bullish divergence',
        suggestedActions: {
          entry: 45000,
          target: 48000,
          stopLoss: 43000
        }
      }
    ]
  };
};

const PersonalizedMarketInsights: React.FC = () => {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock trading account for the service call
  const mockAccount: TradingAccount = {
    id: '1',
    name: 'Default Account',
    trades: [],
    balance: 10000,
    currency: 'AUD',
    createdAt: new Date().toISOString(),
    type: 'paper',
    assets: []
  };

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const data = await getPersonalizedMarketInsights(mockAccount);
      setInsights(data.insights);
      setSignals(data.signals);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Target className="h-4 w-4" />;
      case 'risk': return <AlertTriangle className="h-4 w-4" />;
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'text-green-600';
      case 'risk': return 'text-red-600';
      case 'trend': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          <CardTitle>AI Market Insights</CardTitle>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadInsights}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights">Market Insights</TabsTrigger>
            <TabsTrigger value="signals">Trading Signals</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="mt-4">
            <div className="space-y-4">
              {insights.length === 0 ? (
                <div className="text-center py-8">
                  <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No insights available</p>
                  <p className="text-sm text-muted-foreground">AI analysis will appear here based on your portfolio</p>
                </div>
              ) : (
                insights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={getInsightColor(insight.type)}>
                          {getInsightIcon(insight.type)}
                        </span>
                        <h3 className="font-medium">{insight.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {Math.round(insight.confidence * 100)}% confidence
                        </Badge>
                        <Badge variant="secondary">
                          {insight.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{insight.summary}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Relevance:</span>
                        <Progress value={insight.relevance * 100} className="w-20 h-2" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(insight.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="signals" className="mt-4">
            <div className="space-y-4">
              {signals.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No trading signals available</p>
                  <p className="text-sm text-muted-foreground">AI trading signals will appear here</p>
                </div>
              ) : (
                signals.map((signal) => (
                  <div key={signal.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant={signal.type === 'buy' ? 'default' : 'secondary'}>
                          {signal.type.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{signal.coinSymbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${signal.price.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          Strength: {Math.round(signal.strength * 100)}%
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{signal.reason}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Entry:</span>
                        <div className="font-medium">${signal.suggestedActions.entry.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Target:</span>
                        <div className="font-medium text-green-600">
                          ${signal.suggestedActions.target.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stop Loss:</span>
                        <div className="font-medium text-red-600">
                          ${signal.suggestedActions.stopLoss.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonalizedMarketInsights;
