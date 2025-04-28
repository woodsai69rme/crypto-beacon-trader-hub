
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuantitativeAnalysis as QuantAnalysisType } from '@/types/trading';
import { LineChart, TrendingUp, TrendingDown, ArrowRight, CircleDollarSign, Clock, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Mock data for quantitative analysis
const mockQuantData: Record<string, QuantAnalysisType[]> = {
  "BTC": [
    {
      id: "btc-1h",
      symbol: "BTC",
      timeframe: "1h",
      timestamp: new Date().toISOString(),
      buyProbability: 0.65,
      sellProbability: 0.25,
      holdProbability: 0.10,
      expectedValue: 2.3,
      riskRewardRatio: 1.8,
      confidenceScore: 0.75,
      signals: [
        { indicator: "RSI", value: 58, signal: 'buy', strength: 0.7, timeframe: '1h' },
        { indicator: "MACD", value: 0.0025, signal: 'buy', strength: 0.8, timeframe: '1h' },
        { indicator: "MA Cross", value: 1, signal: 'buy', strength: 0.75, timeframe: '1h' },
        { indicator: "Volume Profile", value: 1.2, signal: 'buy', strength: 0.6, timeframe: '1h' },
        { indicator: "Bollinger Bands", value: 0.8, signal: 'neutral', strength: 0.5, timeframe: '1h' }
      ],
      shortTerm: {
        direction: 'up',
        probability: 0.68,
        targetPrice: 87500
      },
      mediumTerm: {
        direction: 'up',
        probability: 0.62,
        targetPrice: 92000
      },
      longTerm: {
        direction: 'up',
        probability: 0.55,
        targetPrice: 95000
      }
    },
    {
      id: "btc-4h",
      symbol: "BTC",
      timeframe: "4h",
      timestamp: new Date().toISOString(),
      buyProbability: 0.55,
      sellProbability: 0.32,
      holdProbability: 0.13,
      expectedValue: 1.8,
      riskRewardRatio: 1.6,
      confidenceScore: 0.68,
      signals: [
        { indicator: "RSI", value: 55, signal: 'neutral', strength: 0.5, timeframe: '4h' },
        { indicator: "MACD", value: 0.0015, signal: 'buy', strength: 0.65, timeframe: '4h' },
        { indicator: "MA Cross", value: 0.8, signal: 'buy', strength: 0.6, timeframe: '4h' },
        { indicator: "Volume Profile", value: 1.1, signal: 'buy', strength: 0.7, timeframe: '4h' },
        { indicator: "Bollinger Bands", value: 0.7, signal: 'neutral', strength: 0.5, timeframe: '4h' }
      ],
      shortTerm: {
        direction: 'up',
        probability: 0.58,
        targetPrice: 89500
      },
      mediumTerm: {
        direction: 'up',
        probability: 0.54,
        targetPrice: 94000
      },
      longTerm: {
        direction: 'sideways',
        probability: 0.45,
        targetPrice: 90000
      }
    }
  ],
  "ETH": [
    {
      id: "eth-1h",
      symbol: "ETH",
      timeframe: "1h",
      timestamp: new Date().toISOString(),
      buyProbability: 0.45,
      sellProbability: 0.40,
      holdProbability: 0.15,
      expectedValue: 1.1,
      riskRewardRatio: 1.2,
      confidenceScore: 0.6,
      signals: [
        { indicator: "RSI", value: 48, signal: 'neutral', strength: 0.5, timeframe: '1h' },
        { indicator: "MACD", value: -0.0010, signal: 'sell', strength: 0.6, timeframe: '1h' },
        { indicator: "MA Cross", value: 0.3, signal: 'sell', strength: 0.65, timeframe: '1h' },
        { indicator: "Volume Profile", value: 0.9, signal: 'neutral', strength: 0.5, timeframe: '1h' },
        { indicator: "Bollinger Bands", value: 0.4, signal: 'sell', strength: 0.7, timeframe: '1h' }
      ],
      shortTerm: {
        direction: 'down',
        probability: 0.55,
        targetPrice: 2950
      },
      mediumTerm: {
        direction: 'sideways',
        probability: 0.50,
        targetPrice: 3050
      },
      longTerm: {
        direction: 'up',
        probability: 0.58,
        targetPrice: 3600
      }
    }
  ]
};

const QuantitativeAnalysis: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("BTC");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1h");
  
  const availableTimeframes = mockQuantData[selectedSymbol]?.map(item => item.timeframe) || [];
  const analysisData = mockQuantData[selectedSymbol]?.find(item => item.timeframe === selectedTimeframe);
  
  const getSignalColor = (signal: 'buy' | 'sell' | 'neutral') => {
    switch (signal) {
      case 'buy': return 'text-green-500';
      case 'sell': return 'text-red-500';
      case 'neutral': return 'text-yellow-500';
      default: return '';
    }
  };
  
  const getDirectionIcon = (direction: 'up' | 'down' | 'sideways') => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'sideways': return <ArrowRight className="h-4 w-4 text-yellow-500" />;
    }
  };
  
  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.7) return 'bg-green-500';
    if (probability >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  if (!analysisData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quantitative Analysis</CardTitle>
          <CardDescription>No data available for the selected symbol and timeframe</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              Quantitative Analysis
            </CardTitle>
            <CardDescription>
              AI-powered probability analysis and trade forecasting
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">Bitcoin</SelectItem>
                <SelectItem value="ETH">Ethereum</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedTimeframe} 
              onValueChange={setSelectedTimeframe}
              disabled={availableTimeframes.length === 0}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeframes.map(tf => (
                  <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <LineChart className="h-4 w-4 mr-1" /> Refresh
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">Last updated: {new Date(analysisData.timestamp).toLocaleTimeString()}</Badge>
          
          <Badge 
            variant="secondary" 
            className={`${analysisData.buyProbability > 0.6 ? 'bg-green-500/10 text-green-500' : 'bg-muted'}`}
          >
            {(analysisData.buyProbability * 100).toFixed(0)}% Buy
          </Badge>
          
          <Badge 
            variant="secondary" 
            className={`${analysisData.sellProbability > 0.6 ? 'bg-red-500/10 text-red-500' : 'bg-muted'}`}
          >
            {(analysisData.sellProbability * 100).toFixed(0)}% Sell
          </Badge>
          
          <Badge 
            variant="secondary" 
            className="bg-blue-500/10 text-blue-500"
          >
            Confidence: {(analysisData.confidenceScore * 100).toFixed(0)}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="probability">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="probability">Trade Probability</TabsTrigger>
            <TabsTrigger value="signals">Technical Signals</TabsTrigger>
            <TabsTrigger value="forecast">Price Targets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="probability">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Trade Direction Probabilities</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">Buy</div>
                      <div>{(analysisData.buyProbability * 100).toFixed(0)}%</div>
                    </div>
                    <Progress value={analysisData.buyProbability * 100} className="h-2 bg-muted" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">Sell</div>
                      <div>{(analysisData.sellProbability * 100).toFixed(0)}%</div>
                    </div>
                    <Progress value={analysisData.sellProbability * 100} className="h-2 bg-muted" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">Hold</div>
                      <div>{(analysisData.holdProbability * 100).toFixed(0)}%</div>
                    </div>
                    <Progress value={analysisData.holdProbability * 100} className="h-2 bg-muted" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md mt-4">
                  <div className="flex items-center">
                    <CircleDollarSign className="h-5 w-5 mr-2 text-green-500" />
                    <div>
                      <div className="font-medium">Expected Value</div>
                      <div className="text-sm text-muted-foreground">Based on win/loss ratio</div>
                    </div>
                  </div>
                  <div className="text-xl font-medium">{analysisData.expectedValue > 0 ? '+' : ''}{analysisData.expectedValue}%</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <div className="font-medium">Risk/Reward Ratio</div>
                      <div className="text-sm text-muted-foreground">Potential profit vs loss</div>
                    </div>
                  </div>
                  <div className="text-xl font-medium">{analysisData.riskRewardRatio}:1</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">AI Analysis Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <p className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                    <span>
                      Based on current market conditions, a {analysisData.buyProbability > analysisData.sellProbability ? 'BUY' : 'SELL'} signal is indicated with {(Math.max(analysisData.buyProbability, analysisData.sellProbability) * 100).toFixed(0)}% probability.
                    </span>
                  </p>
                  
                  <p className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                    <span>
                      The {selectedTimeframe} timeframe shows {analysisData.signals.filter(s => s.signal === 'buy').length} bullish and {analysisData.signals.filter(s => s.signal === 'sell').length} bearish indicators.
                    </span>
                  </p>
                  
                  <p className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                    <span>
                      Short-term price target: ${analysisData.shortTerm.targetPrice.toLocaleString()} with {(analysisData.shortTerm.probability * 100).toFixed(0)}% confidence.
                    </span>
                  </p>
                  
                  <p className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                    <span>
                      Expected value calculation shows a favorable {analysisData.expectedValue}% potential return based on probability modeling.
                    </span>
                  </p>
                  
                  <p className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                    <span>
                      {analysisData.riskRewardRatio >= 1.5 ? 'Strong' : 'Moderate'} risk-to-reward ratio of {analysisData.riskRewardRatio}:1 indicates {analysisData.riskRewardRatio >= 1.5 ? 'favorable' : 'acceptable'} trade conditions.
                    </span>
                  </p>
                </div>
                
                <div className="mt-6 p-3 bg-green-500/10 border border-green-500/30 rounded-md">
                  <h4 className="font-medium text-green-500">Trade Recommendation</h4>
                  <p className="text-sm mt-1">
                    {analysisData.buyProbability > 0.6 
                      ? `Consider opening a long position with target at $${analysisData.shortTerm.targetPrice.toLocaleString()}.` 
                      : analysisData.sellProbability > 0.6 
                        ? `Consider opening a short position with target at $${analysisData.shortTerm.targetPrice.toLocaleString()}.`
                        : `Hold current position or wait for stronger signals before entering.`
                    }
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="signals">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisData.signals.map((signal, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div>
                      <div className="font-medium">{signal.indicator}</div>
                      <div className="text-sm text-muted-foreground">
                        Value: {signal.value} ({signal.timeframe})
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium uppercase ${getSignalColor(signal.signal)}`}>
                        {signal.signal}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Strength: {(signal.strength * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md">
                <h4 className="font-medium mb-1">Technical Analysis</h4>
                <p className="text-sm">
                  Overall, the technical indicators show a {
                    analysisData.signals.filter(s => s.signal === 'buy').length > 
                    analysisData.signals.filter(s => s.signal === 'sell').length
                      ? 'bullish'
                      : analysisData.signals.filter(s => s.signal === 'buy').length < 
                        analysisData.signals.filter(s => s.signal === 'sell').length
                        ? 'bearish'
                        : 'neutral'
                  } bias. {
                    analysisData.signals.filter(s => s.signal === 'buy').length > 
                    analysisData.signals.filter(s => s.signal === 'sell').length
                      ? `${analysisData.signals.filter(s => s.signal === 'buy').length} of ${analysisData.signals.length} indicators are signaling buy conditions.`
                      : analysisData.signals.filter(s => s.signal === 'buy').length < 
                        analysisData.signals.filter(s => s.signal === 'sell').length
                        ? `${analysisData.signals.filter(s => s.signal === 'sell').length} of ${analysisData.signals.length} indicators are signaling sell conditions.`
                        : 'Indicators are mixed, suggesting caution.'
                  }
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="forecast">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Price Targets by Time Horizon</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Short Term</CardTitle>
                      <Badge variant="outline">1-3 Days</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {getDirectionIcon(analysisData.shortTerm.direction)}
                        <span className="ml-2 font-medium capitalize">
                          {analysisData.shortTerm.direction}
                        </span>
                      </div>
                      <div className="text-xl font-medium">
                        ${analysisData.shortTerm.targetPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        Probability: {(analysisData.shortTerm.probability * 100).toFixed(0)}%
                      </div>
                      <Progress 
                        value={analysisData.shortTerm.probability * 100} 
                        className={`h-1.5 ${getProbabilityColor(analysisData.shortTerm.probability)}`} 
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Medium Term</CardTitle>
                      <Badge variant="outline">1-2 Weeks</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {getDirectionIcon(analysisData.mediumTerm.direction)}
                        <span className="ml-2 font-medium capitalize">
                          {analysisData.mediumTerm.direction}
                        </span>
                      </div>
                      <div className="text-xl font-medium">
                        ${analysisData.mediumTerm.targetPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        Probability: {(analysisData.mediumTerm.probability * 100).toFixed(0)}%
                      </div>
                      <Progress 
                        value={analysisData.mediumTerm.probability * 100} 
                        className={`h-1.5 ${getProbabilityColor(analysisData.mediumTerm.probability)}`} 
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Long Term</CardTitle>
                      <Badge variant="outline">1-3 Months</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {getDirectionIcon(analysisData.longTerm.direction)}
                        <span className="ml-2 font-medium capitalize">
                          {analysisData.longTerm.direction}
                        </span>
                      </div>
                      <div className="text-xl font-medium">
                        ${analysisData.longTerm.targetPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        Probability: {(analysisData.longTerm.probability * 100).toFixed(0)}%
                      </div>
                      <Progress 
                        value={analysisData.longTerm.probability * 100} 
                        className={`h-1.5 ${getProbabilityColor(analysisData.longTerm.probability)}`} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <h4 className="font-medium mb-2">Forecast Methodology</h4>
                <p className="text-sm mb-2">
                  These forecasts are generated using a combination of:
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Historical price action analysis</li>
                  <li>Technical indicator confluence</li>
                  <li>Market sentiment analysis</li>
                  <li>AI pattern recognition</li>
                  <li>Volatility-adjusted probability modeling</li>
                </ul>
                <div className="text-sm text-muted-foreground mt-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Updated every 4 hours | Last update: {new Date(analysisData.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QuantitativeAnalysis;
