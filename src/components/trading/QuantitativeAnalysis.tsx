
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { QuantitativeAnalysis as QuantAnalysis } from "@/types/trading";
import { ChevronUp, ChevronDown, LineChart, BarChart2, TrendingUp, TrendingDown, MinusIcon } from "lucide-react";

const mockAnalysisData: QuantAnalysis[] = [
  {
    id: "btc-1h",
    symbol: "BTC/USD",
    timeframe: "1h",
    timestamp: "2023-04-26T16:00:00Z",
    buyProbability: 0.65,
    sellProbability: 0.25,
    holdProbability: 0.10,
    expectedValue: 280.50,
    riskRewardRatio: 2.8,
    confidenceScore: 0.75,
    signals: [
      { indicator: "RSI", value: 38, signal: 'buy', strength: 0.7, timeframe: "1h" },
      { indicator: "MACD", value: -12, signal: 'neutral', strength: 0.4, timeframe: "1h" },
      { indicator: "Moving Average", value: 92100, signal: 'buy', strength: 0.8, timeframe: "1h" },
      { indicator: "Ichimoku Cloud", value: 0, signal: 'buy', strength: 0.65, timeframe: "1h" },
      { indicator: "Volume Profile", value: 0, signal: 'buy', strength: 0.7, timeframe: "1h" },
    ],
    shortTerm: {
      direction: 'up',
      probability: 0.68,
      targetPrice: 94500,
    },
    mediumTerm: {
      direction: 'up',
      probability: 0.62,
      targetPrice: 96000,
    },
    longTerm: {
      direction: 'up',
      probability: 0.55,
      targetPrice: 98000,
    }
  },
  {
    id: "eth-1h",
    symbol: "ETH/USD",
    timeframe: "1h",
    timestamp: "2023-04-26T16:00:00Z",
    buyProbability: 0.45,
    sellProbability: 0.35,
    holdProbability: 0.20,
    expectedValue: 42.30,
    riskRewardRatio: 1.8,
    confidenceScore: 0.65,
    signals: [
      { indicator: "RSI", value: 42, signal: 'neutral', strength: 0.5, timeframe: "1h" },
      { indicator: "MACD", value: -8, signal: 'neutral', strength: 0.4, timeframe: "1h" },
      { indicator: "Moving Average", value: 3580, signal: 'buy', strength: 0.6, timeframe: "1h" },
      { indicator: "Ichimoku Cloud", value: 0, signal: 'neutral', strength: 0.5, timeframe: "1h" },
      { indicator: "Volume Profile", value: 0, signal: 'sell', strength: 0.6, timeframe: "1h" },
    ],
    shortTerm: {
      direction: 'sideways',
      probability: 0.55,
      targetPrice: 3650,
    },
    mediumTerm: {
      direction: 'up',
      probability: 0.52,
      targetPrice: 3800,
    },
    longTerm: {
      direction: 'up',
      probability: 0.58,
      targetPrice: 4200,
    }
  }
];

