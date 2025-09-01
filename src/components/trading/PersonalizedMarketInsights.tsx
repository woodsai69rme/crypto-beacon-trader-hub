
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';
import { MarketInsight, TradingSignal } from '@/types/trading';

const PersonalizedMarketInsights: React.FC = () => {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>([]);

  useEffect(() => {
    // Mock market insights
    const mockInsights: MarketInsight[] = [
      {
        id: '1',
        title: 'Bitcoin Showing Strong Bullish Momentum',
        description: 'Technical indicators suggest BTC is breaking key resistance levels',
        summary: 'BTC breaking $65,000 resistance with strong volume',
        details: 'Multiple technical indicators including RSI, MACD, and moving averages are showing bullish alignment.',
        confidence: 85,
        assets: ['BTC'],
        symbols: ['BTC'],
        type: 'bullish',
        timeframe: '1d',
        relevance: 95,
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Ethereum Layer 2 Adoption Accelerating',
        description: 'Increased activity on Polygon and Arbitrum networks',
        summary: 'L2 solutions driving ETH ecosystem growth',
        details: 'Transaction volumes on Layer 2 networks have increased 300% this month.',
        confidence: 78,
        assets: ['ETH'],
        symbols: ['ETH'],
        type: 'bullish',
        timeframe: '1w',
        relevance: 88,
        timestamp: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Market Volatility Expected Due to Fed Meeting',
        description: 'FOMC decision could impact crypto markets significantly',
        summary: 'Prepare for increased volatility',
        details: 'Historical data shows crypto markets react strongly to Federal Reserve announcements.',
        confidence: 72,
        assets: ['BTC', 'ETH'],
        symbols: ['BTC', 'ETH'],
        type: 'bearish',
        timeframe: '1d',
        relevance: 90,
        timestamp: new Date().toISOString()
      }
    ];

    const mockSignals: TradingSignal[] = [
      {
        id: '1',
        coinId: 'bitcoin',
        coinSymbol: 'BTC',
        type: 'buy',
        price: 65000,
        confidence: 85,
        entryPrice: 65000,
        targetPrice: 70000,
        stopLoss: 62000,
        source: 'Technical Analysis',
        timestamp: new Date().toISOString(),
        reason: 'Breaking resistance with strong volume',
        suggestedActions: {
          entry: 65000,
          target: 70000,
          stopLoss: 62000
        }
      }
    ];

    setInsights(mockInsights);
    setTradingSignals(mockSignals);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Personalized Market Insights</h2>
        <p className="text-muted-foreground mb-6">
          AI-powered analysis tailored to your portfolio and trading preferences
        </p>
      </div>

      {/* Market Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Market Insights</h3>
          {insights.map((insight) => (
            <Card key={insight.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <CardTitle className="text-base">{insight.title}</CardTitle>
                  </div>
                  <Badge className={getConfidenceColor(insight.confidence)}>
                    {insight.confidence}% confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {insight.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {insight.symbols.map((symbol) => (
                      <Badge key={symbol} variant="outline" className="text-xs">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {insight.timeframe}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trading Signals */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Trading Signals</h3>
          {tradingSignals.map((signal) => (
            <Card key={signal.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-base">
                      {signal.type.toUpperCase()} {signal.coinSymbol}
                    </CardTitle>
                  </div>
                  <Badge className={getConfidenceColor(signal.confidence)}>
                    {signal.confidence}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {signal.reason}
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Entry</p>
                    <p className="font-semibold">${signal.suggestedActions.entry.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Target</p>
                    <p className="font-semibold text-green-600">${signal.suggestedActions.target.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stop Loss</p>
                    <p className="font-semibold text-red-600">${signal.suggestedActions.stopLoss.toLocaleString()}</p>
                  </div>
                </div>

                <Button size="sm" className="w-full">
                  Execute Trade
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedMarketInsights;
