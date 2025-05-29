import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, Minus, Bot, AlertTriangle, Activity } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/hooks/use-toast';

interface TradingSignal {
  id: string;
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price: number;
  reasoning: string;
  timestamp: string;
  strategy: string;
  source: 'ai-analysis' | 'technical-indicator' | 'sentiment-analysis';
}

const AutomatedTradingSignals: React.FC = () => {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();

  // Generate mock signals for demonstration
  useEffect(() => {
    if (isEnabled) {
      const generateSignal = (): TradingSignal => {
        const symbols = ['BTC', 'ETH', 'ADA', 'DOT', 'SOL'];
        const strategies = ['momentum', 'mean-reversion', 'breakout', 'sentiment'];
        const sources: TradingSignal['source'][] = ['ai-analysis', 'technical-indicator', 'sentiment-analysis'];
        
        return {
          id: Math.random().toString(36).substr(2, 9),
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          signal: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)] as 'BUY' | 'SELL' | 'HOLD',
          confidence: Math.random() * 0.4 + 0.6, // 60-100%
          price: Math.random() * 50000 + 30000,
          reasoning: `${strategies[Math.floor(Math.random() * strategies.length)]} analysis indicates favorable conditions`,
          timestamp: new Date().toISOString(),
          strategy: strategies[Math.floor(Math.random() * strategies.length)],
          source: sources[Math.floor(Math.random() * sources.length)]
        };
      };

      const interval = setInterval(() => {
        const newSignal = generateSignal();
        setSignals(prev => [newSignal, ...prev.slice(0, 9)]);
        
        toast({
          title: `New ${newSignal.signal} Signal`,
          description: `${newSignal.symbol}: ${newSignal.reasoning}`
        });
      }, 15000);

      // Generate initial signals
      const initialSignals = Array.from({ length: 5 }, generateSignal);
      setSignals(initialSignals);

      return () => clearInterval(interval);
    } else {
      setSignals([]);
    }
  }, [isEnabled]);

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BUY': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'SELL': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'bg-green-100 text-green-800 border-green-200';
      case 'SELL': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Automated Trading Signals
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEnabled ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Enable automated signals to receive AI-powered trading recommendations
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {signals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analyzing markets for trading opportunities...</p>
              </div>
            ) : (
              signals.map((signal) => (
                <div key={signal.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSignalIcon(signal.signal)}
                      <span className="font-medium">{signal.symbol}/AUD</span>
                      <Badge className={getSignalColor(signal.signal)}>
                        {signal.signal}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(signal.price)}</div>
                      <div className={`text-sm ${getConfidenceColor(signal.confidence)}`}>
                        {(signal.confidence * 100).toFixed(1)}% confidence
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{signal.reasoning}</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Strategy: {signal.strategy}</span>
                      <span>Source: {signal.source}</span>
                      <span>{new Date(signal.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomatedTradingSignals;
