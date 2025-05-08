
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUp, 
  ArrowDown, 
  AlertTriangle, 
  Clock, 
  Zap, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react";

interface LiveTradingSignalsProps {
  coinId: string;
}

interface TradingSignal {
  id: string;
  type: 'entry' | 'exit' | 'alert';
  direction: 'long' | 'short' | 'neutral';
  price: number;
  confidence: number;
  source: string;
  timeframe: string;
  timestamp: string;
}

const LiveTradingSignals: React.FC<LiveTradingSignalsProps> = ({ coinId }) => {
  // Mock trading signals data
  const tradingSignals: TradingSignal[] = [
    { 
      id: '1', 
      type: 'entry', 
      direction: 'long', 
      price: 61250, 
      confidence: 85, 
      source: 'AI Model', 
      timeframe: '4h',
      timestamp: '2023-05-01T12:30:00Z'
    },
    { 
      id: '2', 
      type: 'alert', 
      direction: 'neutral', 
      price: 61300, 
      confidence: 75, 
      source: 'Pattern Recognition', 
      timeframe: '1h',
      timestamp: '2023-05-01T12:15:00Z'
    },
    { 
      id: '3', 
      type: 'exit', 
      direction: 'long', 
      price: 61500, 
      confidence: 80, 
      source: 'Technical Indicators', 
      timeframe: '1d',
      timestamp: '2023-05-01T12:00:00Z'
    },
    { 
      id: '4', 
      type: 'entry', 
      direction: 'short', 
      price: 61700, 
      confidence: 70, 
      source: 'Sentiment Analysis', 
      timeframe: '1d',
      timestamp: '2023-05-01T11:45:00Z'
    },
  ];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSignalIcon = (signal: TradingSignal) => {
    if (signal.type === 'entry') {
      if (signal.direction === 'long') {
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      } else {
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      }
    } else if (signal.type === 'exit') {
      return <Clock className="h-4 w-4 text-amber-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSignalTypeLabel = (signal: TradingSignal) => {
    if (signal.type === 'entry') {
      return signal.direction === 'long' ? 'Enter Long' : 'Enter Short';
    } else if (signal.type === 'exit') {
      return 'Exit Position';
    } else {
      return 'Price Alert';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Recent Signals</div>
            <Badge variant="outline" className="font-normal">4 new</Badge>
          </div>
          
          <div className="space-y-2">
            {tradingSignals.map((signal) => (
              <Card key={signal.id} className="shadow-sm">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div>
                        {getSignalIcon(signal)}
                      </div>
                      <div>
                        <div className="font-medium">{getSignalTypeLabel(signal)}</div>
                        <div className="text-xs text-muted-foreground">
                          ${signal.price.toLocaleString()} • {signal.timeframe} • {signal.source}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <Zap className="h-3 w-3 text-amber-500 mr-1" />
                        <span className="text-xs">{signal.confidence}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(signal.timestamp)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {tradingSignals.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No recent signals available</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Signals updated in real-time
            </div>
            <Badge variant="outline" className="cursor-pointer">
              View All
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTradingSignals;
