
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, TrendingDown, Triangle, Circle, Flag, Activity, Eye, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PatternData {
  id: string;
  name: string;
  type: "bullish" | "bearish" | "neutral";
  confidence: number;
  description: string;
  timeframe: string;
  detectedAt: string;
  symbol: string;
  completionPercentage: number;
  projectedMovement?: number;
  historicalAccuracy: number;
  relatedPatterns: string[];
  supportResistanceLevels: {
    support: number[];
    resistance: number[];
  };
}

const mockPatternData: PatternData[] = [
  {
    id: "btc-bull-flag-4h",
    name: "Bull Flag",
    type: "bullish",
    confidence: 87,
    description: "A bullish continuation pattern showing consolidation before continuing the uptrend.",
    timeframe: "4h",
    detectedAt: "2025-04-26T18:30:00Z",
    symbol: "BTC/USD",
    completionPercentage: 85,
    projectedMovement: 12.5,
    historicalAccuracy: 78,
    relatedPatterns: ["Cup and Handle", "Ascending Triangle"],
    supportResistanceLevels: {
      support: [61200, 60500],
      resistance: [62800, 63500]
    }
  },
  {
    id: "eth-double-bottom-1d",
    name: "Double Bottom",
    type: "bullish",
    confidence: 92,
    description: "A reversal pattern indicating a potential change from a downtrend to an uptrend.",
    timeframe: "1d",
    detectedAt: "2025-04-26T12:00:00Z",
    symbol: "ETH/USD",
    completionPercentage: 100,
    projectedMovement: 18.2,
    historicalAccuracy: 82,
    relatedPatterns: ["Inverse Head and Shoulders", "W Bottom"],
    supportResistanceLevels: {
      support: [3000, 2950],
      resistance: [3200, 3350]
    }
  },
  {
    id: "sol-head-shoulders-12h",
    name: "Head and Shoulders",
    type: "bearish",
    confidence: 76,
    description: "A reversal pattern indicating a potential change from an uptrend to a downtrend.",
    timeframe: "12h",
    detectedAt: "2025-04-26T00:00:00Z",
    symbol: "SOL/USD",
    completionPercentage: 90,
    projectedMovement: -15.6,
    historicalAccuracy: 71,
    relatedPatterns: ["Triple Top", "Distribution"],
    supportResistanceLevels: {
      support: [143, 138],
      resistance: [152, 158]
    }
  },
  {
    id: "link-ascending-triangle-6h",
    name: "Ascending Triangle",
    type: "bullish",
    confidence: 81,
    description: "A continuation pattern with a horizontal upper trendline and rising lower trendline.",
    timeframe: "6h",
    detectedAt: "2025-04-25T18:00:00Z",
    symbol: "LINK/USD",
    completionPercentage: 75,
    projectedMovement: 8.4,
    historicalAccuracy: 68,
    relatedPatterns: ["Bull Flag", "Symmetrical Triangle"],
    supportResistanceLevels: {
      support: [16.50, 16.20],
      resistance: [17.25, 17.80]
    }
  },
  {
    id: "xrp-falling-wedge-1d",
    name: "Falling Wedge",
    type: "bullish",
    confidence: 85,
    description: "A bullish reversal pattern with downward sloping and converging trendlines.",
    timeframe: "1d",
    detectedAt: "2025-04-24T12:00:00Z",
    symbol: "XRP/USD",
    completionPercentage: 95,
    projectedMovement: 14.2,
    historicalAccuracy: 75,
    relatedPatterns: ["Inverse Head and Shoulders", "Double Bottom"],
    supportResistanceLevels: {
      support: [0.52, 0.50],
      resistance: [0.58, 0.62]
    }
  }
];

