
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  LineChart, 
  Activity,
  ArrowRight, 
  AlertTriangle,
  Info, 
  Zap 
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface IndicatorMetric {
  name: string;
  value: string | number;
  status: 'bullish' | 'bearish' | 'neutral';
  description?: string;
  strength?: number;
}

const mockIndicators: Record<string, IndicatorMetric[]> = {
  momentum: [
    { name: "RSI (14)", value: 62, status: "neutral", description: "Neither overbought nor oversold", strength: 50 },
    { name: "MACD", value: "Bullish Crossover", status: "bullish", description: "MACD line crossed above signal line", strength: 75 },
    { name: "Stochastic (14,3,3)", value: 78, status: "bullish", description: "Fast stochastic above slow stochastic", strength: 65 },
    { name: "Williams %R", value: -22, status: "bullish", description: "Not yet overbought", strength: 60 },
    { name: "CCI", value: 125, status: "bullish", description: "Above 100, showing strength", strength: 70 },
  ],
  trend: [
    { name: "20 EMA vs 50 EMA", value: "Bullish Cross", status: "bullish", description: "Short-term EMA above long-term EMA", strength: 80 },
    { name: "ADX (14)", value: 28, status: "bullish", description: "Strong trend in place (>25)", strength: 70 },
    { name: "Parabolic SAR", value: "Below Price", status: "bullish", description: "Indicates uptrend", strength: 75 },
    { name: "Ichimoku Cloud", value: "Price Above Cloud", status: "bullish", description: "Strong bullish signal", strength: 85 },
    { name: "Supertrend", value: "Bullish", status: "bullish", description: "Price above supertrend line", strength: 80 },
  ],
  volatility: [
    { name: "Bollinger Bands", value: "Middle", status: "neutral", description: "Price in middle of bands", strength: 50 },
    { name: "ATR (14)", value: 1250, status: "neutral", description: "Average volatility", strength: 50 },
    { name: "Standard Deviation", value: "Increasing", status: "bearish", description: "Volatility picking up", strength: 40 },
    { name: "Keltner Channels", value: "Within Channel", status: "neutral", description: "No breakout signals", strength: 50 },
  ],
  volume: [
    { name: "OBV", value: "Rising", status: "bullish", description: "Accumulation phase", strength: 75 },
    { name: "CMF (20)", value: 0.15, status: "bullish", description: "Positive money flow", strength: 70 },
    { name: "Volume MA", value: "+22%", status: "bullish", description: "Above average volume", strength: 80 },
    { name: "A/D Line", value: "Confirming", status: "bullish", description: "Confirms price trend", strength: 75 },
  ]
};

const AdvancedTechnicalAnalysis: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("BTC/USD");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1D");
  
  const activeIndicators = {
    bullish: 16,
    bearish: 1,
    neutral: 5,
    total: 22,
  };
  
  const overallSignal = "Strong Buy";
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "bullish": return "text-green-500 dark:text-green-400";
      case "bearish": return "text-red-500 dark:text-red-400";
      default: return "text-blue-500 dark:text-blue-400";
    }
  };
  
  const getStatusBg = (status: string) => {
    switch (status) {
      case "bullish": return "bg-green-50 dark:bg-green-900/20";
      case "bearish": return "bg-red-50 dark:bg-red-900/20";
      default: return "bg-blue-50 dark:bg-blue-900/20";
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Advanced Technical Analysis
        </CardTitle>
        <CardDescription>
          Multi-indicator technical analysis for informed trading decisions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm font-medium mb-2">Symbol</div>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC/USD">Bitcoin (BTC/USD)</SelectItem>
                <SelectItem value="ETH/USD">Ethereum (ETH/USD)</SelectItem>
                <SelectItem value="SOL/USD">Solana (SOL/USD)</SelectItem>
                <SelectItem value="ADA/USD">Cardano (ADA/USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm font-medium mb-2">Timeframe</div>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15m">15 minutes</SelectItem>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="4h">4 hours</SelectItem>
                <SelectItem value="1D">1 day</SelectItem>
                <SelectItem value="1W">1 week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Card className="flex-1 min-w-[200px]">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="text-sm text-muted-foreground mb-1">Signal Strength</div>
              <div className="text-2xl font-bold text-green-500">8.7</div>
              <div className="text-xs text-muted-foreground">out of 10</div>
            </CardContent>
          </Card>
          
          <Card className="flex-1 min-w-[200px]">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Overall Signal</div>
              <div className="text-2xl font-bold text-green-500">{overallSignal}</div>
              <div className="text-xs text-muted-foreground">Based on {activeIndicators.total} indicators</div>
            </CardContent>
          </Card>
          
          <Card className="flex-1 min-w-[200px]">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Indicator Breakdown</div>
              <div className="flex gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="text-sm font-medium">{activeIndicators.bullish}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div className="text-sm font-medium">{activeIndicators.neutral}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="text-sm font-medium">{activeIndicators.bearish}</div>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden flex">
                <div className="bg-green-500 h-full" style={{ width: `${(activeIndicators.bullish/activeIndicators.total)*100}%` }}></div>
                <div className="bg-blue-500 h-full" style={{ width: `${(activeIndicators.neutral/activeIndicators.total)*100}%` }}></div>
                <div className="bg-red-500 h-full" style={{ width: `${(activeIndicators.bearish/activeIndicators.total)*100}%` }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Alert className="bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Technical analysis provides insights but should be used alongside other methods and risk management strategies.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="momentum" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="momentum">Momentum</TabsTrigger>
            <TabsTrigger value="trend">Trend</TabsTrigger>
            <TabsTrigger value="volatility">Volatility</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
          </TabsList>
          
          {Object.keys(mockIndicators).map(category => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {mockIndicators[category].map((indicator, idx) => (
                  <div 
                    key={`${category}-${idx}`} 
                    className={`border rounded-md p-3 ${getStatusBg(indicator.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{indicator.name}</div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5">
                              <Info className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{indicator.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className={`text-lg font-bold ${getStatusColor(indicator.status)}`}>
                      {indicator.value}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className={`text-xs font-medium ${getStatusColor(indicator.status)} capitalize`}>
                        {indicator.status}
                      </div>
                      {typeof indicator.strength === 'number' && (
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-12 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                indicator.status === 'bullish' ? 'bg-green-500' : 
                                indicator.status === 'bearish' ? 'bg-red-500' : 
                                'bg-blue-500'
                              }`}
                              style={{ width: `${indicator.strength}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{indicator.strength}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  {category === 'momentum' && 'Momentum indicators measure the velocity of price movements.'}
                  {category === 'trend' && 'Trend indicators help identify the direction of the market.'}
                  {category === 'volatility' && 'Volatility indicators measure the rate of price movement.'}
                  {category === 'volume' && 'Volume indicators analyze trading volume to confirm trends.'}
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  Learn More <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" className="gap-2">
            <LineChart className="h-4 w-4" />
            View on Chart
          </Button>
          <Button className="gap-2">
            <Zap className="h-4 w-4" />
            Open Trade Setup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedTechnicalAnalysis;
