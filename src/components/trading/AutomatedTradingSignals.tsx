
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, TrendingDown, Bot, Zap, Target } from 'lucide-react';

interface TradingSignal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  currentPrice: number;
  targetPrice?: number;
  stopLoss?: number;
  timestamp: string;
  source: string;
  reasoning: string;
}

const AutomatedTradingSignals: React.FC = () => {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock trading signals
  useEffect(() => {
    const mockSignals: TradingSignal[] = [
      {
        id: '1',
        symbol: 'BTC/AUD',
        action: 'BUY',
        confidence: 85,
        currentPrice: 65000,
        targetPrice: 70000,
        stopLoss: 62000,
        timestamp: new Date().toISOString(),
        source: 'Trend Following Bot',
        reasoning: 'Strong upward momentum with high volume confirmation'
      },
      {
        id: '2',
        symbol: 'ETH/AUD',
        action: 'SELL',
        confidence: 72,
        currentPrice: 4200,
        targetPrice: 3800,
        stopLoss: 4350,
        timestamp: new Date(Date.now() - 300000).toISOString(),
        source: 'Mean Reversion Bot',
        reasoning: 'Overbought conditions detected, expecting pullback'
      },
      {
        id: '3',
        symbol: 'SOL/AUD',
        action: 'HOLD',
        confidence: 60,
        currentPrice: 180,
        timestamp: new Date(Date.now() - 600000).toISOString(),
        source: 'Momentum Bot',
        reasoning: 'Sideways movement, waiting for clear direction'
      }
    ];

    setSignals(mockSignals);
  }, []);

  const generateSignal = async () => {
    setIsLoading(true);
    
    // Simulate AI signal generation
    setTimeout(() => {
      const symbols = ['BTC/AUD', 'ETH/AUD', 'SOL/AUD', 'ADA/AUD', 'DOT/AUD'];
      const actions: ('BUY' | 'SELL' | 'HOLD')[] = ['BUY', 'SELL', 'HOLD'];
      const sources = ['AI Pattern Bot', 'Sentiment Bot', 'Volume Bot', 'Breakout Bot'];
      
      const newSignal: TradingSignal = {
        id: Date.now().toString(),
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        confidence: Math.floor(Math.random() * 40) + 60,
        currentPrice: Math.floor(Math.random() * 50000) + 1000,
        targetPrice: Math.floor(Math.random() * 60000) + 1000,
        stopLoss: Math.floor(Math.random() * 40000) + 1000,
        timestamp: new Date().toISOString(),
        source: sources[Math.floor(Math.random() * sources.length)],
        reasoning: 'AI-generated signal based on current market conditions'
      };

      setSignals(prev => [newSignal, ...prev.slice(0, 9)]);
      setIsLoading(false);
    }, 2000);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-100 text-green-800';
      case 'SELL': return 'bg-red-100 text-red-800';
      case 'HOLD': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'BUY': return <TrendingUp className="h-4 w-4" />;
      case 'SELL': return <TrendingDown className="h-4 w-4" />;
      case 'HOLD': return <Target className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Automated Trading Signals
          </CardTitle>
          <Button 
            onClick={generateSignal} 
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generate Signal
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {signals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No trading signals yet</p>
                <p className="text-sm">Click "Generate Signal" to get AI recommendations</p>
              </div>
            ) : (
              signals.map((signal) => (
                <div key={signal.id} className="p-4 border rounded-lg bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getActionColor(signal.action)}`}>
                        {getActionIcon(signal.action)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{signal.symbol}</h3>
                        <p className="text-sm text-muted-foreground">{signal.source}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getActionColor(signal.action)}>
                        {signal.action}
                      </Badge>
                      <p className={`text-sm font-semibold mt-1 ${getConfidenceColor(signal.confidence)}`}>
                        {signal.confidence}% confidence
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current</p>
                      <p className="font-semibold">${signal.currentPrice.toLocaleString()}</p>
                    </div>
                    {signal.targetPrice && (
                      <div>
                        <p className="text-muted-foreground">Target</p>
                        <p className="font-semibold text-green-600">${signal.targetPrice.toLocaleString()}</p>
                      </div>
                    )}
                    {signal.stopLoss && (
                      <div>
                        <p className="text-muted-foreground">Stop Loss</p>
                        <p className="font-semibold text-red-600">${signal.stopLoss.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground mb-1">Reasoning:</p>
                    <p className="text-sm">{signal.reasoning}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {new Date(signal.timestamp).toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm">
                        Execute Trade
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AutomatedTradingSignals;
