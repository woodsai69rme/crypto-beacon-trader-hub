
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarketInsight, TradingSignal } from '@/types/trading';
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb } from 'lucide-react';

const PersonalizedMarketInsights: React.FC = () => {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [signals, setSignals] = useState<TradingSignal[]>([]);

  useEffect(() => {
    // Generate mock insights
    const mockInsights: MarketInsight[] = [
      {
        id: '1',
        title: 'Bitcoin Showing Strong Momentum',
        description: 'Bitcoin has successfully broken through the $60,000 resistance level with significant volume support, indicating potential for further upward movement.',
        summary: 'BTC has broken above key resistance levels with increasing volume',
        details: 'Bitcoin has successfully broken through the $60,000 resistance level with significant volume support, indicating potential for further upward movement.',
        confidence: 0.85,
        assets: ['BTC'],
        type: 'bullish',
        relevance: 0.9,
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Ethereum Network Upgrade Impact',
        description: 'The latest Ethereum network upgrade has improved transaction efficiency, leading to increased adoption and positive price momentum.',
        summary: 'Recent network improvements driving positive sentiment',
        details: 'The latest Ethereum network upgrade has improved transaction efficiency, leading to increased adoption and positive price momentum.',
        confidence: 0.78,
        assets: ['ETH'],
        type: 'bullish',
        relevance: 0.8,
        timestamp: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Market Correction Warning',
        description: 'Multiple technical indicators are showing overbought conditions across major cryptocurrencies, suggesting a potential correction in the near term.',
        summary: 'Technical indicators suggest potential short-term correction',
        details: 'Multiple technical indicators are showing overbought conditions across major cryptocurrencies, suggesting a potential correction in the near term.',
        confidence: 0.72,
        assets: ['BTC', 'ETH', 'SOL'],
        type: 'bearish',
        relevance: 0.7,
        timestamp: new Date().toISOString()
      }
    ];

    const mockSignals: TradingSignal[] = [
      {
        id: '1',
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        type: 'buy',
        price: 58500,
        strength: 0.82,
        timestamp: new Date().toISOString(),
        reason: 'Strong momentum with volume confirmation',
        suggestedActions: {
          entry: 58500,
          target: 62000,
          stopLoss: 56000
        }
      }
    ];

    setInsights(mockInsights);
    setSignals(mockSignals);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{insight.title}</h3>
                    {insight.summary && (
                      <p className="text-sm text-muted-foreground mb-2">{insight.summary}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {insight.type === 'bullish' && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Bullish
                      </Badge>
                    )}
                    {insight.type === 'bearish' && (
                      <Badge variant="destructive">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Bearish
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {(insight.confidence * 100).toFixed(0)}% confidence
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm mb-3">{insight.details}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Assets:</span>
                    {insight.assets?.map((asset) => (
                      <Badge key={asset} variant="outline" className="text-xs">
                        {asset}
                      </Badge>
                    ))}
                  </div>
                  {insight.relevance && (
                    <span className="text-sm text-muted-foreground">
                      Relevance: {(insight.relevance * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                
                {insight.timestamp && (
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(insight.timestamp).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {signals && signals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Trading Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {signals.map((signal) => (
                <div key={signal.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant={signal.type === 'buy' ? 'default' : 'destructive'}>
                        {signal.type.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{signal.coinSymbol}</span>
                    </div>
                    <Badge variant="outline">
                      {(signal.strength * 100).toFixed(0)}% strength
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{signal.reason}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Entry:</span>
                      <p className="font-medium">${signal.suggestedActions.entry.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target:</span>
                      <p className="font-medium text-green-600">${signal.suggestedActions.target.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stop Loss:</span>
                      <p className="font-medium text-red-600">${signal.suggestedActions.stopLoss.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1">
                      Execute Trade
                    </Button>
                    <Button size="sm" variant="outline">
                      Save Signal
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalizedMarketInsights;
