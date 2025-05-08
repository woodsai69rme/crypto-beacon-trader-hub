
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LiveTechnicalIndicatorsProps {
  coinId: string;
}

interface Indicator {
  name: string;
  value: string | number;
  signal: 'buy' | 'sell' | 'neutral';
  timeframe: string;
}

const LiveTechnicalIndicators: React.FC<LiveTechnicalIndicatorsProps> = ({ coinId }) => {
  // Mock technical indicators data
  const technicalIndicators: Indicator[] = [
    { name: 'RSI', value: 58, signal: 'neutral', timeframe: '1h' },
    { name: 'MACD', value: 'Bullish Crossover', signal: 'buy', timeframe: '4h' },
    { name: 'Moving Avg (50/200)', value: 'Golden Cross', signal: 'buy', timeframe: '1d' },
    { name: 'Bollinger Bands', value: 'Upper Band Test', signal: 'sell', timeframe: '1h' },
    { name: 'Stochastic', value: 78, signal: 'neutral', timeframe: '4h' },
    { name: 'OBV', value: 'Rising', signal: 'buy', timeframe: '1d' },
    { name: 'Ichimoku Cloud', value: 'Above Cloud', signal: 'buy', timeframe: '1d' },
    { name: 'ADX', value: 28, signal: 'neutral', timeframe: '4h' },
  ];

  const timeframes = ['5m', '15m', '1h', '4h', '1d'];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {timeframes.map((timeframe) => (
              <Badge 
                key={timeframe} 
                variant={timeframe === '1d' ? 'default' : 'outline'}
                className="cursor-pointer"
              >
                {timeframe}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {technicalIndicators.map((indicator, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{indicator.name}</div>
                    <Badge 
                      variant={
                        indicator.signal === 'buy' ? 'default' : 
                        indicator.signal === 'sell' ? 'destructive' : 
                        'outline'
                      }
                    >
                      {indicator.signal.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-2 text-xl font-bold">
                    {indicator.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Timeframe: {indicator.timeframe}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-4">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm font-medium mb-2">Summary</div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-green-500 font-bold text-lg">4</div>
                    <div className="text-xs text-muted-foreground">Buy Signals</div>
                  </div>
                  <div>
                    <div className="text-amber-500 font-bold text-lg">3</div>
                    <div className="text-xs text-muted-foreground">Neutral</div>
                  </div>
                  <div>
                    <div className="text-red-500 font-bold text-lg">1</div>
                    <div className="text-xs text-muted-foreground">Sell Signals</div>
                  </div>
                </div>
                <div className="mt-4 text-sm font-medium text-center">
                  Overall Signal: <span className="text-green-500">Bullish</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTechnicalIndicators;