const QuantitativeAnalysis: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("BTC/USD");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1h");
  const [view, setView] = useState<string>("overview");
  
  const selectedData = mockAnalysisData.find(data => data.symbol === selectedSymbol && data.timeframe === selectedTimeframe);
  
  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <MinusIcon className="h-4 w-4 text-yellow-500" />;
    }
  };
  
  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'text-green-500';
      case 'sell': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantitative Analysis</CardTitle>
        <CardDescription>
          AI-powered mathematical trading probability analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-48">
            <label className="text-sm font-medium mb-1 block">Symbol</label>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger>
                <SelectValue placeholder="Select symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                <SelectItem value="ETH/USD">ETH/USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-48">
            <label className="text-sm font-medium mb-1 block">Timeframe</label>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15m">15 Minutes</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-48">
            <label className="text-sm font-medium mb-1 block">View</label>
            <Tabs value={view} onValueChange={setView} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="indicators">Indicators</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {selectedData ? (
          <div>
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Trade Direction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm font-medium mb-1">
                          <span>Buy</span>
                          <span>{(selectedData.buyProbability * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={selectedData.buyProbability * 100} className="h-2 bg-muted" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-medium mb-1">
                          <span>Sell</span>
                          <span>{(selectedData.sellProbability * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={selectedData.sellProbability * 100} className="h-2 bg-muted" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-medium mb-1">
                          <span>Hold</span>
                          <span>{(selectedData.holdProbability * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={selectedData.holdProbability * 100} className="h-2 bg-muted" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Risk/Reward</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-full space-y-2">
                      <div className="text-3xl font-bold">{selectedData.riskRewardRatio.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">Risk/Reward Ratio</div>
                      <div className={`text-sm ${selectedData.riskRewardRatio >= 2 ? 'text-green-500' : selectedData.riskRewardRatio >= 1.5 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {selectedData.riskRewardRatio >= 2 ? 'Excellent' : selectedData.riskRewardRatio >= 1.5 ? 'Good' : 'Poor'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Confidence Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-full space-y-2">
                      <div className="relative w-24 h-24">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            className="text-muted opacity-20"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            strokeDasharray={`${selectedData.confidenceScore * 283} 283`}
                            className={`${selectedData.confidenceScore > 0.7 ? 'text-green-500' : selectedData.confidenceScore > 0.5 ? 'text-yellow-500' : 'text-red-500'}`}
                            transform="rotate(-90 50 50)"
                          />
                          <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="20" fontWeight="bold">
                            {(selectedData.confidenceScore * 100).toFixed(0)}%
                          </text>
                        </svg>
                      </div>
                      <div className="text-sm text-muted-foreground">Confidence Score</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Time Horizon Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Short Term (1-3 days)</div>
                        <div className="flex items-center gap-1">
                          {getDirectionIcon(selectedData.shortTerm.direction)}
                          <span className="font-medium">{selectedData.shortTerm.direction}</span>
                        </div>
                        <div className="text-sm">{(selectedData.shortTerm.probability * 100).toFixed(0)}% probability</div>
                        {selectedData.shortTerm.targetPrice && (
                          <div className="text-sm">Target: ${selectedData.shortTerm.targetPrice.toLocaleString()}</div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Medium Term (1-2 weeks)</div>
                        <div className="flex items-center gap-1">
                          {getDirectionIcon(selectedData.mediumTerm.direction)}
                          <span className="font-medium">{selectedData.mediumTerm.direction}</span>
                        </div>
                        <div className="text-sm">{(selectedData.mediumTerm.probability * 100).toFixed(0)}% probability</div>
                        {selectedData.mediumTerm.targetPrice && (
                          <div className="text-sm">Target: ${selectedData.mediumTerm.targetPrice.toLocaleString()}</div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Long Term (1-3 months)</div>
                        <div className="flex items-center gap-1">
                          {getDirectionIcon(selectedData.longTerm.direction)}
                          <span className="font-medium">{selectedData.longTerm.direction}</span>
                        </div>
                        <div className="text-sm">{(selectedData.longTerm.probability * 100).toFixed(0)}% probability</div>
                        {selectedData.longTerm.targetPrice && (
                          <div className="text-sm">Target: ${selectedData.longTerm.targetPrice.toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="indicators" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Technical Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedData.signals.map((signal, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{signal.indicator}</div>
                          <div className="text-xs text-muted-foreground">{signal.timeframe} timeframe</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${getSignalColor(signal.signal)}`}>
                            {signal.signal.toUpperCase()}
                          </div>
                          <div className="text-xs">
                            Strength: {(signal.strength * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Expected Value Calculation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Expected Value</div>
                        <div className={`font-bold ${selectedData.expectedValue > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${Math.abs(selectedData.expectedValue).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <p>This expected value calculation is based on:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                          <li>Win probability: {(selectedData.buyProbability > selectedData.sellProbability ? selectedData.buyProbability : selectedData.sellProbability).toFixed(2) * 100}%</li>
                          <li>Risk/Reward ratio: {selectedData.riskRewardRatio.toFixed(1)}</li>
                          <li>Technical indicator consensus</li>
                          <li>Historical volatility patterns</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No analysis data available for the selected symbol and timeframe
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantitativeAnalysis;
