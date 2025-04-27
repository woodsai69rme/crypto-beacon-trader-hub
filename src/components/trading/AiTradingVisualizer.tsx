
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface AiTradingVisualizerProps {
  botId: string;
  tradingPair: string;
  timeframe: string;
  isRunning: boolean;
}

const AiTradingVisualizer: React.FC<AiTradingVisualizerProps> = ({
  botId,
  tradingPair,
  timeframe,
  isRunning
}) => {
  const [marketState, setMarketState] = useState<'trending' | 'ranging' | 'volatile'>('ranging');
  const [signals, setSignals] = useState<Array<{type: string; confidence: number; time: string}>>([]);
  const [marketInsights, setMarketInsights] = useState<string[]>([
    "Market shows signs of consolidation",
    "Volume decreasing in recent periods",
    "Support level identified at $58,200",
    "Key resistance level at $62,500"
  ]);
  
  useEffect(() => {
    if (isRunning && botId) {
      // Generate a new signal every ~15-25 seconds while running
      const interval = setInterval(() => {
        const signalType = Math.random() > 0.5 ? "BUY" : "SELL";
        const confidence = Math.floor(Math.random() * 30) + 70; // 70-99% confidence
        
        const newSignal = {
          type: signalType,
          confidence,
          time: new Date().toISOString()
        };
        
        setSignals(prev => [newSignal, ...prev].slice(0, 10));
        
        // Occasionally change market state
        if (Math.random() > 0.8) {
          const states: Array<'trending' | 'ranging' | 'volatile'> = ['trending', 'ranging', 'volatile'];
          setMarketState(states[Math.floor(Math.random() * states.length)]);
        }
      }, Math.random() * 10000 + 15000);
      
      return () => clearInterval(interval);
    }
  }, [isRunning, botId]);
  
  const getMarketStateIndicator = () => {
    switch (marketState) {
      case 'trending':
        return (
          <>
            <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
            <span>Trending Market</span>
          </>
        );
      case 'ranging':
        return (
          <>
            <ArrowRight className="h-5 w-5 text-blue-500 mr-2" />
            <span>Ranging Market</span>
          </>
        );
      case 'volatile':
        return (
          <>
            <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
            <span>Volatile Market</span>
          </>
        );
    }
  };
  
  if (!botId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Please select an AI bot to view the trading visualization
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Trading Visualization</CardTitle>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                {tradingPair} • {timeframe}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-muted/20 rounded-md relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">
                  {isRunning 
                    ? "AI trading visualization active" 
                    : "Start the AI bot to see trading visualization"}
                </p>
              </div>
              
              {isRunning && (
                <svg className="absolute inset-0 w-full h-full">
                  {/* Mock candlestick chart */}
                  {[...Array(20)].map((_, i) => {
                    const x = i * 30 + 10;
                    const height = Math.random() * 60 + 20;
                    const y = Math.random() * 100 + 50;
                    const isGreen = Math.random() > 0.4;
                    const wickHeight = Math.random() * 20 + 10;
                    
                    return (
                      <g key={i}>
                        {/* Wick */}
                        <line 
                          x1={x + 7.5} 
                          y1={y - wickHeight} 
                          x2={x + 7.5} 
                          y2={y + height + wickHeight} 
                          stroke={isGreen ? "#22c55e" : "#ef4444"} 
                          strokeWidth="1" 
                        />
                        {/* Candle */}
                        <rect 
                          x={x} 
                          y={y} 
                          width="15" 
                          height={height} 
                          fill={isGreen ? "#22c55e33" : "#ef444433"} 
                          stroke={isGreen ? "#22c55e" : "#ef4444"}
                          strokeWidth="1"
                        />
                        
                        {/* Occasional signal indicator */}
                        {Math.random() > 0.85 && (
                          <circle 
                            cx={x + 7.5} 
                            cy={isGreen ? y - 15 : y + height + 15} 
                            r="5" 
                            fill={isGreen ? "#22c55e" : "#ef4444"} 
                          />
                        )}
                      </g>
                    );
                  })}
                  
                  {/* Mock moving average */}
                  <path
                    d="M10,180 C50,170 100,190 150,160 C200,140 250,145 300,130 C350,150 400,140 450,120 C500,110 550,130 600,110"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                  
                  {/* Mock second moving average */}
                  <path
                    d="M10,200 C50,190 100,210 150,190 C200,180 250,185 300,170 C350,190 400,180 450,165 C500,160 550,170 600,150"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                </svg>
              )}
            </div>
            
            <div className="flex items-center mt-4">
              {getMarketStateIndicator()}
              <Badge variant="outline" className="ml-auto">
                {isRunning ? "Trading" : "Idle"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {marketInsights.map((insight, i) => (
                <li key={i} className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Trading Signals</CardTitle>
          </CardHeader>
          <CardContent>
            {signals.length > 0 ? (
              <div className="space-y-3">
                {signals.map((signal, i) => (
                  <div key={i} className="flex justify-between items-center p-2 border rounded-md">
                    <div className="flex items-center">
                      <div className={`h-4 w-4 rounded-full ${signal.type === "BUY" ? "bg-green-500" : "bg-red-500"} mr-2`} />
                      <div>
                        <div className="font-medium">
                          {signal.type === "BUY" ? "Buy Signal" : "Sell Signal"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(signal.time).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {signal.confidence}% confidence
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No signals generated yet
              </div>
            )}
            
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Signal Distribution</div>
              <div className="h-4 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-l-full"
                  style={{ width: `${signals.filter(s => s.type === "BUY").length / Math.max(signals.length, 1) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <div>Buy: {signals.filter(s => s.type === "BUY").length}</div>
                <div>Sell: {signals.filter(s => s.type === "SELL").length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Technical Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div>RSI (14)</div>
                <div className="font-medium">65.8 <span className="text-amber-500">(Neutral)</span></div>
              </div>
              <div className="flex justify-between">
                <div>MACD</div>
                <div className="font-medium">1.23 <span className="text-green-500">(Bullish)</span></div>
              </div>
              <div className="flex justify-between">
                <div>Bollinger Bands</div>
                <div className="font-medium"><span className="text-amber-500">(Neutral)</span></div>
              </div>
              <div className="flex justify-between">
                <div>Moving Averages</div>
                <div className="font-medium"><span className="text-green-500">(Bullish)</span></div>
              </div>
              <div className="flex justify-between">
                <div>Stochastic</div>
                <div className="font-medium">78.5 <span className="text-amber-500">(Neutral)</span></div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Indicator Summary</div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="border rounded-md p-2">
                  <div className="text-green-500 font-medium">6</div>
                  <div className="text-muted-foreground">Buy</div>
                </div>
                <div className="border rounded-md p-2">
                  <div className="text-amber-500 font-medium">4</div>
                  <div className="text-muted-foreground">Neutral</div>
                </div>
                <div className="border rounded-md p-2">
                  <div className="text-red-500 font-medium">2</div>
                  <div className="text-muted-foreground">Sell</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AiTradingVisualizer;