const PatternRecognition: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSymbol, setSelectedSymbol] = useState<string>("all");
  
  const timeframes = ["all", ...Array.from(new Set(mockPatternData.map(p => p.timeframe)))];
  const symbols = ["all", ...Array.from(new Set(mockPatternData.map(p => p.symbol)))];
  
  const filteredPatterns = mockPatternData.filter(pattern => {
    const matchesTimeframe = selectedTimeframe === "all" || pattern.timeframe === selectedTimeframe;
    const matchesType = selectedType === "all" || pattern.type === selectedType;
    const matchesSymbol = selectedSymbol === "all" || pattern.symbol === selectedSymbol;
    
    return matchesTimeframe && matchesType && matchesSymbol;
  }).sort((a, b) => b.confidence - a.confidence);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Triangle className="h-5 w-5" />
          AI Pattern Recognition
        </CardTitle>
        <CardDescription>
          Machine learning-powered detection of chart patterns, support, and resistance levels
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="detected" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="detected">Detected Patterns</TabsTrigger>
            <TabsTrigger value="historical">Pattern Performance</TabsTrigger>
            <TabsTrigger value="settings">Detection Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="detected" className="space-y-5">
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Symbol</label>
                <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select symbol" />
                  </SelectTrigger>
                  <SelectContent>
                    {symbols.map(symbol => (
                      <SelectItem key={symbol} value={symbol}>
                        {symbol === "all" ? "All symbols" : symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Timeframe</label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map(timeframe => (
                      <SelectItem key={timeframe} value={timeframe}>
                        {timeframe === "all" ? "All timeframes" : timeframe}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Pattern Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pattern type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="bullish">Bullish</SelectItem>
                    <SelectItem value="bearish">Bearish</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Pattern cards */}
            <div className="space-y-4">
              {filteredPatterns.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No patterns match your filters. Try adjusting your criteria.
                </div>
              ) : (
                filteredPatterns.map(pattern => (
                  <Card key={pattern.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{pattern.name}</CardTitle>
                            <Badge variant="outline" className={
                              pattern.type === "bullish" ? "bg-green-50 text-green-700 border-green-200" :
                              pattern.type === "bearish" ? "bg-red-50 text-red-700 border-red-200" :
                              "bg-blue-50 text-blue-700 border-blue-200"
                            }>
                              {pattern.type === "bullish" ? (
                                <div className="flex items-center">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Bullish
                                </div>
                              ) : pattern.type === "bearish" ? (
                                <div className="flex items-center">
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                  Bearish
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Activity className="h-3 w-3 mr-1" />
                                  Neutral
                                </div>
                              )}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {pattern.symbol} • {pattern.timeframe} timeframe
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            Confidence: {pattern.confidence}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Historical accuracy: {pattern.historicalAccuracy}%
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{pattern.description}</p>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Pattern completion</span>
                            <span>{pattern.completionPercentage}%</span>
                          </div>
                          <Progress value={pattern.completionPercentage} className="h-1.5" />
                        </div>
                        
                        {pattern.projectedMovement && (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div>
                              <div className="text-muted-foreground">Projected movement</div>
                              <div className={`font-medium ${pattern.projectedMovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {pattern.projectedMovement >= 0 ? '+' : ''}{pattern.projectedMovement}%
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Detected at</div>
                              <div className="font-medium">
                                {new Date(pattern.detectedAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground mb-1">Support levels</div>
                            <div className="space-y-1">
                              {pattern.supportResistanceLevels.support.map((level, i) => (
                                <div key={`support-${i}`} className="flex items-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                  <span>${level.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-muted-foreground mb-1">Resistance levels</div>
                            <div className="space-y-1">
                              {pattern.supportResistanceLevels.resistance.map((level, i) => (
                                <div key={`resistance-${i}`} className="flex items-center">
                                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                  <span>${level.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="flex flex-wrap gap-2">
                        {pattern.relatedPatterns.slice(0, 2).map((related) => (
                          <Badge key={related} variant="secondary" className="text-xs">
                            {related}
                          </Badge>
                        ))}
                        {pattern.relatedPatterns.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{pattern.relatedPatterns.length - 2} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Chart
                        </Button>
                        <Button size="sm">
                          Trade <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="historical">
            <div className="text-center py-16 space-y-4">
              <h3 className="text-lg font-medium">Pattern Performance Analytics</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                View historical performance metrics for detected patterns, including success rates,
                average price movements, and optimal entry/exit points.
              </p>
              <Button>View Performance Analytics</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="text-center py-16 space-y-4">
              <h3 className="text-lg font-medium">Pattern Detection Settings</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Configure pattern detection sensitivity, minimum confidence thresholds,
                and customize notification preferences.
              </p>
              <Button>Configure Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PatternRecognition;
